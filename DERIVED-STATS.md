# Derived Stats System

## Overview

The stats system uses a **two-tier architecture** where stats are divided into:

1. **Base Stats**: Core attributes that are directly set and stored
2. **Derived Stats**: Calculated values that depend on base stats using formulas

This design provides:

- **Centralized game balance**: Change formulas in one place
- **Simpler data files**: Only specify base stats
- **Equipment integration**: Weight penalties affect derived stats
- **Automatic consistency**: Derived stats always correct based on current base stats

## Base Stats (7 total)

These are core attributes that define a character's fundamental capabilities:

| Stat               | Description                                             |
| ------------------ | ------------------------------------------------------- |
| **strength**       | Physical power, affects melee damage and carry capacity |
| **dexterity**      | Agility and coordination, affects dodge and speed       |
| **intelligence**   | Mental acuity, affects magic power and learning         |
| **charisma**       | Force of personality, affects dialogue and persuasion   |
| **willpower**      | Mental resilience, affects magical defense              |
| **toughness**      | Physical resilience, affects defense                    |
| **attractiveness** | Physical appearance, affects NPC reactions              |

## Derived Stats (5 total)

These are calculated automatically from base stats:

| Stat               | Formula                                           | Description               |
| ------------------ | ------------------------------------------------- | ------------------------- |
| **defense**        | `toughness * 0.5`                                 | Physical damage reduction |
| **dodge**          | `dexterity * 0.8 - equipmentWeight * 0.1`         | Chance to avoid attacks   |
| **mindDefense**    | `willpower * 0.6 + intelligence * 0.4`            | Mental attack resistance  |
| **magicalDefense** | `willpower * 0.7`                                 | Magical damage reduction  |
| **speed**          | `1.0 + dexterity * 0.02 - equipmentWeight * 0.05` | Movement speed multiplier |

## Data Files

When creating entities in JSON, **only specify base stats**:

```json
{
  "id": "orc_warrior",
  "stats": {
    "strength": 8,
    "toughness": 10,
    "dexterity": 6
  }
}
```

Derived stats are calculated automatically when the entity spawns.

### Default Values

If a base stat is not specified, it defaults to **10**.

## Code Usage

### Creating Entities

```typescript
import { createPlayer, createEnemy } from './ts/entities';
import { calculateDerivedStats } from './ts/systems/derivedStatsSystem';

// Entity factories automatically calculate derived stats
const playerId = createPlayer(ecs, x, y);

// Manual entity creation
const entityId = ecs.createEntity();
const base = {
  strength: 12,
  dexterity: 10,
  intelligence: 8,
  charisma: 10,
  willpower: 10,
  toughness: 14,
  attractiveness: 10,
};

ecs.addComponent<StatsComponent>(entityId, 'stats', {
  base,
  derived: calculateDerivedStats(base, 0), // 0 = equipment weight
});
```

### Accessing Stats

```typescript
const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');

// Base stats
const strength = stats.base.strength;
const dexterity = stats.base.dexterity;

// Derived stats
const defense = stats.derived.defense;
const speed = stats.derived.speed;
```

### Modifying Stats

Use the **stat modifier system** to apply temporary buffs/debuffs:

```typescript
import { getEffectiveStat } from './ts/systems/statModifierSystem';

// Get effective stat with modifiers applied
const effectiveSpeed = getEffectiveStat(ecs, entityId, 'speed');
const effectiveStrength = getEffectiveStat(ecs, entityId, 'strength');
```

When base stats are modified, derived stats are **automatically recalculated**.

## System Architecture

### derivedStatsSystem.ts

Contains calculation functions:

```typescript
export function calculateDerivedStats(
  base: BaseStats,
  equipmentWeight: number = 0
): DerivedStats {
  return {
    defense: calculateDefense(base, equipmentWeight),
    dodge: calculateDodge(base, equipmentWeight),
    mindDefense: calculateMindDefense(base),
    magicalDefense: calculateMagicalDefense(base),
    speed: calculateSpeed(base, equipmentWeight),
  };
}
```

### statModifierSystem.ts

Handles both base and derived stat modifiers:

- **Base stat modifiers**: Applied directly to base value
- **Derived stat modifiers**:
  1. Calculate modified base stats
  2. Recalculate derived from modified bases
  3. Apply direct derived modifiers

## Game Balance

### Adjusting Formulas

To change game balance, edit formulas in `derivedStatsSystem.ts`:

```typescript
// Make dodge more dexterity-dependent
export function calculateDodge(
  base: BaseStats,
  equipmentWeight: number = 0
): number {
  return base.dexterity * 1.0 - equipmentWeight * 0.1; // Changed from 0.8 to 1.0
}
```

All entities automatically use the new formula.

### Equipment Weight

Equipment weight affects **dodge** and **speed**:

```typescript
// Heavy armor reduces dodge and speed
const dodge = dexterity * 0.8 - equipmentWeight * 0.1;
const speed = 1.0 + dexterity * 0.02 - equipmentWeight * 0.05;
```

Future implementation will integrate with inventory system.

## Modding Support

### Creating Custom Entities

Modders only need to understand **7 base stats**:

```json
{
  "id": "custom_boss",
  "name": "Custom Boss",
  "type": "creature",
  "stats": {
    "strength": 20,
    "toughness": 18,
    "dexterity": 8,
    "intelligence": 12,
    "willpower": 15
  }
}
```

Derived stats calculate automatically.

### Custom Formulas

To add custom derived stats:

1. Add to `DerivedStats` interface in `components/stats.ts`
2. Create calculation function in `derivedStatsSystem.ts`
3. Update `calculateDerivedStats()` to include new stat

## Best Practices

1. **Data Files**: Only specify base stats, never derived stats
2. **Balance Changes**: Edit formulas in `derivedStatsSystem.ts`, not individual entities
3. **Temporary Effects**: Use stat modifier system for buffs/debuffs
4. **Equipment**: Include weight in `calculateDerivedStats()` call
5. **Debugging**: Use `derivedStatsSystem(ecs)` to recalculate all derived stats

## Future Enhancements

- [ ] Equipment system integration (weight affects dodge/speed)
- [ ] Dynamic formula modifiers (racial bonuses, perks)
- [ ] Stat caps and diminishing returns
- [ ] Advanced derived stats (critical chance, magic resistance types)
- [ ] Stat growth on level-up
- [ ] Attribute synergies (strength + dexterity bonuses)
