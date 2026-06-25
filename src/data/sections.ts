export type SectionKey = 'home' | 'experience' | 'projects' | 'skills' | 'ai' | 'about';

export type SectionTab = { key: SectionKey; label: string; href: string };

export const sections: SectionTab[] = [
  { key: 'home', label: 'home', href: '/' },
  { key: 'experience', label: 'experience', href: '/experience' },
  { key: 'projects', label: 'projects', href: '/projects' },
  { key: 'skills', label: 'skills', href: '/skills' },
  { key: 'ai', label: 'ai', href: '/ai' },
  { key: 'about', label: 'about', href: '/about' },
];

export type Crumb = { label: string; href?: string };

/** Breadcrumb path segments for a section page. Home is just the '~' root. */
export function crumbsFor(current: SectionKey): Crumb[] {
  if (current === 'home') return [{ label: '~', href: '/' }];
  const tab = sections.find((s) => s.key === current);
  return [
    { label: '~', href: '/' },
    { label: tab ? tab.label : current }, // current segment: no href
  ];
}
