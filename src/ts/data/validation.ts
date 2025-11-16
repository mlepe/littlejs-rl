/*
 * File: validation.ts
 * Project: littlejs-rl
 * File Created: November 14, 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 14, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import {
  ClassTemplate,
  EntityTemplate,
  RaceTemplate,
  StatModifier,
} from '../types/dataSchemas';

import { RaceType } from '../components/race';

/**
 * Default values for when data is missing or malformed
 */
export const DEFAULT_VALUES = {
  // Race defaults
  RACE: {
    id: 'unknown_race',
    name: 'Unknown Race',
    type: RaceType.HUMANOID,
    description: 'An unknown race.',
    statModifiers: {},
    classAffinities: {},
    abilities: [],
  } as RaceTemplate,

  // Class defaults
  CLASS: {
    id: 'unknown_class',
    name: 'Unknown Class',
    description: 'An unknown class.',
    baseStatModifiers: {},
    statModifiersPerLevel: {},
    experienceFormula: {
      base: 100,
      multiplier: 1.5,
    },
    abilities: {},
  } as ClassTemplate,

  // Entity defaults
  ENTITY: {
    id: 'unknown_entity',
    name: 'Unknown Entity',
    type: 'creature' as const,
    health: { max: 50 },
    stats: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      charisma: 10,
      willpower: 10,
      toughness: 10,
      attractiveness: 10,
    },
    render: {
      sprite: 'PLAYER', // Default fallback sprite
      color: '#ffffff',
    },
  } as EntityTemplate,

  // Stat modifier defaults
  STAT_MODIFIER: {
    flat: 0,
    percent: 0,
  } as StatModifier,
};

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  isValid: boolean;
  data: T;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a race template
 */
export function validateRaceTemplate(
  data: any,
  id?: string
): ValidationResult<RaceTemplate> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const raceId = id || data?.id || DEFAULT_VALUES.RACE.id;

  // Create a working copy with defaults
  const race: RaceTemplate = {
    id: raceId,
    name: data?.name || DEFAULT_VALUES.RACE.name,
    type: data?.type || DEFAULT_VALUES.RACE.type,
    description: data?.description || DEFAULT_VALUES.RACE.description,
    statModifiers: data?.statModifiers || {},
    classAffinities: data?.classAffinities || {},
    abilities: Array.isArray(data?.abilities) ? data.abilities : [],
  };

  // Validate required fields
  if (!data) {
    errors.push(`Race data is null or undefined`);
    return { isValid: false, data: DEFAULT_VALUES.RACE, errors, warnings };
  }

  if (!data.id && !id) {
    errors.push(`Race is missing required field: id`);
    warnings.push(`Using default id: ${race.id}`);
  }

  if (!data.name) {
    warnings.push(
      `Race '${raceId}' is missing name, using default: ${race.name}`
    );
  }

  // Validate race type
  const validRaceTypes = Object.values(RaceType);
  if (data.type && !validRaceTypes.includes(data.type)) {
    warnings.push(
      `Race '${raceId}' has invalid type '${data.type}', using default: ${race.type}`
    );
  }

  // Validate stat modifiers structure
  if (data.statModifiers && typeof data.statModifiers !== 'object') {
    warnings.push(
      `Race '${raceId}' has invalid statModifiers, using empty object`
    );
    race.statModifiers = {};
  }

  // Validate class affinities structure
  if (data.classAffinities && typeof data.classAffinities !== 'object') {
    warnings.push(
      `Race '${raceId}' has invalid classAffinities, using empty object`
    );
    race.classAffinities = {};
  }

  return {
    isValid: errors.length === 0,
    data: race,
    errors,
    warnings,
  };
}

/**
 * Validates a class template
 */
