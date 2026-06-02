export type SkillCategory = {
  title: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  { title: 'Firmware', items: ['C', 'C++', 'STM32 HAL', 'FreeRTOS', 'Bootloaders', 'Interrupts', 'Timers', 'GPIO'] },
  { title: 'Linux / Drivers', items: ['Kernel modules', 'Character drivers', 'Virtual network drivers', 'net_device', 'NAPI concepts', 'Ring buffers'] },
  { title: 'Interfaces', items: ['UART', 'SPI', 'I2C', 'CAN', 'BLE', 'GPIO', 'Sensor interfaces'] },
  { title: 'Debugging / Tools', items: ['GDB', 'JTAG/SWD', 'UART logs', 'Crash log analysis', 'Logic analyzer', 'GitHub Actions'] },
  { title: 'AI-Assisted Engineering', items: ['Spec-driven development', 'Requirements docs', 'Architecture docs', 'Debugging playbooks', 'MCP concepts', 'Engineering harnesses'] },
  { title: 'Foundations', items: ['Requirements-first', 'Architecture-first', 'Phased development', 'Validation plans'] },
];
