# Template-Mixing Feature

The template-mixing feature allows you to compose entities from **multiple reusable component templates**, providing flexibility and reducing data duplication in entity definitions.

## Overview

Instead of defining all component data (health, stats, AI, render) directly in each entity, you can:

1. Create reusable **component templates** for common configurations
2. **Layer multiple templates** of the same type for modular composition
3. Reference these templates in entity definitions
4. Override specific values when needed (deep merge)

**Key Feature**: Each component type (render, stats, AI, health) can reference **multiple templates** that are merged sequentially, enabling powerful composition patterns like "base stats + veteran bonus + blessed modifier".

## Component Template Types

### 1. Render Templates (`render.json`)

Define visual appearance:

```json
{
  "id": "orcWarriorRender",
  "name": "Orc Warrior Appearance",
  "sprite": "ENEMY_ORC",
  "color": "#00ff00"
}
```

### 2. Stats Templates (`stats.json`)

Define character attributes:

```json
{
  "id": "mageStats",
  "name": "Mage Stats",
  "stats": {
    "strength": 4,
    "intelligence": 18,
    "willpower": 16,
    ...
  }
}
```

### 3. AI Templates (`ai.json`)

Define behavior patterns:

```json
{
  "id": "aggressiveAI",
  "name": "Aggressive AI",
  "ai": {
    "disposition": "aggressive",
    "detectionRange": 10
  }
}
```

### 4. Health Templates (`health.json`)

Define durability:

```json
{
  "id": "tankHealth",
  "name": "Tank Health",
  "health": {
    "max": 100,
    "regen": 2
  }
}
```

## Usage

### Basic Template Mixing

Reference templates in your entity definition using **arrays**:

```json
{
  "id": "orc_mage",
  "name": "Orc Mage",
  "type": "character",

  "templates": {
    "renderTemplates": ["orcWarriorRender"],
    "statsTemplates": ["mageStats"],
    "aiTemplates": ["aggressiveAI"],
    "healthTemplates": ["normalHealth"]
  }
}
```

This entity will:

- Look like an orc warrior (green skin, orc sprite)
- Have mage stats (high intelligence/willpower)
- Behave aggressively
- Have normal health pool

### Multiple Template Mixing (Layering)

**NEW**: You can now layer multiple templates per component type!

```json
{
  "id": "veteran_orc_warrior",
  "name": "Veteran Orc Warrior",
  "type": "character",

  "templates": {
    "renderTemplates": ["orcWarriorRender"],
    "statsTemplates": ["bruteStats", "veteranBonus"],
    "aiTemplates": ["aggressiveAI"],
    "healthTemplates": ["tankHealth"]
  }
}
```

**Merge order**: Templates merge left-to-right, then direct values override:

```
bruteStats → veteranBonus → direct entity stats
```

Result: Base brute gets +5 strength, +3 toughness, +2 willpower from veteran bonus!

### Advanced Layering Example

```json
{
  "id": "blessed_paladin",
  "name": "Blessed Paladin",
  "type": "character",

  "templates": {
    "statsTemplates": ["balancedStats", "elderBonus", "blessedModifier"],
    "healthTemplates": ["normalHealth", "regenBoost"]
  }
}
```

**Stats merge**: `balancedStats` (10 all) → `elderBonus` (+7 int, +5 will, +3 cha) → `blessedModifier` (+3 all)
**Health merge**: `normalHealth` (50 max) → `regenBoost` (+3 regen/turn)

Final result: Well-rounded paladin with divine blessing and regeneration!

### Selective Overrides (Deep Merge)

You can override specific values from templates:

```json
{
  "id": "custom_goblin",
  "name": "Custom Goblin",
  "type": "creature",

  "templates": {
    "renderTemplates": ["goblinScoutRender"],
    "statsTemplates": ["weakStats"],
    "aiTemplates": ["fleeingAI"],
    "healthTemplates": ["fragileHealth"]
  },

  "render": {
    "color": "#ff00ff" // Override color to magenta
  },

  "stats": {
    "dexterity": 20 // Override only dexterity, keep other stats from template
  },

  "ai": {
    "detectionRange": 15 // Override detection range, keep fleeing disposition
  }
}
```

**Override Priority**:

```
Template[0] → Template[1] → ... → Template[n] → Direct entity values
```

Direct entity values **always** have final say!

## File Organization

Component templates are stored in:

```
src/data/base/templates/
├── render.json         # Visual templates
├── stats.json          # Stat presets
├── ai.json             # AI behavior templates
└── health.json         # Health/durability templates
```

Entity definitions using templates:

```
src/data/base/entities/
├── characters.json
├── enemies.json
├── npcs.json
└── template_mixed.json  # Examples of template mixing
```

## Benefits

1. **Reduced Duplication**: Define common configurations once, reuse everywhere
2. **Consistency**: All "brute" characters use the same `bruteStats` template
3. **Flexibility**: Mix any combination of templates to create unique entities
4. **Modularity**: Layer multiple templates per component for fine-grained control
5. **Maintainability**: Update a template to affect all entities using it
6. **Readability**: Entity definitions focus on what's unique, not repeated boilerplate
7. **Composition Patterns**: Create "base + modifier" patterns (e.g., `agileStats` + `swiftModifier`)

## Examples

### Example 1: Simple Mixing (Single Templates)

