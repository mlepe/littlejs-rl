/*
 * File: colorPalette.ts
 * Project: littlejs-rl
 * File Created: Sunday, 17th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 17th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

/**
 * Create a LittleJS Color from standard RGB(A) values (0-255, 0-255, 0-255, 0-1)
 * This function allows IDEs to show color previews for the RGB values
 *
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @param a - Alpha channel (0-1, default: 1)
 * @returns LittleJS Color object
 *
 * @example
 * ```typescript
 * const red = rgba(255, 0, 0);        // Bright red
 * const blue = rgba(0, 0, 255, 0.5);  // Semi-transparent blue
 * const gold = rgba(255, 204, 0);     // Gold
 * ```
 */
export function rgba(
  r: number,
  g: number,
  b: number,
  a: number = 1
): LJS.Color {
  return new LJS.Color(r / 255, g / 255, b / 255, a);
}

/**
 * Base color names used throughout the game
 * These are semantic names that map to actual colors via palettes
 */
export enum BaseColor {
  // UI Colors
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ACCENT = 'accent',
  BACKGROUND = 'background',
  TEXT = 'text',

  // State Colors
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info',

  // Entity Colors
  PLAYER = 'player',
  ENEMY = 'enemy',
  NPC = 'npc',
  ITEM = 'item',

  // Environment Colors
  FLOOR = 'floor',
  WALL = 'wall',
  WATER = 'water',
  GRASS = 'grass',
  LAVA = 'lava',

  // Special Colors
  HIGHLIGHT = 'highlight',
  SHADOW = 'shadow',
  DISABLED = 'disabled',
}

/**
 * Color palette definition
 * Maps base color names to actual LittleJS Color objects
 */
export interface ColorPalette {
  readonly name: string;
  readonly colors: Map<BaseColor, LJS.Color>;
}

/**
 * Default color palette (classic roguelike)
 */
const defaultPalette: ColorPalette = {
  name: 'Default',
  colors: new Map<BaseColor, LJS.Color>([
    // UI Colors
    [BaseColor.PRIMARY, rgba(51, 153, 255)], // Blue
    [BaseColor.SECONDARY, rgba(128, 128, 128)], // Gray
    [BaseColor.ACCENT, rgba(255, 204, 0)], // Gold
    [BaseColor.BACKGROUND, rgba(26, 26, 26)], // Dark gray
    [BaseColor.TEXT, rgba(255, 255, 255)], // White

    // State Colors
    [BaseColor.SUCCESS, rgba(51, 255, 51)], // Green
    [BaseColor.WARNING, rgba(255, 204, 0)], // Yellow
    [BaseColor.DANGER, rgba(255, 51, 51)], // Red
    [BaseColor.INFO, rgba(102, 204, 255)], // Light blue

    // Entity Colors
    [BaseColor.PLAYER, rgba(255, 255, 0)], // Yellow
    [BaseColor.ENEMY, rgba(255, 51, 51)], // Red
    [BaseColor.NPC, rgba(102, 204, 255)], // Light blue
    [BaseColor.ITEM, rgba(204, 153, 255)], // Purple

    // Environment Colors
    [BaseColor.FLOOR, rgba(77, 77, 77)], // Dark gray
    [BaseColor.WALL, rgba(128, 102, 77)], // Brown
    [BaseColor.WATER, rgba(51, 102, 204)], // Blue
    [BaseColor.GRASS, rgba(51, 204, 51)], // Green
    [BaseColor.LAVA, rgba(255, 77, 0)], // Orange-red

    // Special Colors
    [BaseColor.HIGHLIGHT, rgba(255, 255, 0)], // Yellow
    [BaseColor.SHADOW, rgba(0, 0, 0)], // Black
    [BaseColor.DISABLED, rgba(102, 102, 102)], // Medium gray
  ]),
};

/**
 * Vibrant color palette (bright, saturated colors)
 */
