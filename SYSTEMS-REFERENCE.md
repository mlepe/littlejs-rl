# ECS Systems Reference

## Overview

This document provides a comprehensive reference for all ECS systems in the game. Systems are pure functions that process entities with specific components.

**Key Principle:** Systems contain game logic, components contain data.

---

## Core Systems

### renderSystem

**Signature:** `renderSystem(ecs: ECS): void`

**Purpose:** Renders all entities that have position and render components.

**Components Used:**

- `PositionComponent` (read)
- `RenderComponent` (read)
- `LocationComponent` (read - optional, for filtering)

**Description:**
Iterates through all entities with position and render components, using LittleJS's `drawTile()` to render each entity at their current position. Only renders entities in the current location.

**Called:** Every frame in `Game.renderPost()`

**Example:**

```typescript
function renderPost() {
  renderSystem(ecs); // Renders all visible entities
}
```

---

### movementSystem

**Signature:** `movementSystem(ecs: ECS, dx: number, dy: number): void`

**Purpose:** Generic movement system for testing. Moves all entities with position and movable components.

**Components Used:**

- `PositionComponent` (read/write)
- `MovableComponent` (read)

**Description:**
Rarely used in production. Mainly for testing or debugging. Use `playerMovementSystem` or `aiSystem` instead.

**Called:** Rarely (testing only)

---

### cameraSystem

**Signature:** `cameraSystem(ecs: ECS): void`

**Purpose:** Updates camera to follow player with zoom support.

**Components Used:**

- `PlayerComponent` (read)
- `PositionComponent` (read)
- `InputComponent` (read)

**Description:**
Smoothly follows player position. Handles zoom in/out via keyboard input (Z/C keys). Maintains camera bounds within location.

**Called:** Every frame in `Game.update()` (outside turn-based block)

**Example:**

```typescript
function update() {
  cameraSystem(ecs); // Camera responds immediately, not turn-based
}
```

---

## Player Systems

### inputSystem

**Signature:** `inputSystem(ecs: ECS): void`

**Purpose:** Captures keyboard input and stores in InputComponent.

**Components Used:**

- `PlayerComponent` (read)
- `InputComponent` (write)

**Description:**
Polls keyboard state using LittleJS's `keyIsDown()` and `keyWasPressed()`. Updates InputComponent with movement directions, actions, and mode toggles.

**Input Mappings:**

- Arrow keys / WASD: Movement
- M: Toggle world map
- I: Toggle inventory
- X: Toggle examine mode
- U: Use item
- Z/C: Zoom in/out
- F1: Toggle collision overlay
- F2: Toggle debug text

**Called:** Every frame in `Game.update()` (before turn-based block)

---

### playerMovementSystem

**Signature:** `playerMovementSystem(ecs: ECS): void`

**Purpose:** Moves player based on input and stats.

**Components Used:**

- `PlayerComponent` (read)
- `PositionComponent` (read/write)
- `InputComponent` (read)
- `StatsComponent` (read)
- `LocationComponent` (read)

**Description:**
Processes InputComponent to move player. Checks walkability before moving. Respects turn-based timing. Considers player speed stat for movement frequency.

**Called:** Every turn in `Game.update()` (LOCATION mode only)

**Example:**

```typescript
if (shouldProcessTurn && viewMode === ViewMode.LOCATION) {
  playerMovementSystem(ecs);
}
```

---

### pickupSystem

**Signature:** `pickupSystem(ecs: ECS): void`

**Purpose:** Auto-pickup items when player walks over them.

**Components Used:**

- `PlayerComponent` (read)
- `PositionComponent` (read)
- `LocationComponent` (read)
- `InventoryComponent` (read/write)
- `ItemComponent` (read)

**Description:**
Checks for items at player position. Adds items to player inventory if there's capacity. Removes picked-up items from location. Shows feedback message.

**Called:** Every turn in `Game.update()` (LOCATION mode, before movement)

---

