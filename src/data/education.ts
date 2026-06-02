export type Education = {
  school: string;
  degree: string;
  dates: string;
  detail?: string;
};

export const education: Education[] = [
  {
    school: 'University of Texas at Arlington',
    degree: 'M.S. in Electrical Engineering',
    dates: 'Jan 2018 – Dec 2019',
    detail: 'GPA 4.0 / 4.0. Coursework in RTOS and embedded systems on the TI Tiva TM4C123G.',
  },
  {
    school: 'University of Mumbai',
    degree: 'B.E. in Electronics Engineering',
    dates: 'Aug 2013 – May 2017',
    detail: 'Foundations in electronics and embedded systems, with hands-on Raspberry Pi projects.',
  },
];
