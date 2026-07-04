import { ProfileStats } from "./stats";

// Helper to wrap the SVG inside the standard card template
function wrapCard(title: string, subtitle: string, body: string, height: number = 240, extra_styles: string = ""): string {
  return `<svg width="1000" height="${height}" viewBox="0 0 1000 ${height}" xmlns="http://www.w3.org/2000/svg" fill="none">
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
    ${extra_styles}
  </style>

  <!-- BACKGROUND CARD -->
  <rect class="card" x="64" y="5" width="872" height="${height - 10}"/>

  <!-- HEADER -->
  <g transform="translate(64, 5)">
    <text x="30" y="38" class="text-title animate-item" style="animation-delay: 0.1s;">${title}</text>
    <text x="842" y="36" class="text-subtitle animate-item" text-anchor="end" style="animation-delay: 0.1s;">${subtitle}</text>
    <line class="header-hairline" x1="30" y1="52" x2="842" y2="52"/>
  </g>

  <!-- BODY -->
  <g transform="translate(64, 5)">
    ${body}
  </g>

  <!-- Defs for water wave -->
  <defs>
    <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--accent)" />
      <stop offset="50%" stop-color="var(--accent-light)" />
      <stop offset="100%" stop-color="var(--accent)" />
    </linearGradient>
  </defs>
</svg>`;
}

export function renderSummarySVG(stats: ProfileStats): string {
  const body = `
    <!-- COLUMN 1: Profile Views & Followers -->
    <g class="animate-item" style="animation-delay: 0.2s;">
      <text x="30" y="95" class="text-stat-num" style="animation-delay: 0.1s;">${stats.views}</text>
      <text x="30" y="113" class="text-stat-lbl">Profile Views</text>
      <line class="progress-track" x1="30" y1="122" x2="200" y2="122" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="30" y1="122" x2="200" y2="122" style="--final-w: 120px; animation-delay: 0.3s;"/>
    </g>
    <g class="animate-item" style="animation-delay: 0.3s;">
      <text x="30" y="175" class="text-stat-num" style="animation-delay: 0.2s;">${stats.followers}</text>
      <text x="30" y="193" class="text-stat-lbl">Followers on GitHub</text>
      <line class="progress-track" x1="30" y1="202" x2="200" y2="202" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="30" y1="202" x2="200" y2="202" style="--final-w: 40px; animation-delay: 0.4s;"/>
    </g>

    <!-- COLUMN 2: Contributions -->
    <g class="animate-item" style="animation-delay: 0.4s;">
      <text x="240" y="95" class="text-stat-num" style="animation-delay: 0.3s;">${stats.totalContributions}</text>
      <text x="240" y="113" class="text-stat-lbl">Total Contributions</text>
      <text x="240" y="127" class="text-stat-sub">Mar 29, ${stats.joinedYear} - Present</text>
      <line class="progress-track" x1="240" y1="135" x2="410" y2="135" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="240" y1="135" x2="410" y2="135" style="--final-w: 130px; animation-delay: 0.5s;"/>
    </g>
    <g class="animate-item" style="animation-delay: 0.5s;">
      <text x="240" y="175" class="text-stat-num" style="animation-delay: 0.4s;">${stats.contribsCurrentYear}</text>
      <text x="240" y="193" class="text-stat-lbl">Contributions in 2026</text>
      <text x="240" y="207" class="text-stat-sub">Current Year Activity</text>
      <line class="progress-track" x1="240" y1="215" x2="410" y2="215" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="240" y1="215" x2="410" y2="215" style="--final-w: 95px; animation-delay: 0.6s;"/>
    </g>

    <!-- COLUMN 3: Streaks -->
    <g class="animate-item" style="animation-delay: 0.6s;">
      <text x="450" y="95" class="text-stat-num" style="animation-delay: 0.5s;">${stats.currentStreak}</text>
      <text x="450" y="113" class="text-stat-lbl">Current Streak</text>
      <text x="450" y="127" class="text-stat-sub">Active Streak</text>
      <line class="progress-track" x1="450" y1="135" x2="620" y2="135" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="450" y1="135" x2="620" y2="135" style="--final-w: 30px; animation-delay: 0.7s;"/>
    </g>
    <g class="animate-item" style="animation-delay: 0.7s;">
      <text x="450" y="175" class="text-stat-num" style="animation-delay: 0.6s;">${stats.longestStreak}</text>
      <text x="450" y="193" class="text-stat-lbl">Longest Streak</text>
      <text x="450" y="207" class="text-stat-sub">All-Time Peak</text>
      <line class="progress-track" x1="450" y1="215" x2="620" y2="215" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="450" y1="215" x2="620" y2="215" style="--final-w: 120px; animation-delay: 0.8s;"/>
    </g>

    <!-- COLUMN 4: Repos & Meta -->
    <g class="animate-item" style="animation-delay: 0.8s;">
      <text x="660" y="95" class="text-stat-num" style="animation-delay: 0.7s;">${stats.repos}</text>
      <text x="660" y="113" class="text-stat-lbl">Public Repositories</text>
      <line class="progress-track" x1="660" y1="122" x2="830" y2="122" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="660" y1="122" x2="830" y2="122" style="--final-w: 110px; animation-delay: 0.9s;"/>
    </g>
    <g class="animate-item" style="animation-delay: 0.9s;">
      <text x="660" y="175" class="text-title" font-size="16px">Joined ${stats.joinedYear}</text>
      <text x="660" y="193" class="text-stat-lbl">Account History</text>
      <text x="660" y="207" class="text-stat-sub">Active Developer</text>
    </g>
  `;

  return wrapCard(stats.username, "GITHUB PROFILE SUMMARY", body, 260);
}

