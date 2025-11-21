/*
 * File: environmental.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Environmental resistance component
 * Tracks an entity's resistance to environmental effects
 */
export interface EnvironmentalComponent {
  /** Base cold resistance (-1 to +1, where -1 is vulnerable, +1 is immune) */
  baseColdResistance: number;
  /** Base fire resistance (-1 to +1, where -1 is vulnerable, +1 is immune) */
  baseFireResistance: number;
  /** Current cold resistance (includes environmental modifiers) */
  currentColdResistance: number;
  /** Current fire resistance (includes environmental modifiers) */
  currentFireResistance: number;
  /** Visibility range modifier from environment (1.0 = normal) */
  visibilityModifier: number;
  /** Light level at entity's position (0-1) */
  lightLevel: number;
}
