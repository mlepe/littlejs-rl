/*
 * File: position.ts
 * Project: littlejs-rl
 * File Created: Monday, 11th November 2025 11:30:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:30:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Position Component - Tracks entity position in tile coordinates
 *
 * This is the single source of truth for entity locations.
 * Positions are in tile coordinates, not world pixels.
 */
export interface PositionComponent {
  /** X coordinate in tiles */
  x: number;
  /** Y coordinate in tiles */
  y: number;
}
