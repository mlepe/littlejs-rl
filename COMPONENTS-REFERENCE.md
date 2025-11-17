# ECS Components Reference

## Overview

This document provides a comprehensive reference for all ECS components in the game. Components are pure data structures with no behavior.

**Key Principle:** Components hold data, systems hold logic.

---

## Core Components

### PositionComponent

**File:** `src/ts/components/position.ts`

**Purpose:** Store entity position in tile coordinates.

**Properties:**

```typescript
{
  x: number; // X coordinate in tiles
  y: number; // Y coordinate in tiles
}
```

**Used By:**

- All visible entities
- Movement systems
- Render systems
- Spatial queries

**Example:**

```typescript
ecs.addComponent<PositionComponent>(entityId, 'position', { x: 10, y: 20 });
```

---

### HealthComponent

**File:** `src/ts/components/health.ts`

**Purpose:** Track entity health points.

**Properties:**

```typescript
{
  current: number; // Current HP
  max: number; // Maximum HP
}
```

**Used By:**

- Combat systems
- Death system
- UI rendering
- AI decision-making

**Example:**

```typescript
ecs.addComponent<HealthComponent>(entityId, 'health', {
  current: 100,
  max: 100,
});
```

---

### RenderComponent

**File:** `src/ts/components/render.ts`

**Purpose:** Visual rendering data for entities.

**Properties:**

```typescript
{
  tileInfo: LJS.TileInfo;        // Sprite from tileset
  color: LJS.Color;              // Tint color
  size: LJS.Vector2;             // Render size (usually 1x1)
  angle?: number;                // Rotation angle (optional)
  mirror?: boolean;              // Horizontal flip (optional)
  additiveColor?: LJS.Color;     // Additive color overlay (optional)
}
```

**Used By:**

- Render system

**Example:**

```typescript
ecs.addComponent<RenderComponent>(entityId, 'render', {
  tileInfo: new LJS.TileInfo(LJS.vec2(0, 0), LJS.vec2(16, 16)),
  color: getColor(BaseColor.PLAYER),
  size: LJS.vec2(1, 1),
});
```

---

### MovableComponent

**File:** `src/ts/components/movable.ts`

**Purpose:** Indicate entity can move.

**Properties:**

```typescript
{
  speed: number; // Movement speed multiplier (1.0 = normal)
}
```

**Used By:**

- Movement systems
- AI systems

**Example:**

```typescript
ecs.addComponent<MovableComponent>(entityId, 'movable', { speed: 1.0 });
```

---

## Character Components

### StatsComponent

**File:** `src/ts/components/stats.ts`

**Purpose:** Character attributes and derived stats.

**Properties:**

```typescript
{
  // Core attributes
  strength: number;      // Physical power
  dexterity: number;     // Agility and accuracy
  toughness: number;     // Physical resilience
  intelligence: number;  // Mental power
  willpower: number;     // Mental resilience
  perception: number;    // Awareness
  charisma: number;      // Social influence

  // Derived stats (calculated by derivedStatsSystem)
  attack?: number;       // Attack power
  defense?: number;      // Defense rating
  speed?: number;        // Movement speed
  maxHP?: number;        // Max health points
  maxMP?: number;        // Max mana points
  currentMP?: number;    // Current mana
}
```

**Used By:**

- Combat systems
- Movement systems
- Character creation
- Level up
- Equipment bonuses

**Example:**

```typescript
ecs.addComponent<StatsComponent>(entityId, 'stats', {
  strength: 10,
  dexterity: 12,
  toughness: 14,
  intelligence: 8,
  willpower: 10,
  perception: 10,
  charisma: 8,
});
```

---

### PlayerComponent

**File:** `src/ts/components/player.ts`

**Purpose:** Tag entity as player-controlled.

**Properties:**

```typescript
{
  isPlayer: true; // Always true (tag component)
}
```

**Used By:**

- Input system
- Camera system
- Special player-only systems

**Example:**

```typescript
ecs.addComponent<PlayerComponent>(playerId, 'player', { isPlayer: true });
```

---

### InputComponent

**File:** `src/ts/components/input.ts`

**Purpose:** Store captured input state.

**Properties:**

