const readmeCache = new Map<string, string>();

function stripMarkdown(input: string) {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\r/g, "")
    .trim();
}

function getFirstUsefulParagraph(markdown: string) {
  const cleaned = stripMarkdown(markdown);
  const paragraphs = cleaned
    .split(/\n\s*\n/g)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter((p) => p.length > 35);

  return paragraphs[0] ?? null;
}

function fallbackFromRepoName(name: string, language: string | null) {
  const pretty = name.replace(/[-_]+/g, " ").trim();
  return `${pretty} is a ${language ?? "software"} project built and maintained by Bugh0lic.`;
}

export async function getAutoRepoDescription(
  fullName: string,
  repoName: string,
  language: string | null,
  signal?: AbortSignal,
) {
  if (readmeCache.has(fullName)) {
    return readmeCache.get(fullName)!;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${fullName}/readme`, { signal });
    if (!response.ok) {
      const fallback = fallbackFromRepoName(repoName, language);
      readmeCache.set(fullName, fallback);
      return fallback;
    }

    const data = (await response.json()) as { content?: string; encoding?: string };
    if (!data.content || data.encoding !== "base64") {
      const fallback = fallbackFromRepoName(repoName, language);
      readmeCache.set(fullName, fallback);
      return fallback;
    }

    const decoded = atob(data.content.replace(/\n/g, ""));
    const summary = getFirstUsefulParagraph(decoded) ?? fallbackFromRepoName(repoName, language);
    readmeCache.set(fullName, summary);
    return summary;
  } catch {
    const fallback = fallbackFromRepoName(repoName, language);
    readmeCache.set(fullName, fallback);
    return fallback;
  }
}
