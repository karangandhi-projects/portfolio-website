import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { projects } from './projects';
import { skills } from './skills';
import { experiences } from './experience';
import { education } from './education';
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
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(p.date).getTime())).toBe(false);
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it('slugs are unique', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('marks exactly the four home-featured projects', () => {
    const featured = projects.filter((p) => p.featured).map((p) => p.slug).sort();
    expect(featured).toEqual(
      [
        'ble-environmental-sensor-node',
        'mini-ecu-v2',
        'stm32-smart-sensor-hub',
        'vnet-driver',
      ].sort(),
    );
  });

  it('every featured project has status, validation and evidence', () => {
    for (const p of projects.filter((x) => x.featured)) {
      expect(p.status, `${p.slug} status`).toBeTruthy();
      expect(p.validation, `${p.slug} validation`).toBeTruthy();
      expect(p.evidence, `${p.slug} evidence`).toBeTruthy();
    }
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
  it('has at least one entry with company, role, dates and areas', () => {
    expect(experiences.length).toBeGreaterThan(0);
    for (const e of experiences) {
      expect(e.company).toBeTruthy();
      expect(e.role).toBeTruthy();
      expect(e.dates).toBeTruthy();
      expect(e.areas.length).toBeGreaterThan(0);
    }
  });
});

describe('education data', () => {
  it('each entry has school, degree and dates', () => {
    expect(education.length).toBeGreaterThan(0);
    for (const e of education) {
      expect(e.school).toBeTruthy();
      expect(e.degree).toBeTruthy();
      expect(e.dates).toBeTruthy();
    }
  });
});

describe('now data', () => {
  it('each item has a valid status', () => {
    for (const n of nowItems) {
      expect(['exploring', 'building', 'planning', 'learning']).toContain(n.status);
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

describe('case studies', () => {
  it('every case study file matches a project slug', () => {
    const slugs = new Set(projects.map((p) => p.slug));
    const dir = new URL('../content/case-studies/', import.meta.url);
    const files = readdirSync(dir).filter((f: string) => f.endsWith('.md'));
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const slug = f.replace(/\.md$/, '');
      expect(slugs.has(slug)).toBe(true);
    }
  });
});
