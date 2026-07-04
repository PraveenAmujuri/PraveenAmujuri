export default {
  async fetch(request, env, ctx) {
    const username = "PraveenAmujuri";
    
    // Default fallback values
    let repos = 32;
    let followers = 6;
    let views = 1200;
    let totalContribs = 509;
    let contribs2026 = 348;
    let currentStreak = 3;
    let longestStreak = 14;

    const headers = { "User-Agent": "Cloudflare-Worker-Stats" };
    if (env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${env.GITHUB_TOKEN}`;
    }

    // 1. Fetch Repos & Followers from GitHub API
    try {
      const apiRes = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (apiRes.ok) {
        const data = await apiRes.json();
        repos = data.public_repos ?? repos;
        followers = data.followers ?? followers;
      }
    } catch (e) {
      console.error("Error fetching GitHub API:", e);
    }

    // 2. Fetch Profile Views from Komarev
    try {
      const viewsRes = await fetch(`https://komarev.com/ghpvc/?username=${username}`, { headers });
      if (viewsRes.ok) {
        const svgContent = await viewsRes.text();
        const matches = svgContent.match(/<text[^>]*>([\d\s,]+)<\/text>/g);
        if (matches && matches.length >= 2) {
          const viewsStr = matches[1].replace(/<[^>]*>/g, "").replace(/\s+/g, "").replace(/,/g, "");
          if (!isNaN(viewsStr)) {
            views = parseInt(viewsStr, 10);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching views:", e);
    }

    // 3. Fetch Contributions & Calculate Streaks dynamically from GitHub Page
    try {
      const contribRes = await fetch(`https://github.com/users/${username}/contributions`, { headers });
      if (contribRes.ok) {
        const html = await contribRes.text();
        
        // Match both forms: "X contributions on..." and "No contributions on..."
        const matches = [...html.matchAll(/<span[^>]*class="sr-only"[^>]*>(\d+|No) contributions?\s+on\s+([^<]+)<\/span>/gi)];
        
        if (matches.length > 0) {
          const dayCounts = [];
          
          for (const m of matches) {
            const count = m[1].toLowerCase() === "no" ? 0 : parseInt(m[1], 10);
            const dateStr = m[2].trim();
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              dayCounts.push({ date, dateStr, count });
            }
          }

          // Sort days ascending
          dayCounts.sort((a, b) => a.date - b.date);

          // Total and 2026 contributions
          totalContribs = dayCounts.reduce((sum, day) => sum + day.count, 0);
          contribs2026 = dayCounts
            .filter(day => day.date.getFullYear() === 2026)
            .reduce((sum, day) => sum + day.count, 0);

          // Calculate Streaks
          let current = 0;
          let longest = 0;
          let tempStreak = 0;

          // Compute longest streak
          for (const day of dayCounts) {
            if (day.count > 0) {
              tempStreak++;
              if (tempStreak > longest) {
                longest = tempStreak;
              }
            } else {
              tempStreak = 0;
            }
          }
          longestStreak = longest > 0 ? longest : longestStreak;

          // Compute current streak going backward from today/yesterday
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          // Find the last day in dayCounts
          let startIndex = dayCounts.length - 1;
          
          // Move back if the last day is in the future
          while (startIndex >= 0 && dayCounts[startIndex].date > today) {
            startIndex--;
          }

          if (startIndex >= 0) {
            const lastTrackedDay = dayCounts[startIndex];
            const diffTime = Math.abs(today - lastTrackedDay.date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If last contribution was today or yesterday, trace backward
            if (lastTrackedDay.count > 0 || (startIndex > 0 && dayCounts[startIndex - 1].count > 0 && diffDays <= 1)) {
              let i = lastTrackedDay.count > 0 ? startIndex : startIndex - 1;
              while (i >= 0 && dayCounts[i].count > 0) {
                current++;
                i--;
              }
            }
          }
          currentStreak = current > 0 ? current : currentStreak;
        }
      }
    } catch (e) {
      console.error("Error fetching contributions:", e);
    }

    // Render the SVG dynamically
    const svg = `<svg width="1000" height="260" viewBox="0 0 1000 260" xmlns="http://www.w3.org/2000/svg" fill="none">
  <style>
    :root {
      --bg-card: #EFEBE2;
      --ink: #211F1C;
      --ink-soft: #57534C;
      --muted: #9C958A;
      --line: #DDD6C7;
      --accent: #B54A2C;
      --accent-light: #D98B6F;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-card: #161b22;
        --ink: #EAEFF8;
        --ink-soft: #A3B3CA;
        --muted: #7E8C9F;
        --line: #30363D;
        --accent: #E56A47;
        --accent-light: #f0a38e;
      }
    }
    
    @keyframes barSlideIn {
      from { width: 0; }
      to { width: var(--final-w); }
    }
    @keyframes statFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes waveFlow {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -40; }
    }
    @keyframes pulseSoft {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.85; }
    }
    @keyframes headerLineFlow {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -30; }
    }
    
    .card {
      fill: var(--bg-card);
      stroke: var(--line);
      stroke-width: 1;
      rx: 6px;
    }
    .text-title {
      font-family: Georgia, 'Iowan Old Style', 'Times New Roman', serif;
      font-size: 22px;
      fill: var(--ink);
    }
    .text-subtitle {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 11px;
      letter-spacing: 1.5px;
      fill: var(--muted);
    }
    .text-stat-num {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 700;
      fill: var(--accent);
      animation: pulseSoft 4s ease-in-out infinite;
    }
    .text-stat-lbl {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      fill: var(--ink-soft);
    }
    .text-stat-sub {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 10px;
      fill: var(--muted);
    }
    .progress-track {
      fill: var(--line);
      rx: 1.5px;
    }
    .progress-bar {
      stroke: url(#waveGrad);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 8 4;
      animation: barSlideIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, waveFlow 4s linear infinite;
    }
    .header-hairline {
      stroke: var(--line);
      stroke-width: 1;
      stroke-dasharray: 20 10;
      animation: headerLineFlow 4s linear infinite;
    }
    .animate-item {
      opacity: 0;
      animation: statFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
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
      <text x="30" y="95" class="text-stat-num" style="animation-delay: 0.1s;">${views}</text>
      <text x="30" y="113" class="text-stat-lbl">Profile Views</text>
      <line class="progress-track" x1="30" y1="122" x2="200" y2="122" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="30" y1="122" x2="200" y2="122" style="--final-w: 120px; animation-delay: 0.3s;"/>
    </g>
    <!-- Followers -->
    <g class="animate-item" style="animation-delay: 0.3s;">
      <text x="30" y="175" class="text-stat-num" style="animation-delay: 0.2s;">${followers}</text>
      <text x="30" y="193" class="text-stat-lbl">Followers on GitHub</text>
      <line class="progress-track" x1="30" y1="202" x2="200" y2="202" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="30" y1="202" x2="200" y2="202" style="--final-w: 40px; animation-delay: 0.4s;"/>
    </g>

    <!-- COLUMN 2: Contributions -->
    <!-- Total Contributions -->
    <g class="animate-item" style="animation-delay: 0.4s;">
      <text x="240" y="95" class="text-stat-num" style="animation-delay: 0.3s;">${totalContribs}</text>
      <text x="240" y="113" class="text-stat-lbl">Total Contributions</text>
      <text x="240" y="127" class="text-stat-sub">Mar 29, 2025 - Present</text>
      <line class="progress-track" x1="240" y1="135" x2="410" y2="135" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="240" y1="135" x2="410" y2="135" style="--final-w: 130px; animation-delay: 0.5s;"/>
    </g>
    <!-- 2026 Contributions -->
    <g class="animate-item" style="animation-delay: 0.5s;">
      <text x="240" y="175" class="text-stat-num" style="animation-delay: 0.4s;">${contribs2026}</text>
      <text x="240" y="193" class="text-stat-lbl">Contributions in 2026</text>
      <text x="240" y="207" class="text-stat-sub">Current Year Activity</text>
      <line class="progress-track" x1="240" y1="215" x2="410" y2="215" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="240" y1="215" x2="410" y2="215" style="--final-w: 95px; animation-delay: 0.6s;"/>
    </g>

    <!-- COLUMN 3: Streaks -->
    <!-- Current Streak -->
    <g class="animate-item" style="animation-delay: 0.6s;">
      <text x="450" y="95" class="text-stat-num" style="animation-delay: 0.5s;">${currentStreak}</text>
      <text x="450" y="113" class="text-stat-lbl">Current Streak</text>
      <text x="450" y="127" class="text-stat-sub">Active Streak</text>
      <line class="progress-track" x1="450" y1="135" x2="620" y2="135" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="450" y1="135" x2="620" y2="135" style="--final-w: 30px; animation-delay: 0.7s;"/>
    </g>
    <!-- Longest Streak -->
    <g class="animate-item" style="animation-delay: 0.7s;">
      <text x="450" y="175" class="text-stat-num" style="animation-delay: 0.6s;">${longestStreak}</text>
      <text x="450" y="193" class="text-stat-lbl">Longest Streak</text>
      <text x="450" y="207" class="text-stat-sub">All-Time Peak</text>
      <line class="progress-track" x1="450" y1="215" x2="620" y2="215" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="450" y1="215" x2="620" y2="215" style="--final-w: 120px; animation-delay: 0.8s;"/>
    </g>

    <!-- COLUMN 4: Repos & Meta -->
    <!-- Public Repos -->
    <g class="animate-item" style="animation-delay: 0.8s;">
      <text x="660" y="95" class="text-stat-num" style="animation-delay: 0.7s;">${repos}</text>
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
</svg>`;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=21600, s-maxage=21600, stale-while-revalidate=3600"
      }
    });
  }
};
