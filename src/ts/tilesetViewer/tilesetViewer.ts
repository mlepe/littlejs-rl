/*
 * File: tilesetViewer.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 1:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 1:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';
import { TileMetadata } from './tileMetadata';
import { TileDataManager } from './tileDataManager';
import {
  getTileCoords,
  getTileIndex,
  resolveTileInfo,
  TileCategory,
  TileSubcategory,
} from '../tileConfig';

/**
 * Interactive tileset viewer for documenting tiles
 * Dev-mode only tool for completing tile configuration
 *
 * @todo Set display to fit screen
 * @todo Add batch editing (ie. to define tile zones)
 */
export class TilesetViewer {
  private cursorX: number = 0;
  private cursorY: number = 0;
  private tilesetWidth: number = 49;
  private tilesetHeight: number = 22;
  private tileData: Map<number, TileMetadata> = new Map();
  private dataManager: TileDataManager;

  // Camera/view controls
  private cameraX: number = 0;
  private cameraY: number = 0;
  private tileSize: number = 16; // World units per tile
  private tileScale: number = 1; // Calculated scale to fit entire tileset
  private viewportWidth: number;
  private viewportHeight: number;

  // UI state
  private showHelp: boolean = true;
  private isActive: boolean = false;

  // Stats
  private totalTiles: number;
  private documentedTiles: number = 0;

  constructor() {
    this.dataManager = new TileDataManager(
      this.tilesetWidth,
      this.tilesetHeight
    );
    this.totalTiles = this.tilesetWidth * this.tilesetHeight;
    this.viewportWidth = LJS.mainCanvasSize.x;
    this.viewportHeight = LJS.mainCanvasSize.y;

    // Calculate scale to fit entire tileset on screen (with padding)
    const scaleX =
      (this.viewportWidth * 0.9) / (this.tilesetWidth * this.tileSize);
    const scaleY =
      (this.viewportHeight * 0.9) / (this.tilesetHeight * this.tileSize);
    this.tileScale = Math.min(scaleX, scaleY);

    // Load existing data
    this.loadData();
  }

  /**
   * Activate the viewer
   */
  activate(): void {
    this.isActive = true;
    this.updateCamera(); // Set initial camera position
    console.log('[TilesetViewer] Activated');
  }

  /**
   * Deactivate the viewer
   */
  deactivate(): void {
    this.isActive = false;
    console.log('[TilesetViewer] Deactivated');
  }

  /**
   * Check if viewer is active
   */
  isViewerActive(): boolean {
    return this.isActive;
  }

  /**
   * Load saved tile data
   */
  private loadData(): void {
    this.tileData = this.dataManager.load();
    this.updateStats();
  }

  /**
   * Save current tile data
   */
  private saveData(): void {
    this.dataManager.save(this.tileData);
    alert(`Saved ${this.tileData.size} tiles to localStorage`);
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    this.documentedTiles = Array.from(this.tileData.values()).filter(
      (t) => t.isDocumented
    ).length;
  }

  /**
   * Get current tile index under cursor
   */
  private getCurrentTileIndex(): number {
    return getTileIndex(this.cursorX, this.cursorY, this.tilesetWidth);
  }

  /**
   * Handle input for navigation and actions
   *
   * @todo Move input handling in dedicated handleInput() function?
   */
  update(): void {
    if (!this.isActive) return;

    // Navigation: cursor moves in screen space (Y=0 at top)
    if (LJS.keyWasPressed('ArrowUp') && this.cursorY > 0) {
      this.cursorY--;
    }
    if (
      LJS.keyWasPressed('ArrowDown') &&
      this.cursorY < this.tilesetHeight - 1
    ) {
      this.cursorY++;
    }
    if (LJS.keyWasPressed('ArrowLeft') && this.cursorX > 0) {
      this.cursorX--;
    }
    if (
      LJS.keyWasPressed('ArrowRight') &&
      this.cursorX < this.tilesetWidth - 1
    ) {
      this.cursorX++;
    }

    // Fast navigation
    if (LJS.keyWasPressed('PageUp')) {
      this.cursorY = Math.max(0, this.cursorY - 5);
    }
    if (LJS.keyWasPressed('PageDown')) {
      this.cursorY = Math.min(this.tilesetHeight - 1, this.cursorY + 5);
    }
    if (LJS.keyWasPressed('Home')) {
      this.cursorX = 0;
    }
    if (LJS.keyWasPressed('End')) {
      this.cursorX = this.tilesetWidth - 1;
    }

    // Actions
    if (LJS.keyWasPressed('Enter')) {
      this.editCurrentTile();
    }
    if (LJS.keyWasPressed('Delete')) {
      this.deleteCurrentTile();
    }
    if (LJS.keyWasPressed('KeyO')) {
      this.saveData();
    }
    if (LJS.keyWasPressed('KeyE')) {
      this.exportData();
    }
    if (LJS.keyWasPressed('KeyI')) {
      this.importFromEnum();
    }
    if (LJS.keyWasPressed('KeyH')) {
      this.showHelp = !this.showHelp;
    }
    if (LJS.keyWasPressed('Escape')) {
      this.deactivate();
    }
  }

