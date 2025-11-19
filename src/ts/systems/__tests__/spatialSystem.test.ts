import ECS from '../../ecs';
import {
  getEntitiesAt,
  getEntitiesInRadius,
  getEntitiesInLocation,
  isPositionOccupied,
  getNearestEntity,
  hasLineOfSight,
} from '../spatialSystem';

import type { PositionComponent, LocationComponent } from '../../components';
import * as LJS from 'littlejsengine';

import { describe, expect, test } from '@jest/globals';

describe('spatialSystem', () => {
  let ecs: ECS;

  beforeEach(() => {
    ecs = new ECS();
  });

  test('getEntitiesAt & isPositionOccupied', () => {
    const e1 = ecs.createEntity();
    ecs.addComponent<PositionComponent>(e1, 'position', { x: 5, y: 5 });

    const e2 = ecs.createEntity();
    ecs.addComponent<PositionComponent>(e2, 'position', { x: 10, y: 10 });

    expect(getEntitiesAt(ecs, 5, 5)).toContain(e1);
    expect(isPositionOccupied(ecs, 5, 5)).toBe(true);
    expect(isPositionOccupied(ecs, 1, 1)).toBe(false);
  });

  test('getEntitiesInRadius and getNearestEntity', () => {
    const center = { x: 7, y: 7 };

    const e1 = ecs.createEntity();
    ecs.addComponent(e1, 'position', { x: 6, y: 6 });

    const e2 = ecs.createEntity();
    ecs.addComponent(e2, 'position', { x: 10, y: 10 });

    const results = getEntitiesInRadius(ecs, center.x, center.y, 2.0);
    expect(results).toContain(e1);
    expect(results).not.toContain(e2);

    const nearest = getNearestEntity(ecs, center.x, center.y);
    expect(nearest).toBe(e1);
  });

  test('getEntitiesInLocation', () => {
    const e1 = ecs.createEntity();
    ecs.addComponent(e1, 'position', { x: 0, y: 0 });
    ecs.addComponent<LocationComponent>(e1, 'location', {
      worldX: 2,
      worldY: 3,
    });

    const e2 = ecs.createEntity();
    ecs.addComponent(e2, 'position', { x: 1, y: 1 });
    ecs.addComponent<LocationComponent>(e2, 'location', {
      worldX: 2,
      worldY: 3,
    });

    const e3 = ecs.createEntity();
    ecs.addComponent(e3, 'position', { x: 1, y: 3 });
    ecs.addComponent<LocationComponent>(e3, 'location', {
      worldX: 1,
      worldY: 3,
    });

    const all = getEntitiesInLocation(ecs, 2, 3);
    expect(all).toEqual(expect.arrayContaining([e1, e2]));
    expect(all).not.toContain(e3);
  });

  test('hasLineOfSight', () => {
    const from = LJS.vec2(0, 0);
    const to = LJS.vec2(3, 0);

    const alwaysTransparent = (_x: number, _y: number) => true;
    expect(hasLineOfSight(ecs, from, to, alwaysTransparent)).toBe(true);

    const blocksAt2 = (x: number, y: number) => {
      return !(x === 2 && y === 0);
    };
    expect(hasLineOfSight(ecs, from, to, blocksAt2)).toBe(false);
  });
});
