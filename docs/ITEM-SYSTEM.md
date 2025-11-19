# Core Item System Documentation

This document describes the core item system implemented in LittleJS Roguelike, including inventory management, equipment slots, item stacking, and carry weight mechanics.

## Overview

The item system is built on the ECS architecture, where items are entities with various components that define their properties and behavior. The system supports:

- **Unlimited inventory size** (only limited by carry weight)
- **Automatic item stacking** for identical items
- **Complex equipment slots** with support for multi-limbed creatures
- **Item identification system** (unidentified → partial → full)
- **Item quality levels** (negative, 0, positive)
- **Item states** (normal, blessed, cursed)
- **Item materials** affecting properties
- **Weapons and armor** with quality and identification

## Core Components

### Item Components

#### ItemComponent
Base component for all items containing core properties.

```typescript
interface ItemComponent {
  name: string;              // Display name
  type: ItemType;           // weapon, armor, potion, scroll, etc.
  description: string;       // Item description
  state: ItemState;         // normal, blessed, cursed
  material: ItemMaterial;   // iron, steel, silver, etc.
  isBroken: boolean;        // Whether item is broken
  value: number;            // Base value in currency
}
```

**Item Types:**
- `WEAPON` - Melee and ranged weapons
- `ARMOR` - Armor pieces for equipment slots
- `CONSUMABLE` - Generic consumables
- `SCROLL` - Magic scrolls
- `POTION` - Potions
- `ROD` - Magic rods/wands
- `FOOD` - Food items
- `MATERIAL` - Crafting materials
- `MISC` - Miscellaneous items

**Item States:**
- `NORMAL` - Standard item
- `BLESSED` - Improved properties/effects
- `CURSED` - Cannot be unequipped without curse removal

**Item Materials:**
- `IRON`, `STEEL`, `SILVER`, `MITHRIL` - Metal materials
- `WOOD`, `LEATHER`, `CLOTH` - Organic materials
- `CRYSTAL`, `BONE` - Special materials
- `UNKNOWN` - Unidentified material

#### WeightComponent
Defines item weight for carry capacity calculations.

```typescript
interface WeightComponent {
  weight: number;  // Weight in standard units
}
```

#### StackableComponent
Allows items to stack when they have identical properties.

```typescript
interface StackableComponent {
  quantity: number;       // Current stack quantity
  maxStackSize: number;   // Max items in stack (0 = infinite)
}
```

#### IdentificationComponent
Tracks item identification state.

```typescript
interface IdentificationComponent {
  level: IdentificationLevel;      // unidentified, partial, full
  apparentName: string;            // Name shown when not fully identified
  apparentDescription: string;     // Description when not fully identified
}
```

**Identification Levels:**
- `UNIDENTIFIED` - Completely unknown (e.g., "unknown potion")
- `PARTIAL` - Type known but not specifics (e.g., "sword" but not "steel sword +1")
- `FULL` - Completely identified

#### QualityComponent
Represents item quality/enhancement level.

```typescript
interface QualityComponent {
  level: number;  // 0 = basic, +1 = better, -1 = worse, etc.
}
```

#### EquippableComponent
Marks items that can be equipped to character slots.

```typescript
interface EquippableComponent {
  slotType: EquipmentSlotType;  // Which slot type
  isEquipped: boolean;           // Currently equipped?
  equippedBy?: number;           // Entity ID of wearer
  equippedSlotIndex?: number;    // Specific slot index
}
```

### Character Components

#### InventoryComponent
Stores items for a character with no maximum item count.

```typescript
interface InventoryComponent {
  items: number[];         // Entity IDs of items
  maxCarryWeight: number;  // Maximum weight capacity
  currentWeight: number;   // Current total weight
}
```

**Carry Weight Formula:**
```
maxCarryWeight = baseWeight + (strength * 5)
```

#### EquipmentComponent
Tracks equipped items by slot.

```typescript
interface EquipmentComponent {
  slots: EquipmentSlot[];           // Available slots
  equipped: Map<string, number>;    // Slot key → item entity ID
}
```

## Equipment Slot System

### Standard Humanoid Slots

18 equipment slots for regular bipedal, two-armed characters:

| Slot Type | Count | Indices | Examples |
|-----------|-------|---------|----------|
| HEAD | 1 | 0 | Helmets |
| FACE | 1 | 0 | Masks |
| NECK | 1 | 0 | Necklaces, amulets |
| BODY | 1 | 0 | Chest armor |
| SHOULDERS | 2 | 0-1 | Shoulder pads |
| WRISTS | 2 | 0-1 | Bracelets, vambraces |
| HANDS | 2 | 0-1 | Gloves, gauntlets |
| HAND_HELD | 2 | 0-1 | Weapons, shields |
| RINGS | 2 | 0-1 | Rings |
| BACK | 1 | 0 | Cloaks, backpacks |
| BELT | 1 | 0 | Belts |
| LEGS | 1 | 0 | Pants (1 per 2 legs) |
| FEET | 1 | 0 | Shoes (1 per 2 feet) |

