/*
 * File: examineRenderSystem.ts
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

import { ExamineData } from './examineSystem';
import { BaseColor, getColor } from '../colorPalette';

/**
 * Examine Render System - Renders the examine cursor and information panel
 *
 * Displays:
 * - Highlighted cursor at the examined position
 * - Tile name overlay near cursor
 * - Information panel at bottom of screen with entity details
 *
 * @param cursorX - X coordinate of examine cursor
 * @param cursorY - Y coordinate of examine cursor
 * @param examineData - Data about the examined position (or null if invalid)
 *
 * @example
 * ```typescript
 * function gameRenderPost() {
 *   if (viewMode === ViewMode.EXAMINE) {
 *     const data = examineSystem(ecs, cursorX, cursorY);
 *     examineRenderSystem(cursorX, cursorY, data);
 *   }
 * }
 * ```
 */
export function examineRenderSystem(
  cursorX: number,
  cursorY: number,
  examineData: ExamineData | null
): void {
  // Drawn in renderPost() phase, so automatically appears above everything
  // Draw cursor highlight (yellow square)
  const cursorPos = LJS.vec2(cursorX + 0.5, cursorY + 0.5);
  const cursorSize = LJS.vec2(1, 1);
  const cursorColor = getColor(BaseColor.YELLOW, 0.5); // Yellow, semi-transparent

  // Draw filled square for cursor background
  LJS.drawRect(cursorPos, cursorSize, cursorColor);

  // Draw cursor border by drawing 4 thin rectangles (brighter yellow)
  const borderColor = getColor(BaseColor.HIGHLIGHT);
  const borderWidth = 0.05;
  // Top border
  LJS.drawRect(
    LJS.vec2(cursorX + 0.5, cursorY + 1 - borderWidth / 2),
    LJS.vec2(1, borderWidth),
    borderColor
  );
  // Bottom border
  LJS.drawRect(
    LJS.vec2(cursorX + 0.5, cursorY + borderWidth / 2),
    LJS.vec2(1, borderWidth),
    borderColor
  );
  // Left border
  LJS.drawRect(
    LJS.vec2(cursorX + borderWidth / 2, cursorY + 0.5),
    LJS.vec2(borderWidth, 1),
    borderColor
  );
  // Right border
  LJS.drawRect(
    LJS.vec2(cursorX + 1 - borderWidth / 2, cursorY + 0.5),
    LJS.vec2(borderWidth, 1),
    borderColor
  );

  // If no examine data, just show cursor
  if (!examineData) {
    return;
  }

  // Draw tile name near cursor (world coordinates)
  const labelOffset = LJS.vec2(0, 1.2); // Slightly above the cursor
  const labelPos = cursorPos.add(labelOffset);
  LJS.drawText(
    examineData.tileName,
    labelPos,
    0.3,
    getColor(BaseColor.WHITE),
    2,
    getColor(BaseColor.BLACK),
    'center'
  );

  // Draw information panel at bottom of screen (screen coordinates)
  // Note: LittleJS doesn't have drawRectScreen, so we draw text only
  const screenWidth = LJS.mainCanvas.width;
  const screenHeight = LJS.mainCanvas.height;
  const panelHeight = 120;
  const panelY = screenHeight - panelHeight;

  // Draw tile info
  let textY = panelY + 15;
  const textX = 20;
  const lineHeight = 20;

  LJS.drawTextScreen(
    `Tile: ${examineData.tileName}`,
    LJS.vec2(textX, textY),
    18,
    getColor(BaseColor.WHITE),
    2,
    getColor(BaseColor.BLACK),
    'left'
  );
  textY += lineHeight;

  LJS.drawTextScreen(
    examineData.tileDescription,
    LJS.vec2(textX, textY),
    14,
    getColor(BaseColor.LIGHT_GRAY),
    1,
    getColor(BaseColor.BLACK),
    'left'
  );
  textY += lineHeight + 5;

  // Draw entities
  if (examineData.entities.length > 0) {
    LJS.drawTextScreen(
      'Entities:',
      LJS.vec2(textX, textY),
      16,
      getColor(BaseColor.HIGHLIGHT),
      2,
      getColor(BaseColor.BLACK),
      'left'
    );
    textY += lineHeight;

    for (const entity of examineData.entities) {
      // Color code by entity type
      let entityColor = getColor(BaseColor.WHITE);
      if (entity.type === 'player') {
        entityColor = getColor(BaseColor.GREEN); // Green for player
      } else if (entity.type === 'enemy') {
        entityColor = getColor(BaseColor.RED); // Red for enemies
      } else if (entity.type === 'item') {
        entityColor = getColor(BaseColor.CYAN); // Light blue for items
      } else if (entity.type === 'npc') {
        entityColor = getColor(BaseColor.YELLOW); // Yellow for NPCs
      }

      LJS.drawTextScreen(
        `  • ${entity.name}`,
        LJS.vec2(textX + 10, textY),
        14,
        entityColor,
        1.5,
        getColor(BaseColor.BLACK),
        'left'
      );
      textY += lineHeight;

      // Draw details if available
      if (entity.details) {
        LJS.drawTextScreen(
          `    ${entity.details}`,
          LJS.vec2(textX + 20, textY),
          12,
          getColor(BaseColor.LIGHT_GRAY),
          1,
          getColor(BaseColor.BLACK),
          'left'
        );
        textY += lineHeight - 5;
      }
    }
  } else {
    LJS.drawTextScreen(
      'No entities here.',
      LJS.vec2(textX, textY),
      14,
      getColor(BaseColor.LIGHT_GRAY),
      1,
      getColor(BaseColor.BLACK),
      'left'
    );
  }

  // Draw help text at top right
  const helpText = 'Press L to exit examine mode';
  LJS.drawTextScreen(
    helpText,
    LJS.vec2(screenWidth - 20, 20),
    14,
    getColor(BaseColor.HIGHLIGHT),
    1.5,
    getColor(BaseColor.BLACK),
    'right'
  );
}
