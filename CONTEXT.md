# Caroninhas — Grupo · Contexto do Projeto

## Visão geral
App React de controle de caronas para um grupo fixo de 5 motoristas (Mário, Roberta, Nice, Gabriel, Rafael) que fazem o trajeto Mogi ↔ Campinas. Deploy: GitHub Pages. Dados sincronizados via Firebase Firestore.

## Arquitetura
- **Stack:** React (Babel CDN, sem build step) + Firebase v9 compat
- **Arquivo único:** `caroninhas-group.jsx` → buildar para `index.html`
- **Deploy:** GitHub Pages em `https://mariomendesf.github.io/drivers_caroninhas/`
- **Firebase:** projeto `caroninhas-group`, credenciais já embutidas no `index.html`
- **Versão atual:** v4.7

## Como buildar
O JSX **não é servido diretamente** — precisa ser embutido num skeleton HTML:

```python
with open('caroninhas-group.jsx', 'r') as f:
    src = f.read()
src_build = src.replace('import { useState, useEffect } from "react";\n\n', '')
src_build = src_build.replace('export default function App()', 'function App()')

skeleton = open('skeleton.html').read()  # ou montar inline
indented = '\n'.join('    ' + line for line in src_build.splitlines())
html_new = skeleton.replace('APPCODE', indented)

with open('index.html', 'w') as f:
    f.write(html_new)
```

O skeleton HTML inclui: React 18, ReactDOM, Babel standalone, Firebase v9 compat, Google Fonts (Barlow), e o bloco de config do Firebase. O ponto de injeção é `APPCODE` dentro do `<script type="text/babel">`.

**CRÍTICO:** nunca deixar `const root = ReactDOM.createRoot(...)` dentro do JSX — isso causa erro de declaração duplicada. O `root` só existe no skeleton.

## Estrutura do código (caroninhas-group.jsx)

### Constantes e helpers globais
- `PRICE = 20` — preço padrão por trecho
- `DEF_GAS, DEF_TOLL` — defaults de custo do carro
- `ADMIN_ID = "d1"` — Mário, tem acesso a backup, zona de perigo, pix da mãe
- `GROUP_DRIVERS` — array fixo dos 5 motoristas com id, name, pix
- `C` — objeto de cores (tema escuro)
- `TR` — objeto de traduções PT/EN com função `mkT(lang)` gerando `t(key)`

### Funções de cálculo (puras, sem side effects)
- `calcBalances(trips, myId)` — retorna `{ driverNet, paxRecv, paxRecvd }` pela perspectiva de `myId`. `settledByRide` conta como pago.
- `calcRideCredits(allTrips, myId)` — retorna `{ [otherId]: N_trechos }` — créditos de trechos que myId ganhou levando outros em viagens ainda não resolvidas
- `calcCashFlow(allTrips, myId)` — fluxo por semana
- `calcCashFlowTotals(allTrips, myId)` — totais gerais
- `netPending(dn)` — `(theyOwe - theyOwePaid) - (iOwe - iOwePaid)`
- `paxPrice(p)`, `paxMult(p, tripDir)`, `tripPrice(t)`, `carCostTotal(t)`

### Componentes principais
- `App` — raiz, gerencia auth state (`myId`, `unlocked`), sync Firebase/localStorage
- `DriverSelector` / `LockScreen` — tela de login com senha `0000`
- `Home` — tela inicial com cards de viagem por semana, navegação entre semanas, banner de viagens pendentes de confirmação
- `AddTrip` — formulário de registro (motorista ou passageiro)
- `Saldos` — tela de saldos com créditos de trechos e botão "Quitar c/ carona"
- `Extrato` — wrapper de `Saldos` com `initialView="extrato"`
- `TripCard` — card de viagem (passageiro ou motorista)
- `Opcoes` — configurações de perfil, gastos do carro, backup (admin), pix da mãe (admin)
- `Nav` — barra de navegação inferior
- `ProfileChip` — chip de nome no canto superior direito (sem interação)
- `CopyPixMaeBtn`, `PixMaeCard` — componentes de pix da mãe (admin only)

### Estado global (`st`)
```js
{
  done: true,
  drivers: GROUP_DRIVERS,          // array de 5 motoristas
  trips: [],                       // todas as viagens
  driverCarCosts: {},              // { [dId]: { gas, toll } } por motorista
  pixMae: "",                      // pix da mãe (admin only)
  lang: "pt",
}
```

### Modelo de dados — Trip
```js
{
  id, date, weekStart, direction,  // "ida" | "volta" | "ambas"
  role: "motorista",               // sempre motorista no novo modelo
  createdAt, registeredBy,         // quem registrou
  pendingConfirmation?,            // true se aguarda confirmação do motorista
  driverOwnerId?,                  // motorista real (quando registrado por passageiro)
  passengers: [{
    id, name, driverId?,           // driverId = id do motorista do grupo (ou "__custom__")
    paid, price?,
    direction?,                    // trecho deste passageiro (override)
    settledByRide?,                // true | "partial" — quitado com crédito de carona
    paidByDebtor?,                 // true — devedor declarou que pagou (aguarda confirmação do credor)
    paidRejected?,                 // true — credor rejeitou a declaração de pagamento
  }],
  carCost?: { gas, toll, paid },
  note?, notePublic?,              // notePublic: visível para todos se true
}
```

