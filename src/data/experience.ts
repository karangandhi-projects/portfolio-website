export type Experience = {
  company: string;
  role: string;
  dates: string;
  summary: string;
  areas: string[];
};

export const experience: Experience = {
  company: 'Qualcomm Technologies',
  role: 'Modem Software Engineer',
  dates: 'Jun 2020 – Apr 2023',
  summary:
    'Worked on modem software and power management for mobile platforms — low-level systems work on production firmware at scale, with an emphasis on debugging, validation, and reliability.',
  areas: ['Modem software', 'Power management', 'Low-level debugging', 'Production firmware', 'Cross-team validation'],
};
