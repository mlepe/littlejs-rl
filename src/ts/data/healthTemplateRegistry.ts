/*
 * File: healthTemplateRegistry.ts
 * Project: littlejs-rl
 * File Created: November 16, 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 16, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { HealthTemplate, HealthTemplateDataFile } from '../types/dataSchemas';
import { FileLoadError, ParseError } from './errors';

/**
 * Registry for health/durability templates used in template-mixing
 * Manages health and regeneration templates that can be referenced by entities
 */
export class HealthTemplateRegistry {
  private static instance: HealthTemplateRegistry;
  private templates = new Map<string, HealthTemplate>();

  private constructor() {}

  static getInstance(): HealthTemplateRegistry {
    if (!HealthTemplateRegistry.instance) {
      HealthTemplateRegistry.instance = new HealthTemplateRegistry();
    }
    return HealthTemplateRegistry.instance;
  }

  /**
   * Load health templates from a JSON file
   */
  async loadFromFile(path: string): Promise<void> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new FileLoadError(path, response.status);
      }

      const text = await response.text();
      let data: HealthTemplateDataFile;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new ParseError(path, parseError as Error);
      }

      if (data.healthTemplates && Array.isArray(data.healthTemplates)) {
        let successCount = 0;

        for (const template of data.healthTemplates) {
          this.register(template);
          successCount++;
        }

        console.log(
          `[HealthTemplateRegistry] Loaded ${successCount} health templates from ${path}`
        );
      } else {
        console.warn(
          `[HealthTemplateRegistry] No healthTemplates array found in ${path}`
        );
      }
    } catch (error) {
      if (error instanceof FileLoadError || error instanceof ParseError) {
        console.error(error.toString());
      } else {
        console.error(
          `[HealthTemplateRegistry] Failed to load ${path}:`,
          error
        );
      }
      throw error;
    }
  }

  /**
   * Register a single health template
   */
  register(template: HealthTemplate): void {
    if (this.templates.has(template.id)) {
      console.warn(
        `[HealthTemplateRegistry] Overwriting health template: ${template.id}`
      );
    }

    this.templates.set(template.id, template);
  }

  /**
   * Get a health template by ID
   * @param id - Template ID
   * @param silent - If true, don't log warning when template not found
   * @returns The template or undefined if not found
   */
  get(id: string, silent: boolean = false): HealthTemplate | undefined {
    const template = this.templates.get(id);
    if (!template && !silent) {
      console.warn(`[HealthTemplateRegistry] Template not found: ${id}`);
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
  getAll(): HealthTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Clear all templates
   */
  clear(): void {
    this.templates.clear();
  }
}