```typescript
{
  // Movement
  moveX: number; // -1, 0, or 1
  moveY: number; // -1, 0, or 1

  // Actions
  action: boolean; // Generic action button
  useItem: boolean; // Use item (U key)

  // Mode toggles
  toggleWorldMap: boolean; // M key
  toggleInventory: boolean; // I key
  toggleExamine: boolean; // X key
  exit: boolean; // ESC key

  // Camera
  zoomIn: boolean; // Z key
  zoomOut: boolean; // C key

  // Debug
  debugToggleCollision: boolean; // F1 key
  debugToggleText: boolean; // F2 key
}
```

**Used By:**

- Input system (writes)
- Player movement system (reads)
- View mode transition system (reads)
- Camera system (reads)

**Example:**

```typescript
ecs.addComponent<InputComponent>(playerId, 'input', {
  moveX: 0,
  moveY: 0,
  action: false,
  useItem: false,
  toggleWorldMap: false,
  toggleInventory: false,
  toggleExamine: false,
  exit: false,
  zoomIn: false,
  zoomOut: false,
  debugToggleCollision: false,
  debugToggleText: false,
});
```

---

### ClassComponent

**File:** `src/ts/components/class.ts`

**Purpose:** Character class data (warrior, mage, rogue, etc.).

**Properties:**

```typescript
{
  id: string; // Class ID from data
  name: string; // Display name
  description: string; // Class description
  // ... stat modifiers from data
}
```

**Used By:**

- Class system (applies bonuses)
- Character creation
- UI display

**Example:**

```typescript
ecs.addComponent<ClassComponent>(entityId, 'class', {
  id: 'warrior',
  name: 'Warrior',
  description: 'Melee combat specialist',
});
```

---

### RaceComponent

**File:** `src/ts/components/race.ts`

**Purpose:** Character race data (human, elf, orc, etc.).

**Properties:**

```typescript
{
  id: string; // Race ID from data
  name: string; // Display name
  description: string; // Race description
  // ... stat modifiers from data
}
```

**Used By:**

- Race system (applies bonuses)
- Character creation
- UI display

**Example:**

```typescript
ecs.addComponent<RaceComponent>(entityId, 'race', {
  id: 'elf',
  name: 'Elf',
  description: 'Agile forest dweller',
});
```

---

## Item Components

### ItemComponent

**File:** `src/ts/components/item.ts`

**Purpose:** Core item properties.

**Properties:**

```typescript
{
  name: string;              // Display name
  type: ItemType;            // weapon, armor, consumable, etc.
  description: string;       // Item description
  state: ItemState;          // normal, blessed, cursed
  material: string;          // iron, steel, wood, etc.
  value: number;             // Base gold value
  weight?: number;           // Weight for carry capacity
  stackable?: boolean;       // Can stack with identical items
  maxStackSize?: number;     // Max stack size (if stackable)
  quantity?: number;         // Current stack quantity
}
```

**Used By:**

- Inventory systems
- Loot systems
- Item generation
- UI display

**Example:**

```typescript
ecs.addComponent<ItemComponent>(itemId, 'item', {
  name: 'Iron Sword',
  type: ItemType.WEAPON,
  description: 'A sturdy iron blade',
  state: ItemState.NORMAL,
  material: 'iron',
  value: 50,
  weight: 3.5,
});
```

---

### InventoryComponent

**File:** `src/ts/components/inventory.ts`

**Purpose:** Entity's inventory storage.

**Properties:**

```typescript
{
  items: number[];        // Array of item entity IDs
  maxCarryWeight: number; // Max weight capacity
  currentWeight: number;  // Current total weight
}
```

**Used By:**

- Inventory system
- Pickup system
- Equipment system
- UI rendering

**Example:**

```typescript
ecs.addComponent<InventoryComponent>(playerId, 'inventory', {
  items: [],
  maxCarryWeight: 50,
  currentWeight: 0,
});
```

---

### InventoryUIComponent

**File:** `src/ts/components/inventoryUI.ts`

**Purpose:** Inventory UI state.

**Properties:**

```typescript
{
  selectedIndex: number; // Currently selected item index
  scrollOffset: number; // Scroll position for long lists
}
```

