/*
 * File: entityRegistry.ts
 * Project: littlejs-rl
 * File Created: 2025-11-14 16:00:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: 2025-11-14 16:00:00
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import {
  AIComponent,
  HealthComponent,
  LocationComponent,
  MovableComponent,
  PositionComponent,
  RelationComponent,
  RenderComponent,
  StatsComponent,
} from '../components';
import { EntityDataFile, EntityTemplate } from '../types/dataSchemas';
import { TileSprite, getTileCoords } from '../tileConfig';

import ECS from '../ecs';

/**
 * Registry for entity templates loaded from data files
 * Manages entity definitions and provides factory methods to spawn entities
 */
export class EntityRegistry {
  private static instance: EntityRegistry;
  private templates = new Map<string, EntityTemplate>();

  private constructor() {}

  static getInstance(): EntityRegistry {
    if (!EntityRegistry.instance) {
      EntityRegistry.instance = new EntityRegistry();
    }
    return EntityRegistry.instance;
  }

  /**
   * Load entity templates from a JSON file
   */
  async loadFromFile(path: string): Promise<void> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: EntityDataFile = await response.json();

      if (data.entities && Array.isArray(data.entities)) {
        for (const template of data.entities) {
          this.register(template);
        }
        console.log(
          `[EntityRegistry] Loaded ${data.entities.length} entities from ${path}`
        );
      } else {
        console.warn(`[EntityRegistry] No entities array found in ${path}`);
      }
    } catch (error) {
      console.error(`[EntityRegistry] Failed to load ${path}:`, error);
    }
  }

  /**
   * Register a single entity template
   */
  register(template: EntityTemplate): void {
    if (this.templates.has(template.id)) {
      console.warn(
        `[EntityRegistry] Overwriting entity template: ${template.id}`
      );
    }

    // Validate required fields
    if (!template.render || !template.render.sprite) {
      console.error(
        `[EntityRegistry] Invalid template ${template.id}: missing render.sprite`
      );
      return;
    }

    this.templates.set(template.id, template);
  }

  /**
   * Get an entity template by ID
   */
  get(id: string): EntityTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all entity IDs
   */
  getAllIds(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Get all entity templates
   */
  getAll(): EntityTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get entities by type
   */
  getByType(type: EntityTemplate['type']): EntityTemplate[] {
    return this.getAll().filter((t) => t.type === type);
  }

  /**
   * Check if template exists
   */
  has(id: string): boolean {
    return this.templates.has(id);
  }

  /**
   * Clear all templates
   */
  clear(): void {
    this.templates.clear();
  }

  /**
   * Spawn an entity from a template
   */
  spawn(
    ecs: ECS,
    templateId: string,
    x: number,
    y: number,
    worldX: number,
    worldY: number
  ): number | null {
    const template = this.templates.get(templateId);
    if (!template) {
      console.error(`[EntityRegistry] Template not found: ${templateId}`);
      return null;
    }

    const entityId = ecs.createEntity();

    // Add position
    ecs.addComponent<PositionComponent>(entityId, 'position', { x, y });

    // Add location
    ecs.addComponent<LocationComponent>(entityId, 'location', {
      worldX,
      worldY,
    });

    // Add health
    if (template.health) {
      const current = template.health.current ?? template.health.max;
      ecs.addComponent<HealthComponent>(entityId, 'health', {
        current,
        max: template.health.max,
      });
    }

    // Add stats
    if (template.stats) {
      ecs.addComponent<StatsComponent>(entityId, 'stats', {
        strength: template.stats.strength,
        defense: template.stats.defense,
        speed: template.stats.speed,
      });
    }

    // Add AI
    if (template.ai) {
      ecs.addComponent<AIComponent>(entityId, 'ai', {
        type: template.ai.type,
        detectionRange: template.ai.detectionRange,
        state: 'idle',
      });
    }

    // Add render component
    try {
      const sprite = this.getSpriteFromString(template.render.sprite);
      const color = template.render.color
        ? this.hexToColor(template.render.color)
        : new LJS.Color(1, 1, 1, 1);

      ecs.addComponent<RenderComponent>(entityId, 'render', {
        tileInfo: sprite,
        color,
        size: new LJS.Vector2(1, 1),
      });
    } catch (error) {
      console.error(
        `[EntityRegistry] Failed to create render component for ${templateId}:`,
        error
      );
    }

    // Add movable
    if (template.stats?.speed) {
      ecs.addComponent<MovableComponent>(entityId, 'movable', {
        speed: template.stats.speed,
      });
    }

    // Add relation component if specified
    if (template.relation) {
      ecs.addComponent<RelationComponent>(entityId, 'relation', {
        relations: new Map(),
      });
    }

    console.log(
      `[EntityRegistry] Spawned ${template.name} (${templateId}) at (${x}, ${y}) in location (${worldX}, ${worldY})`
    );

    return entityId;
  }

  /**
   * Convert sprite name string to TileInfo
   */
  private getSpriteFromString(spriteName: string): LJS.TileInfo {
    // Check if the sprite name exists in TileSprite enum
    if (!(spriteName in TileSprite)) {
      console.warn(
        `[EntityRegistry] Unknown sprite: ${spriteName}, using default`
      );
      // Default to first sprite
      const coords = getTileCoords(TileSprite.PLAYER_WARRIOR);
      return new LJS.TileInfo(LJS.vec2(coords.x, coords.y), LJS.vec2(1, 1), 0);
    }

    const spriteEnum = TileSprite[spriteName as keyof typeof TileSprite];
    const coords = getTileCoords(spriteEnum);
    return new LJS.TileInfo(LJS.vec2(coords.x, coords.y), LJS.vec2(1, 1), 0);
  }

  /**
   * Convert hex color string to LittleJS Color
   */
  private hexToColor(hex: string): LJS.Color {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse RGB
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    // Parse alpha if present (8 character hex)
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

    return new LJS.Color(r, g, b, a);
  }
}
