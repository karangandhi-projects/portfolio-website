import { describe, it, expect } from 'vitest';
import { projects } from './projects';
import { skills } from './skills';
import { experience } from './experience';
import { nowItems } from './now';
import { links } from './links';

describe('projects data', () => {
  it('every project has the required fields', () => {
    for (const p of projects) {
      expect(p.name).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.url).toMatch(/^https:\/\/github\.com\//);
      expect(p.summary).toBeTruthy();
      expect(p.focus).toBeTruthy();
      expect(p.icon).toBeTruthy();
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it('slugs are unique', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has at least 6 featured projects', () => {
    expect(projects.filter((p) => p.featured).length).toBeGreaterThanOrEqual(6);
  });
});

describe('skills data', () => {
  it('each category has a title and items', () => {
    for (const c of skills) {
      expect(c.title).toBeTruthy();
      expect(c.items.length).toBeGreaterThan(0);
    }
  });
});

describe('experience data', () => {
  it('has company, role, dates and areas', () => {
    expect(experience.company).toBeTruthy();
    expect(experience.role).toBeTruthy();
    expect(experience.dates).toBeTruthy();
    expect(experience.areas.length).toBeGreaterThan(0);
  });
});

describe('now data', () => {
  it('each item has a valid status', () => {
    for (const n of nowItems) {
      expect(['exploring', 'building', 'planning']).toContain(n.status);
      expect(n.icon).toBeTruthy();
      expect(n.title).toBeTruthy();
    }
  });
});

describe('links data', () => {
  it('has github, linkedin, email and resume', () => {
    expect(links.github).toMatch(/^https:\/\//);
    expect(links.linkedin).toMatch(/^https:\/\//);
    expect(links.email).toContain('@');
    expect(links.resume).toBe('/resume.pdf');
  });
});
