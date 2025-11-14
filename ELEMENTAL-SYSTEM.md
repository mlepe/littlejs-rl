# Elemental System Documentation

## Overview

The elemental system adds depth to combat by introducing various damage types, resistances, and status effects. Elements can interact with each other, creating tactical opportunities and challenges.

## Element Types

### Physical Elements

- **Slashing**: Swords, axes, claws
- **Piercing**: Arrows, spears, fangs
- **Bludgeoning**: Hammers, clubs, fists

### Magical Elements

- **Magic**: Generic magical damage
- **Fire**: Burns and sets things ablaze
- **Cold**: Freezes and slows targets
- **Water**: Soaks targets, conducts lightning
- **Earth**: Grounds and slows movement
- **Lightning**: Shocks and paralyzes
- **Dark**: Curses and blinds
- **Holy**: Blesses allies, damages undead
- **Poison**: Damages over time, weakens
- **Acid**: Corrodes armor and defenses

## Components

### ElementalResistanceComponent

Stores an entity's resistance to each element type.

```typescript
interface ElementalResistanceComponent {
  flatReduction: Partial<Record<ElementType, number>>;
  percentResistance: Partial<Record<ElementType, number>>;
}
```

**Resistance Calculation:**

1. Apply flat reduction first: `damage - flatReduction`
2. Apply percentage resistance: `damage * (1 - percentResistance)`
3. Negative values = weakness (take more damage)

**Example:**

```json
{
  "elementalResistance": {
    "fire": {
      "flat": 10,
      "percent": 0.5
    },
    "cold": {
      "flat": -5,
      "percent": -0.25
    }
  }
}
```

### ElementalDamageComponent

Stores elemental damage dealt by an entity's attacks.

```typescript
interface ElementalDamageComponent {
  damages: Array<{
    element: ElementType;
    amount: number;
  }>;
}
```

**Example:**

```json
{
  "elementalDamage": [
    {
      "element": "slashing",
      "amount": 10
    },
    {
      "element": "fire",
      "amount": 5
    }
  ]
}
```

### StatusEffectComponent

Tracks active status effects on an entity.

```typescript
interface StatusEffectComponent {
  effects: Array<{
    type: StatusEffectType;
    duration: number;
    strength: number;
    source?: number;
  }>;
}
```

## Status Effects

| Effect       | Element(s)  | Description                       |
| ------------ | ----------- | --------------------------------- |
| **BURNING**  | Fire        | Damage over time (3 turns)        |
| **FROZEN**   | Cold        | Cannot move (2 turns)             |
| **CHILLED**  | Cold        | Reduced speed (4 turns)           |
| **SHOCKED**  | Lightning   | 50% chance to miss turn (2 turns) |
| **POISONED** | Poison      | Damage + stat reduction (5 turns) |
| **CORRODED** | Acid        | Reduced defense (4 turns)         |
| **BLESSED**  | Holy        | Increased stats (5 turns)         |
| **CURSED**   | Dark        | Decreased stats (4 turns)         |
| **BLINDED**  | Dark        | Reduced accuracy (3 turns)        |
| **STUNNED**  | Bludgeoning | Skip turn (1 turn)                |
| **BLEEDING** | Slashing    | Damage over time (4 turns)        |
| **SOAKED**   | Water       | Vulnerable to lightning (3 turns) |
| **MUDDED**   | Earth+Water | Reduced speed (3 turns)           |

## Elemental Interactions

Elements can interact when a target has active status effects:

| Primary       | Secondary | Interaction | Effect                     |
| ------------- | --------- | ----------- | -------------------------- |
| **Water**     | Fire      | Counter     | 50% damage reduction       |
| **Fire**      | Water     | Counter     | 50% damage reduction       |
| **Cold**      | Fire      | Counter     | 30% damage reduction       |
| **Fire**      | Cold      | Counter     | 30% damage reduction       |
| **Lightning** | Water     | Amplify     | 50% bonus + Shocked        |
| **Water**     | Lightning | Amplify     | 50% bonus + Shocked        |
| **Holy**      | Dark      | Counter     | 50% bonus damage           |
| **Dark**      | Holy      | Counter     | 50% bonus damage           |
| **Holy**      | Curse     | Nullify     | 0 damage + Blessed         |
| **Earth**     | Water     | Transform   | 20% reduction + Mudded     |
| **Water**     | Earth     | Transform   | 20% reduction + Mudded     |
| **Lightning** | Earth     | Counter     | 50% reduction (grounding)  |
| **Fire**      | Poison    | Amplify     | 30% bonus (burning poison) |
| **Cold**      | Water     | Transform   | 20% bonus + Frozen         |

