/*
 * File: basicAnimationSystem.ts
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

import { AnimationComponent } from '../components/animation';
import ECS from '../ecs';
import { RenderComponent } from '../components/render';
import { EntityState } from '../components/state';
import { hasState } from './stateSystem';

/**
 * Helper: Auto-switch animation based on entity state
 *
 * Automatically switches animations based on StateComponent.
 * Priority order: attacking > moving > idle
 *
 * Only switches if the entity has the required animations defined.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity with animation and state components
 */
function autoSwitchAnimationByState(ecs: ECS, entityId: number): void {
  const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
  if (!anim) return;

  // Check states in priority order
  if (hasState(ecs, entityId, EntityState.ATTACKING)) {
    if (anim.animations.has('attack')) {
      switchAnimation(ecs, entityId, 'attack', true);
    }
  } else if (hasState(ecs, entityId, EntityState.MOVING)) {
    if (anim.animations.has('walk')) {
      switchAnimation(ecs, entityId, 'walk');
    }
  } else {
    // Default to idle
    if (anim.animations.has('idle')) {
      switchAnimation(ecs, entityId, 'idle');
    }
  }
}

/**
 * Basic Animation System - Updates sprite animations for entities
 *
 * Processes entities with 'animation' and 'render' components.
 * Advances animation frames based on time and updates the render component's tileInfo.
 *
 * Features:
 * - Frame-based sprite animations
 * - Configurable frame timing
 * - Loop or one-shot animations
 * - Play/pause control
 * - Optional completion callbacks
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
 *   basicAnimationSystem(ecs); // Update animations
 *   // ... other systems
 * }
 *
 * function gameRender() {
 *   renderSystem(ecs); // Render with updated frames
 * }
 * ```
 */
export function basicAnimationSystem(ecs: ECS): void {
  const entities = ecs.query('animation', 'render');

  for (const id of entities) {
    const anim = ecs.getComponent<AnimationComponent>(id, 'animation');
    const render = ecs.getComponent<RenderComponent>(id, 'render');

    if (!anim || !render || !anim.playing) continue;

    // Auto-switch animations based on state (if state component exists)
    autoSwitchAnimationByState(ecs, id);

    // Get current animation state
    const currentState = anim.animations.get(anim.currentAnimation);
    if (!currentState) {
      console.warn(
        `[Animation] Entity ${id} has no animation '${anim.currentAnimation}'`
      );
      continue;
    }

    // Validate frames array
    if (!currentState.frames || currentState.frames.length === 0) {
      console.warn(
        `[Animation] Entity ${id} animation '${anim.currentAnimation}' has no frames`
      );
      continue;
    }

    // Update timer
    anim.timer += LJS.timeDelta;

    // Check if we should advance to next frame
    if (anim.timer >= currentState.frameTime) {
      // Reset timer (carry over extra time for smooth animation)
      anim.timer -= currentState.frameTime;

      // Advance frame
      anim.currentFrame++;

      // Handle end of animation
      if (anim.currentFrame >= currentState.frames.length) {
        if (currentState.loop) {
          // Loop back to start
          anim.currentFrame = 0;
        } else {
          // Stop at last frame
          anim.currentFrame = currentState.frames.length - 1;
          anim.playing = false;

          // Call completion callback if provided
          if (currentState.onComplete) {
            currentState.onComplete();
          }
        }
      }
    }

    // Update render component's tileInfo to current frame
    const currentFrameIndex = Math.max(
      0,
      Math.min(anim.currentFrame, currentState.frames.length - 1)
    );
    render.tileInfo = currentState.frames[currentFrameIndex];
  }
}

/**
 * Helper: Create a simple horizontal animation state from a tilesheet
 *
 * Assumes frames are arranged horizontally in a single row.
 *
 * @param startX - X coordinate of first frame (in pixels)
 * @param startY - Y coordinate of frames (in pixels)
 * @param frameWidth - Width of each frame (in pixels)
 * @param frameHeight - Height of each frame (in pixels)
 * @param frameCount - Number of frames in the animation
 * @param frameTime - Time per frame (in seconds)
 * @param loop - Whether to loop the animation
 * @returns AnimationState that can be added to animations Map
 *
 * @example
 * ```typescript
 * // Create animation states
 * const idleAnim = createHorizontalAnimation(0, 0, 16, 16, 1, 0.5, true);
 * const walkAnim = createHorizontalAnimation(0, 0, 16, 16, 4, 0.2, true);
 *
 * // Add to entity
 * ecs.addComponent<AnimationComponent>(playerId, 'animation', {
 *   animations: new Map([['idle', idleAnim], ['walk', walkAnim]]),
 *   currentAnimation: 'idle',
 *   currentFrame: 0,
 *   timer: 0,
 *   playing: true
 * });
 * ```
 */