### Future Support

The system is designed to support creatures with:
- Multiple heads (multiple HEAD/FACE slots)
- Multiple arms (more HAND_HELD/HANDS/WRISTS/SHOULDERS slots)
- Multiple legs (more LEGS/FEET slots)
- Future: Hierarchical body parts for dismemberment

## Core Systems

### Item Stacking System

**Functions:**
- `canItemsStack(ecs, itemId1, itemId2)` - Check if two items can stack
- `stackItems(ecs, targetId, sourceId)` - Merge two stacks
- `splitStack(ecs, itemId, quantity)` - Split stack into two

**Stacking Rules:**
Items stack if ALL properties match:
- Same item type
- Same state (normal/blessed/cursed)
- Same material
- Same broken status
- Same quality level (if present)
- Same identification level (if present)

### Carry Weight System

**Functions:**
- `calculateInventoryWeight(ecs, entityId)` - Get total inventory weight
- `updateInventoryWeight(ecs, entityId)` - Recalculate current weight
- `calculateMaxCarryWeight(base, strength, mult)` - Calculate capacity
- `updateMaxCarryWeight(ecs, entityId)` - Update based on stats
- `canCarryWeight(ecs, entityId, weight)` - Check if can carry more
- `isOverencumbered(ecs, entityId)` - Check if over capacity
- `getCarryWeightPercentage(ecs, entityId)` - Get usage percentage

### Equipment System

**Functions:**
- `equipItem(ecs, entityId, itemId, slotIndex)` - Equip item to slot
- `unequipItem(ecs, entityId, slotType, slotIndex)` - Remove equipment
- `getEquippedItem(ecs, entityId, slotType, slotIndex)` - Query slot
- `getAllEquippedItems(ecs, entityId)` - Get all equipped items
- `isSlotOccupied(ecs, entityId, slotType, slotIndex)` - Check slot
- `forceUnequipItem(ecs, entityId, slotType, slotIndex)` - Force remove cursed

**Cursed Item Behavior:**
- Can be equipped normally
- Cannot be unequipped with `unequipItem()`
- Requires `forceUnequipItem()` (after curse removal)

### Inventory System

**Functions:**
- `addItemToInventory(ecs, entityId, itemId)` - Add item (auto-stacks)
- `removeItemFromInventory(ecs, entityId, itemId)` - Remove item
- `transferItem(ecs, fromId, toId, itemId)` - Move between inventories
- `dropItem(ecs, entityId, itemId)` - Drop item (removes from inventory)
- `hasItemInInventory(ecs, entityId, itemId)` - Check if has item
- `getInventoryItemCount(ecs, entityId)` - Get item count
- `sortInventory(ecs, entityId)` - Sort by type then name

## Item Entity Factories

### Basic Item
```typescript
createItem(ecs, name, type, description, weight, value, material?, state?)
```

### Weapon
```typescript
createWeapon(
  ecs, name, description, material, weight, value,
  quality = 0,
  state = NORMAL,
  identificationLevel = FULL
)
```

### Armor
```typescript
createArmor(
  ecs, name, description, slotType, material, weight, value,
  quality = 0,
  state = NORMAL,
  identificationLevel = FULL
)
```

### Potion
```typescript
createPotion(
  ecs, name, description, weight, value,
  state = NORMAL,
  identificationLevel = UNIDENTIFIED,
  maxStackSize = 20
)
```

### Scroll
```typescript
createScroll(
  ecs, name, description, weight, value,
  state = NORMAL,
  identificationLevel = UNIDENTIFIED,
  maxStackSize = 20
)
```

### Food
```typescript
createFood(
  ecs, name, description, weight, value,
  state = NORMAL,
  maxStackSize = 20
)
```

### Material
```typescript
createMaterial(
  ecs, name, description, material, weight, value,
  maxStackSize = 100
)
```

## Usage Examples

### Create Character with Inventory

```typescript
import { InventoryComponent, EquipmentComponent, STANDARD_HUMANOID_SLOTS } from './components';

const playerId = ecs.createEntity();

// Add inventory
ecs.addComponent<InventoryComponent>(playerId, 'inventory', {
  items: [],
  maxCarryWeight: 150,
  currentWeight: 0,
});

// Add equipment
ecs.addComponent<EquipmentComponent>(playerId, 'equipment', {
  slots: STANDARD_HUMANOID_SLOTS,
  equipped: new Map(),
});

// Update carry weight based on strength
updateMaxCarryWeight(ecs, playerId);
```

### Create and Add Items

