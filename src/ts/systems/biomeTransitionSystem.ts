/*
 * File: biomeTransitionSystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';
import {
  BiomeType,
  canTransitionBetweenBiomes,
  getBiomeConfig,
  blendBiomeEnvironments,
  getRandomFloorTile,
  getRandomWallTile,
} from '../biomeConfig';
import { AutoTileSprite } from '../tileConfig';

/**
 * Transition zone configuration
 */
export interface BiomeTransitionZone {
  /** Source biome */
  fromBiome: BiomeType;
  /** Target biome */
  toBiome: BiomeType;
  /** Transition width in tiles */
  transitionWidth: number;
  /** Transition blend curve ('linear' | 'smooth' | 'sharp') */
  blendCurve: 'linear' | 'smooth' | 'sharp';
}

/**
 * Calculate transition factor at a specific point
 * @param distance - Distance into transition zone (0 = start, transitionWidth = end)
 * @param transitionWidth - Total width of transition zone
 * @param curve - Blend curve type
 * @returns Transition factor (0 = from, 1 = to)
 */
export function calculateTransitionFactor(
  distance: number,
  transitionWidth: number,
  curve: 'linear' | 'smooth' | 'sharp' = 'smooth'
): number {
  // Clamp distance to valid range
  const t = Math.max(0, Math.min(1, distance / transitionWidth));

  switch (curve) {
    case 'linear':
      return t;

    case 'smooth':
      // Smoothstep function: 3t² - 2t³
      return t * t * (3 - 2 * t);

    case 'sharp':
      // Steep curve at edges
      return Math.pow(t, 2);

    default:
      return t;
  }
}

/**
 * Get blended tile for transition zone
 * @param fromBiome - Source biome
 * @param toBiome - Target biome
 * @param factor - Transition factor (0 = from, 1 = to)
 * @param tileType - Type of tile ('floor' | 'wall')
 * @returns Tile sprite to use
 */
export function getTransitionTile(
  fromBiome: BiomeType,
  toBiome: BiomeType,
  factor: number,
  tileType: 'floor' | 'wall'
): AutoTileSprite {
  // Use target biome tile if factor > 0.5, source otherwise
  const useToBiome = factor > 0.5;
  const biome = useToBiome ? toBiome : fromBiome;

  if (tileType === 'floor') {
    // Mix floor tiles randomly in transition zone
    if (factor > 0.3 && factor < 0.7) {
      // In middle of transition, randomly pick from either biome
      const useFrom = Math.random() > factor;
      return useFrom
        ? getRandomFloorTile(fromBiome)
        : getRandomFloorTile(toBiome);
    }
    return getRandomFloorTile(biome);
  } else {
    // Wall tiles use dominant biome
    return getRandomWallTile(biome);
  }
}

/**
 * Get blended color tint for transition zone
 * @param fromBiome - Source biome
 * @param toBiome - Target biome
 * @param factor - Transition factor (0 = from, 1 = to)
 * @param tintType - Type of tint ('floor' | 'wall' | 'water' | 'vegetation')
 * @returns Blended color
 */
export function getTransitionTint(
  fromBiome: BiomeType,
  toBiome: BiomeType,
  factor: number,
  tintType: 'floor' | 'wall' | 'water' | 'vegetation'
): LJS.Color | undefined {
  const fromConfig = getBiomeConfig(fromBiome);
  const toConfig = getBiomeConfig(toBiome);

  const fromTint = fromConfig.tint?.[tintType];
  const toTint = toConfig.tint?.[tintType];

  if (!fromTint && !toTint) return undefined;
  if (!fromTint) return toTint;
  if (!toTint) return fromTint;

  // Lerp between colors
  const r = fromTint.r + (toTint.r - fromTint.r) * factor;
  const g = fromTint.g + (toTint.g - fromTint.g) * factor;
  const b = fromTint.b + (toTint.b - fromTint.b) * factor;
  const a = fromTint.a + (toTint.a - fromTint.a) * factor;

  return new LJS.Color(r, g, b, a);
}

/**
 * Apply biome transition to a tile position
 * This function determines the appropriate tile and tint for a position in a transition zone
 * @param zone - Transition zone configuration
 * @param distanceIntoZone - Distance into the transition zone
 * @param tileType - Type of tile to get
 * @returns Object with tile sprite and optional tint color
 */
export function applyBiomeTransition(
  zone: BiomeTransitionZone,
  distanceIntoZone: number,
  tileType: 'floor' | 'wall'
): { tile: AutoTileSprite; tint?: LJS.Color } {
  const factor = calculateTransitionFactor(
    distanceIntoZone,
    zone.transitionWidth,
    zone.blendCurve
  );

  const tile = getTransitionTile(
    zone.fromBiome,
    zone.toBiome,
    factor,
    tileType
  );
  const tint = getTransitionTint(
    zone.fromBiome,
    zone.toBiome,
    factor,
    tileType
  );

  return { tile, tint };
}

/**
 * Create a transition zone between two adjacent locations
 * @param fromBiome - Source biome
 * @param toBiome - Target biome
 * @param transitionWidth - Width of transition in tiles (default: 5)
 * @param blendCurve - Blend curve type (default: 'smooth')
 * @returns Transition zone configuration or null if biomes can't transition
 */
export function createTransitionZone(
  fromBiome: BiomeType,
  toBiome: BiomeType,
  transitionWidth: number = 5,
  blendCurve: 'linear' | 'smooth' | 'sharp' = 'smooth'
): BiomeTransitionZone | null {
  if (!canTransitionBetweenBiomes(fromBiome, toBiome)) {
    return null;
  }

  return {
    fromBiome,
    toBiome,
    transitionWidth,
    blendCurve,
  };
}

/**
 * Calculate if a position is in a transition zone at location edge
 * @param x - X coordinate in location
 * @param y - Y coordinate in location
 * @param locationWidth - Width of location
 * @param locationHeight - Height of location
 * @param edgeTransitionWidth - Width of edge transition zone
 * @returns Object with inTransition flag and distance into zone
 */
export function getEdgeTransitionInfo(
  x: number,
  y: number,
  locationWidth: number,
  locationHeight: number,
  edgeTransitionWidth: number = 5
): {
  inTransition: boolean;
  edge: 'north' | 'south' | 'east' | 'west' | null;
  distance: number;
} {
  // Check distance from each edge
  const distFromNorth = y;
  const distFromSouth = locationHeight - 1 - y;
  const distFromWest = x;
  const distFromEast = locationWidth - 1 - x;

  // Find closest edge
  const minDist = Math.min(
    distFromNorth,
    distFromSouth,
    distFromWest,
    distFromEast
  );

  if (minDist >= edgeTransitionWidth) {
    return { inTransition: false, edge: null, distance: 0 };
  }

  let edge: 'north' | 'south' | 'east' | 'west';
  if (minDist === distFromNorth) edge = 'north';
  else if (minDist === distFromSouth) edge = 'south';
  else if (minDist === distFromWest) edge = 'west';
  else edge = 'east';

  return {
    inTransition: true,
    edge,
    distance: minDist,
  };
}

/**
 * Get blended environmental properties for a transition zone
 * @param zone - Transition zone configuration
 * @param distanceIntoZone - Distance into the transition zone
 * @returns Blended environmental properties
 */
export function getTransitionEnvironment(
  zone: BiomeTransitionZone,
  distanceIntoZone: number
) {
  const factor = calculateTransitionFactor(
    distanceIntoZone,
    zone.transitionWidth,
    zone.blendCurve
  );

  return blendBiomeEnvironments(zone.fromBiome, zone.toBiome, factor);
}