const vibrantPalette: ColorPalette = {
  name: 'Vibrant',
  colors: new Map<BaseColor, LJS.Color>([
    // UI Colors
    [BaseColor.PRIMARY, rgba(0, 204, 255)], // Cyan
    [BaseColor.SECONDARY, rgba(255, 0, 204)], // Magenta
    [BaseColor.ACCENT, rgba(255, 255, 0)], // Bright yellow
    [BaseColor.BACKGROUND, rgba(13, 13, 51)], // Dark blue
    [BaseColor.TEXT, rgba(255, 255, 255)], // White

    // State Colors
    [BaseColor.SUCCESS, rgba(0, 255, 0)], // Bright green
    [BaseColor.WARNING, rgba(255, 179, 0)], // Orange
    [BaseColor.DANGER, rgba(255, 0, 51)], // Bright red
    [BaseColor.INFO, rgba(0, 255, 255)], // Cyan

    // Entity Colors
    [BaseColor.PLAYER, rgba(255, 0, 255)], // Magenta
    [BaseColor.ENEMY, rgba(255, 0, 0)], // Red
    [BaseColor.NPC, rgba(0, 255, 255)], // Cyan
    [BaseColor.ITEM, rgba(255, 128, 255)], // Pink

    // Environment Colors
    [BaseColor.FLOOR, rgba(51, 51, 102)], // Dark blue-gray
    [BaseColor.WALL, rgba(153, 77, 204)], // Purple
    [BaseColor.WATER, rgba(0, 153, 255)], // Bright blue
    [BaseColor.GRASS, rgba(0, 255, 77)], // Lime green
    [BaseColor.LAVA, rgba(255, 51, 0)], // Bright orange

    // Special Colors
    [BaseColor.HIGHLIGHT, rgba(255, 255, 0)], // Yellow
    [BaseColor.SHADOW, rgba(26, 0, 51)], // Dark purple
    [BaseColor.DISABLED, rgba(77, 77, 128)], // Blue-gray
  ]),
};

/**
 * Monochrome color palette (grayscale)
 */
const monochromePalette: ColorPalette = {
  name: 'Monochrome',
  colors: new Map<BaseColor, LJS.Color>([
    // UI Colors
    [BaseColor.PRIMARY, rgba(204, 204, 204)], // Light gray
    [BaseColor.SECONDARY, rgba(128, 128, 128)], // Medium gray
    [BaseColor.ACCENT, rgba(255, 255, 255)], // White
    [BaseColor.BACKGROUND, rgba(0, 0, 0)], // Black
    [BaseColor.TEXT, rgba(255, 255, 255)], // White

    // State Colors
    [BaseColor.SUCCESS, rgba(230, 230, 230)], // Very light gray
    [BaseColor.WARNING, rgba(179, 179, 179)], // Light gray
    [BaseColor.DANGER, rgba(77, 77, 77)], // Dark gray
    [BaseColor.INFO, rgba(153, 153, 153)], // Medium-light gray

    // Entity Colors
    [BaseColor.PLAYER, rgba(255, 255, 255)], // White
    [BaseColor.ENEMY, rgba(51, 51, 51)], // Very dark gray
    [BaseColor.NPC, rgba(179, 179, 179)], // Light gray
    [BaseColor.ITEM, rgba(204, 204, 204)], // Light gray

    // Environment Colors
    [BaseColor.FLOOR, rgba(77, 77, 77)], // Dark gray
    [BaseColor.WALL, rgba(128, 128, 128)], // Medium gray
    [BaseColor.WATER, rgba(51, 51, 51)], // Very dark gray
    [BaseColor.GRASS, rgba(102, 102, 102)], // Medium-dark gray
    [BaseColor.LAVA, rgba(153, 153, 153)], // Medium-light gray

    // Special Colors
    [BaseColor.HIGHLIGHT, rgba(255, 255, 255)], // White
    [BaseColor.SHADOW, rgba(0, 0, 0)], // Black
    [BaseColor.DISABLED, rgba(102, 102, 102)], // Medium-dark gray
  ]),
};

/**
 * Retro color palette (CGA-inspired)
 */