## Lógica de créditos de trechos (v4.0+)
- **Acumulação:** `calcRideCredits` varre todas as viagens confirmadas. Para cada viagem onde `registeredBy === myId`, conta os passageiros ainda não resolvidos (`!paid && !settledByRide`). 1 trecho = 1 ida ou 1 volta. "ambas" = 2 trechos.
- **Quitação:** devedor clica "Quitar c/ carona" na tela Saldos. O sistema consome créditos FIFO (mais antigas primeiro) das viagens de crédito e marca a dívida como `settledByRide: true` ou `"partial"`.
- **Simetria (Opção A):** ao consumir crédito da viagem X para pagar dívida Y, X é marcada como `settledByRide` do lado do credor também.
- **Undo:** botão "Desfazer" na linha quitada restaura `settledByRide` dos dois lados.
- **Sem lógica automática:** não há mais `isCancelledByRide` automático. A label "quitado c/ carona" só aparece via ação explícita do usuário.

## Fluxo de pagamento bilateral (v4.5+)
- **Devedor pode declarar pagamento:** botão "Marcar pago" nas viagens motorista onde ele é passageiro de grupo. Seta `p.paidByDebtor = true`.
- **Efeito no saldo do devedor:** `calcBalances` conta `paidByDebtor` em `iOwePaid` apenas do lado do devedor → dívida some do saldo dele imediatamente.
- **Credor vê alerta:** quando `p.paidByDebtor && !p.paid`, o credor vê "_Nome_ disse que pagou" com dois botões: "Recebi ✓" e "Não recebi".
  - Confirmar → `p.paid = true` (finalizado para ambos)
  - Rejeitar → `p.paidByDebtor = false, p.paidRejected = true` → dívida volta para o devedor com label "⚠️ Não confirmado" em vermelho
- **Assimetria intencional:** `theyOwePaid` do credor só sobe com `p.paid` (confirmação real), nunca com `paidByDebtor`.
- Implementado em `TripCard` (lista de passageiros) e `Saldos` (seções iOweTrips e theyOweTrips).

## Navegação de semanas (v4.5+)
- A Home calcula `maxWeek = max(weekStart de todas as viagens, thisWeek)`.
- O botão "›" fica habilitado enquanto `viewWeek < maxWeek` — ou seja, é possível navegar para semanas futuras se houver pelo menos uma viagem registrada nelas.

## Regras de negócio importantes
- **Uma viagem por dia por motorista** — duplicate check por `(date, effectiveDriver)`
- **Viagens sempre "Ida e Volta"** para motoristas do grupo — seletor de trecho só para motorista avulso
- **Passageiro pode registrar em nome de motorista** → cria viagem `pendingConfirmation: true`; motorista confirma, edita ou recusa
- **Custo do carro:** isolado por motorista, não entra nos saldos entre passageiros. Toggle "Já paguei" só para ADMIN_ID.
- **Backup** só para ADMIN_ID. **Zona de perigo** (deletar tudo) só para ADMIN_ID.
- **Trocar perfil:** 3 cliques no card "Meu perfil" em Opções (sem feedback visual)
- **Nota privada/pública:** `notePublic: false` (default) = só o `registeredBy` vê. `notePublic: true` = todos veem.
- **Limite de passageiros:** max 4 por trecho (ida ou volta). Passageiro que registra conta como 1 em seu próprio trecho.
- **Passageiros únicos:** cada motorista do grupo pode aparecer no máximo 1x como passageiro numa viagem. O motorista da viagem não pode ser adicionado como passageiro.
- **Viagens só podem ser registradas após acontecerem (v4.7+):** motoristas não-admin não podem registrar viagem própria com data futura. `TRIP_CUTOFF_HOUR = 19` — o dia de hoje só libera para registro a partir das 19h local (`maxRegistrableDate()`); antes disso o limite é o dia anterior. ADMIN_ID é isento dessa regra. Viagens registradas em nome de outro motorista (`pendingConfirmation`) são isentas — podem ser registradas com antecedência ou durante o trajeto. Porém o motorista dono da viagem só pode **confirmar** essa viagem a partir das 19h do dia em que ela ocorreu (`canConfirmTripNow()`); antes disso, o botão de confirmar exibe um toast pedindo para aguardar. ADMIN_ID também é isento dessa restrição de confirmação.

## Permissões por perfil
| Ação | Quem |
|------|------|
| Editar/deletar viagem confirmada | `registeredBy === myId` |
| Deletar viagem pendente | `registeredBy === myId` (quem registrou) |
| Editar custo do carro ao confirmar | `driverOwnerId === myId` |
| Toggle "Já paguei" custo carro | ADMIN_ID apenas |
| Marcar passageiro como recebido | `registeredBy === myId` |
| Declarar que pagou (paidByDebtor) | O próprio passageiro (`p.driverId === myId`) |
| Confirmar/rejeitar pagamento declarado | `registeredBy === myId` (o motorista) |
| Backup e zona de perigo | ADMIN_ID apenas |
| Ver crédito de trechos e quitar | Qualquer motorista na sua perspectiva |
| Desfazer quitação com carona | Quem quitou (myId no momento da ação) |

## Convenções de código
- Incrementar versão a cada entrega no TR: `price_per_stretch_label` e `opts_version`
- Patches pequenos: `4.1.1`, mudanças maiores: `4.2`, grandes refatorações: `5.0`
- Nunca usar `useState` dentro de funções anônimas no render — extrair em componentes
- Funções helper puras antes dos componentes React
- Cores sempre via `C.xxx` (nunca hardcoded exceto C.amber `#F5A623`)
- `t("key")` para todo texto visível ao usuário
- `ADMIN_ID` para qualquer lógica exclusiva do Mário

## Contexto pessoal do Mário (para decisões de UX)
- Mário = d1, é o admin e o único com acesso ao backup
- O grupo tem 5 motoristas fixos: Mário (d1), Roberta (d2), Nice (d3), Gabriel (d4), Rafael (d5)
- Trajeto: Mogi ↔ Campinas
- O app é usado no celular, priorize UX mobile
- O chip de nome (ProfileChip) no topo pode ser removido quando o app for para produção