**Used By:**

- Inventory UI system

**Example:**

```typescript
ecs.addComponent<InventoryUIComponent>(playerId, 'inventoryUI', {
  selectedIndex: 0,
  scrollOffset: 0,
});
```

---

### EquipmentComponent

**File:** `src/ts/components/equipment.ts`

**Purpose:** Equipment slot and status.

**Properties:**

```typescript
{
  slot: EquipmentSlot;  // weapon, armor, accessory, etc.
  equipped: boolean;    // Currently equipped?
  bonuses?: {           // Stat bonuses when equipped
    strength?: number;
    defense?: number;
    // ... other stat bonuses
  };
}
```

**Used By:**

- Equipment system
- Combat calculations
- UI display

**Example:**

```typescript
ecs.addComponent<EquipmentComponent>(swordId, 'equipment', {
  slot: EquipmentSlot.WEAPON,
  equipped: false,
  bonuses: { attack: 5 },
});
```

---

### IdentificationComponent

**File:** `src/ts/components/identification.ts`

**Purpose:** Item identification level.

**Properties:**

```typescript
{
  level: IdentificationLevel; // unidentified, partial, full
  progress: number; // Identification progress (0-1)
}
```

**Levels:**

- `UNIDENTIFIED`: Item is unknown (shows generic name)
- `PARTIAL`: Some properties revealed (type, material)
- `FULL`: All properties revealed (stats, effects, curses)

**Used By:**

- Identification system
- UI display
- Item usage

**Example:**

```typescript
ecs.addComponent<IdentificationComponent>(itemId, 'identification', {
  level: IdentificationLevel.UNIDENTIFIED,
  progress: 0,
});
```

---

### ConsumableComponent

**File:** `src/ts/components/consumable.ts`

**Purpose:** Consumable item properties.

**Properties:**

```typescript
{
  uses: number;        // Remaining uses
  maxUses: number;     // Max uses (for refills)
  effects: Effect[];   // Effects when consumed
}
```

**Effect Types:**

- Heal HP
- Restore MP
- Cure status
- Buff stats
- Teleport
- Identify items

**Used By:**

- Item usage system
- UI display

**Example:**

```typescript
ecs.addComponent<ConsumableComponent>(potionId, 'consumable', {
  uses: 1,
  maxUses: 1,
  effects: [{ type: 'heal', amount: 50 }],
});
```

---

### ChargesComponent

**File:** `src/ts/components/charges.ts`

**Purpose:** Charges for rods/wands.

**Properties:**

```typescript
{
  current: number; // Current charges
  max: number; // Max charges
  regenRate: number; // Charges per turn
}
```

**Used By:**

- Charges system (passive regen)
- Item usage system
- UI display

**Example:**

```typescript
ecs.addComponent<ChargesComponent>(wandId, 'charges', {
  current: 10,
  max: 10,
  regenRate: 1,
});
```

---

### LootTableComponent

**File:** `src/ts/components/lootTable.ts`

**Purpose:** Loot generation data.

**Properties:**

```typescript
{
  tableId: string; // Loot table ID from data
}
```

**Used By:**

- Death system
- Loot generation

**Example:**

```typescript
ecs.addComponent<LootTableComponent>(enemyId, 'lootTable', {
  tableId: 'goblin_loot',
});
```

---

## Combat Components

### ElementalDamageComponent

**File:** `src/ts/components/elementalDamage.ts`

**Purpose:** Elemental damage types and amounts.

**Properties:**

```typescript
{
  physical?: {
    slashing?: number;
    piercing?: number;
    bludgeoning?: number;
  };
  magical?: {
    fire?: number;
    cold?: number;
    lightning?: number;
    poison?: number;
    acid?: number;
    // ... more element types
  };
}
```

**Used By:**

- Combat system
- Elemental damage system
- Status effect application

**Example:**

```typescript
ecs.addComponent<ElementalDamageComponent>(weaponId, 'elementalDamage', {
  physical: { slashing: 10 },
  magical: { fire: 5 },
});
```

---

### ElementalResistanceComponent

**File:** `src/ts/components/elementalResistance.ts`

**Purpose:** Resistances to element types.

