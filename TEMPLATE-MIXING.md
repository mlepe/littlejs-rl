# Template-Mixing Feature

The template-mixing feature allows you to compose entities from reusable component templates, providing flexibility and reducing data duplication in entity definitions.

## Overview

Instead of defining all component data (health, stats, AI, render) directly in each entity, you can:

1. Create reusable **component templates** for common configurations
2. Reference these templates in entity definitions
3. Override specific values when needed (deep merge)

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

Reference templates in your entity definition:

```json
{
  "id": "orc_mage",
  "name": "Orc Mage",
  "type": "character",

  "templates": {
    "renderTemplate": "orcWarriorRender",
    "statsTemplate": "mageStats",
    "aiTemplate": "aggressiveAI",
    "healthTemplate": "normalHealth"
  }
}
```

This entity will:

- Look like an orc warrior (green skin, orc sprite)
- Have mage stats (high intelligence/willpower)
- Behave aggressively
- Have normal health pool

### Selective Overrides (Deep Merge)

You can override specific values from templates:

```json
{
  "id": "custom_goblin",
  "name": "Custom Goblin",
  "type": "creature",

  "templates": {
    "renderTemplate": "goblinScoutRender",
    "statsTemplate": "weakStats",
    "aiTemplate": "fleeingAI",
    "healthTemplate": "fragileHealth"
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

**Override Priority**: Direct entity values > Template values > System defaults

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
4. **Maintainability**: Update a template to affect all entities using it
5. **Readability**: Entity definitions focus on what's unique, not repeated boilerplate

## Examples

### Example 1: Orc Mage

An intelligent orc combining brutish appearance with magical prowess:

```json
{
  "templates": {
    "renderTemplate": "orcWarriorRender", // Looks like orc
    "statsTemplate": "mageStats", // Plays like mage
    "aiTemplate": "aggressiveAI",
    "healthTemplate": "normalHealth"
  },
  "stats": {
    "intelligence": 20, // Even smarter than typical mage
    "strength": 8 // Stronger than typical mage
  }
}
```

### Example 2: Agile Troll

Breaking the "slow brute" troll stereotype:

```json
{
  "templates": {
    "renderTemplate": "trollBruteRender", // Looks like troll
    "statsTemplate": "agileStats", // Fast and nimble
    "aiTemplate": "fleeingAI", // Runs away!
    "healthTemplate": "normalHealth"
  }
}
```

### Example 3: Merchant Warrior

A combat-trained merchant who defends their goods:

```json
{
  "templates": {
    "renderTemplate": "merchantRender",
    "statsTemplate": "balancedStats",
    "aiTemplate": "defensiveAI",
    "healthTemplate": "normalHealth"
  },
  "stats": {
    "charisma": 16, // Extra charisma for trading
    "strength": 12 // Can defend themselves
  }
}
```

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

1. Load referenced templates from registries
2. Start with template values
3. Deep merge with direct entity values
4. Apply defaults for any missing data

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

- Render: `orcWarriorRender`, `goblinScoutRender`
- Stats: `bruteStats`, `mageStats`, `agileStats`
- AI: `aggressiveAI`, `fleeingAI`, `patrolAI`
- Health: `tankHealth`, `fragileHealth`, `bossHealth`

## Future Enhancements

Potential expansions:

- **Granular templates**: Sub-templates for even finer control (sprite templates, color palettes)
- **Template inheritance**: Templates that extend other templates
- **Entity-type sections**: Organize templates by enemy/npc/boss categories
- **Mod support**: Load templates from mod directories
- **Template validation**: Dedicated validation for template definitions

## Troubleshooting

**Q: Template not found warning?**
A: Check that the template ID matches exactly (case-sensitive) and the template file loaded successfully.

**Q: Values not overriding?**
A: Ensure you're using the correct property names. Check template file for exact structure.

**Q: Validation errors with templates?**
A: Templates are optional. You can always provide direct values instead of template references.

**Q: How to see which templates exist?**
A: Check console logs during game startup, or inspect template files in `src/data/base/templates/`.
