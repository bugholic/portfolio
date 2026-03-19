import { fetchUserRepos, normalizeHomepageUrl } from "../../models/github/GitHubRepoModel";
import { getAutoRepoDescription } from "../../models/github/ReadmeModel";

export type PortfolioProject = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
  liveUrl: string | null;
  updatedAt: string;
};

const PORTFOLIO_USERNAME = "bugholic";

export async function getPortfolioProjects(signal?: AbortSignal): Promise<PortfolioProject[]> {
  const repos = await fetchUserRepos(PORTFOLIO_USERNAME, signal);

  const selected = repos
    .filter((repo) => !repo.archived && !repo.fork)
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
    .slice(0, 6);

  return Promise.all(
    selected.map(async (repo) => {
      const description =
        repo.description ??
        (await getAutoRepoDescription(repo.full_name, repo.name, repo.language, signal));

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        liveUrl: normalizeHomepageUrl(repo.homepage),
        updatedAt: repo.updated_at,
      };
    }),
  );
}