**Properties:**

```typescript
{
  physical?: {
    slashing?: number;    // Flat reduction + %
    piercing?: number;
    bludgeoning?: number;
  };
  magical?: {
    fire?: number;
    cold?: number;
    lightning?: number;
    // ... more element types
  };
}
```

**Used By:**

- Combat system
- Elemental damage system

**Example:**

```typescript
ecs.addComponent<ElementalResistanceComponent>(armorId, 'elementalResistance', {
  physical: { slashing: 5 },
  magical: { fire: 10 },
});
```

---

### StatusEffectComponent

**File:** `src/ts/components/statusEffect.ts`

**Purpose:** Active status effects.

**Properties:**

```typescript
{
  effects: StatusEffect[];
}

// StatusEffect structure
{
  type: StatusEffectType;  // burn, freeze, poison, etc.
  duration: number;        // Turns remaining
  intensity: number;       // Effect strength
  source?: number;         // Entity that applied effect
}
```

**Effect Types:**

- `BURN`: Damage over time
- `FREEZE`: Movement disabled
- `POISON`: Gradual damage
- `STUN`: Action disabled
- `BLIND`: Accuracy reduced
- `HASTE`: Speed increased
- `SLOW`: Speed decreased

**Used By:**

- Status effect system
- Combat system
- UI display

**Example:**

```typescript
ecs.addComponent<StatusEffectComponent>(entityId, 'statusEffect', {
  effects: [{ type: StatusEffectType.BURN, duration: 5, intensity: 3 }],
});
```

---

### StatModifierComponent

**File:** `src/ts/components/statModifier.ts`

**Purpose:** Temporary stat modifications.

**Properties:**

```typescript
{
  modifiers: StatModifier[];
}

// StatModifier structure
{
  stat: string;      // Stat name (strength, defense, etc.)
  amount: number;    // Modifier amount
  duration: number;  // Turns remaining (-1 = permanent)
  source?: string;   // Effect source (buff, item, etc.)
}
```

**Used By:**

- Stat modifier system
- Buff/debuff effects
- UI display

**Example:**

```typescript
ecs.addComponent<StatModifierComponent>(entityId, 'statModifier', {
  modifiers: [{ stat: 'strength', amount: 5, duration: 10, source: 'potion' }],
});
```

---

## AI Components

### AIComponent

**File:** `src/ts/components/ai.ts`

**Purpose:** AI behavior data.

**Properties:**

```typescript
{
  type: AIType;             // passive, aggressive, patrol, fleeing
  detectionRange: number;   // Tiles for player detection
  state: AIState;           // idle, pursuing, attacking, fleeing
  target?: number;          // Target entity ID (if pursuing)
}
```

**AI Types:**

- `PASSIVE`: Wanders randomly, never attacks
- `AGGRESSIVE`: Pursues and attacks on sight
- `PATROL`: Patrols area, attacks if provoked
- `FLEEING`: Runs away from player

**AI States:**

- `IDLE`: No target, random movement
- `PURSUING`: Moving toward target
- `ATTACKING`: Adjacent to target
- `FLEEING`: Moving away from target

**Used By:**

- AI system
- Relation checks

**Example:**

```typescript
ecs.addComponent<AIComponent>(enemyId, 'ai', {
  type: AIType.AGGRESSIVE,
  detectionRange: 10,
  state: AIState.IDLE,
});
```

---

## World Components

### LocationComponent

**File:** `src/ts/components/locationComponent.ts`

**Purpose:** Track which location entity is in.

**Properties:**

```typescript
{
  worldX: number; // World X coordinate
  worldY: number; // World Y coordinate
}
```

**Used By:**

- Location transition system
- Spatial queries
- Entity filtering

**Example:**

```typescript
ecs.addComponent<LocationComponent>(entityId, 'location', {
  worldX: 5,
  worldY: 5,
});
```

---

### ViewModeComponent

**File:** `src/ts/components/viewMode.ts`

**Purpose:** UI view mode state.

**Properties:**

```typescript
{
  mode: ViewMode;         // Current view mode
  previousMode?: ViewMode; // Previous mode (for ESC)
  examineCursorX: number; // Examine mode cursor X
  examineCursorY: number; // Examine mode cursor Y
}
```

