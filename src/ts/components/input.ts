/*
 * File: input.ts
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
 * Input Component - Stores player input state
 *
 * Populated by inputSystem, consumed by playerMovementSystem.
 */
export interface InputComponent {
  /** Horizontal movement input (-1, 0, or 1) */
  moveX: number;
  /** Vertical movement input (-1, 0, or 1) */
  moveY: number;
  /** Action button pressed (e.g., attack, interact) */
  action: boolean;
  /** Zoom in command */
  zoomIn: boolean;
  /** Zoom out command */
  zoomOut: boolean;
  /** Toggle collision layer visibility (debug) */
  debugToggleCollision: boolean;
  /** Toggle debug text visibility */
  debugToggleText: boolean;
}
