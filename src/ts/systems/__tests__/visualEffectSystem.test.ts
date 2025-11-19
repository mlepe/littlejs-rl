/*
 * File: visualEffectSystem.test.ts
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
import {
  VisualEffectComponent,
  VisualEffectType,
  EffectDuration,
  EffectScale,
  EffectDistance,
} from '../../components/visualEffect';
import {
  visualEffectSystem,
  addOffsetEffect,
  addShakeEffect,
  addScaleEffect,
  addRotationEffect,
  addFlashEffect,
  clearVisualEffects,
} from '../visualEffectSystem';

describe('Visual Effects System', () => {
  let ecs: ECS;
  let entityId: number;

  beforeEach(() => {
    ecs = new ECS();
    entityId = ecs.createEntity();
  });

  describe('addOffsetEffect', () => {
    test('applies scale correctly', () => {
      const direction = LJS.vec2(1, 0);
      addOffsetEffect(ecs, entityId, direction, 0.2, 'linear', 2.0);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx).toBeDefined();
      expect(vfx!.effects).toHaveLength(1);
      expect(vfx!.effects[0].type).toBe(VisualEffectType.OFFSET);
      expect(vfx!.effects[0].data.offset).toEqual(LJS.vec2(2, 0));
    });

    test('works with preset values', () => {
      const direction = LJS.vec2(1, 0);
      addOffsetEffect(
        ecs,
        entityId,
        direction,
        EffectDuration.FAST,
        'easeOut',
        EffectDistance.NORMAL
      );

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects[0].duration).toBe(EffectDuration.FAST);
      expect(vfx!.effects[0].data.offset).toEqual(
        LJS.vec2(EffectDistance.NORMAL, 0)
      );
    });

    test('defaults to scale 1.0', () => {
      const direction = LJS.vec2(0.5, 0.3);
      addOffsetEffect(ecs, entityId, direction, 0.2);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects[0].data.offset).toEqual(direction);
    });
  });

  describe('addShakeEffect', () => {
    test('applies scale to intensity', () => {
      addShakeEffect(ecs, entityId, 0.1, 0.2, 1.5);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects[0].type).toBe(VisualEffectType.SHAKE);
      expect(vfx!.effects[0].data.intensity).toBeCloseTo(0.15); // 0.1 * 1.5
    });

    test('works with preset values', () => {
      addShakeEffect(
        ecs,
        entityId,
        EffectDistance.SMALL,
        EffectDuration.NORMAL,
        EffectScale.VERY_STRONG
      );

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects[0].data.intensity).toBe(
        EffectDistance.SMALL * EffectScale.VERY_STRONG
      );
    });
  });

  describe('addRotationEffect', () => {
    test('applies scale to rotation', () => {
      const baseRotation = Math.PI * 2; // 360 degrees
      addRotationEffect(ecs, entityId, baseRotation, 0.5, 'linear', 0.5);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects[0].type).toBe(VisualEffectType.ROTATE);
      expect(vfx!.effects[0].data.rotation).toBe(Math.PI); // Half rotation
    });
  });

  describe('Effect Presets', () => {
    test('EffectDuration enum has expected values', () => {
      expect(EffectDuration.INSTANT).toBe(0.05);
      expect(EffectDuration.FAST).toBe(0.15);
      expect(EffectDuration.NORMAL).toBe(0.2);
      expect(EffectDuration.EXTENDED).toBe(1.0);
    });

    test('EffectScale enum progression makes sense', () => {
      expect(EffectScale.SUBTLE).toBeLessThan(EffectScale.NORMAL);
      expect(EffectScale.NORMAL).toBeLessThan(EffectScale.STRONG);
      expect(EffectScale.STRONG).toBeLessThan(EffectScale.VERY_STRONG);
      expect(EffectScale.VERY_STRONG).toBeLessThan(EffectScale.EXTREME);
    });

    test('EffectDistance enum progression makes sense', () => {
      expect(EffectDistance.TINY).toBeLessThan(EffectDistance.SMALL);
      expect(EffectDistance.SMALL).toBeLessThan(EffectDistance.NORMAL);
      expect(EffectDistance.NORMAL).toBeLessThan(EffectDistance.LARGE);
      expect(EffectDistance.LARGE).toBeLessThan(EffectDistance.HUGE);
    });
  });

  describe('Multiple Effects', () => {
    test('multiple effects accumulate correctly', () => {
      addShakeEffect(ecs, entityId, 0.1, 0.3);
      addOffsetEffect(ecs, entityId, LJS.vec2(0.2, 0), 0.2);
      addFlashEffect(ecs, entityId, new LJS.Color(1, 0, 0, 1), 0.15);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects).toHaveLength(3);
    });

    test('clearVisualEffects removes all effects', () => {
      addShakeEffect(ecs, entityId, 0.1, 0.3);
      addOffsetEffect(ecs, entityId, LJS.vec2(0.2, 0), 0.2);

      clearVisualEffects(ecs, entityId);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects).toHaveLength(0);
    });
  });

  describe('visualEffectSystem', () => {
    test('processes effects and updates elapsed time', () => {
      addOffsetEffect(ecs, entityId, LJS.vec2(1, 0), 0.2);

      // Mock time delta
      mockTime.timeDelta = 0.1;

      visualEffectSystem(ecs);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects[0].elapsed).toBe(0.1);
    });

    test('removes completed effects', () => {
      addFlashEffect(ecs, entityId, new LJS.Color(1, 0, 0, 1), 0.1);

      // Simulate time passage beyond duration
      mockTime.timeDelta = 0.15;
      visualEffectSystem(ecs);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects).toHaveLength(0);
    });

    test('accumulates offset from multiple effects', () => {
      addOffsetEffect(ecs, entityId, LJS.vec2(0.1, 0), 0.2);
      addOffsetEffect(ecs, entityId, LJS.vec2(0, 0.1), 0.2);

      mockTime.timeDelta = 0.1;
      visualEffectSystem(ecs);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      // Both effects at 50% progress (easing will affect actual values)
      expect(vfx!.currentOffset).toBeDefined();
      // Just verify offset exists and is non-zero
      expect(Math.abs(vfx!.currentOffset!.x)).toBeGreaterThan(0);
      expect(Math.abs(vfx!.currentOffset!.y)).toBeGreaterThan(0);
    });
  });

  describe('Effect Types', () => {
    test('addScaleEffect creates scale effect', () => {
      addScaleEffect(ecs, entityId, LJS.vec2(1.2, 0.8), 0.2, 'easeOut');

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects[0].type).toBe(VisualEffectType.SCALE);
      expect(vfx!.effects[0].data.scale).toEqual(LJS.vec2(1.2, 0.8));
    });

    test('addFlashEffect creates flash effect', () => {
      const flashColor = new LJS.Color(1, 0.2, 0.2, 1);
      addFlashEffect(ecs, entityId, flashColor, 0.3);

      const vfx = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );
      expect(vfx!.effects[0].type).toBe(VisualEffectType.FLASH);
      expect(vfx!.effects[0].data.color).toEqual(flashColor);
    });
  });

  describe('Component Initialization', () => {
    test('creates component if missing', () => {
      expect(ecs.hasComponent(entityId, 'visualEffect')).toBe(false);

      addOffsetEffect(ecs, entityId, LJS.vec2(1, 0), 0.2);

      expect(ecs.hasComponent(entityId, 'visualEffect')).toBe(true);
    });

    test('reuses existing component', () => {
      addOffsetEffect(ecs, entityId, LJS.vec2(1, 0), 0.2);
      const vfx1 = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );

      addShakeEffect(ecs, entityId, 0.1, 0.3);
      const vfx2 = ecs.getComponent<VisualEffectComponent>(
        entityId,
        'visualEffect'
      );

      expect(vfx1).toBe(vfx2); // Same component instance
      expect(vfx2!.effects).toHaveLength(2);
    });
  });
});
