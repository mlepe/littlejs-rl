# Item System Integration - v0.7.0

## Overview

This document summarizes the complete integration of the item system into the game loop, including data loading, usage mechanics, collision-based combat, and auto-identification.

## Completed Features

### 1. ItemRegistry (Data Loading)

Created `src/ts/data/itemRegistry.ts` - a registry system for loading and managing items from JSON files.

**Key Features:**

- Loads item templates from `src/data/base/items/base_items.json` (31 items)
- Loads item properties from `src/data/base/items/item_properties.json` (16 items with components)
- Provides `spawn(ecs, templateId)` method to create fully configured items
- Automatically applies ConsumableComponent and ChargesComponent based on properties
- Exports item query methods: `get()`, `has()`, `getByType()`, `getAllIds()`

**Usage Example:**

```typescript
const registry = ItemRegistry.getInstance();
const potionId = registry.spawn(ecs, 'health_potion');
// Creates item with:
// - ItemComponent: name="Health Potion", weight=0.5, value=25, itemType="potion"
// - ConsumableComponent: effect="heal", power=50
```

**Integration:**

- Exported from `src/ts/data/index.ts`
- Loaded by DataLoader in `loadAllData()` via `loadFromFiles()`
- Used by `generateItem()` in itemGenerationSystem

### 2. generateItem() Enhancement

Updated `src/ts/systems/itemGenerationSystem.ts` to use ItemRegistry.

**Changes:**

- First tries to spawn from ItemRegistry
- Applies options (quality, bless/curse, identification, quantity) to spawned items
- Falls back to placeholder creation if template not found
- Logs warnings for missing templates

**Before:** Created placeholder items with hardcoded properties  
**After:** Loads complete item data from JSON files

### 3. Charges System Integration

Added `chargesSystem` to game loop for passive recharge mechanics.

**Location:** After `cameraSystem`, before `identificationSystem`

**Functionality:**

- Processes all entities with `charges` component
- Accumulates `rechargeProgress` based on `rechargeRate * timeDelta`
- Adds charge when progress >= 1.0 (capped at max)
- Only applies to rechargeable items (rods, wands)

**Example:** Rod with `rechargeRate: 0.05` gains 1 charge every 20 seconds

### 4. Identification System Integration

Added `identificationSystem` to game loop for auto-identification based on intelligence.

**Location:** After `chargesSystem`, before `collisionDamageSystem`

**Functionality:**

- Queries entities with `identification` + `inventory` components
- Accumulates identification progress: `autoIdentifyRate * timeDelta`
- Thresholds: 100 = partial identification, 200 = full identification
- Player `autoIdentifyRate = intelligence * 0.1`
- Cleans up progress for items no longer in inventory

**Example:** Player with intelligence 10 (rate = 1.0/sec) identifies items in ~200 seconds

### 5. Collision Damage System

Created `src/ts/systems/collisionDamageSystem.ts` for simple combat testing.

**Location:** After `identificationSystem`, before `aiSystem`

**Functionality:**

- Builds position map: `Map<"x,y", entityId[]>`
- Detects entities at same tile coordinates
- Filters for player/enemy combinations
- Checks AI disposition (aggressive/hostile/defensive)
- Applies mutual damage when combatants overlap
- Damage formula: `max(1, strength - defense * 0.1)`
- Logs combat events: `[Combat] Attacker dealt X damage to Defender (HP/MaxHP remaining)`

**Validated Hostile Dispositions:**

- `aggressive`: Attacks if relation < 0
- `hostile`: Attacks unless relation > 10
- `defensive`: Attacks if relation < -40

**Example:** Player (strength 10) vs Enemy (defense 5)  
Damage = `max(1, 10 - 5 * 0.1) = max(1, 9.5) = 9`

### 6. Test Item Spawning

Refactored `spawnTestItems()` in Game class to use data system.

**Changes:**

- Removed 49 lines of hardcoded ItemComponent creation
- Now uses `generateItem(ecs, templateId)` with data IDs
- Spawns 4 items: `health_potion`, `bread`, `scroll_fireball`, `iron_sword`
- Each at `playerX + 2` with Y offsets (0-3)
- Calls `dropItemAtPosition()` for proper location/collision setup
- Logs spawned item names from component data

**Before (91 lines):** Manual ItemComponent creation with hardcoded values  
**After (42 lines):** Data-driven approach with clean loop

## Game Loop Order

```typescript
function update() {
  inputSystem(ecs); // Capture player input
  handleDebugToggles(); // Process debug keys
  pickupSystem(ecs, playerId); // Pickup ground items (G key)
  playerMovementSystem(ecs); // Move player
  cameraSystem(ecs, playerId); // Update camera
  chargesSystem(ecs); // ✅ Passive charge regeneration
  identificationSystem(ecs); // ✅ Auto-identify items
  collisionDamageSystem(ecs); // ✅ Simple collision combat
  aiSystem(ecs, playerId); // AI behaviors
  deathSystem(ecs); // Handle deaths and loot
}
```