## AI Systems

### aiSystem

**Signature:** `aiSystem(ecs: ECS, playerId: number): void`

**Purpose:** Processes AI behaviors for NPCs and enemies.

**Components Used:**

- `AIComponent` (read/write)
- `PositionComponent` (read/write)
- `LocationComponent` (read)
- `RelationComponent` (read)

**Description:**
Handles multiple AI types:

- **Passive**: Wanders randomly, never attacks
- **Aggressive**: Pursues and attacks player if in range
- **Patrol**: Patrols area, attacks if provoked
- **Fleeing**: Runs away from player

Uses relation scores to determine hostility. Updates AI state (idle, pursuing, attacking, fleeing).

**Called:** Every turn in `Game.update()` (LOCATION mode)

**Example:**

```typescript
if (shouldProcessTurn) {
  aiSystem(ecs, playerId); // Process all NPC/enemy behaviors
}
```

---

### relationSystem

**Signature:** `relationSystem(ecs: ECS, entityId: number, targetEntityId: number, scoreDelta: number): void`

**Purpose:** Updates relationship scores between entities.

**Components Used:**

- `RelationComponent` (read/write)

**Description:**
Modifies the relationship score that `entityId` has toward `targetEntityId`. Clamps score between min and max bounds. This is **event-driven** - call when actions affect relationships (combat, gifts, quests, etc.).

**Called:** On-demand (combat, interactions, events)

**Example:**

```typescript
// Player attacks enemy - enemy now dislikes player
relationSystem(ecs, enemyId, playerId, -15);

// Player gives gift to NPC - NPC likes player more
relationSystem(ecs, npcId, playerId, 10);
```

---

### getRelationScore

**Signature:** `getRelationScore(ecs: ECS, entityId: number, targetEntityId: number): number | undefined`

**Purpose:** Query relationship score from one entity to another.

**Components Used:**

- `RelationComponent` (read)

**Description:**
Helper function to retrieve relation score. Returns `undefined` if no relation exists.

**Example:**

```typescript
const npcAttitude = getRelationScore(ecs, npcId, playerId);
if (npcAttitude !== undefined && npcAttitude > 50) {
  console.log('NPC is friendly!');
}
```

---

## Combat Systems

### collisionSystem

**Signature:** `collisionSystem(ecs: ECS): void`

**Purpose:** Prevents entity overlaps and handles collision detection.

**Components Used:**

- `PositionComponent` (read/write)
- `MovableComponent` (read)

**Description:**
Detects when entities occupy the same tile. Prevents overlapping by moving entities back. Foundation for combat and interaction systems.

**Called:** After movement systems

---

### collisionDamageSystem

**Signature:** `collisionDamageSystem(ecs: ECS): void`

**Purpose:** Applies damage when entities collide.

**Components Used:**

- `PositionComponent` (read)
- `HealthComponent` (read/write)
- `StatsComponent` (read)
- `LocationComponent` (read)

**Description:**
Simple collision-based combat. When entities occupy same tile, applies damage based on strength vs defense. Used for testing and basic encounters.

**Called:** Every turn in `Game.update()` (LOCATION mode)

---

### combatSystem

**Signature:** `combatSystem(ecs: ECS): void`

**Purpose:** Handles melee attacks and combat interactions.

**Components Used:**

- `PositionComponent` (read)
- `HealthComponent` (read/write)
- `StatsComponent` (read)
- `ElementalDamageComponent` (read)
- `ElementalResistanceComponent` (read)
- `StatusEffectComponent` (write)

**Description:**
Full-featured combat system with elemental damage, resistances, and status effects. Calculates damage, applies effects, triggers death events.

**Called:** During combat actions

---

### deathSystem

**Signature:** `deathSystem(ecs: ECS): void`

**Purpose:** Handles entity death and loot drops.

**Components Used:**

- `HealthComponent` (read)
- `PositionComponent` (read)
- `LootTableComponent` (read)
- `LocationComponent` (read)

