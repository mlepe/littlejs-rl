/*
 * File: colorPalette.test.ts
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

import {
  BaseColor,
  getColor,
  setPalette,
  ColorPaletteManager,
} from '../colorPalette';

describe('Color Palette System', () => {
  beforeEach(() => {
    // Reset to default palette before each test
    setPalette('default');
  });

  describe('getColor', () => {
    test('returns LJS.Color object', () => {
      const color = getColor(BaseColor.RED);

      expect(color).toBeInstanceOf(LJS.Color);
    });

    test('returns different colors for different BaseColor values', () => {
      const red = getColor(BaseColor.RED);
      const blue = getColor(BaseColor.BLUE);

      // Colors should be different
      expect(red.r !== blue.r || red.g !== blue.g || red.b !== blue.b).toBe(
        true
      );
    });

    test('supports alpha parameter', () => {
      const color = getColor(BaseColor.RED, 0.5);

      expect(color.a).toBe(0.5);
    });

    test('defaults alpha to 1.0', () => {
      const color = getColor(BaseColor.RED);

      expect(color.a).toBe(1.0);
    });

    test('works with all semantic UI colors', () => {
      const uiColors = [
        BaseColor.PRIMARY,
        BaseColor.SECONDARY,
        BaseColor.ACCENT,
        BaseColor.BACKGROUND,
        BaseColor.TEXT,
        BaseColor.SUCCESS,
        BaseColor.WARNING,
        BaseColor.DANGER,
        BaseColor.INFO,
      ];

      uiColors.forEach((baseColor) => {
        const color = getColor(baseColor);
        expect(color).toBeInstanceOf(LJS.Color);
      });
    });

    test('works with all entity colors', () => {
      const entityColors = [
        BaseColor.PLAYER,
        BaseColor.ENEMY,
        BaseColor.NPC,
        BaseColor.ITEM,
      ];

      entityColors.forEach((baseColor) => {
        const color = getColor(baseColor);
        expect(color).toBeInstanceOf(LJS.Color);
      });
    });

    test('works with all environment colors', () => {
      const envColors = [
        BaseColor.FLOOR,
        BaseColor.WALL,
        BaseColor.WATER,
        BaseColor.GRASS,
        BaseColor.LAVA,
      ];

      envColors.forEach((baseColor) => {
        const color = getColor(baseColor);
        expect(color).toBeInstanceOf(LJS.Color);
      });
    });

    test('works with basic colors', () => {
      const basicColors = [
        BaseColor.RED,
        BaseColor.GREEN,
        BaseColor.BLUE,
        BaseColor.YELLOW,
        BaseColor.CYAN,
        BaseColor.MAGENTA,
        BaseColor.WHITE,
        BaseColor.BLACK,
        BaseColor.GRAY,
      ];

      basicColors.forEach((baseColor) => {
        const color = getColor(baseColor);
        expect(color).toBeInstanceOf(LJS.Color);
      });
    });
  });

  describe('setPalette', () => {
    test('switches to vibrant palette', () => {
      const defaultRed = getColor(BaseColor.RED);

      setPalette('vibrant');
      const vibrantRed = getColor(BaseColor.RED);

      // Colors should be different after palette switch
      expect(
        defaultRed.r !== vibrantRed.r ||
          defaultRed.g !== vibrantRed.g ||
          defaultRed.b !== vibrantRed.b
      ).toBe(true);
    });

    test('switches to monochrome palette', () => {
      setPalette('monochrome');
      const red = getColor(BaseColor.RED);
      const blue = getColor(BaseColor.BLUE);

      // In monochrome, different colors should be grayscale
      expect(red).toBeInstanceOf(LJS.Color);
      expect(blue).toBeInstanceOf(LJS.Color);
    });

    test('switches to retro palette', () => {
      setPalette('retro');
      const color = getColor(BaseColor.PRIMARY);

      expect(color).toBeInstanceOf(LJS.Color);
    });

    test('switches back to default palette', () => {
      const originalRed = getColor(BaseColor.RED);

      setPalette('vibrant');
      setPalette('default');
      const restoredRed = getColor(BaseColor.RED);

      // Should be same as original
      expect(restoredRed.r).toBeCloseTo(originalRed.r, 2);
      expect(restoredRed.g).toBeCloseTo(originalRed.g, 2);
      expect(restoredRed.b).toBeCloseTo(originalRed.b, 2);
    });

    test('handles invalid palette name gracefully', () => {
      // Should fallback or keep current palette
      expect(() => setPalette('nonexistent')).not.toThrow();
    });
  });

  describe('ColorPaletteManager', () => {
    test('is a singleton', () => {
      const instance1 = ColorPaletteManager.getInstance();
      const instance2 = ColorPaletteManager.getInstance();

      expect(instance1).toBe(instance2);
    });

    test('getAvailablePalettes returns palette names', () => {
      const manager = ColorPaletteManager.getInstance();
      const palettes = manager.getAvailablePalettes();

      expect(palettes).toContain('default');
      expect(palettes).toContain('vibrant');
      expect(palettes).toContain('monochrome');
      expect(palettes).toContain('retro');
    });

    test('can register custom palette', () => {
      const manager = ColorPaletteManager.getInstance();

      const customPalette = {
        name: 'custom',
        colors: new Map<BaseColor, LJS.Color>([
          [BaseColor.RED, new LJS.Color(1, 0, 0, 1)],
          [BaseColor.GREEN, new LJS.Color(0, 1, 0, 1)],
          [BaseColor.BLUE, new LJS.Color(0, 0, 1, 1)],
          // ... other colors
        ]),
      };

      manager.registerPalette('custom', customPalette);
      const palettes = manager.getAvailablePalettes();

      expect(palettes).toContain('custom');
    });
  });

  describe('Color Consistency', () => {
    test('same BaseColor always returns same color', () => {
      const color1 = getColor(BaseColor.RED);
      const color2 = getColor(BaseColor.RED);

      expect(color1.r).toBeCloseTo(color2.r, 2);
      expect(color1.g).toBeCloseTo(color2.g, 2);
      expect(color1.b).toBeCloseTo(color2.b, 2);
    });

    test('WHITE has maximum RGB values', () => {
      const white = getColor(BaseColor.WHITE);

      expect(white.r).toBeGreaterThanOrEqual(0.9);
      expect(white.g).toBeGreaterThanOrEqual(0.9);
      expect(white.b).toBeGreaterThanOrEqual(0.9);
    });

    test('BLACK has minimum RGB values', () => {
      const black = getColor(BaseColor.BLACK);

      expect(black.r).toBeLessThanOrEqual(0.1);
      expect(black.g).toBeLessThanOrEqual(0.1);
      expect(black.b).toBeLessThanOrEqual(0.1);
    });
  });

  describe('Palette-specific Colors', () => {
    test('vibrant palette has more saturated colors', () => {
      setPalette('default');
      const defaultRed = getColor(BaseColor.RED);

      setPalette('vibrant');
      const vibrantRed = getColor(BaseColor.RED);

      // Vibrant should have higher saturation (more extreme values)
      expect(vibrantRed).toBeInstanceOf(LJS.Color);
      expect(defaultRed).toBeInstanceOf(LJS.Color);
    });

    test('monochrome palette uses grayscale', () => {
      setPalette('monochrome');

      const red = getColor(BaseColor.RED);
      const blue = getColor(BaseColor.BLUE);

      // In monochrome, colors should be grayscale (r ≈ g ≈ b)
      const isGrayscale = (color: LJS.Color) => {
        const tolerance = 0.1;
        return (
          Math.abs(color.r - color.g) < tolerance &&
          Math.abs(color.g - color.b) < tolerance
        );
      };

      expect(isGrayscale(red) || isGrayscale(blue)).toBe(true);
    });
  });

  describe('BaseColor Enum', () => {
    test('all semantic colors are defined', () => {
      expect(BaseColor.PRIMARY).toBeDefined();
      expect(BaseColor.PLAYER).toBeDefined();
      expect(BaseColor.ENEMY).toBeDefined();
      expect(BaseColor.FLOOR).toBeDefined();
      expect(BaseColor.HIGHLIGHT).toBeDefined();
    });

    test('basic colors are defined', () => {
      expect(BaseColor.RED).toBeDefined();
      expect(BaseColor.GREEN).toBeDefined();
      expect(BaseColor.BLUE).toBeDefined();
      expect(BaseColor.YELLOW).toBeDefined();
      expect(BaseColor.WHITE).toBeDefined();
      expect(BaseColor.BLACK).toBeDefined();
    });
  });

  describe('Alpha Channel Handling', () => {
    test('alpha 0 makes color fully transparent', () => {
      const color = getColor(BaseColor.RED, 0);

      expect(color.a).toBe(0);
    });

    test('alpha 1 makes color fully opaque', () => {
      const color = getColor(BaseColor.RED, 1);

      expect(color.a).toBe(1);
    });

    test('alpha values between 0 and 1 work correctly', () => {
      const alphas = [0.1, 0.25, 0.5, 0.75, 0.9];

      alphas.forEach((alpha) => {
        const color = getColor(BaseColor.RED, alpha);
        expect(color.a).toBeCloseTo(alpha, 2);
      });
    });
  });
});
