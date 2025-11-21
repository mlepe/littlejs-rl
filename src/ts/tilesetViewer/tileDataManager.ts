/*
 * File: tileDataManager.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 1:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 1:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { TileMetadata, SerializedTileData } from './tileMetadata';
import { TileCategory, TileSubcategory, AutoTileSprite } from '../tileConfig';

const STORAGE_KEY = 'littlejs-rl-tileset-viewer-data';
const DATA_VERSION = '1.0.0';

/**
 * Manages saving, loading, and exporting tile metadata
 */
export class TileDataManager {
  private tilesetWidth: number;
  private tilesetHeight: number;

  constructor(tilesetWidth: number, tilesetHeight: number) {
    this.tilesetWidth = tilesetWidth;
    this.tilesetHeight = tilesetHeight;
  }

  /**
   * Save tile data to localStorage
   */
  save(tileData: Map<number, TileMetadata>): void {
    const serialized: SerializedTileData = {
      version: DATA_VERSION,
      tilesetWidth: this.tilesetWidth,
      tilesetHeight: this.tilesetHeight,
      tiles: Object.fromEntries(tileData),
      lastModified: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
      console.log(
        `[TileDataManager] Saved ${tileData.size} tiles to localStorage`
      );
    } catch (error) {
      console.error('[TileDataManager] Failed to save:', error);
      alert('Failed to save tile data. Storage may be full.');
    }
  }

  /**
   * Load tile data from localStorage
   */
  load(): Map<number, TileMetadata> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        console.log('[TileDataManager] No saved data found');
        return new Map();
      }

      const data: SerializedTileData = JSON.parse(stored);

      // Version check
      if (data.version !== DATA_VERSION) {
        console.warn(
          `[TileDataManager] Data version mismatch (${data.version} vs ${DATA_VERSION})`
        );
      }

      const tileMap = new Map<number, TileMetadata>(
        Object.entries(data.tiles).map(([key, value]) => [parseInt(key), value])
      );

      console.log(
        `[TileDataManager] Loaded ${tileMap.size} tiles from localStorage`
      );
      return tileMap;
    } catch (error) {
      console.error('[TileDataManager] Failed to load:', error);
      return new Map();
    }
  }

  /**
   * Import tile data from existing AutoTileSprite enum
   * This seeds the database with already-documented tiles
   */
  importFromEnum(): Map<number, TileMetadata> {
    const tileMap = new Map<number, TileMetadata>();

    // Import all named sprites from AutoTileSprite enum
    for (const [name, index] of Object.entries(AutoTileSprite)) {
      if (typeof index === 'number') {
        tileMap.set(index, {
          index,
          name,
          categories: [],
          subcategories: [],
          notes: 'Imported from AutoTileSprite',
          isDocumented: true,
        });
      }
    }

    console.log(
      `[TileDataManager] Imported ${tileMap.size} tiles from AutoTileSprite enum`
    );
    return tileMap;
  }

  /**
   * Export tile data as TypeScript enum code
   */
  exportAsTypeScript(tileData: Map<number, TileMetadata>): string {
    let output = '';

    output += '// ============================================\n';
    output += '// AUTO-GENERATED TILE DEFINITIONS\n';
    output += `// Generated: ${new Date().toISOString()}\n`;
    output += `// Total tiles documented: ${tileData.size}\n`;
    output += '// ============================================\n\n';

    // Sort tiles by index
    const sortedTiles = Array.from(tileData.values()).sort(
      (a, b) => a.index - b.index
    );

    // Generate enum entries
    output += 'export enum CuratedTileSprite {\n';
    for (const tile of sortedTiles) {
      if (tile.isDocumented && tile.name) {
        output += `  ${tile.name} = ${tile.index},`;
        if (tile.notes) {
          output += ` // ${tile.notes}`;
        }
        output += '\n';
      }
    }
    output += '}\n\n';

    // Generate category mapping comments
    output += '// ============================================\n';
    output += '// CATEGORY MAPPINGS\n';
    output += '// ============================================\n\n';

    for (const category of Object.values(TileCategory).filter(
      (v) => typeof v === 'number'
    )) {
      const tilesInCategory = sortedTiles.filter((t) =>
        t.categories.includes(category as TileCategory)
      );

      if (tilesInCategory.length > 0) {
        output += `// ${TileCategory[category as number]}: ${tilesInCategory.length} tiles\n`;
        output += `// Indices: ${tilesInCategory.map((t) => t.index).join(', ')}\n\n`;
      }
    }

    return output;
  }

  /**
   * Export tile data as JSON for backup/sharing
   */
  exportAsJSON(tileData: Map<number, TileMetadata>): string {
    const serialized: SerializedTileData = {
      version: DATA_VERSION,
      tilesetWidth: this.tilesetWidth,
      tilesetHeight: this.tilesetHeight,
      tiles: Object.fromEntries(tileData),
      lastModified: new Date().toISOString(),
    };

    return JSON.stringify(serialized, null, 2);
  }

  /**
   * Download exported data as a file
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export and download as TypeScript file
   */
  exportAndDownloadTypeScript(tileData: Map<number, TileMetadata>): void {
    const code = this.exportAsTypeScript(tileData);
    this.downloadFile(code, 'tileConfig_generated.ts', 'text/typescript');
    console.log('[TileDataManager] Exported TypeScript file');
  }

  /**
   * Export and download as JSON file
   */
  exportAndDownloadJSON(tileData: Map<number, TileMetadata>): void {
    const json = this.exportAsJSON(tileData);
    this.downloadFile(json, 'tileset_data.json', 'application/json');
    console.log('[TileDataManager] Exported JSON file');
  }

  /**
   * Copy exported TypeScript to clipboard
   */
  async copyTypeScriptToClipboard(
    tileData: Map<number, TileMetadata>
  ): Promise<boolean> {
    try {
      const code = this.exportAsTypeScript(tileData);
      await navigator.clipboard.writeText(code);
      console.log('[TileDataManager] Copied TypeScript to clipboard');
      return true;
    } catch (error) {
      console.error('[TileDataManager] Failed to copy:', error);
      return false;
    }
  }

  /**
   * Import from JSON string
   */
  importFromJSON(jsonString: string): Map<number, TileMetadata> | null {
    try {
      const data: SerializedTileData = JSON.parse(jsonString);

      const tileMap = new Map<number, TileMetadata>(
        Object.entries(data.tiles).map(([key, value]) => [parseInt(key), value])
      );

      console.log(`[TileDataManager] Imported ${tileMap.size} tiles from JSON`);
      return tileMap;
    } catch (error) {
      console.error('[TileDataManager] Failed to import JSON:', error);
      return null;
    }
  }

  /**
   * Clear all saved data
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[TileDataManager] Cleared all saved data');
  }
}