**Description:**
Checks for entities with health <= 0. Spawns loot from loot table. Destroys dead entity. Shows death message.

**Called:** Every turn in `Game.update()` (after combat)

**Example:**

```typescript
if (shouldProcessTurn) {
  collisionDamageSystem(ecs);
  combatSystem(ecs);
  deathSystem(ecs); // Clean up dead entities
}
```

---

## Stat & Effect Systems

### derivedStatsSystem

**Signature:** `derivedStatsSystem(ecs: ECS): void`

**Purpose:** Calculates derived stats from base stats.

**Components Used:**

- `StatsComponent` (read/write)

**Description:**
Computes secondary stats like:

- Max HP from Toughness
- Max MP from Willpower
- Attack from Strength + Weapon
- Defense from Armor + Dexterity

**Called:** After stat changes (level up, equipment, buffs)

---

### statModifierSystem

**Signature:** `statModifierSystem(ecs: ECS): void`

**Purpose:** Applies temporary stat modifications.

**Components Used:**

- `StatsComponent` (write)
- `StatModifierComponent` (read/write)

**Description:**
Applies buffs/debuffs with durations. Updates modifier durations, removes expired modifiers. Applies modifier values to stats.

**Called:** Every turn or on stat change

---

### statusEffectSystem

**Signature:** `statusEffectSystem(ecs: ECS): void`

**Purpose:** Updates status effects (burn, freeze, poison, etc.).

**Components Used:**

- `StatusEffectComponent` (read/write)
- `HealthComponent` (read/write)

**Description:**
Processes ongoing effects like:

- **Burn**: Damage over time
- **Freeze**: Movement disabled
- **Poison**: Gradual damage
- **Stun**: Action disabled

Updates durations, removes expired effects, applies effect damage.

**Called:** Every turn

---

### elementalDamageSystem

**Signature:** `elementalDamageSystem(ecs: ECS): void`

**Purpose:** Handles elemental damage calculations.

**Components Used:**

- `ElementalDamageComponent` (read)
- `ElementalResistanceComponent` (read)
- `HealthComponent` (write)

**Description:**
Calculates damage with elemental modifiers. Applies resistances. Triggers status effects based on element type (fire → burn, cold → freeze).

**Called:** During damage application

---

### raceSystem

**Signature:** `raceSystem(ecs: ECS): void`

**Purpose:** Applies racial bonuses to stats.

**Components Used:**

- `RaceComponent` (read)
- `StatsComponent` (write)

**Description:**
Applies racial modifiers from data (e.g., Elves get +2 Dexterity, Orcs get +2 Strength). Called once at entity creation or race change.

**Called:** On entity creation, race change

---

### classSystem

**Signature:** `classSystem(ecs: ECS): void`

**Purpose:** Applies class bonuses to stats.

**Components Used:**

- `ClassComponent` (read)
- `StatsComponent` (write)

**Description:**
Applies class modifiers from data (e.g., Warriors get +HP, Mages get +MP). Called once at entity creation or class change.

**Called:** On entity creation, class change

---

## Item & Inventory Systems

### inventorySystem

**Signature:** Various functions (addItemToInventory, removeItemFromInventory, dropItem, etc.)

**Purpose:** Manages inventory operations.

**Components Used:**

- `InventoryComponent` (read/write)
- `ItemComponent` (read)

**Description:**
Provides functions for:

- Adding items to inventory
- Removing items
- Dropping items to ground
- Checking carry capacity
- Stacking identical items

**Called:** On-demand (pickup, drop, use)

**Example:**

```typescript
import { addItemToInventory, dropItem } from './systems/inventorySystem';

// Add item
const success = addItemToInventory(ecs, playerId, itemId);

// Drop item
dropItem(ecs, playerId, itemId);
```

---

### inventoryUISystem

**Signature:** `inventoryUISystem(ecs: ECS, playerId: number): void`

**Purpose:** Renders inventory UI.

