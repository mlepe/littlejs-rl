/*
 * File: weather.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { WeatherType } from '../biomeConfig';

/**
 * Weather Component - Tracks current weather conditions for a location
 *
 * Attached to location entities or stored in location metadata.
 * Weather affects visibility, temperature, and environmental effects.
 *
 * @example
 * ```typescript
 * ecs.addComponent<WeatherComponent>(locationId, 'weather', {
 *   current: WeatherType.RAIN,
 *   intensity: 0.7,
 *   duration: 300,
 *   timeRemaining: 300,
 *   transitionTo: WeatherType.CLEAR,
 *   transitionProgress: 0,
 * });
 * ```
 */
export interface WeatherComponent {
  /** Current active weather type */
  current: WeatherType;

  /** Weather intensity (0.0 = none, 1.0 = maximum) */
  intensity: number;

  /** Total duration of current weather in seconds (0 = indefinite) */
  duration: number;

  /** Time remaining before weather changes in seconds */
  timeRemaining: number;

  /** Next weather type to transition to (null = random) */
  transitionTo: WeatherType | null;

  /** Transition progress (0.0 = current, 1.0 = transitionTo) */
  transitionProgress: number;

  /** Whether weather is paused (indoor locations) */
  paused: boolean;

  /** Visibility modifier (0.0 = can't see, 1.0 = normal) */
  visibilityModifier: number;

  /** Temperature modifier in degrees (-20 to +20) */
  temperatureModifier: number;

  /** Movement speed modifier (0.5 = half speed, 1.0 = normal, 2.0 = double) */
  movementModifier: number;

  /** Additional effects (wet, frozen, burning, etc.) */
  effects: WeatherEffect[];
}

/**
 * Weather effects applied to entities
 */
export enum WeatherEffect {
  /** Entity is wet (affects fire resistance) */
  WET = 'wet',

  /** Entity is frozen (slowed movement) */
  FROZEN = 'frozen',

  /** Entity is burning (fire damage over time) */
  BURNING = 'burning',

  /** Entity is blinded (reduced accuracy) */
  BLINDED = 'blinded',

  /** Entity is slowed (mud, snow) */
  SLOWED = 'slowed',

  /** Entity is buffeted (pushed by wind) */
  BUFFETED = 'buffeted',

  /** Entity is protected (under shelter) */
  SHELTERED = 'sheltered',
}
