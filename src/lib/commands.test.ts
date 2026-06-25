import { describe, it, expect } from 'vitest';
import { resolveCommand } from './commands';

describe('resolveCommand', () => {
  it('resolves a bare command', () => {
    expect(resolveCommand('projects')).toBe('/projects');
  });
  it('is case-insensitive', () => {
    expect(resolveCommand('PROJECTS')).toBe('/projects');
  });
  it('ignores a leading $ prompt', () => {
    expect(resolveCommand('$ about')).toBe('/about');
  });
  it('handles ls-style trailing slash', () => {
    expect(resolveCommand('ls projects/')).toBe('/projects');
  });
  it('handles cat now.md', () => {
    expect(resolveCommand('cat now.md')).toBe('/about#now');
  });
  it('resolves resume to its file path', () => {
    expect(resolveCommand('resume')).toBe('/resume.pdf');
  });
  it('returns null for unknown input', () => {
    expect(resolveCommand('rm -rf /')).toBeNull();
  });
});
