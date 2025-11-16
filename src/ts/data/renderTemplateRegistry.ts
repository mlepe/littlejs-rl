/*
 * File: renderTemplateRegistry.ts
 * Project: littlejs-rl
 * File Created: November 16, 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 16, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { RenderTemplate, RenderTemplateDataFile } from '../types/dataSchemas';
import { FileLoadError, ParseError } from './errors';

/**
 * Registry for render templates used in template-mixing
 * Manages visual appearance templates that can be referenced by entities
 */
export class RenderTemplateRegistry {
  private static instance: RenderTemplateRegistry;
  private templates = new Map<string, RenderTemplate>();

  private constructor() {}

  static getInstance(): RenderTemplateRegistry {
    if (!RenderTemplateRegistry.instance) {
      RenderTemplateRegistry.instance = new RenderTemplateRegistry();
    }
    return RenderTemplateRegistry.instance;
  }

  /**
   * Load render templates from a JSON file
   */
  async loadFromFile(path: string): Promise<void> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new FileLoadError(path, response.status);
      }

      const text = await response.text();
      let data: RenderTemplateDataFile;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new ParseError(path, parseError as Error);
      }

      if (data.renderTemplates && Array.isArray(data.renderTemplates)) {
        let successCount = 0;

        for (const template of data.renderTemplates) {
          this.register(template);
          successCount++;
        }

        console.log(
          `[RenderTemplateRegistry] Loaded ${successCount} render templates from ${path}`
        );
      } else {
        console.warn(
          `[RenderTemplateRegistry] No renderTemplates array found in ${path}`
        );
      }
    } catch (error) {
      if (error instanceof FileLoadError || error instanceof ParseError) {
        console.error(error.toString());
      } else {
        console.error(
          `[RenderTemplateRegistry] Failed to load ${path}:`,
          error
        );
      }
      throw error;
    }
  }

  /**
   * Register a single render template
   */
  register(template: RenderTemplate): void {
    if (this.templates.has(template.id)) {
      console.warn(
        `[RenderTemplateRegistry] Overwriting render template: ${template.id}`
      );
    }

    this.templates.set(template.id, template);
  }

  /**
   * Get a render template by ID
   * @param id - Template ID
   * @param silent - If true, don't log warning when template not found
   * @returns The template or undefined if not found
   */
  get(id: string, silent: boolean = false): RenderTemplate | undefined {
    const template = this.templates.get(id);
    if (!template && !silent) {
      console.warn(`[RenderTemplateRegistry] Template not found: ${id}`);
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
  getAll(): RenderTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Clear all templates
   */
  clear(): void {
    this.templates.clear();
  }
}