export function renderLanguagesSVG(stats: ProfileStats): string {
  // Render up to 5 top languages
  const topLangs = stats.languages.slice(0, 5);
  let body = "";
  
  if (topLangs.length === 0) {
    body = `<text x="30" y="120" class="text-title">No language statistics found.</text>`;
  } else {
    topLangs.forEach((lang, index) => {
      const y = 95 + index * 30;
      const barY = y - 8;
      const w = 180;
      const finalW = Math.round((lang.percentage / 100) * w);
      
      body += `
        <g class="animate-item" style="animation-delay: ${0.2 + index * 0.1}s;">
          <circle cx="35" cy="${y - 4}" r="5" fill="${lang.color}"/>
          <text x="50" y="${y}" class="text-stat-lbl" font-weight="700">${lang.name}</text>
          <text x="240" y="${y}" class="text-stat-lbl">${lang.percentage}%</text>
          <line x1="300" y1="${barY}" x2="480" y2="${barY}" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>
          <line x1="300" y1="${barY}" x2="480" y2="${barY}" stroke="${lang.color}" stroke-width="4" stroke-linecap="round" style="stroke-dasharray: ${w}; stroke-dashoffset: ${w}; animation: barSlideIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; --final-w: ${finalW}px;"/>
        </g>
      `;
    });
  }

  // Right column: Star Count & Total Repos Info
  body += `
    <g class="animate-item" style="animation-delay: 0.6s;">
      <text x="600" y="105" class="text-stat-num" style="--origin: 600px 105px;">${stats.stars}</text>
      <text x="600" y="123" class="text-stat-lbl">GitHub Stars Received</text>
      <line class="progress-track" x1="600" y1="132" x2="800" y2="132" stroke-width="3" stroke-linecap="round"/>
      <line class="progress-bar" x1="600" y1="132" x2="800" y2="132" style="--final-w: 120px; animation-delay: 0.8s;"/>
    </g>
    <g class="animate-item" style="animation-delay: 0.7s;">
      <text x="600" y="180" class="text-stat-lbl" font-weight="700">Repositories analyzed: ${stats.repos}</text>
      <text x="600" y="195" class="text-stat-sub">Based on ownership details</text>
    </g>
  `;

  return wrapCard(stats.username, "TOP PROGRAMMING LANGUAGES", body, 260);
}

