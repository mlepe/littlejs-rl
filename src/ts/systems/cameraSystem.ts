/*
 * File: cameraSystem.ts
 * Project: littlejs-rl
 * File Created: Friday, 15th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Friday, 15th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import { InputComponent, PositionComponent } from '../components';

import ECS from '../ecs';

/**
 * Camera zoom levels configuration
 */
const ZOOM_MIN = 10.0; // Maximum zoom out (see more of the map)
const ZOOM_MAX = 35.0; // Maximum zoom in (see less, bigger tiles)
const ZOOM_DEFAULT = 25.0; // Default zoom level
const ZOOM_STEP = 10.0; // How much to zoom per input

/**
 * Current camera zoom level
 * Stored as module-level state since camera is global
 */
let currentZoom = ZOOM_DEFAULT;

/**
 * Camera System - Handles camera positioning and zoom
 *
 * This system:
 * 1. Follows the player entity (centers camera on player position)
 * 2. Handles zoom in/out based on input
 * 3. Clamps zoom to min/max bounds
 *
 * Should be called after inputSystem and playerMovementSystem in the update loop.
 *
 * @param ecs - The ECS instance
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   inputSystem(ecs);
 *   playerMovementSystem(ecs);
 *   cameraSystem(ecs); // Update camera after movement
 *   aiSystem(ecs, playerId);
 * }
 * ```
 */
export function cameraSystem(ecs: ECS): void {
  const playerEntities = ecs.query('player', 'position', 'input');

  for (const entityId of playerEntities) {
    const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
    const input = ecs.getComponent<InputComponent>(entityId, 'input');

    if (!pos || !input) continue;

    // Handle zoom input
    if (input.zoom) {
            currentZoom = (currentZoom >= ZOOM_MAX) ? ZOOM_MIN : currentZoom + ZOOM_STEP;       
    }

    // Apply zoom to camera
    LJS.setCameraScale(currentZoom);

    // Center camera on player
    LJS.setCameraPos(LJS.vec2(pos.x, pos.y));
  }
}

/**
 * Get current camera zoom level
 * @returns Current zoom level
 */
export function getCameraZoom(): number {
  return currentZoom;
}

/**
 * Set camera zoom level directly
 * @param zoom - New zoom level (will be clamped to min/max)
 */
export function setCameraZoom(zoom: number): void {
  currentZoom = Math.max(ZOOM_MIN, Math.min(zoom, ZOOM_MAX));
  LJS.setCameraScale(currentZoom);
}

/**
 * Reset camera zoom to default
 */
export function resetCameraZoom(): void {
  currentZoom = ZOOM_DEFAULT;
  LJS.setCameraScale(currentZoom);
}
