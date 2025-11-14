/*
 * File: index.ts
 * Project: littlejs-rl
 * File Created: 2025-11-14 16:00:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 14, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Data loading system exports
 * Central exports for all data-related functionality
 */

export { ClassRegistry } from './classRegistry';
export { DataLoader } from './dataLoader';
export { EntityRegistry } from './entityRegistry';
export { RaceRegistry } from './raceRegistry';

// Validation and error handling
export * from './validation';
export * from './errors';

// Future: Export other registries when implemented
// export { ItemRegistry } from './itemRegistry';
// export { TileRegistry } from './tileRegistry';
// export { BiomeRegistry } from './biomeRegistry';
// export { ModLoader } from './modLoader';
