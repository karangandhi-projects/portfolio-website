import { describe, it, expect } from 'vitest';
import { sections, crumbsFor } from './sections';

describe('sections', () => {
  it('exposes the six top-level tabs in order', () => {
    expect(sections.map((s) => s.key)).toEqual([
      'home', 'experience', 'projects', 'skills', 'ai', 'about',
    ]);
  });
  it('every tab has an absolute href', () => {
    for (const s of sections) expect(s.href.startsWith('/')).toBe(true);
  });
});

describe('crumbsFor', () => {
  it('home is just the ~ root linking home', () => {
    expect(crumbsFor('home')).toEqual([{ label: '~', href: '/' }]);
  });
  it('a section has root + current segment, current has no href', () => {
    expect(crumbsFor('experience')).toEqual([
      { label: '~', href: '/' },
      { label: 'experience' },
    ]);
  });
});
