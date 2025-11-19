# Entity Disposition System

## Overview

The game uses a **disposition-based AI system** combined with **dynamic relation scores** to determine entity behavior. There is no hardcoded "enemy" or "NPC" distinction - all entities are simply characters or creatures with dispositions that determine how they react to others based on their relationships.

## Key Concepts

### Disposition vs Relations

- **Disposition** = Base personality/behavior pattern (fixed per entity)
- **Relations** = Dynamic scores between specific entities (changes during gameplay)
- **Hostility** = Determined by BOTH disposition AND relation score

### Example

```
Guard (defensive disposition, +10 relation to player)
→ Does not attack player (neutral relation)

Guard (defensive disposition, -50 relation to player after crime)
→ Attacks player (negative relation triggers defensive response)

Orc (aggressive disposition, -50 relation to player)
→ Attacks player (negative relation triggers aggressive response)

Orc (aggressive disposition, +30 relation after helping orc tribe)
→ Does not attack player (positive relation overrides aggressive tendency)
```

## Disposition Types

### `peaceful`

- **Never attacks** regardless of relation scores
- Always friendly behavior
- Wanders peacefully
- Examples: Children, priests, peaceful villagers

**Attack Threshold**: Never attacks

### `neutral`

- Reacts based on relation scores
- Ignores entities with neutral/positive relations
- Only hostile when significantly provoked
- Examples: Wild animals, neutral travelers, merchants

**Attack Threshold**: relationScore < -20

### `defensive`

- Won't initiate conflict unless very threatened
- Attacks when attacked or relation is very negative
- Good for guards and protectors
- Examples: Town guards, bodyguards, defensive creatures

**Attack Threshold**: relationScore < -40

### `aggressive`

- Quick to hostility
- Attacks entities with any negative relation
- Still won't attack friends/allies
- Examples: Orcs, bandits, territorial creatures

**Attack Threshold**: relationScore < 0

### `hostile`

- Attacks almost everyone
- Only spares those with actively positive relations
- Very dangerous, nearly mindless aggression
- Examples: Undead, demons, corrupted beings

**Attack Threshold**: relationScore ≤ 10

### `patrol`

- Follows patrol routes (currently wanders)
- Attacks threats based on moderate relation threshold
- Balances guarding with movement
- Examples: Patrolling guards, sentries

**Attack Threshold**: relationScore < -10

### `fleeing`

- Always runs away from detected entities
- Never attacks
- Cowardly or prey-like behavior
- Examples: Goblins, rabbits, fearful NPCs

**Attack Threshold**: Never attacks (flees instead)

## Relation Score System

### Score Ranges

- **-100 to -50**: Hated (most dispositions will attack)
- **-50 to -20**: Disliked (aggressive/hostile will attack)
- **-20 to 0**: Unfriendly (only hostile will attack)
- **0 to 20**: Neutral (generally ignored)
- **20 to 50**: Friendly (never attacked)
- **50 to 100**: Ally (never attacked, may assist)

### Base Scores in Data

Set in entity JSON files:

```json
"relation": {
  "baseScore": -50,    // Starting relation
  "minScore": -100,    // Can't go lower
  "maxScore": 0        // Can't go higher
}
```

### Dynamic Changes

Relations change through gameplay events:

```typescript
// Player helps NPC
relationSystem(ecs, npcId, playerId, +20);

// Player attacks guard
relationSystem(ecs, guardId, playerId, -30);

// Player commits crime witnessed by villagers
for (const witnessId of witnesses) {
  relationSystem(ecs, witnessId, playerId, -15);
}
```

## Practical Examples

### Example 1: Villager Becoming Hostile

```json
{
  "id": "villager",
  "ai": { "disposition": "neutral", "detectionRange": 5 },
  "relation": { "baseScore": 20, "minScore": -50, "maxScore": 100 }
}
```

**Scenario:**

1. Initial state: +20 relation → Villager ignores player
2. Player steals from villager: -40 points
3. New relation: -20 → Villager now attacks player (neutral disposition threshold reached)

### Example 2: Guard Protecting Town

```json
{
  "id": "guard",
  "ai": { "disposition": "defensive", "detectionRange": 12 },
  "relation": { "baseScore": 10, "minScore": -80, "maxScore": 80 }
}
```

**Behavior:**

- +10 relation: Guard ignores player
- Player commits minor crime: -20 points → -10 relation → Guard still neutral
- Player commits major crime: -40 points → -50 relation → Guard attacks
- Player helps town: +60 points → +70 relation → Guard friendly

### Example 3: Always-Hostile Undead

```json
{
  "id": "skeleton",
  "ai": { "disposition": "hostile", "detectionRange": 12 },
  "relation": { "baseScore": -100, "minScore": -100, "maxScore": -100 }
}
```

**Behavior:**