An intelligent orc combining brutish appearance with magical prowess:

```json
{
  "templates": {
    "renderTemplates": ["orcWarriorRender"],
    "statsTemplates": ["mageStats"],
    "aiTemplates": ["aggressiveAI"],
    "healthTemplates": ["normalHealth"]
  },
  "stats": {
    "intelligence": 20, // Even smarter than typical mage
    "strength": 8 // Stronger than typical mage
  }
}
```

### Example 2: Layered Stats (Multiple Templates)

Veteran warrior with enhanced stats:

```json
{
  "id": "veteran_orc_warrior",
  "templates": {
    "statsTemplates": ["bruteStats", "veteranBonus"]
  }
}
```

**Merge result**:

- Base: `bruteStats` (15 str, 18 tough)
- Add: `veteranBonus` (+5 str, +3 tough, +2 will)
- Final: 20 str, 21 tough, 10 will

### Example 3: Triple Layering

Divine paladin with multiple stat modifiers:

```json
{
  "id": "blessed_paladin",
  "templates": {
    "statsTemplates": ["balancedStats", "elderBonus", "blessedModifier"]
  }
}
```

**Merge result**:

- Base: `balancedStats` (10 all)
- Add: `elderBonus` (+7 int, +5 will, +3 cha)
- Add: `blessedModifier` (+3 all)
- Final: 13 str, 13 dex, 20 int, 16 cha, 18 will, 13 tough, 13 attr

### Example 4: Health Layering

Boss enemy with massive regenerating health pool:

```json
{
  "id": "regenerating_troll_boss",
  "templates": {
    "healthTemplates": ["bossHealth", "healthBoost", "regenBoost"]
  }
}
```

**Merge result**:

- Base: `bossHealth` (200 max)
- Add: `healthBoost` (+30 max)
- Add: `regenBoost` (+3 regen/turn)
- Final: 230 max HP, 3 HP regen/turn

## Validation

The validation system handles template references gracefully:

- **Template not found**: Warns and falls back to direct values or defaults
- **Missing data**: Less strict when templates are referenced
- **Partial data**: Deep merge allows providing only override values

## Implementation Details

### Loading Order

1. Component templates load first (before entities)
2. Races and classes load (entities may depend on them)
3. Entity definitions load and resolve templates

### Template Resolution

When spawning an entity:

1. Load referenced templates from registries (in array order)
2. Start with first template values
3. Deep merge each subsequent template
4. Deep merge with direct entity values (final override)
5. Apply defaults for any missing data

**Example merge flow for stats**:

```
statsTemplates: ["bruteStats", "veteranBonus"]
stats: { "intelligence": 15 }

Step 1: Load bruteStats → { str: 15, dex: 6, int: 5, ... }
Step 2: Merge veteranBonus → { str: 20, dex: 6, int: 5, tough: 21, will: 10, ... }
Step 3: Override with direct → { str: 20, dex: 6, int: 15, tough: 21, will: 10, ... }
```

### Code Example

```typescript
// Spawn entity using template mixing
const registry = EntityRegistry.getInstance();
const entityId = registry.spawn(ecs, 'orc_mage', x, y, worldX, worldY);
```

The registry automatically resolves all templates and creates the entity with merged data.

## Adding New Templates

### 1. Create Template

Add to appropriate template file (e.g., `stats.json`):

```json
{
  "id": "necromancerStats",
  "name": "Necromancer Stats",
  "description": "Dark magic specialist",
  "stats": {
    "strength": 5,
    "intelligence": 20,
    "willpower": 18,
    "charisma": 6
  }
}
```

### 2. Reference in Entity

```json
{
  "id": "necromancer_enemy",
  "templates": {
    "statsTemplate": "necromancerStats",
    ...
  }
}
```

### 3. Templates Auto-Load

The `DataLoader` automatically loads all template files during initialization.

## Naming Conventions

Template IDs follow `{descriptor}{ComponentType}` pattern:

**Base Templates** (full configurations):

- Render: `orcWarriorRender`, `goblinScoutRender`
- Stats: `bruteStats`, `mageStats`, `agileStats`
- AI: `aggressiveAI`, `fleeingAI`, `patrolAI`
- Health: `tankHealth`, `fragileHealth`, `bossHealth`

**Modifier Templates** (partial enhancements for layering):

- Stats: `veteranBonus`, `elderBonus`, `blessedModifier`, `swiftModifier`
- Health: `healthBoost`, `regenBoost`

Use **base templates** as the first element, then add **modifiers** for incremental changes.

## Future Enhancements

Potential expansions:

- **Template inheritance**: Templates that extend other templates within registry
- **Template priority/weights**: Explicit merge order control beyond array position
- **Entity-type sections**: Organize templates by enemy/npc/boss categories
- **Mod support**: Load templates from mod directories
- **Template validation**: Dedicated validation for template definitions
- **Conditional templates**: Apply templates based on entity context (level, location, etc.)

## Troubleshooting

**Q: Template not found warning?**
A: Check that the template ID matches exactly (case-sensitive) and the template file loaded successfully.

**Q: Values not overriding?**
A: Ensure you're using the correct property names. Check template file for exact structure.

**Q: Validation errors with templates?**
A: Templates are optional. You can always provide direct values instead of template references.

**Q: How to see which templates exist?**
A: Check console logs during game startup, or inspect template files in `src/data/base/templates/`.
