import os
from tokens import *

W = 1000
H = 168
MARGIN = 64

def render(numeral, eyebrow, title, path):
    svg = []
    svg.append(f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">')
    
    # Internal CSS for GitHub Light & Dark mode support + CSS Animations
    svg.append('  <style>')
    svg.append('    :root {')
    svg.append(f'      --muted: {MUTED};')
    svg.append(f'      --accent: {ACCENT};')
    svg.append(f'      --ink: {INK};')
    svg.append(f'      --line: {LINE};')
    svg.append('    }')
    svg.append('    @media (prefers-color-scheme: dark) {')
    svg.append('      :root {')
    svg.append('        --muted: #7E8C9F;')
    svg.append('        --accent: #E56A47;')
    svg.append('        --ink: #EAEFF8;')
    svg.append('        --line: #30363D;')
    svg.append('      }')
    svg.append('    }')
    svg.append('    @keyframes drawRect {')
    svg.append('      from { transform: scaleX(0); }')
    svg.append('      to { transform: scaleX(1); }')
    svg.append('    }')
    svg.append('    @keyframes fadeIn {')
    svg.append('      from { opacity: 0; }')
    svg.append('      to { opacity: 1; }')
    svg.append('    }')
    svg.append('    @keyframes drawLine {')
    svg.append('      from { stroke-dashoffset: 872; }')
    svg.append('      to { stroke-dashoffset: 0; }')
    svg.append('    }')
    svg.append('    @keyframes slideSectionScanner {')
    svg.append('      0% { x: -80px; }')
    svg.append('      100% { x: 936px; }')
    svg.append('    }')
    svg.append('    @keyframes accentBreathe {')
    svg.append('      0%, 100% { transform: scaleX(1); }')
    svg.append('      50% { transform: scaleX(1.6); }')
    svg.append('    }')
    svg.append('    .accent-rect {')
    svg.append('      transform-origin: 64px 41.5px;')
    svg.append('      animation: drawRect 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards, accentBreathe 4s ease-in-out infinite 1.2s;')
    svg.append('    }')
    svg.append('    .hairline {')
    svg.append('      stroke-dasharray: 872;')
    svg.append('      stroke-dashoffset: 872;')
    svg.append('      animation: drawLine 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;')
    svg.append('    }')
    svg.append('    .scanner {')
    svg.append('      animation: slideSectionScanner 3s linear infinite 1.7s;')
    svg.append('    }')
    svg.append('    .fade-item {')
    svg.append('      opacity: 0;')
    svg.append('      animation: fadeIn 1.5s ease-out 0.4s forwards;')
    svg.append('    }')
    svg.append('  </style>')

    # left grid marker — short accent rule, Swiss asymmetric anchor
    svg.append('  <rect class="accent-rect" x="64" y="40" width="26" height="3" fill="var(--accent)"/>')

    # numeral, tracked sans, sits above the eyebrow
    svg.append(f'  <text class="fade-item" x="{MARGIN}" y="34" font-family="{SANS}" font-size="13" letter-spacing="2" fill="var(--muted)">{numeral}</text>')

    # eyebrow label, tracked small caps
    svg.append(f'  <text class="fade-item" x="{MARGIN+40}" y="46" font-family="{SANS}" font-size="12" letter-spacing="3" fill="var(--muted)">{eyebrow.upper()}</text>')

    # display title, serif
    svg.append(f'  <text class="fade-item" x="{MARGIN}" y="112" font-family="{SERIF}" font-size="52" fill="var(--ink)">{title}</text>')

    # closing hairline
    svg.append('  <line class="hairline" x1="64" y1="140" x2="936" y2="140" stroke="var(--line)" stroke-width="1"/>')
    svg.append('  <rect class="scanner" width="80" height="1" y="139.5" fill="url(#laserGradient)" />')

    svg.append('  <defs>')
    svg.append('    <linearGradient id="laserGradient" x1="0" y1="0" x2="1" y2="0">')
    svg.append('      <stop offset="0%" stop-color="var(--accent)" stop-opacity="0" />')
    svg.append('      <stop offset="50%" stop-color="var(--accent)" stop-opacity="1" />')
    svg.append('      <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />')
    svg.append('    </linearGradient>')
    svg.append('  </defs>')

    svg.append('</svg>')
    
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(svg))
    print(f"Generated: {path}")

sections = [
    ("01", "Perspective",         "About",                "section-who-i-am.svg"),
    ("02", "Showcase",            "Featured Projects",    "section-selected-projects.svg"),
    ("03", "Toolset",             "Tech Stack",           "section-technologies.svg"),
    ("04", "Right Now",           "Currently Exploring",  "section-currently-exploring.svg"),
    ("05", "Activity",            "GitHub Activity",      "section-github-activity.svg"),
    ("06", "Get in Touch",        "Contact",              "section-connect.svg"),
]

for numeral, eyebrow, title, fname in sections:
    render(numeral, eyebrow, title, f"./assets/sections/{fname}")
