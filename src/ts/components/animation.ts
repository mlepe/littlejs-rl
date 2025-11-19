/*
 * File: animation.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 19th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 19th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

/**
 * Animation State - Represents a single animation (e.g., 'idle', 'walk', 'attack')
 *
 * @example
 * ```typescript
 * const idleAnim: AnimationState = {
 *   frames: [new LJS.TileInfo(LJS.vec2(0, 0), LJS.vec2(16, 16))],
 *   frameTime: 0.2,
 *   loop: true
 * };
 * ```
 */
export interface AnimationState {
  /**
   * Array of TileInfo for each animation frame
   */
  frames: LJS.TileInfo[];

  /**
   * Time (in seconds) to display each frame
   */
  frameTime: number;

  /**
   * Whether to loop the animation when it reaches the end
   */
  loop: boolean;

  /**
   * Optional: Callback when animation completes (non-looping only)
   */
  onComplete?: () => void;
}

/**
 * Animation Component - Stores animation state for entities
 *
 * Supports multiple named animations (e.g., 'idle', 'walk', 'attack').
 * Works with tilesheets where frames can be arranged in any pattern.
 *
 * @example
 * ```typescript
 * // Create entity with multiple animations
 * ecs.addComponent<AnimationComponent>(entityId, 'animation', {
 *   animations: new Map([
 *     ['idle', {
 *       frames: [new LJS.TileInfo(LJS.vec2(0, 0), LJS.vec2(16, 16))],
 *       frameTime: 0.5,
 *       loop: true
 *     }],
 *     ['walk', {
 *       frames: [
 *         new LJS.TileInfo(LJS.vec2(0, 0), LJS.vec2(16, 16)),
 *         new LJS.TileInfo(LJS.vec2(16, 0), LJS.vec2(16, 16)),
 *         new LJS.TileInfo(LJS.vec2(32, 0), LJS.vec2(16, 16))
 *       ],
 *       frameTime: 0.2,
 *       loop: true
 *     }]
 *   ]),
 *   currentAnimation: 'idle',
 *   currentFrame: 0,
 *   timer: 0,
 *   playing: true
 * });
 * ```
 */
export interface AnimationComponent {
  /**
   * Map of animation name to AnimationState
   * e.g., 'idle', 'walk', 'attack', 'death'
   */
  animations: Map<string, AnimationState>;

  /**
   * Name of the currently playing animation
   */
  currentAnimation: string;

  /**
   * Current frame index within the current animation
   */
  currentFrame: number;

  /**
   * Timer tracking time in current frame
   */
  timer: number;

  /**
   * Whether the animation is currently playing
   */
  playing: boolean;
}
