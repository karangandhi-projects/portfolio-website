export type SkillCategory = {
  title: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  { title: 'Firmware', items: ['C', 'C++', 'STM32 HAL', 'FreeRTOS', 'RTOS internals', 'Bootloaders', 'Interrupts', 'Timers', 'Low-power / hibernation'] },
  { title: 'Platforms / MCUs', items: ['STM32 (ARM Cortex-M)', 'ESP32 / ESP32-C3', 'TI Tiva TM4C123G', 'Raspberry Pi', 'ARM Cortex-M'] },
  { title: 'Linux / Drivers', items: ['Kernel modules', 'Character drivers', 'Virtual network drivers', 'net_device', 'Linux user-space', 'Kali Linux'] },
  { title: 'Interfaces', items: ['UART', 'SPI', 'I2C', 'CAN', 'BLE', 'Zigbee', 'Sensor interfaces'] },
  { title: 'Debugging / Tools', items: ['GDB', 'JTAG/SWD', 'Trace32', 'Python + Regex tooling', 'Logic analyzer', 'Git / GitHub Actions'] },
  { title: 'AI-Assisted Engineering', items: ['Claude / Codex', 'Spec-driven development', 'Prompt → context → harness engineering', 'Architecture & test docs', 'Code review', 'Engineering harnesses'] },
  { title: 'Foundations', items: ['Requirements-first', 'Architecture-first', 'Phased development', 'Validation plans'] },
];
