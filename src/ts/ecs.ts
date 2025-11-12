/*
 * File: ecs.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 1:00:19 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 11th November 2025 1:02:43 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Entity Component System (ECS)
 * 
 * Core ECS implementation for managing game entities and components.
 * Entities are simple numeric IDs, components are pure data, and systems
 * operate on entities with specific component combinations.
 * 
 * @example
 * ```typescript
 * const ecs = new ECS();
 * const entityId = ecs.createEntity();
 * ecs.addComponent<PositionComponent>(entityId, 'position', { x: 10, y: 20 });
 * const pos = ecs.getComponent<PositionComponent>(entityId, 'position');
 * ```
 */
export default class ECS {
  private readonly entities = new Map<number, Set<string>>();
  private readonly components = new Map<string, Map<number, any>>();
  private nextEntityId = 0;

  /**
   * Create a new entity
   * @returns The unique entity ID
   */
  createEntity(): number {
    const id = this.nextEntityId++;
    this.entities.set(id, new Set());
    return id;
  }

  /**
   * Add a component to an entity
   * @param entityId - The entity to add the component to
   * @param componentName - Name of the component type (e.g., 'position', 'health')
   * @param data - The component data
   * @template T - The component data type
   */
  addComponent<T>(entityId: number, componentName: string, data: T): void {
    if (!this.components.has(componentName)) {
      this.components.set(componentName, new Map());
    }
    this.components.get(componentName)!.set(entityId, data);
    this.entities.get(entityId)?.add(componentName);
  }

  /**
   * Get a component from an entity
   * @param entityId - The entity to get the component from
   * @param componentName - Name of the component type
   * @returns The component data, or undefined if not found
   * @template T - The component data type
   */
  getComponent<T>(entityId: number, componentName: string): T | undefined {
    return this.components.get(componentName)?.get(entityId);
  }

  /**
   * Query entities that have all specified components
   * @param componentNames - Names of components that entities must have
   * @returns Array of entity IDs matching the query
   * @example
   * ```typescript
   * // Get all entities with position and health components
   * const entities = ecs.query('position', 'health');
   * ```
   */
  query(...componentNames: string[]): number[] {
    return Array.from(this.entities.entries())
      .filter(([_, components]) =>
        componentNames.every((name) => components.has(name))
      )
      .map(([id]) => id);
  }

  /**
   * Remove an entity and all its components
   * @param entityId - The entity to remove
   */
  removeEntity(entityId: number): void {
    const components = this.entities.get(entityId);
    if (components) {
      for (const name of components) {
        this.components.get(name)?.delete(entityId);
      }
      this.entities.delete(entityId);
    }
  }
}
