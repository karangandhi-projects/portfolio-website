export type Project = {
  name: string;
  slug: string;
  url: string;
  date: string; // ISO YYYY-MM-DD — repo creation date (from GitHub); drives newest-first ordering
  summary: string;
  focus: string;
  icon: string; // key into src/lib/icons.ts
  highlights?: string[];
  tags: string[];
  featured?: boolean;
  // Proof footer (home featured cards). DRAFT values for non-BLE projects —
  // Karan to confirm/correct against each repo README before shipping.
  status?: string;     // e.g. "v1.0 working prototype", "working driver"
  validation?: string; // how it was proven (tests, tooling, on-target checks)
  evidence?: string;   // what a reviewer can inspect (GitHub, README, docs, case study)
};

export const projects: Project[] = [
  {
    name: 'vnet-driver',
    slug: 'vnet-driver',
    url: 'https://github.com/karangandhi-projects/vnet-driver',
    date: '2025-11-28',
    summary: 'A phase-based Linux virtual Ethernet driver using vnet0.',
    focus:
      'Shows real kernel-space network driver work: TX/RX paths, ring buffers, NAPI-style polling, statistics, ethtool support, and kernel/user-space debugging.',
    icon: 'linux',
    highlights: ['Virtual Ethernet interface', 'TX/RX driver path', 'NAPI-style polling', 'ethtool support'],
    tags: ['C', 'Linux Kernel', 'net_device', 'NAPI', 'ethtool'],
    featured: true,
    status: 'working driver',
    validation: 'TX/RX path exercised with ethtool stats and NAPI-style polling; verified across kernel/user-space.',
    evidence: 'GitHub repo · README · driver source',
  },
  {
    name: 'mini-ecu-v2',
    slug: 'mini-ecu-v2',
    url: 'https://github.com/karangandhi-projects/mini-ecu-v2',
    date: '2025-11-28',
    summary: 'A virtual automotive ECU built on STM32F446RE.',
    focus:
      'An end-to-end embedded system: FreeRTOS tasks, CAN loopback telemetry, a UART CLI, logging, and a bootloader-oriented layout as a base for OTA experiments.',
    icon: 'stm32',
    highlights: ['FreeRTOS task structure', 'CAN loopback telemetry', 'UART CLI', 'Bootloader-oriented layout'],
    tags: ['C', 'STM32 HAL', 'FreeRTOS', 'CAN', 'UART', 'Bootloader'],
    featured: true,
    status: 'working prototype',
    validation: 'CAN loopback telemetry, UART CLI and logging exercised on STM32F446RE.',
    evidence: 'GitHub repo · README · architecture notes',
  },
  {
    name: 'stm32-smart-sensor-hub',
    slug: 'stm32-smart-sensor-hub',
    url: 'https://github.com/karangandhi-projects/stm32-smart-sensor-hub',
    date: '2025-12-02',
    summary: 'A modular STM32 sensor hub focused on firmware architecture and observability.',
    focus:
      'Peripheral-heavy firmware with a clean architecture: sensor abstraction, I2C/SPI backends, UART logging, and CLI-based observability.',
    icon: 'c',
    highlights: ['Sensor abstraction layer', 'I2C and SPI backends', 'UART logging', 'CLI interface'],
    tags: ['Embedded C', 'STM32 HAL', 'I2C', 'SPI', 'UART', 'GPIO'],
    featured: true,
    status: 'working prototype',
    validation: 'I2C/SPI sensor backends exercised via UART logging and CLI observability.',
    evidence: 'GitHub repo · README',
  },
  {
    name: 'stm32-virtual-vehicle-ecu',
    slug: 'stm32-virtual-vehicle-ecu',
    url: 'https://github.com/karangandhi-projects/stm32-virtual-vehicle-ecu',
    date: '2025-11-27',
    summary: 'A modular STM32F4 virtual vehicle ECU with FreeRTOS, CAN, UART and a simple vehicle model.',
    focus:
      'Distinct from mini-ecu-v2: this one centers on vehicle-behavior simulation. Clean separation between drivers, RTOS tasks, application logic, and a simple simulated vehicle model.',
    icon: 'stm32',
    highlights: ['FreeRTOS architecture', 'CAN communication', 'UART CLI', 'Vehicle behavior simulation'],
    tags: ['C', 'STM32F4', 'FreeRTOS', 'CAN', 'UART'],
    featured: false,
  },
  {
    name: 'ble-environmental-sensor-node',
    slug: 'ble-environmental-sensor-node',
    url: 'https://github.com/karangandhi-projects/ble-environmental-sensor-node',
    date: '2026-05-16',
    summary:
      'Learned BLE from scratch and built a working ESP32-C3 BLE environmental sensor node within two weeks. Extended the project from simulated data to a real I2C temperature sensor, systematically isolated a non-responsive sensor using address scanning, multimeter checks, address-line testing, and replacement comparison, then demonstrated live temperature readings over BLE. Independently captured I2C bus transactions using an unfamiliar logic analyzer.',
    focus:
      'BLE from an embedded perspective: GATT design, peripheral behavior, sensor publishing, and agent-buildable documentation.',
    icon: 'bluetooth',
    highlights: ['BLE peripheral design', 'GATT service modeling', 'ESP32-C3 + NimBLE', 'OLED integration'],
    tags: ['ESP32-C3', 'NimBLE', 'BLE GATT', 'OLED', 'Sensor Node'],
    featured: true,
    status: 'v1.0 working prototype',
    validation: '62 Unity tests · 25-case manual matrix · nRF Connect verification',
    evidence: 'Case study · GitHub repo · architecture docs · nRF Connect screenshots',
  },
  {
    name: 'Pseudo-Character-Device-Driver',
    slug: 'pseudo-character-device-driver',
    url: 'https://github.com/karangandhi-projects/Pseudo-Character-Device-Driver',
    date: '2025-03-18',
    summary: 'A Linux pseudo character device driver implementing common file operations.',
    focus:
      'Understanding the Linux driver lifecycle, file-operation callbacks, and kernel/user-space interaction.',
    icon: 'linux',
    highlights: ['open/close/read/write/lseek', 'driver lifecycle', 'kernel/user-space path'],
    tags: ['C', 'Linux Kernel', 'Character Driver', 'File Operations'],
    featured: false,
  },
  {
    name: 'EE-6314-RTOS',
    slug: 'ee-6314-rtos',
    url: 'https://github.com/karangandhi-projects/EE-6314-RTOS',
    date: '2025-02-22',
    summary: 'A real-time operating system built from scratch on the TI Tiva TM4C123G (ARM Cortex-M4).',
    focus:
      'Implements the core RTOS primitives — task scheduling, context switching, semaphores/mutexes and IPC — to understand RTOS internals from the ground up.',
    icon: 'arm',
    highlights: ['Preemptive scheduler', 'Context switching', 'Semaphores / mutexes', 'Shell / CLI'],
    tags: ['C', 'TI Tiva TM4C123G', 'ARM Cortex-M4', 'RTOS', 'Scheduling'],
    featured: false,
  },
  {
    name: 'bluetooth-audio-manager-linux',
    slug: 'bluetooth-audio-manager-linux',
    url: 'https://github.com/karangandhi-projects/bluetooth-audio-manager-linux',
    date: '2026-03-30',
    summary:
      'Linux utility / automation: fixes and toggles Bluetooth audio profiles on PipeWire systems.',
    focus:
      'Built from a real usability problem; focused on scripting, automation, and Linux troubleshooting.',
    icon: 'bluetooth',
    highlights: ['Bluetooth profile switching', 'A2DP/HFP workflow', 'PipeWire troubleshooting'],
    tags: ['Shell', 'Linux', 'Bluetooth', 'PipeWire', 'Automation'],
    featured: false,
  },
];
