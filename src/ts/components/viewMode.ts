/*
 * File: viewMode.ts
 * Project: littlejs-rl
 * File Created: Saturday, 16th November 2025 1:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Saturday, 16th November 2025 1:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * View Mode - Determines which view the player is currently in
 */
export enum ViewMode {
  /** Exploring a specific location (tile-based) */
  LOCATION = 'location',
  /** Viewing the world map (location grid) */
  WORLD_MAP = 'world_map',
}

/**
 * View Mode Component - Tracks which view mode the entity is in
 */
export interface ViewModeComponent {
  /** Current view mode */
  mode: ViewMode;
  /** World map cursor position (X) when in world map view */
  worldMapCursorX: number;
  /** World map cursor position (Y) when in world map view */
  worldMapCursorY: number;
}