**Components Used:**

- `InventoryComponent` (read)
- `InventoryUIComponent` (read/write)
- `ItemComponent` (read)

**Description:**
Displays inventory contents, selected item, equipment slots, item details. Handles UI navigation (arrow keys). Shows item stats and effects.

**Called:** Every frame in `Game.renderPost()` (INVENTORY mode only)

**Example:**

```typescript
if (viewMode === ViewMode.INVENTORY) {
  inventoryUISystem(ecs, playerId);
}
```

---

### equipmentSystem

**Signature:** `equipmentSystem(ecs: ECS): void`

**Purpose:** Handles equipment and unequipment of items.

**Components Used:**

- `InventoryComponent` (read)
- `EquipmentComponent` (read/write)
- `ItemComponent` (read)
- `StatsComponent` (write)

**Description:**
Equips items to slots (weapon, armor, accessory). Applies item stat bonuses. Unequips previous item in slot. Updates character stats.

**Called:** On equip/unequip action

---

### identificationSystem

**Signature:** `identificationSystem(ecs: ECS): void`

**Purpose:** Auto-identifies items based on intelligence.

**Components Used:**

- `InventoryComponent` (read)
- `IdentificationComponent` (read/write)
- `StatsComponent` (read)

**Description:**
Gradually identifies items in inventory. Higher intelligence = faster identification. Progresses from unidentified → partial → full.

**Called:** Every turn in `Game.update()`

---

### itemUsageSystem

**Signature:** `itemUsageSystem(ecs: ECS): void`

**Purpose:** Handles using consumable items.

**Components Used:**

- `ConsumableComponent` (read/write)
- `HealthComponent` (write)
- `StatusEffectComponent` (write)

**Description:**
Processes consumable effects (healing, buffs, teleport). Decrements uses. Destroys empty consumables. Shows feedback message.

**Called:** On item use action

---

### itemUsageInputSystem

**Signature:** `itemUsageInputSystem(ecs: ECS): void`

**Purpose:** Captures 'U' key press for using items.

**Components Used:**

- `PlayerComponent` (read)
- `InputComponent` (read/write)

**Description:**
Detects U key press. Sets useItem flag in InputComponent. Opens item selection UI or uses last-selected item.

**Called:** Every frame in `Game.update()`

---

### itemGenerationSystem

**Functions:** `generateItem(ecs: ECS, itemId: string): number`

**Purpose:** Generates items from data templates.

**Components Used:**

- Creates: `ItemComponent`, `PositionComponent`, etc.

**Description:**
Spawns items from JSON definitions. Applies templates (base + modifiers). Randomizes properties (quality, charges). Returns entity ID.

**Called:** On-demand (loot drops, shop spawning)

**Example:**

```typescript
const swordId = generateItem(ecs, 'iron_sword');
dropItemAtPosition(ecs, swordId, x, y, worldX, worldY);
```

---

### lootSystem

**Functions:** `dropItemAtPosition(ecs, itemId, x, y, worldX, worldY)`, `generateLoot(ecs, lootTableId)`

**Purpose:** Handles loot drops and item placement.

**Components Used:**

- `LootTableComponent` (read)
- `PositionComponent` (write)
- `LocationComponent` (write)

**Description:**
Drops items at specific positions. Generates loot from loot tables. Handles item scattering for multiple drops.

**Called:** On enemy death, chest opening

---

### chargesSystem

**Signature:** `chargesSystem(ecs: ECS): void`

**Purpose:** Passive charge regeneration for rods/wands.

**Components Used:**

- `ChargesComponent` (read/write)

**Description:**
Regenerates charges over time. Each turn, items regain 1 charge (up to max). Allows rods/wands to recharge naturally.

**Called:** Every turn in `Game.update()`

---

## World & View Systems

### locationTransitionSystem

**Signature:** `locationTransitionSystem(ecs: ECS): void`

**Purpose:** Handles location transitions at edges.

