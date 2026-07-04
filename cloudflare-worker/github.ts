export interface RawGitHubData {
  createdAt: string;
  followers: number;
  following: number;
  reposCount: number;
  stars: number;
  languages: { [key: string]: { size: number; color: string } };
  calendarDays: { date: string; count: number }[];
}

export async function fetchGitHubData(username: string, token: string): Promise<RawGitHubData> {
  const query = `
    query($username: String!) {
      user(login: $username) {
        createdAt
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
          totalCount
          nodes {
            stargazerCount
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Cloudflare-Worker-Stats",
      "Authorization": `bearer ${token}`
    },
    body: JSON.stringify({ query, variables: { username } })
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API error: ${response.statusText}`);
  }

  const json: any = await response.json();
  if (json.errors) {
    throw new Error(`GitHub GraphQL Query error: ${JSON.stringify(json.errors)}`);
  }

  const user = json.data.user;
  if (!user) {
    throw new Error("GitHub user not found.");
  }

  const reposNodes = user.repositories.nodes || [];
  let stars = 0;
  const languages: { [key: string]: { size: number; color: string } } = {};

  for (const node of reposNodes) {
    stars += node.stargazerCount || 0;
    const langEdges = node.languages?.edges || [];
    for (const edge of langEdges) {
      const name = edge.node.name;
      const color = edge.node.color || "#cccccc";
      const size = edge.size;
      if (!languages[name]) {
        languages[name] = { size: 0, color };
      }
      languages[name].size += size;
    }
  }

  const calendarDays: { date: string; count: number }[] = [];
  const weeks = user.contributionsCollection?.contributionCalendar?.weeks || [];
  for (const week of weeks) {
    const days = week.contributionDays || [];
    for (const day of days) {
      calendarDays.push({
        date: day.date,
        count: day.contributionCount
      });
    }
  }

  return {
    createdAt: user.createdAt,
    followers: user.followers?.totalCount || 0,
    following: user.following?.totalCount || 0,
    reposCount: user.repositories?.totalCount || 0,
    stars,
    languages,
    calendarDays
  };
}

export async function fetchProfileViews(username: string): Promise<number> {
  try {
    const response = await fetch(`https://komarev.com/ghpvc/?username=${username}`, {
      headers: { "User-Agent": "Cloudflare-Worker-Stats" }
    });
    if (response.ok) {
      const svg = await response.text();
      const matches = svg.match(/<text[^>]*>([\d\s,]+)<\/text>/g);
      if (matches && matches.length >= 2) {
        const cleanStr = matches[1].replace(/<[^>]*>/g, "").replace(/\s+/g, "").replace(/,/g, "");
        const num = parseInt(cleanStr, 10);
        if (!isNaN(num)) return num;
      }
    }
  } catch (e) {
    console.error("Komarev views fetch failed, defaulting:", e);
  }
  return 1200; // fallback
}