## Systems

### elementalDamageSystem

Calculates damage after resistances and interactions.

**Main Functions:**

- `calculateElementalDamage()` - Apply resistances to damage
- `applyElementalDamageToTarget()` - Full damage calculation with interactions
- `applyAllElementalDamages()` - Process all damage types from attacker

**Usage:**

```typescript
import { applyAllElementalDamages, getTotalDamageFromResults } from './systems';

const results = applyAllElementalDamages(ecs, attackerId, targetId);
const totalDamage = getTotalDamageFromResults(results);

// results[0].finalDamage - Damage after resistances
// results[0].wasWeakness - True if target was vulnerable
// results[0].appliedStatusEffect - Status effect applied (if any)
// results[0].interactionOccurred - Elemental interaction type
```

### statusEffectSystem

Processes active status effects each turn.

**Main Functions:**

- `statusEffectSystem()` - Process all entities with status effects
- `processStatusEffects()` - Apply effects to a single entity
- `shouldSkipTurn()` - Check if entity is stunned/frozen

**Usage:**

```typescript
import { statusEffectSystem, shouldSkipTurn } from './systems';

// At end of turn
statusEffectSystem(ecs);

// Before entity acts
if (shouldSkipTurn(ecs, entityId)) {
  continue; // Skip this entity's turn
}
```

## Data Definition

### Entity with Elemental Properties

```json
{
  "id": "fire_elemental",
  "name": "Fire Elemental",
  "type": "creature",

  "elementalDamage": [
    {
      "element": "fire",
      "amount": 15
    }
  ],

  "elementalResistance": {
    "fire": {
      "flat": 10,
      "percent": 1.0
    },
    "cold": {
      "flat": -10,
      "percent": -0.5
    },
    "water": {
      "flat": -15,
      "percent": -0.75
    }
  }
}
```

### Item with Elemental Properties

```json
{
  "id": "flaming_sword",
  "name": "Flaming Sword",
  "type": "weapon",

  "elementalDamage": [
    {
      "element": "slashing",
      "amount": 12
    },
    {
      "element": "fire",
      "amount": 8
    }
  ]
}
```

```json
{
  "id": "dragon_scale_armor",
  "name": "Dragon Scale Armor",
  "type": "armor",

  "elementalResistance": {
    "fire": {
      "flat": 15,
      "percent": 0.5
    },
    "slashing": {
      "flat": 10,
      "percent": 0.3
    }
  }
}
```

## Integration Example

```typescript
import ECS from './ts/ecs';
import { Game } from './ts/game';
import {
  applyAllElementalDamages,
  getTotalDamageFromResults,
  statusEffectSystem,
} from './ts/systems';

const game = Game.getInstance();
const ecs = game.getECS();

// Combat turn
function combat Turn(attackerId: number, targetId: number) {
  // Apply elemental damage
  const results = applyAllElementalDamages(ecs, attackerId, targetId);
  const totalDamage = getTotalDamageFromResults(results);

  // Log results
  for (const result of results) {
    console.log(`${result.element}: ${result.finalDamage} damage`);

    if (result.wasWeakness) {
      console.log('Target is vulnerable!');
    }

    if (result.appliedStatusEffect) {
      console.log(`Applied ${result.appliedStatusEffect.type}!`);
    }

    if (result.interactionOccurred) {
      console.log(`Elemental interaction: ${result.interactionOccurred}`);
    }
  }

  // Apply damage to health
  const health = ecs.getComponent<HealthComponent>(targetId, 'health');
  if (health) {
    health.current -= totalDamage;
  }
}

// End of turn processing
function endTurn() {
  statusEffectSystem(ecs); // Apply all status effects
}
```

## Best Practices

1. **Always add StatusEffectComponent** to entities that can be affected by elements
2. **Check for interactions** when applying elemental damage
3. **Process status effects** at the end of each turn
4. **Use helper functions** instead of manual component manipulation
5. **Balance resistances** to avoid invulnerability
6. **Consider weaknesses** as gameplay opportunities

## Future Enhancements

- Equipment system integration for elemental bonuses
- Spell crafting with element combinations
- Environmental hazards (fire pits, ice patches)
- Elemental buffs/debuffs from items
- Elemental affinity system for characters
- Resistance/weakness discovery mechanics
- Visual effects for elements and status effects