**Components Used:**

- `PlayerComponent` (read)
- `PositionComponent` (read/write)
- `LocationComponent` (read/write)

**Description:**
Detects when player reaches location edge. Transitions to adjacent location. Spawns player at opposite edge. Updates world state.

**Called:** Every turn in `Game.update()` (after movement)

---

### worldMapMovementSystem

**Signature:** `worldMapMovementSystem(ecs: ECS): void`

**Purpose:** Handles world map cursor navigation.

**Components Used:**

- `PlayerComponent` (read)
- `InputComponent` (read)
- `ViewModeComponent` (read/write)

**Description:**
Moves cursor on world map. Allows selecting destinations. Pressing Enter travels to selected location.

**Called:** Every turn in `Game.update()` (WORLD_MAP mode only)

---

### viewModeTransitionSystem

**Signature:** `viewModeTransitionSystem(ecs: ECS): void`

**Purpose:** Switches between view modes.

**Components Used:**

- `PlayerComponent` (read)
- `InputComponent` (read)
- `ViewModeComponent` (read/write)

**Description:**
Handles mode transitions (location, world_map, inventory, examine). Stores previous mode for ESC key. Initializes mode-specific state (cursor positions).

**Called:** Every frame in `Game.update()` (outside turn-based block for immediate response)

**Example:**

```typescript
function update() {
  inputSystem(ecs);
  viewModeTransitionSystem(ecs); // Immediate response to mode changes

  if (shouldProcessTurn) {
    const viewMode = getPlayerViewMode(ecs, playerId);
    // Route to appropriate systems...
  }
}
```

---

### examineSystem

**Signature:** `examineSystem(ecs: ECS, x: number, y: number): ExamineData`

**Purpose:** Gathers information about entities/tiles at cursor.

**Components Used:**

- `PositionComponent` (read)
- `HealthComponent` (read)
- `StatsComponent` (read)
- `AIComponent` (read)

**Description:**
Collects data about entities at target position. Retrieves tile info. Returns structured data for display.

**Called:** Every frame in `Game.renderPost()` (EXAMINE mode)

**Returns:** `{ entities: EntityInfo[], tile: TileInfo }`

---

### examineCursorMovementSystem

**Signature:** `examineCursorMovementSystem(ecs: ECS): void`

**Purpose:** Handles examine mode cursor movement.

**Components Used:**

- `PlayerComponent` (read)
- `InputComponent` (read)
- `ViewModeComponent` (read/write)

**Description:**
Moves examine cursor based on input. Clamps cursor to location bounds. Updates cursor position in ViewModeComponent.

**Called:** Every turn in `Game.update()` (EXAMINE mode only)

---

### examineRenderSystem

**Signature:** `examineRenderSystem(x: number, y: number, data: ExamineData): void`

**Purpose:** Renders examine mode UI overlays.

**Components Used:**

- None (pure rendering)

**Description:**
Draws cursor highlight at target position. Displays info panel with entity details. Shows health bars, stats, descriptions.

**Called:** Every frame in `Game.renderPost()` (EXAMINE mode)

**Example:**

```typescript
if (viewMode === ViewMode.EXAMINE) {
  const data = examineSystem(ecs, cursorX, cursorY);
  examineRenderSystem(cursorX, cursorY, data);
}
```

---

## Spatial Systems

### getEntitiesAt

**Signature:** `getEntitiesAt(ecs: ECS, x: number, y: number, worldX?: number, worldY?: number): number[]`

**Purpose:** Get all entities at a specific position.

**Components Used:**

- `PositionComponent` (read)
- `LocationComponent` (read - optional)

**Description:**
Returns array of entity IDs at target coordinates. Optionally filters by location.

---

### getEntitiesInRadius

**Signature:** `getEntitiesInRadius(ecs: ECS, x: number, y: number, radius: number, worldX?: number, worldY?: number): number[]`

**Purpose:** Get all entities within a radius.

**Components Used:**