  /**
   * Update camera to show entire tileset
   */
  private updateCamera(): void {
    // Center camera on middle of tileset (in world units)
    const centerX = (this.tilesetWidth - 1) / 2;
    const centerY = (this.tilesetHeight - 1) / 2;
    LJS.setCameraPos(LJS.vec2(centerX, centerY));

    // Set zoom to fit entire tileset on screen
    LJS.setCameraScale(this.tileSize * this.tileScale);
  }

  /**
   * Edit the current tile under cursor
   */
  private editCurrentTile(): void {
    const tileIndex = this.getCurrentTileIndex();
    const existing = this.tileData.get(tileIndex) || {
      index: tileIndex,
      name: '',
      categories: [],
      subcategories: [],
      notes: '',
      isDocumented: false,
    };

    // Use browser prompts for editing
    const name = prompt(
      `Tile ${tileIndex} - Enter name (e.g., FLOOR_COBBLESTONE):`,
      existing.name
    );
    if (name === null) return; // Cancelled

    const categoryStr = prompt(
      `Tile ${tileIndex} - Categories (comma-separated):\n` +
        '0=ENVIRONMENT, 1=CHARACTER, 2=ITEM, 3=OBJECT, 4=EFFECT, 5=ICON, 6=FONT, 7=OTHER',
      existing.categories.join(',')
    );
    if (categoryStr === null) return;

    const subcategoryStr = prompt(
      `Tile ${tileIndex} - Subcategories (comma-separated):\n` +
        '0=FLOOR, 1=WALL, 2=DOOR, 3=PASSAGE, 4=LIQUID, 5=HAZARD, 6=TRAP\n' +
        '7=CONTAINER, 8=FURNITURE, 9=PROP, 10=INTERACTIVE\n' +
        '11=WEAPON, 12=ARMOR, 13=EQUIPMENT, 14=CONSUMABLE, 15=FOOD, 16=POTION\n' +
        '17=SCROLL_BOOK, 18=TREASURE, 19=CURRENCY, 20=GEM, 21=KEY\n' +
        '22=PLAYER, 23=NPC, 24=COMPANION, 25=ENEMY_COMMON, 26=ENEMY_UNDEAD\n' +
        '27=ENEMY_CREATURE, 28=ENEMY_ADVANCED, 29=BOSS\n' +
        '30=EFFECT, 31=PARTICLE, 32=PROJECTILE\n' +
        '33=ICON, 34=OTHER',
      existing.subcategories.join(',')
    );
    if (subcategoryStr === null) return;

    const alternateNamesStr = prompt(
      `Tile ${tileIndex} - Alternate names (comma-separated, optional):\n` +
        'e.g., "GROUND, FLOOR_STONE" - creates multiple enum keys for same tile',
      existing.alternateNames?.join(', ') || ''
    );
    if (alternateNamesStr === null) return;

    const notes = prompt(
      `Tile ${tileIndex} - Notes (optional):`,
      existing.notes || ''
    );

    // Parse input
    const categories = categoryStr
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 7);

