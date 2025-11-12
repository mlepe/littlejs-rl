/*
 * File: health.ts
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
 * Health Component - Tracks entity health points
 *
 * Used by both player and enemies to track damage and death state.
 */
export interface HealthComponent {
  /** Current health points */
  current: number;
  /** Maximum health points */
  max: number;
}
