/*
 * File: stateSystem.test.ts
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

import ECS from '../../ecs';
import { StateComponent, EntityState } from '../../components/state';
import {
  hasState,
  hasAllStates,
  hasAnyState,
  addState,
  addStates,
  removeState,
  removeStates,
  toggleState,
  clearStates,
  getStates,
  setStates,
} from '../stateSystem';

describe('State System', () => {
  let ecs: ECS;
  let entityId: number;

  beforeEach(() => {
    ecs = new ECS();
    entityId = ecs.createEntity();
  });

  describe('addState', () => {
    test('creates component if missing', () => {
      expect(ecs.hasComponent(entityId, 'state')).toBe(false);

      const result = addState(ecs, entityId, EntityState.MOVING);

      expect(result).toBe(true);
      expect(ecs.hasComponent(entityId, 'state')).toBe(true);
      expect(hasState(ecs, entityId, EntityState.MOVING)).toBe(true);
    });

    test('adds state to existing component', () => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.MOVING]),
      });

      const result = addState(ecs, entityId, EntityState.ATTACKING);

      expect(result).toBe(true);
      expect(hasState(ecs, entityId, EntityState.ATTACKING)).toBe(true);
      expect(hasState(ecs, entityId, EntityState.MOVING)).toBe(true);
    });

    test('returns false when adding existing state', () => {
      addState(ecs, entityId, EntityState.MOVING);

      const result = addState(ecs, entityId, EntityState.MOVING);

      expect(result).toBe(false);
    });

    test('works with custom state strings', () => {
      addState(ecs, entityId, 'custom_state');

      expect(hasState(ecs, entityId, 'custom_state')).toBe(true);
    });
  });

  describe('addStates', () => {
    test('adds multiple states at once', () => {
      addStates(ecs, entityId, [
        EntityState.MOVING,
        EntityState.ATTACKING,
        EntityState.STUNNED,
      ]);

      expect(hasState(ecs, entityId, EntityState.MOVING)).toBe(true);
      expect(hasState(ecs, entityId, EntityState.ATTACKING)).toBe(true);
      expect(hasState(ecs, entityId, EntityState.STUNNED)).toBe(true);
    });

    test('handles empty array', () => {
      addStates(ecs, entityId, []);

      expect(ecs.hasComponent(entityId, 'state')).toBe(false);
    });
  });

  describe('hasState', () => {
    test('returns true for existing state', () => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.MOVING]),
      });

      expect(hasState(ecs, entityId, EntityState.MOVING)).toBe(true);
    });

    test('returns false for missing state', () => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.MOVING]),
      });

      expect(hasState(ecs, entityId, EntityState.ATTACKING)).toBe(false);
    });

    test('returns false when component missing', () => {
      expect(hasState(ecs, entityId, EntityState.MOVING)).toBe(false);
    });
  });

  describe('hasAllStates', () => {
    beforeEach(() => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.MOVING, EntityState.ATTACKING]),
      });
    });

    test('returns true when all states present', () => {
      expect(
        hasAllStates(ecs, entityId, [EntityState.MOVING, EntityState.ATTACKING])
      ).toBe(true);
    });

    test('returns false when some states missing', () => {
      expect(
        hasAllStates(ecs, entityId, [EntityState.MOVING, EntityState.STUNNED])
      ).toBe(false);
    });

    test('returns true for empty array', () => {
      expect(hasAllStates(ecs, entityId, [])).toBe(true);
    });

    test('returns false when component missing', () => {
      const newId = ecs.createEntity();
      expect(hasAllStates(ecs, newId, [EntityState.MOVING])).toBe(false);
    });
  });

  describe('hasAnyState', () => {
    beforeEach(() => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.MOVING]),
      });
    });

    test('returns true when at least one state present', () => {
      expect(
        hasAnyState(ecs, entityId, [EntityState.MOVING, EntityState.ATTACKING])
      ).toBe(true);
    });

    test('returns false when no states present', () => {
      expect(
        hasAnyState(ecs, entityId, [EntityState.STUNNED, EntityState.FROZEN])
      ).toBe(false);
    });

    test('returns false for empty array', () => {
      expect(hasAnyState(ecs, entityId, [])).toBe(false);
    });

    test('returns false when component missing', () => {
      const newId = ecs.createEntity();
      expect(hasAnyState(ecs, newId, [EntityState.MOVING])).toBe(false);
    });
  });

  describe('removeState', () => {
    beforeEach(() => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.MOVING, EntityState.ATTACKING]),
      });
    });

    test('removes existing state', () => {
      const result = removeState(ecs, entityId, EntityState.MOVING);

      expect(result).toBe(true);
      expect(hasState(ecs, entityId, EntityState.MOVING)).toBe(false);
      expect(hasState(ecs, entityId, EntityState.ATTACKING)).toBe(true);
    });

    test('returns false when removing non-existent state', () => {
      const result = removeState(ecs, entityId, EntityState.STUNNED);

      expect(result).toBe(false);
    });

    test('returns false when component missing', () => {
      const newId = ecs.createEntity();
      const result = removeState(ecs, newId, EntityState.MOVING);

      expect(result).toBe(false);
    });
  });

  describe('removeStates', () => {
    beforeEach(() => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([
          EntityState.MOVING,
          EntityState.ATTACKING,
          EntityState.STUNNED,
        ]),
      });
    });

    test('removes multiple states at once', () => {
      removeStates(ecs, entityId, [EntityState.MOVING, EntityState.ATTACKING]);

      expect(hasState(ecs, entityId, EntityState.MOVING)).toBe(false);
      expect(hasState(ecs, entityId, EntityState.ATTACKING)).toBe(false);
      expect(hasState(ecs, entityId, EntityState.STUNNED)).toBe(true);
    });

    test('handles empty array', () => {
      removeStates(ecs, entityId, []);

      expect(hasState(ecs, entityId, EntityState.MOVING)).toBe(true);
    });
  });

  describe('toggleState', () => {
    test('adds state when not present', () => {
      const result = toggleState(ecs, entityId, EntityState.HIGHLIGHTED);

      expect(result).toBe(true);
      expect(hasState(ecs, entityId, EntityState.HIGHLIGHTED)).toBe(true);
    });

    test('removes state when present', () => {
      addState(ecs, entityId, EntityState.HIGHLIGHTED);

      const result = toggleState(ecs, entityId, EntityState.HIGHLIGHTED);

      expect(result).toBe(false);
      expect(hasState(ecs, entityId, EntityState.HIGHLIGHTED)).toBe(false);
    });

    test('works multiple times', () => {
      toggleState(ecs, entityId, EntityState.HIGHLIGHTED); // Add
      toggleState(ecs, entityId, EntityState.HIGHLIGHTED); // Remove
      const result = toggleState(ecs, entityId, EntityState.HIGHLIGHTED); // Add

      expect(result).toBe(true);
      expect(hasState(ecs, entityId, EntityState.HIGHLIGHTED)).toBe(true);
    });
  });

  describe('clearStates', () => {
    test('removes all states', () => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([
          EntityState.MOVING,
          EntityState.ATTACKING,
          EntityState.STUNNED,
        ]),
      });

      clearStates(ecs, entityId);

      expect(getStates(ecs, entityId)).toHaveLength(0);
    });

    test('handles entity without component', () => {
      clearStates(ecs, entityId); // Should not throw
      expect(ecs.hasComponent(entityId, 'state')).toBe(false);
    });
  });

  describe('getStates', () => {
    test('returns array of all states', () => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.MOVING, EntityState.ATTACKING]),
      });

      const states = getStates(ecs, entityId);

      expect(states).toHaveLength(2);
      expect(states).toContain(EntityState.MOVING);
      expect(states).toContain(EntityState.ATTACKING);
    });

    test('returns empty array when component missing', () => {
      const states = getStates(ecs, entityId);

      expect(states).toEqual([]);
    });

    test('returns empty array when no states', () => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set(),
      });

      const states = getStates(ecs, entityId);

      expect(states).toEqual([]);
    });
  });

  describe('setStates', () => {
    test('sets exact states', () => {
      setStates(ecs, entityId, [EntityState.MOVING, EntityState.RUNNING]);

      const states = getStates(ecs, entityId);
      expect(states).toHaveLength(2);
      expect(states).toContain(EntityState.MOVING);
      expect(states).toContain(EntityState.RUNNING);
    });

    test('replaces existing states', () => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.ATTACKING, EntityState.STUNNED]),
      });

      setStates(ecs, entityId, [EntityState.MOVING]);

      const states = getStates(ecs, entityId);
      expect(states).toHaveLength(1);
      expect(states).toContain(EntityState.MOVING);
      expect(states).not.toContain(EntityState.ATTACKING);
    });

    test('creates component if missing', () => {
      expect(ecs.hasComponent(entityId, 'state')).toBe(false);

      setStates(ecs, entityId, [EntityState.MOVING]);

      expect(ecs.hasComponent(entityId, 'state')).toBe(true);
    });

    test('handles empty array', () => {
      ecs.addComponent<StateComponent>(entityId, 'state', {
        states: new Set([EntityState.MOVING]),
      });

      setStates(ecs, entityId, []);

      expect(getStates(ecs, entityId)).toEqual([]);
    });
  });

  describe('EntityState Constants', () => {
    test('all constants are defined', () => {
      expect(EntityState.MOVING).toBeDefined();
      expect(EntityState.ATTACKING).toBeDefined();
      expect(EntityState.STUNNED).toBeDefined();
      expect(EntityState.DEAD).toBeDefined();
      expect(EntityState.EQUIPPED).toBeDefined();
    });

    test('constants are strings', () => {
      expect(typeof EntityState.MOVING).toBe('string');
      expect(typeof EntityState.ATTACKING).toBe('string');
    });
  });
});
