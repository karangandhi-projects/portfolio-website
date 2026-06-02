export type Project = {
  name: string;
  slug: string;
  url: string;
  summary: string;
  focus: string;
  icon: string; // key into src/lib/icons.ts
  highlights?: string[];
  tags: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: 'vnet-driver',
    slug: 'vnet-driver',
    url: 'https://github.com/karangandhi-projects/vnet-driver',
    summary: 'A phase-based Linux virtual Ethernet driver using vnet0.',
    focus:
      'Shows real kernel-space network driver work: TX/RX paths, ring buffers, NAPI-style polling, statistics, ethtool support, and kernel/user-space debugging.',
    icon: 'linux',
    highlights: ['Virtual Ethernet interface', 'TX/RX driver path', 'NAPI-style polling', 'ethtool support'],
    tags: ['C', 'Linux Kernel', 'net_device', 'NAPI', 'ethtool'],
    featured: true,
  },
  {
    name: 'mini-ecu-v2',
    slug: 'mini-ecu-v2',
    url: 'https://github.com/karangandhi-projects/mini-ecu-v2',
    summary: 'A virtual automotive ECU built on STM32F446RE.',
    focus:
      'An end-to-end embedded system: FreeRTOS tasks, CAN loopback telemetry, a UART CLI, logging, and a bootloader-oriented layout as a base for OTA experiments.',
    icon: 'stm32',
    highlights: ['FreeRTOS task structure', 'CAN loopback telemetry', 'UART CLI', 'Bootloader-oriented layout'],
    tags: ['C', 'STM32 HAL', 'FreeRTOS', 'CAN', 'UART', 'Bootloader'],
    featured: true,
  },
  {
    name: 'stm32-smart-sensor-hub',
    slug: 'stm32-smart-sensor-hub',
    url: 'https://github.com/karangandhi-projects/stm32-smart-sensor-hub',
    summary: 'A modular STM32 sensor hub focused on firmware architecture and observability.',
    focus:
      'Peripheral-heavy firmware with a clean architecture: sensor abstraction, I2C/SPI backends, UART logging, and CLI-based observability.',
    icon: 'c',
    highlights: ['Sensor abstraction layer', 'I2C and SPI backends', 'UART logging', 'CLI interface'],
    tags: ['Embedded C', 'STM32 HAL', 'I2C', 'SPI', 'UART', 'GPIO'],
    featured: true,
  },
  {
    name: 'stm32-virtual-vehicle-ecu',
    slug: 'stm32-virtual-vehicle-ecu',
    url: 'https://github.com/karangandhi-projects/stm32-virtual-vehicle-ecu',
    summary: 'A modular STM32F4 virtual vehicle ECU with FreeRTOS, CAN, UART and a simple vehicle model.',
    focus:
      'Clean separation between drivers, RTOS tasks, application logic, and simulated vehicle behavior.',
    icon: 'stm32',
    highlights: ['FreeRTOS architecture', 'CAN communication', 'UART CLI', 'Vehicle behavior simulation'],
    tags: ['C', 'STM32F4', 'FreeRTOS', 'CAN', 'UART'],
    featured: true,
  },
  {
    name: 'ble-environmental-sensor-node',
    slug: 'ble-environmental-sensor-node',
    url: 'https://github.com/karangandhi-projects/ble-environmental-sensor-node',
    summary: 'A spec-driven BLE environmental sensor node using ESP32-C3, NimBLE and an OLED display.',
    focus:
      'BLE from an embedded perspective: GATT design, peripheral behavior, sensor publishing, and agent-buildable documentation.',
    icon: 'bluetooth',
    highlights: ['BLE peripheral design', 'GATT service modeling', 'ESP32-C3 + NimBLE', 'OLED integration'],
    tags: ['ESP32-C3', 'NimBLE', 'BLE GATT', 'OLED', 'Sensor Node'],
    featured: true,
  },
  {
    name: 'Pseudo-Character-Device-Driver',
    slug: 'pseudo-character-device-driver',
    url: 'https://github.com/karangandhi-projects/Pseudo-Character-Device-Driver',
    summary: 'A Linux pseudo character device driver implementing common file operations.',
    focus:
      'Understanding the Linux driver lifecycle, file-operation callbacks, and kernel/user-space interaction.',
    icon: 'linux',
    highlights: ['open/close/read/write/lseek', 'driver lifecycle', 'kernel/user-space path'],
    tags: ['C', 'Linux Kernel', 'Character Driver', 'File Operations'],
    featured: true,
  },
  {
    name: 'bluetooth-audio-manager-linux',
    slug: 'bluetooth-audio-manager-linux',
    url: 'https://github.com/karangandhi-projects/bluetooth-audio-manager-linux',
    summary: 'A Linux utility for fixing and toggling Bluetooth audio profiles on PipeWire systems.',
    focus:
      'Built from a real usability problem; focused on scripting, automation, and Linux troubleshooting.',
    icon: 'bluetooth',
    highlights: ['Bluetooth profile switching', 'A2DP/HFP workflow', 'PipeWire troubleshooting'],
    tags: ['Shell', 'Linux', 'Bluetooth', 'PipeWire', 'Automation'],
    featured: false,
  },
];