export function createHorizontalAnimation(
  startX: number,
  startY: number,
  frameWidth: number,
  frameHeight: number,
  frameCount: number,
  frameTime: number,
  loop: boolean
): import('../components/animation').AnimationState {
  const frames: LJS.TileInfo[] = [];

  for (let i = 0; i < frameCount; i++) {
    const x = startX + i * frameWidth;
    frames.push(
      new LJS.TileInfo(LJS.vec2(x, startY), LJS.vec2(frameWidth, frameHeight))
    );
  }

  return {
    frames,
    frameTime,
    loop,
  };
}

/**
 * Helper: Switch to a different animation
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity with animation component
 * @param animationName - Name of animation to switch to
 * @param restart - If true, restart from frame 0 even if already playing this animation
 * @returns True if switch was successful, false if animation doesn't exist
 *
 * @example
 * ```typescript
 * // Switch to walk animation when player moves
 * if (isMoving) {
 *   switchAnimation(ecs, playerId, 'walk');
 * } else {
 *   switchAnimation(ecs, playerId, 'idle');
 * }
 *
 * // Play attack animation once
 * switchAnimation(ecs, playerId, 'attack', true);
 * ```
 */
export function switchAnimation(
  ecs: ECS,
  entityId: number,
  animationName: string,
  restart: boolean = false
): boolean {
  const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
  if (!anim) return false;

  // Check if animation exists
  if (!anim.animations.has(animationName)) {
    console.warn(
      `[Animation] Entity ${entityId} has no animation '${animationName}'`
    );
    return false;
  }

  // Switch animation if different or restart requested
  if (anim.currentAnimation !== animationName || restart) {
    anim.currentAnimation = animationName;
    anim.currentFrame = 0;
    anim.timer = 0;
    anim.playing = true;
  }

  return true;
}

/**
 * Helper: Play current animation (resume if paused)
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity with animation component
 * @param restart - If true, restart animation from frame 0
 *
 * @example
 * ```typescript
 * // Resume animation from current position
 * playAnimation(ecs, playerId, false);
 *
 * // Restart current animation from beginning
 * playAnimation(ecs, enemyId, true);
 * ```
 */
export function playAnimation(
  ecs: ECS,
  entityId: number,
  restart: boolean = false
): void {
  const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
  if (!anim) return;

  anim.playing = true;

  if (restart) {
    anim.currentFrame = 0;
    anim.timer = 0;
  }
}

/**
 * Helper: Pause an animation
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity with animation component
 *
 * @example
 * ```typescript
 * pauseAnimation(ecs, playerId);
 * ```
 */
export function pauseAnimation(ecs: ECS, entityId: number): void {
  const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
  if (!anim) return;

  anim.playing = false;
}

/**
 * Helper: Stop an animation (pause and reset to frame 0)
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity with animation component
 *
 * @example
 * ```typescript
 * stopAnimation(ecs, enemyId);
 * ```
 */
export function stopAnimation(ecs: ECS, entityId: number): void {
  const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
  if (!anim) return;

  anim.playing = false;
  anim.currentFrame = 0;
  anim.timer = 0;
}

/**
 * Helper: Set current animation to a specific frame
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity with animation component
 * @param frameIndex - Frame index to set (clamped to valid range)
 *
 * @example
 * ```typescript
 * // Set to last frame for "death" pose
 * setAnimationFrame(ecs, enemyId, 3);
 * ```
 */
export function setAnimationFrame(
  ecs: ECS,
  entityId: number,
  frameIndex: number
): void {
  const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
  if (!anim) return;

  const currentState = anim.animations.get(anim.currentAnimation);
  if (!currentState || !currentState.frames) return;

  anim.currentFrame = Math.max(
    0,
    Math.min(frameIndex, currentState.frames.length - 1)
  );
  anim.timer = 0;
}

/**
 * Helper: Get current animation name
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity with animation component
 * @returns Current animation name, or undefined if no animation component
 *
 * @example
 * ```typescript
 * const currentAnim = getCurrentAnimation(ecs, playerId);
 * if (currentAnim === 'attack') {
 *   // Handle attack animation
 * }
 * ```
 */
export function getCurrentAnimation(
  ecs: ECS,
  entityId: number
): string | undefined {
  const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
  return anim?.currentAnimation;
}

/**
 * Helper: Register animation state mappings for custom behavior
 *
 * Maps state tags to animation names for auto-switching.
 * Call this to customize which states trigger which animations.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity with animation component
 * @param stateMappings - Map of state tag to animation name
 *
 * @example
 * ```typescript
 * // Custom mappings for a boss entity
 * registerAnimationStateMappings(ecs, bossId, new Map([
 *   [EntityState.ATTACKING, 'roar'],
 *   [EntityState.MOVING, 'stomp'],
 *   [EntityState.STUNNED, 'dizzy'],
 *   ['enraged', 'rage'] // Custom state
 * ]));
 * ```
 */
export function registerAnimationStateMappings(
  ecs: ECS,
  entityId: number,
  stateMappings: Map<string, string>
): void {
  const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
  if (!anim) return;

  // Store mappings on the animation component
  (anim as any).stateMappings = stateMappings;
}
