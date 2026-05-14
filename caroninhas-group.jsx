import { useState, useEffect } from "react";



// ═══════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════
const PRICE = 20;
const KEY = "caronas-grupo-v1";
const DEF_GAS  = 70;
const DEF_TOLL = 35.20;
const uid = () => Math.random().toString(36).slice(2, 9);
const todayStr = () => new Date().toISOString().split("T")[0];

function getMonday(s) {
  const d = new Date(s + "T12:00:00");
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d.toISOString().split("T")[0];
}

function fmtShort(s) {
  const [, m, d] = s.split("-");
  return `${d}/${m}`;
}
function fmtFull(s) {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}
const WEEKDAYS_PT = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const WEEKDAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function weekday(s, lang) {
  const d = new Date(s + "T12:00:00");
  return (lang === "en" ? WEEKDAYS_EN : WEEKDAYS_PT)[d.getDay()];
}

// ═══════════════════════════════════════════
//  TRANSLATIONS
// ═══════════════════════════════════════════
const TR = {
  pt: {
    // Nav
    nav_home: "Início", nav_add: "Registrar", nav_saldos: "Saldos", nav_extratos: "Extratos", nav_opts: "Opções",
    // Setup
    setup_title: "Caroninhas\nGrupo", setup_subtitle: "Configure os motoristas do grupo pra começar.\nVocê pode editar isso depois nas configurações.",
    setup_you: "Você", setup_your_name: "Seu nome", setup_other_drivers: "Outros Motoristas",
    setup_optional: "(opcional, pode preencher depois)", setup_driver_n: (n) => `Motorista ${n}`, setup_go: "VAMOS LÁ →",
    // Home
    home_week: (n) => `SEMANA ${n}`, home_current_badge: "ATUAL",
    home_back_to_current: "voltar para semana atual",
    home_trips_n: (n) => `${n} ${n === 1 ? "viagem" : "viagens"}`,
    home_owe: "Devo", home_to_receive: "A receber",
    home_to_drivers: "para motoristas", home_from_pax: "dos passageiros",
    home_all_paid: "Tudo pago ✓", home_all_received: "Tudo recebido ✓",
    home_cancelled_ride: "Quitado com carona ✓",
    home_register: "+ Registrar Viagem",
    home_trips_this_week: "Viagens desta semana", home_trips_week: "Viagens da semana",
    home_empty: "Nenhuma viagem nesta semana",
    // AddTrip
    add_back: "← Voltar", add_title: "Registrar Viagem",
    add_date: "Data", add_leg: "Trecho",
    add_leg_there: "Ida →", add_leg_back: "← Volta", add_leg_both: "Ida e Volta",
    add_leg_both_note: (v) => `↑ Vale por 2 trechos = ${v}`,
    add_role: "Você foi...", add_passenger: "🪑 Fui de carona", add_driver: "🚗 Fui motorista",
    add_who_drove: "Quem foi motorista?", add_other_driver: "Outro (digitar nome)",
    add_driver_name_ph: "Nome de quem dirigiu",
    add_price_per_leg: "Valor por trecho", add_custom_price: "valor customizado",
    add_already_paid: (v) => `Já paguei ${v}`,
    add_passengers: "Passageiros",
    add_pax_select_ph: "— Nome do passageiro —",
    add_pax_other: "Outro (digitar)", add_pax_name_ph: (n) => `Nome do passageiro ${n}`,
    add_pax_name_free_ph: "Nome do passageiro",
    add_per_leg_total: (v) => `/trecho · total ${v}`,
    add_paid_label: "pago",
    add_add_pax: "+ Adicionar passageiro",
    add_pax_limit: "Limite de 4 passageiros por viagem",
    add_total_receive: (v) => `Total a receber: ${v}`,
    add_car_cost: "⛽ Gastos com o carro", add_car_cost_sub: "Combustível + pedágio",
    add_include_car_cost: "Incluir custo do carro",
    add_fuel: "Combustível", add_toll: "Pedágio",
    add_car_cost_paid: "Já paguei",
    add_car_total: (v) => `Total carro: ${v}`,
    add_note: "Observação", add_note_ph: "Ex: carro diferente, saída atrasada…",
    add_chars_left: (n) => `${n} caracteres restantes`,
    add_save: "SALVAR", add_duplicate: "Já existe uma viagem nessa data.",
    // TripCard
    trip_driver: "Motorista", trip_passenger: "Carona",
    trip_edit_date: "Editar data", trip_save: "OK", trip_cancel: "✕",
    trip_no_passengers: "Nenhum passageiro",
    trip_paid_label: "pago", trip_pending_label: "pendente",
    trip_quitado: "quitado c/ carona ✓",
    trip_partial_ride: "parcialmente quitado c/ carona",
    settle_with_ride: "Quitar c/ carona",
    undo_settle: "Desfazer",
    note_visible_label: "Visível para todos",
    note_visible_hint: "Só você verá esta observação",
    note_public_hint: "Todos os motoristas verão",
    add_note_public: "Observação pública",
    ride_credits: (n) => `${n} trecho${n !== 1 ? "s" : ""} de crédito`,
    ride_credits_with: (n, name) => `${n} trecho${n !== 1 ? "s" : ""} com ${name}`,
    trip_mark_paid: "Marcar pago",  trip_undo_paid: "✓ Pago",
    trip_mark_received: "Marcar recebido", trip_received: "✓ Recebido",
    trip_quitado_btn: "🤝 Quitado c/ carona",
    trip_counter_ok: "tudo certo ✓",
    trip_paid_count: (a, b) => `${a}/${b} pagaram`,
    trip_car_cost: "⛽ Custo do carro",
    trip_fuel_toll: (g, t2) => `⛽ ${g} + 🛣️ ${t2}`,
    trip_car_paid: "✓ pago",
    trip_pay_car: "Paguei ✓", trip_undo_car: "Desfazer",
    trip_delete: "🗑️ Apagar viagem",
    trip_edit_pax: "✏️ Editar passageiros",
    trip_pax_save: "Salvar",
    trip_pax_cancel: "Cancelar",
    trip_pax_remove: "✕",
    trip_add_pax: "+ Adicionar passageiro",
    trip_pax_price_ph: "R$/trecho",
    trip_pax_limit: "Máx 4 passageiros",
    trip_pix_driver: (name) => `Pix de ${name}`,
    trip_copy_pix: "📋 Copiar Pix",
    trip_pix_copied: (name) => `✓ Pix de ${name} copiado!`,
    trip_duplicate_date: "Já existe uma viagem nessa data",
    // Saldos
    balance_with_drivers: "Saldo com motoristas",
    rode_with: (name) => `Você foi de carona com ${name}`,
    drove_for: (name) => `${name} foi de carona com você`,
    paid_label_short: "✓ pago",
    received_label_short: "✓ recebido",
    carona_with: (name) => `com ${name}`,
    leg_label: "/trecho",
    pct_covered: (pct) => `${pct}% dos custos coberto pelos passageiros`,
    paid_short: (v) => `${v} pago`,
    pending_short: (v) => `${v} pendente`,
    received_short: (v) => `${v} recebido`,
    cancelled_carona_short: (v) => `+${v} quitado c/ carona`,
    no_trips_week: "Nenhuma viagem esta semana",
    no_trips_any: "Nenhuma viagem registrada",
    pax_label: (n) => `${n} passageiro${n !== 1 ? "s" : ""}`,
    stretch_per: "/trecho",
    total_car_label: "Total carro",
    price_per_stretch: "Valor por trecho",
    already_paid: "Já paguei",
    invalid_format: "Formato inválido",
    your_pix_ph: "Seu pix (opcional)",
    other_pix_ph: "CPF, e-mail, telefone...",
    car_cost_sub2: "Valores padrão ao registrar como motorista.",
    price_per_stretch_label: (v) => `v4.4 · Preço por trecho: ${v}`,
    saldos_title: "Saldos",
    saldos_tab_balances: "💰 Saldos", saldos_tab_extratos: "📊 Extratos",
    saldos_this_week: "Esta semana", saldos_all: "Geral",
    saldos_net_owe: "Saldo líquido devo", saldos_to_receive: "A receber",
    saldos_they_owe: (v) => `me devem ${v}`,
    saldos_i_owe: (v) => `devo ${v}`,
    saldos_quites: "QUITES ✓", saldos_no_trips: "Sem viagens esta semana",
    saldos_pax_others: "Passageiros avulsos",
    saldos_pax_paid: (a, b) => `${a} de ${b} pago`,
    saldos_copy_pix: "📋 Pix",
    saldos_pix_copied: "✓ Copiado!",
    // Extrato
    extrato_total_label: "Acumulado total",
    extrato_paid_rides: "Paguei caronas", extrato_received: "Recebi",
    extrato_pending_paid: (v) => `+${v} pendente de pagamento`,
    extrato_pending_receive: (v) => `+${v} a receber`,
    extrato_cancelled_ride: (v) => `+${v} quitado c/ carona`,
    extrato_mom: "⛽ Gastos com o carro",
    extrato_days_driver: (n) => `${n} dia${n !== 1 ? "s" : ""} como motorista · total`,
    extrato_pay: "Paguei ✓", extrato_undo: "Desfazer",
    extrato_monthly: "Fluxo por mês",
    extrato_by_week: "Por semana",
    extrato_badge_current: "ATUAL",
    extrato_badge_paid: "PAGO ✓",
    extrato_badge_pending: "PENDENTE",
    extrato_badge_quitado: "QUITADO COM CARONA ✓",
    extrato_week_spent: "Paguei", extrato_week_earned: "Recebi",
    extrato_week_car: "⛽ Carro",
    extrato_week_net: "Saldo",
    extrato_empty: "Nenhum pagamento registrado ainda",
    extrato_month_spent: (v) => `Paguei ${v}`,
    extrato_month_received: (v) => `(${v} recebido)`,
    extrato_month_car: (v) => `⛽ Carro ${v}`,
    extrato_month_net: (v) => `Saldo ${v}`,
    extrato_month_trips: (n) => `${n} viage${n !== 1 ? "ns" : "m"}`,
    // Hist
    hist_title: "Histórico",
    hist_trips_n: (n) => `${n} ${n === 1 ? "viagem" : "viagens"}`,
    hist_to_receive: (v) => `+${v} a receber`,
    hist_zeroed: "✓ Zerado",
    hist_empty: "Nenhuma viagem registrada ainda",
    // Opcoes
    opts_title: "Opções",
    opts_drivers: "Motoristas do grupo",
    opts_you_label: "Você (motorista 1)",
    opts_your_name: "Seu nome",
    opts_pix: "Chave Pix",
    opts_driver_n: (n) => `Motorista ${n}`,
    opts_driver_name_ph: (n) => `Nome do motorista ${n}`,
    opts_save_drivers: "Salvar Pix", opts_saved: "✓ Salvo!",
    opts_car_cost: "⛽ Gastos com o carro",
    opts_car_cost_sub: "Valores padrão ao registrar como motorista.",
    opts_fuel: "Combustível", opts_toll: "Pedágio",
    opts_car_total: "Total por dia como motorista:",
    opts_save_car: "Salvar valores padrão",
    opts_backup: "Backup de dados",
    opts_export: "⬇️ Exportar backup (.json)",
    opts_import: "⬆️ Importar backup (.json)",
    opts_import_ok: "✓ Dados restaurados com sucesso!",
    opts_import_err: "Arquivo inválido. Use um backup gerado por este app.",
    opts_backup_note: "Exporte regularmente para não perder dados se trocar de celular ou limpar o cache do navegador.",
    opts_language: "Idioma",
    opts_danger: "Zona de perigo",
    opts_delete_btn: "🗑️ Apagar todas as viagens",
    opts_delete_confirm: "Digite a senha para confirmar:",
    opts_delete_pass_ph: "Senha",
    opts_delete_wrong: "Senha incorreta",
    opts_delete_do: "Apagar tudo",
    opts_version: "Caroninhas — Grupo v4.4",
    opts_firebase_ok: "☁️ Firebase conectado",
    opts_firebase_off: "⚠️ Firebase offline — dados só neste dispositivo",
    // Lock
    lock_subtitle: "Grupo de caronas",
    lock_ph: "Senha", lock_wrong: "Senha incorreta", lock_enter: "Entrar",
    // Loading
    loading: "Carregando…",
    badge_pending_trip: "Aguardando confirmação",
    badge_confirmed_trip: "Viagem registrada",
    driver_label: "Motorista",
    edit_confirm_btn: "Editar e confirmar",
    add_car_cost_later: "Adicionar custo do carro",
    passengers_in_car: "Passageiros nesse carro",
    including_you: "(incluindo você)",
    sign_out: "Trocar perfil",
    sign_out_confirm: "Você será desconectado. Continuar?",
    who_are_you: "Quem é você?",
    who_subtitle: "Selecione seu perfil para entrar.",
    enter_password: "Digite sua senha",
    pass_first_login: "Primeira vez? Crie sua senha",
    pass_set_title: "Crie sua senha",
    pass_set_sub: "A senha padrão foi detectada. Defina uma senha pessoal para continuar.",
    pass_new_ph: "Nova senha",
    pass_confirm_ph: "Confirme a senha",
    pass_set_btn: "Definir senha",
    pass_mismatch: "As senhas não coincidem",
    pass_too_short: "Mínimo 4 caracteres",
    pass_too_long: "Máximo 8 caracteres",
    pass_length_hint: "Entre 4 e 8 caracteres",
    admin_pass_title: "Senhas dos motoristas",
    admin_pass_reset_btn: "Resetar senha",
    admin_pass_reset_confirm: "Resetar senha de",
    admin_pass_reset_do: "Confirmar reset",
    admin_pass_reset_done: "Senha resetada ✓",
    admin_pass_status_set: "senha personalizada",
    admin_pass_status_default: "senha padrão (0000)",
    new_trips_badge: (n) => `${n} nova${n !== 1 ? "s" : ""} viagem${n !== 1 ? "ns" : ""} esta semana`,
    new_trips_btn: "Ver viagens",
    pending_confirm_title: "Aguardando sua confirmação",
    pending_confirm_sub: (name) => `Registrada por ${name}`,
    confirm_btn: "Confirmar",
    reject_btn: "Recusar",
    trip_confirmed: "✓ Confirmada",
    all_clear: "Tudo zerado!",
    real_cost: "Custo real",
    save_btn: "Salvar ✓",
    car_cost_editor_title: "⛽ Gastos com o carro",
    no_car_cost: "Sem custo do carro",
    edit_label: "✏️ Editar",
    add_car_cost_btn: "+ Custo carro",
    you_rode_amount: (v) => `Você rodou ${v} com ele(a)`,
    they_rode_amount: (v) => `Ele(a) rodou ${v} com você`,
    you_owe_them: (name) => `você deve a ${name}`,
    they_owe_you: (name) => `${name} te deve`,
    balance_you_owe: "Saldo: você ainda deve",
    balance_they_owe: (name) => `Saldo: ${name} ainda te deve`,
    car_cost_short: "Gastos carro",
    copy_pix_btn: "📋 Copiar Pix",
    by_week_label: "Por semana",
    drivers_group_label: "Motoristas do grupo",
    driver_n_ph: (n) => `Motorista ${n}`,
    delete_all_trips: "🗑️ Apagar todas as viagens",
    confirm_delete_title: "Confirmar exclusão",
    round_plus: "Ida+Volta",
    days_as_driver: (n, v) => `${n} dia${n !== 1 ? "s" : ""} como motorista · total ${v}`,
    cancel_btn: "Cancelar",
    enter_btn: "Entrar",
  },
  en: {
    nav_home: "Home", nav_add: "Register", nav_extratos: "Finances", nav_hist: "History", nav_opts: "Settings",
    setup_title: "Carpools\nMogi ↔ Campinas", setup_subtitle: "Set up the group's drivers to get started.\nYou can edit this later in settings.",
    setup_you: "You", setup_your_name: "Your name", setup_other_drivers: "Other Drivers",
    setup_optional: "(optional, can fill in later)", setup_driver_n: (n) => `Driver ${n}`, setup_go: "LET'S GO →",
    home_week: (n) => `WEEK ${n}`, home_current_badge: "CURRENT",
    home_back_to_current: "back to current week",
    home_trips_n: (n) => `${n} ${n === 1 ? "trip" : "trips"}`,
    home_owe: "I Owe", home_to_receive: "To Receive",
    home_to_drivers: "to drivers", home_from_pax: "from passengers",
    home_all_paid: "All paid ✓", home_all_received: "All received ✓",
    home_cancelled_ride: "Settled by ride ✓",
    home_register: "+ Register Trip",
    home_trips_this_week: "This week's trips", home_trips_week: "Week's trips",
    home_empty: "No trips this week",
    add_back: "← Back", add_title: "Register Trip",
    add_date: "Date", add_leg: "Stretch",
    add_leg_there: "Departure →", add_leg_back: "← Return", add_leg_both: "Round Trip",
    add_leg_both_note: (v) => `↑ Counts as 2 stretches = ${v}`,
    add_role: "You were...", add_passenger: "🪑 I was a passenger", add_driver: "🚗 I was the driver",
    add_who_drove: "Who was the driver?", add_other_driver: "Other (type name)",
    add_driver_name_ph: "Name of driver",
    add_price_per_leg: "Price per stretch", add_custom_price: "custom price",
    add_already_paid: (v) => `Already paid ${v}`,
    add_passengers: "Passengers",
    add_pax_select_ph: "— Passenger name —",
    add_pax_other: "Other (type)", add_pax_name_ph: (n) => `Passenger ${n} name`,
    add_pax_name_free_ph: "Passenger name",
    add_per_leg_total: (v) => `/stretch · total ${v}`,
    add_paid_label: "paid",
    add_add_pax: "+ Add passenger",
    add_pax_limit: "Max 4 passengers per trip",
    add_total_receive: (v) => `Total to receive: ${v}`,
    add_car_cost: "⛽ Car expenses", add_car_cost_sub: "Fuel + toll",
    add_include_car_cost: "Include car cost",
    add_fuel: "Fuel", add_toll: "Toll",
    add_car_cost_paid: "Already paid",
    add_car_total: (v) => `Car total: ${v}`,
    add_note: "Note", add_note_ph: "E.g. different car, late departure…",
    add_chars_left: (n) => `${n} characters left`,
    add_save: "SAVE", add_duplicate: "A trip already exists on this date.",
    trip_driver: "Driver", trip_passenger: "Passenger",
    trip_edit_date: "Edit date", trip_save: "OK", trip_cancel: "✕",
    trip_no_passengers: "No passengers",
    trip_paid_label: "paid", trip_pending_label: "pending",
    trip_quitado: "settled by ride ✓",
    trip_partial_ride: "partial ride settlement",
    settle_with_ride: "Settle with ride",
    undo_settle: "Undo",
    note_visible_label: "Visible to all",
    note_visible_hint: "Only you will see this note",
    note_public_hint: "All drivers will see",
    add_note_public: "Public note",
    ride_credits: (n) => `${n} stretch${n !== 1 ? "es" : ""} credit`,
    ride_credits_with: (n, name) => `${n} stretch${n !== 1 ? "es" : ""} credit with ${name}`,
    trip_mark_paid: "Mark paid", trip_undo_paid: "✓ Paid",
    trip_mark_received: "Mark received", trip_received: "✓ Received",
    trip_quitado_btn: "🤝 Settled by ride",
    trip_counter_ok: "all good ✓",
    trip_paid_count: (a, b) => `${a}/${b} paid`,
    trip_car_cost: "⛽ Car cost",
    trip_fuel_toll: (g, t2) => `⛽ ${g} + 🛣️ ${t2}`,
    trip_car_paid: "✓ paid",
    trip_pay_car: "Paid ✓", trip_undo_car: "Undo",
    trip_delete: "🗑️ Delete trip",
    trip_edit_pax: "✏️ Edit passengers",
    trip_pax_save: "Save",
    trip_pax_cancel: "Cancel",
    trip_pax_remove: "✕",
    trip_add_pax: "+ Add passenger",
    trip_pax_price_ph: "R$/stretch",
    trip_pax_limit: "Max 4 passengers",
    trip_pix_driver: (name) => `${name}'s Pix`,
    trip_copy_pix: "📋 Copy Pix",
    trip_pix_copied: (name) => `✓ ${name}'s Pix copied!`,
    trip_duplicate_date: "A trip already exists on this date",
    balance_with_drivers: "Balance with drivers",
    rode_with: (name) => `You rode with ${name}`,
    drove_for: (name) => `${name} rode with you`,
    paid_label_short: "✓ paid",
    received_label_short: "✓ received",
    carona_with: (name) => `with ${name}`,
    leg_label: "/stretch",
    pct_covered: (pct) => `${pct}% of costs covered by passengers`,
    paid_short: (v) => `${v} paid`,
    pending_short: (v) => `${v} pending`,
    received_short: (v) => `${v} received`,
    cancelled_carona_short: (v) => `+${v} settled by ride`,
    no_trips_week: "No trips this week",
    no_trips_any: "No trips recorded",
    pax_label: (n) => `${n} passenger${n !== 1 ? "s" : ""}`,
    stretch_per: "/stretch",
    total_car_label: "Car total",
    price_per_stretch: "Price per stretch",
    already_paid: "Already paid",
    invalid_format: "Invalid format",
    your_pix_ph: "Your pix (optional)",
    other_pix_ph: "CPF, email, phone...",
    car_cost_sub2: "Default values when registering as driver.",
    price_per_stretch_label: (v) => `v4.0 · Price per stretch: ${v}`,
    saldos_title: "Balances",
    saldos_tab_balances: "💰 Balances", saldos_tab_extratos: "📊 Finances",
    saldos_this_week: "This week", saldos_all: "All time",
    saldos_net_owe: "Net balance I owe", saldos_to_receive: "To Receive",
    saldos_they_owe: (v) => `owe me ${v}`,
    saldos_i_owe: (v) => `I owe ${v}`,
    saldos_quites: "SETTLED ✓", saldos_no_trips: "No trips this week",
    saldos_pax_others: "Other passengers",
    saldos_pax_paid: (a, b) => `${a} of ${b} paid`,
    saldos_copy_pix: "📋 Pix",
    saldos_pix_copied: "✓ Copied!",
    extrato_total_label: "All-time total",
    extrato_paid_rides: "Paid for rides", extrato_received: "Received",
    extrato_pending_paid: (v) => `+${v} pending payment`,
    extrato_pending_receive: (v) => `+${v} to receive`,
    extrato_cancelled_ride: (v) => `+${v} settled by ride`,
    extrato_mom: "⛽ Car expenses",
    extrato_days_driver: (n) => `${n} day${n !== 1 ? "s" : ""} as driver · total`,
    extrato_pay: "Paid ✓", extrato_undo: "Undo",
    extrato_monthly: "Monthly flow",
    extrato_by_week: "By week",
    extrato_badge_current: "CURRENT",
    extrato_badge_paid: "PAID ✓",
    extrato_badge_pending: "PENDING",
    extrato_badge_quitado: "SETTLED BY RIDE ✓",
    extrato_week_spent: "Spent", extrato_week_earned: "Earned",
    extrato_week_car: "⛽ Car",
    extrato_week_net: "Net",
    extrato_empty: "No payments recorded yet",
    extrato_month_spent: (v) => `Paid ${v}`,
    extrato_month_received: (v) => `(${v} received)`,
    extrato_month_car: (v) => `⛽ Car ${v}`,
    extrato_month_net: (v) => `Net ${v}`,
    extrato_month_trips: (n) => `${n} trip${n !== 1 ? "s" : ""}`,
    hist_title: "History",
    hist_trips_n: (n) => `${n} ${n === 1 ? "trip" : "trips"}`,
    hist_to_receive: (v) => `+${v} to receive`,
    hist_zeroed: "✓ Settled",
    hist_empty: "No trips recorded yet",
    opts_title: "Settings",
    opts_drivers: "Group drivers",
    opts_you_label: "You (driver 1)",
    opts_your_name: "Your name",
    opts_pix: "Pix key",
    opts_driver_n: (n) => `Driver ${n}`,
    opts_driver_name_ph: (n) => `Driver ${n} name`,
    badge_pending_trip: "Awaiting confirmation",
    badge_confirmed_trip: "Confirmed trip",
    driver_label: "Driver",
    opts_save_drivers: "Save Pix", opts_saved: "✓ Saved!",
    opts_car_cost: "⛽ Car expenses",
    opts_car_cost_sub: "Default values when registering as driver.",
    opts_fuel: "Fuel", opts_toll: "Toll",
    opts_car_total: "Daily total as driver:",
    opts_save_car: "Save default values",
    opts_backup: "Data backup",
    opts_export: "⬇️ Export backup (.json)",
    opts_import: "⬆️ Import backup (.json)",
    opts_import_ok: "✓ Data restored successfully!",
    opts_import_err: "Invalid file. Use a backup generated by this app.",
    opts_backup_note: "Export regularly to avoid losing data if you switch phones or clear browser cache.",
    opts_language: "Language",
    opts_danger: "Danger zone",
    opts_delete_btn: "🗑️ Delete all trips",
    opts_delete_confirm: "Enter password to confirm:",
    opts_delete_pass_ph: "Password",
    opts_delete_wrong: "Wrong password",
    opts_delete_do: "Delete everything",
    opts_version: "Caroninhas Group v4.0",
    opts_firebase_ok: "☁️ Firebase connected",
    opts_firebase_off: "⚠️ Firebase offline — data only on this device",
    lock_subtitle: "Grupo de caronas",
    lock_ph: "Password", lock_wrong: "Wrong password", lock_enter: "Enter",
    all_clear: "All clear!",
    real_cost: "Real cost",
    save_btn: "Save ✓",
    car_cost_editor_title: "⛽ Car expenses",
    no_car_cost: "No car cost",
    edit_label: "✏️ Edit",
    add_car_cost_btn: "+ Car cost",
    you_rode_amount: (v) => `You rode ${v} with them`,
    they_rode_amount: (v) => `They rode ${v} with you`,
    you_owe_them: (name) => `you owe ${name}`,
    they_owe_you: (name) => `${name} owes you`,
    balance_you_owe: "Balance: you still owe",
    balance_they_owe: (name) => `Balance: ${name} still owes you`,
    car_cost_short: "Car expenses",
    copy_pix_btn: "📋 Copy Pix",
    by_week_label: "By week",
    drivers_group_label: "Group drivers",
    driver_n_ph: (n) => `Driver ${n}`,
    delete_all_trips: "🗑️ Delete all trips",
    confirm_delete_title: "Confirm deletion",
    round_plus: "Rnd+Trip",
    days_as_driver: (n, v) => `${n} day${n !== 1 ? "s" : ""} as driver · total ${v}`,
    cancel_btn: "Cancel",
    enter_btn: "Sign in",
    saldo_section: "Detailed balance",
    gross_amounts: "Gross amounts",
    your_total: "Your total costs",
    their_total: "Their total",
    loading: "Loading…",
    pass_first_login: "First time? Create your password",
    pass_set_title: "Create your password",
    pass_set_sub: "Default password detected. Set a personal password to continue.",
    pass_new_ph: "New password",
    pass_confirm_ph: "Confirm password",
    pass_set_btn: "Set password",
    pass_mismatch: "Passwords don't match",
    pass_too_short: "Minimum 4 characters",
    pass_too_long: "Maximum 8 characters",
    pass_length_hint: "Between 4 and 8 characters",
    admin_pass_title: "Driver passwords",
    admin_pass_reset_btn: "Reset password",
    admin_pass_reset_confirm: "Reset password for",
    admin_pass_reset_do: "Confirm reset",
    admin_pass_reset_done: "Password reset ✓",
    admin_pass_status_set: "custom password",
    admin_pass_status_default: "default password (0000)",
  },
};

