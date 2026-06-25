export type NavCommand = {
  cmd: string;      // canonical command keyword
  label: string;    // chip label
  target: string;   // '#anchor' for same-page scroll, or a URL/path to navigate
};

export const commands: NavCommand[] = [
  { cmd: 'about', label: 'about', target: '/about' },
  { cmd: 'projects', label: 'projects', target: '/projects' },
  { cmd: 'skills', label: 'skills', target: '/skills' },
  { cmd: 'ai', label: 'ai', target: '/ai' },
  { cmd: 'experience', label: 'experience', target: '/experience' },
  { cmd: 'education', label: 'education', target: '/about#education' },
  { cmd: 'now', label: 'now', target: '/about#now' },
  { cmd: 'contact', label: 'contact', target: '/#contact' },
  { cmd: 'resume', label: 'resume', target: '/resume.pdf' },
];
