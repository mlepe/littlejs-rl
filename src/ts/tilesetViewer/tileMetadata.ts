/*
 * File: tileMetadata.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 1:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 1:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { TileCategory, TileSubcategory } from '../tileConfig';

/**
 * Metadata for a single tile in the tileset
 */
export interface TileMetadata {
  /** Tile index in the tileset */
  index: number;

  /** Enum-style name (e.g., "FLOOR_COBBLESTONE") */
  name: string;

  /** Category flags for this tile */
  categories: TileCategory[];

  /** Subcategory flags for this tile */
  subcategories: TileSubcategory[];

  /** Optional notes about the tile */
  notes?: string;

  /** Whether this tile has been documented */
  isDocumented: boolean;
}

/**
 * Serializable version of tile metadata for storage
 */
export interface SerializedTileData {
  version: string;
  tilesetWidth: number;
  tilesetHeight: number;
  tiles: Record<number, TileMetadata>;
  lastModified: string;
}
