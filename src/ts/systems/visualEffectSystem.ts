/*
 * File: visualEffectSystem.ts
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

import ECS from '../ecs';
import {
  EffectDistance,
  EffectDuration,
  EffectScale,
  VisualEffect,
  VisualEffectComponent,
  VisualEffectType,
} from '../components/visualEffect';

/**
 * Visual Effect System - Processes sprite transform/movement effects
 *
 * Handles temporary visual effects like:
 * - Sprite offset (jump, recoil, knockback)
 * - Sprite shake (hit reaction, camera shake)
 * - Sprite scale (squash/stretch)
 * - Sprite rotation (spin, wobble)
 * - Color flash (damage, heal, buff)
 *
 * Call this system in gameUpdate() before renderSystem().
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs);
 *   visualEffectSystem(ecs); // Process visual effects
 *   basicAnimationSystem(ecs);
 * }
 * ```
 */
export function visualEffectSystem(ecs: ECS): void {
  const entities = ecs.query('visualEffect');

  for (const id of entities) {
    const vfx = ecs.getComponent<VisualEffectComponent>(id, 'visualEffect');
    if (!vfx) continue;

    if (vfx.effects.length > 0) {
      console.log(
        `[VFX] Processing ${vfx.effects.length} effects for entity ${id}`
      );
    }

    // Reset accumulated values
    vfx.currentOffset = LJS.vec2(0, 0);
    vfx.currentScale = LJS.vec2(1, 1);
    vfx.currentRotation = 0;
    vfx.flashColor = undefined;

    // Update and accumulate all active effects
    const activeEffects: VisualEffect[] = [];

    for (const effect of vfx.effects) {
      effect.elapsed += LJS.timeDelta;

      // Check if effect is complete
      if (effect.elapsed >= effect.duration) {
        // Return to original if specified
        if (effect.returnToOriginal) {
          // Effect completed, values return to base
        }
        continue; // Remove this effect
      }

      // Calculate progress (0 to 1)
      const progress = effect.elapsed / effect.duration;
      const easedProgress = applyEasing(progress, effect.easing || 'linear');

      // Apply effect based on type
      switch (effect.type) {
        case VisualEffectType.OFFSET:
          if (effect.data.offset) {
            const offset = effect.data.offset.scale(easedProgress);
            vfx.currentOffset = vfx.currentOffset.add(offset);
          }
          break;

        case VisualEffectType.SHAKE:
          if (effect.data.intensity) {
            const intensity = effect.data.intensity * (1 - easedProgress);
            const shakeX = (Math.random() - 0.5) * intensity;
            const shakeY = (Math.random() - 0.5) * intensity;
            vfx.currentOffset = vfx.currentOffset.add(LJS.vec2(shakeX, shakeY));
          }
          break;

        case VisualEffectType.SCALE:
          if (effect.data.scale) {
            const scale = LJS.vec2(
              1 + (effect.data.scale.x - 1) * easedProgress,
              1 + (effect.data.scale.y - 1) * easedProgress
            );
            vfx.currentScale = LJS.vec2(
              vfx.currentScale.x * scale.x,
              vfx.currentScale.y * scale.y
            );
          }
          break;

        case VisualEffectType.ROTATE:
          if (effect.data.rotation !== undefined) {
            vfx.currentRotation += effect.data.rotation * easedProgress;
          }
          break;

        case VisualEffectType.FLASH:
          if (effect.data.color) {
            // Flash fades out over duration
            const alpha = 1 - easedProgress;
            vfx.flashColor = new LJS.Color(
              effect.data.color.r,
              effect.data.color.g,
              effect.data.color.b,
              alpha
            );
          }
          break;
      }

      activeEffects.push(effect);
    }

    // Update effects array (remove completed effects)
    vfx.effects = activeEffects;
  }
}

/**
 * Apply easing function to progress value
 *
 * @param t - Progress (0 to 1)
 * @param easing - Easing function name
 * @returns Eased progress value
 */
