/*
 * File: visualEffect.ts
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
 * Visual Effect Type - Types of sprite effects
 */
export enum VisualEffectType {
  /** Move sprite offset (e.g., jump, recoil) */
  OFFSET = 'offset',
  /** Shake sprite randomly */
  SHAKE = 'shake',
  /** Scale sprite (e.g., squash/stretch) */
  SCALE = 'scale',
  /** Rotate sprite */
  ROTATE = 'rotate',
  /** Flash color */
  FLASH = 'flash',
}

/**
 * Visual Effect Data - Single visual effect instance
 */
export interface VisualEffect {
  /** Type of effect */
  type: VisualEffectType;

  /** Effect duration (in seconds) */
  duration: number;

  /** Time elapsed (in seconds) */
  elapsed: number;

  /** Effect-specific data */
  data: {
    /** For OFFSET: target offset */
    offset?: LJS.Vector2;
    /** For SHAKE: intensity */
    intensity?: number;
    /** For SCALE: target scale multiplier */
    scale?: LJS.Vector2;
    /** For ROTATE: target rotation (radians) */
    rotation?: number;
    /** For FLASH: flash color */
    color?: LJS.Color;
  };

  /** Easing function ('linear', 'easeOut', 'easeIn', 'bounce') */
  easing?: string;

  /** Whether to return to original state after effect ends */
  returnToOriginal?: boolean;
}

/**
 * Visual Effect Component - Stores active visual effects for an entity
 *
 * Supports multiple simultaneous effects (shake while flashing, etc.)
 *
 * @example
 * ```typescript
 * // Add damage flash effect
 * ecs.addComponent<VisualEffectComponent>(entityId, 'visualEffect', {
 *   effects: [],
 *   baseOffset: LJS.vec2(0, 0),
 *   baseScale: LJS.vec2(1, 1),
 *   baseRotation: 0
 * });
 * ```
 */
export interface VisualEffectComponent {
  /** Active effects array */
  effects: VisualEffect[];

  /** Base offset (before effects) */
  baseOffset: LJS.Vector2;

  /** Base scale (before effects) */
  baseScale: LJS.Vector2;

  /** Base rotation (before effects) */
  baseRotation: number;

  /** Accumulated offset from all effects */
  currentOffset?: LJS.Vector2;

  /** Accumulated scale from all effects */
  currentScale?: LJS.Vector2;

  /** Accumulated rotation from all effects */
  currentRotation?: number;

  /** Flash color overlay */
  flashColor?: LJS.Color;
}