export function validateClassTemplate(
  data: any,
  id?: string
): ValidationResult<ClassTemplate> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const classId = id || data?.id || DEFAULT_VALUES.CLASS.id;

  // Create a working copy with defaults
  const classTemplate: ClassTemplate = {
    id: classId,
    name: data?.name || DEFAULT_VALUES.CLASS.name,
    description: data?.description || DEFAULT_VALUES.CLASS.description,
    baseStatModifiers: data?.baseStatModifiers || {},
    statModifiersPerLevel: data?.statModifiersPerLevel || {},
    experienceFormula:
      data?.experienceFormula || DEFAULT_VALUES.CLASS.experienceFormula,
    abilities: data?.abilities || {},
  };

  // Validate required fields
  if (!data) {
    errors.push(`Class data is null or undefined`);
    return { isValid: false, data: DEFAULT_VALUES.CLASS, errors, warnings };
  }

  if (!data.id && !id) {
    errors.push(`Class is missing required field: id`);
    warnings.push(`Using default id: ${classTemplate.id}`);
  }

  if (!data.name) {
    warnings.push(
      `Class '${classId}' is missing name, using default: ${classTemplate.name}`
    );
  }

  // Validate experience formula
  if (data.experienceFormula) {
    if (typeof data.experienceFormula !== 'object') {
      warnings.push(
        `Class '${classId}' has invalid experienceFormula, using default`
      );
      classTemplate.experienceFormula = DEFAULT_VALUES.CLASS.experienceFormula;
    } else {
      if (
        typeof data.experienceFormula.base !== 'number' ||
        data.experienceFormula.base <= 0
      ) {
        warnings.push(
          `Class '${classId}' has invalid experienceFormula.base, using default: ${DEFAULT_VALUES.CLASS.experienceFormula!.base}`
        );
        classTemplate.experienceFormula!.base =
          DEFAULT_VALUES.CLASS.experienceFormula!.base;
      }
      if (
        typeof data.experienceFormula.multiplier !== 'number' ||
        data.experienceFormula.multiplier <= 1
      ) {
        warnings.push(
          `Class '${classId}' has invalid experienceFormula.multiplier, using default: ${DEFAULT_VALUES.CLASS.experienceFormula!.multiplier}`
        );
        classTemplate.experienceFormula!.multiplier =
          DEFAULT_VALUES.CLASS.experienceFormula!.multiplier;
      }
    }
  }

  // Validate stat modifiers structure
  if (data.baseStatModifiers && typeof data.baseStatModifiers !== 'object') {
    warnings.push(
      `Class '${classId}' has invalid baseStatModifiers, using empty object`
    );
    classTemplate.baseStatModifiers = {};
  }

  if (
    data.statModifiersPerLevel &&
    typeof data.statModifiersPerLevel !== 'object'
  ) {
    warnings.push(
      `Class '${classId}' has invalid statModifiersPerLevel, using empty object`
    );
    classTemplate.statModifiersPerLevel = {};
  }

  // Validate abilities structure
  if (data.abilities && typeof data.abilities !== 'object') {
    warnings.push(
      `Class '${classId}' has invalid abilities, using empty object`
    );
    classTemplate.abilities = {};
  }

  return {
    isValid: errors.length === 0,
    data: classTemplate,
    errors,
    warnings,
  };
}

/**
 * Validates an entity template
 */
