# LittleJS Roguelike - Development Prompts

This file contains reusable prompts for quickly creating new systems, components, and entities in the game.

---

## 📦 Create a New Component

```
Create a new ECS component in src/ts/components/ with the following:

Component Name: [ComponentName]
Purpose: [Brief description of what this component tracks]
Properties:
- [propertyName]: [type] - [description]
- [propertyName]: [type] - [description]

Requirements:
1. Create src/ts/components/[componentName].ts with proper file header
2. Define [ComponentName]Component interface with JSDoc documentation
3. Export the interface
4. Add export to src/ts/components/index.ts
5. Follow the project's TypeScript strict mode standards
6. Include usage example in JSDoc if complex

Example values: [if applicable]
```

**Example Usage:**
```
Create a new ECS component in src/ts/components/ with the following:

Component Name: Inventory
Purpose: Tracks items carried by an entity
Properties:
- items: number[] - Array of item entity IDs
- maxCapacity: number - Maximum number of items
- weight: number - Current total weight

Requirements:
1. Create src/ts/components/inventory.ts with proper file header
2. Define InventoryComponent interface with JSDoc documentation
3. Export the interface
4. Add export to src/ts/components/index.ts
5. Follow the project's TypeScript strict mode standards
6. Include usage example in JSDoc if complex
```

---

## ⚙️ Create a New System

```
Create a new ECS system in src/ts/systems/ with the following:

System Name: [systemName]System
Purpose: [What this system does and when it runs]
Required Components: [component1, component2, ...]
Optional Components: [component3, ...]
Parameters:
- ecs: ECS
- [paramName]: [type] - [description]

Behavior:
[Detailed description of what the system does each frame/update]

Requirements:
1. Create src/ts/systems/[systemName]System.ts with proper file header
2. Implement system as a pure function
3. Query entities with required components
4. Handle undefined components safely
5. Add comprehensive JSDoc with @param, @example
6. Export function
7. Add export to src/ts/systems/index.ts
8. Keep cognitive complexity under 15
9. Follow ESLint rules (use for...of, not forEach)

Integration:
- Call in game loop at: [gameUpdate/gameRender/gameUpdatePost/etc.]
- Call order: [before/after which other systems]
```

**Example Usage:**
```
Create a new ECS system in src/ts/systems/ with the following:

System Name: combatSystem
Purpose: Handles melee combat between entities
Required Components: position, health, stats
Optional Components: ai, player
Parameters:
- ecs: ECS
- currentLocation: Location

Behavior:
For each entity with position, health, and stats:
1. Check for other entities at the same position
2. If entities are hostile (check ai.type or player tag), calculate damage
3. Damage = attacker.stats.strength - defender.stats.defense (min 1)
4. Reduce defender.health.current by damage amount
5. If health <= 0, mark entity for removal
6. Update ai.state to 'attacking' during combat

Requirements:
1. Create src/ts/systems/combatSystem.ts with proper file header
2. Implement system as a pure function
3. Query entities with required components
4. Handle undefined components safely
5. Add comprehensive JSDoc with @param, @example
6. Export function
7. Add export to src/ts/systems/index.ts
8. Keep cognitive complexity under 15
9. Follow ESLint rules (use for...of, not forEach)

Integration:
- Call in game loop at: gameUpdate
- Call order: after playerMovementSystem and aiSystem, before renderSystem
```

---

## 🎮 Create a New Entity Factory

```
Create a new entity factory function in src/ts/entities.ts with the following:

Entity Name: [EntityName]
Purpose: [What this entity represents in the game]
Components:
- [componentName]: { [properties with values] }
- [componentName]: { [properties with values] }

Visual:
- Color: [LJS.Color or rgb values]
- Size: [Vector2 dimensions]
- Sprite: [description or index]

Stats (if applicable):
- Health: [current/max]
- Strength: [value]
- Defense: [value]
- Speed: [value]

AI Behavior (if applicable):
- Type: [passive/aggressive/fleeing/patrol]
- Detection Range: [tiles]

Requirements:
1. Add function to src/ts/entities.ts after existing factories
2. Follow naming: create[EntityName]()
3. Parameters: (ecs: ECS, x: number, y: number, worldX: number, worldY: number)
4. Return: number (entity ID)
5. Add comprehensive JSDoc with description, @param, @returns, @example
6. Add all required components in logical order:
   - Position/Location first
   - Core components (health, stats)
   - Behavior components (ai, input)
   - Visual components (render)
   - Capability components (movable)
7. Use LJS.* prefix for LittleJS types
8. Follow existing entity factory patterns

Special Behaviors:
[Any unique behaviors or notes]
```