function mkT(lang) {
  const L = TR[lang] || TR.pt;
  return (key, ...args) => {
    const val = L[key] ?? TR.pt[key] ?? key;
    return typeof val === "function" ? val(...args) : val;
  };
}
function weekLabel(mon) {
  const d = new Date(mon + "T12:00:00");
  const fri = new Date(d);
  fri.setDate(fri.getDate() + 4);
  return `${fmtShort(mon)} – ${fmtShort(fri.toISOString().split("T")[0])}`;
}
const R = (v) => `R$\u00a0${Number(Math.abs(v)).toFixed(2)}`;
function addWeeks(mon, n) {
  const d = new Date(mon + "T12:00:00");
  d.setDate(d.getDate() + n * 7);
  return getMonday(d.toISOString().split("T")[0]);
}
function getWeekNumber(mon) {
  const d = new Date(mon + "T12:00:00");
  const jan1 = new Date(d.getFullYear(), 0, 1);
  // Monday of the week that contains Jan 1
  const jan1Day = jan1.getDay(); // 0=Sun, 1=Mon...
  const offset = jan1Day === 0 ? -6 : 1 - jan1Day;
  const week1Mon = new Date(jan1);
  week1Mon.setDate(jan1.getDate() + offset);
  const diff = d - week1Mon;
  return Math.floor(diff / (7 * 24 * 3600 * 1000)) + 1;
}
const DIR_PT = { ida: "Ida →", volta: "← Volta", ambas: "Ida e Volta" };
const DIR_EN = { ida: "Departure →", volta: "← Return", ambas: "Round Trip" };
function DIR(lang) { return lang === "en" ? DIR_EN : DIR_PT; }

// ═══════════════════════════════════════════
//  STORAGE
// ═══════════════════════════════════════════

// Promise that resolves when Firebase is ready (max 5s wait)
// Resolves after Firebase is ready AND anonymous auth is signed in
const __dbReady = new Promise(resolve => {
  const waitForDb = (cb) => {
    if (window.__db) return cb();
    let n = 0;
    const t = setInterval(() => {
      if (window.__db) { clearInterval(t); cb(); }
      else if (++n > 50) { clearInterval(t); resolve(null); }
    }, 100);
  };
  waitForDb(() => {
    const auth = typeof firebase !== "undefined" ? firebase.auth() : null;
    if (!auth) return resolve(window.__db);
    const unsub = auth.onAuthStateChanged(user => {
      if (user) { unsub(); resolve(window.__db); }
    });
    // Fallback: if auth takes too long, proceed anyway
    setTimeout(() => { unsub(); resolve(window.__db); }, 5000);
  });
});

function lsGet() {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function lsSet(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
}

async function loadData() {
  const db = await __dbReady;
  if (db) {
    try {
      console.log("[grupo] Loading from Firestore...");
      const snap = await db.collection("caronas").doc(KEY).get();
      if (snap.exists) {
        const fsData = snap.data()?.payload;
        if (!fsData || !Array.isArray(fsData.trips)) {
          console.warn("[grupo] Firestore doc exists but payload invalid, using localStorage");
        } else {
          console.log("[grupo] Loaded OK, trips:", fsData.trips.length);
          lsSet(fsData);
          return fsData;
        }
      }
      console.log("[grupo] No Firestore doc yet, checking localStorage...");
    } catch(e) { console.error("[grupo] Firestore load ERROR:", e); }
  } else {
    console.warn("[grupo] Firebase not available");
  }
  const local = lsGet();
  if (local) console.log("[grupo] Using localStorage, trips:", local.trips?.length);
  return local;
}

// Recursively remove undefined values (Firestore rejects them)
function stripUndefined(obj) {
  if (Array.isArray(obj)) return obj.map(stripUndefined);
  if (obj !== null && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out;
  }
  return obj;
}

async function saveData(d) {
  lsSet(d);
  const db = await __dbReady;
  if (db) {
    try {
      await db.collection("caronas").doc(KEY).set({ payload: stripUndefined(d) });
      console.log("[grupo] Saved to Firestore OK, trips:", d.trips?.length);
    } catch(e) {
      console.error("[grupo] Firestore save ERROR:", e);
    }
  } else {
    console.warn("[grupo] Firebase not available — data only in localStorage");
  }
}

// ═══════════════════════════════════════════
//  INITIAL STATE
// ═══════════════════════════════════════════
const INIT = {
  done: true,
  drivers: GROUP_DRIVERS,
  trips: [],
  driverCarCosts: {}, // { [dId]: { gas, toll } }
  pixMae: "", // Mário only: pix da mãe
  lang: "pt",
};

// Helper: get car costs for a driver
function getCarCosts(st, dId) {
  return (st.driverCarCosts || {})[dId] || { gas: DEF_GAS, toll: DEF_TOLL };
}

// ═══════════════════════════════════════════
//  BALANCE ENGINE
// ═══════════════════════════════════════════
function tripPrice(t) { return t.price ?? PRICE; }
function paxPrice(p) { return p.price ?? PRICE; }
function paxMult(p, tripDir) { const d = p.direction ?? tripDir; return d === "ambas" ? 2 : 1; }

// Cash actually paid/received (not pending — real money moved)
function carCostTotal(t) {
  if (!t.carCost) return 0;
  return (t.carCost.gas || 0) + (t.carCost.toll || 0);
}

// ── myId-aware balance engine ────────────────────────────────────────────────
// All three functions take myId so each driver sees their own perspective.
// Rules:
//   role=passageiro, registeredBy===myId  → I rode → iOwe driverId
//   role=passageiro, driverId===myId       → someone rode with me → theyOwe registeredBy
//   role=motorista,  registeredBy===myId  → I drove → theyOwe each passenger
//   role=motorista,  passenger.driverId===myId → I was a passenger → iOwe registeredBy
// Pending trips (not yet confirmed) are excluded from all calculations.

function calcBalances(trips, myId) {
  const driverNet = {};
  let paxRecv = 0, paxRecvd = 0;
  const ensure = (id) => {
    if (!driverNet[id]) driverNet[id] = { iOwe: 0, iOwePaid: 0, theyOwe: 0, theyOwePaid: 0 };
  };

  trips.forEach(t => {
    if (t.pendingConfirmation) return;
    if (t.role === "passageiro") {
      const x = t.direction === "ambas" ? 2 : 1;
      const amt = tripPrice(t) * x;
      if (t.registeredBy === myId && t.driverId) {
        // I registered this ride → I owe the driver
        ensure(t.driverId);
        driverNet[t.driverId].iOwe += amt;
        if (t.paid) driverNet[t.driverId].iOwePaid += amt;
      } else if (t.driverId === myId && t.registeredBy) {
        // Someone registered that they rode with me → they owe me
        ensure(t.registeredBy);
        driverNet[t.registeredBy].theyOwe += amt;
        if (t.paid || t.settledByRide) driverNet[t.registeredBy].theyOwePaid += amt;
      }
    } else { // motorista
      const driverOf = t.registeredBy;
      if (driverOf === myId) {
        // I drove → passengers owe me
        (t.passengers || []).forEach(p => {
          const amt = paxPrice(p) * paxMult(p, t.direction);
          if (p.driverId && p.driverId !== "__custom__") {
            ensure(p.driverId);
            driverNet[p.driverId].theyOwe += amt;
            if (p.paid || p.settledByRide) driverNet[p.driverId].theyOwePaid += amt;
          } else {
            paxRecv += amt;
            if (p.paid) paxRecvd += amt;
          }
        });
      } else {
        // Someone else drove → check if I'm listed as passenger
        (t.passengers || []).forEach(p => {
          if (p.driverId === myId) {
            const amt = paxPrice(p) * paxMult(p, t.direction);
            if (driverOf) {
              ensure(driverOf);
              driverNet[driverOf].iOwe += amt;
              if (p.paid || p.settledByRide) driverNet[driverOf].iOwePaid += amt;
            }
          }
        });
      }
    }
  });

  return { driverNet, paxRecv, paxRecvd };
}


// ── Ride credit engine ──────────────────────────────────────────────────────
// Credits accumulate when myId drove otherId on trips that are still unresolved
// (passenger not paid in cash AND not settled by ride).
// 1 trecho = 1 stretch (ida or volta). "ambas" = 2 trechos.
function calcRideCredits(allTrips, myId) {
  const credits = {}; // { [otherId]: N_trechos }
  const ensure = (id) => { if (!credits[id]) credits[id] = 0; };
  allTrips.forEach(t => {
    if (t.pendingConfirmation || t.role !== "motorista" || t.registeredBy !== myId) return;
    (t.passengers || []).forEach(p => {
      if (!p.driverId || p.driverId === "__custom__") return;
      if (p.paid || p.settledByRide) return; // already resolved — no credit
      ensure(p.driverId);
      const trechos = paxMult(p, t.direction); // 1 for ida/volta, 2 for ambas
      credits[p.driverId] += trechos;
    });
  });
  return credits;
}

function calcCashFlow(allTrips, myId) {
  const byWeek = {};
  allTrips.forEach(t => {
    if (t.pendingConfirmation) return;
    const w = t.weekStart;
    if (!byWeek[w]) byWeek[w] = { spentPaid: 0, spentPending: 0, earnedPaid: 0, earnedPending: 0, carCost: 0, carCostPaid: 0 };
    if (t.role === "passageiro" && t.registeredBy === myId) {
      // I rode → spending
      const x = t.direction === "ambas" ? 2 : 1;
      const amt = tripPrice(t) * x;
      if (t.paid) byWeek[w].spentPaid += amt;
      else byWeek[w].spentPending += amt;
    } else if (t.role === "passageiro" && t.driverId === myId) {
      // Someone rode with me → earning
      const x = t.direction === "ambas" ? 2 : 1;
      const amt = tripPrice(t) * x;
      if (t.paid) byWeek[w].earnedPaid += amt;
      else byWeek[w].earnedPending += amt;
    } else if (t.role === "motorista" && t.registeredBy === myId) {
      // I drove → earning from passengers + car cost
      (t.passengers || []).forEach(p => {
        const amt = paxPrice(p) * paxMult(p, t.direction);
        if (p.paid) byWeek[w].earnedPaid += amt;
        else byWeek[w].earnedPending += amt;
      });
      const cc = carCostTotal(t);
      byWeek[w].carCost += cc;
      if (t.carCost?.paid) byWeek[w].carCostPaid += cc;
    } else if (t.role === "motorista") {
      // Someone else drove → check if I'm a passenger
      (t.passengers || []).forEach(p => {
        if (p.driverId === myId) {
          const amt = paxPrice(p) * paxMult(p, t.direction);
          if (p.paid) byWeek[w].spentPaid += amt;
          else byWeek[w].spentPending += amt;
        }
      });
    }
  });
  Object.values(byWeek).forEach(v => {
    v.spent  = v.spentPaid  + v.spentPending;
    v.earned = v.earnedPaid + v.earnedPending;
  });
  return byWeek;
}

function calcCashFlowTotals(allTrips, myId) {
  let spentPaid = 0, spentPending = 0, earnedPaid = 0, earnedPending = 0, carCost = 0, carCostPaid = 0;
  allTrips.forEach(t => {
    if (t.pendingConfirmation) return;
    if (t.role === "passageiro" && t.registeredBy === myId) {
      const x = t.direction === "ambas" ? 2 : 1;
      const amt = tripPrice(t) * x;
      if (t.paid) spentPaid += amt; else spentPending += amt;
    } else if (t.role === "passageiro" && t.driverId === myId) {
      const x = t.direction === "ambas" ? 2 : 1;
      const amt = tripPrice(t) * x;
      if (t.paid) earnedPaid += amt; else earnedPending += amt;
    } else if (t.role === "motorista" && t.registeredBy === myId) {
      (t.passengers || []).forEach(p => {
        const amt = paxPrice(p) * paxMult(p, t.direction);
        if (p.paid) earnedPaid += amt; else earnedPending += amt;
      });
      carCost += carCostTotal(t);
      if (t.carCost?.paid) carCostPaid += carCostTotal(t);
    } else if (t.role === "motorista") {
      (t.passengers || []).forEach(p => {
        if (p.driverId === myId) {
          const amt = paxPrice(p) * paxMult(p, t.direction);
          if (p.paid) spentPaid += amt; else spentPending += amt;
        }
      });
    }
  });
  const spent = spentPaid + spentPending;
  const earned = earnedPaid + earnedPending;
  return { spent, spentPaid, spentPending, earned, earnedPaid, earnedPending, carCost, carCostPaid, net: spentPaid + carCost - earnedPaid };
}

// Returns net pending: positive = they owe me, negative = I owe them
function netPending(dn) {
  return (dn.theyOwe - dn.theyOwePaid) - (dn.iOwe - dn.iOwePaid);
}

// ═══════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════
const C = {
  bg: "#0E0D12",
  card: "#1C1A22",
  card2: "#222030",
  border: "#2E2B38",
  amber: "#F59500",
  amberDim: "rgba(245,149,0,0.12)",
  green: "#22C9A0",
  greenDim: "rgba(34,201,160,0.12)",
  red: "#EF5F5F",
  redDim: "rgba(239,95,95,0.12)",
  blue: "#7C8FF5",
  text: "#EDE9E3",
  muted: "#7A768A",
  dim: "rgba(255,255,255,0.055)",
  nav: "#17151E",
};

// ═══════════════════════════════════════════
//  GLOBAL CSS
// ═══════════════════════════════════════════
const GCSS = `@keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=Barlow+Condensed:wght@600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0E0D12; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.4) sepia(0) brightness(1.2); cursor: pointer; }
  select option { background: #1C1A22; color: #EDE9E3; }
  input::placeholder { color: #5a5668; }
`;

// ═══════════════════════════════════════════
//  SMALL COMPONENTS
// ═══════════════════════════════════════════
function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 22, borderRadius: 11, cursor: "pointer", position: "relative",
        background: on ? C.green : C.dim,
        border: `1px solid ${on ? C.green : C.border}`,
        transition: "background .2s, border .2s",
        flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 20 : 3,
        width: 14, height: 14, borderRadius: "50%",
        background: on ? "#000" : C.muted,
        transition: "left .2s",
      }} />
    </div>
  );
}

