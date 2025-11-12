/*
 * File: movable.ts
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
 * Movable Component - Marks entities that can move
 *
 * Contains base movement speed modifier.
 * Can be combined with stats.speed for final movement calculation.
 */
export interface MovableComponent {
  /** Base movement speed */
  speed: number;
}
