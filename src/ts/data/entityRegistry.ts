/*
 * File: entityRegistry.ts
 * Project: littlejs-rl
 * File Created: 2025-11-14 16:00:00
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 14, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import {
  AIComponent,
  ClassComponent,
  ElementalDamageComponent,
  ElementalResistanceComponent,
  HealthComponent,
  LocationComponent,
  MovableComponent,
  PositionComponent,
  RaceComponent,
  RelationComponent,
  RenderComponent,
  StatsComponent,
  StatusEffectComponent,
} from '../components';
import {
  DEFAULT_VALUES,
  validateEntityTemplate,
  validateReference,
} from './validation';
import { EntityDataFile, EntityTemplate } from '../types/dataSchemas';
import {
  FileLoadError,
  ParseError,
  ValidationError,
  logWarnings,
} from './errors';
import { TileSprite, getTileCoords } from '../tileConfig';

import { ClassRegistry } from './classRegistry';
import ECS from '../ecs';
import { ElementType } from '../types/elements';
import { RaceRegistry } from './raceRegistry';
import { applyClassBonuses } from '../systems/classSystem';
import { applyRacialBonuses } from '../systems/raceSystem';
import { calculateDerivedStats } from '../systems/derivedStatsSystem';

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
        throw new FileLoadError(path, response.status);
      }

      const text = await response.text();
      let data: EntityDataFile;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new ParseError(path, parseError as Error);
      }

      if (data.entities && Array.isArray(data.entities)) {
        let successCount = 0;
        let errorCount = 0;

        for (const template of data.entities) {
          try {
            this.register(template);
            successCount++;
          } catch (error) {
            errorCount++;
            if (error instanceof ValidationError) {
              console.error(error.toString());
            } else {
              console.error(
                `[EntityRegistry] Error registering entity:`,
                error
              );
            }
          }
        }

        console.log(
          `[EntityRegistry] Loaded ${successCount} entities from ${path}${errorCount > 0 ? ` (${errorCount} failed)` : ''}`
        );
      } else {
        console.warn(`[EntityRegistry] No entities array found in ${path}`);
      }
    } catch (error) {
      if (error instanceof FileLoadError || error instanceof ParseError) {
        console.error(error.toString());
      } else {
        console.error(`[EntityRegistry] Failed to load ${path}:`, error);
      }
      throw error;
    }
  }

  /**
   * Register a single entity template with validation
   */
  register(template: EntityTemplate | any): void {
    // Validate the entity template
    const validation = validateEntityTemplate(template);

    // Log warnings if any
    if (validation.warnings.length > 0) {
      logWarnings(
        validation.warnings,
        `Entity Registration: ${validation.data.id}`
      );
    }

    // Throw error if validation failed critically
    if (!validation.isValid) {
      throw new ValidationError(
        `Failed to register entity '${validation.data.id}'`,
        validation.errors,
        validation.warnings
      );
    }

    // Check for overwrites
    if (this.templates.has(validation.data.id)) {
      console.warn(
        `[EntityRegistry] Overwriting entity template: ${validation.data.id}`
      );
    }

    // Validate sprite exists in TileSprite enum
    if (
      validation.data.render?.sprite &&
      !(validation.data.render.sprite in TileSprite)
    ) {
      console.error(
        `[EntityRegistry] Invalid sprite '${validation.data.render.sprite}' for entity '${validation.data.id}'. Using default.`
      );
      validation.data.render.sprite = DEFAULT_VALUES.ENTITY.render!.sprite;
    }

    this.templates.set(validation.data.id, validation.data);
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
      const baseStats = {
        strength: template.stats.strength,
        dexterity: template.stats.dexterity ?? 10,
        intelligence: template.stats.intelligence ?? 10,
        charisma: template.stats.charisma ?? 10,
        willpower: template.stats.willpower ?? 10,
        toughness: template.stats.toughness ?? 10,
        attractiveness: template.stats.attractiveness ?? 10,
      };
      ecs.addComponent<StatsComponent>(entityId, 'stats', {
        base: baseStats,
        derived: calculateDerivedStats(baseStats),
      });
    }

    // Add AI
    if (template.ai) {
      ecs.addComponent<AIComponent>(entityId, 'ai', {
        disposition: template.ai.disposition,
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

    // Add movable component (always add it, speed comes from derived stats)
    ecs.addComponent<MovableComponent>(entityId, 'movable', {
      speed: 1.0, // Speed is determined by derived stats
    });

    // Add relation component if specified
    if (template.relation) {
      ecs.addComponent<RelationComponent>(entityId, 'relation', {
        relations: new Map(),
      });
    }

    // Add elemental resistance component if specified
    if (template.elementalResistance) {
      const flatReduction: Partial<Record<ElementType, number>> = {};
      const percentResistance: Partial<Record<ElementType, number>> = {};

      for (const [elementStr, resistance] of Object.entries(
        template.elementalResistance
      )) {
        const element = elementStr as ElementType;
        if (resistance.flat !== undefined) {
          flatReduction[element] = resistance.flat;
        }
        if (resistance.percent !== undefined) {
          percentResistance[element] = resistance.percent;
        }
      }

      ecs.addComponent<ElementalResistanceComponent>(
        entityId,
        'elementalResistance',
        {
          flatReduction,
          percentResistance,
        }
      );
    }

    // Add elemental damage component if specified
    if (template.elementalDamage && template.elementalDamage.length > 0) {
      const damages = template.elementalDamage.map((d) => ({
        element: d.element as ElementType,
        amount: d.amount,
      }));

      ecs.addComponent<ElementalDamageComponent>(entityId, 'elementalDamage', {
        damages,
      });
    }

    // Add empty status effect component (can be populated during gameplay)
    ecs.addComponent<StatusEffectComponent>(entityId, 'statusEffect', {
      effects: [],
    });

    // Add race component if specified
    if (template.race) {
      const raceRegistry = RaceRegistry.getInstance();

      // Validate race reference
      const raceValidation = validateReference(
        template.race.id,
        'race',
        templateId,
        (id) => raceRegistry.has(id)
      );

      if (raceValidation.warnings.length > 0) {
        logWarnings(raceValidation.warnings, `Entity Spawn: ${templateId}`);
      }

      // Try to get race template with fallback
      const raceTemplate = raceRegistry.get(template.race.id, true);

      if (raceTemplate) {
        ecs.addComponent<RaceComponent>(entityId, 'race', {
          raceId: raceTemplate.id,
          raceName: raceTemplate.name,
          raceType: raceTemplate.type,
          abilities: raceTemplate.abilities ? [...raceTemplate.abilities] : [],
        });

        // Apply racial stat bonuses
        try {
          applyRacialBonuses(ecs, entityId);
        } catch (error) {
          console.error(
            `[EntityRegistry] Failed to apply racial bonuses for ${templateId}:`,
            error
          );
        }
      }
    }

    // Add class component if specified (only for characters/players/bosses)
    if (
      template.class &&
      (template.type === 'character' ||
        template.type === 'player' ||
        template.type === 'boss')
    ) {
      const classRegistry = ClassRegistry.getInstance();

      // Validate class reference
      const classValidation = validateReference(
        template.class.id,
        'class',
        templateId,
        (id) => classRegistry.has(id)
      );

      if (classValidation.warnings.length > 0) {
        logWarnings(classValidation.warnings, `Entity Spawn: ${templateId}`);
      }

      // Try to get class template with fallback
      const classTemplate = classRegistry.get(template.class.id, true);

      if (classTemplate) {
        const startLevel = template.class.level ?? 1;
        const startXP = template.class.experience ?? 0;
        const nextLevelXP =
          classRegistry.getExperienceForLevel(
            template.class.id,
            startLevel + 1
          ) || (startLevel + 1) * 100;

        ecs.addComponent<ClassComponent>(entityId, 'class', {
          classId: classTemplate.id,
          className: classTemplate.name,
          level: startLevel,
          experience: startXP,
          experienceToNextLevel: nextLevelXP,
          abilities: [],
        });

        // Unlock abilities for all levels up to start level
        for (let level = 1; level <= startLevel; level++) {
          const abilities = classRegistry.getAbilitiesForLevel(
            template.class.id,
            level
          );
          if (abilities && abilities.length > 0) {
            const classComp = ecs.getComponent<ClassComponent>(
              entityId,
              'class'
            );
            if (classComp) {
              if (!classComp.abilities) {
                classComp.abilities = [];
              }
              classComp.abilities.push(...abilities);
            }
          }
        }

        // Apply class stat bonuses
        try {
          applyClassBonuses(ecs, entityId);
        } catch (error) {
          console.error(
            `[EntityRegistry] Failed to apply class bonuses for ${templateId}:`,
            error
          );
        }
      }
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
