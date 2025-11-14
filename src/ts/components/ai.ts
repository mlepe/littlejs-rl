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
 * Defines the AI disposition, detection range, current state, and target.
 * Disposition affects how the entity reacts to others based on relation scores:
 * - peaceful: Never attacks, always friendly
 * - neutral: Reacts based on relation scores (attack if negative, ignore if neutral/positive)
 * - defensive: Only attacks when attacked or relation is very negative
 * - aggressive: Attacks entities with negative relations
 * - hostile: Attacks all entities except those with positive relations
 * - patrol: Follows patrol route, attacks based on relations when detecting threats
 * - fleeing: Runs away from threats
 */
export interface AIComponent {
  /** AI disposition determining base behavior pattern */
  disposition:
    | 'peaceful'
    | 'neutral'
    | 'defensive'
    | 'aggressive'
    | 'hostile'
    | 'patrol'
    | 'fleeing';
  /** Distance at which AI detects and reacts to other entities */
  detectionRange: number;
  /** Current AI state */
  state: 'idle' | 'pursuing' | 'attacking' | 'fleeing' | 'patrolling';
  /** Entity ID of current target */
  target?: number;
}
