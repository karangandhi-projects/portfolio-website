const WORDS_PER_MINUTE = 200;

/** Estimate reading time from raw text/markdown, e.g. "10 min read". */
export function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
