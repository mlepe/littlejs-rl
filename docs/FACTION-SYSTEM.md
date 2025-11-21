# Faction System

## Overview

The Faction System allows entities to belong to organized groups with predefined diplomatic relationships. Factions determine which entities are allies, enemies, or neutral towards each other, adding strategic depth to combat and social interactions.

## Key Features

- **11 Default Factions**: Player, Townsfolk, Merchants, Bandits, Undead, Demons, Corrupted, Wildlife, Jungle Tribes, Frost Clans, Desert Nomads
- **Diplomatic Relations**: Allied, enemy, and neutral relationships between factions
- **Reputation System**: Track standing within factions (0-100)
- **Faction Ranks**: Progression from outsider to influential member
- **AI Integration**: Entities respect faction diplomacy in combat decisions
- **Relation System Integration**: Factions work with individual relation scores
- **JSON Configuration**: Easily moddable via `src/data/base/factions.json`

## Components

### FactionComponent

Located: `src/ts/components/faction.ts`

```typescript
export interface FactionComponent {
  /** Primary faction ID */
  factionId: string;
  /** Reputation level within faction (0-100) */
  reputation: number;
  /** Rank within faction (0 = outsider, higher = more influence) */
  rank: number;
  /** Is entity a leader/important member? */
  isLeader?: boolean;
}
```

**Properties:**

- `factionId` - Unique faction identifier (e.g., "player", "bandits", "undead")
- `reputation` - Standing within faction (0 = hated, 50 = neutral, 100 = revered)
- `rank` - Position in hierarchy (0 = outsider, 1 = member, 2 = officer, 3 = leader, etc.)
- `isLeader` - Optional flag for faction leaders/important NPCs

## Faction Registry

### FactionRegistry Singleton

Manages all faction data and relationships.

**Key Methods:**

```typescript
// Get instance
const registry = FactionRegistry.getInstance();

// Query factions
const faction = registry.getFaction('bandits');
const allFactions = registry.getAllFactions();

// Check relationships
const allied = registry.areAllied('player', 'townsfolk'); // true
const enemies = registry.areEnemies('player', 'bandits'); // true

// Get display info
const color = registry.getFactionColor('undead'); // 'gray'
```

## Default Factions

### Friendly Factions

**Player (Adventurers)**

- Allies: Townsfolk, Merchants
- Enemies: Bandits, Undead, Demons, Corrupted
- Neutral: Wildlife, Jungle Tribes
- Default Reputation: 50
- Color: Blue

**Townsfolk**

- Allies: Player, Merchants
- Enemies: Bandits, Undead, Demons
- Neutral: Wildlife
- Default Reputation: 60
- Color: Green

**Merchants (Merchant Guild)**

- Allies: Player, Townsfolk
- Enemies: Bandits
- Neutral: Wildlife, Jungle Tribes
- Default Reputation: 50
- Color: Gold

### Hostile Factions

**Bandits (Bandit Clans)**

- Allies: None
- Enemies: Player, Townsfolk, Merchants
- Neutral: Wildlife
- Default Reputation: -50
- Color: Red

**Undead (Undead Legion)**

- Allies: Demons, Corrupted
- Enemies: Player, Townsfolk, Wildlife
- Neutral: None
- Default Reputation: -100
- Color: Gray

**Demons (Demon Horde)**

- Allies: Undead, Corrupted
- Enemies: Player, Townsfolk, Wildlife
- Neutral: None
- Default Reputation: -100
- Color: Purple

**Corrupted**

- Allies: Undead, Demons
- Enemies: Player, Townsfolk, Wildlife
- Neutral: None
- Default Reputation: -100
- Color: Violet

### Neutral Factions

**Wildlife**

- Allies: None
- Enemies: Undead, Demons, Corrupted
- Neutral: Player, Townsfolk, Bandits, Jungle Tribes
- Default Reputation: 0
- Color: Brown

**Jungle Tribes**

- Allies: None
- Enemies: Corrupted
- Neutral: Player, Townsfolk, Wildlife, Bandits
- Default Reputation: 0
- Color: Lime

**Frost Clans**

- Allies: None
- Enemies: Corrupted, Undead
- Neutral: Player, Wildlife
- Default Reputation: 0
- Color: Cyan

