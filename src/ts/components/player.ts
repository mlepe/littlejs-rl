/*
 * File: player.ts
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
 * Player Component - Tag component to identify player entities
 *
 * Used to query for player entities in systems.
 * This is a "tag" component with no meaningful data.
 */
export interface PlayerComponent {
  /** Always true, identifies this entity as the player */
  isPlayer: true;
}