- Fixed -100 relation (cannot change)
- Hostile disposition (attacks at ≤10 relation)
- Always attacks player on sight
- Simulates mindless undead behavior

### Example 4: Tameable Wolf

```json
{
  "id": "wild_wolf",
  "ai": { "disposition": "neutral", "detectionRange": 10 },
  "relation": { "baseScore": -10, "minScore": -60, "maxScore": 50 }
}
```

**Behavior:**

- -10 relation initially → Wolf ignores player (neutral threshold is -20)
- Player feeds wolf: +40 points → +30 relation → Wolf friendly
- Player attacks wolf: -50 points → -60 relation → Wolf attacks back

### Example 5: Merchant Turning Hostile

```json
{
  "id": "merchant",
  "ai": { "disposition": "neutral", "detectionRange": 7 },
  "relation": { "baseScore": 30, "minScore": -20, "maxScore": 100 }
}
```

**Behavior:**

- +30 relation initially → Friendly, trades with player
- Player robs merchant: -55 points → -20 relation (hits minimum)
- Merchant now attacks player (neutral threshold reached at min)
- Demonstrates "peaceful until pushed too far" mechanic

## Design Benefits

### 1. Emergent Gameplay

Entities can become allies or enemies through player actions, not hardcoded roles.

### 2. Realistic Behavior

A "guard" can befriend a helpful player or turn hostile after witnessing crimes.

### 3. Player Choice Impact

Actions have meaningful consequences on relationships with ALL entities.

### 4. Flexible Content Creation

Want a friendly orc? Set positive baseScore.
Want a hostile villager? Set aggressive disposition.

### 5. Complex Scenarios

- Town guards start neutral but turn hostile if player commits crimes
- Bandits might spare a player who previously helped their leader
- Animals can be tamed through feeding (relation increases)
- NPCs remember past interactions

## Creating Entities

### Peaceful Villager

```json
{
  "id": "peaceful_villager",
  "type": "character",
  "ai": { "disposition": "peaceful", "detectionRange": 5 },
  "relation": { "baseScore": 20, "minScore": -50, "maxScore": 100 }
}
```

### Aggressive Bandit

```json
{
  "id": "bandit",
  "type": "character",
  "ai": { "disposition": "aggressive", "detectionRange": 10 },
  "relation": { "baseScore": -40, "minScore": -100, "maxScore": 30 }
}
```

### Defensive Guard

```json
{
  "id": "town_guard",
  "type": "character",
  "ai": { "disposition": "defensive", "detectionRange": 12 },
  "relation": { "baseScore": 10, "minScore": -80, "maxScore": 80 }
}
```

### Mindless Hostile Monster

```json
{
  "id": "zombie",
  "type": "creature",
  "ai": { "disposition": "hostile", "detectionRange": 8 },
  "relation": { "baseScore": -100, "minScore": -100, "maxScore": -100 }
}
```

### Neutral Wildlife

```json
{
  "id": "deer",
  "type": "creature",
  "ai": { "disposition": "fleeing", "detectionRange": 12 },
  "relation": { "baseScore": 0, "minScore": -30, "maxScore": 50 }
}
```

## Implementation Notes

### AI System Logic

The `aiSystem` evaluates disposition + relation to determine behavior:

```typescript
const relationScore = getRelationScore(ecs, entityId, targetId) ?? 0;

switch (disposition) {
  case 'peaceful':
    shouldAttack = false;
    break;
  case 'neutral':
    shouldAttack = relationScore < -20;
    break;
  case 'defensive':
    shouldAttack = relationScore < -40;
    break;
  case 'aggressive':
    shouldAttack = relationScore < 0;
    break;
  case 'hostile':
    shouldAttack = relationScore <= 10;
    break;
  case 'patrol':
    shouldAttack = relationScore < -10;
    break;
  case 'fleeing':
    shouldAttack = false;
    break;
}
```

### Relation Initialization

Relations are auto-initialized in `Game.init()` via `world.initializeRelations(ecs)`.

### Relation Updates

Call `relationSystem(ecs, entityId, targetId, delta)` whenever an action affects relationships:

```typescript
// Player helps NPC
relationSystem(ecs, npcId, playerId, +15);

// Player attacks creature
relationSystem(ecs, creatureId, playerId, -20);

// Creatures witness player's crime
for (const witnessId of nearbyCreatures) {
  relationSystem(ecs, witnessId, playerId, -10);
}
```

## Future Enhancements

- **Group relations**: Factions where all members share relations
- **Reputation system**: Global reputation affects base scores
- **Disposition changes**: Events that can change an entity's disposition
- **Complex thresholds**: Custom attack thresholds per entity
- **Ally behavior**: Entities with high relations assist player
- **Witness propagation**: Crimes witnessed by one affect nearby entities' relations
