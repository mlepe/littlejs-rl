/*
 * File: classRegistry.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 11:50:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 11:50:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

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
   * Register a class template
   */
  public register(classTemplate: ClassTemplate): void {
    if (this.classes.has(classTemplate.id)) {
      console.warn(
        `Class "${classTemplate.id}" is already registered. Overwriting...`
      );
    }
    this.classes.set(classTemplate.id, classTemplate);
  }

  /**
   * Register multiple class templates
   */
  public registerMultiple(classes: ClassTemplate[]): void {
    for (const classTemplate of classes) {
      this.register(classTemplate);
    }
  }

  /**
   * Get a class template by ID
   */
  public get(id: string): ClassTemplate | undefined {
    return this.classes.get(id);
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
