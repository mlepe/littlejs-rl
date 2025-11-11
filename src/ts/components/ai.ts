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

export interface AIComponent {
  type: 'passive' | 'aggressive' | 'patrol' | 'fleeing';
  detectionRange: number;
  state: 'idle' | 'pursuing' | 'attacking' | 'fleeing';
  target?: number; // Entity ID of target
}