function applyEasing(t: number, easing: string): number {
  switch (easing) {
    case 'easeOut':
      return 1 - Math.pow(1 - t, 3);
    case 'easeIn':
      return Math.pow(t, 3);
    case 'bounce':
      if (t < 0.5) {
        return 2 * t * t;
      } else {
        return 1 - Math.pow(-2 * t + 2, 2) / 2;
      }
    case 'linear':
    default:
      return t;
  }
}

/**
 * Helper: Add a sprite offset effect (jump, recoil, knockback)
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to apply effect to
 * @param offset - Offset direction or base offset (in tiles)
 * @param duration - Effect duration (in seconds)
 * @param easing - Easing function
 * @param scale - Scale multiplier for offset (default: 1.0)
 *
 * @example
 * ```typescript
 * // Jump up slightly when attacking
 * addOffsetEffect(ecs, playerId, LJS.vec2(0.1, 0.1), 0.2, 'easeOut');
 *
 * // Knockback using direction vector with presets
 * const direction = LJS.vec2(dx, dy).normalize();
 * addOffsetEffect(ecs, enemyId, direction, EffectDuration.FAST, 'easeOut', EffectDistance.NORMAL);
 *
 * // Large knockback with presets
 * addOffsetEffect(ecs, enemyId, direction, EffectDuration.NORMAL, 'easeOut', EffectDistance.LARGE);
 * ```
 */
export function addOffsetEffect(
  ecs: ECS,
  entityId: number,
  offset: LJS.Vector2,
  duration: number,
  easing: string = 'easeOut',
  scale: number = 1.0
): void {
  const vfx = ensureVisualEffectComponent(ecs, entityId);

  vfx.effects.push({
    type: VisualEffectType.OFFSET,
    duration,
    elapsed: 0,
    data: { offset: offset.scale(scale) },
    easing,
    returnToOriginal: true,
  });
}

/**
 * Helper: Add a sprite shake effect
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to apply effect to
 * @param intensity - Base shake intensity (in tiles)
 * @param duration - Effect duration (in seconds)
 * @param scale - Scale multiplier for intensity (default: 1.0)
 *
 * @example
 * ```typescript
 * // Shake sprite when taking damage with presets
 * addShakeEffect(ecs, playerId, EffectDistance.SMALL, EffectDuration.NORMAL, EffectScale.NORMAL);
 *
 * // Stronger shake for heavy hit
 * addShakeEffect(ecs, enemyId, EffectDistance.SMALL, EffectDuration.NORMAL, EffectScale.VERY_STRONG);
 *
 * // Subtle shake
 * addShakeEffect(ecs, playerId, EffectDistance.SMALL, EffectDuration.FAST, EffectScale.SUBTLE);
 * ```
 */
export function addShakeEffect(
  ecs: ECS,
  entityId: number,
  intensity: number,
  duration: number,
  scale: number = 1.0
): void {
  const vfx = ensureVisualEffectComponent(ecs, entityId);

  vfx.effects.push({
    type: VisualEffectType.SHAKE,
    duration,
    elapsed: 0,
    data: { intensity: intensity * scale },
    easing: 'easeOut',
    returnToOriginal: true,
  });
}

/**
 * Helper: Add a sprite scale effect (squash/stretch)
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to apply effect to
 * @param scale - Target scale multiplier (1 = normal, 1.2 = 20% larger)
 * @param duration - Effect duration (in seconds)
 * @param easing - Easing function
 *
 * @example
 * ```typescript
 * // Squash sprite on landing
 * addScaleEffect(ecs, playerId, LJS.vec2(1.2, 0.8), 0.1, 'easeOut');
 *
 * // Grow sprite when powering up
 * addScaleEffect(ecs, bossId, LJS.vec2(1.3, 1.3), 0.5, 'bounce');
 * ```
 */
