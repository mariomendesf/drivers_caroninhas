"""Build caroninhas-group.jsx into index.html."""
with open('caroninhas-group.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

src_build = src.replace('import { useState, useEffect } from "react";\n\n', '')
src_build = src_build.replace('export default function App()', 'function App()')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

babel_start = html.index('<script type="text/babel">')
babel_end = html.index('</script>', babel_start) + len('</script>')

skeleton_before = html[:babel_start]
skeleton_after = html[babel_end:]

indented = '\n'.join('    ' + line for line in src_build.splitlines())
new_script = (
    '<script type="text/babel">\n'
    '    const { useState, useEffect, useRef } = React;\n\n'
    + indented +
    "\n\n    const root = ReactDOM.createRoot(document.getElementById('root'));\n"
    '    root.render(<App />);\n'
    '  </script>'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(skeleton_before + new_script + skeleton_after)

print('Build OK')