    const subcategories = subcategoryStr
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 34);

    const alternateNames = alternateNamesStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Save
    this.tileData.set(tileIndex, {
      index: tileIndex,
      name: name.trim(),
      alternateNames: alternateNames.length > 0 ? alternateNames : undefined,
      categories,
      subcategories,
      notes: notes || undefined,
      isDocumented: name.trim().length > 0,
    });

    this.updateStats();
    console.log(`[TilesetViewer] Updated tile ${tileIndex}: ${name}`);
  }

  /**
   * Delete current tile data
   */
  private deleteCurrentTile(): void {
    const tileIndex = this.getCurrentTileIndex();
    if (this.tileData.has(tileIndex)) {
      if (confirm(`Delete data for tile ${tileIndex}?`)) {
        this.tileData.delete(tileIndex);
        this.updateStats();
        console.log(`[TilesetViewer] Deleted tile ${tileIndex}`);
      }
    }
  }

  /**
   * Export data
   */
  private exportData(): void {
    const choice = prompt(
      'Export options:\n1 = Download TypeScript\n2 = Download JSON\n3 = Copy TypeScript to clipboard',
      '1'
    );

    switch (choice) {
      case '1':
        this.dataManager.exportAndDownloadTypeScript(this.tileData);
        alert('TypeScript file downloaded!');
        break;
      case '2':
        this.dataManager.exportAndDownloadJSON(this.tileData);
        alert('JSON file downloaded!');
        break;
      case '3':
        this.dataManager
          .copyTypeScriptToClipboard(this.tileData)
          .then((success) => {
            alert(success ? 'Copied to clipboard!' : 'Failed to copy');
          });
        break;
      default:
        break;
    }
  }

  /**
   * Import from AutoTileSprite enum
   */
  private importFromEnum(): void {
    if (
      confirm(
        'Import tile names from AutoTileSprite enum? This will merge with existing data.'
      )
    ) {
      const imported = this.dataManager.importFromEnum();

      // Merge with existing data (don't overwrite)
      for (const [index, tile] of imported) {
        if (!this.tileData.has(index)) {
          this.tileData.set(index, tile);
        }
      }

      this.updateStats();
      alert(`Imported ${imported.size} tiles from enum`);
    }
  }

  /**
   * Render the tileset viewer
   */
  render(): void {
    if (!this.isActive) return;

    // Render fullscreen black background first (screen space)
    LJS.drawRect(
      LJS.vec2(this.viewportWidth / 2, this.viewportHeight / 2),
      LJS.vec2(this.viewportWidth, this.viewportHeight),
      new LJS.Color(0, 0, 0, 1),
      0,
      true,
      true // Use screen space
    );

    // Render tileset grid (in world space)
    this.renderTileset();

    // Render UI overlays (in screen space)
    this.renderInfoPanel();
    if (this.showHelp) {
      this.renderHelp();
    }
  }

  /**
   * Render the tileset grid
   */
  private renderTileset(): void {
    // Render all tiles in world space (camera centered on tileset)
    for (let y = 0; y < this.tilesetHeight; y++) {
      for (let x = 0; x < this.tilesetWidth; x++) {
        const tileIndex = getTileIndex(x, y, this.tilesetWidth);
        const isDocumented =
          this.tileData.has(tileIndex) &&
          this.tileData.get(tileIndex)!.isDocumented;

        // Get tile sprite info
        const coords = getTileCoords(tileIndex, this.tilesetWidth);
        const tileInfo = new LJS.TileInfo(
          LJS.vec2(coords.x * 16, coords.y * 16),
          LJS.vec2(16, 16),
          0
        );

        // Position in world space (1 unit = 1 tile)
        // Invert Y for LittleJS Y-up system (Y=0 at bottom, increases upward)
        const invertedY = this.tilesetHeight - 1 - y;
        const pos = LJS.vec2(x, invertedY);
        const size = LJS.vec2(1, 1);

        // Draw black background tile first
        LJS.drawRect(pos, size, new LJS.Color(0, 0, 0, 1));

        // Draw tile with alpha for undocumented
        const alpha = isDocumented ? 1.0 : 0.3;
        LJS.drawTile(pos, size, tileInfo, new LJS.Color(1, 1, 1, alpha));

        // Green highlight for documented tiles
        if (isDocumented) {
          LJS.drawRect(pos, size, new LJS.Color(0, 1, 0, 0.2));
        }

        // Gray grid lines
        LJS.drawRect(pos, size, new LJS.Color(0.3, 0.3, 0.3, 0.5), 0, false);
      }
    }

    // Draw cursor AFTER all tiles (so it's on top) - filled rect with bright yellow
    const cursorInvertedY = this.tilesetHeight - 1 - this.cursorY;
    const cursorPos = LJS.vec2(this.cursorX, cursorInvertedY);
    // Draw filled semi-transparent yellow background
    LJS.drawRect(cursorPos, LJS.vec2(1, 1), new LJS.Color(1, 1, 0, 0.4));
    // Draw bright yellow outline
    LJS.drawRect(
      cursorPos,
      LJS.vec2(1, 1),
      new LJS.Color(1, 1, 0, 1),
      0.05,
      false
    );
  }

  /**
   * Render info panel (overlay in screen space)
   */
  private renderInfoPanel(): void {
    // Use overlay rendering (screen coordinates)
    LJS.drawRect(
      LJS.vec2(this.viewportWidth - 150, this.viewportHeight - 200),
      LJS.vec2(300, 400),
      new LJS.Color(0, 0, 0, 0.8),
      0,
      true,
      true // Use screen space
    );

    const tileIndex = this.getCurrentTileIndex();
    const metadata = this.tileData.get(tileIndex);

    // Draw text in screen space
    const textX = this.viewportWidth - 290;
    let textY = this.viewportHeight - 20;

    LJS.drawText(
      'TILESET VIEWER',
      LJS.vec2(textX, textY),
      24,
      new LJS.Color(1, 1, 0)
    );
    textY -= 30;

    LJS.drawText(`Index: ${tileIndex}`, LJS.vec2(textX, textY), 16);
    textY -= 20;
    LJS.drawText(
      `Coords: (${this.cursorX}, ${this.cursorY})`,
      LJS.vec2(textX, textY),
      16
    );
    textY -= 30;

    if (metadata && metadata.isDocumented) {
      LJS.drawText(
        `Name: ${metadata.name}`,
        LJS.vec2(textX, textY),
        16,
        new LJS.Color(0, 1, 0)
      );
      textY -= 20;

      if (metadata.alternateNames && metadata.alternateNames.length > 0) {
        LJS.drawText(
          `Alts: ${metadata.alternateNames.join(', ')}`,
          LJS.vec2(textX, textY),
          12,
          new LJS.Color(0.5, 1, 0.5)
        );
        textY -= 20;
      }

      if (metadata.categories.length > 0) {
        LJS.drawText(
          `Categories: ${metadata.categories.map((c) => TileCategory[c]).join(', ')}`,
          LJS.vec2(textX, textY),
          12
        );
        textY -= 20;
      }

      if (metadata.subcategories.length > 0) {
        LJS.drawText(
          `Subcats: ${metadata.subcategories.map((s) => TileSubcategory[s]).join(', ')}`,
          LJS.vec2(textX, textY),
          12
        );
        textY -= 20;
      }

      if (metadata.notes) {
        LJS.drawText(
          `Notes: ${metadata.notes}`,
          LJS.vec2(textX, textY),
          12,
          new LJS.Color(0.7, 0.7, 0.7)
        );
      }
    } else {
      LJS.drawText(
        '(Undocumented)',
        LJS.vec2(textX, textY),
        16,
        new LJS.Color(1, 0, 0)
      );
    }

    textY -= 30;
    LJS.drawText('─'.repeat(35), LJS.vec2(textX, textY), 16);
    textY -= 20;

    LJS.drawText(
      `Progress: ${this.documentedTiles}/${this.totalTiles}`,
      LJS.vec2(textX, textY),
      16
    );
    textY -= 20;

    const percentage = ((this.documentedTiles / this.totalTiles) * 100).toFixed(
      1
    );
    LJS.drawText(
      `${percentage}%`,
      LJS.vec2(textX, textY),
      20,
      new LJS.Color(0, 1, 1)
    );
  }

  /**
   * Render help overlay (screen space)
   */
  private renderHelp(): void {
    const helpText = [
      'CONTROLS:',
      'Arrow Keys - Navigate',
      'PgUp/PgDn - Fast vertical',
      'Home/End - Jump horizontal',
      'Enter - Edit tile',
      'Delete - Delete tile',
      'O - Save to localStorage',
      'E - Export data',
      'I - Import from enum',
      'H - Toggle help',
      'P - Toggle viewer',
      'Esc - Exit viewer',
    ];

    const panelWidth = 250;
    const panelHeight = 280;
    const panelX = 125;
    const panelY = this.viewportHeight - 140;

    // Background (screen space)
    LJS.drawRect(
      LJS.vec2(panelX, panelY),
      LJS.vec2(panelWidth, panelHeight),
      new LJS.Color(0, 0, 0, 0.9),
      0,
      true,
      true // Use screen space
    );

    // Text (screen space)
    let textY = panelY + panelHeight / 2 - 15;
    for (const line of helpText) {
      LJS.drawText(
        line,
        LJS.vec2(panelX - panelWidth / 2 + 10, textY),
        12,
        new LJS.Color(1, 1, 1)
      );
      textY -= 18;
    }
  }
}
