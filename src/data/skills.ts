export type SkillCategory = {
  title: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  { title: 'Firmware', items: ['C', 'C++', 'STM32 HAL', 'FreeRTOS', 'RTOS internals', 'Bare-metal firmware', 'Bootloaders', 'Low-power / hibernation'] },
  { title: 'Platforms / MCUs', items: ['ARM Cortex-M', 'STM32', 'TI Tiva TM4C', 'ESP32 / ESP32-C3', 'Raspberry Pi'] },
  { title: 'Linux / Drivers', items: ['Kernel modules', 'Character drivers', 'Virtual network drivers', 'net_device', 'Linux user-space', 'Kali Linux'] },
  { title: 'Interfaces', items: ['CAN', 'UART', 'SPI', 'I2C', 'Ethernet / IP', 'BLE', 'Zigbee'] },
  { title: 'Debugging / Tools', items: ['GDB', 'JTAG/SWD', 'Trace32', 'Oscilloscope', 'Logic analyzer', 'Python diagnostics', 'Git / JIRA / Jenkins'] },
  { title: 'AI-Assisted Engineering', items: ['Claude / Codex', 'Spec-driven development', 'Prompt → context → harness engineering', 'AI agent orchestration', 'Architecture & test docs', 'Code review'] },
  { title: 'Foundations', items: ['Requirements-first', 'Architecture-first', 'Phased development', 'Validation plans'] },
];
