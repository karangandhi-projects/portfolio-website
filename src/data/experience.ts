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
    role: 'Embedded Software Engineer',
    dates: 'Jun 2020 – Apr 2023',
    icon: 'qualcomm',
    summary:
      'Developed and optimized production C firmware for ARM-based LTE / 5G modem platforms serving global carriers — covering RTOS, low-level drivers, power management, and system debugging from bring-up to release.',
    highlights: [
      'Built Python-based crash-log / diagnostic tooling (with Trace32 hardware data and configs) that reduced crash-log debug effort by ~30% and produced complete, team-focused debug reports.',
      'Debugged complex power, timing, and cross-subsystem integration issues; validated initialization flows and low-power transitions through on-target integration testing.',
      'Contributed to firmware releases deployed in commercial modem products; worked across multiple sub-teams to understand the full system.',
    ],
    areas: ['LTE / 5G modem firmware', 'RTOS', 'Power management', 'On-target integration testing', 'Python diagnostics', 'Trace32'],
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
