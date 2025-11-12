/*
 * File: ai.ts
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
 * AI Component - Controls entity behavior and state
 *
 * Defines the AI behavior type, detection range, current state, and target.
 */
export interface AIComponent {
  /** AI behavior type */
  type: 'passive' | 'aggressive' | 'patrol' | 'fleeing';
  /** Distance at which AI detects and reacts to player */
  detectionRange: number;
  /** Current AI state */
  state: 'idle' | 'pursuing' | 'attacking' | 'fleeing';
  /** Entity ID of current target (typically the player) */
  target?: number;
}
