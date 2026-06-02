export type NowItem = {
  title: string;
  description: string;
  status: 'exploring' | 'building' | 'planning';
  icon: string; // key into src/lib/icons.ts
};

export const nowUpdated = 'this week';

export const nowItems: NowItem[] = [
  {
    title: 'TinyML on microcontrollers',
    description: 'Running tiny models on ESP32 — quantization and on-device inference.',
    status: 'exploring',
    icon: 'tensorflow',
  },
  {
    title: 'Deeper Linux driver work',
    description: 'Character devices, sysfs, and the driver model internals.',
    status: 'building',
    icon: 'linux',
  },
  {
    title: 'OTA updates & rollback',
    description: 'Safe firmware update flows with A/B partitions and rollback.',
    status: 'planning',
    icon: 'espressif',
  },
  {
    title: 'AI-assisted embedded workflows',
    description: 'Using AI harnesses/MCP for docs, test plans, and debugging.',
    status: 'building',
    icon: 'anthropic',
  },
];
