/*
 * File: basicAnimationSystem.test.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 19th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 19th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import * as LJS from 'littlejsengine';
// @ts-ignore - mockTime is added in mock
const mockTime = (LJS as any).mockTime;

import ECS from '../../ecs';
import { AnimationComponent } from '../../components/animation';
import { RenderComponent } from '../../components/render';
import { StateComponent, EntityState } from '../../components/state';
import {
  basicAnimationSystem,
  createHorizontalAnimation,
  switchAnimation,
  playAnimation,
  pauseAnimation,
  stopAnimation,
  setAnimationFrame,
  getCurrentAnimation,
} from '../basicAnimationSystem';

describe('Basic Animation System', () => {
  let ecs: ECS;
  let entityId: number;

  beforeEach(() => {
    ecs = new ECS();
    entityId = ecs.createEntity();
  });

  describe('createHorizontalAnimation', () => {
    test('generates correct number of frames', () => {
      const anim = createHorizontalAnimation(0, 0, 16, 16, 4, 0.2, true);

      expect(anim.frames).toHaveLength(4);
      expect(anim.frameTime).toBe(0.2);
      expect(anim.loop).toBe(true);
    });

    test('creates frames with correct positions', () => {
      const anim = createHorizontalAnimation(0, 0, 16, 16, 3, 0.2, true);

      expect(anim.frames[0].pos).toEqual(LJS.vec2(0, 0));
      expect(anim.frames[1].pos).toEqual(LJS.vec2(16, 0));
      expect(anim.frames[2].pos).toEqual(LJS.vec2(32, 0));
    });

    test('creates frames with correct size', () => {
      const anim = createHorizontalAnimation(0, 0, 16, 16, 2, 0.2, true);

      anim.frames.forEach((frame) => {
        expect(frame.size).toEqual(LJS.vec2(16, 16));
      });
    });

    test('handles non-zero start positions', () => {
      const anim = createHorizontalAnimation(32, 16, 16, 16, 2, 0.2, true);

      expect(anim.frames[0].pos).toEqual(LJS.vec2(32, 16));
      expect(anim.frames[1].pos).toEqual(LJS.vec2(48, 16));
    });
  });

  describe('switchAnimation', () => {
    beforeEach(() => {
      const idleAnim = createHorizontalAnimation(0, 0, 16, 16, 1, 0.5, true);
      const walkAnim = createHorizontalAnimation(0, 0, 16, 16, 4, 0.2, true);

      ecs.addComponent<AnimationComponent>(entityId, 'animation', {
        animations: new Map([
          ['idle', idleAnim],
          ['walk', walkAnim],
        ]),
        currentAnimation: 'idle',
        currentFrame: 0,
        timer: 0,
        playing: true,
      });
    });

    test('changes current animation', () => {
      const result = switchAnimation(ecs, entityId, 'walk');

      expect(result).toBe(true);
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.currentAnimation).toBe('walk');
    });

    test('resets frame and timer', () => {
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      anim!.currentFrame = 2;
      anim!.timer = 0.5;

      switchAnimation(ecs, entityId, 'walk');

      expect(anim!.currentFrame).toBe(0);
      expect(anim!.timer).toBe(0);
    });

    test('returns false for non-existent animation', () => {
      const result = switchAnimation(ecs, entityId, 'nonexistent');

      expect(result).toBe(false);
    });

    test('does not switch to same animation by default', () => {
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      anim!.currentFrame = 2;

      switchAnimation(ecs, entityId, 'idle', false);

      expect(anim!.currentFrame).toBe(2); // Not reset
    });

    test('restarts same animation when restart is true', () => {
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      anim!.currentFrame = 2;

      switchAnimation(ecs, entityId, 'idle', true);

      expect(anim!.currentFrame).toBe(0); // Reset
    });
  });

  describe('basicAnimationSystem', () => {
    beforeEach(() => {
      const walkAnim = createHorizontalAnimation(0, 0, 16, 16, 4, 0.1, true);

      ecs.addComponent<AnimationComponent>(entityId, 'animation', {
        animations: new Map([['walk', walkAnim]]),
        currentAnimation: 'walk',
        currentFrame: 0,
        timer: 0,
        playing: true,
      });

      ecs.addComponent<RenderComponent>(entityId, 'render', {
        tileInfo: new LJS.TileInfo(LJS.vec2(0, 0), LJS.vec2(16, 16)),
        color: new LJS.Color(1, 1, 1),
        size: LJS.vec2(1, 1),
      });
    });

    test('advances frame when timer exceeds frameTime', () => {
      mockTime.timeDelta = 0.15;

      basicAnimationSystem(ecs);

      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.currentFrame).toBe(1);
    });

    test('updates render component tileInfo', () => {
      mockTime.timeDelta = 0.15;

      const render = ecs.getComponent<RenderComponent>(entityId, 'render');
      const initialTileInfo = render!.tileInfo;

      basicAnimationSystem(ecs);

      expect(render!.tileInfo).not.toBe(initialTileInfo);
    });

    test('loops animation when reaching end', () => {
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      anim!.currentFrame = 3; // Last frame (4 total)

      mockTime.timeDelta = 0.15;
      basicAnimationSystem(ecs);

      expect(anim!.currentFrame).toBe(0); // Looped back
    });

    test('stops non-looping animation at end', () => {
      const attackAnim = createHorizontalAnimation(0, 0, 16, 16, 3, 0.1, false);
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      anim!.animations.set('attack', attackAnim);
      anim!.currentAnimation = 'attack';
      anim!.currentFrame = 2; // Last frame

      mockTime.timeDelta = 0.15;
      basicAnimationSystem(ecs);

      expect(anim!.currentFrame).toBe(2); // Stayed on last frame
      expect(anim!.playing).toBe(false);
    });

    test('does not update paused animations', () => {
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      anim!.playing = false;

      mockTime.timeDelta = 0.15;
      basicAnimationSystem(ecs);

      expect(anim!.currentFrame).toBe(0); // No change
    });
  });

  describe('Animation State Integration', () => {
    beforeEach(() => {
      const idleAnim = createHorizontalAnimation(0, 0, 16, 16, 1, 0.5, true);
      const walkAnim = createHorizontalAnimation(0, 0, 16, 16, 4, 0.2, true);
      const attackAnim = createHorizontalAnimation(
        0,
        0,
        16,
        16,
        3,
        0.15,
        false
      );

      ecs.addComponent<AnimationComponent>(entityId, 'animation', {
        animations: new Map([
          ['idle', idleAnim],
          ['walk', walkAnim],
          ['attack', attackAnim],
        ]),
        currentAnimation: 'idle',
        currentFrame: 0,
        timer: 0,
        playing: true,
      });

      ecs.addComponent<RenderComponent>(entityId, 'render', {
        tileInfo: new LJS.TileInfo(LJS.vec2(0, 0), LJS.vec2(16, 16)),
        color: new LJS.Color(1, 1, 1),
        size: LJS.vec2(1, 1),
      });

      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set(),
      });
    });

    test('auto-switches to walk when moving', () => {
      const state = ecs.getComponent<StateComponent>(entityId, 'state');
      state!.states.add(EntityState.MOVING);

      mockTime.timeDelta = 0.01;
      basicAnimationSystem(ecs);

      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.currentAnimation).toBe('walk');
    });

    test('auto-switches to attack when attacking', () => {
      const state = ecs.getComponent<StateComponent>(entityId, 'state');
      state!.states.add(EntityState.ATTACKING);

      mockTime.timeDelta = 0.01;
      basicAnimationSystem(ecs);

      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.currentAnimation).toBe('attack');
    });

    test('prioritizes attack over move', () => {
      const state = ecs.getComponent<StateComponent>(entityId, 'state');
      state!.states.add(EntityState.MOVING);
      state!.states.add(EntityState.ATTACKING);

      mockTime.timeDelta = 0.01;
      basicAnimationSystem(ecs);

      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.currentAnimation).toBe('attack');
    });
  });

  describe('Animation Control Functions', () => {
    beforeEach(() => {
      const walkAnim = createHorizontalAnimation(0, 0, 16, 16, 4, 0.2, true);

      ecs.addComponent<AnimationComponent>(entityId, 'animation', {
        animations: new Map([['walk', walkAnim]]),
        currentAnimation: 'walk',
        currentFrame: 2,
        timer: 0.5,
        playing: false,
      });
    });

    test('playAnimation resumes animation', () => {
      playAnimation(ecs, entityId, false);

      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.playing).toBe(true);
      expect(anim!.currentFrame).toBe(2); // Not reset
    });

    test('playAnimation with restart resets frame', () => {
      playAnimation(ecs, entityId, true);

      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.playing).toBe(true);
      expect(anim!.currentFrame).toBe(0);
      expect(anim!.timer).toBe(0);
    });

    test('pauseAnimation stops animation', () => {
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      anim!.playing = true;

      pauseAnimation(ecs, entityId);

      expect(anim!.playing).toBe(false);
    });

    test('stopAnimation pauses and resets', () => {
      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      anim!.playing = true;

      stopAnimation(ecs, entityId);

      expect(anim!.playing).toBe(false);
      expect(anim!.currentFrame).toBe(0);
      expect(anim!.timer).toBe(0);
    });

    test('setAnimationFrame sets specific frame', () => {
      setAnimationFrame(ecs, entityId, 3);

      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.currentFrame).toBe(3);
    });

    test('setAnimationFrame clamps to valid range', () => {
      setAnimationFrame(ecs, entityId, 999);

      const anim = ecs.getComponent<AnimationComponent>(entityId, 'animation');
      expect(anim!.currentFrame).toBe(3); // Max is 3 (4 frames, 0-indexed)
    });

    test('getCurrentAnimation returns animation name', () => {
      const name = getCurrentAnimation(ecs, entityId);

      expect(name).toBe('walk');
    });
  });
});