const retroPalette: ColorPalette = {
  name: 'Retro',
  colors: new Map<BaseColor, LJS.Color>([
    // UI Colors (CGA palette)
    [BaseColor.PRIMARY, rgba(85, 255, 255)], // Cyan
    [BaseColor.SECONDARY, rgba(255, 85, 255)], // Magenta
    [BaseColor.ACCENT, rgba(255, 255, 85)], // Yellow
    [BaseColor.BACKGROUND, rgba(0, 0, 0)], // Black
    [BaseColor.TEXT, rgba(255, 255, 255)], // White

    // State Colors
    [BaseColor.SUCCESS, rgba(85, 255, 85)], // Green
    [BaseColor.WARNING, rgba(255, 255, 85)], // Yellow
    [BaseColor.DANGER, rgba(255, 85, 85)], // Red
    [BaseColor.INFO, rgba(85, 85, 255)], // Blue

    // Entity Colors
    [BaseColor.PLAYER, rgba(255, 255, 255)], // White
    [BaseColor.ENEMY, rgba(255, 85, 85)], // Red
    [BaseColor.NPC, rgba(85, 255, 255)], // Cyan
    [BaseColor.ITEM, rgba(255, 85, 255)], // Magenta

    // Environment Colors
    [BaseColor.FLOOR, rgba(85, 85, 85)], // Dark gray
    [BaseColor.WALL, rgba(171, 85, 0)], // Brown
    [BaseColor.WATER, rgba(85, 85, 255)], // Blue
    [BaseColor.GRASS, rgba(85, 255, 85)], // Green
    [BaseColor.LAVA, rgba(255, 171, 0)], // Orange

    // Special Colors
    [BaseColor.HIGHLIGHT, rgba(255, 255, 255)], // White
    [BaseColor.SHADOW, rgba(0, 0, 0)], // Black
    [BaseColor.DISABLED, rgba(85, 85, 85)], // Dark gray
  ]),
};

/**
 * Color palette manager
 * Handles switching between palettes and retrieving colors
 */
export class ColorPaletteManager {
  private static instance: ColorPaletteManager | null = null;

  private readonly palettes: Map<string, ColorPalette>;
  private currentPalette: ColorPalette;

  private constructor() {
    this.palettes = new Map([
      ['default', defaultPalette],
      ['vibrant', vibrantPalette],
      ['monochrome', monochromePalette],
      ['retro', retroPalette],
    ]);

    this.currentPalette = defaultPalette;
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ColorPaletteManager {
    ColorPaletteManager.instance ??= new ColorPaletteManager();
    return ColorPaletteManager.instance;
  }

  /**
   * Get color from current palette
   * @param baseColor - The semantic color name
   * @returns LittleJS Color object
   */
  getColor(baseColor: BaseColor): LJS.Color {
    const color = this.currentPalette.colors.get(baseColor);
    if (!color) {
      console.warn(`Color not found: ${baseColor}, using white`);
      return new LJS.Color(1, 1, 1, 1);
    }
    return color;
  }

  /**
   * Switch to a different palette
   * @param paletteName - Name of the palette to switch to
   * @returns True if palette was found and switched
   */
  setPalette(paletteName: string): boolean {
    const palette = this.palettes.get(paletteName.toLowerCase());
    if (palette) {
      this.currentPalette = palette;
      console.log(`Switched to palette: ${palette.name}`);
      return true;
    }
    console.warn(`Palette not found: ${paletteName}`);
    return false;
  }

  /**
   * Get current palette name
   */
  getCurrentPaletteName(): string {
    return this.currentPalette.name;
  }

  /**
   * Get list of available palette names
   */
  getAvailablePalettes(): string[] {
    return Array.from(this.palettes.keys());
  }

  /**
   * Register a custom palette
   * @param key - Unique key for the palette
   * @param palette - The palette definition
   */
  registerPalette(key: string, palette: ColorPalette): void {
    this.palettes.set(key.toLowerCase(), palette);
    console.log(`Registered palette: ${palette.name}`);
  }
}

/**
 * Convenience function to get a color from the current palette
 * @param baseColor - The semantic color name
 * @returns LittleJS Color object
 */
export function getColor(baseColor: BaseColor): LJS.Color {
  return ColorPaletteManager.getInstance().getColor(baseColor);
}

/**
 * Convenience function to set the active palette
 * @param paletteName - Name of the palette to activate
 */
export function setPalette(paletteName: string): boolean {
  return ColorPaletteManager.getInstance().setPalette(paletteName);
}
