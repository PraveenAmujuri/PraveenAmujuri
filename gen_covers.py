import os

W, H = 420, 300

def base(body, path, extra_styles=""):
    svg = f'''<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    :root {{
      --bg: #EFEBE2;
      --ink: #211F1C;
      --line: #DDD6C7;
      --accent: #B54A2C;
      --accent-soft: #D98B6F;
    }}
    @media (prefers-color-scheme: dark) {{
      :root {{
        --bg: #161b22;
        --ink: #EAEFF8;
        --line: #30363D;
        --accent: #E56A47;
        --accent-soft: #d29922;
      }}
    }}
    @keyframes fadeIn {{
      from {{ opacity: 0; }}
      to {{ opacity: 1; }}
    }}
    .base-fade {{
      animation: fadeIn 1.2s ease-out forwards;
    }}
{extra_styles}
  </style>
  <rect x="0" y="0" width="{W}" height="{H}" fill="var(--bg)"/>
  <g class="base-fade">
{body}
  </g>
  <rect x="0.5" y="0.5" width="{W-1}" height="{H-1}" fill="none" stroke="var(--line)" stroke-width="1"/>
</svg>
'''
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"Generated: {path}")

# 1 — EchoX: soundwave with ambient breathing pulse animations on bars
def echox():
    styles = '''
    @keyframes soundwave {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(0.5); }
    }
    .wave-bar {
      transform-origin: center;
      animation: soundwave 3s ease-in-out infinite;
    }
    '''
    bars = []
    heights = [22,38,60,90,130,170,150,110,75,50,34,20,44,80,120,160,140,95,60,36,24]
    n = len(heights)
    gap = 8
    bar_w = (W - 80 - gap*(n-1)) / n
    x = 40
    mid = H/2
    for i,h in enumerate(heights):
        fill = "var(--accent)" if i == 14 else "var(--ink)"
        opacity = "1" if i == 14 else "0.55"
        delay = f"{(i % 5) * 0.4:.1f}s"
        dur = f"{2.2 + (i % 3) * 0.4:.1f}s"
        bars.append(f'  <rect class="wave-bar" x="{x:.1f}" y="{mid-h/2:.1f}" width="{bar_w:.1f}" height="{h}" rx="{bar_w/2:.1f}" fill="{fill}" opacity="{opacity}" style="animation-delay: {delay}; animation-duration: {dur};"/>')
        x += bar_w + gap
    return "\n".join(bars), styles

# 2 — PRISM: refracted light band swinging/sweeping continuously
def prism():
    styles = '''
    @keyframes beamSwing1 {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(5deg); }
    }
    @keyframes beamSwing2 {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-4deg); }
    }
    @keyframes beamSwing3 {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(3deg); }
    }
    @keyframes drawPrismTri {
      from { stroke-dashoffset: 400; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes drawPrismRay {
      from { stroke-dashoffset: 100; }
      to { stroke-dashoffset: 0; }
    }
    .beam-1 {
      transform-origin: 118px 150px;
      animation: beamSwing1 6s ease-in-out infinite;
    }
    .beam-2 {
      transform-origin: 118px 150px;
      animation: beamSwing2 5s ease-in-out infinite 0.5s;
    }
    .beam-3 {
      transform-origin: 118px 150px;
      animation: beamSwing3 7s ease-in-out infinite 1s;
    }
    .prism-tri {
      stroke-dasharray: 400;
      stroke-dashoffset: 400;
      animation: drawPrismTri 2s ease-out forwards;
    }
    .prism-ray {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: drawPrismRay 1.5s ease-out 0.2s forwards;
    }
    '''
    body = '''  <path class="prism-tri" d="M60 220 L150 90 L 90 220 Z" fill="none" stroke="var(--ink)" stroke-width="1.4"/>
  <line class="prism-ray" x1="20" y1="150" x2="103" y2="150" stroke="var(--ink)" stroke-width="1.4" opacity="0.7"/>
  <line class="beam-1" x1="118" y1="150" x2="400" y2="200" stroke="var(--accent)" stroke-width="2"/>
  <line class="beam-2" x1="118" y1="150" x2="400" y2="178" stroke="var(--accent-soft)" stroke-width="1.4" opacity="0.8"/>
  <line class="beam-3" x1="118" y1="150" x2="400" y2="222" stroke="var(--accent-soft)" stroke-width="1.4" opacity="0.6"/>'''
    return body, styles