function Pill({ label, active, onClick, color }) {
  const bg = active ? (color || C.amber) : C.dim;
  const col = active ? (color === C.green ? "#000" : color === C.red ? "#fff" : "#000") : C.muted;
  return (
    <button onClick={onClick} style={{
      flex: 1, background: bg, color: col,
      border: active ? "none" : `1px solid ${C.border}`,
      borderRadius: 9, padding: "10px 6px", fontSize: 13.5,
      fontWeight: active ? 700 : 400, cursor: "pointer",
      fontFamily: "Barlow, sans-serif", transition: "all .15s",
    }}>{label}</button>
  );
}

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${color}33`,
      borderRadius: 14, padding: "14px 16px",
    }}>
      <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}

function EmptyState({ icon, text }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "36px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div style={{ color: C.muted, fontSize: 14 }}>{text}</div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  SETUP SCREEN
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════
function Toast({ msg, onDone }) {
  const { useEffect } = React;
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)",
      background: "#2A1A1A", border: `1px solid ${C.red}55`, color: C.red,
      borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 600,
      fontFamily: "Barlow, sans-serif", zIndex: 9999, whiteSpace: "nowrap",
      boxShadow: "0 4px 24px #0008", animation: "fadeInUp .2s ease",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      ⚠️ {msg}
    </div>
  );
}

function Setup({ st, upd }) {
  const lang = st?.lang || "pt";
  const t = mkT(lang);
  const [drivers, setDrivers] = useState(st.drivers);

  const setN   = (i, v) => setDrivers(prev => prev.map((d, j) => j === i ? { ...d, name: v  } : d));
  const setPix = (i, v) => setDrivers(prev => prev.map((d, j) => j === i ? { ...d, pix:  v  } : d));
  const canGo = drivers[0].name.trim().length > 1;

  const go = () => {
    const filled = drivers.filter((d, i) => i === 0 || d.name.trim());
    upd({ ...st, done: true, drivers: filled.map(d => ({ ...d, name: d.name.trim() })) });
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "52px 22px 32px", fontFamily: "Barlow, sans-serif", color: C.text }}>
      <style>{GCSS}</style>

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🚗</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>
          {t("setup_title").split("\n").map((line, i) => (
            <span key={i}>{i > 0 && <br />}{i === 1 ? <span style={{ color: C.amber }}>{line}</span> : line}</span>
          ))}
        </h1>
        <p style={{ color: C.muted, marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>
          {t("setup_subtitle").split("\n").map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Me */}
        <div style={{ background: C.card, border: `1px solid ${C.amber}44`, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ color: C.amber, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>{t("setup_you")}</div>
          <input
            value={drivers[0].name}
            onChange={e => setN(0, e.target.value)}
            placeholder={t("setup_your_name")}
            style={{ background: C.dim, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", color: C.text, fontSize: 15, width: "100%", outline: "none", fontFamily: "Barlow, sans-serif" }}
          />
        </div>

        {/* Others */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
            {t("setup_other_drivers")} <span style={{ color: C.muted, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{t("setup_optional")}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {drivers.slice(1).map((d, i) => (
              <input key={d.id} value={d.name} onChange={e => setN(i + 1, e.target.value)}
                placeholder={t("setup_driver_n", i + 2)}
                style={{ background: C.dim, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", color: C.text, fontSize: 15, width: "100%", outline: "none", fontFamily: "Barlow, sans-serif" }} />
            ))}
          </div>
        </div>
      </div>

      <button onClick={go} disabled={!canGo} style={{
        marginTop: 24, width: "100%",
        background: canGo ? C.amber : C.dim,
        color: canGo ? "#000" : C.muted,
        border: "none", borderRadius: 12, padding: "15px 0",
        fontSize: 16, fontWeight: 700,
        fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.8,
        cursor: canGo ? "pointer" : "not-allowed",
      }}>
        {t("setup_go")}
      </button>

      {/* iOS install tip */}
      <div style={{ marginTop: 28, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>
          {lang === "en" ? "📲 Add to Home Screen" : "📲 Adicionar à tela inicial"}
        </div>
        {/* Android */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🤖</span>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            <span style={{ color: C.text, fontWeight: 600 }}>Android: </span>
            {lang === "en"
              ? "Open in Chrome → tap the ⋮ menu → \"Add to Home Screen\""
              : "Abra no Chrome → toque no menu ⋮ → \"Adicionar à tela inicial\""}
          </div>
        </div>
        {/* iOS */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🍎</span>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            <span style={{ color: C.text, fontWeight: 600 }}>iPhone: </span>
            {lang === "en"
              ? <>Open in Safari → tap the <span style={{ background: C.dim, borderRadius: 4, padding: "1px 5px", fontWeight: 600, color: C.text }}>Share</span> button (□↑) → "Add to Home Screen"</>
              : <>Abra no Safari → toque em <span style={{ background: C.dim, borderRadius: 4, padding: "1px 5px", fontWeight: 600, color: C.text }}>Compartilhar</span> (□↑) → "Adicionar à Tela de Início"</>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  CAR COST EDITOR (sub-component of TripCard)
// ═══════════════════════════════════════════
function CarCostEditor({ trip, st, upd }) {
  const lang = st?.lang || "pt";
  const t = mkT(lang);
  const cc = trip.carCost;
  const [editing, setEditing] = useState(false);
  const [gas,  setGas]  = useState(cc?.gas  != null ? String(cc.gas)  : "");
  const [toll, setToll] = useState(cc?.toll != null ? String(cc.toll) : "");
  const [paid, setPaid] = useState(cc?.paid ?? false);

  // Sync local state when trip.carCost changes externally (after save/remove)
  const { useEffect } = React;
  useEffect(() => {
    const c = trip.carCost;
    setGas(c?.gas  != null ? String(c.gas)  : "");
    setToll(c?.toll != null ? String(c.toll) : "");
    setPaid(c?.paid ?? false);
  }, [trip.carCost]);

  const save = () => {
    upd({ ...st, trips: st.trips.map(t => t.id === trip.id
      ? { ...t, carCost: { gas: parseFloat(gas)||0, toll: parseFloat(toll)||0, paid } }
      : t
    )});
    setEditing(false);
  };
  const remove = () => { setEditing(false); upd({ ...st, trips: st.trips.map(t => t.id === trip.id ? { ...t, carCost: undefined } : t) }); };
  const inpS = { background: C.dim, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 10px", color: C.text, fontSize: 14, width: "100%", outline: "none", fontFamily: "Barlow, sans-serif", textAlign: "center" };
  const hasCC = !!trip.carCost; // always read fresh from prop

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ height: 1, background: C.border, marginBottom: 10 }} />
      {!editing ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: C.muted }}>
            {cc
              ? <span>⛽ {R(cc.gas)} + 🛣️ {R(cc.toll)} = <strong style={{ color: cc.paid ? C.green : "#F5A623" }}>{R((cc.gas||0)+(cc.toll||0))}</strong>{cc.paid ? " " + t("paid_label_short") : " " + (lang === "en" ? "pending" : "pendente")}</span>
              : <span>{t("no_car_cost")}</span>}
          </div>
          <button onClick={() => setEditing(true)} style={{ background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 7, padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
            {cc ? t("edit_label") : t("add_car_cost_btn")}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{t("car_cost_editor_title")}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{t("opts_fuel")} R$</div>
              <input type="number" min="0" step="0.01" value={gas} onChange={e => setGas(e.target.value)} style={inpS} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{t("opts_toll")} R$</div>
              <input type="number" min="0" step="0.01" value={toll} onChange={e => setToll(e.target.value)} style={inpS} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: C.text }}>Total: <strong style={{ color: "#F5A623" }}>R$&nbsp;{((parseFloat(gas)||0)+(parseFloat(toll)||0)).toFixed(2)}</strong></span>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 11, color: C.muted }}>Já paguei</span>
              <Toggle on={paid} onChange={setPaid} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={save} style={{ flex: 1, background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 7, padding: "7px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>{t("save_btn")}</button>
            <button onClick={() => setEditing(false)} style={{ background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 7, padding: "7px 12px", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>{t("cancel_btn")}</button>
            {hasCC && <button onClick={remove} style={{ background: C.redDim, border: `1px solid ${C.red}44`, color: C.red, borderRadius: 7, padding: "7px 10px", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>{lang === "en" ? "Remove" : "Remover"}</button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
//  TRIP CARD
// ═══════════════════════════════════════════
function TripCard({ trip, st, upd, showDelete, weekDn, weekTrips, allTrips, readOnly, myId }) {
  const lang = st?.lang || "pt";
  const t = mkT(lang);
  const [open, setOpen] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [dateVal, setDateVal] = useState(trip.date);
  const [editingPassengers, setEditingPassengers] = useState(false);
  const [paxEdits, setPaxEdits] = useState([]);
  const [newPaxId, setNewPaxId] = useState("");
  const [newPaxCustomName, setNewPaxCustomName] = useState("");
  const driver = st.drivers.find(d => d.id === trip.driverId);
  const driverDisplayName = driver?.name || trip.driverName || "?";
  const canEdit = !readOnly && (myId === ADMIN_ID || trip.registeredBy === myId);
  const mult = trip.direction === "ambas" ? 2 : 1;

  // settledByRide is now stored per-pax field (set explicitly by user action)
  // No automatic cancelled logic anymore — user chooses to settle with ride credits

  const deleteTrip = (e) => { e.stopPropagation(); const msg = lang === "en" ? "Delete this trip?" : "Apagar esta viagem?"; if (window.confirm(msg)) upd({ ...st, trips: st.trips.filter(t => t.id !== trip.id) }); };
  const togglePaid = () => upd({ ...st, trips: st.trips.map(t => t.id === trip.id ? { ...t, paid: !t.paid } : t) });
  const togglePaxPaid = (paxId) => upd({ ...st, trips: st.trips.map(t => t.id === trip.id ? { ...t, passengers: t.passengers.map(p => p.id === paxId ? { ...p, paid: !p.paid } : p) } : t) });
  const saveDate = () => {
    if (!dateVal) return;
    const effectiveDriver = trip.driverOwnerId || trip.registeredBy;
    const conflict = st.trips.some(t => {
      if (t.id === trip.id || t.date !== dateVal) return false;
      const tDriver = t.driverOwnerId || t.registeredBy;
      return tDriver === effectiveDriver;
    });
    if (conflict) { alert(t("trip_duplicate_date")); return; }
    upd({ ...st, trips: st.trips.map(t => t.id === trip.id ? { ...t, date: dateVal, weekStart: getMonday(dateVal) } : t) });
    setEditingDate(false);
  };

  const startEditPax = () => {
    setPaxEdits((trip.passengers || []).map(p => ({ ...p, _priceStr: String(p.price ?? PRICE) })));
    setNewPaxId("");
    setNewPaxCustomName("");
    setEditingPassengers(true);
  };
  const savePaxEdits = () => {
    upd({ ...st, trips: st.trips.map(tr => tr.id !== trip.id ? tr : {
      ...tr,
      passengers: paxEdits.map(({ _priceStr, ...p }) => {
        const parsed = parseFloat(_priceStr);
        return { ...p, price: (!isNaN(parsed) && parsed !== PRICE) ? parsed : undefined };
      }),
    })});
    setEditingPassengers(false);
  };
  const cancelPaxEdit = () => setEditingPassengers(false);

  const rowStyle = {
    background: C.card,
    border: `1px solid ${trip.pendingConfirmation ? C.amber+"44" : open ? C.amber+"55" : C.border}`,
    borderRadius: 12, overflow: "hidden", transition: "border-color .15s",
    opacity: trip.pendingConfirmation && trip.driverOwnerId !== myId ? 0.75 : 1,
  };
  const editBar = { borderTop: `1px solid ${C.border}`, padding: "10px 14px", background: C.card2 };
  const editBtn = (active, label, onClick, color) => (
    <button onClick={onClick} style={{
      flex: 1, background: active ? (color === C.red ? C.redDim : C.greenDim) : C.dim,
      border: `1px solid ${active ? (color === C.red ? C.red+"44" : C.green+"44") : C.border}`,
      color: active ? (color === C.red ? C.red : C.green) : C.muted,
      borderRadius: 8, padding: "8px 6px", fontSize: 12, fontWeight: 600,
      cursor: "pointer", fontFamily: "Barlow, sans-serif",
    }}>{label}</button>
  );

  if (trip.role === "passageiro") {
    const pricePerTrecho = tripPrice(trip);
    const total = pricePerTrecho * mult;
    const isCustom = pricePerTrecho !== PRICE;
    return (
      <div style={rowStyle}>
        <div onClick={() => setOpen(o => !o)} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.redDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🪑</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{DIR(lang)[trip.direction]}</div>
              {trip.pendingConfirmation
                ? <span style={{ background: C.amberDim, border: `1px solid ${C.amber}44`, color: C.amber, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px", letterSpacing: 0.3, textTransform: "uppercase" }}>{t("badge_pending_trip")}</span>
                : <span style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px", letterSpacing: 0.3, textTransform: "uppercase" }}>{t("badge_confirmed_trip")}</span>
              }
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              <span style={{ color: C.amber, fontWeight: 600, marginRight: 4 }}>{weekday(trip.date, lang)}</span>{fmtFull(trip.date)} · {t("carona_with", driverDisplayName)}
              {isCustom && <span style={{ color: C.amber, marginLeft: 6 }}>{lang === "en" ? `· ${R(pricePerTrecho)}${t("stretch_per")}` : `· ${R(pricePerTrecho)}/trecho`}</span>}
              {trip.note && (trip.notePublic || trip.registeredBy === myId) && <div style={{ marginTop: 2, color: C.muted, fontStyle: "italic" }}>{trip.note}</div>}
              {trip.coPassengers?.length > 0 && (
                <div style={{ marginTop: 2, color: C.muted, fontSize: 11 }}>
                  + {trip.coPassengers.map(p => p.name).join(", ")}
                </div>
              )}
            </div>
          </div>
          {(() => {
            const cancelled = trip.settledByRide;
            const partial = trip.settledByRide === "partial";
            const statusColor = trip.paid ? C.green : cancelled ? C.green : C.red;
            const statusLabel = trip.paid ? t("trip_paid_label") : cancelled === "partial" ? t("trip_partial_ride") : cancelled ? t("trip_quitado") : t("trip_pending_label");
            return (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: statusColor }}>{R(total)}</div>
                <div style={{ fontSize: 10, color: statusColor, marginTop: 1 }}>{statusLabel}</div>
              </div>
            );
          })()}
          <div style={{ color: C.muted, fontSize: 11, flexShrink: 0, paddingLeft: 4 }}>{open ? "▲" : "▼"}</div>
        </div>
        {open && !readOnly && trip.registeredBy === myId && (
          <div style={editBar}>
            {/* Date editor */}
            <div style={{ marginBottom: 10 }}>
              {!editingDate ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: C.muted }}>📅 {fmtFull(trip.date)}</span>
                  <button onClick={() => { setDateVal(trip.date); setEditingDate(true); }} style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer", padding: 0, fontFamily: "Barlow, sans-serif" }}>{t("trip_edit_date")}</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="date" value={dateVal} onChange={e => setDateVal(e.target.value)}
                    style={{ flex: 1, background: C.dim, border: `1px solid ${C.amber}55`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 13, outline: "none", fontFamily: "Barlow, sans-serif" }} />
                  <button onClick={saveDate} style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>OK</button>
                  <button onClick={() => setEditingDate(false)} style={{ background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 7, padding: "7px 10px", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>✕</button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {(() => {
                const cancelled = trip.settledByRide;
                if (cancelled) {
                  return (
                    <div style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, fontFamily: "Barlow, sans-serif" }}>
                      {t("trip_quitado_btn")}
                    </div>
                  );
                }
                return editBtn(trip.paid, trip.paid ? t("trip_undo_paid") : t("trip_mark_paid"), togglePaid, trip.paid ? C.red : C.green);
              })()}
              {showDelete && (
                <button onClick={deleteTrip} style={{ background: C.redDim, border: `1px solid ${C.red}44`, color: C.red, borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif", flexShrink: 0 }}>
                  {t("trip_delete")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const pax = trip.passengers || [];
  const paidCount = pax.filter(p => p.paid).length;
  const total = pax.reduce((s, p) => s + paxPrice(p) * paxMult(p, trip.direction), 0);
  const received = pax.filter(p => p.paid).reduce((s, p) => s + paxPrice(p) * paxMult(p, trip.direction), 0);
  const hasCustom = pax.some(p => p.price && p.price !== PRICE);
  const hasDirVariant = pax.some(p => p.direction && p.direction !== trip.direction);

  return (
    <div style={rowStyle}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.amberDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🚗</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{t("driver_label")}: {st.drivers.find(d => d.id === (trip.driverOwnerId || trip.registeredBy))?.name || "?"}</div>
            {trip.pendingConfirmation
              ? <span style={{ background: C.amberDim, border: `1px solid ${C.amber}44`, color: C.amber, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px", letterSpacing: 0.3, textTransform: "uppercase" }}>{t("badge_pending_trip")}</span>
              : <span style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px", letterSpacing: 0.3, textTransform: "uppercase" }}>{t("badge_confirmed_trip")}</span>
            }
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            <span style={{ color: C.amber, fontWeight: 600, marginRight: 4 }}>{weekday(trip.date, lang)}</span>{fmtFull(trip.date)}
            {' · '}{DIR(lang)[trip.direction]}
            {' · '}{t("pax_label", pax.length)}
            {hasCustom && <span style={{ color: C.amber, marginLeft: 4 }}>{lang === "en" ? "· custom prices" : "· preços variados"}</span>}
            {hasDirVariant && <span style={{ color: C.blue, marginLeft: 4 }}>{lang === "en" ? "· mixed stretches" : "· trechos variados"}</span>}
            {trip.note && (trip.notePublic || trip.registeredBy === myId) && <div style={{ marginTop: 2, color: C.muted, fontStyle: "italic" }}>{trip.note}</div>}
          </div>
        </div>
        {(() => {
          const unpaidPax = pax.filter(p => !p.paid);
          const allUnpaidCancelled = unpaidPax.length > 0 && unpaidPax.every(p => p.settledByRide || p.paid);
          const effectivelyDone = received === total || allUnpaidCancelled;
          return (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: effectivelyDone ? C.green : C.amber }}>
                {R(received)}<span style={{ color: C.muted, fontSize: 14 }}>/{R(total)}</span>
              </div>
              <div style={{ fontSize: 10, color: effectivelyDone ? C.green : C.muted, marginTop: 1 }}>
                {allUnpaidCancelled ? t("trip_counter_ok") : t("trip_paid_count", paidCount, pax.length)}
              </div>
            </div>
          );
        })()}
        <div style={{ color: C.muted, fontSize: 11, flexShrink: 0, paddingLeft: 4 }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={editBar}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ marginBottom: 2 }}>
              {canEdit && !editingDate && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: C.muted }}>📅 {fmtFull(trip.date)}</span>
                  <button onClick={() => { setDateVal(trip.date); setEditingDate(true); }} style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer", padding: 0, fontFamily: "Barlow, sans-serif" }}>{t("trip_edit_date")}</button>
                </div>
              )}
              {canEdit && editingDate && (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="date" value={dateVal} onChange={e => setDateVal(e.target.value)}
                    style={{ flex: 1, background: C.dim, border: `1px solid ${C.amber}55`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 13, outline: "none", fontFamily: "Barlow, sans-serif" }} />
                  <button onClick={saveDate} style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>OK</button>
                  <button onClick={() => setEditingDate(false)} style={{ background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 7, padding: "7px 10px", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>✕</button>
                </div>
              )}
              {!canEdit && (
                <span style={{ fontSize: 12, color: C.muted }}>📅 {fmtFull(trip.date)}</span>
              )}
            </div>
            {editingPassengers ? (() => {
              const effectiveDriverId = trip.driverOwnerId || trip.registeredBy;
              const alreadyIds = paxEdits.map(p => p.driverId).filter(Boolean);
              const availToAdd = st.drivers.filter(d => d.id !== effectiveDriverId && !alreadyIds.includes(d.id));
              const inputStyle = { background: C.dim, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 8px", color: C.text, fontSize: 12, outline: "none", fontFamily: "Barlow, sans-serif" };
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {paxEdits.map((p, i) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, color: C.text, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                      <input
                        type="number" min="0" value={p._priceStr}
                        onChange={e => setPaxEdits(prev => prev.map((x, j) => j === i ? { ...x, _priceStr: e.target.value } : x))}
                        placeholder={String(PRICE)}
                        style={{ ...inputStyle, width: 70 }}
                      />
                      <select
                        value={p.direction || ""}
                        onChange={e => setPaxEdits(prev => prev.map((x, j) => j === i ? { ...x, direction: e.target.value || undefined } : x))}
                        style={{ ...inputStyle, maxWidth: 90 }}
                      >
                        <option value="">{DIR(lang)[trip.direction]}</option>
                        {trip.direction !== "ida" && <option value="ida">{DIR(lang).ida}</option>}
                        {trip.direction !== "volta" && <option value="volta">{DIR(lang).volta}</option>}
                        {trip.direction !== "ambas" && <option value="ambas">{DIR(lang).ambas}</option>}
                      </select>
                      <button onClick={() => setPaxEdits(prev => prev.filter((_, j) => j !== i))} style={{ background: C.redDim, border: `1px solid ${C.red}44`, color: C.red, borderRadius: 6, padding: "5px 9px", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif", flexShrink: 0 }}>
                        {t("trip_pax_remove")}
                      </button>
                    </div>
                  ))}
                  {paxEdits.length < 4 && (
                    newPaxId === "__custom__" ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          autoFocus
                          value={newPaxCustomName}
                          onChange={e => setNewPaxCustomName(e.target.value)}
                          placeholder={lang === "en" ? "Passenger name" : "Nome do passageiro"}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        <button onClick={() => {
                          const name = newPaxCustomName.trim();
                          if (!name) return;
                          setPaxEdits(prev => [...prev, { id: uid(), name, _priceStr: String(PRICE) }]);
                          setNewPaxId(""); setNewPaxCustomName("");
                        }} style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>+</button>
                        <button onClick={() => { setNewPaxId(""); setNewPaxCustomName(""); }} style={{ background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "5px 9px", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>✕</button>
                      </div>
                    ) : (
                      <select value={newPaxId} onChange={e => {
                        if (e.target.value === "__custom__") { setNewPaxId("__custom__"); return; }
                        const d = st.drivers.find(x => x.id === e.target.value);
                        if (!d) return;
                        setPaxEdits(prev => [...prev, { id: uid(), driverId: d.id, name: d.name, _priceStr: String(PRICE) }]);
                        setNewPaxId("");
                      }} style={{ ...inputStyle, width: "100%" }}>
                        <option value="">{t("trip_add_pax")}</option>
                        {availToAdd.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        <option value="__custom__">{lang === "en" ? "Other (type name)" : "Outro (digitar nome)"}</option>
                      </select>
                    )
                  )}
                  {paxEdits.length >= 4 && <span style={{ fontSize: 11, color: C.muted }}>{t("trip_pax_limit")}</span>}
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <button onClick={savePaxEdits} style={{ flex: 1, background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
                      {t("trip_pax_save")}
                    </button>
                    <button onClick={cancelPaxEdit} style={{ flex: 1, background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: "9px 0", fontSize: 13, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
                      {t("trip_pax_cancel")}
                    </button>
                  </div>
                </div>
              );
            })() : (
              <>
                {pax.map(p => {
                  const pm = paxMult(p, trip.direction);
                  const pDir = p.direction || trip.direction;
                  const iAmDriver = canEdit;
                  return (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 13, color: p.paid ? C.muted : C.text, flex: 1, minWidth: 0 }}>
                        <div>{p.name}</div>
                        <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                          {p.direction && p.direction !== trip.direction && <span style={{ color: C.blue, fontSize: 10, background: C.blue+"18", borderRadius: 4, padding: "1px 5px" }}>{DIR(lang)[pDir]}</span>}
                          {paxPrice(p) !== PRICE && <span style={{ color: C.amber, fontSize: 10, background: C.amberDim, borderRadius: 4, padding: "1px 5px" }}>{`R$${paxPrice(p)}`}{t("stretch_per")}</span>}
                          <span style={{ color: p.paid ? C.green : C.muted, fontSize: 10 }}>{R(paxPrice(p) * pm)}</span>
                        </div>
                      </div>
                      {(() => {
                        const pCancelled = p.settledByRide && !p.paid;
                        if (pCancelled) {
                          return (
                            <div style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, fontFamily: "Barlow, sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>
                              {t("trip_quitado_btn")}
                            </div>
                          );
                        }
                        if (iAmDriver) {
                          return (
                            <button onClick={() => togglePaxPaid(p.id)} style={{
                              background: p.paid ? C.greenDim : C.dim,
                              border: `1px solid ${p.paid ? C.green+"44" : C.border}`,
                              color: p.paid ? C.green : C.muted,
                              borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                              cursor: "pointer", fontFamily: "Barlow, sans-serif", flexShrink: 0,
                            }}>
                              {p.paid ? t("trip_received") : t("trip_mark_received")}
                            </button>
                          );
                        }
                        return (
                          <span style={{ fontSize: 11, color: p.paid ? C.green : C.muted, flexShrink: 0 }}>
                            {p.paid ? t("received_label_short") : t("trip_pending_label")}
                          </span>
                        );
                      })()}
                    </div>
                  );
                })}
                {canEdit && (
                  <button onClick={startEditPax} style={{ marginTop: 2, background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: "7px 0", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif", width: "100%" }}>
                    {t("trip_edit_pax")}
                  </button>
                )}
              </>
            )}
            {!readOnly && showDelete && !editingPassengers && (
              <button onClick={deleteTrip} style={{ marginTop: 4, background: C.redDim, border: `1px solid ${C.red}44`, color: C.red, borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif", width: "100%" }}>
                {t("trip_delete")}
              </button>
            )}
          </div>
          {canEdit && <CarCostEditor trip={trip} st={st} upd={upd} />}
          {canEdit && <div style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>{lang === "en" ? "Tap any status again to undo." : "Toque novamente em qualquer status para desfazer."}</div>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
//  HOME / DASHBOARD
// ═══════════════════════════════════════════
//  HOME / DASHBOARD
// ═══════════════════════════════════════════
function Home({ st, upd, setTab, myId }) {
  const lang = st?.lang || "pt";
  const t = mkT(lang);
  const thisWeek = getMonday(todayStr());
  const [viewWeek, setViewWeek] = useState(thisWeek);
  const isCurrentWeek = viewWeek === thisWeek;

  const weekTrips = st.trips.filter(t => t.weekStart === viewWeek);
  const allConfirmed = st.trips.filter(t => !t.pendingConfirmation); // full history for cross-week quitado
  const { driverNet, paxRecv, paxRecvd } = calcBalances(weekTrips, myId);
  const totalOwed    = Object.values(driverNet).reduce((s, dn) => s + Math.max(0, dn.iOwe - dn.iOwePaid), 0);
  const totalPending = (paxRecv - paxRecvd) + Object.values(driverNet).reduce((s, dn) => s + Math.max(0, dn.theyOwe - dn.theyOwePaid), 0);
  const sorted = [...weekTrips].sort((a, b) => b.date.localeCompare(a.date)); // includes pending

  // quitadoComCarona: any trip settled by ride this week
  const quitadoComCarona = weekTrips.some(t =>
    t.settledByRide ||
    (t.passengers||[]).some(p => p.settledByRide)
  );

  const weekNum = getWeekNumber(viewWeek);

  // Mark as seen when Home mounts
  useEffect(() => {
    localStorage.setItem(LAST_SEEN_KEY(myId), String(Date.now()));
  }, []);

  // New trips this week added by others involving me
  const thisWeekTrips = st.trips.filter(tr => tr.weekStart === thisWeek);
  const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY(myId)) || 0);

  // Pending confirmations for me
  const pendingTrips = st.trips.filter(tr => tr.pendingConfirmation && tr.driverOwnerId === myId);

  const [editingPendingId, setEditingPendingId] = useState(null);
  const [pendingEdits, setPendingEdits] = useState({});  // tripId → {passengers, carGas, carToll, includeCarCost}

  const startEditPending = (tr) => {
    setEditingPendingId(tr.id);
    const defCC = getCarCosts(st, myId);
    setPendingEdits(prev => ({
      ...prev,
      [tr.id]: {
        passengers: (tr.passengers || []).map(p => ({ ...p, price: String(paxPrice(p)), direction: p.direction || undefined })),
        carGas: String(defCC.gas),
        carToll: String(defCC.toll),
        includeCarCost: false,
      }
    }));
  };

  const confirmTrip = (tripId) => {
    const edit = pendingEdits[tripId];
    upd({ ...st, trips: st.trips.map(tr => {
      if (tr.id !== tripId) return tr;
      const base = { ...tr, pendingConfirmation: false, registeredBy: myId, driverOwnerId: undefined };
      if (edit) {
        const parsedPax = edit.passengers.map(p => ({
          ...p,
          price: parseFloat(p.price) !== PRICE ? parseFloat(p.price) || undefined : undefined,
          direction: p.direction || undefined,
        }));
        const carCost = edit.includeCarCost
          ? { gas: parseFloat(edit.carGas) || 0, toll: parseFloat(edit.carToll) || 0, paid: false }
          : undefined;
        const noteData = edit.note?.trim() ? { note: edit.note.trim(), notePublic: !!edit.notePublic } : {};
        return { ...base, passengers: parsedPax, ...(carCost ? { carCost } : {}), ...noteData };
      }
      return { ...base, registeredBy: myId };
    })});
    setEditingPendingId(null);
  };

  const rejectTrip = (tripId) => {
    upd({ ...st, trips: st.trips.filter(tr => tr.id !== tripId) });
    setEditingPendingId(null);
  };

  return (
    <div>
      {/* Pending confirmations */}
      {pendingTrips.length > 0 && (
        <div style={{ padding: "52px 20px 0" }}>
          <div style={{ background: C.amberDim, border: `1px solid ${C.amber}44`, borderRadius: 14, padding: "14px 16px", marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: C.amber, marginBottom: 10 }}>
              {t("pending_confirm_title")}
            </div>
            {pendingTrips.map(tr => {
              const registrant = st.drivers.find(d => d.id === tr.registeredBy);
              const isEditing = editingPendingId === tr.id;
              const edit = pendingEdits[tr.id] || {};
              const inpS = { background: "#1A1825", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 14, outline: "none", fontFamily: "Barlow, sans-serif" };
              return (
                <div key={tr.id} style={{ background: C.card, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                  {/* Header */}
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>
                    <span style={{ color: C.amber, marginRight: 6 }}>{weekday(tr.date, lang)}</span>{fmtFull(tr.date)} · {DIR(lang)[tr.direction]}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>
                    {t("pending_confirm_sub", registrant?.name || tr.registeredBy)}
                  </div>

                  {!isEditing ? (
                    <>
                      {/* Quick summary */}
                      {(tr.passengers || []).length > 0 && (
                        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
                          {t("passengers_in_car")}: {(tr.passengers || []).map(p => p.name).join(", ")}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => startEditPending(tr)} style={{ flex: 2, background: C.amberDim, border: `1px solid ${C.amber}44`, color: C.amber, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
                          {t("edit_confirm_btn")}
                        </button>
                        <button onClick={() => rejectTrip(tr.id)} style={{ flex: 1, background: C.redDim, border: `1px solid ${C.red}44`, color: C.red, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
                          {t("reject_btn")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Edit form */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
                        {/* Passengers with price edit */}
                        <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                          {t("passengers_in_car")}
                        </div>
                        {(edit.passengers || []).map((p, i) => {
                          const pp = parseFloat(p.price) || PRICE;
                          const pDir = p.direction || tr.direction;
                          const pDirChanged = p.direction && p.direction !== tr.direction;
                          return (
                            <div key={p.id} style={{ background: "#1A1825", borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>
                              <div style={{ fontSize: 13, color: C.text, marginBottom: 8, fontWeight: 500 }}>{p.name}</div>
                              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                                {[["ida", DIR(lang).ida], ["volta", DIR(lang).volta], ["ambas", lang === "en" ? "Rnd" : "I+V"]].map(([val, lbl2]) => (
                                  <button key={val} onClick={() => setPendingEdits(prev => ({
                                    ...prev,
                                    [tr.id]: { ...prev[tr.id], passengers: prev[tr.id].passengers.map((px, j) =>
                                      j === i ? { ...px, direction: val === tr.direction && !px.direction ? undefined : val } : px
                                    )}
                                  }))} style={{
                                    flex: 1, background: pDir === val ? (pDirChanged ? C.blue+"33" : C.amberDim) : "transparent",
                                    color: pDir === val ? (pDirChanged ? C.blue : C.amber) : C.muted,
                                    border: `1px solid ${pDir === val ? (pDirChanged ? C.blue+"66" : C.amber+"55") : C.border}`,
                                    borderRadius: 6, padding: "4px 2px", fontSize: 10, fontWeight: pDir === val ? 700 : 400,
                                    cursor: "pointer", fontFamily: "Barlow, sans-serif",
                                  }}>{lbl2}</button>
                                ))}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12, color: C.muted }}>R$</span>
                                <input
                                  type="number" min="0" step="1"
                                  value={p.price}
                                  onChange={e => setPendingEdits(prev => ({
                                    ...prev,
                                    [tr.id]: { ...prev[tr.id], passengers: prev[tr.id].passengers.map((px, j) => j === i ? { ...px, price: e.target.value } : px) }
                                  }))}
                                  style={{ ...inpS, width: 64, textAlign: "center", borderColor: pp !== PRICE ? C.amber+"66" : C.border }}
                                />
                                <span style={{ fontSize: 11, color: C.muted }}>{t("stretch_per")}</span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Car cost section — only for the actual driver */}
                        {tr.driverOwnerId === myId && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
                          <span style={{ fontSize: 13, color: C.text }}>⛽ {t("add_car_cost_later")}</span>
                          <Toggle on={edit.includeCarCost} onChange={v => setPendingEdits(prev => ({ ...prev, [tr.id]: { ...prev[tr.id], includeCarCost: v } }))} />
                        </div>}
                        {edit.includeCarCost && tr.driverOwnerId === myId && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{t("opts_fuel")}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ color: C.muted, fontSize: 12 }}>R$</span>
                                <input type="number" min="0" step="0.01" value={edit.carGas}
                                  onChange={e => setPendingEdits(prev => ({ ...prev, [tr.id]: { ...prev[tr.id], carGas: e.target.value } }))}
                                  style={{ ...inpS, flex: 1, textAlign: "center" }} />
                              </div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{t("opts_toll")}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ color: C.muted, fontSize: 12 }}>R$</span>
                                <input type="number" min="0" step="0.01" value={edit.carToll}
                                  onChange={e => setPendingEdits(prev => ({ ...prev, [tr.id]: { ...prev[tr.id], carToll: e.target.value } }))}
                                  style={{ ...inpS, width: 0, flex: 1, minWidth: 0, textAlign: "center" }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Note field for driver when confirming */}
                      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginBottom: 4 }}>
                        <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t("add_note")} <span style={{ fontWeight: 400 }}>(opcional)</span></div>
                        <input
                          value={edit.note || ""}
                          onChange={e => setPendingEdits(prev => ({ ...prev, [tr.id]: { ...prev[tr.id], note: e.target.value.slice(0, 35) } }))}
                          placeholder={t("add_note_ph")}
                          maxLength={35}
                          style={{ ...inpS, width: "100%", marginBottom: 6 }}
                        />
                        {(edit.note||"").trim() && (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: C.muted }}>{t("note_visible_label")}</span>
                            <Toggle on={!!edit.notePublic} onChange={v => setPendingEdits(prev => ({ ...prev, [tr.id]: { ...prev[tr.id], notePublic: v } }))} />
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => confirmTrip(tr.id)} style={{ flex: 2, background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
                          {t("confirm_btn")}
                        </button>
                        <button onClick={() => setEditingPendingId(null)} style={{ flex: 1, background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 9, padding: "9px 0", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
                          {t("cancel_btn")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Hero header */}
      <div style={{
        padding: "52px 20px 18px",
        background: isCurrentWeek
          ? `linear-gradient(180deg, #2A1F0A 0%, #1A1508 60%, ${C.bg} 100%)`
          : `linear-gradient(180deg, #1C1826 0%, ${C.bg} 100%)`,
        transition: "background 0.3s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Prev week */}
          <button onClick={() => setViewWeek(w => addWeeks(w, -1))}
            style={{ background: "none", border: "none", color: isCurrentWeek ? C.amber + "99" : C.muted, fontSize: 26, cursor: "pointer", padding: "0 4px", lineHeight: 1, flexShrink: 0 }}>
            ‹
          </button>

          {/* Week label */}
          <div style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 3 }}>
              <div style={{ color: isCurrentWeek ? C.amber : C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                {t("home_week", weekNum)}
              </div>
              {isCurrentWeek && (
                <span style={{ background: C.amber, color: "#000", fontSize: 9, fontWeight: 800, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {t("home_current_badge")}
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: C.text, lineHeight: 1 }}>
              {weekLabel(viewWeek)}
            </h1>
            {!isCurrentWeek && (
              <button onClick={() => setViewWeek(thisWeek)}
                style={{ background: "none", border: "none", color: C.amber, fontSize: 11, cursor: "pointer", fontFamily: "Barlow, sans-serif", padding: "4px 0 0", textDecoration: "underline" }}>
                {t("home_back_to_current")}
              </button>
            )}
          </div>

          {/* Right side: trips badge + next btn */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{ background: isCurrentWeek ? C.amber + "25" : C.amber + "18", border: `1px solid ${C.amber}${isCurrentWeek ? "66" : "44"}`, borderRadius: 20, padding: "5px 10px" }}>
              <span style={{ color: C.amber, fontSize: 12, fontWeight: 600 }}>
                {t("home_trips_n", weekTrips.length)}
              </span>
            </div>
            <button onClick={() => setViewWeek(w => addWeeks(w, 1))} disabled={isCurrentWeek}
              style={{ background: "none", border: "none", color: isCurrentWeek ? C.dim : C.muted, fontSize: 26, cursor: isCurrentWeek ? "default" : "pointer", padding: "0 4px", lineHeight: 1 }}>
              ›
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* CTA */}
        <button onClick={() => setTab("add")} style={{
          background: C.amber, color: "#000", border: "none", borderRadius: 13,
          padding: "15px 0", fontSize: 15, fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1,
          cursor: "pointer", width: "100%", textTransform: "uppercase",
        }}>
          {t("home_register")}
        </button>

        {sorted.length > 0 ? (
          <div>
            <SectionLabel>{isCurrentWeek ? t("home_trips_this_week") : t("home_trips_week")}</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sorted.map(tr => <TripCard key={tr.id} trip={tr} st={st} upd={upd} showDelete={tr.registeredBy === myId || !tr.registeredBy || myId === ADMIN_ID} weekDn={driverNet} weekTrips={weekTrips} allTrips={allConfirmed} myId={myId} />)}
            </div>
          </div>
        ) : (
          <EmptyState icon="🛣️" text={t("home_empty")} />
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
//  ADD TRIP SCREEN
// ═══════════════════════════════════════════
function AddTrip({ st, upd, setTab, myId }) {
  const lang = st?.lang || "pt";
  const t = mkT(lang);
  const [date, setDate] = useState(todayStr());
  const [dir, setDir] = useState("ambas");
  const [myDir, setMyDir] = useState("ambas"); // passageiro: my own stretch only
  const [role, setRole] = useState("motorista");
  const [driverId, setDriverId] = useState(() => st.drivers.find(d => d.id !== myId)?.id || "__other__");
  const [driverCustomName, setDriverCustomName] = useState("");
  const [paid, setPaid] = useState(false);
  const [tripPriceVal, setTripPriceVal] = useState(String(PRICE));
  const [pax, setPax] = useState([{ id: uid(), name: "", driverId: "", paid: false, price: String(PRICE), direction: null }]);
  const defCC = getCarCosts(st, myId);
  const [includeCarCost, setIncludeCarCost] = useState(true);
  const [carGas,  setCarGas]  = useState(String(defCC.gas));
  const [carToll, setCarToll] = useState(String(defCC.toll));
  const [carCostPaid, setCarCostPaid] = useState(false);
  const [note, setNote] = useState("");
  const [notePublic, setNotePublic] = useState(false);
  const [toast, setToast] = useState(null);
  const [coPassengers, setCoPassengers] = useState([]); // other passengers in same car (passageiro form)
  const addCoPax = () => setCoPassengers(prev => [...prev, { id: uid(), driverId: "", name: "" }]);
  const remCoPax = (id) => setCoPassengers(prev => prev.filter(p => p.id !== id));
  const updCoPax = (id, field, val) => setCoPassengers(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  const [overrideDriver, setOverrideDriver] = useState(""); // admin only: register trip on behalf of another driver

  // For passageiro form: all drivers except self (who drove you?)
  const otherDrivers = st.drivers.filter(d => d.id !== myId && d.name);
  // For motorista form: all drivers except self (who were your passengers?)
  const allOthers = st.drivers.filter(d => d.id !== myId && d.name);
  const others = otherDrivers; // keep alias for existing code
  const mult = dir === "ambas" ? 2 : 1;

  const paxIda   = pax.filter(p => { const d = p.direction || dir; return d === "ida"   || d === "ambas"; }).length;
  const paxVolta = pax.filter(p => { const d = p.direction || dir; return d === "volta" || d === "ambas"; }).length;
  // Allow adding if at least one stretch still has room
  const canAddPax = paxIda < 4 || paxVolta < 4;
  const addPax = () => {
    if (!canAddPax) return;
    // Default new pax direction to the stretch that still has room
    const defaultDir = paxIda >= 4 ? "volta" : paxVolta >= 4 ? "ida" : null;
    setPax(prev => [...prev, { id: uid(), name: "", driverId: "", paid: false, price: String(PRICE), direction: defaultDir }]);
  };
  const remPax = (id) => setPax(prev => prev.filter(p => p.id !== id));
  const updPax = (id, field, val) => setPax(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));

  const parsedTripPrice = parseFloat(tripPriceVal) || PRICE;
  const parsedCarGas  = parseFloat(carGas)  || 0;
  const parsedCarToll = parseFloat(carToll) || 0;
  const totalCarCost  = parsedCarGas + parsedCarToll;
  const paxValid = p => p.name.trim() || (p.driverId && p.driverId !== "" && p.driverId !== "__custom__");
  const isCustomDriver = driverId === "__other__";
  // Force dir=ambas unless it's a custom (avulso) driver trip
  React.useEffect(() => {
    if (!isCustomDriver) setDir("ambas");
  }, [isCustomDriver, role]);
  const canSave = role === "passageiro"
    ? (isCustomDriver ? driverCustomName.trim().length > 0 : !!driverId)
    : (pax.some(paxValid) || includeCarCost);

  const save = () => {
    // Build trip object
    let trip;
    if (role === "passageiro" && !isCustomDriver && driverId) {
      // Passenger registering on driver's behalf → create pending motorista trip
      // Build passenger list: self + coPassengers
      const selfPax = {
        id: uid(), name: st.drivers.find(d => d.id === myId)?.name || myId,
        driverId: myId, paid, price: parsedTripPrice !== PRICE ? parsedTripPrice : undefined,
        direction: myDir !== "ambas" ? myDir : undefined, // self: only my stretch
      };
      const otherPaxList = pax.filter(paxValid).map(p => {
        const pp = parseFloat(p.price) || PRICE;
        const resolvedName = p.driverId
          ? (st.drivers.find(d => d.id === p.driverId)?.name || p.name.trim())
          : p.name.trim();
        return {
          id: p.id, name: resolvedName,
          driverId: p.driverId || undefined, paid: false,
          price: pp !== PRICE ? pp : undefined,
          direction: p.direction || undefined,
        };
      });
      trip = {
        id: uid(), date, weekStart: getMonday(date), direction: "ambas", role: "motorista",
        createdAt: Date.now(), registeredBy: myId,
        pendingConfirmation: true, driverOwnerId: driverId,
        passengers: [selfPax, ...otherPaxList],
        ...(note.trim() ? { note: note.trim().slice(0, 35), notePublic } : {}),
      };
    } else if (role === "passageiro" && isCustomDriver) {
      // Unknown driver — plain passageiro trip, no confirmation needed
      trip = {
        id: uid(), date, weekStart: getMonday(date), direction: myDir, role: "passageiro",
        createdAt: Date.now(), registeredBy: myId,
        driverName: driverCustomName.trim(),
        paid, price: parsedTripPrice !== PRICE ? parsedTripPrice : undefined,
        ...(note.trim() ? { note: note.trim().slice(0, 35), notePublic } : {}),
      };
    } else {
      // Motorista registering own trip (or admin override)
      trip = {
        id: uid(), date, weekStart: getMonday(date), direction: dir, role: "motorista",
        createdAt: Date.now(), registeredBy: myId,
        ...(overrideDriver ? { pendingConfirmation: true, driverOwnerId: overrideDriver } : {}),
        passengers: pax.filter(paxValid).map(p => {
          const pp = parseFloat(p.price) || PRICE;
          const resolvedName = p.driverId
            ? (st.drivers.find(d => d.id === p.driverId)?.name || p.name.trim())
            : p.name.trim();
          return {
            id: p.id, name: resolvedName,
            driverId: p.driverId || undefined, paid: p.paid,
            price: pp !== PRICE ? pp : undefined,
            direction: p.direction || undefined,
          };
        }),
        ...(includeCarCost ? { carCost: { gas: parsedCarGas, toll: parsedCarToll, paid: carCostPaid } } : {}),
        ...(note.trim() ? { note: note.trim().slice(0, 35), notePublic } : {}),
      };
    }
    // Allow multiple trips same day only if a different driver is already registered
    const effectiveDriver = trip.driverOwnerId || trip.registeredBy;
    const duplicate = st.trips.some(t => {
      if (t.role !== "motorista" || t.date !== date) return false;
      const tDriver = t.driverOwnerId || t.registeredBy;
      return tDriver === effectiveDriver; // same driver = duplicate
    });
    if (duplicate) {
      setToast(t("add_duplicate"));
      return;
    }
    upd({ ...st, trips: [trip, ...st.trips] });
    setTab("home");
  };

  const inp = { background: C.dim, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", color: C.text, fontSize: 15, width: "100%", outline: "none", fontFamily: "Barlow, sans-serif" };
  const cardS = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" };
  const lbl = { display: "block", color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 9 };

  return (
    <div>
      <div style={{ padding: "52px 20px 20px" }}>
        <button onClick={() => setTab("home")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 14, display: "flex", alignItems: "center", gap: 4 }}>
          {t("add_back")}
        </button>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: C.text }}>
          {t("add_title")}
        </h2>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Date */}
        <div style={cardS}>
          <label style={lbl}>{t("add_date")}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
        </div>



        {/* Role */}
        <div style={cardS}>
          <label style={lbl}>{t("add_role")}</label>
          <div style={{ display: "flex", gap: 6 }}>
            <Pill label={t("add_passenger")} active={role === "passageiro"} onClick={() => setRole("passageiro")} />
            <Pill label={t("add_driver")} active={role === "motorista"} onClick={() => setRole("motorista")} />
          </div>
        </div>

        {role === "passageiro" && (
          <div style={cardS}>
            <label style={lbl}>{t("add_who_drove")}</label>
            <select
              value={driverId}
              onChange={e => { setDriverId(e.target.value); setDriverCustomName(""); }}
              style={{ ...inp, cursor: "pointer" }}
            >
              {others.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              <option value="__other__">{t("add_other_driver")}</option>
            </select>
            {isCustomDriver && (
              <input
                value={driverCustomName}
                onChange={e => setDriverCustomName(e.target.value)}
                placeholder={t("add_driver_name_ph")}
                style={{ ...inp, marginTop: 8, borderColor: driverCustomName.trim() ? C.amber+"88" : C.border }}
                autoFocus
              />
            )}
            {!isCustomDriver && driverId && (
              <div style={{ fontSize: 11, color: C.muted, marginTop: 10, background: C.dim, borderRadius: 8, padding: "8px 10px" }}>
                ⚠️ {lang === "en" ? "This trip will require confirmation from the driver." : "Essa viagem precisará ser confirmada pelo motorista."}
              </div>
            )}
            {/* My own direction (can differ from trip direction) */}
            <div style={{ marginTop: 14 }}>
              <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{lang === "en" ? "My stretch" : "Meu trecho"}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["ida", t("add_leg_there")], ["volta", t("add_leg_back")], ["ambas", t("add_leg_both")]].map(([val, lbl2]) => (
                  <button key={val} onClick={() => setMyDir(val)}
                    style={{
                      flex: 1, background: myDir === val ? C.amberDim : "transparent",
                      color: myDir === val ? C.amber : C.muted,
                      border: `1px solid ${myDir === val ? C.amber+"55" : C.border}`,
                      borderRadius: 8, padding: "8px 4px", fontSize: 12, fontWeight: myDir === val ? 700 : 400,
                      cursor: "pointer", fontFamily: "Barlow, sans-serif",
                    }}>{lbl2}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t("price_per_stretch")}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.muted, fontSize: 14 }}>R$</span>
                  <input
                    type="number" min="0" step="1"
                    value={tripPriceVal}
                    onChange={e => setTripPriceVal(e.target.value)}
                    style={{ ...inp, width: 80, padding: "8px 10px", fontSize: 15, textAlign: "center",
                      borderColor: parsedTripPrice !== PRICE ? C.amber + "88" : C.border }}
                  />
                  {parsedTripPrice !== PRICE && <span style={{ color: C.amber, fontSize: 11 }}>valor customizado</span>}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: C.text, fontSize: 14 }}>
                {t("already_paid")} <strong style={{ color: C.amber }}>{R(parsedTripPrice * mult)}</strong>
              </span>
              <Toggle on={paid} onChange={setPaid} />
            </div>

            {/* Other passengers — only when known driver selected (will create pending motorista trip) */}
            {!isCustomDriver && driverId && (
              <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                      {t("add_passengers")}
                    </div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                      {t("including_you")}
                    </div>
                  </div>
                  {(() => {
                    // Self occupies a slot in each stretch they're doing
                    const selfIda   = myDir === "ida"   || myDir === "ambas" ? 1 : 0;
                    const selfVolta = myDir === "volta"  || myDir === "ambas" ? 1 : 0;
                    const pOccIda   = selfIda   + pax.filter(p => { const d = p.direction || "ambas"; return d === "ida"   || d === "ambas"; }).length;
                    const pOccVolta = selfVolta + pax.filter(p => { const d = p.direction || "volta" || d === "ambas"; return d === "volta" || d === "ambas"; }).length;
                    const canAdd = pOccIda < 4 || pOccVolta < 4;
                    const handleAdd = () => {
                      if (!canAdd) return;
                      const defDir = pOccIda >= 4 ? "volta" : pOccVolta >= 4 ? "ida" : null;
                      setPax(prev => [...prev, { id: uid(), name: "", driverId: "", paid: false, price: String(PRICE), direction: defDir }]);
                    };
                    return canAdd ? (
                      <button onClick={handleAdd} style={{ background: C.amberDim, border: `1px solid ${C.amber}44`, color: C.amber, borderRadius: 7, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
                        + {lang === "en" ? "Add" : "Adicionar"}
                      </button>
                    ) : (
                      <div style={{ fontSize: 10, color: C.muted }}>{lang === "en" ? "Max 4 per stretch" : "Máx. 4/trecho"}</div>
                    );
                  })()}
                </div>
                {pax.map((p, i) => {
                  const pp = parseFloat(p.price) || PRICE;
                  const isCustomPax = pp !== PRICE;
                  return (
                    <div key={p.id} style={{ background: C.dim, borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <select
                          value={p.driverId}
                          onChange={e => { const did = e.target.value; updPax(p.id, "driverId", did); if (did && did !== "__custom__") updPax(p.id, "name", ""); }}
                          style={{ ...inp, flex: 1, background: "transparent", border: `1px solid ${C.border}`, cursor: "pointer", padding: "8px 10px" }}
                        >
                          <option value="">{t("add_pax_select_ph")}</option>
                          {(() => {
                            const usedIds = new Set([
                              driverId,                                    // trip driver
                              myId,                                        // self (registering passenger)
                              ...pax.filter(px => px.id !== p.id && px.driverId && px.driverId !== "__custom__").map(px => px.driverId)
                            ]);
                            return st.drivers.filter(d => d.name && !usedIds.has(d.id)).map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ));
                          })()}
                          <option value="__custom__">{t("add_pax_other")}</option>
                        </select>
                        {pax.length > 0 && (
                          <button onClick={() => remPax(p.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 20, padding: 0, flexShrink: 0, lineHeight: 1 }}>×</button>
                        )}
                      </div>
                      {p.driverId === "__custom__" && (
                        <input value={p.name} onChange={e => updPax(p.id, "name", e.target.value)}
                          placeholder={t("add_pax_name_free_ph")}
                          autoFocus
                          style={{ ...inp, background: "transparent", border: `1px solid ${C.border}`, marginBottom: 6 }} />
                      )}
                      {/* Direction per pax */}
                      <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
                        {[["ida", t("add_leg_there")], ["volta", t("add_leg_back")], ["ambas", t("round_plus")]].map(([val, lbl2]) => {
                          const pDir2 = p.direction || dir;
                          const changed = p.direction && p.direction !== dir;
                          // Count this stretch excluding current pax (+ self for passageiro form)
                          const selfIda2   = myDir === "ida"   || myDir === "ambas" ? 1 : 0;
                          const selfVolta2 = myDir === "volta"  || myDir === "ambas" ? 1 : 0;
                          const othersIda   = selfIda2   + pax.filter(px => px.id !== p.id && (px.direction || "ambas") !== "volta").length;
                          const othersVolta = selfVolta2 + pax.filter(px => px.id !== p.id && (px.direction || "ambas") !== "ida").length;
                          const wouldFill = val === "ida" ? othersIda >= 4 : val === "volta" ? othersVolta >= 4 : (othersIda >= 4 || othersVolta >= 4);
                          const isActive = pDir2 === val;
                          return (
                            <button key={val}
                              disabled={!isActive && wouldFill}
                              onClick={() => !wouldFill && updPax(p.id, "direction", val === dir && !p.direction ? null : val)}
                              style={{
                                flex: 1, background: isActive ? (changed ? C.blue+"33" : C.amberDim) : "transparent",
                                color: isActive ? (changed ? C.blue : C.amber) : (wouldFill ? C.dim : C.muted),
                                border: `1px solid ${isActive ? (changed ? C.blue+"66" : C.amber+"55") : C.border}`,
                                borderRadius: 7, padding: "5px 2px", fontSize: 11, fontWeight: isActive ? 700 : 400,
                                cursor: (!isActive && wouldFill) ? "not-allowed" : "pointer",
                                fontFamily: "Barlow, sans-serif", opacity: (!isActive && wouldFill) ? 0.4 : 1,
                              }}>{lbl2}</button>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: C.muted }}>R$</span>
                        <input type="number" min="0" step="1" value={p.price}
                          onChange={e => updPax(p.id, "price", e.target.value)}
                          style={{ ...inp, width: 70, padding: "6px 8px", fontSize: 14, textAlign: "center",
                            borderColor: isCustomPax ? C.amber+"88" : C.border }} />
                        <span style={{ fontSize: 11, color: C.muted }}>{t("stretch_per")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {/* Motorista: passageiros */}
        {role === "motorista" && (
          <div style={cardS}>
            <label style={lbl}>{t("add_passengers")}</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pax.map((p, i) => {
                const pp = parseFloat(p.price) || PRICE;
                const isCustom = pp !== PRICE;
                const pDir = p.direction || dir;
                const pMult = pDir === "ambas" ? 2 : 1;
                const dirChanged = p.direction && p.direction !== dir;
                return (
                  <div key={p.id} style={{ background: C.dim, borderRadius: 10, padding: "10px 12px" }}>
                    {/* Name row */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      {others.length > 0 ? (
                        <select
                          value={p.driverId}
                          onChange={e => {
                            const did = e.target.value;
                            updPax(p.id, "driverId", did);
                            if (did) updPax(p.id, "name", "");
                          }}
                          style={{ ...inp, flex: 1, background: "transparent", border: `1px solid ${C.border}`, cursor: "pointer", padding: "9px 10px" }}
                        >
                          <option value="">{t("add_pax_select_ph")}</option>
                          {(() => {
                            const usedIds = new Set([
                              myId,
                              ...pax.filter(px => px.id !== p.id && px.driverId && px.driverId !== "__custom__").map(px => px.driverId)
                            ]);
                            return others.filter(d => !usedIds.has(d.id)).map(d => (
                              <option key={d.id} value={d.id}>{d.name} 🚗</option>
                            ));
                          })()}
                          <option value="__custom__">{t("add_pax_other")}</option>
                        </select>
                      ) : (
                        <input
                          value={p.name}
                          onChange={e => updPax(p.id, "name", e.target.value)}
                          placeholder={t("add_pax_name_ph", i + 1)}
                          style={{ ...inp, flex: 1, background: "transparent", border: `1px solid ${C.border}` }}
                        />
                      )}
                      {pax.length > 1 && (
                        <button onClick={() => remPax(p.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 20, padding: 0, flexShrink: 0, lineHeight: 1 }}>×</button>
                      )}
                    </div>
                    {/* Free text if "Outro" selected */}
                    {p.driverId === "__custom__" && (
                      <input
                        value={p.name}
                        onChange={e => updPax(p.id, "name", e.target.value)}
                        placeholder={t("add_pax_name_free_ph")}
                        style={{ ...inp, background: "transparent", border: `1px solid ${C.border}`, marginBottom: 8 }}
                      />
                    )}
                    {/* Direction row */}
                    <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                      {[["ida", t("add_leg_there")], ["volta", t("add_leg_back")], ["ambas", t("round_plus")]].map(([val, lbl2]) => {
                        const othersIda   = pax.filter(px => px.id !== p.id && (px.direction || dir) !== "volta").length;
                        const othersVolta = pax.filter(px => px.id !== p.id && (px.direction || dir) !== "ida").length;
                        const wouldFill = val === "ida" ? othersIda >= 4 : val === "volta" ? othersVolta >= 4 : (othersIda >= 4 || othersVolta >= 4);
                        const isActive = pDir === val;
                        return (
                          <button key={val}
                            disabled={!isActive && wouldFill}
                            onClick={() => !wouldFill && updPax(p.id, "direction", val === dir && !p.direction ? null : val)}
                            style={{
                              flex: 1, background: isActive ? (dirChanged ? C.blue + "33" : C.amberDim) : "transparent",
                              color: isActive ? (dirChanged ? C.blue : C.amber) : (wouldFill ? C.dim : C.muted),
                              border: `1px solid ${isActive ? (dirChanged ? C.blue + "66" : C.amber + "55") : C.border}`,
                              borderRadius: 7, padding: "5px 2px", fontSize: 11, fontWeight: isActive ? 700 : 400,
                              cursor: (!isActive && wouldFill) ? "not-allowed" : "pointer",
                              fontFamily: "Barlow, sans-serif", opacity: (!isActive && wouldFill) ? 0.4 : 1,
                            }}>{lbl2}</button>
                        );
                      })}
                    </div>
                    {/* Price + paid row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
                        <span style={{ color: C.muted, fontSize: 12 }}>R$</span>
                        <input
                          type="number" min="0" step="1"
                          value={p.price}
                          onChange={e => updPax(p.id, "price", e.target.value)}
                          style={{ ...inp, width: 65, padding: "5px 7px", fontSize: 14, textAlign: "center", background: "transparent",
                            border: `1px solid ${isCustom ? C.amber + "88" : C.border}`,
                            color: isCustom ? C.amber : C.text }}
                        />
                        <span style={{ color: C.muted, fontSize: 11 }}>{t("stretch_per")} · {lang === "en" ? "total" : "total"} <strong style={{ color: isCustom ? C.amber : C.text }}>{R(pp * pMult)}</strong></span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>{t("add_paid_label")}</span>
                        <Toggle on={p.paid} onChange={v => updPax(p.id, "paid", v)} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {canAddPax
                ? <button onClick={addPax} style={{ background: "transparent", border: `1px dashed ${C.border}`, borderRadius: 9, padding: "10px", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "Barlow, sans-serif" }}>
                    {t("add_add_pax")}
                  </button>
                : <div style={{ fontSize: 12, color: C.muted, textAlign: "center", padding: "8px", border: `1px dashed ${C.border}`, borderRadius: 9 }}>
                    {lang === "en" ? "Max 4 passengers per stretch" : "Máximo 4 passageiros por trecho"}
                  </div>
              }
            </div>
            {pax.filter(p => p.name.trim() || p.driverId).length > 0 && (
              <div style={{ marginTop: 12, color: C.amber, fontSize: 12 }}>
                {t("add_total_receive", R(pax.filter(p => p.name.trim() || (p.driverId && p.driverId !== "__custom__")).reduce((s, p) => { const pd = p.direction || dir; const pm = pd === "ambas" ? 2 : 1; return s + (parseFloat(p.price) || PRICE) * pm; }, 0)))}
              </div>
            )}
          </div>
        )}

        {/* Car cost card – only for motorista */}
        {role === "motorista" && (
          <div style={{ background: C.card, border: `1px solid ${includeCarCost ? "#7C5C2E55" : C.border}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: includeCarCost ? 14 : 0 }}>
              <div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{t("add_car_cost")}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{t("add_car_cost_sub")}</div>
              </div>
              <Toggle on={includeCarCost} onChange={setIncludeCarCost} />
            </div>
            {includeCarCost && (
              <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{t("add_fuel")}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ color: C.muted, fontSize: 12 }}>R$</span>
                      <input type="number" min="0" step="0.01" value={carGas} onChange={e => setCarGas(e.target.value)}
                        style={{ background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 14, width: "100%", outline: "none", fontFamily: "Barlow, sans-serif", textAlign: "center" }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{t("add_toll")}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ color: C.muted, fontSize: 12 }}>R$</span>
                      <input type="number" min="0" step="0.01" value={carToll} onChange={e => setCarToll(e.target.value)}
                        style={{ background: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 14, width: "100%", outline: "none", fontFamily: "Barlow, sans-serif", textAlign: "center" }} />
                    </div>
                  </div>
                </div>
                <div style={{ background: C.dim, borderRadius: 9, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: C.text }}>Total: <strong style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, color: "#F5A623" }}>R$&nbsp;{totalCarCost.toFixed(2)}</strong></span>
                  {myId === ADMIN_ID && <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>{t("add_car_cost_paid")}</span>
                    <Toggle on={carCostPaid} onChange={setCarCostPaid} />
                  </div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note field */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>{t("add_note")} <span style={{ color: C.dim, fontWeight: 400 }}>{lang === "en" ? "(optional)" : "(opcional)"}</span></label>
            <span style={{ fontSize: 11, color: note.length > 30 ? C.amber : C.muted }}>{note.length}/35</span>
          </div>
          <input
            value={note}
            onChange={e => setNote(e.target.value.slice(0, 35))}
            placeholder={t("add_note_ph")}
            maxLength={35}
            style={{ background: C.dim, border: `1px solid ${note ? C.amber+"44" : C.border}`, borderRadius: 9, padding: "9px 13px", color: C.text, fontSize: 13, width: "100%", outline: "none", fontFamily: "Barlow, sans-serif" }}
          />
          {note.trim() && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ fontSize: 12, color: notePublic ? C.text : C.muted }}>{t("note_visible_label")}</span>
              <Toggle on={notePublic} onChange={setNotePublic} />
            </div>
          )}
          {note.trim() && <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{notePublic ? t("note_public_hint") : t("note_visible_hint")}</div>}
        </div>

        {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
                <button onClick={save} disabled={!canSave} style={{
          background: canSave ? C.amber : C.dim,
          color: canSave ? "#000" : C.muted,
          border: "none", borderRadius: 13, padding: "15px 0",
          fontSize: 16, fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.8,
          cursor: canSave ? "pointer" : "not-allowed", width: "100%", textTransform: "uppercase",
        }}>
          {t("add_save")}
        </button>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

// ═══════════════════════════════════════════
//  SALDOS SCREEN
// ═══════════════════════════════════════════
function Saldos({ st, upd, myId, initialView }) {
  const lang = st?.lang || "pt";
  const t = mkT(lang);
  const [view, setView]     = useState(initialView || "saldos");
  const [expanded, setExpanded] = useState({});
  const [copiedPix, setCopiedPix] = useState(null);
  const thisWeek = getMonday(todayStr());
  const thisMonth = todayStr().slice(0, 7); // "YYYY-MM"

  // trips for balance calculation:
  // - All confirmed trips from current month
  // - Plus confirmed trips from prior months that still have unpaid amounts
  const allConfirmed = st.trips.filter(t => !t.pendingConfirmation);
  const trips = allConfirmed.filter(t => {
    const mon = t.date.slice(0, 7);
    if (mon === thisMonth) return true; // always show current month
    // Prior month: include only if there are pending amounts involving myId
    if (t.role === "passageiro" && t.registeredBy === myId && !t.paid) return true;
    if (t.role === "motorista" && t.registeredBy === myId &&
        (t.passengers||[]).some(p => !p.paid && p.driverId)) return true;
    if (t.role === "motorista" && t.registeredBy !== myId &&
        (t.passengers||[]).some(p => p.driverId === myId && !p.paid)) return true;
    return false;
  });

  const { driverNet, paxRecv, paxRecvd } = calcBalances(trips, myId);
  const dMap = Object.fromEntries(st.drivers.map(d => [d.id, d]));

  const totalIOwePending    = Object.values(driverNet).reduce((s, dn) => s + Math.max(0, dn.iOwe - dn.iOwePaid), 0);
  const totalTheyOwePending = (paxRecv - paxRecvd) + Object.values(driverNet).reduce((s, dn) => s + Math.max(0, dn.theyOwe - dn.theyOwePaid), 0);

  const markPaid    = (tripId) => upd({ ...st, trips: st.trips.map(t => t.id === tripId ? { ...t, paid: !t.paid } : t) });
  const markPaxPaid = (tripId, paxId) => upd({ ...st, trips: st.trips.map(t => t.id === tripId ? { ...t, passengers: t.passengers.map(p => p.id === paxId ? { ...p, paid: !p.paid } : p) } : t) });

  const cardS    = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" };
  const btnGreen = { background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, borderRadius: 7, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "Barlow, sans-serif", fontWeight: 600 };
  const toggleExp = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  const driverOrder = Object.fromEntries(st.drivers.map((d, i) => [d.id, i]));
  const allDriverIds = Object.keys(driverNet).sort((a, b) => (driverOrder[a] ?? 99) - (driverOrder[b] ?? 99));

  // ── Extrato data ────────────────────────────────────────────────────────
  const flowByWeek   = calcCashFlow(st.trips, myId);
  const flowTotals   = calcCashFlowTotals(st.trips, myId);
  // earnedCancelled: per-week netting — a pax's unpaid amount is "cancelled"
  // only if in THAT week the driver's net is >= 0 (same logic as TripCard/badge)
  const weekDnCache = {};
  const getWeekDn = (week) => {
    if (!weekDnCache[week]) {
      weekDnCache[week] = calcBalances(st.trips.filter(t => t.weekStart === week), myId).driverNet;
    }
    return weekDnCache[week];
  };
  const { driverNet: allDn } = calcBalances(st.trips, myId);
  const earnedCancelledTotal = st.trips
    .filter(t => t.role === "motorista")
    .reduce((s, t) => {
      const wdn = getWeekDn(t.weekStart);
      return s + (t.passengers || [])
        .filter(p => !p.paid && p.driverId && wdn[p.driverId] && netPending(wdn[p.driverId]) >= 0)
        .reduce((ps, p) => ps + paxPrice(p) * paxMult(p, t.direction), 0);
    }, 0);
  const flowWeeks    = Object.keys(flowByWeek).sort((a, b) => b.localeCompare(a));
  const thisMonthPfx = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const monthlyFlow  = {};
  Object.entries(flowByWeek).forEach(([week, v]) => {
    const mon = week.slice(0, 7);
    if (!monthlyFlow[mon]) monthlyFlow[mon] = { spent: 0, spentPaid: 0, spentPending: 0, earned: 0, earnedPaid: 0, earnedPending: 0, carCost: 0 };
    monthlyFlow[mon].spent         += v.spent;
    monthlyFlow[mon].spentPaid     += v.spentPaid || 0;
    monthlyFlow[mon].spentPending  += v.spentPending || 0;
    monthlyFlow[mon].earned        += v.earned;
    monthlyFlow[mon].earnedPaid    += v.earnedPaid || 0;
    monthlyFlow[mon].earnedPending += v.earnedPending || 0;
    monthlyFlow[mon].carCost       += v.carCost || 0;
  });

  const tabBtn = (val, label) => (
    <button key={val} onClick={() => setView(val)} style={{
      flex: 1, background: view === val ? C.amber : C.dim,
      color: view === val ? "#000" : C.muted,
      border: "none", borderRadius: 10, padding: "9px 0",
      fontSize: 13, fontWeight: view === val ? 700 : 400,
      cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
    }}>{label}</button>
  );


  return (
    <div>
      <div style={{ padding: "52px 20px 16px" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: C.text }}>{view === "extrato" ? t("nav_extratos") : t("saldos_title")}</h2>

      </div>

      {/* ── SALDOS VIEW ─────────────────────────────────────────────── */}
      {view === "saldos" && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <StatCard label={t("saldos_net_owe")} value={R(totalIOwePending)} color={totalIOwePending > 0 ? C.red : C.green} />
            <StatCard label={t("home_to_receive")} value={R(totalTheyOwePending)} color={totalTheyOwePending > 0 ? C.amber : C.green} />
          </div>

          {allDriverIds.length > 0 && (
            <div>
              <SectionLabel>{t("balance_with_drivers")}</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {allDriverIds.map(dId => {
                  const dn = driverNet[dId];
                  const iOwePending = Math.max(0, dn.iOwe - dn.iOwePaid);
                  const theyOwePending = Math.max(0, dn.theyOwe - dn.theyOwePaid);
                  const driver = dMap[dId];
                  const name = driver?.name || dId;
                  const isEven = iOwePending === 0 && theyOwePending === 0;
                  const theyOweMe = theyOwePending > 0 && iOwePending === 0;
                  const iOweThem = iOwePending > 0 && theyOwePending === 0;
                  const bothOwe = iOwePending > 0 && theyOwePending > 0;
                  // iOweTrips: trips where I (myId) owe dId — use trips (month filter)
                  const iOweTrips = trips.filter(t => {
                    if (t.pendingConfirmation) return false;
                    if (t.role === "passageiro" && t.registeredBy === myId && t.driverId === dId) return true;
                    if (t.role === "motorista" && t.registeredBy === dId && (t.passengers||[]).some(p => p.driverId === myId)) return true;
                    return false;
                  }).sort((a,b) => b.date.localeCompare(a.date));

                  // theyOweTrips: trips where dId owes me — use trips (month filter)
                  const theyOweTrips = trips.filter(t => {
                    if (t.pendingConfirmation) return false;
                    if (t.role === "passageiro" && t.registeredBy === dId && t.driverId === myId) return true;
                    if (t.role === "motorista" && t.registeredBy === myId && (t.passengers||[]).some(p => p.driverId === dId)) return true;
                    return false;
                  }).sort((a,b) => b.date.localeCompare(a.date));
                  // Credits: how many trechos myId has with dId (myId drove dId on unresolved trips)
                  const myCreditsWithDId = calcRideCredits(allConfirmed, myId)[dId] || 0;
                  // Credits dId has with myId (dId drove myId on unresolved trips)  
                  const dIdCreditsWithMe = calcRideCredits(allConfirmed, dId)[myId] || 0;

                  // settleWithRide: devedor (myId) uses their credits to settle a debt to dId
                  // The credit source: dId's unresolved trips where they drove myId
                  // We consume those trips FIFO (oldest first)
                  const handleSettleWithRide = (debtTrip, debtPaxEntry) => {
                    // debtTrip: the trip where dId drove myId and myId owes money
                    // We need to find which trips myId drove dId (creditor trips) and consume FIFO
                    const trechosNeeded = debtPaxEntry
                      ? paxMult(debtPaxEntry, debtTrip.direction) // pax entry for motorista trip
                      : paxMult(debtTrip, debtTrip.direction);   // passageiro trip
                    
                    // Trips where myId drove dId, still unresolved, sorted ASC (FIFO)
                    const creditTrips = allConfirmed
                      .filter(wt => !wt.pendingConfirmation && wt.role === "motorista"
                        && wt.registeredBy === myId
                        && (wt.passengers||[]).some(p => p.driverId === dId && !p.paid && !p.settledByRide))
                      .sort((a, b) => a.date.localeCompare(b.date));

                    let trechosLeft = trechosNeeded;
                    let updTrips = [...st.trips];

                    // Consume credit FIFO from creditTrips
                    for (const ct of creditTrips) {
                      if (trechosLeft <= 0) break;
                      const cp = ct.passengers.find(p => p.driverId === dId && !p.paid && !p.settledByRide);
                      if (!cp) continue;
                      const cpTrechos = paxMult(cp, ct.direction);
                      // Mark this credit passenger as settledByRide (their debt to myId is consumed)
                      const consume = Math.min(cpTrechos, trechosLeft);
                      trechosLeft -= consume;
                      const newSettle = consume >= cpTrechos ? true : "partial";
                      updTrips = updTrips.map(t => t.id !== ct.id ? t : {
                        ...t,
                        passengers: t.passengers.map(p => p.id !== cp.id ? p : { ...p, settledByRide: newSettle })
                      });
                    }

                    // Now mark the debt trip as settled (full or partial)
                    const settled = trechosLeft <= 0 ? true : "partial";
                    if (debtPaxEntry) {
                      // motorista trip: mark the specific pax entry
                      updTrips = updTrips.map(t => t.id !== debtTrip.id ? t : {
                        ...t,
                        passengers: t.passengers.map(p => p.id !== debtPaxEntry.id ? p : { ...p, settledByRide: settled })
                      });
                    } else {
                      // passageiro trip: mark the trip itself
                      updTrips = updTrips.map(t => t.id !== debtTrip.id ? t : { ...t, settledByRide: settled });
                    }
                    upd({ ...st, trips: updTrips });
                  };

                  // Undo ride settlement — restore settledByRide = false on debt trip AND credit trips
                  const handleUndoSettle = (debtTrip, debtPaxEntry) => {
                    // Clear settledByRide on the debt entry
                    let updTrips = st.trips.map(t => {
                      if (t.id !== debtTrip.id) return t;
                      if (debtPaxEntry) {
                        return { ...t, passengers: t.passengers.map(p => p.id !== debtPaxEntry.id ? p : { ...p, settledByRide: undefined }) };
                      }
                      const { settledByRide: _, ...rest } = t;
                      return rest;
                    });
                    // Also clear settledByRide on credit trips (myId drove dId) that were consumed
                    // Re-identify: trips where myId drove dId, now have settledByRide set
                    updTrips = updTrips.map(t => {
                      if (t.role !== "motorista" || t.registeredBy !== myId) return t;
                      const hasCredited = (t.passengers||[]).some(p => p.driverId === dId && p.settledByRide);
                      if (!hasCredited) return t;
                      return { ...t, passengers: t.passengers.map(p =>
                        p.driverId === dId && p.settledByRide ? { ...p, settledByRide: undefined } : p
                      )};
                    });
                    upd({ ...st, trips: updTrips });
                  };

                  const borderCol = isEven ? C.green + "44" : bothOwe ? C.amber + "44" : iOweThem ? C.red + "33" : C.amber + "33";
                  const isOpen = expanded[dId];
                  return (
                    <div key={dId} style={{ background: C.card, border: `1px solid ${borderCol}`, borderRadius: 14, overflow: "hidden" }}>
                      <div onClick={() => toggleExp(dId)} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                        <div>
                          <div style={{ fontSize: 16, color: C.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            {name}
                            {isEven && <span style={{ background: C.green, color: "#000", fontSize: 9, fontWeight: 700, borderRadius: 5, padding: "2px 7px", letterSpacing: 0.5 }}>QUITES ✓</span>}
                            <span style={{ fontSize: 11, fontWeight: 600, color: myCreditsWithDId > 0 ? C.green : C.muted, background: myCreditsWithDId > 0 ? C.greenDim : C.dim, borderRadius: 5, padding: "2px 7px" }}>
                              {myCreditsWithDId > 0 ? `${myCreditsWithDId} trecho${myCreditsWithDId !== 1 ? "s" : ""} ✓` : `0 trechos`}
                            </span>
                          </div>
                          {driver?.pix && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const text = driver.pix;
                                  const tryExecCommand = () => {
                                    const ta = document.createElement("textarea");
                                    ta.value = text;
                                    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
                                    document.body.appendChild(ta);
                                    ta.focus(); ta.select();
                                    const ok = document.execCommand("copy");
                                    document.body.removeChild(ta);
                                    return ok;
                                  };
                                  const done = () => { setCopiedPix(dId); setTimeout(() => setCopiedPix(null), 2000); };
                                  if (navigator.clipboard && navigator.clipboard.writeText) {
                                    navigator.clipboard.writeText(text).then(done).catch(() => { if (tryExecCommand()) done(); });
                                  } else {
                                    if (tryExecCommand()) done();
                                  }
                                }}
                                style={{ background: copiedPix === dId ? C.greenDim : C.dim, border: `1px solid ${copiedPix === dId ? C.green+"44" : C.border}`, color: copiedPix === dId ? C.green : C.muted, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>
                                {copiedPix === dId ? t("saldos_pix_copied") : t("copy_pix_btn")}
                              </button>
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
                            {dn.iOwe > 0 && <span>{t("you_rode_amount", R(dn.iOwe))}</span>}
                            {dn.iOwe > 0 && dn.theyOwe > 0 && <span style={{ margin: "0 5px" }}>·</span>}
                            {dn.theyOwe > 0 && <span>{t("they_rode_amount", R(dn.theyOwe))}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {isEven
                            ? <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, color: C.green }}>R$&nbsp;0</div>
                            : bothOwe
                            ? <div>
                                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, color: C.red }}>
                                  −{R(iOwePending)}
                                </div>
                                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{t("you_owe_them", name)}</div>
                              </div>
                            : <div>
                                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, color: iOweThem ? C.red : C.amber }}>
                                  {iOweThem ? "−" : "+"}{R(iOweThem ? iOwePending : theyOwePending)}
                                </div>
                                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                                  {iOweThem ? t("you_owe_them", name) : t("they_owe_you", name)}
                                </div>
                              </div>
                          }
                          <div style={{ color: C.muted, fontSize: 11, paddingTop: 4 }}>{isOpen ? "▲" : "▼"}</div>
                        </div>
                      </div>
                      {isOpen && (
                        <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                          {iOweTrips.length > 0 && (
                            <div>
                              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{t("rode_with", name)}</div>
                              {iOweTrips.map(tr => {
                                let myPaid, myAmt, myDir, myPaxEntry, mySettled;
                                if (tr.role === "passageiro" && tr.registeredBy === myId) {
                                  const x = tr.direction === "ambas" ? 2 : 1;
                                  myPaid = tr.paid; myAmt = tripPrice(tr) * x; myDir = tr.direction;
                                  mySettled = tr.settledByRide;
                                } else {
                                  myPaxEntry = (tr.passengers||[]).find(p => p.driverId === myId);
                                  if (!myPaxEntry) return null;
                                  myDir = myPaxEntry.direction || tr.direction;
                                  myPaid = myPaxEntry.paid;
                                  myAmt = paxPrice(myPaxEntry) * paxMult(myPaxEntry, tr.direction);
                                  mySettled = myPaxEntry.settledByRide;
                                }
                                const isResolved = myPaid || mySettled === true;
                                const isPartial = mySettled === "partial";
                                const trechosNeeded = myPaxEntry ? paxMult(myPaxEntry, tr.direction) : paxMult(tr, tr.direction);
                                const canSettle = !isResolved && !isPartial && myCreditsWithDId >= 1;
                                const canSettlePartial = !isResolved && !isPartial && myCreditsWithDId > 0 && myCreditsWithDId < trechosNeeded;
                                const rowColor = (isResolved || isPartial) ? C.muted : C.text;
                                return (
                                  <div key={tr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.dim}` }}>
                                    <div style={{ fontSize: 13, color: rowColor }}>
                                      <span style={{ color: C.amber, fontWeight: 600, marginRight: 4 }}>{weekday(tr.date, lang)}</span>{fmtFull(tr.date)} · {DIR(lang)[myDir]}
                                      {myPaid && <span style={{ color: C.green, marginLeft: 6, fontSize: 11 }}>{t("paid_label_short")}</span>}
                                      {mySettled === true && <><span style={{ color: C.green, marginLeft: 6, fontSize: 11 }}>{t("trip_quitado")}</span><button onClick={() => handleUndoSettle(tr, myPaxEntry || null)} style={{ marginLeft: 6, background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 5, padding: "1px 7px", fontSize: 10, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>{t("undo_settle")}</button></> }
                                      {mySettled === "partial" && <><span style={{ color: C.amber, marginLeft: 6, fontSize: 11 }}>{t("trip_partial_ride")}</span><button onClick={() => handleUndoSettle(tr, myPaxEntry || null)} style={{ marginLeft: 6, background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 5, padding: "1px 7px", fontSize: 10, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>{t("undo_settle")}</button></> }
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: isResolved ? C.muted : isPartial ? C.amber : C.red }}>{R(myAmt)}</span>
                                      {!isResolved && !isPartial && tr.role === "passageiro" && myPaid === false && <button onClick={() => markPaid(tr.id)} style={btnGreen}>{t("extrato_pay")}</button>}
                                      {(canSettle || canSettlePartial) && <button onClick={() => handleSettleWithRide(tr, myPaxEntry || null)} style={{ background: C.amberDim, border: `1px solid ${C.amber}44`, color: C.amber, borderRadius: 7, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>{t("settle_with_ride")}</button>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {theyOweTrips.length > 0 && (
                            <div>
                              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{t("drove_for", name)}</div>
                              {theyOweTrips.map(trip => {
                                if (trip.role === "passageiro" && trip.registeredBy === dId && trip.driverId === myId) {
                                  const x = trip.direction === "ambas" ? 2 : 1;
                                  const settled = trip.settledByRide;
                                  return (
                                    <div key={trip.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.dim}` }}>
                                      <div style={{ fontSize: 13, color: (trip.paid || settled) ? C.muted : C.text }}>
                                        <span style={{ color: C.amber, fontWeight: 600, marginRight: 4 }}>{weekday(trip.date, lang)}</span>{fmtFull(trip.date)} · {DIR(lang)[trip.direction]}
                                        {trip.paid && <span style={{ color: C.green, marginLeft: 6, fontSize: 11 }}>{t("received_label_short")}</span>}
                                        {settled === true && <span style={{ color: C.green, marginLeft: 6, fontSize: 11 }}>{t("trip_quitado")}</span>}
                                        {settled === "partial" && <span style={{ color: C.amber, marginLeft: 6, fontSize: 11 }}>{t("trip_partial_ride")}</span>}
                                      </div>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: (trip.paid || settled === true) ? C.muted : C.amber }}>{R(tripPrice(trip) * x)}</span>
                                      </div>
                                    </div>
                                  );
                                }
                                const pax = (trip.passengers || []).filter(p => p.driverId === dId);
                                return pax.map(p => {
                                  const pm = paxMult(p, trip.direction);
                                  const pDir = p.direction || trip.direction;
                                  const settled = p.settledByRide;
                                  return (
                                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.dim}` }}>
                                      <div style={{ fontSize: 13, color: (p.paid || settled) ? C.muted : C.text }}>
                                        <span style={{ color: C.amber, fontWeight: 600, marginRight: 4 }}>{weekday(trip.date, lang)}</span>{fmtFull(trip.date)} · {DIR(lang)[pDir]}
                                        {p.paid && <span style={{ color: C.green, marginLeft: 6, fontSize: 11 }}>{t("received_label_short")}</span>}
                                        {settled === true && <span style={{ color: C.green, marginLeft: 6, fontSize: 11 }}>{t("trip_quitado")}</span>}
                                        {settled === "partial" && <span style={{ color: C.amber, marginLeft: 6, fontSize: 11 }}>{t("trip_partial_ride")}</span>}
                                      </div>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: (p.paid || settled === true) ? C.muted : settled === "partial" ? C.amber : C.amber }}>{R(paxPrice(p) * pm)}</span>
                                        {!settled && <button onClick={() => markPaxPaid(trip.id, p.id)} style={{
                                          background: p.paid ? C.greenDim : C.dim,
                                          border: `1px solid ${p.paid ? C.green+"44" : C.border}`,
                                          color: p.paid ? C.green : C.muted,
                                          borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600,
                                          cursor: "pointer", fontFamily: "Barlow, sans-serif", flexShrink: 0,
                                        }}>{p.paid ? t("trip_received") : t("trip_mark_received")}</button>}
                                      </div>
                                    </div>
                                  );
                                });
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {paxRecv > 0 && (() => {
            const paxTrips = trips.filter(t => t.role === "motorista" && t.registeredBy === myId && (t.passengers||[]).some(p => (!p.driverId || p.driverId === "__custom__") && !p.paid));
            if (!paxTrips.length) return null;
            return (
              <div>
                <SectionLabel>{t("extrato_received")} — {t("saldos_pax_others")}</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {paxTrips.sort((a, b) => b.date.localeCompare(a.date)).map(trip => {
                    const paxList = (trip.passengers||[]).filter(p => !p.driverId || p.driverId === "__custom__");
                    return (
                      <div key={trip.id} style={cardS}>
                        <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}><span style={{ color: C.amber, fontWeight: 600, marginRight: 4 }}>{weekday(trip.date, lang)}</span>{fmtFull(trip.date)} · {DIR(lang)[trip.direction]}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {paxList.map(p => {
                            const pm = paxMult(p, trip.direction);
                            const pDir = p.direction || trip.direction;
                            return (
                              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontSize: 14, color: p.paid ? C.muted : C.text }}>
                                  {p.name}
                                  <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                                    {p.direction && p.direction !== trip.direction && <span style={{ color: C.blue, fontSize: 10, background: C.blue+"18", borderRadius: 4, padding: "1px 5px" }}>{DIR(lang)[pDir]}</span>}
                                    {paxPrice(p) !== PRICE && <span style={{ color: C.amber, fontSize: 10, background: C.amberDim, borderRadius: 4, padding: "1px 5px" }}>{`R$${paxPrice(p)}`}{t("stretch_per")}</span>}
                                  </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: p.paid ? C.green : C.amber }}>{R(paxPrice(p) * pm)}</span>
                                  <button onClick={() => markPaxPaid(trip.id, p.id)} style={{
                                    background: p.paid ? C.greenDim : C.dim,
                                    border: `1px solid ${p.paid ? C.green+"44" : C.border}`,
                                    color: p.paid ? C.green : C.muted,
                                    borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600,
                                    cursor: "pointer", fontFamily: "Barlow, sans-serif", flexShrink: 0,
                                  }}>{p.paid ? t("trip_received") : t("trip_mark_received")}</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {totalIOwePending === 0 && totalTheyOwePending === 0 && trips.length > 0 && (
            <div style={{ ...cardS, textAlign: "center", padding: "32px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <div style={{ color: C.green, fontSize: 15, fontWeight: 600 }}>{t("all_clear")}</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{lang === "en" ? "No pending amounts this month." : "Nenhum valor pendente neste mês."}</div>
            </div>
          )}
          {trips.length === 0 && <EmptyState icon="💸" text={t("no_trips_any")} />}
        </div>
      )}

      {/* ── EXTRATO VIEW ────────────────────────────────────────────── */}
      {view === "extrato" && (() => {
        const carExpenses = {};
        st.trips.filter(t => !t.pendingConfirmation && t.registeredBy === myId).forEach(t => {
          if (t.role === "motorista" && t.carCost) {
            const mon = t.weekStart.slice(0, 7);
            if (!carExpenses[mon]) carExpenses[mon] = { total: 0, paid: 0 };
            const cc = carCostTotal(t);
            carExpenses[mon].total += cc;
            if (t.carCost.paid) carExpenses[mon].paid += cc;
          }
        });
        const markCarPaid   = (tripId) => upd({ ...st, trips: st.trips.map(t => t.id === tripId && t.carCost ? { ...t, carCost: { ...t.carCost, paid: true  } } : t) });
        const unmarkCarPaid = (tripId) => upd({ ...st, trips: st.trips.map(t => t.id === tripId && t.carCost ? { ...t, carCost: { ...t.carCost, paid: false } } : t) });
        const totalCarDebt = Object.values(carExpenses).reduce((s, v) => s + v.total - v.paid, 0);

        return (
          <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Acumulado total */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px 14px" }}>
              <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 14 }}>{lang === "en" ? "Grand total — real money" : "Acumulado total — dinheiro real"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: C.dim, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ color: C.muted, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>{t("extrato_paid_rides")}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: C.red }}>{R(flowTotals.spentPaid)}</div>
                  {flowTotals.spentPending > 0 && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{t("pending_short", R(flowTotals.spentPending))}</div>}
                </div>
                <div style={{ background: C.dim, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ color: C.muted, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>{t("extrato_received")}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: C.green }}>{R(flowTotals.earnedPaid)}</div>
                  {(flowTotals.earnedPending - earnedCancelledTotal) > 0 && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{`${R(flowTotals.earnedPending - earnedCancelledTotal)} ${lang === "en" ? "to receive" : "a receber"}`}</div>}
                  {earnedCancelledTotal > 0 && <div style={{ fontSize: 10, color: C.green, marginTop: 2 }}>{t("cancelled_carona_short", R(earnedCancelledTotal))}</div>}
                </div>
                <div style={{ background: C.dim, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ color: C.muted, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>{t("car_cost_short")}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: C.red }}>{R(flowTotals.carCost)}</div>
                  {myId === ADMIN_ID && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{t("paid_short", R(flowTotals.carCostPaid))} · {t("pending_short", R(flowTotals.carCost - flowTotals.carCostPaid))}</div>}
                </div>
                <div style={{ background: flowTotals.net > 0 ? C.redDim : C.greenDim, border: `1px solid ${flowTotals.net > 0 ? C.red+"33" : C.green+"33"}`, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ color: C.muted, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>{t("real_cost")}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: C.red }}>
                    {flowTotals.net <= 0 ? R(0) : R(flowTotals.net)}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{lang === "en" ? "paid + car − received" : "paguei + carro − recebi"}</div>
                </div>
              </div>
            </div>
            {/* Gastos com o carro */}
            {Object.keys(carExpenses).length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.3, textTransform: "uppercase" }}>{t("extrato_mom")}</div>
                    {myId === ADMIN_ID && st.pixMae && <CopyPixMaeBtn pix={st.pixMae} />}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {myId === ADMIN_ID
                        ? (totalCarDebt > 0
                          ? <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: "#F5A623" }}>{t("pending_short", R(totalCarDebt))}</span>
                          : <span style={{ color: C.green, fontSize: 13, fontWeight: 600 }}>{lang === "en" ? "✓ All paid" : "✓ Tudo pago"}</span>)
                        : <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: C.red }}>{R(Object.values(carExpenses).reduce((s,v)=>s+v.total,0))}</span>
                      }
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(carExpenses).sort((a, b) => b[0].localeCompare(a[0])).map(([mon, v]) => {
                    const pending = v.total - v.paid;
                    const [y, m2] = mon.split("-");
                    const monthName = new Date(Number(y), Number(m2) - 1).toLocaleString(lang === "en" ? "en-US" : "pt-BR", { month: "long", year: "numeric" });
                    const isCurrent = mon === thisMonthPfx;
                    const isOpen = expanded["car_"+mon];
                    const monTrips = st.trips.filter(t => t.role === "motorista" && t.registeredBy === myId && t.carCost && t.weekStart.slice(0,7) === mon);
                    return (
                      <div key={mon} style={{ background: C.card, border: `1px solid ${myId === ADMIN_ID ? (pending > 0 ? "#F5A62333" : C.green+"44") : "#F5A62333"}`, borderRadius: 12, overflow: "hidden" }}>
                        <button onClick={() => toggleExp("car_"+mon)} style={{ width: "100%", background: "none", border: "none", padding: "13px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ textAlign: "left" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 14, color: C.text, fontWeight: 600, textTransform: "capitalize" }}>{monthName}</span>
                              {isCurrent && <span style={{ background: C.amber, color: "#000", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>{lang === "en" ? "CURRENT" : "ATUAL"}</span>}
                              {myId === ADMIN_ID && pending === 0 && <span style={{ background: C.green, color: "#000", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>{t("extrato_badge_paid")}</span>}
                            </div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                              {t("days_as_driver", monTrips.length, R(v.total))}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: pending > 0 ? "#F5A623" : C.green }}>
                              {pending > 0 ? R(pending) : "R$ 0"}
                            </div>
                            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{isOpen ? "▲" : "▼"}</div>
                          </div>
                        </button>
                        {isOpen && (
                          <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                            {monTrips.sort((a, b) => b.date.localeCompare(a.date)).map(tr => {
                              const cc = carCostTotal(tr);
                              return (
                                <div key={tr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.dim}` }}>
                                  <div>
                                    <div style={{ fontSize: 13, color: myId === ADMIN_ID ? (tr.carCost.paid ? C.muted : C.text) : C.text }}><span style={{ color: C.amber, fontWeight: 600, marginRight: 4 }}>{weekday(tr.date, lang)}</span>{fmtFull(tr.date)} · {DIR(lang)[tr.direction]}</div>
                                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                                      ⛽ {R(tr.carCost.gas)} + 🛣️ {R(tr.carCost.toll)}
                                      {myId === ADMIN_ID && tr.carCost.paid && <span style={{ color: C.green, marginLeft: 6 }}>{t("paid_label_short")}</span>}
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: myId === ADMIN_ID ? (tr.carCost.paid ? C.muted : "#F5A623") : "#F5A623" }}>{R(cc)}</span>
                                    {myId === ADMIN_ID && <button onClick={() => tr.carCost.paid ? unmarkCarPaid(tr.id) : markCarPaid(tr.id)}
                                      style={{ background: tr.carCost.paid ? C.dim : C.greenDim, border: `1px solid ${tr.carCost.paid ? C.border : C.green+"44"}`, color: tr.carCost.paid ? C.muted : C.green, borderRadius: 7, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "Barlow, sans-serif", fontWeight: 600 }}>
                                      {tr.carCost.paid ? t("extrato_undo") : t("extrato_pay")}
                                    </button>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fluxo por mês */}
            {Object.keys(monthlyFlow).length > 0 && (
              <div>
                <SectionLabel>{lang === "en" ? "Monthly flow" : "Fluxo por mês"}</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Object.entries(monthlyFlow).sort((a, b) => b[0].localeCompare(a[0])).map(([mon, v]) => {
                    const net = (v.spentPaid || 0) + (v.carCost || 0) - (v.earnedPaid || 0);
                    const totalOut = v.spent + v.carCost;
                    const [y, m2] = mon.split("-");
                    const monthName = new Date(Number(y), Number(m2) - 1).toLocaleString(lang === "en" ? "en-US" : "pt-BR", { month: "long", year: "numeric" });
                    const pct = totalOut > 0 ? Math.min(100, Math.round((v.earned / totalOut) * 100)) : 0;
                    const isCurrent = mon === thisMonthPfx;
                    const monEarnedCancelled = st.trips
                      .filter(t => t.role === "motorista" && t.weekStart.slice(0,7) === mon)
                      .reduce((s, t) => {
                        const wdn = getWeekDn(t.weekStart);
                        return s + (t.passengers || [])
                          .filter(p => !p.paid && p.driverId && wdn[p.driverId] && netPending(wdn[p.driverId]) >= 0)
                          .reduce((ps, p) => ps + paxPrice(p) * paxMult(p, t.direction), 0);
                      }, 0);
                    const earnedPendingReal = (v.earnedPending || 0) - monEarnedCancelled;
                    return (
                      <div key={mon} style={{ background: C.card, border: `1px solid ${isCurrent ? C.amber+"44" : C.border}`, borderRadius: 12, padding: "12px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14, color: C.text, fontWeight: 600, textTransform: "capitalize" }}>{monthName}</span>
                            {isCurrent && <span style={{ background: C.amber, color: "#000", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>{lang === "en" ? "CURRENT" : "ATUAL"}</span>}
                          </div>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: net <= 0 ? C.green : C.red }}>
                            {net <= 0 ? "R$ 0" : R(net)} <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>{t("real_cost")}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: totalOut > 0 ? 8 : 0 }}>
                          {v.spent  > 0 && <span style={{ fontSize: 12, color: C.muted }}>🪑 {R(v.spent)}</span>}
                          {v.carCost > 0 && <span style={{ fontSize: 12, color: "#F5A623" }}>⛽ {R(v.carCost)}</span>}
                          {v.earned > 0 && (
                            <span style={{ fontSize: 12, color: C.green }}>
                              ↑ {R(v.earned)}
                              {earnedPendingReal > 0 && (
                                <span style={{ color: C.muted }}> ({t("received_short", R(v.earnedPaid || 0))})</span>
                              )}
                            </span>
                          )}
                        </div>
                        {totalOut > 0 && (
                          <div>
                            <div style={{ height: 5, borderRadius: 3, background: C.dim, overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: C.green }} />
                            </div>
                            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{t("pct_covered", pct)}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Por semana */}
            {flowWeeks.length > 0 && (
              <div>
                <SectionLabel>{t("by_week_label")}</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {flowWeeks.map(week => {
                    const v = flowByWeek[week];
                    const net = (v.spentPaid || 0) + (v.carCost || 0) - (v.earnedPaid || 0);
                    const isCurrent = week === thisWeek;
                    // Use calcBalances netting to find true pending after mutual rides cancel out
                    const weekTripsForBadge = st.trips.filter(t => t.weekStart === week);
                    const { driverNet: wdn, paxRecv: wpr, paxRecvd: wprd } = calcBalances(weekTripsForBadge, myId);
                    const realIOwePending    = Object.values(wdn).reduce((s, dn) => { const n = netPending(dn); return n < 0 ? s + Math.abs(n) : s; }, 0);
                    const realTheyOwePending = (wpr - wprd) + Object.values(wdn).reduce((s, dn) => { const n = netPending(dn); return n > 0 ? s + n : s; }, 0);
                    const hasAnyUnpaid = v.spentPending > 0 || v.earnedPending > 0;
                    const hasRealDebt     = realIOwePending > 0 || realTheyOwePending > 0;
                    const cancelledByRide = hasAnyUnpaid && !hasRealDebt;
                    // earnedPending that is cancelled by mutual rides (net >= 0 for that driver)
                    const weekEarnedCancelled = weekTripsForBadge
                      .filter(t => t.role === "motorista")
                      .reduce((s, t) => s + (t.passengers || [])
                        .filter(p => !p.paid && p.driverId && wdn[p.driverId] && netPending(wdn[p.driverId]) >= 0)
                        .reduce((ps, p) => ps + paxPrice(p) * paxMult(p, t.direction), 0), 0);
                    const earnedPendingReal = (v.earnedPending || 0) - weekEarnedCancelled;
                    return (
                      <div key={week} style={{ background: C.card, border: `1px solid ${isCurrent ? C.amber+"44" : cancelledByRide ? C.green+"33" : C.border}`, borderRadius: 12, padding: "12px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{weekLabel(week)}</span>
                            {isCurrent && <span style={{ background: C.amber, color: "#000", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>{lang === "en" ? "CURRENT" : "ATUAL"}</span>}
                            {cancelledByRide && <span style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>{t("extrato_badge_quitado")}</span>}
                            {hasRealDebt && <span style={{ background: C.redDim, border: `1px solid ${C.red}33`, color: C.red, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>{t("extrato_badge_pending")}</span>}
                          </div>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: net <= 0 ? C.green : C.red, flexShrink: 0, marginLeft: 8 }}>
                            {net <= 0 ? "R$ 0,00" : R(net)}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {v.spent > 0 && (
                            <span style={{ fontSize: 12, color: C.muted }}>
                              {"🪑 "}
                              {v.spentPending > 0
                                ? <><span style={{ color: C.red }}>{R(v.spent)}</span>{v.spentPaid > 0 && <span style={{ fontSize: 10 }}> ({t("paid_short", R(v.spentPaid))})</span>}</>
                                : R(v.spentPaid)}
                            </span>
                          )}
                          {v.carCost > 0 && <span style={{ fontSize: 12, color: "#F5A623" }}>{"⛽ "}{R(v.carCost)}</span>}
                          {v.earned > 0 && (
                            <span style={{ fontSize: 12, color: earnedPendingReal > 0 ? C.muted : C.green }}>
                              {"↑ "}
                              {earnedPendingReal > 0
                                ? <><span style={{ color: C.green }}>{R(v.earned)}</span>{v.earnedPaid > 0 && <span style={{ fontSize: 10 }}> ({t("received_short", R(v.earnedPaid))})</span>}</>
                                : R(v.earnedPaid)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {flowWeeks.length === 0 && <EmptyState icon="📊" text={t("extrato_empty")} />}
          </div>
        );
      })()}

      <div style={{ height: 20 }} />
    </div>
  );
}


// ═══════════════════════════════════════════
//  EXTRATO SCREEN (wraps Saldos with extrato view)
// ═══════════════════════════════════════════
function Extrato({ st, upd, myId }) {
  return <Saldos st={st} upd={upd} myId={myId} initialView="extrato" />;
}

// ═══════════════════════════════════════════
//  HISTORY SCREEN
// ═══════════════════════════════════════════
function Hist({ st, upd, myId }) {
  const lang = st?.lang || "pt";
  const t = mkT(lang);
  const thisWeek = getMonday(todayStr());
  const [expanded, setExpanded] = useState(null);

  const byWeek = {};
  st.trips.forEach(t => {
    if (!byWeek[t.weekStart]) byWeek[t.weekStart] = [];
    byWeek[t.weekStart].push(t);
  });
  const weeks = Object.keys(byWeek).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <div style={{ padding: "52px 20px 20px" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: C.text }}>{t("hist_title")}</h2>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {weeks.map(week => {
          const trips = byWeek[week];
          const { driverNet, paxRecv, paxRecvd } = calcBalances(trips, myId);
          const owedTotal    = Object.values(driverNet).reduce((s, dn) => s + Math.max(0, dn.iOwe - dn.iOwePaid), 0);
          const pendingTotal = (paxRecv - paxRecvd) + Object.values(driverNet).reduce((s, dn) => s + Math.max(0, dn.theyOwe - dn.theyOwePaid), 0);
          const isCurrent = week === thisWeek;
          const isOpen = expanded === week;

          return (
            <div key={week} style={{ background: C.card, border: `1px solid ${isCurrent ? C.amber + "55" : C.border}`, borderRadius: 14, overflow: "hidden" }}>
              <button
                onClick={() => setExpanded(isOpen ? null : week)}
                style={{ width: "100%", background: "none", border: "none", padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: C.text }}>{weekLabel(week)}</span>
                    {isCurrent && <span style={{ background: C.amber, color: "#000", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5 }}>{lang === "en" ? "CURRENT" : "ATUAL"}</span>}
                  </div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>{t("hist_trips_n", trips.length)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {owedTotal > 0 && <div style={{ color: C.red, fontSize: 13, fontWeight: 600 }}>−{R(owedTotal)}</div>}
                  {pendingTotal > 0 && <div style={{ color: C.amber, fontSize: 13, fontWeight: 600 }}>{lang === "en" ? `+${R(pendingTotal)} to receive` : `+${R(pendingTotal)} a receber`}</div>}
                  {owedTotal === 0 && pendingTotal === 0 && <div style={{ color: C.green, fontSize: 13 }}>✓ Zerado</div>}
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{isOpen ? "▲" : "▼"}</div>
                </div>
              </button>

              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[...trips].sort((a, b) => b.date.localeCompare(a.date)).map(t => (
                    <TripCard key={t.id} trip={t} st={st} upd={upd} readOnly weekDn={driverNet} weekTrips={trips} allTrips={st.trips.filter(t => !t.pendingConfirmation)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {weeks.length === 0 && <EmptyState icon="📅" text={t("hist_empty")} />}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

// ═══════════════════════════════════════════
//  OPCOES SCREEN
// ═══════════════════════════════════════════

function CopyPixMaeBtn({ pix }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(pix).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    } else {
      const ta = document.createElement("textarea"); ta.value = pix;
      ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta);
      ta.focus(); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button onClick={copy} style={{ background: copied ? C.greenDim : C.dim, border: `1px solid ${copied ? C.green+"44" : C.border}`, color: copied ? C.green : C.muted, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif" }}>
      {copied ? "✓ Pix copiado" : "Copiar Pix mãe"}
    </button>
  );
}

function PixMaeCard({ st, upd, inp, lbl, cardS }) {
  const [mae, setMae] = React.useState(st.pixMae || "");
  const [saved, setSaved] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const save = () => { upd({ ...st, pixMae: mae.trim() }); setSaved(true); setTimeout(() => setSaved(false), 1500); };
  const copy = () => {
    const txt = mae.trim();
    if (!txt) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    } else {
      const ta = document.createElement("textarea"); ta.value = txt;
      ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta);
      ta.focus(); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div style={cardS}>
      <label style={lbl}>Pix da mãe</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={mae} onChange={e => { setMae(e.target.value); setSaved(false); }}
          placeholder="Chave Pix"
          style={{ ...inp, flex: 1, padding: "9px 12px", fontSize: 14 }} />
        {mae.trim() && <button onClick={copy} style={{ background: copied ? C.greenDim : C.dim, border: `1px solid ${copied ? C.green+"44" : C.border}`, color: copied ? C.green : C.muted, borderRadius: 8, padding: "10px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>
          {copied ? "✓ Copiado" : "Copiar"}
        </button>}
      </div>
      <button onClick={save} style={{ marginTop: 10, background: saved ? C.greenDim : C.amberDim, color: saved ? C.green : C.amber, border: `1px solid ${saved ? C.green+"44" : C.amber+"44"}`, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "Barlow, sans-serif" }}>
        {saved ? "✓ Salvo" : "Salvar"}
      </button>
    </div>
  );
}

function Opcoes({ st, upd, myId, onSignOut }) {
  const lang = st?.lang || "pt";
  const t = mkT(lang);
  const [drivers, setDrivers] = useState(st.drivers.length < 5
    ? [...st.drivers, ...Array.from({ length: 5 - st.drivers.length }, (_, i) => ({ id: `d${st.drivers.length + i + 1}`, name: "" }))]
    : st.drivers
  );
  const defCC = getCarCosts(st, myId);
  const [gasVal,  setGasVal]  = useState(String(defCC.gas));
  const [tollVal, setTollVal] = useState(String(defCC.toll));
  const [saved, setSaved] = useState(false);
  const [ccSaved, setCcSaved] = useState(false);

  const setN   = (i, v) => setDrivers(prev => prev.map((d, j) => j === i ? { ...d, name: v  } : d));
  const setPix = (i, v) => setDrivers(prev => prev.map((d, j) => j === i ? { ...d, pix:  v  } : d));

  const save = () => {
    const filled = drivers.filter((d, i) => i === 0 || d.name.trim());
    upd({ ...st, drivers: filled.map(d => ({ ...d, name: d.name.trim(), pix: (d.pix || '').trim() })) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveCarCosts = () => {
    const dcc = { ...(st.driverCarCosts || {}), [myId]: { gas: gasVal.trim() !== "" ? parseFloat(gasVal) || 0 : 0, toll: tollVal.trim() !== "" ? parseFloat(tollVal) || 0 : 0 } };
    upd({ ...st, driverCarCosts: dcc });
    setCcSaved(true);
    setTimeout(() => setCcSaved(false), 2000);
  };

  const [showDanger, setShowDanger] = useState(false);
  const [dangerPass, setDangerPass] = useState("");
  const [dangerErr, setDangerErr] = useState(false);

  const [passResetTarget, setPassResetTarget] = useState(null);
  const [passResetDone, setPassResetDone] = useState(null);
  const [passMap, setPassMap] = useState(() => passMapGet());
  useEffect(() => { loadPasswords().then(m => setPassMap(m)); }, []);
  const doResetPass = async (dId) => {
    const updated = await resetDriverPassword(dId, passMap);
    setPassMap(updated);
    setPassResetTarget(null);
    setPassResetDone(dId);
    setTimeout(() => setPassResetDone(null), 2500);
  };
  const clearAll = async () => {
    const ok = await checkDriverPassword(myId, dangerPass);
    if (ok) {
      upd({ ...st, trips: [] });
      setShowDanger(false);
      setDangerPass("");
      setDangerErr(false);
    } else {
      setDangerErr(true);
      setDangerPass("");
    }
  };

  const [importErr, setImportErr] = useState(null);
  const [importOk, setImportOk] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteVal, setPasteVal] = useState("");
  const fileRef = useRef(null);

  const importFromText = (text) => {
    try {
      const parsed = JSON.parse(text);
      if (!parsed.drivers || !Array.isArray(parsed.trips)) throw new Error(t("invalid_format"));
      upd(parsed);
      setImportOk(true);
      setImportErr(null);
      setShowPaste(false);
      setPasteVal("");
      setTimeout(() => setImportOk(false), 3000);
    } catch {
      setImportErr(t("opts_import_err"));
      setTimeout(() => setImportErr(null), 4000);
    }
  };

  const exportBackup = () => {
    const json = JSON.stringify(st, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `caronas-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => importFromText(ev.target.result);
    reader.readAsText(file);
    e.target.value = "";
  };

  const inp = { background: C.dim, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", color: C.text, fontSize: 15, width: "100%", outline: "none", fontFamily: "Barlow, sans-serif" };
  const cardS = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" };
  const lbl = { display: "block", color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 };

  return (
    <div>
      <div style={{ padding: "52px 20px 20px" }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: C.text }}>{t("opts_title")}</h2>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Profile card: show my name + edit my Pix only */}
        <div style={{ ...cardS, borderColor: C.amber + "44" }} onClick={(() => {
          let _c = 0, _t;
          return () => {
            _c++; clearTimeout(_t);
            if (_c >= 3) { _c = 0; localStorage.removeItem(`${LOCK_KEY}-${myId}`); onSignOut(); }
            else _t = setTimeout(() => { _c = 0; }, 600);
          };
        })()}>
          <label style={lbl}>{lang === "en" ? "My profile" : "Meu perfil"}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.amberDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              👤
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.amber }}>
              {drivers.find(d => d.id === myId)?.name || myId}
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Pix</div>
          <input
            value={drivers.find(d => d.id === myId)?.pix || ""}
            onChange={e => setPix(drivers.findIndex(d => d.id === myId), e.target.value)}
            placeholder={t("your_pix_ph")}
            style={{ ...inp, padding: "9px 12px", fontSize: 14 }}
          />
          <button onClick={save} style={{
            marginTop: 12, background: saved ? C.greenDim : C.amberDim,
            color: saved ? C.green : C.amber,
            border: `1px solid ${saved ? C.green + "44" : C.amber + "44"}`,
            borderRadius: 9, padding: "10px 0", fontSize: 14, fontWeight: 600,
            cursor: "pointer", width: "100%", fontFamily: "Barlow, sans-serif",
          }}>
            {saved ? t("opts_saved") : t("opts_save_drivers")}
          </button>
        </div>

        {/* Group drivers list — read only, show pix */}
        <div style={cardS}>
          <label style={lbl}>{t("drivers_group_label")}</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {drivers.filter(d => d.id !== myId).map(d => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.dim}` }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: C.dim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🚗</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{d.name}</div>
                  {d.pix && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Pix: {d.pix}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {myId === ADMIN_ID && <PixMaeCard st={st} upd={upd} inp={inp} lbl={lbl} cardS={cardS} />}

        <div style={{ ...cardS, borderColor: "#7C5C2E55" }}>
          <label style={{ ...lbl, color: "#F5A623" }}>{t("opts_car_cost")}</label>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{t("opts_car_cost_sub")}</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{t("opts_fuel")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>R$</span>
                <input type="number" min="0" step="0.01" value={gasVal} onChange={e => setGasVal(e.target.value)}
                  style={{ ...inp, padding: "9px 10px", fontSize: 15, textAlign: "center" }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{t("opts_toll")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>R$</span>
                <input type="number" min="0" step="0.01" value={tollVal} onChange={e => setTollVal(e.target.value)}
                  style={{ ...inp, padding: "9px 10px", fontSize: 15, textAlign: "center" }} />
              </div>
            </div>
          </div>
          <div style={{ background: C.dim, borderRadius: 9, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: C.muted }}>
            {t("opts_car_total")} <strong style={{ color: "#F5A623", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16 }}>
              R$&nbsp;{((parseFloat(gasVal)||0) + (parseFloat(tollVal)||0)).toFixed(2)}
            </strong>
          </div>
          <button onClick={saveCarCosts} style={{
            background: ccSaved ? C.greenDim : "rgba(245,166,35,0.12)",
            color: ccSaved ? C.green : "#F5A623",
            border: `1px solid ${ccSaved ? C.green+"44" : "#F5A62344"}`,
            borderRadius: 9, padding: "10px 0", fontSize: 14, fontWeight: 600,
            cursor: "pointer", width: "100%", fontFamily: "Barlow, sans-serif",
          }}>
            {ccSaved ? t("opts_saved") : t("opts_save_car")}
          </button>
        </div>

        <div style={cardS}>
          <label style={lbl}>{t("opts_language")}</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["pt", "🇧🇷 Português"], ["en", "🇺🇸 English"]].map(([code, label]) => (
              <button key={code} onClick={() => { localStorage.setItem('caroninhas-grupo-lang', code); upd({ ...st, lang: code }); }} style={{
                flex: 1, background: (st.lang || "pt") === code ? C.amberDim : C.dim,
                border: `1px solid ${(st.lang || "pt") === code ? C.amber+"66" : C.border}`,
                color: (st.lang || "pt") === code ? C.amber : C.muted,
                borderRadius: 9, padding: "10px 0", fontSize: 13, fontWeight: (st.lang || "pt") === code ? 700 : 400,
                cursor: "pointer", fontFamily: "Barlow, sans-serif",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {myId === ADMIN_ID && <div style={cardS}>
          <label style={lbl}>{t("admin_pass_title")}</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GROUP_DRIVERS.map(d => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: passMap[d.id] ? C.green : C.muted }}>
                    {passMap[d.id] ? t("admin_pass_status_set") : t("admin_pass_status_default")}
                  </div>
                </div>
                {passResetDone === d.id ? (
                  <span style={{ fontSize: 12, color: C.green }}>{t("admin_pass_reset_done")}</span>
                ) : passResetTarget === d.id ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => doResetPass(d.id)} style={{
                      background: C.redDim, border: `1px solid ${C.red}44`, color: C.red,
                      borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600,
                      cursor: "pointer", fontFamily: "Barlow, sans-serif",
                    }}>{t("admin_pass_reset_do")}</button>
                    <button onClick={() => setPassResetTarget(null)} style={{
                      background: C.dim, border: `1px solid ${C.border}`, color: C.muted,
                      borderRadius: 8, padding: "6px 10px", fontSize: 11,
                      cursor: "pointer", fontFamily: "Barlow, sans-serif",
                    }}>{t("cancel_btn")}</button>
                  </div>
                ) : (
                  <button onClick={() => setPassResetTarget(d.id)} style={{
                    background: C.dim, border: `1px solid ${C.border}`, color: C.muted,
                    borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600,
                    cursor: "pointer", fontFamily: "Barlow, sans-serif",
                  }}>{t("admin_pass_reset_btn")}</button>
                )}
              </div>
            ))}
          </div>
        </div>}

        {myId === ADMIN_ID && <div style={cardS}>
          <label style={lbl}>{t("opts_backup")}</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={exportBackup} style={{
              background: "rgba(34,201,160,0.1)", border: `1px solid ${C.green}44`,
              color: C.green, borderRadius: 9, padding: "11px 0",
              fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "Barlow, sans-serif",
            }}>
              {t("opts_export")}
            </button>
            <button onClick={() => fileRef.current?.click()} style={{
              background: C.dim, border: `1px solid ${C.border}`,
              color: C.muted, borderRadius: 9, padding: "11px 0",
              fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "Barlow, sans-serif",
            }}>
              {t("opts_import")}
            </button>
            <input ref={fileRef} type="file" accept=".json,application/json" onChange={importBackup} style={{ display: "none" }} />
            <button onClick={() => { setShowPaste(v => !v); setPasteVal(""); }} style={{
              background: C.dim, border: `1px solid ${C.border}`,
              color: C.muted, borderRadius: 9, padding: "9px 0",
              fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "Barlow, sans-serif",
            }}>
              {lang === "en" ? "📋 Paste JSON" : "📋 Colar JSON"}
            </button>
            {showPaste && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea
                  value={pasteVal}
                  onChange={e => setPasteVal(e.target.value)}
                  placeholder={lang === "en" ? "Paste backup JSON here…" : "Cole o JSON do backup aqui…"}
                  rows={5}
                  style={{ ...inp, fontSize: 12, padding: "10px 12px", resize: "vertical", fontFamily: "monospace" }}
                />
                <button onClick={() => importFromText(pasteVal)} style={{
                  background: C.amberDim, border: `1px solid ${C.amber}44`,
                  color: C.amber, borderRadius: 9, padding: "9px 0",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "Barlow, sans-serif",
                }}>
                  {lang === "en" ? "Import" : "Importar"}
                </button>
              </div>
            )}
            {importOk && <div style={{ fontSize: 12, color: C.green, textAlign: "center" }}>{t("opts_import_ok")}</div>}
            {importErr && <div style={{ fontSize: 12, color: C.red, textAlign: "center" }}>{importErr}</div>}
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
              {t("opts_backup_note")}
            </div>
          </div>
        </div>}

        {myId === ADMIN_ID && <div style={{ ...cardS, borderColor: C.red + "33" }}>
          <label style={{ ...lbl, color: C.red }}>{t("opts_danger")}</label>
          {!showDanger ? (
            <button onClick={() => setShowDanger(true)} style={{
              background: C.dim, border: `1px solid ${C.border}`,
              color: C.muted, borderRadius: 9, padding: "11px 0",
              fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "Barlow, sans-serif",
            }}>
              {t("delete_all_trips")}
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, color: C.red }}>{t("opts_delete_confirm")}</div>
              <input
                type="password"
                value={dangerPass}
                onChange={e => { setDangerPass(e.target.value); setDangerErr(false); }}
                placeholder={t("opts_delete_pass_ph")}
                style={{ background: C.dim, border: `1px solid ${dangerErr ? C.red : C.border}`, borderRadius: 9, padding: "10px 13px", color: C.text, fontSize: 15, outline: "none", fontFamily: "Barlow, sans-serif" }}
                autoFocus
              />
              {dangerErr && <div style={{ fontSize: 12, color: C.red }}>{t("opts_delete_wrong")}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={clearAll} style={{
                  flex: 1, background: C.redDim, border: `1px solid ${C.red}44`,
                  color: C.red, borderRadius: 9, padding: "11px 0",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Barlow, sans-serif",
                }}>
                  {t("opts_delete_do")}
                </button>
                <button onClick={() => { setShowDanger(false); setDangerPass(""); setDangerErr(false); }} style={{
                  background: C.dim, border: `1px solid ${C.border}`,
                  color: C.muted, borderRadius: 9, padding: "11px 14px",
                  fontSize: 13, cursor: "pointer", fontFamily: "Barlow, sans-serif",
                }}>
                  {t("cancel_btn")}
                </button>
              </div>
            </div>
          )}
        </div>}

        <div style={{ ...cardS, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 12 }}>Caronas Mogi ↔ Campinas</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{t("price_per_stretch_label", R(PRICE))}</div>
          <div style={{ marginTop: 8, fontSize: 11, color: window.__db ? C.green : C.red }}>
            {window.__db ? t("opts_firebase_ok") : t("opts_firebase_off")}
          </div>
        </div>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

// ═══════════════════════════════════════════
//  BOTTOM NAV
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
//  PROFILE CHIP
// ═══════════════════════════════════════════
function ProfileChip({ st, myId }) {
  const driver = (st?.drivers || []).find(d => d.id === myId);
  if (!driver) return null;
  return (
    <div style={{
      position: "absolute", top: 10, right: 14, zIndex: 200,
      display: "flex", alignItems: "center", gap: 5,
      pointerEvents: "none",
    }}>
      <span style={{ fontSize: 10 }}>👤</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, fontFamily: "Barlow, sans-serif", opacity: 0.8 }}>{driver.name}</span>
    </div>
  );
}

function Nav({ tab, setTab, lang, myId, trips }) {
  const t = mkT(lang || "pt");
  const items = [
    { id: "home", icon: "🏠", label: t("nav_home") },
    { id: "add", icon: "➕", label: t("nav_add") },
    { id: "saldos", icon: "💰", label: t("nav_saldos") },
    { id: "extrato", icon: "📊", label: t("nav_extratos") },
    { id: "opts", icon: "⚙️", label: t("nav_opts") },
  ];

  // Badge: new trips added by others since last visit, involving this driver
  const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY(myId)) || 0);
  const thisWeekStart = getMonday(todayStr());
  const badgeCount = (trips || []).filter(tr =>
    tr.weekStart === thisWeekStart &&
    tr.createdAt > lastSeen &&
    tr.registeredBy && tr.registeredBy !== myId &&
    (
      // I drove this trip
      (tr.role === "motorista" && (!tr.driverOwnerId || tr.driverOwnerId === myId)) ||
      // I was a passenger
      (tr.role === "passageiro" && tr.registeredBy !== myId) ||
      // I'm listed as passenger in someone's motorista trip
      (tr.role === "motorista" && (tr.passengers || []).some(p => p.driverId === myId))
    )
  ).length;

  // Also count pending confirmations for me
  const pendingCount = (trips || []).filter(tr =>
    tr.pendingConfirmation && tr.driverOwnerId === myId
  ).length;

  const totalBadge = badgeCount + pendingCount;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 480,
      background: C.nav, borderTop: `1px solid ${C.border}`,
      display: "flex", zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => setTab(item.id)} style={{
          flex: 1, background: "none", border: "none",
          padding: "10px 0 12px", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          position: "relative",
        }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ fontSize: 20 }}>{item.icon}</div>
            {item.id === "home" && totalBadge > 0 && (
              <div style={{
                position: "absolute", top: -4, right: -8,
                background: C.red, color: "#fff",
                fontSize: 9, fontWeight: 700, borderRadius: 8,
                minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 4px", lineHeight: 1,
              }}>
                {totalBadge}
              </div>
            )}
          </div>
          <div style={{ fontSize: 9.5, color: tab === item.id ? C.amber : C.muted, fontWeight: tab === item.id ? 700 : 400, letterSpacing: 0.3 }}>
            {item.label}
          </div>
          {tab === item.id && (
            <div style={{ width: 18, height: 2, borderRadius: 1, background: C.amber, position: "absolute", bottom: 4 }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
//  LOCK SCREEN
// ═══════════════════════════════════════════
// Per-driver auth — all start with "0000"
const DEFAULT_PASS_HASH = "9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0";
const LOCK_KEY    = "caroninhas-grupo-unlocked";
const MY_ID_KEY   = "caroninhas-grupo-myId";
const ADMIN_ID    = "d1"; // Mário — can register any trip
const LAST_SEEN_KEY = (dId) => `caroninhas-grupo-lastseen-${dId}`;
const PASS_DOC    = "caroninhas-grupo-passwords";
const PASS_CACHE  = "caroninhas-grupo-passwords-cache";

// Pre-defined group drivers
const GROUP_DRIVERS = [
  { id: "d1", name: "Mário",   pix: "" },
  { id: "d2", name: "Roberta", pix: "" },
  { id: "d3", name: "Nice",    pix: "" },
  { id: "d4", name: "Gabriel", pix: "" },
  { id: "d5", name: "Rafael",  pix: "" },
];

async function hashPassword(input) {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Password map: { d1: "sha256", d2: "sha256", ... } — stored in Firestore + localStorage cache
function passMapGet() {
  try { const r = localStorage.getItem(PASS_CACHE); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function passMapSet(m) {
  try { localStorage.setItem(PASS_CACHE, JSON.stringify(m)); } catch {}
}

async function loadPasswords() {
  const db = await __dbReady;
  if (db) {
    try {
      const snap = await db.collection("caronas").doc(PASS_DOC).get();
      if (snap.exists) {
        const m = snap.data() || {};
        passMapSet(m);
        return m;
      }
    } catch(e) { console.warn("[grupo] loadPasswords error:", e); }
  }
  return passMapGet();
}

async function savePasswordMap(m) {
  passMapSet(m);
  const db = await __dbReady;
  if (db) {
    try { await db.collection("caronas").doc(PASS_DOC).set(m); }
    catch(e) { console.warn("[grupo] savePasswordMap error:", e); }
  }
}

async function checkDriverPassword(dId, input, passMap) {
  const hash = await hashPassword(input);
  const stored = (passMap || passMapGet())[dId];
  return stored ? hash === stored : hash === DEFAULT_PASS_HASH;
}

function driverHasCustomPassword(dId, passMap) {
  return !!(passMap || passMapGet())[dId];
}

async function setDriverPassword(dId, input, passMap) {
  const hash = await hashPassword(input);
  const updated = { ...(passMap || passMapGet()), [dId]: hash };
  await savePasswordMap(updated);
  return updated;
}

async function resetDriverPassword(dId, passMap) {
  const updated = { ...(passMap || passMapGet()) };
  delete updated[dId];
  await savePasswordMap(updated);
  return updated;
}

// Used by danger zone confirm
async function checkPassword(dId, input) {
  return checkDriverPassword(dId, input);
}

// DriverSelector: pick who you are, then enter password
function DriverSelector({ onUnlock, lang }) {
  const t = mkT(lang || "pt");
  const [step, setStep] = useState("select"); // "select" | "password" | "set_password"
  const [selectedId, setSelectedId] = useState(null);
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passErr, setPassErr] = useState("");
  const [passMap, setPassMap] = useState(() => passMapGet());

  useEffect(() => { loadPasswords().then(m => setPassMap(m)); }, []);

  const driverEmojis = { d1: "👤", d2: "👩", d3: "👩", d4: "👨", d5: "👨" };

  const selectDriver = (dId) => {
    setSelectedId(dId);
    setStep("password");
    setVal("");
    setErr(false);
  };

  const tryUnlock = async () => {
    const ok = await checkDriverPassword(selectedId, val, passMap);
    if (ok) {
      const isDefault = !driverHasCustomPassword(selectedId, passMap);
      if (isDefault) {
        setStep("set_password");
        setNewPass("");
        setConfirmPass("");
        setPassErr("");
      } else {
        localStorage.setItem(MY_ID_KEY, selectedId);
        localStorage.setItem(`${LOCK_KEY}-${selectedId}`, "1");
        onUnlock(selectedId);
      }
    } else {
      setErr(true);
      setShake(true);
      setVal("");
      setTimeout(() => { setShake(false); setErr(false); }, 600);
    }
  };

  const trySetPassword = async () => {
    if (newPass.length < 4) { setPassErr(t("pass_too_short")); return; }
    if (newPass.length > 8) { setPassErr(t("pass_too_long")); return; }
    if (newPass !== confirmPass) { setPassErr(t("pass_mismatch")); return; }
    await setDriverPassword(selectedId, newPass, passMap);
    localStorage.setItem(MY_ID_KEY, selectedId);
    localStorage.setItem(`${LOCK_KEY}-${selectedId}`, "1");
    onUnlock(selectedId);
  };

  const selectedDriver = GROUP_DRIVERS.find(d => d.id === selectedId);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Barlow, sans-serif", padding: "32px 20px" }}>
      <style>{GCSS}</style>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 4 }}>Caroninhas</div>
      <div style={{ color: C.amber, fontSize: 13, fontWeight: 600, marginBottom: 32 }}>Grupo</div>

      {step === "select" && (
        <div style={{ width: "100%", maxWidth: 320 }}>
          <div style={{ color: C.muted, fontSize: 13, textAlign: "center", marginBottom: 20 }}>{t("who_subtitle")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {GROUP_DRIVERS.map(d => (
              <button key={d.id} onClick={() => selectDriver(d.id)} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 14,
                cursor: "pointer", width: "100%", textAlign: "left",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: C.amberDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {driverEmojis[d.id] || "🧑"}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{lang === "en" ? "Tap to sign in" : "Toque para entrar"}</div>
                </div>
                <div style={{ marginLeft: "auto", color: C.muted, fontSize: 18 }}>›</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "password" && (
        <div style={{ width: "100%", maxWidth: 300, animation: shake ? "shake 0.4s ease" : "none" }}>
          <button onClick={() => { setStep("select"); setErr(false); }} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6, padding: 0, fontFamily: "Barlow, sans-serif" }}>
            ← {lang === "en" ? "Back" : "Voltar"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.amberDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {driverEmojis[selectedId] || "🧑"}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{selectedDriver?.name}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{t("enter_password")}</div>
            </div>
          </div>
          <input
            type="password"
            value={val}
            onChange={e => { setVal(e.target.value); setErr(false); }}
            onKeyDown={e => e.key === "Enter" && tryUnlock()}
            placeholder="••••"
            autoFocus
            style={{
              width: "100%", background: C.card,
              border: `1px solid ${err ? C.red : C.border}`,
              borderRadius: 12, padding: "14px 18px",
              color: C.text, fontSize: 22, outline: "none",
              textAlign: "center", letterSpacing: 8,
              fontFamily: "Barlow, sans-serif",
            }}
          />
          {err && <div style={{ color: C.red, fontSize: 12, textAlign: "center", marginTop: 8 }}>{t("lock_wrong")}</div>}
          <button onClick={tryUnlock} style={{
            marginTop: 14, width: "100%",
            background: C.amber, color: "#000", border: "none",
            borderRadius: 12, padding: "14px 0",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, textTransform: "uppercase",
          }}>
            {t("enter_btn")}
          </button>
        </div>
      )}

      {step === "set_password" && (
        <div style={{ width: "100%", maxWidth: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.amberDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {driverEmojis[selectedId] || "🧑"}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{selectedDriver?.name}</div>
              <div style={{ fontSize: 12, color: C.amber }}>{t("pass_set_title")}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>{t("pass_set_sub")}</div>
          <div style={{ fontSize: 12, color: C.amber, textAlign: "center", marginBottom: 14, fontWeight: 600 }}>{t("pass_length_hint")}</div>
          <input
            type="password"
            value={newPass}
            onChange={e => { setNewPass(e.target.value); setPassErr(""); }}
            onKeyDown={e => e.key === "Enter" && trySetPassword()}
            placeholder={t("pass_new_ph")}
            maxLength={8}
            autoFocus
            style={{
              width: "100%", background: C.card,
              border: `1px solid ${passErr ? C.red : C.border}`,
              borderRadius: 12, padding: "14px 18px",
              color: C.text, fontSize: 18, outline: "none",
              textAlign: "center", letterSpacing: 4,
              fontFamily: "Barlow, sans-serif", marginBottom: 10,
            }}
          />
          <input
            type="password"
            value={confirmPass}
            onChange={e => { setConfirmPass(e.target.value); setPassErr(""); }}
            onKeyDown={e => e.key === "Enter" && trySetPassword()}
            placeholder={t("pass_confirm_ph")}
            maxLength={8}
            style={{
              width: "100%", background: C.card,
              border: `1px solid ${passErr ? C.red : C.border}`,
              borderRadius: 12, padding: "14px 18px",
              color: C.text, fontSize: 18, outline: "none",
              textAlign: "center", letterSpacing: 4,
              fontFamily: "Barlow, sans-serif",
            }}
          />
          {passErr && <div style={{ color: C.red, fontSize: 12, textAlign: "center", marginTop: 8 }}>{passErr}</div>}
          <button onClick={trySetPassword} style={{
            marginTop: 14, width: "100%",
            background: C.amber, color: "#000", border: "none",
            borderRadius: 12, padding: "14px 0",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, textTransform: "uppercase",
          }}>
            {t("pass_set_btn")}
          </button>
        </div>
      )}
    </div>
  );
}

// Keep LockScreen as alias for backward compat
const LockScreen = DriverSelector;

// ═══════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════
export default function App() {
  const [myId, setMyId] = useState(() => localStorage.getItem(MY_ID_KEY) || null);
  const [unlocked, setUnlocked] = useState(() => {
    const id = localStorage.getItem(MY_ID_KEY);
    return id ? localStorage.getItem(`${LOCK_KEY}-${id}`) === "1" : false;
  });
  const [st, setSt] = useState(null);
  const [tab, setTab] = useState("home");

  useEffect(() => {
    if (unlocked) loadData().then(d => {
      const loaded = d || INIT;
      // Always sync drivers with GROUP_DRIVERS names (in case we update them)
      setSt({ ...loaded, drivers: GROUP_DRIVERS.map(gd => {
        const existing = (loaded.drivers || []).find(d => d.id === gd.id);
        return existing ? { ...gd, pix: existing.pix || gd.pix } : gd;
      })});
    });
  }, [unlocked]);

  const upd = (newSt) => { setSt(newSt); saveData(newSt); };

  const handleUnlock = (dId) => { setMyId(dId); setUnlocked(true); };

  if (!unlocked || !myId) return <DriverSelector onUnlock={handleUnlock} lang={localStorage.getItem("caroninhas-grupo-lang") || "pt"} />;

  const appLang = st?.lang || localStorage.getItem("caroninhas-grupo-lang") || "pt";
  const appT = mkT(appLang);
  if (!st) return (
    <div style={{ background: C.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Barlow, sans-serif" }}>
      <style>{GCSS}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🚗</div>
        <div style={{ color: C.muted }}>{appT("loading")}</div>
      </div>
    </div>
  );

  if (!st.done) return <Setup st={st} upd={upd} />;

  return (
    <div style={{ fontFamily: "Barlow, sans-serif", background: C.bg, minHeight: "100vh", color: C.text, maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 80 }}>
      <style>{GCSS}</style>
      {tab === "home"   && <Home   st={st} upd={upd} setTab={setTab} myId={myId} />}
      {tab === "add"    && <AddTrip st={st} upd={upd} setTab={setTab} myId={myId} />}
      {tab === "saldos" && <Saldos  st={st} upd={upd} myId={myId} />}
      {tab === "extrato" && <Extrato st={st} upd={upd} myId={myId} />}
      {tab === "opts"   && <Opcoes  st={st} upd={upd} myId={myId} onSignOut={() => { setMyId(null); setUnlocked(false); }} />}
      <ProfileChip st={st} myId={myId} />
      <Nav tab={tab} setTab={setTab} lang={st?.lang || "pt"} myId={myId} trips={st?.trips || []} />
    </div>
  );
}
  