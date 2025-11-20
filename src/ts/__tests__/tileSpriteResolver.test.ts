/*
 * File: tileSpriteResolver.test.ts
 * Project: littlejs-rl
 * File Created: Thursday, 20th November 2025 12:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 20th November 2025 12:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import {
  TileSpriteResolver,
  getTileSpriteResolver,
  resolveTileSprite,
  resolveTileSpriteCoords,
  resolveTileInfo,
  setTilesetConfiguration,
} from '../tileSpriteResolver';
import { TilesetConfig } from '../types/dataSchemas';
import * as LJS from 'littlejsengine';

describe('TileSpriteResolver', () => {
  let resolver: TileSpriteResolver;

  // Test configurations
  const defaultConfig: TilesetConfig = {
    id: 'test-default',
    name: 'Test Default',
    image: 'test-tileset.png',
    tileSize: 16,
    gridWidth: 48,
    mappings: {
      PLAYER_WARRIOR: 24,
      ENEMY_GOBLIN: 528,
      FLOOR_STONE: 1,
      WALL_STONE: 48,
    },
  };

  const alternateConfig: TilesetConfig = {
    id: 'test-alternate',
    name: 'Test Alternate',
    image: 'test-tileset-alt.png',
    tileSize: 32,
    gridWidth: 64,
    gridHeight: 20,
    mappings: {
      PLAYER_WARRIOR: 100,
      ENEMY_GOBLIN: 200,
      FLOOR_STONE: 10,
      WALL_STONE: 50,
    },
  };

  beforeEach(() => {
    resolver = TileSpriteResolver.getInstance();
    resolver.reset(); // Clear all configurations
  });

  afterEach(() => {
    resolver.reset();
  });

  describe('Singleton Pattern', () => {
    test('getInstance returns the same instance', () => {
      const instance1 = TileSpriteResolver.getInstance();
      const instance2 = TileSpriteResolver.getInstance();
      expect(instance1).toBe(instance2);
    });

    test('getTileSpriteResolver helper returns singleton', () => {
      const instance = getTileSpriteResolver();
      expect(instance).toBe(resolver);
    });
  });

  describe('Configuration Management', () => {
    test('registerConfiguration adds a configuration', () => {
      resolver.registerConfiguration(defaultConfig);
      const configs = resolver.getAvailableConfigurations();
      expect(configs).toContain('test-default');
    });

    test('registerConfiguration sets first config as active', () => {
      resolver.registerConfiguration(defaultConfig);
      expect(resolver.getActiveConfigurationId()).toBe('test-default');
    });

    test('registerConfiguration warns when overwriting', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      resolver.registerConfiguration(defaultConfig);
      resolver.registerConfiguration(defaultConfig);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('setConfiguration changes active configuration', () => {
      resolver.registerConfiguration(defaultConfig);
      resolver.registerConfiguration(alternateConfig);
      resolver.setConfiguration('test-alternate');
      expect(resolver.getActiveConfigurationId()).toBe('test-alternate');
    });

    test('setConfiguration throws error for unknown config', () => {
      expect(() => {
        resolver.setConfiguration('unknown');
      }).toThrow();
    });

    test('getAvailableConfigurations returns all registered configs', () => {
      resolver.registerConfiguration(defaultConfig);
      resolver.registerConfiguration(alternateConfig);
      const configs = resolver.getAvailableConfigurations();
      expect(configs).toEqual(['test-default', 'test-alternate']);
    });

    test('getActiveConfiguration returns current config', () => {
      resolver.registerConfiguration(defaultConfig);
      const active = resolver.getActiveConfiguration();
      expect(active).toEqual(defaultConfig);
    });
  });

  describe('Sprite Resolution', () => {
    beforeEach(() => {
      resolver.registerConfiguration(defaultConfig);
    });

    test('resolve returns correct index from active config', () => {
      const index = resolver.resolve('PLAYER_WARRIOR');
      expect(index).toBe(24);
    });

    test('resolve falls back to AutoTileSprite for unmapped sprites', () => {
      // AutoTileSprite.VOID = 0
      const index = resolver.resolve('VOID');
      expect(index).toBe(0);
    });

    test('resolve throws error for unknown sprites', () => {
      expect(() => {
        resolver.resolve('UNKNOWN_SPRITE');
      }).toThrow();
    });

    test('resolve uses different mappings for different configs', () => {
      expect(resolver.resolve('PLAYER_WARRIOR')).toBe(24);

      resolver.registerConfiguration(alternateConfig);
      resolver.setConfiguration('test-alternate');

      expect(resolver.resolve('PLAYER_WARRIOR')).toBe(100);
    });

    test('resolveTileSprite helper function works', () => {
      const index = resolveTileSprite('ENEMY_GOBLIN');
      expect(index).toBe(528);
    });
  });

  describe('Coordinate Resolution', () => {
    beforeEach(() => {
      resolver.registerConfiguration(defaultConfig);
    });

    test('resolveToCoords converts index to grid coordinates', () => {
      const coords = resolver.resolveToCoords('PLAYER_WARRIOR');
      expect(coords).toEqual({ x: 24, y: 0 }); // 24 % 48 = 24, floor(24/48) = 0
    });

    test('resolveToCoords respects gridWidth', () => {
      resolver.registerConfiguration(alternateConfig);
      resolver.setConfiguration('test-alternate');

      const coords = resolver.resolveToCoords('ENEMY_GOBLIN');
      // 200 % 64 = 8, floor(200/64) = 3
      expect(coords).toEqual({ x: 8, y: 3 });
    });

    test('resolveTileSpriteCoords helper function works', () => {
      const coords = resolveTileSpriteCoords('WALL_STONE');
      expect(coords).toEqual({ x: 0, y: 1 }); // 48 % 48 = 0, floor(48/48) = 1
    });
  });

  describe('TileInfo Resolution', () => {
    beforeEach(() => {
      resolver.registerConfiguration(defaultConfig);
    });

    test('resolveToTileInfo creates correct TileInfo', () => {
      const tileInfo = resolver.resolveToTileInfo('PLAYER_WARRIOR');
      expect(tileInfo).toBeInstanceOf(LJS.TileInfo);
      // TileInfo stores position in pixels: coords * tileSize
      expect(tileInfo.pos.x).toBe(24 * 16); // 384
      expect(tileInfo.pos.y).toBe(0 * 16); // 0
      expect(tileInfo.size.x).toBe(16);
      expect(tileInfo.size.y).toBe(16);
    });

    test('resolveToTileInfo respects tileSize', () => {
      resolver.registerConfiguration(alternateConfig);
      resolver.setConfiguration('test-alternate');

      const tileInfo = resolver.resolveToTileInfo('PLAYER_WARRIOR');
      // Index 100: 100 % 64 = 36, floor(100/64) = 1
      expect(tileInfo.pos.x).toBe(36 * 32); // 1152
      expect(tileInfo.pos.y).toBe(1 * 32); // 32
      expect(tileInfo.size.x).toBe(32);
      expect(tileInfo.size.y).toBe(32);
    });

    test('resolveTileInfo helper function works', () => {
      const tileInfo = resolveTileInfo('FLOOR_STONE');
      expect(tileInfo).toBeInstanceOf(LJS.TileInfo);
      expect(tileInfo.pos.x).toBe(1 * 16);
      expect(tileInfo.pos.y).toBe(0 * 16);
    });
  });

  describe('Configuration Properties', () => {
    beforeEach(() => {
      resolver.registerConfiguration(defaultConfig);
    });

    test('getTilesetImage returns correct path', () => {
      expect(resolver.getTilesetImage()).toBe('test-tileset.png');
    });

    test('getTilesetImage returns null when no config', () => {
      resolver.reset();
      expect(resolver.getTilesetImage()).toBeNull();
    });

    test('getTileSize returns correct size', () => {
      expect(resolver.getTileSize()).toBe(16);
    });

    test('getTileSize returns default when no config', () => {
      resolver.reset();
      expect(resolver.getTileSize()).toBe(16);
    });

    test('getGridWidth returns correct width', () => {
      expect(resolver.getGridWidth()).toBe(48);
    });

    test('getGridWidth returns default when no config', () => {
      resolver.reset();
      expect(resolver.getGridWidth()).toBe(48);
    });

    test('getGridHeight returns height when specified', () => {
      resolver.registerConfiguration(alternateConfig);
      resolver.setConfiguration('test-alternate');
      expect(resolver.getGridHeight()).toBe(20);
    });

    test('getGridHeight returns null when not specified', () => {
      expect(resolver.getGridHeight()).toBeNull();
    });
  });

  describe('Sprite Checking', () => {
    beforeEach(() => {
      resolver.registerConfiguration(defaultConfig);
    });

    test('hasSprite returns true for mapped sprites', () => {
      expect(resolver.hasSprite('PLAYER_WARRIOR')).toBe(true);
    });

    test('hasSprite returns true for AutoTileSprite fallbacks', () => {
      expect(resolver.hasSprite('VOID')).toBe(true);
    });

    test('hasSprite returns false for unknown sprites', () => {
      expect(resolver.hasSprite('UNKNOWN_SPRITE')).toBe(false);
    });

    test('getAvailableSprites returns all mapped sprite names', () => {
      const sprites = resolver.getAvailableSprites();
      expect(sprites).toEqual([
        'PLAYER_WARRIOR',
        'ENEMY_GOBLIN',
        'FLOOR_STONE',
        'WALL_STONE',
      ]);
    });

    test('getAvailableSprites returns empty array when no config', () => {
      resolver.reset();
      expect(resolver.getAvailableSprites()).toEqual([]);
    });
  });

  describe('Helper Function Integration', () => {
    beforeEach(() => {
      resolver.registerConfiguration(defaultConfig);
    });

    test('setTilesetConfiguration helper switches config', () => {
      resolver.registerConfiguration(alternateConfig);
      setTilesetConfiguration('test-alternate');
      expect(resolver.getActiveConfigurationId()).toBe('test-alternate');
    });

    test('all helper functions use active configuration', () => {
      resolver.registerConfiguration(alternateConfig);
      setTilesetConfiguration('test-alternate');

      const index = resolveTileSprite('PLAYER_WARRIOR');
      const coords = resolveTileSpriteCoords('PLAYER_WARRIOR');
      const tileInfo = resolveTileInfo('PLAYER_WARRIOR');

      expect(index).toBe(100);
      expect(coords.x).toBe(36); // 100 % 64
      expect(tileInfo.pos.x).toBe(36 * 32);
    });
  });

  describe('Edge Cases', () => {
    test('resolve works without active configuration (uses fallback)', () => {
      // Should fall back to AutoTileSprite
      const index = resolver.resolve('VOID');
      expect(index).toBe(0);
    });

    test('resolveToCoords handles large indices', () => {
      resolver.registerConfiguration(defaultConfig);
      const coords = resolver.resolveToCoords('ENEMY_GOBLIN');
      // 528 % 48 = 0, floor(528/48) = 11
      expect(coords).toEqual({ x: 0, y: 11 });
    });

    test('multiple configurations can coexist', () => {
      resolver.registerConfiguration(defaultConfig);
      resolver.registerConfiguration(alternateConfig);

      expect(resolver.getAvailableConfigurations().length).toBe(2);

      resolver.setConfiguration('test-default');
      expect(resolver.resolve('PLAYER_WARRIOR')).toBe(24);

      resolver.setConfiguration('test-alternate');
      expect(resolver.resolve('PLAYER_WARRIOR')).toBe(100);
    });

    test('reset clears all data', () => {
      resolver.registerConfiguration(defaultConfig);
      resolver.registerConfiguration(alternateConfig);

      resolver.reset();

      expect(resolver.getAvailableConfigurations()).toEqual([]);
      expect(resolver.getActiveConfigurationId()).toBeNull();
      expect(resolver.getActiveConfiguration()).toBeNull();
    });
  });
});
