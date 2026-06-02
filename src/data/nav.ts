export type NavCommand = {
  cmd: string;      // canonical command keyword
  label: string;    // chip label
  target: string;   // '#anchor' for same-page scroll, or a URL/path to navigate
};

export const commands: NavCommand[] = [
  { cmd: 'about', label: 'about', target: '#about' },
  { cmd: 'projects', label: 'projects', target: '#projects' },
  { cmd: 'skills', label: 'skills', target: '#skills' },
  { cmd: 'experience', label: 'experience', target: '#experience' },
  { cmd: 'now', label: 'now', target: '#now' },
  { cmd: 'contact', label: 'contact', target: '#contact' },
  { cmd: 'resume', label: 'resume', target: '/resume.pdf' },
];