# 3 — MockForge: API sandbox -> lattice of nodes pulsing out of sync
def mockforge():
    styles = '''
    @keyframes nodePulse {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.95; }
    }
    .lattice-node {
      animation: nodePulse 3.5s ease-in-out infinite;
    }
    '''
    dots = []
    for row in range(5):
        for col in range(7):
            x = 60 + col*50
            y = 60 + row*45
            is_accent = (row, col) == (2,3)
            r = 5 if is_accent else 3
            fill = "var(--accent)" if is_accent else "var(--ink)"
            op = "1" if is_accent else "0.45"
            delay = f"{((row + col) * 0.3):.1f}s"
            if is_accent:
                dots.append(f'  <circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" opacity="{op}"/>')
            else:
                dots.append(f'  <circle class="lattice-node" cx="{x}" cy="{y}" r="{r}" fill="{fill}" opacity="{op}" style="animation-delay: {delay};"/>')
    lines = '''  <line x1="60" y1="150" x2="360" y2="150" stroke="var(--ink)" stroke-width="1" opacity="0.2"/>
  <line x1="210" y1="60" x2="210" y2="240" stroke="var(--ink)" stroke-width="1" opacity="0.2"/>'''
    return lines + "\n" + "\n".join(dots), styles

# 4 — MediStream AI: vital line with traveling heartbeat wave + pulsing vital dot
def medistream():
    styles = '''
    @keyframes heartPulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.6); opacity: 1; }
    }
    @keyframes vitalTravel {
      0% { stroke-dashoffset: 800; }
      100% { stroke-dashoffset: -800; }
    }
    .pulse-dot {
      transform-origin: 205px 60px;
      animation: heartPulse 1.5s ease-in-out infinite;
    }
    .vital-pulse {
      stroke-dasharray: 80 720;
      animation: vitalTravel 4s linear infinite;
    }
    '''
    path = "M20,150 L140,150 L160,90 L185,210 L205,60 L225,150 L400,150"
    body = f'''  <path d="{path}" fill="none" stroke="var(--ink)" stroke-width="1.6" opacity="0.25"/>
  <path class="vital-pulse" d="{path}" fill="none" stroke="var(--accent)" stroke-width="2.5" opacity="0.9"/>
  <circle class="pulse-dot" cx="205" cy="60" r="5" fill="var(--accent)"/>'''
    return body, styles

# 5 — CareerDNA: helix arcs drifting slowly
def careerdna():
    styles = '''
    @keyframes helixWave {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(6px); }
    }
    .helix-arc {
      animation: helixWave 4s ease-in-out infinite;
    }
    '''
    arcs = []
    for i in range(6):
        y = 240 - i*32
        color = "var(--accent)" if i == 3 else "var(--ink)"
        op = "1" if i == 3 else "0.4"
        delay = f"{(i * 0.4):.1f}s"
        arcs.append(f'  <path class="helix-arc" d="M100 {y} Q 210 {y-40} 320 {y}" fill="none" stroke="{color}" stroke-width="1.6" opacity="{op}" style="animation-delay: {delay};"/>')
    return "\n".join(arcs), styles

# 6 — LunaBot: rover orbit ring rotation and orbiting accent dot
def lunabot():
    styles = '''
    @keyframes rotateClockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes rotateCounter {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
    @keyframes crescentBreathe {
      0%, 100% { opacity: 0.85; }
      50% { opacity: 0.55; }
    }
    @keyframes orbitDot {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .orbit-ring-1 {
      transform-origin: 180px 150px;
      animation: rotateClockwise 20s linear infinite;
    }
    .orbit-ring-2 {
      transform-origin: 180px 150px;
      animation: rotateCounter 30s linear infinite;
    }
    .luna-crescent {
      animation: crescentBreathe 4s ease-in-out infinite;
    }
    .luna-dot {
      transform-origin: 180px 150px;
      animation: orbitDot 10s linear infinite;
    }
    '''
    body = '''  <circle class="orbit-ring-1" cx="180" cy="150" r="70" fill="none" stroke="var(--ink)" stroke-width="1.2" opacity="0.35"/>
  <circle class="orbit-ring-2" cx="180" cy="150" r="100" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.2"/>
  <path class="luna-crescent" d="M 250 110 A 46 46 0 1 0 250 190 A 36 36 0 1 1 250 110 Z" fill="var(--ink)" opacity="0.85"/>
  <circle class="luna-dot" cx="300" cy="95" r="3" fill="var(--accent)"/>'''
    return body, styles

body, styles = echox()
base(body, "./assets/projects/cover-echox.svg", styles)

body, styles = prism()
base(body, "./assets/projects/cover-prism.svg", styles)

body, styles = mockforge()
base(body, "./assets/projects/cover-mockforge.svg", styles)

body, styles = medistream()
base(body, "./assets/projects/cover-medistream.svg", styles)

body, styles = careerdna()
base(body, "./assets/projects/cover-careerdna.svg", styles)

body, styles = lunabot()
base(body, "./assets/projects/cover-lunabot.svg", styles)
