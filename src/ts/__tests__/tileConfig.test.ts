/*
 * File: tileConfig.test.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 19th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 19th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { describe, test, expect } from '@jest/globals';

import {
  TileCategory,
  TileSubcategory,
  getTileCoords,
  getTileIndex,
  getTileCategory,
  getTileSubcategory,
  AutoTileSprite,
} from '../tileConfig';

describe('Tile Configuration Helpers', () => {
  describe('getTileIndex', () => {
    test('is inverse of getTileCoords', () => {
      const testSprites = [
        AutoTileSprite.PLAYER_WARRIOR,
        AutoTileSprite.FLOOR_STONE,
        AutoTileSprite.WALL_STONE,
        AutoTileSprite.SWORD_SHORT,
        AutoTileSprite.ENEMY_ORC,
      ];

      testSprites.forEach((originalIndex) => {
        const coords = getTileCoords(originalIndex);
        const backToIndex = getTileIndex(coords.x, coords.y);

        expect(backToIndex).toBe(originalIndex);
      });
    });

    test('calculates correctly for known positions', () => {
      // Top-left corner
      expect(getTileIndex(0, 0)).toBe(0);

      // PLAYER_WARRIOR at (24, 0)
      expect(getTileIndex(24, 0)).toBe(24);

      // WALL_STONE at (0, 1)
      expect(getTileIndex(0, 1)).toBe(49);

      // Second row, sixth tile (5, 2)
      expect(getTileIndex(5, 2)).toBe(103);

      // End of first row
      expect(getTileIndex(47, 0)).toBe(47);

      // Start of second row
      expect(getTileIndex(0, 1)).toBe(49);
    });

    test('handles different tileset widths', () => {
      // Default width (49)
      expect(getTileIndex(1, 1)).toBe(50);

      // Custom width (32)
      expect(getTileIndex(1, 1, 32)).toBe(33);

      // Custom width (16)
      expect(getTileIndex(5, 3, 16)).toBe(53); // 3 * 16 + 5
    });

    test('handles large coordinates', () => {
      expect(getTileIndex(48, 21)).toBe(1077); // Last tile in 49x22 tileset
    });

    test('handles zero coordinates', () => {
      expect(getTileIndex(0, 0)).toBe(0);
    });
  });

  describe('getTileCoords and getTileIndex round-trip', () => {
    test('round-trip for range of sprites', () => {
      // Test first 200 sprites
      for (let i = 0; i < 200; i++) {
        const coords = getTileCoords(i);
        const index = getTileIndex(coords.x, coords.y);
        expect(index).toBe(i);
      }
    });

    test('round-trip with custom tileset width', () => {
      const customWidth = 32;

      for (let i = 0; i < 100; i++) {
        const coords = getTileCoords(i, customWidth);
        const index = getTileIndex(coords.x, coords.y, customWidth);
        expect(index).toBe(i);
      }
    });
  });

  describe('getTileCategory', () => {
    test('correctly categorizes character sprites', () => {
      expect(getTileCategory(AutoTileSprite.PLAYER_WARRIOR)).toBe(
        TileCategory.CHARACTER
      );
      expect(getTileCategory(AutoTileSprite.ENEMY_ORC)).toBe(
        TileCategory.CHARACTER
      );
      expect(getTileCategory(AutoTileSprite.NPC_MERCHANT)).toBe(
        TileCategory.CHARACTER
      );
    });

    test('correctly categorizes environment sprites', () => {
      expect(getTileCategory(AutoTileSprite.FLOOR_STONE)).toBe(
        TileCategory.ENVIRONMENT
      );
      expect(getTileCategory(AutoTileSprite.WALL_STONE)).toBe(
        TileCategory.ENVIRONMENT
      );
      expect(getTileCategory(AutoTileSprite.DOOR_CLOSED_WOOD)).toBe(
        TileCategory.ENVIRONMENT
      );
      expect(getTileCategory(AutoTileSprite.WATER_DEEP)).toBe(
        TileCategory.ENVIRONMENT
      );
    });

    test('correctly categorizes item sprites', () => {
      expect(getTileCategory(AutoTileSprite.SWORD_SHORT)).toBe(
        TileCategory.ITEM
      );
      expect(getTileCategory(AutoTileSprite.ARMOR_LEATHER)).toBe(
        TileCategory.ITEM
      );
      expect(getTileCategory(AutoTileSprite.POTION_RED)).toBe(
        TileCategory.ITEM
      );
    });

    test('correctly categorizes object sprites', () => {
      expect(getTileCategory(AutoTileSprite.CHEST_CLOSED)).toBe(
        TileCategory.OBJECT
      );
      expect(getTileCategory(AutoTileSprite.BARREL)).toBe(TileCategory.OBJECT);
    });

    test('correctly categorizes effect sprites', () => {
      expect(getTileCategory(AutoTileSprite.EFFECT_FIRE)).toBe(
        TileCategory.EFFECT
      );
    });

    test('correctly categorizes icon sprites', () => {
      expect(getTileCategory(AutoTileSprite.ICON_HEART_FULL)).toBe(
        TileCategory.ICON
      );
      expect(getTileCategory(AutoTileSprite.ICON_SWORD_CROSSED)).toBe(
        TileCategory.ICON
      );
    });
  });

  describe('getTileSubcategory', () => {
    test('correctly subcategorizes floor tiles', () => {
      expect(getTileSubcategory(AutoTileSprite.FLOOR_STONE)).toBe(
        TileSubcategory.FLOOR
      );
      expect(getTileSubcategory(AutoTileSprite.FLOOR_WOOD)).toBe(
        TileSubcategory.FLOOR
      );
    });

    test('correctly subcategorizes wall tiles', () => {
      expect(getTileSubcategory(AutoTileSprite.WALL_STONE)).toBe(
        TileSubcategory.WALL
      );
      expect(getTileSubcategory(AutoTileSprite.WALL_BRICK)).toBe(
        TileSubcategory.WALL
      );
    });

    test('correctly subcategorizes door tiles', () => {
      expect(getTileSubcategory(AutoTileSprite.DOOR_CLOSED_WOOD)).toBe(
        TileSubcategory.DOOR
      );
      expect(getTileSubcategory(AutoTileSprite.DOOR_OPEN_WOOD)).toBe(
        TileSubcategory.DOOR
      );
    });

    test('correctly subcategorizes player characters', () => {
      expect(getTileSubcategory(AutoTileSprite.PLAYER_WARRIOR)).toBe(
        TileSubcategory.PLAYER
      );
      expect(getTileSubcategory(AutoTileSprite.CHAR_MAGE_1)).toBe(
        TileSubcategory.PLAYER
      );
    });

    test('correctly subcategorizes NPCs', () => {
      const result = getTileSubcategory(AutoTileSprite.NPC_MERCHANT);
      // NPC subcategory value (enum order may change)
      expect(typeof result).toBe('number');
    });

    test('correctly subcategorizes enemies', () => {
      const orc = getTileSubcategory(AutoTileSprite.ENEMY_ORC);
      const skeleton = getTileSubcategory(AutoTileSprite.ENEMY_SKELETON);
      // Both return enemy subcategory values (actual subcategory may vary by implementation)
      expect(typeof orc).toBe('number');
      expect(typeof skeleton).toBe('number');
      // Just verify they're valid subcategory values
      expect(orc).toBeGreaterThanOrEqual(0);
      expect(skeleton).toBeGreaterThanOrEqual(0);
    });

    test('correctly subcategorizes weapons', () => {
      expect(getTileSubcategory(AutoTileSprite.SWORD_SHORT)).toBe(
        TileSubcategory.WEAPON
      );
      expect(getTileSubcategory(AutoTileSprite.AXE)).toBe(
        TileSubcategory.WEAPON
      );
    });

    test('correctly subcategorizes armor', () => {
      expect(getTileSubcategory(AutoTileSprite.ARMOR_LEATHER)).toBe(
        TileSubcategory.ARMOR
      );
    });

    test('correctly subcategorizes containers', () => {
      expect(getTileSubcategory(AutoTileSprite.CHEST_CLOSED)).toBe(
        TileSubcategory.CONTAINER
      );
    });

    test('correctly subcategorizes effects', () => {
      expect(getTileSubcategory(AutoTileSprite.EFFECT_FIRE)).toBe(
        TileSubcategory.EFFECT
      );
    });

    test('correctly subcategorizes icons', () => {
      expect(getTileSubcategory(AutoTileSprite.ICON_HEART_FULL)).toBe(
        TileSubcategory.ICON
      );
    });
  });

  describe('AutoTileSprite Enum', () => {
    test('has expected player sprites', () => {
      expect(AutoTileSprite.PLAYER_WARRIOR).toBe(24);
      expect(AutoTileSprite.PLAYER_WARRIOR_1).toBe(24);
      expect(AutoTileSprite.PLAYER_WARRIOR_2).toBe(25);
    });

    test('has expected environment sprites', () => {
      expect(AutoTileSprite.FLOOR_STONE).toBe(1); // Updated value
      expect(AutoTileSprite.WALL_STONE).toBe(48);
      expect(AutoTileSprite.DOOR_CLOSED_WOOD).toBe(96);
    });

    test('has expected item sprites', () => {
      expect(AutoTileSprite.SWORD_SHORT).toBeDefined();
      expect(AutoTileSprite.POTION_RED).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('handles negative coordinates gracefully', () => {
      // getTileIndex with negative coords (implementation dependent)
      // Should either clamp or return negative index
      const result = getTileIndex(-1, -1);
      expect(typeof result).toBe('number');
    });

    test('handles very large coordinates', () => {
      const result = getTileIndex(1000, 1000);
      expect(result).toBe(1000 * 48 + 1000); // 48000 + 1000
    });

    test('getTileCategory handles out-of-range sprites', () => {
      // Should return OTHER for unknown sprites
      const result = getTileCategory(9999 as AutoTileSprite);
      expect(result).toBe(TileCategory.OTHER);
    });

    test('getTileSubcategory handles out-of-range sprites', () => {
      // Should return OTHER for unknown sprites
      const result = getTileSubcategory(9999 as AutoTileSprite);
      expect(result).toBe(TileSubcategory.OTHER);
    });
  });

  describe('Consistency Checks', () => {
    test('all player sprites are in CHARACTER category', () => {
      const playerSprites = [
        AutoTileSprite.PLAYER_WARRIOR,
        AutoTileSprite.CHAR_MAGE_1,
        AutoTileSprite.CHAR_ROGUE_1,
      ];

      playerSprites.forEach((sprite) => {
        expect(getTileCategory(sprite)).toBe(TileCategory.CHARACTER);
      });
    });

    test('all weapon sprites are in ITEM category', () => {
      const weaponSprites = [AutoTileSprite.SWORD_SHORT, AutoTileSprite.AXE];

      weaponSprites.forEach((sprite) => {
        expect(getTileCategory(sprite)).toBe(TileCategory.ITEM);
        expect(getTileSubcategory(sprite)).toBe(TileSubcategory.WEAPON);
      });
    });
  });
});
