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

export default class ECS {
  private entities = new Map<number, Set<string>>();
  private components = new Map<string, Map<number, any>>();
  private nextEntityId = 0;

  // Create entity
  createEntity(): number {
    const id = this.nextEntityId++;
    this.entities.set(id, new Set());
    return id;
  }

  // Add component to entity
  addComponent<T>(entityId: number, componentName: string, data: T): void {
    if (!this.components.has(componentName)) {
      this.components.set(componentName, new Map());
    }
    this.components.get(componentName)!.set(entityId, data);
    this.entities.get(entityId)?.add(componentName);
  }

  // Get component data
  getComponent<T>(entityId: number, componentName: string): T | undefined {
    return this.components.get(componentName)?.get(entityId);
  }

  // Query entities with specific components
  query(...componentNames: string[]): number[] {
    return Array.from(this.entities.entries())
      .filter(([_, components]) =>
        componentNames.every((name) => components.has(name))
      )
      .map(([id]) => id);
  }

  // Remove entity
  removeEntity(entityId: number): void {
    const components = this.entities.get(entityId);
    if (components) {
      components.forEach((name) => {
        this.components.get(name)?.delete(entityId);
      });
      this.entities.delete(entityId);
    }
  }
}