export function renderActivitySVG(stats: ProfileStats): string {
  // Get exactly the last 31 days for a detailed contribution graph
  const sampledDays = stats.calendarDays.slice(-31);

  // Map coordinates
  // Card x bounds inside wrapCard: 64 to 936 (width: 872px)
  // Left padding for Y-Axis labels: 100px. Available width for chart: 740px.
  // x-coords spaced evenly for 31 days
  const xStart = 100;
  const xEnd = 840;
  const dx = (xEnd - xStart) / 30; // 30 gaps for 31 points
  const xCoords = sampledDays.map((_, index) => Math.round(xStart + index * dx));

  const maxCount = Math.max(...sampledDays.map(d => d.count), 10);
  // Ensure maxCount is rounded up to an even number for clean grid lines
  const graphMax = Math.ceil(maxCount / 2) * 2; 
  
  const yBase = 200;
  const yPeak = 80;
  
  const yCoords = sampledDays.map(day => {
    const ratio = Math.min(day.count / graphMax, 1);
    return Math.round(yBase - ratio * (yBase - yPeak));
  });

  // Construct chart path - smooth cubic bezier curves connecting all 31 points
  let pathD = `M ${xCoords[0]} ${yCoords[0]}`;
  for (let i = 0; i < xCoords.length - 1; i++) {
    const x0 = xCoords[i];
    const y0 = yCoords[i];
    const x1 = xCoords[i+1];
    const y1 = yCoords[i+1];
    const cpX1 = x0 + dx * 0.4;
    const cpY1 = y0;
    const cpX2 = x1 - dx * 0.4;
    const cpY2 = y1;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x1} ${y1}`;
  }

  // Area under chart path
  const areaD = `${pathD} L ${xCoords[xCoords.length - 1]} ${yBase} L ${xCoords[0]} ${yBase} Z`;

  // Dynamic grid lines, Y-labels, X-labels, and nodes markup
  let gridLines = "";
  let nodes = "";
  let xLabels = "";
  let yLabels = "";
  
  // Y-axis grid lines & labels (generate dynamic lines from 0 to graphMax, divided into 7 segments)
  const divisions = 7;
  for (let i = 0; i <= divisions; i++) {
    const ratio = i / divisions;
    const yVal = Math.round(graphMax * ratio);
    const y = yBase - ratio * (yBase - yPeak);
    
    // Draw horizontal dashed grid lines
    gridLines += `
      <line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="var(--line)" stroke-width="1" ${i === 0 ? "" : 'stroke-dasharray="3 3"'} opacity="${i === 0 ? "0.5" : "0.3"}"/>
    `;
    
    // Y labels
    yLabels += `
      <text x="${xStart - 15}" y="${y + 4}" class="chart-label" text-anchor="end">${yVal}</text>
    `;
  }

  yLabels += `
    <text x="35" y="${(yBase + yPeak) / 2}" class="chart-label font-weight-bold" transform="rotate(-90 35 ${(yBase + yPeak) / 2})" text-anchor="middle">Contributions</text>
  `;

  sampledDays.forEach((day, index) => {
    const x = xCoords[index];
    const y = yCoords[index];
    
    // Nodes without inline transform-origin (handled by transform-box: fill-box in CSS)
    nodes += `
      <circle class="pt" cx="${x}" cy="${y}" r="3" fill="#ffffff" stroke="var(--accent)" stroke-width="2" style="animation-delay: ${1.0 + index * 0.04}s;"/>
    `;
    
    // Day of the month label for X-Axis (extract day value)
    let dayNum = "";
    try {
      dayNum = new Date(day.date).getDate().toString();
    } catch(e) {}
    
    xLabels += `
      <text x="${x}" y="222" class="chart-label animate-item" style="animation-delay: ${0.5 + index * 0.04}s;">${dayNum}</text>
    `;
  });

  const styles = `
    @keyframes drawPath {
      from { stroke-dasharray: 4000; stroke-dashoffset: 4000; }
      to { stroke-dasharray: 4000; stroke-dashoffset: 0; }
    }
    @keyframes areaFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pointExpand {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.3); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
    .chart-line {
      animation: drawPath 2.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
    }
    .chart-area {
      animation: areaFade 1.8s ease-out 1.4s forwards;
      opacity: 0;
    }
    .chart-label {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 9px;
      fill: var(--muted);
      text-anchor: middle;
    }
    .pt {
      transform-box: fill-box;
      transform-origin: center;
      animation: pointExpand 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `;

  const body = `
    <!-- Grid -->
    <g>${gridLines}</g>
    <!-- Shaded Area -->
    <path class="chart-area" d="${areaD}" fill="url(#areaGrad)"/>
    <!-- Line Chart -->
    <path class="chart-line" d="${pathD}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Data Points -->
    <g>${nodes}</g>
    <!-- Y Axis Labels -->
    <g>${yLabels}</g>
    <!-- X Axis Labels -->
    <g>${xLabels}</g>
    <!-- Centered X Axis Label -->
    <text x="${(xStart + xEnd) / 2}" y="240" class="chart-label font-weight-bold" text-anchor="middle">Days</text>
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2" />
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0" />
      </linearGradient>
    </defs>
  `;

  return wrapCard(stats.username, "CONTRIBUTIONS TIMELINE", body, 260, styles);
}

export function renderFallbackSVG(): string {
  const body = `
    <text x="30" y="100" class="text-title">GitHub Profile Status</text>
    <text x="30" y="130" class="text-stat-lbl">Stats temporarily unavailable (Offline/Caching).</text>
    <text x="30" y="150" class="text-stat-sub">Will refresh shortly.</text>
  `;
  return wrapCard("Profile Stats", "FALLBACK MODE", body, 200);
}
