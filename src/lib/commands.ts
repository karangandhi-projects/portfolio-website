import { commands } from '../data/nav';

/**
 * Resolve a typed command string to a navigation target.
 * Accepts bare commands ("projects"), prompt-prefixed ("$ projects"),
 * and shell-ish forms ("ls projects/", "cat now.md").
 * Returns the target ('#anchor' or path) or null if nothing matches.
 */
export function resolveCommand(input: string): string | null {
  const cleaned = input.trim().toLowerCase().replace(/^\$\s*/, '');
  if (!cleaned) return null;

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const candidates = [cleaned, ...tokens.slice().reverse()];

  for (const candidate of candidates) {
    const match = commands.find(
      (c) => candidate === c.cmd || candidate === `${c.cmd}.md` || candidate === `${c.cmd}/`,
    );
    if (match) return match.target;
  }
  return null;
}