**Desert Nomads**

- Allies: None
- Enemies: Bandits
- Neutral: Player, Merchants, Wildlife
- Default Reputation: 0
- Color: Tan

## System Functions

Located: `src/ts/systems/factionSystem.ts`

### initializeFactionRelations

Initialize faction-based relations for a new entity.

```typescript
initializeFactionRelations(ecs: ECS, entityId: number, factionId: string): void
```

**Example:**

```typescript
const orcId = ecs.createEntity();
ecs.addComponent<FactionComponent>(orcId, 'faction', {
  factionId: 'bandits',
  reputation: 30,
  rank: 1,
});
initializeFactionRelations(ecs, orcId, 'bandits');
// Now orc has relations with all faction members based on diplomacy
```

### updateFactionReputation

Change entity's reputation within their faction.

```typescript
updateFactionReputation(ecs: ECS, entityId: number, delta: number): void
```

**Example:**

```typescript
// Player completes quest for merchants
updateFactionReputation(ecs, playerId, 10); // Reputation: 50 → 60
```

### getFactionRelationModifier

Get bonus/penalty to apply based on faction diplomacy.

```typescript
getFactionRelationModifier(ecs: ECS, entity1Id: number, entity2Id: number): number
```

**Returns:**

- `+10` if factions are allied
- `-10` if factions are enemies
- `0` if factions are neutral or entities have no factions

**Example:**

```typescript
const modifier = getFactionRelationModifier(ecs, merchantId, playerId);
// modifier = +10 (player and merchants are allies)
const finalRelation = baseRelation + modifier;
```

### applyFactionWideRelation

Apply relation change to all members of a faction.

```typescript
applyFactionWideRelation(
  ecs: ECS,
  actorId: number,
  targetFactionId: string,
  relationDelta: number
): void
```

**Example:**

```typescript
// Player attacks townsfolk
applyFactionWideRelation(ecs, playerId, 'townsfolk', -20);
// All townsfolk now dislike player by -20 points
```

### shouldAttackFaction

Determine if entity should attack based on faction relations.

```typescript
shouldAttackFaction(ecs: ECS, attackerId: number, targetId: number): boolean
```

**Logic:**

- Always attack enemy factions
- Never attack allies (unless individual relation < -50)
- Use disposition for entities without factions
- Returns `true` if entity should attack

**Example:**

```typescript
if (shouldAttackFaction(ecs, bandits, playerId)) {
  // Bandit will attack player (enemy factions)
}
```

### getFactionInfo

Get faction display info for UI.

```typescript
getFactionInfo(ecs: ECS, entityId: number):
  { name: string; color: string; reputation: number } | undefined
```

**Example:**

```typescript
const info = getFactionInfo(ecs, entityId);
if (info) {
  console.log(`Faction: ${info.name} (Rep: ${info.reputation})`);
  // Faction: Bandits (Rep: -50)
}
```

## AI System Integration

The AI system now checks faction relations before attacking:

```typescript
// In aiSystem.ts
const factionAttack = shouldAttackFaction(ecs, entityId, playerEntityId);

// Faction relations take priority if both entities have factions
if (
  ecs.getComponent(entityId, 'faction') &&
  ecs.getComponent(playerEntityId, 'faction')
) {
  shouldAttack = factionAttack;
} else {
  // Fall back to disposition-based behavior
  // ...
}
```

**Behavior:**

- Entities with factions prioritize faction diplomacy
- Enemy factions always attack each other
- Allied factions never attack (unless personal relation is very low)
- Entities without factions use disposition system

## Usage Examples

### Creating a Faction Member

```typescript
import { FactionComponent } from './components';
import { initializeFactionRelations } from './systems';

// Create bandit entity
const banditId = ecs.createEntity();
ecs.addComponent<PositionComponent>(banditId, 'position', { x: 10, y: 10 });
ecs.addComponent<FactionComponent>(banditId, 'faction', {
  factionId: 'bandits',
  reputation: 30,
  rank: 1,
});

// Initialize relations with all faction members
initializeFactionRelations(ecs, banditId, 'bandits');
```

### Checking Faction Relationships