```typescript
import { createWeapon, createPotion } from './itemEntities';
import { ItemMaterial, ItemState, IdentificationLevel } from './components';
import { addItemToInventory } from './systems/inventorySystem';

// Create a +1 steel sword
const sword = createWeapon(
  ecs,
  'Steel Longsword',
  'A finely crafted longsword',
  ItemMaterial.STEEL,
  5.0,    // weight
  100,    // value
  1,      // quality: +1
  ItemState.NORMAL,
  IdentificationLevel.FULL
);

// Create an unidentified healing potion
const potion = createPotion(
  ecs,
  'Potion of Healing',
  'Restores health when consumed',
  0.5,    // weight
  20,     // value
  ItemState.BLESSED,
  IdentificationLevel.UNIDENTIFIED
);

// Add to inventory (automatically stacks duplicates)
addItemToInventory(ecs, playerId, sword);
addItemToInventory(ecs, playerId, potion);
```

### Equip Items

```typescript
import { equipItem, unequipItem } from './systems/equipmentSystem';
import { EquipmentSlotType } from './components';

// Equip sword to main hand (index 0)
equipItem(ecs, playerId, sword, 0);

// Equip shield to off hand (index 1)
equipItem(ecs, playerId, shield, 1);

// Unequip helmet
unequipItem(ecs, playerId, EquipmentSlotType.HEAD, 0);
```

### Check Carry Weight

```typescript
import { updateInventoryWeight, isOverencumbered } from './systems/carryWeightSystem';

// Update weight after changes
updateInventoryWeight(ecs, playerId);

// Check if overencumbered
if (isOverencumbered(ecs, playerId)) {
  console.log('You are carrying too much!');
}
```

### Item Stacking

```typescript
import { canItemsStack, stackItems } from './systems/itemStackingSystem';

// Check if items can stack
if (canItemsStack(ecs, potion1, potion2)) {
  // Stack potion2 into potion1
  stackItems(ecs, potion1, potion2); // potion2 entity is removed
}
```

### Cursed Items

```typescript
import { ItemState } from './components';
import { equipItem, unequipItem, forceUnequipItem } from './systems/equipmentSystem';

// Create cursed weapon
const cursedSword = createWeapon(
  ecs,
  'Cursed Blade',
  'A blade emanating dark energy',
  ItemMaterial.IRON,
  4.0, 50,
  -1, // negative quality
  ItemState.CURSED
);

// Equip it
equipItem(ecs, playerId, cursedSword, 0);

// Try to unequip (fails - returns false)
unequipItem(ecs, playerId, EquipmentSlotType.HAND_HELD, 0);

// After curse removal spell/scroll
forceUnequipItem(ecs, playerId, EquipmentSlotType.HAND_HELD, 0);
```

## Integration with Game Loop

```typescript
import { updateInventoryWeight } from './systems/carryWeightSystem';

function gameUpdate() {
  // Update inventory weights for all characters with inventory
  const entities = ecs.query('inventory');
  for (const entityId of entities) {
    updateInventoryWeight(ecs, entityId);
  }
}
```

## Best Practices

1. **Always use factory functions** - Use `createWeapon()`, `createPotion()`, etc. instead of manually adding components
2. **Update weights after changes** - Call `updateInventoryWeight()` after adding/removing items
3. **Check carry capacity** - Use `canCarryWeight()` before adding items
4. **Let stacking happen automatically** - `addItemToInventory()` handles stacking
5. **Use standard slots** - Start with `STANDARD_HUMANOID_SLOTS` for regular characters
6. **Handle cursed items** - Check item state before allowing unequip
7. **Respect identification** - Show `apparentName` when not fully identified

## Future Enhancements

The following are NOT implemented yet but the system is designed to support:

- Item effects and properties (damage, defense, magic effects)
- Item usage and consumption mechanics
- Crafting and repair systems
- Loot generation and randomization
- Item drops from enemies
- Trade and shop systems
- UI for inventory and equipment management
- Body part hierarchy for dismemberment
- Item enchanting and upgrading
- Durability system (alternative to broken flag)

## File Structure

```
src/ts/
├── components/
│   ├── item.ts              # Item, ItemType, ItemState, ItemMaterial
│   ├── weight.ts            # WeightComponent
│   ├── stackable.ts         # StackableComponent
│   ├── identification.ts    # IdentificationComponent, IdentificationLevel
│   ├── quality.ts           # QualityComponent
│   ├── equippable.ts        # EquippableComponent
│   ├── equipmentSlot.ts     # EquipmentSlot, EquipmentSlotType, STANDARD_HUMANOID_SLOTS
│   ├── equipment.ts         # EquipmentComponent, getSlotKey()
│   └── inventory.ts         # InventoryComponent
├── systems/
│   ├── itemStackingSystem.ts   # Stacking logic
│   ├── carryWeightSystem.ts    # Weight calculation
│   ├── equipmentSystem.ts      # Equip/unequip logic
│   └── inventorySystem.ts      # Inventory management
├── itemEntities.ts             # Item factory functions
└── examples/
    └── itemSystemExample.ts    # Usage examples
```

## Security Summary

No security vulnerabilities were found during CodeQL analysis. The implementation follows secure coding practices:
- No use of eval or dynamic code execution
- No user input directly used in queries
- Proper type checking throughout
- No SQL injection vectors (no database access)
- No XSS vectors (no DOM manipulation)
