export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  updated_at: string;
};

const GITHUB_API_BASE = "https://api.github.com";

export async function fetchUserRepos(username: string, signal?: AbortSignal) {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status})`);
  }

  return (await response.json()) as GitHubRepo[];
}

export async function fetchUserStarredRepos(username: string, signal?: AbortSignal) {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}/starred?per_page=100`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status})`);
  }

  return (await response.json()) as GitHubRepo[];
}

export function normalizeHomepageUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}
