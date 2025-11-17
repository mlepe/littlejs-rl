/*
 * File: colorPaletteExample.ts
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

import {
  BaseColor,
  ColorPaletteManager,
  getColor,
  setPalette,
} from '../colorPalette';

/**
 * Example: Using the color palette system
 *
 * This example demonstrates how to use base colors and switch between palettes.
 */

// Example 1: Basic color usage
function drawPlayer(pos: LJS.Vector2) {
  const playerColor = getColor(BaseColor.PLAYER);
  const size = LJS.vec2(1, 1);

  LJS.drawRect(pos, size, playerColor);
}

// Example 2: Drawing UI elements
function drawHealthBar(pos: LJS.Vector2, health: number, maxHealth: number) {
  const bgColor = getColor(BaseColor.BACKGROUND);
  const dangerColor = getColor(BaseColor.DANGER);
  const successColor = getColor(BaseColor.SUCCESS);

  // Background
  LJS.drawRect(pos, LJS.vec2(10, 1), bgColor);

  // Health bar
  const healthPercent = health / maxHealth;
  const barColor = healthPercent > 0.5 ? successColor : dangerColor;
  const barWidth = 10 * healthPercent;

  LJS.drawRect(
    LJS.vec2(pos.x - (10 - barWidth) / 2, pos.y),
    LJS.vec2(barWidth, 0.8),
    barColor
  );
}

// Example 3: Drawing environment tiles
function drawTile(
  pos: LJS.Vector2,
  tileType: 'floor' | 'wall' | 'water' | 'grass'
) {
  let color: LJS.Color;

  switch (tileType) {
    case 'floor':
      color = getColor(BaseColor.FLOOR);
      break;
    case 'wall':
      color = getColor(BaseColor.WALL);
      break;
    case 'water':
      color = getColor(BaseColor.WATER);
      break;
    case 'grass':
      color = getColor(BaseColor.GRASS);
      break;
  }

  LJS.drawRect(pos, LJS.vec2(1, 1), color);
}

// Example 4: Drawing text with proper colors
function drawMessage(
  pos: LJS.Vector2,
  message: string,
  type: 'info' | 'success' | 'warning' | 'danger'
) {
  let color: LJS.Color;

  switch (type) {
    case 'info':
      color = getColor(BaseColor.INFO);
      break;
    case 'success':
      color = getColor(BaseColor.SUCCESS);
      break;
    case 'warning':
      color = getColor(BaseColor.WARNING);
      break;
    case 'danger':
      color = getColor(BaseColor.DANGER);
      break;
  }

  LJS.drawTextScreen(message, pos, 16, color, 1, getColor(BaseColor.SHADOW));
}

// Example 5: Switching palettes
function switchToVibrantMode() {
  setPalette('vibrant');
  console.log('Switched to vibrant color palette');
}

function switchToRetroMode() {
  setPalette('retro');
  console.log('Switched to retro color palette');
}

function switchToMonochromeMode() {
  setPalette('monochrome');
  console.log('Switched to monochrome color palette');
}

// Example 6: Listing available palettes
function listPalettes() {
  const manager = ColorPaletteManager.getInstance();
  const palettes = manager.getAvailablePalettes();

  console.log('Available palettes:');
  for (const palette of palettes) {
    console.log(`  - ${palette}`);
  }

  console.log(`Current palette: ${manager.getCurrentPaletteName()}`);
}

// Example 7: Creating a custom palette
function createCustomPalette() {
  const manager = ColorPaletteManager.getInstance();

  const customColors = new Map([
    [BaseColor.PLAYER, LJS.rgb(0.0, 1.0, 0.5)], // Mint green
    [BaseColor.ENEMY, LJS.rgb(0.8, 0.0, 0.4)], // Dark pink
    [BaseColor.FLOOR, LJS.rgb(0.2, 0.1, 0.3)], // Dark purple
    [BaseColor.WALL, LJS.rgb(0.6, 0.5, 0.7)], // Light purple
    // ... add more colors
  ]);

  manager.registerPalette('custom', {
    name: 'Custom',
    colors: customColors,
  });

  setPalette('custom');
}

// Example 8: Complete game rendering using palette
function gameRenderExample() {
  // Draw floor tiles
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      drawTile(LJS.vec2(x, y), 'floor');
    }
  }

  // Draw walls
  for (let x = 0; x < 10; x++) {
    drawTile(LJS.vec2(x, 0), 'wall');
    drawTile(LJS.vec2(x, 9), 'wall');
  }

  // Draw player
  drawPlayer(LJS.vec2(5, 5));

  // Draw UI
  drawHealthBar(LJS.vec2(5, 1), 75, 100);
  drawMessage(LJS.vec2(5, 8), 'Welcome!', 'info');
}

// Export examples for use in other modules
export {
  drawPlayer,
  drawHealthBar,
  drawTile,
  drawMessage,
  switchToVibrantMode,
  switchToRetroMode,
  switchToMonochromeMode,
  listPalettes,
  createCustomPalette,
  gameRenderExample,
};