## Data Files

### base_items.json (31 items)

Contains full item definitions:

```json
{
  "id": "health_potion",
  "name": "Health Potion",
  "description": "Restores 50 HP",
  "weight": 0.5,
  "value": 25,
  "itemType": "potion",
  "stackable": true
}
```

**Categories:**

- Potions: health, mana, stamina
- Scrolls: fireball, lightning, identify
- Weapons: iron_sword, steel_sword, wooden_staff
- Armor: leather_armor, iron_helmet, steel_helmet
- Rods/Wands: rod_lightning, wand_fireball
- Food: bread, apple
- Special: blessed_steel_helmet, cursed_ring

### item_properties.json (16 items)

Contains component data:

```json
"health_potion": {
  "consumable": {
    "effect": "heal",
    "power": 50
  }
}
```

**Component Types:**

- **Consumable:** effect, power, duration, requiresTarget, targetRange, areaOfEffect, consumeOnUse
- **Charges:** current, max, rechargeable, deleteWhenEmpty, rechargeRate

## System Statistics

**Files Created:**

- `src/ts/data/itemRegistry.ts` (267 lines)
- `src/ts/systems/collisionDamageSystem.ts` (219 lines)

**Files Modified:**

- `src/ts/data/dataLoader.ts` - Added ItemRegistry loading
- `src/ts/data/index.ts` - Exported ItemRegistry
- `src/ts/systems/itemGenerationSystem.ts` - Enhanced generateItem()
- `src/ts/game.ts` - Integrated 3 systems, refactored spawnTestItems

**Build Size:** 848 KiB bundle (compiled successfully)

## Testing Checklist

### ✅ Completed

- [x] Build succeeds without errors
- [x] ItemRegistry loads 31 items from base_items.json
- [x] ItemRegistry loads 16 item properties
- [x] Systems exported from index
- [x] Systems integrated into game loop
- [x] spawnTestItems uses data system

### 🔄 Next Steps

- [ ] Run game and verify items spawn correctly
- [ ] Test pickup (G key) with spawned items
- [ ] Walk into enemy to trigger collision combat
- [ ] Verify combat damage calculations and logs
- [ ] Wait for charge regeneration (rod/wand)
- [ ] Wait for auto-identification progress
- [ ] Add item usage input (U key for use item)
- [ ] Test consumable effects (heal, damage, buffs)
- [ ] Verify item stacking for stackable items
- [ ] Test loot drops from killed enemies

## Known Limitations

1. **No item usage input yet** - Items can be picked up but not used
2. **No inventory UI** - Console logging only
3. **Simple collision combat** - No turn-based system yet
4. **Placeholder loot system** - Needs integration with generateItem()
5. **Missing consumable effects** - cure_poison, teleport, etc. marked TODO

## Next Version Goals (v0.8.0)

1. **Item Usage Input System**
   - Add U key binding for use item
   - Create item selection UI
   - Integrate with useItem() function

2. **Inventory UI**
   - Visual grid layout
   - Drag-drop for equipment
   - Identification progress bars
   - Charge counters

3. **Enhanced Combat**
   - Turn-based system
   - Attack/defense modifiers
   - Status effects
   - Combat log display

4. **Loot System Enhancement**
   - Use generateItem() in loot drops
   - Quality-based loot tables
   - Boss loot rewards

## Architecture Notes

**Data Flow:**

1. DataLoader calls ItemRegistry.loadFromFiles()
2. ItemRegistry stores templates and properties in Maps
3. generateItem() calls ItemRegistry.spawn()
4. ItemRegistry creates entity with all components
5. Game spawns items via generateItem()
6. Systems process items in game loop

**Component Separation:**

- ItemComponent: Base item data (name, weight, value, etc.)
- ConsumableComponent: Usage effects (heal, damage, buffs)
- ChargesComponent: Charge mechanics (current/max, recharge)

**System Responsibilities:**

- itemGenerationSystem: Create items from templates
- chargesSystem: Passive charge regeneration
- identificationSystem: Auto-identify based on intelligence
- collisionDamageSystem: Simple combat for testing
- itemUsageSystem: Apply consumable effects (not in loop yet)

## Version History

**v0.6.0** - Full inventory system (pickup, drop, containers, loot)  
**v0.7.0** - Item data loading and system integration (this release)  
**v0.8.0** - Item usage input and inventory UI (planned)

---

**Date:** November 16, 2025  
**Author:** Matthieu LEPERLIER  
**Status:** Integration Complete, Ready for Testing
