# Project TODOs

> **Last Updated:** November 21, 2025  
> **Current Version:** v0.13.0

This document tracks ongoing tasks, features to implement, and technical debt for the LittleJS Roguelike project.

## 📋 Table of Contents

- [High Priority](#high-priority)
- [Code TODOs (Found in Codebase)](#code-todos-found-in-codebase)
- [Features to Implement](#features-to-implement)
- [Systems to Complete](#systems-to-complete)
- [Technical Debt](#technical-debt)
- [Documentation](#documentation)
- [Testing](#testing)
- [Optimization](#optimization)

---

## 🔥 High Priority

### Immediate Tasks

- [ ] **Implement tile zones** - Add TileZones functionality for region-based sprite management
- [ ] **Player death handling** - Implement game over, respawn, or permadeath mechanics
- [ ] **Update data usage examples** - Update `src/ts/examples/dataUsageExample.ts` to use new Location API
- [ ] **Tile sprites definition** - Complete a basic enum of tiles TileSprite and remove AutoTileSprite to use TileSprite instead.
- [ ] **Tile sprites redundancy and incoherences** - Review and streamline tile sprite definitions across the codebase (too many duplicates and inconsistencies)
- [ ] **Item rendering** - Add item rendering on tiles
- [ ] **Inventory** - Implement a simpler inventory UI (like old Caves of Qud) (list, no drag and drop, simple and reliable)
- [ ] **Entities** - Remove distinction between enemy and NPCs in entities data
- [ ] **Proper use of tile resolver and color palette** - Review data and code for proper use of tile resolver and color palette
- [ ] **Tile zones** - Implement TileZones for better tile categorization
- [ ] **Biome management** - Implement biome-specific tile and entity configurations

### Critical Systems

- [ ] **Mana system** - Create `ManaComponent` and integrate with consumable effects (restore_mana)
- [ ] **Summoning system** - Implement summon_ally consumable effect
- [ ] **Map reveal system** - Implement map_reveal consumable effect

---

## 💻 Code TODOs (Found in Codebase)

### Tile Configuration (`src/ts/tileConfig.ts`)

- [ ] **Line 616**: Add zones to `TileZones` Map

### Status Effect System (`src/ts/systems/statusEffectSystem.ts`)

- [ ] **Line 263**: Implement accuracy reduction when combat system exists (blind effect)

### Stat Modifier System (`src/ts/systems/statModifierSystem.ts`)

- [ ] **Line 197**: Get equipment weight when inventory system is fully implemented

### Loot System (`src/ts/systems/lootSystem.ts`)

- [ ] **Line 209**: Load loot table from data system (currently using placeholder)
- [ ] **Line 283**: Integrate with inventory system for better item placement
- [ ] **Line 295**: Add to inventory using `addItem` from inventorySystem

### Item Usage System (`src/ts/systems/itemUsageSystem.ts`)

- [ ] **Line 165**: Implement proper mana system with `ManaComponent`
- [ ] **Line 338**: Implement summoning system for summon_ally effect
- [ ] **Line 345**: Implement map reveal system for map_reveal effect

### Inventory UI System (`src/ts/systems/inventoryUISystem.ts`)

- [ ] **Line 469**: Implement item usage system integration (may be completed)

### Inventory System (`src/ts/systems/inventorySystem.ts`)

- [ ] **Line 317**: Apply penalties when combat/movement systems are ready (overencumbered state)

### Derived Stats System (`src/ts/systems/derivedStatsSystem.ts`)

- [ ] **Line 156**: Add equipment weight calculation when inventory system is fully implemented

### Death System (`src/ts/systems/deathSystem.ts`)

- [ ] **Line 50**: Handle player death (game over, respawn, permadeath options)

### Examples (`src/ts/examples/dataUsageExample.ts`)

- [ ] **Line 19**: Update examples to use new Location API

---

## 🎮 Features to Implement

### Core Gameplay Systems

- [ ] **Procedural dungeon generation** - Rooms, corridors, and multi-level dungeons
- [ ] **Quest system** - Main quests, side quests, quest tracking
- [ ] **Dialogue system** - NPC conversations and branching dialogue
- [ ] **Skill progression** - Skill-based leveling through use
- [ ] **Spell crafting** - Custom spell creation system
- [ ] **Alchemy system** - Potion crafting from ingredients

### Character Systems

- [ ] **Character classes** - Expand class system with unique abilities per class
- [ ] **Character races** - Expand race system with racial bonuses and abilities
- [ ] **Mutation system** - Dynamic character modification (inspired by Caves of Qud)
- [ ] **Body modification** - Prosthetics, implants, or biological changes
- [ ] **Deity worship** - Gods with domains, alignment, and unique benefits

### World Features

- [ ] **Multiple biomes** - Forest, desert, snow, swamp, volcanic, etc.
- [ ] **Towns and settlements** - Safe zones with NPCs and services
- [ ] **NPC schedules** - Daily routines for NPCs
- [ ] **Day-night cycle** - Dynamic time system
- [ ] **Dynamic weather** - Weather effects on gameplay
- [ ] **Z-levels** - Multi-floor dungeons

### Item Features

- [ ] **Item crafting** - Weapon/armor crafting system
- [ ] **Item enchanting** - Add magical properties to items
- [ ] **Item durability** - Wear and tear system
- [ ] **Cursed items** - Cannot be unequipped without uncursing
- [ ] **Blessed items** - Enhanced stats and special effects
- [ ] **Artifact items** - Unique named items with special properties

### Social & Economy

- [ ] **Trading system** - Buy/sell items from merchants
- [ ] **Faction system** - Multiple joinable factions with questlines
- [ ] **Reputation system** - Dynamic faction relationships
- [ ] **Player housing** - Establish and upgrade home bases
- [ ] **Income & taxes** - Economic simulation
- [ ] **Tourism system** - Attract guests to player properties

### Combat & Effects

- [ ] **Elemental interactions** - Fire melts ice, water conducts lightning, etc.
- [ ] **Tactical positioning** - Flanking, cover, high ground bonuses
- [ ] **Line of sight** - Vision-based targeting and stealth
- [ ] **Stealth mechanics** - Sneak attacks and detection systems
- [ ] **Boss battles** - Unique boss encounters with special mechanics

---

## 🔧 Systems to Complete

### Partially Implemented Systems

- [ ] **Combat system** - Complete melee, ranged, and magic combat
- [ ] **Equipment system** - Finalize all equipment slots and stat modifiers
- [ ] **Loot generation** - Procedural loot with quality tiers
- [ ] **Status effects** - Complete all planned status effects
- [ ] **Consumables** - Finish all consumable types and effects

### New Systems Needed

- [ ] **Save/load system** - Game state persistence
- [ ] **Settings system** - User preferences and keybindings
- [ ] **Achievement system** - Track player accomplishments
- [ ] **Tutorial system** - Guided introduction for new players
- [ ] **Help/encyclopedia system** - In-game reference material
- [ ] **Mod loading system** - Support for user-created content

---

## 🏗️ Technical Debt

### Code Quality

- [ ] **Remove unused imports** - Clean up import statements across files
- [ ] **Consolidate duplicate code** - Refactor repeated patterns
- [ ] **Improve error handling** - Add try-catch blocks where needed
- [ ] **Type safety improvements** - Strengthen TypeScript types
- [ ] **Legacy constant cleanup** - Phase out deprecated sprite constants

### Architecture

- [ ] **Component dependency management** - Document component relationships
- [ ] **System execution order** - Formalize and document system dependencies
- [ ] **Event system** - Create event bus for decoupled communication
- [ ] **Performance profiling** - Identify and fix bottlenecks

### Data Management

- [ ] **Data validation** - Strengthen JSON schema validation
- [ ] **Template inheritance** - Improve template composition system
- [ ] **Data migration tools** - Support for upgrading old save files

---

## 📚 Documentation

### Technical Documentation

- [ ] **API reference** - Complete API documentation for all systems
- [ ] **Component catalog** - Detailed guide for each component
- [ ] **System catalog** - Detailed guide for each system
- [ ] **Data format specs** - Complete JSON schema documentation

### User Documentation

- [ ] **Player guide** - How to play the game
- [ ] **Controls reference** - Complete keybinding list
- [ ] **Strategy guide** - Tips and tactics
- [ ] **Lore documentation** - World building and story

### Developer Documentation

- [ ] **Modding guide** - How to create mods
- [ ] **Contributing guide** - Expand CONTRIBUTING.md
- [ ] **Architecture diagrams** - Visual system overviews
- [ ] **Code examples** - More usage examples for common patterns

---

## 🧪 Testing

### Test Coverage

- [ ] **Unit tests for all systems** - Achieve >80% coverage
- [ ] **Integration tests** - Test system interactions
- [ ] **End-to-end tests** - Full gameplay scenarios
- [ ] **Performance benchmarks** - Track performance metrics

### Test Infrastructure

- [ ] **Mock data generation** - Automated test data creation
- [ ] **Visual regression testing** - Catch rendering issues
- [ ] **CI/CD pipeline** - Automated testing on commits
- [ ] **Test documentation** - Document testing strategies

---

## ⚡ Optimization

### Performance

- [ ] **Entity pooling** - Reuse entity objects
- [ ] **Spatial partitioning** - Optimize entity queries
- [ ] **Render batching** - Reduce draw calls
- [ ] **Asset optimization** - Compress textures and audio
- [ ] **Code splitting** - Lazy load game modules

### Memory Management

- [ ] **Texture atlasing** - Combine sprites into atlases
- [ ] **Audio streaming** - Stream music instead of loading
- [ ] **Location unloading** - More aggressive memory cleanup
- [ ] **Cache optimization** - Smart caching strategies

---

## 📝 Notes

### Version Planning

Refer to [VERSION-ROADMAP.md](VERSION-ROADMAP.md) for long-term version planning and milestone features.

### Prioritization Guidelines

1. **High Priority** - Blocks other features or critical for gameplay
2. **Medium Priority** - Important but not blocking
3. **Low Priority** - Nice-to-have improvements
4. **Future** - Post-1.0 features

### Contributing

When working on a TODO:

1. Move it to "In Progress" section (optional)
2. Create a branch if using git workflow
3. Update relevant documentation
4. Add tests if applicable
5. Mark as complete with ✅ when done
6. Update this file to remove completed items

---

## ✅ Recently Completed

### v0.13.0 (November 2025)

- ✅ Tile sprite resolver system
- ✅ Dynamic tileset switching
- ✅ JSON-based tileset configurations
- ✅ Migration of all entity factories to resolver
- ✅ Comprehensive resolver documentation

### v0.12.0 and Earlier

- ✅ Template mixing system for entities and items
- ✅ Data-driven entity and item registries
- ✅ Elemental combat system
- ✅ Item system with inventory, equipment, and identification
- ✅ Status effect system
- ✅ World map system with biomes
- ✅ View mode system (location, inventory, examine, world_map)
- ✅ Relation system for entity relationships
- ✅ Color palette system

---

**Last Updated:** November 21, 2025  
**Maintainer:** Matthieu LEPERLIER
