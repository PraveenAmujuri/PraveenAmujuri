import { RawGitHubData } from "./github";

export interface LanguageStat {
  name: string;
  size: number;
  color: string;
  percentage: number;
}

export interface ProfileStats {
  username: string;
  views: number;
  followers: number;
  following: number;
  repos: number;
  stars: number;
  totalContributions: number;
  contribsCurrentYear: number;
  currentStreak: number;
  longestStreak: number;
  joinedYear: string;
  languages: LanguageStat[];
  calendarDays: { date: string; count: number }[];
}

export function compileProfileStats(
  username: string,
  raw: RawGitHubData,
  views: number
): ProfileStats {
  const currentYear = new Date().getFullYear();
  
  // Calculate total and current year contributions
  const totalContributions = raw.calendarDays.reduce((sum, day) => sum + day.count, 0);
  const contribsCurrentYear = raw.calendarDays
    .filter(day => day.date.startsWith(`${currentYear}-`))
    .reduce((sum, day) => sum + day.count, 0);

  // Calculate Language percentages
  let totalLangSize = 0;
  const langList: LanguageStat[] = [];
  for (const name in raw.languages) {
    totalLangSize += raw.languages[name].size;
  }

  for (const name in raw.languages) {
    const item = raw.languages[name];
    langList.push({
      name,
      size: item.size,
      color: item.color,
      percentage: totalLangSize > 0 ? parseFloat(((item.size / totalLangSize) * 100).toFixed(1)) : 0
    });
  }
  // Sort by size descending
  langList.sort((a, b) => b.size - a.size);

  // Calculate Streaks
  const { currentStreak, longestStreak } = calculateStreaks(raw.calendarDays);

  // Joined year
  let joinedYear = "2025";
  try {
    joinedYear = new Date(raw.createdAt).getFullYear().toString();
  } catch (e) {
    // fallback
  }

  return {
    username,
    views,
    followers: raw.followers,
    following: raw.following,
    repos: raw.reposCount,
    stars: raw.stars,
    totalContributions,
    contribsCurrentYear,
    currentStreak,
    longestStreak,
    joinedYear,
    languages: langList,
    calendarDays: raw.calendarDays
  };
}

function calculateStreaks(days: { date: string; count: number }[]): {
  currentStreak: number;
  longestStreak: number;
} {
  // Sort days ascending
  const sorted = [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let longestStreak = 0;
  let tempStreak = 0;

  // Longest streak
  for (const day of sorted) {
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Current streak (working backward)
  let currentStreak = 0;
  if (sorted.length > 0) {
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Find if today or yesterday has contributions
    let startIndex = sorted.length - 1;
    // Move back if days are in future
    while (startIndex >= 0 && sorted[startIndex].date > todayStr) {
      startIndex--;
    }

    if (startIndex >= 0) {
      const lastDay = sorted[startIndex];
      const hasContribRecently =
        lastDay.date === todayStr && lastDay.count > 0 ||
        lastDay.date === yesterdayStr && lastDay.count > 0 ||
        (startIndex > 0 && sorted[startIndex - 1].date === yesterdayStr && sorted[startIndex - 1].count > 0);

      if (hasContribRecently) {
        let i = lastDay.count > 0 ? startIndex : startIndex - 1;
        while (i >= 0 && sorted[i].count > 0) {
          currentStreak++;
          i--;
        }
      }
    }
  }

  return { currentStreak, longestStreak };
}
