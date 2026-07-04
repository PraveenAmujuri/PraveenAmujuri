import re
import urllib.request
import json
import os

# Fallback values
username = "PraveenAmujuri"
repos = 32
followers = 6
views = 1200
total_contribs = 509
contribs_2026 = 348
current_streak = 3
longest_streak = 14

# Check for GITHUB_TOKEN to avoid API rate limiting in GitHub Actions
token = os.environ.get("GITHUB_TOKEN")
headers = {'User-Agent': 'Mozilla/5.0'}
if token:
    headers['Authorization'] = f"token {token}"

try:
    # 1. Fetch Repos & Followers from GitHub API
    req = urllib.request.Request(
        f"https://api.github.com/users/{username}",
        headers=headers
    )
    with urllib.request.urlopen(req, timeout=5) as response:
        data = json.loads(response.read().decode())
        repos = data.get("public_repos", repos)
        followers = data.get("followers", followers)
except Exception as e:
    print(f"Skipping GitHub API fetch: {e}")

try:
    # 2. Fetch Profile Views from Komarev
    req = urllib.request.Request(
        f"https://komarev.com/ghpvc/?username={username}",
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req, timeout=5) as response:
        svg_content = response.read().decode()
        # Find views number (Komarev SVG contains text nodes, the count is typically in the second group)
        matches = re.findall(r'<text[^>]*>([\d\s,]+)</text>', svg_content)
        if len(matches) >= 2:
            views_str = matches[1].replace(" ", "").replace(",", "")
            if views_str.isdigit():
                views = int(views_str)
except Exception as e:
    print(f"Skipping views fetch: {e}")