export function addScaleEffect(
  ecs: ECS,
  entityId: number,
  scale: LJS.Vector2,
  duration: number,
  easing: string = 'easeOut'
): void {
  const vfx = ensureVisualEffectComponent(ecs, entityId);

  vfx.effects.push({
    type: VisualEffectType.SCALE,
    duration,
    elapsed: 0,
    data: { scale },
    easing,
    returnToOriginal: true,
  });
}

/**
 * Helper: Add a sprite rotation effect
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to apply effect to
 * @param rotation - Base rotation (in radians)
 * @param duration - Effect duration (in seconds)
 * @param easing - Easing function
 * @param scale - Scale multiplier for rotation (default: 1.0)
 *
 * @example
 * ```typescript
 * // Spin sprite 360 degrees with presets
 * addRotationEffect(ecs, itemId, Math.PI * 2, EffectDuration.EXTENDED, 'linear', EffectScale.NORMAL);
 *
 * // Half spin (180 degrees)
 * addRotationEffect(ecs, itemId, Math.PI * 2, EffectDuration.NORMAL, 'linear', EffectScale.SUBTLE);
 *
 * // Double spin (720 degrees)
 * addRotationEffect(ecs, itemId, Math.PI * 2, EffectDuration.EXTENDED, 'linear', EffectScale.VERY_STRONG);
 * ```
 */
export function addRotationEffect(
  ecs: ECS,
  entityId: number,
  rotation: number,
  duration: number,
  easing: string = 'linear',
  scale: number = 1.0
): void {
  const vfx = ensureVisualEffectComponent(ecs, entityId);

  vfx.effects.push({
    type: VisualEffectType.ROTATE,
    duration,
    elapsed: 0,
    data: { rotation: rotation * scale },
    easing,
    returnToOriginal: true,
  });
}

/**
 * Helper: Add a color flash effect
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to apply effect to
 * @param color - Flash color
 * @param duration - Effect duration (in seconds)
 *
 * @example
 * ```typescript
 * // White flash when taking damage
 * addFlashEffect(ecs, playerId, new LJS.Color(1, 1, 1, 1), 0.2);
 *
 * // Red flash for fire damage
 * addFlashEffect(ecs, enemyId, new LJS.Color(1, 0.2, 0.2, 1), 0.3);
 *
 * // Green flash when healing
 * addFlashEffect(ecs, playerId, new LJS.Color(0.2, 1, 0.2, 1), 0.4);
 * ```
 */
export function addFlashEffect(
  ecs: ECS,
  entityId: number,
  color: LJS.Color,
  duration: number
): void {
  const vfx = ensureVisualEffectComponent(ecs, entityId);

  vfx.effects.push({
    type: VisualEffectType.FLASH,
    duration,
    elapsed: 0,
    data: { color },
    easing: 'linear',
    returnToOriginal: true,
  });
}

/**
 * Helper: Ensure entity has VisualEffectComponent
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to check
 * @returns VisualEffectComponent (existing or newly created)
 */
function ensureVisualEffectComponent(
  ecs: ECS,
  entityId: number
): VisualEffectComponent {
  let vfx = ecs.getComponent<VisualEffectComponent>(entityId, 'visualEffect');

  if (!vfx) {
    vfx = {
      effects: [],
      baseOffset: LJS.vec2(0, 0),
      baseScale: LJS.vec2(1, 1),
      baseRotation: 0,
    };
    ecs.addComponent<VisualEffectComponent>(entityId, 'visualEffect', vfx);
  }

  return vfx;
}

/**
 * Helper: Clear all visual effects from an entity
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to clear effects from
 *
 * @example
 * ```typescript
 * clearVisualEffects(ecs, playerId);
 * ```
 */
export function clearVisualEffects(ecs: ECS, entityId: number): void {
  const vfx = ecs.getComponent<VisualEffectComponent>(entityId, 'visualEffect');
  if (vfx) {
    vfx.effects = [];
  }
}
