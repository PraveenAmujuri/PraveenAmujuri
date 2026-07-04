import os

STROKE = 1.6

def wrap(body, extra_styles=""):
    svg = []
    svg.append('<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">')
    svg.append('  <style>')
    svg.append('    :root {')
    svg.append('      --ink: #211F1C;')
    svg.append('    }')
    svg.append('    @media (prefers-color-scheme: dark) {')
    svg.append('      :root {')
    svg.append('        --ink: #EAEFF8;')
    svg.append('      }')
    svg.append('    }')
    svg.append('    @keyframes breathe {')
    svg.append('      0%, 100% { opacity: 0.7; }')
    svg.append('      50% { opacity: 1; }')
    svg.append('    }')
    svg.append('    .icon-breathe {')
    svg.append('      animation: breathe 3s ease-in-out infinite;')
    svg.append('    }')
    svg.append(extra_styles)
    svg.append('  </style>')
    svg.append(body)
    svg.append('</svg>\n')
    return "\n".join(svg)

icons = {
    # Languages — an "Aa" ligature reduced to two simple letterforms as strokes
    "icon-languages.svg": ('''  <g class="icon-breathe">
    <path d="M6 20 L11 8 L16 20"/>
    <path d="M7.5 16 H14.5"/>
    <path d="M19 20 C19 16 24 16 24 20 C24 22 19 22 19 19 V13"/>
  </g>''', ""),

    # AI / ML — three connected nodes pulsing out of sync
    "icon-ai.svg": ('''  <circle class="node-1" cx="7" cy="21" r="2.3"/>
  <circle class="node-2" cx="21" cy="21" r="2.3"/>
  <circle class="node-3" cx="14" cy="7" r="2.3"/>
  <path d="M9 19.5 L12.3 9.5"/>
  <path d="M19 19.5 L15.7 9.5"/>''', '''
    @keyframes nodeFlash {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    .node-1 { animation: nodeFlash 2.5s infinite; }
    .node-2 { animation: nodeFlash 2.5s infinite 0.8s; }
    .node-3 { animation: nodeFlash 2.5s infinite 1.6s; }
  '''),

    # Backend — stacked layers sliding up/down slightly
    "icon-backend.svg": ('''  <path class="layer-1" d="M14 5 L24 10 L14 15 L4 10 Z"/>
  <path class="layer-2" d="M4 15 L14 20 L24 15"/>
  <path class="layer-3" d="M4 20 L14 25 L24 20"/>''', '''
    @keyframes slideLayer {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-1.5px); }
    }
    .layer-1 { transform-origin: 14px 10px; animation: slideLayer 3s ease-in-out infinite; }
    .layer-2 { transform-origin: 14px 17.5px; animation: slideLayer 3s ease-in-out infinite 0.5s; }
    .layer-3 { transform-origin: 14px 22.5px; animation: slideLayer 3s ease-in-out infinite 1s; }
  '''),

    # Frontend — simple browser window with blinking dots
    "icon-frontend.svg": ('''  <rect x="4" y="6" width="20" height="16" rx="1.5"/>
  <path d="M4 10.5 H24"/>
  <circle class="dot-blink" cx="7.3" cy="8.3" r="0.6" fill="var(--ink)" stroke="none"/>''', '''
    @keyframes dotBlink {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 1; }
    }
    .dot-blink { animation: dotBlink 2s steps(2, start) infinite; }
  '''),

    # Infra / Cloud — simple cloud outline breathing
    "icon-cloud.svg": ('''  <path class="icon-breathe" d="M9 20 C5 20 5 14.5 9.3 14.2 C10 10.5 15.5 9.7 17.3 13 C22.5 12.6 23 20 18 20 Z"/>''', ""),

    # Data — cylinder / database with breathing layers
    "icon-data.svg": ('''  <ellipse cx="14" cy="7.5" rx="9" ry="3"/>
  <path class="db-layer-1" d="M5 7.5 V20.5 C5 22.2 9 23.5 14 23.5 C19 23.5 23 22.2 23 20.5 V7.5"/>
  <path class="db-layer-2" d="M5 14 C5 15.7 9 17 14 17 C19 17 23 15.7 23 14"/>''', '''
    @keyframes dbBreathe {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .db-layer-1, .db-layer-2 { animation: dbBreathe 3.5s ease-in-out infinite; }
    .db-layer-2 { animation-delay: 0.7s; }
  '''),
}

for fname, (body, extra_styles) in icons.items():
    path = f"./assets/icons/{fname}"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(wrap(body, extra_styles))
    print(f"Generated: {path}")