# Build the SVG
svg = f'''<svg width="1000" height="260" viewBox="0 0 1000 260" xmlns="http://www.w3.org/2000/svg" fill="none">
  <style>
    :root {{
      --bg-card: #EFEBE2;
      --ink: #211F1C;
      --ink-soft: #57534C;
      --muted: #9C958A;
      --line: #DDD6C7;
      --accent: #B54A2C;
      --accent-light: #D98B6F;
    }}
    @media (prefers-color-scheme: dark) {{
      :root {{
        --bg-card: #161b22;
        --ink: #EAEFF8;
        --ink-soft: #A3B3CA;
        --muted: #7E8C9F;
        --line: #30363D;
        --accent: #E56A47;
        --accent-light: #f0a38e;
      }}
    }}
    
    @keyframes barSlideIn {{
      from {{ width: 0; }}
      to {{ width: var(--final-w); }}
    }}
    @keyframes statFadeIn {{
      from {{ opacity: 0; transform: translateY(8px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}
    @keyframes waveFlow {{
      0% {{ stroke-dashoffset: 0; }}
      100% {{ stroke-dashoffset: -40; }}
    }}
    @keyframes pulseSoft {{
      0%, 100% {{ opacity: 1; }}
      50% {{ opacity: 0.85; }}
    }}
    @keyframes headerLineFlow {{
      0% {{ stroke-dashoffset: 0; }}
      100% {{ stroke-dashoffset: -30; }}
    }}
    
    .card {{
      fill: var(--bg-card);
      stroke: var(--line);
      stroke-width: 1;
      rx: 6px;
    }}
    .text-title {{
      font-family: Georgia, 'Iowan Old Style', 'Times New Roman', serif;
      font-size: 22px;
      fill: var(--ink);
    }}
    .text-subtitle {{
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 11px;
      letter-spacing: 1.5px;
      fill: var(--muted);
    }}
    .text-stat-num {{
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 700;
      fill: var(--accent);
      animation: pulseSoft 4s ease-in-out infinite;
    }}
    .text-stat-lbl {{
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      fill: var(--ink-soft);
    }}
    .text-stat-sub {{
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 10px;
      fill: var(--muted);
    }}
    .progress-track {{
      fill: var(--line);
      rx: 1.5px;
    }}
    .progress-bar {{
      stroke: url(#waveGrad);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 8 4;
      animation: barSlideIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, waveFlow 4s linear infinite;
    }}
    .header-hairline {{
      stroke: var(--line);
      stroke-width: 1;
      stroke-dasharray: 20 10;
      animation: headerLineFlow 4s linear infinite;
    }}
    .animate-item {{
      opacity: 0;
      animation: statFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }}
  </style>

  <!-- BACKGROUND CARD -->
  <rect class="card" x="64" y="5" width="872" height="250"/>

  <!-- HEADER -->
  <g transform="translate(64, 5)">
    <text x="30" y="38" class="text-title animate-item" style="animation-delay: 0.1s;">Praveen Amujuri</text>
    <text x="842" y="36" class="text-subtitle animate-item" text-anchor="end" style="animation-delay: 0.1s;">GITHUB PROFILE SUMMARY</text>
    <line class="header-hairline" x1="30" y1="52" x2="842" y2="52"/>
  </g>

  <!-- METRICS GRID -->
  <g transform="translate(64, 5)">
    
    <!-- COLUMN 1: Profile Views & Followers -->
    <!-- Profile Views -->
    <g class="animate-item" style="animation-delay: 0.2s;">
      <text x="30" y="95" class="text-stat-num" style="animation-delay: 0.1s;">{views}</text>
      <text x="30" y="113" class="text-stat-lbl">Profile Views</text>
      <line class="progress-track" x1="30" y1="122" x2="200" y2="122" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="30" y1="122" x2="200" y2="122" style="--final-w: 120px; animation-delay: 0.3s;"/>
    </g>
    <!-- Followers -->
    <g class="animate-item" style="animation-delay: 0.3s;">
      <text x="30" y="175" class="text-stat-num" style="animation-delay: 0.2s;">{followers}</text>
      <text x="30" y="193" class="text-stat-lbl">Followers on GitHub</text>
      <line class="progress-track" x1="30" y1="202" x2="200" y2="202" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="30" y1="202" x2="200" y2="202" style="--final-w: 40px; animation-delay: 0.4s;"/>
    </g>

    <!-- COLUMN 2: Contributions -->
    <!-- Total Contributions -->
    <g class="animate-item" style="animation-delay: 0.4s;">
      <text x="240" y="95" class="text-stat-num" style="animation-delay: 0.3s;">{total_contribs}</text>
      <text x="240" y="113" class="text-stat-lbl">Total Contributions</text>
      <text x="240" y="127" class="text-stat-sub">Mar 29, 2025 - Present</text>
      <line class="progress-track" x1="240" y1="135" x2="410" y2="135" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="240" y1="135" x2="410" y2="135" style="--final-w: 130px; animation-delay: 0.5s;"/>
    </g>
    <!-- 2026 Contributions -->
    <g class="animate-item" style="animation-delay: 0.5s;">
      <text x="240" y="175" class="text-stat-num" style="animation-delay: 0.4s;">{contribs_2026}</text>
      <text x="240" y="193" class="text-stat-lbl">Contributions in 2026</text>
      <text x="240" y="207" class="text-stat-sub">Current Year Activity</text>
      <line class="progress-track" x1="240" y1="215" x2="410" y2="215" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="240" y1="215" x2="410" y2="215" style="--final-w: 95px; animation-delay: 0.6s;"/>
    </g>

    <!-- COLUMN 3: Streaks -->
    <!-- Current Streak -->
    <g class="animate-item" style="animation-delay: 0.6s;">
      <text x="450" y="95" class="text-stat-num" style="animation-delay: 0.5s;">{current_streak}</text>
      <text x="450" y="113" class="text-stat-lbl">Current Streak</text>
      <text x="450" y="127" class="text-stat-sub">Jul 2 - Jul 4</text>
      <line class="progress-track" x1="450" y1="135" x2="620" y2="135" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="450" y1="135" x2="620" y2="135" style="--final-w: 30px; animation-delay: 0.7s;"/>
    </g>
    <!-- Longest Streak -->
    <g class="animate-item" style="animation-delay: 0.7s;">
      <text x="450" y="175" class="text-stat-num" style="animation-delay: 0.6s;">{longest_streak}</text>
      <text x="450" y="193" class="text-stat-lbl">Longest Streak</text>
      <text x="450" y="207" class="text-stat-sub">May 2 - May 15</text>
      <line class="progress-track" x1="450" y1="215" x2="620" y2="215" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="450" y1="215" x2="620" y2="215" style="--final-w: 120px; animation-delay: 0.8s;"/>
    </g>

    <!-- COLUMN 4: Repos & Meta -->
    <!-- Public Repos -->
    <g class="animate-item" style="animation-delay: 0.8s;">
      <text x="660" y="95" class="text-stat-num" style="animation-delay: 0.7s;">{repos}</text>
      <text x="660" y="113" class="text-stat-lbl">Public Repositories</text>
      <line class="progress-track" x1="660" y1="122" x2="830" y2="122" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="660" y1="122" x2="830" y2="122" style="--final-w: 110px; animation-delay: 0.9s;"/>
    </g>
    <!-- Metadata -->
    <g class="animate-item" style="animation-delay: 0.9s;">
      <text x="660" y="175" class="text-title" font-size="16px">Joined 1 Year Ago</text>
      <text x="660" y="193" class="text-stat-lbl">Account History</text>
      <text x="660" y="207" class="text-stat-sub">Active since 2025</text>
    </g>
  </g>

  <!-- Gradients definition for Water Wave flow -->
  <defs>
    <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--accent)" />
      <stop offset="50%" stop-color="var(--accent-light)" />
      <stop offset="100%" stop-color="var(--accent)" />
    </linearGradient>
  </defs>
</svg>
'''

path = "./assets/branding/github-profile-card.svg"
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w", encoding="utf-8") as f:
    f.write(svg)
print(f"Generated: {path}")
print(f"Views: {views}, Repos: {repos}, Followers: {followers}")