**Example Usage:**
```
Create a new entity factory function in src/ts/entities.ts with the following:

Entity Name: Merchant
Purpose: A friendly NPC that can trade items with the player
Components:
- position: { x, y }
- location: { worldX, worldY }
- health: { current: 80, max: 80 }
- stats: { strength: 3, defense: 5, speed: 0 }
- ai: { type: 'passive', detectionRange: 5, state: 'idle' }
- render: { tileInfo, color, size }
- movable: { speed: 0 }
- inventory: { items: [], maxCapacity: 20, weight: 0 }

Visual:
- Color: Blue (LJS.Color(0, 0.5, 1))
- Size: 1x1
- Sprite: merchant sprite

Stats:
- Health: 80/80
- Strength: 3
- Defense: 5
- Speed: 0 (stationary)

AI Behavior:
- Type: passive
- Detection Range: 5 tiles

Requirements:
1. Add function to src/ts/entities.ts after existing factories
2. Follow naming: createMerchant()
3. Parameters: (ecs: ECS, x: number, y: number, worldX: number, worldY: number)
4. Return: number (entity ID)
5. Add comprehensive JSDoc with description, @param, @returns, @example
6. Add all required components in logical order
7. Use LJS.* prefix for LittleJS types
8. Follow existing entity factory patterns

Special Behaviors:
- Does not move (speed: 0)
- Has inventory component for trading
- Friendly to player
```

---

## 🎯 Quick Reference

### System Call Order in Game Loop

```typescript
// gameUpdate()
inputSystem(ecs);              // 1. Capture input
playerMovementSystem(ecs);     // 2. Move player
aiSystem(ecs, playerId);       // 3. AI behaviors
// combatSystem(ecs, location) // 4. Combat resolution
// collisionSystem(ecs)        // 5. Collision detection

// gameRender()
renderSystem(ecs);             // 6. Render entities

// gameRenderPost()
// uiSystem(ecs)               // 7. UI/HUD rendering
```

### Common Component Patterns

**Tag Component** (no data, just marks entity type):
```typescript
export interface [Name]Component {
  is[Name]: true;
}
```

**Data Component** (stores state):
```typescript
export interface [Name]Component {
  property1: type;
  property2: type;
}
```

**Reference Component** (points to other entities):
```typescript
export interface [Name]Component {
  targetEntityId?: number;
  relatedEntities: number[];
}
```

### System Patterns

**Query and Process**:
```typescript
export function [name]System(ecs: ECS, ...params): void {
  const entities = ecs.query('component1', 'component2');
  
  for (const id of entities) {
    const comp1 = ecs.getComponent<Component1>(id, 'component1');
    const comp2 = ecs.getComponent<Component2>(id, 'component2');
    
    if (!comp1 || !comp2) continue;
    
    // Process logic here
  }
}
```

**With Spatial Queries**:
```typescript
import { getEntitiesAt, getEntitiesInRadius } from './spatialSystem';

export function [name]System(ecs: ECS, worldX: number, worldY: number): void {
  const entities = ecs.query('position', 'component');
  
  for (const id of entities) {
    const pos = ecs.getComponent<PositionComponent>(id, 'position');
    if (!pos) continue;
    
    // Find nearby entities
    const nearby = getEntitiesInRadius(ecs, pos.x, pos.y, 5, worldX, worldY);
    
    // Process interactions
  }
}
```

### Entity Factory Pattern

```typescript
export function create[Name](
  ecs: ECS,
  x: number,
  y: number,
  worldX: number,
  worldY: number
): number {
  const entityId = ecs.createEntity();
  
  // Core components
  ecs.addComponent<PositionComponent>(entityId, 'position', { x, y });
  ecs.addComponent<LocationComponent>(entityId, 'location', { worldX, worldY });
  
  // Gameplay components
  ecs.addComponent<HealthComponent>(entityId, 'health', { current: X, max: X });
  ecs.addComponent<StatsComponent>(entityId, 'stats', { strength: X, defense: X, speed: X });
  
  // Behavior components
  ecs.addComponent<AIComponent>(entityId, 'ai', { type: 'X', detectionRange: X, state: 'idle' });
  
  // Visual components
  ecs.addComponent<RenderComponent>(entityId, 'render', {
    tileInfo: new LJS.TileInfo(/* sprite */),
    color: new LJS.Color(r, g, b),
    size: new LJS.Vector2(w, h),
  });
  
  // Capability components
  ecs.addComponent<MovableComponent>(entityId, 'movable', { speed: X });
  
  return entityId;
}
```

---

## 📚 Additional Notes

### File Header Template
All new files should include this header (update dates accordingly):

```typescript
/*
 * File: [filename].ts
 * Project: littlejs-rl
 * File Created: [current date and time]
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: [current date and time]
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */
```

### JSDoc Best Practices

- Always include a summary description
- Use `@param` for all parameters with type and description
- Use `@returns` for return values
- Include `@example` for complex functions
- Use proper TypeScript types in JSDoc
- Add inline comments for complex logic

### Testing New Features

After creating new components/systems/entities:
1. Build: `npm run build`
2. Test: `npm run dev`
3. Verify no TypeScript errors
4. Check debug overlay (GAME_DEBUG=true)
5. Test in-game behavior

---

**Last Updated:** November 12, 2025
