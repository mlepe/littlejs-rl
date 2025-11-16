/*
 * File: aiTemplateRegistry.ts
 * Project: littlejs-rl
 * File Created: November 16, 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 16, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import { AITemplate, AITemplateDataFile } from '../types/dataSchemas';
import { FileLoadError, ParseError } from './errors';

/**
 * Registry for AI behavior templates used in template-mixing
 * Manages AI disposition and behavior templates that can be referenced by entities
 */
export class AITemplateRegistry {
  private static instance: AITemplateRegistry;
  private templates = new Map<string, AITemplate>();

  private constructor() {}

  static getInstance(): AITemplateRegistry {
    if (!AITemplateRegistry.instance) {
      AITemplateRegistry.instance = new AITemplateRegistry();
    }
    return AITemplateRegistry.instance;
  }

  /**
   * Load AI templates from a JSON file
   */
  async loadFromFile(path: string): Promise<void> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new FileLoadError(path, response.status);
      }

      const text = await response.text();
      let data: AITemplateDataFile;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new ParseError(path, parseError as Error);
      }

      if (data.aiTemplates && Array.isArray(data.aiTemplates)) {
        let successCount = 0;

        for (const template of data.aiTemplates) {
          this.register(template);
          successCount++;
        }

        console.log(
          `[AITemplateRegistry] Loaded ${successCount} AI templates from ${path}`
        );
      } else {
        console.warn(
          `[AITemplateRegistry] No aiTemplates array found in ${path}`
        );
      }
    } catch (error) {
      if (error instanceof FileLoadError || error instanceof ParseError) {
        console.error(error.toString());
      } else {
        console.error(`[AITemplateRegistry] Failed to load ${path}:`, error);
      }
      throw error;
    }
  }

  /**
   * Register a single AI template
   */
  register(template: AITemplate): void {
    if (this.templates.has(template.id)) {
      console.warn(
        `[AITemplateRegistry] Overwriting AI template: ${template.id}`
      );
    }

    this.templates.set(template.id, template);
  }

  /**
   * Get an AI template by ID
   * @param id - Template ID
   * @param silent - If true, don't log warning when template not found
   * @returns The template or undefined if not found
   */
  get(id: string, silent: boolean = false): AITemplate | undefined {
    const template = this.templates.get(id);
    if (!template && !silent) {
      console.warn(`[AITemplateRegistry] Template not found: ${id}`);
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
  getAll(): AITemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Clear all templates
   */
  clear(): void {
    this.templates.clear();
  }
}
