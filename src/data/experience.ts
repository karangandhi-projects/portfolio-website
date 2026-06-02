export type Experience = {
  company: string;
  role: string;
  dates: string;
  summary: string;
  areas: string[];
  highlights?: string[];
  icon?: string;
};

export const experiences: Experience[] = [
  {
    company: 'Qualcomm Technologies, Inc.',
    role: 'Modem Software Engineer',
    dates: 'Jun 2020 – Apr 2023',
    icon: 'qualcomm',
    summary:
      'Worked on modem software and power management for mobile platforms — low-level systems work on production firmware at scale, with a strong emphasis on debugging, root-cause analysis, and reliability.',
    highlights: [
      'Took the initiative to build a crash-log / root-cause analysis tool (Python + Regex) that pulled hardware data and configs via Trace32 and generated complete, team-focused debug reports.',
      'Worked across multiple sub-teams, shadowing them to understand the full system my team was responsible for.',
    ],
    areas: ['Modem software', 'Power management', 'Root-cause analysis', 'Python + Regex tooling', 'Trace32', 'Cross-team collaboration'],
  },
  {
    company: 'Family Business',
    role: 'Operations — non-technical role',
    dates: '2023 – Present',
    summary:
      'Supported the family business in a non-technical capacity while continuing to build embedded and AI-assisted engineering projects on the side. Now actively returning to firmware / embedded engineering full-time.',
    areas: ['Operations', 'Self-directed embedded projects'],
  },
];