```typescript
import { FactionRegistry } from './components/faction';

const registry = FactionRegistry.getInstance();

// Check if two factions are enemies
if (registry.areEnemies('player', 'undead')) {
  console.log('Undead are hostile!');
}

// Check if allied
if (registry.areAllied('player', 'merchants')) {
  console.log('Merchants are friendly!');
}
```

### Faction-Wide Reputation Changes

```typescript
import { applyFactionWideRelation } from './systems';

// Player kills a townsfolk
applyFactionWideRelation(ecs, playerId, 'townsfolk', -30);
// All townsfolk now have -30 relation with player

// Player completes quest for merchants
applyFactionWideRelation(ecs, playerId, 'merchants', 25);
// All merchants now have +25 relation with player
```

### Promoting Within Faction

```typescript
const factionComp = ecs.getComponent<FactionComponent>(entityId, 'faction');
if (factionComp && factionComp.reputation >= 80) {
  factionComp.rank += 1;
  console.log(`Promoted to rank ${factionComp.rank}!`);
}
```

### Faction Leaders

```typescript
// Create faction leader
const chieftainId = ecs.createEntity();
ecs.addComponent<FactionComponent>(chieftainId, 'faction', {
  factionId: 'bandits',
  reputation: 100,
  rank: 3,
  isLeader: true,
});

// Query faction leaders
const leaders = ecs.query('faction').filter((id) => {
  const faction = ecs.getComponent<FactionComponent>(id, 'faction');
  return faction?.isLeader === true;
});
```

## JSON Configuration

Factions can be defined in `src/data/base/factions.json`:

```json
{
  "factions": [
    {
      "id": "custom_faction",
      "name": "Custom Faction",
      "description": "A custom faction for testing.",
      "allies": ["player"],
      "enemies": ["bandits"],
      "neutral": ["wildlife"],
      "defaultReputation": 50,
      "color": "orange"
    }
  ]
}
```

**Note:** JSON loading support planned for future version.

## Integration with Biome System

Factions can be assigned to entities spawned from biome spawn tables:

```typescript
// In entity definition (JSON)
{
  "id": "bandit_archer",
  "name": "Bandit Archer",
  "faction": {
    "factionId": "bandits",
    "reputation": 40,
    "rank": 1
  },
  // ... other components
}
```

## Future Enhancements

- **Faction Quests**: Specific missions from faction leaders
- **Faction Bases**: Special locations controlled by factions
- **Faction Influence**: Control over world map locations
- **Faction Wars**: Dynamic wars between factions
- **Faction Ranks**: Named ranks (Recruit, Soldier, Captain, etc.)
- **Faction Benefits**: Unique items, abilities, or services based on rank
- **Faction Diplomacy**: Player actions affecting faction relationships
- **JSON Loading**: Load faction definitions from data files

## Best Practices

1. **Always initialize relations** after adding FactionComponent
2. **Use faction relations for AI behavior** - More predictable than pure disposition
3. **Apply faction-wide changes sparingly** - Big events like killing leaders, completing major quests
4. **Set leader flag** for important faction NPCs
5. **Use faction colors** for UI consistency (examine mode, faction displays)
6. **Balance reputation gains** - Small increments for quests, large penalties for betrayal
7. **Check faction membership** before applying faction logic (entities without factions use dispositions)

## Troubleshooting

**Problem:** Factions not affecting AI behavior

- **Solution:** Ensure both entities have FactionComponent
- **Solution:** Verify initializeFactionRelations() was called
- **Solution:** Check faction diplomacy settings in FactionRegistry

**Problem:** Allies attacking each other

- **Solution:** Verify faction IDs match exactly (case-sensitive)
- **Solution:** Check if individual relation score is below -50 (overrides alliance)

**Problem:** Reputation not changing

- **Solution:** Ensure entity has FactionComponent
- **Solution:** Verify updateFactionReputation() is being called
- **Solution:** Check that reputation is clamped 0-100

## See Also

- **[DISPOSITION-SYSTEM.md](./DISPOSITION-SYSTEM.md)** - Entity behavior without factions
- **[COMPONENTS-REFERENCE.md](./COMPONENTS-REFERENCE.md)** - All component documentation
- **[SYSTEMS-REFERENCE.md](./SYSTEMS-REFERENCE.md)** - All system documentation
- **[DATA-SYSTEM.md](./DATA-SYSTEM.md)** - JSON data loading
