/*
 * File: statsTemplateRegistry.ts
 * Project: littlejs-rl
 * File Created: November 16, 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 16, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { StatsTemplate, StatsTemplateDataFile } from '../types/dataSchemas';
import { FileLoadError, ParseError } from './errors';

/**
 * Registry for stats templates used in template-mixing
 * Manages character attribute templates that can be referenced by entities
 */
export class StatsTemplateRegistry {
  private static instance: StatsTemplateRegistry;
  private templates = new Map<string, StatsTemplate>();

  private constructor() {}

  static getInstance(): StatsTemplateRegistry {
    if (!StatsTemplateRegistry.instance) {
      StatsTemplateRegistry.instance = new StatsTemplateRegistry();
    }
    return StatsTemplateRegistry.instance;
  }

  /**
   * Load stats templates from a JSON file
   */
  async loadFromFile(path: string): Promise<void> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new FileLoadError(path, response.status);
      }

      const text = await response.text();
      let data: StatsTemplateDataFile;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new ParseError(path, parseError as Error);
      }

      if (data.statsTemplates && Array.isArray(data.statsTemplates)) {
        let successCount = 0;

        for (const template of data.statsTemplates) {
          this.register(template);
          successCount++;
        }

        console.log(
          `[StatsTemplateRegistry] Loaded ${successCount} stats templates from ${path}`
        );
      } else {
        console.warn(
          `[StatsTemplateRegistry] No statsTemplates array found in ${path}`
        );
      }
    } catch (error) {
      if (error instanceof FileLoadError || error instanceof ParseError) {
        console.error(error.toString());
      } else {
        console.error(`[StatsTemplateRegistry] Failed to load ${path}:`, error);
      }
      throw error;
    }
  }

  /**
   * Register a single stats template
   */
  register(template: StatsTemplate): void {
    if (this.templates.has(template.id)) {
      console.warn(
        `[StatsTemplateRegistry] Overwriting stats template: ${template.id}`
      );
    }

    this.templates.set(template.id, template);
  }

  /**
   * Get a stats template by ID
   * @param id - Template ID
   * @param silent - If true, don't log warning when template not found
   * @returns The template or undefined if not found
   */
  get(id: string, silent: boolean = false): StatsTemplate | undefined {
    const template = this.templates.get(id);
    if (!template && !silent) {
      console.warn(`[StatsTemplateRegistry] Template not found: ${id}`);
    }
    return template;
  }

  /**
   * Check if template exists
   */
  has(id: string): boolean {
    return this.templates.has(id);
  }

  /**
   * Get all template IDs
   */
  getAllIds(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Get all templates
   */
  getAll(): StatsTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Clear all templates
   */
  clear(): void {
    this.templates.clear();
  }
}