- `PositionComponent` (read)
- `LocationComponent` (read - optional)

**Description:**
Returns entities within circular radius from center point. Useful for area effects, perception checks.

---

### getEntitiesInLocation

**Signature:** `getEntitiesInLocation(ecs: ECS, worldX: number, worldY: number): number[]`

**Purpose:** Get all entities in a location.

**Components Used:**

- `LocationComponent` (read)

**Description:**
Returns all entity IDs in specified world location. Used for location management, entity queries.

---

### isPositionOccupied

**Signature:** `isPositionOccupied(ecs: ECS, x: number, y: number, worldX?: number, worldY?: number): boolean`

**Purpose:** Check if a position has any entities.

**Components Used:**

- `PositionComponent` (read)
- `LocationComponent` (read - optional)

**Description:**
Returns true if any entity occupies the tile. Used for collision detection, pathfinding.

---

### getNearestEntity

**Signature:** `getNearestEntity(ecs: ECS, x: number, y: number, maxDistance?: number, worldX?: number, worldY?: number): number | null`

**Purpose:** Find nearest entity to a position.

**Components Used:**

- `PositionComponent` (read)
- `LocationComponent` (read - optional)

**Description:**
Returns entity ID of closest entity. Optionally limits search to max distance. Used for targeting, AI awareness.

---

## System Execution Order

### Every Frame (Non-Turn-Based)

1. `inputSystem(ecs)` - Capture input
2. `itemUsageInputSystem(ecs)` - U key handling
3. `viewModeTransitionSystem(ecs)` - Mode switching
4. `cameraSystem(ecs)` - Camera follow

### Every Turn (Turn-Based)

#### LOCATION Mode

1. `pickupSystem(ecs)` - Auto-pickup
2. `playerMovementSystem(ecs)` - Player moves
3. `locationTransitionSystem(ecs)` - Location edges
4. `chargesSystem(ecs)` - Charge regen
5. `identificationSystem(ecs)` - Auto-identify
6. `collisionDamageSystem(ecs)` - Combat
7. `aiSystem(ecs, playerId)` - NPC behaviors
8. `deathSystem(ecs)` - Clean up deaths

#### WORLD_MAP Mode

1. `worldMapMovementSystem(ecs)` - Navigate map

#### EXAMINE Mode

1. `examineCursorMovementSystem(ecs)` - Move cursor

### Render Phase

1. `location.render()` - Tiles (automatic)
2. `renderSystem(ecs)` - Entities
3. Mode-specific UI:
   - `inventoryUISystem(ecs, playerId)` (INVENTORY mode)
   - `examineRenderSystem(...)` (EXAMINE mode)
4. Debug info (if enabled)

---

## Adding New Systems

### System Template

```typescript
/**
 * Brief description of what this system does
 * @param ecs - The ECS instance
 * @param ...params - Additional parameters
 */
export function myNewSystem(ecs: ECS, ...params: any[]): void {
  // Query entities with required components
  const entities = ecs.query('component1', 'component2');

  for (const entityId of entities) {
    // Get components
    const comp1 = ecs.getComponent<Component1>(entityId, 'component1');
    const comp2 = ecs.getComponent<Component2>(entityId, 'component2');

    if (!comp1 || !comp2) continue;

    // System logic here
    comp1.value = comp2.value * 2;
  }
}
```

### Integration Steps

1. Create system file in `src/ts/systems/`
2. Export from `src/ts/systems/index.ts`
3. Import in `src/ts/game.ts`
4. Call in appropriate game loop phase
5. Document in this file

---

## Related Documentation

- `ARCHITECTURE.md` - Overall architecture
- `COMPONENTS-REFERENCE.md` - All components
- `VIEW-MODES.md` - View mode system
- `ITEM-SYSTEM.md` - Inventory and items
- `ELEMENTAL-SYSTEM.md` - Combat and elements
- `DISPOSITION-SYSTEM.md` - AI behaviors