export function validateEntityTemplate(
  data: any,
  id?: string
): ValidationResult<EntityTemplate> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const entityId = id || data?.id || DEFAULT_VALUES.ENTITY.id!;

  // Check if entity uses template mixing
  const hasTemplates = data?.templates && typeof data.templates === 'object';
  const hasHealthTemplate =
    hasTemplates &&
    Array.isArray(data.templates.healthTemplates) &&
    data.templates.healthTemplates.length > 0;
  const hasStatsTemplate =
    hasTemplates &&
    Array.isArray(data.templates.statsTemplates) &&
    data.templates.statsTemplates.length > 0;
  const hasRenderTemplate =
    hasTemplates &&
    Array.isArray(data.templates.renderTemplates) &&
    data.templates.renderTemplates.length > 0;
  const hasAITemplate =
    hasTemplates &&
    Array.isArray(data.templates.aiTemplates) &&
    data.templates.aiTemplates.length > 0;

  // Create a working copy with defaults
  const entity: EntityTemplate = {
    id: entityId,
    name: data?.name || DEFAULT_VALUES.ENTITY.name!,
    type: data?.type || DEFAULT_VALUES.ENTITY.type!,
    health: data?.health,
    stats: data?.stats,
    render: data?.render,
    templates: data?.templates,
    race: data?.race,
    class: data?.class,
    ai: data?.ai,
    relation: data?.relation,
  };

  // Validate required fields
  if (!data) {
    errors.push(`Entity data is null or undefined`);
    return { isValid: false, data: entity, errors, warnings };
  }

  if (!data.id && !id) {
    errors.push(`Entity is missing required field: id`);
    warnings.push(`Using default id: ${entity.id}`);
  }

  if (!data.name) {
    warnings.push(
      `Entity '${entityId}' is missing name, using default: ${entity.name}`
    );
  }

  if (!data.type) {
    warnings.push(
      `Entity '${entityId}' is missing type, using default: ${entity.type}`
    );
  }

  // Validate health (optional if healthTemplate is specified)
  if (!data.health && !hasHealthTemplate) {
    warnings.push(
      `Entity '${entityId}' has no health data or healthTemplate, will use defaults if needed`
    );
  } else if (data.health) {
    if (
      typeof data.health !== 'object' ||
      typeof data.health.max !== 'number'
    ) {
      warnings.push(
        `Entity '${entityId}' has invalid health format, using default: ${DEFAULT_VALUES.ENTITY.health!.max}`
      );
      entity.health = DEFAULT_VALUES.ENTITY.health!;
    }
  }

  // Validate stats (optional if statsTemplate is specified)
  if (!data.stats && !hasStatsTemplate) {
    warnings.push(
      `Entity '${entityId}' has no stats data or statsTemplate, will use defaults if needed`
    );
  } else if (data.stats && typeof data.stats !== 'object') {
    warnings.push(`Entity '${entityId}' has invalid stats, using defaults`);
    entity.stats = DEFAULT_VALUES.ENTITY.stats!;
  }

  // Validate stats (optional if statsTemplate is specified)
  if (!data.stats && !hasStatsTemplate) {
    warnings.push(
      `Entity '${entityId}' has no stats data or statsTemplate, will use defaults if needed`
    );
  } else if (data.stats && typeof data.stats !== 'object') {
    warnings.push(`Entity '${entityId}' has invalid stats, using defaults`);
    entity.stats = DEFAULT_VALUES.ENTITY.stats!;
  }

  // Validate render (optional if renderTemplate is specified)
  if (!data.render && !hasRenderTemplate) {
    errors.push(
      `Entity '${entityId}' is missing both render configuration and renderTemplate`
    );
    entity.render = DEFAULT_VALUES.ENTITY.render!;
  } else if (data.render) {
    if (typeof data.render !== 'object') {
      errors.push(`Entity '${entityId}' has invalid render configuration`);
      entity.render = DEFAULT_VALUES.ENTITY.render!;
    } else {
      if (!data.render.sprite && !hasRenderTemplate) {
        errors.push(
          `Entity '${entityId}' is missing render.sprite and has no renderTemplate`
        );
        entity.render.sprite = DEFAULT_VALUES.ENTITY.render!.sprite;
      }
      if (!data.render.color && !hasRenderTemplate) {
        warnings.push(
          `Entity '${entityId}' is missing render.color, will use template or default`
        );
      }
    }
  }

  // Validate AI if present (or if aiTemplate is specified)
  if (data.ai) {
    if (typeof data.ai !== 'object') {
      warnings.push(
        `Entity '${entityId}' has invalid ai configuration, removing`
      );
      entity.ai = undefined;
    } else if (!data.ai.disposition && !hasAITemplate) {
      warnings.push(
        `Entity '${entityId}' has AI without disposition and no aiTemplate, removing`
      );
      entity.ai = undefined;
    }
  }

  return {
    isValid: errors.length === 0,
    data: entity,
    errors,
    warnings,
  };
}

/**
 * Helper to safely get a stat modifier with defaults
 */
export function getStatModifier(
  modifiers: Record<string, StatModifier> | undefined,
  stat: string
): StatModifier {
  if (!modifiers || !modifiers[stat]) {
    return { ...DEFAULT_VALUES.STAT_MODIFIER };
  }
  return {
    flat: modifiers[stat].flat || 0,
    percent: modifiers[stat].percent || 0,
  };
}

/**
 * Validates that a referenced ID exists in a registry
 */
export function validateReference(
  id: string | undefined,
  registryName: string,
  entityId: string,
  exists: (id: string) => boolean
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!id) {
    warnings.push(`Entity '${entityId}' is missing ${registryName} reference`);
    return { valid: false, warnings };
  }

  if (!exists(id)) {
    warnings.push(
      `Entity '${entityId}' references unknown ${registryName} '${id}' - this may cause issues`
    );
    return { valid: false, warnings };
  }

  return { valid: true, warnings: [] };
}