**View Modes:**

- `LOCATION`: Normal gameplay
- `WORLD_MAP`: World map navigation
- `INVENTORY`: Inventory UI
- `EXAMINE`: Examine entities/tiles

**Used By:**

- View mode transition system
- Game loop (system routing)
- Examine systems

**Example:**

```typescript
ecs.addComponent<ViewModeComponent>(playerId, 'viewMode', {
  mode: ViewMode.LOCATION,
  examineCursorX: 0,
  examineCursorY: 0,
});
```

---

### RelationComponent

**File:** `src/ts/components/relation.ts`

**Purpose:** Relationship scores with other entities.

**Properties:**

```typescript
{
  relations: Map<number, RelationData>;
}

// RelationData structure
{
  relationScore: number; // Current score (-100 to 100)
  minRelationScore: number; // Min possible score
  maxRelationScore: number; // Max possible score
}
```

**Score Ranges:**

- `> 50`: Very friendly
- `0 to 50`: Friendly
- `-20 to 0`: Neutral
- `-40 to -20`: Unfriendly
- `< -40`: Hostile

**Used By:**

- Relation system
- AI system (hostility checks)
- Dialog system

**Example:**

```typescript
ecs.addComponent<RelationComponent>(npcId, 'relation', {
  relations: new Map([
    [
      playerId,
      { relationScore: 0, minRelationScore: -100, maxRelationScore: 100 },
    ],
  ]),
});
```

---

## Component Organization

### By Category

**Entity Essentials:**

- PositionComponent
- LocationComponent
- RenderComponent

**Character:**

- StatsComponent
- HealthComponent
- RaceComponent
- ClassComponent

**Player-Specific:**

- PlayerComponent
- InputComponent
- ViewModeComponent
- InventoryComponent
- InventoryUIComponent

**Items:**

- ItemComponent
- EquipmentComponent
- IdentificationComponent
- ConsumableComponent
- ChargesComponent
- LootTableComponent

**Combat:**

- ElementalDamageComponent
- ElementalResistanceComponent
- StatusEffectComponent
- StatModifierComponent

**AI:**

- AIComponent
- RelationComponent
- MovableComponent

---

## Creating Components

### Component Template

```typescript
/**
 * Brief description of component purpose
 */
export interface MyNewComponent {
  property1: type;
  property2: type;
  // ... more properties
}
```

### Best Practices

1. **Pure data only** - No methods, just properties
2. **Use TypeScript interfaces** - Not classes
3. **Flat structure** - Avoid deep nesting
4. **Optional properties** - Use `?` for optional
5. **Document units** - Comment property meanings
6. **Use enums** - For fixed value sets
7. **Immutable when possible** - Prefer readonly
8. **Group related data** - Keep cohesion high

### Example Component

```typescript
/**
 * Hunger component for survival mechanics
 */
export interface HungerComponent {
  current: number; // Current hunger (0-100)
  max: number; // Max hunger (usually 100)
  depletionRate: number; // Hunger lost per turn
  starvationDamage: number; // Damage when current = 0
}
```

---

## Adding to ECS

### Registration

1. Create component file in `src/ts/components/`
2. Export from `src/ts/components/index.ts`
3. Document in this file
4. Create systems to use it
5. Add to entity factories

### Usage Example

```typescript
import { MyNewComponent } from './components';

// Add to entity
ecs.addComponent<MyNewComponent>(entityId, 'myNew', {
  property1: value1,
  property2: value2,
});

// Get from entity
const comp = ecs.getComponent<MyNewComponent>(entityId, 'myNew');

// Query entities with component
const entities = ecs.query('myNew', 'position');

// Remove from entity
ecs.removeComponent(entityId, 'myNew');
```

---

## Related Documentation

- `ARCHITECTURE.md` - Overall architecture
- `SYSTEMS-REFERENCE.md` - All systems
- `VIEW-MODES.md` - View mode system
- `ITEM-SYSTEM.md` - Inventory and items
- `ELEMENTAL-SYSTEM.md` - Combat and elements
- `DISPOSITION-SYSTEM.md` - AI behaviors
