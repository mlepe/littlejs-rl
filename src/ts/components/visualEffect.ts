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
 * Effect Duration Presets - Standardized durations for effects (in seconds)
 */
export enum EffectDuration {
  /** Very quick effect (0.05s) - instant feedback */
  INSTANT = 0.05,
  /** Very fast effect (0.1s) - quick reactions */
  VERY_FAST = 0.1,
  /** Fast effect (0.15s) - standard quick effects */
  FAST = 0.15,
  /** Normal effect (0.2s) - default duration */
  NORMAL = 0.2,
  /** Slow effect (0.3s) - deliberate effects */
  SLOW = 0.3,
  /** Very slow effect (0.5s) - dramatic effects */
  VERY_SLOW = 0.5,
  /** Extended effect (1.0s) - long-lasting effects */
  EXTENDED = 1.0,
}

/**
 * Effect Scale Presets - Standardized intensity/scale multipliers
 */
export enum EffectScale {
  /** Subtle effect (0.5x) - barely noticeable */
  SUBTLE = 0.5,
  /** Normal intensity (1.0x) - default strength */
  NORMAL = 1.0,
  /** Strong effect (1.5x) - noticeable impact */
  STRONG = 1.5,
  /** Very strong effect (2.0x) - heavy impact */
  VERY_STRONG = 2.0,
  /** Extreme effect (3.0x) - maximum impact */
  EXTREME = 3.0,
}

/**
 * Effect Distance Presets - Standardized offset/knockback distances (in tiles)
 */
export enum EffectDistance {
  /** Tiny distance (0.1 tiles) - small hop */
  TINY = 0.1,
  /** Small distance (0.15 tiles) - standard jump */
  SMALL = 0.15,
  /** Normal distance (0.3 tiles) - medium knockback */
  NORMAL = 0.3,
  /** Large distance (0.5 tiles) - heavy knockback */
  LARGE = 0.5,
  /** Huge distance (1.0 tiles) - massive knockback */
  HUGE = 1.0,
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
