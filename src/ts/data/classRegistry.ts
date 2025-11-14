/*
 * File: classRegistry.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 11:50:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 14, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { DEFAULT_VALUES, validateClassTemplate } from './validation';
import { MissingDataError, ValidationError, logWarnings } from './errors';

import { ClassTemplate } from '../types/dataSchemas';

/**
 * Registry for class templates
 *
 * Manages all class definitions loaded from JSON data files.
 * Provides lookup and querying capabilities for class data.
 *
 * Singleton pattern ensures only one registry exists.
 */
export class ClassRegistry {
  private static instance: ClassRegistry;
  private classes: Map<string, ClassTemplate> = new Map();

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): ClassRegistry {
    if (!ClassRegistry.instance) {
      ClassRegistry.instance = new ClassRegistry();
    }
    return ClassRegistry.instance;
  }

  /**
   * Register a class template with validation
   */
  public register(classTemplate: ClassTemplate | any): void {
    // Validate the class template
    const validation = validateClassTemplate(classTemplate);

    // Log warnings if any
    if (validation.warnings.length > 0) {
      logWarnings(
        validation.warnings,
        `Class Registration: ${validation.data.id}`
      );
    }

    // Throw error if validation failed critically
    if (!validation.isValid) {
      throw new ValidationError(
        `Failed to register class '${validation.data.id}'`,
        validation.errors,
        validation.warnings
      );
    }

    // Check for overwrites
    if (this.classes.has(validation.data.id)) {
      console.warn(
        `Class "${validation.data.id}" is already registered. Overwriting...`
      );
    }

    this.classes.set(validation.data.id, validation.data);
  }

  /**
   * Register multiple class templates with validation
   */
  public registerMultiple(classes: (ClassTemplate | any)[]): void {
    const errors: string[] = [];

    for (const classTemplate of classes) {
      try {
        this.register(classTemplate);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error.message);
          console.error(error.toString());
        } else {
          errors.push(`Unexpected error registering class: ${error}`);
          console.error(error);
        }
      }
    }

    if (errors.length > 0) {
      console.warn(
        `\nClass registration completed with ${errors.length} error(s). ${this.count()} classes registered successfully.`
      );
    }
  }

  /**
   * Get a class template by ID, with optional fallback to default
   */
  public get(
    id: string,
    useFallback: boolean = false
  ): ClassTemplate | undefined {
    const classTemplate = this.classes.get(id);

    if (!classTemplate && useFallback) {
      console.warn(
        `Class '${id}' not found, returning default class template. This should be fixed in your data files.`
      );
      return DEFAULT_VALUES.CLASS;
    }

    return classTemplate;
  }

  /**
   * Get a class template by ID, throwing error if not found
   */
  public getOrThrow(id: string): ClassTemplate {
    const classTemplate = this.classes.get(id);
    if (!classTemplate) {
      throw new MissingDataError('class', id);
    }
    return classTemplate;
  }

  /**
   * Check if a class exists
   */
  public has(id: string): boolean {
    return this.classes.has(id);
  }

  /**
   * Get all class IDs
   */
  public getAllIds(): string[] {
    return Array.from(this.classes.keys());
  }

  /**
   * Get all class templates
   */
  public getAll(): ClassTemplate[] {
    return Array.from(this.classes.values());
  }

  /**
   * Calculate XP required for a given level
   */
  public getExperienceForLevel(
    classId: string,
    level: number
  ): number | undefined {
    const classTemplate = this.get(classId);
    if (!classTemplate) return undefined;

    // Use explicit level array if provided
    if (
      classTemplate.experiencePerLevel &&
      classTemplate.experiencePerLevel[level - 2]
    ) {
      return classTemplate.experiencePerLevel[level - 2];
    }

    // Use formula: level * base * multiplier^(level-1)
    if (classTemplate.experienceFormula) {
      const { base, multiplier } = classTemplate.experienceFormula;
      return Math.floor(base * Math.pow(multiplier, level - 1));
    }

    // Default formula
    return level * 100;
  }

  /**
   * Get abilities unlocked at a specific level
   */
  public getAbilitiesForLevel(
    classId: string,
    level: number
  ): string[] | undefined {
    const classTemplate = this.get(classId);
    if (!classTemplate || !classTemplate.abilities) return undefined;

    return classTemplate.abilities[level] || [];
  }

  /**
   * Clear all registered classes
   */
  public clear(): void {
    this.classes.clear();
  }

  /**
   * Get the number of registered classes
   */
  public count(): number {
    return this.classes.size;
  }
}
