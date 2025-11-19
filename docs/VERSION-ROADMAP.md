# Version Roadmap

This document outlines the planned version milestones for the LittleJS Roguelike project following Semantic Versioning (MAJOR.MINOR.PATCH).

## Current Version: 0.1.0

**Status**: Core ECS architecture and foundational systems complete

**Completed Features**:

- Complete ECS architecture with entities, components, and systems
- World & Location system with lazy loading
- Tile system with collision detection
- Game singleton controller
- Multiple systems: render, movement, AI, input, player movement, spatial, stat modifiers, relations
- Multiple components: position, health, render, movable, AI, stats, player, input, relation, stat modifiers, location
- Entity factories for player, enemies, and NPCs
- LittleJS integration for rendering and physics
- Development tooling and documentation

---

## Planned Milestones

### Version 0.2.0 - Procedural Generation & Dungeon Crawling

**Focus**: World generation and exploration mechanics

- Procedural dungeon generation algorithms
- Multi-level dungeon exploration
- Stairs and level transitions
- Room and corridor generation
- Dungeon themes and variations
- Basic loot distribution

### Version 0.3.0 - Inventory & Equipment Systems

**Focus**: Item management and character equipment

- Inventory system with capacity limits
- Equipment slots (weapon, armor, accessories)
- Item types and properties
- Item identification system
- Equipped item stat modifications
- Item pickup and drop mechanics
- Basic crafting system

### Version 0.4.0 - Quests & NPC Interactions

**Focus**: Story and social systems

- Quest system (main quests and side quests)
- NPC dialogue system
- Quest tracking and journal
- NPC schedules and behaviors
- Faction reputation system
- Quest rewards and consequences
- Dynamic quest generation

### Version 0.5.0 - Combat & Character Progression

**Focus**: Combat mechanics and character development

- Advanced combat mechanics (positioning, flanking, cover)
- Skill system with progression
- Character leveling and stat allocation
- Ability/spell system with cooldowns
- Status effects and buffs/debuffs
- Combat animations and feedback
- Enemy variety and behaviors

### Version 0.6.0 - World Map & Biomes

**Focus**: Expanded world exploration

- Overworld map system
- Multiple biome types (forest, desert, snow, etc.)
- Biome-specific enemies and hazards
- Environmental effects and weather
- Fast travel system
- Towns and settlements
- Location discovery and fog of war

### Version 0.7.0 - Persistence & Save System

**Focus**: Game state management

- Save/load functionality
- Multiple save slots
- Auto-save system
- Death handling and permadeath options
- Game state serialization
- Settings persistence
- Achievement tracking

### Version 0.8.0 - Content Completion & Balancing

**Focus**: Content and gameplay refinement

- Complete item catalog
- Full enemy roster
- All planned biomes and dungeons
- Boss encounters
- Endgame content
- Gameplay balancing and tuning
- Difficulty modes

### Version 0.9.0 - Polish & Optimization

**Focus**: Quality and performance

- UI/UX improvements
- Performance optimization
- Bug fixes and stability
- Sound effects and music
- Visual polish and animations
- Accessibility features
- Tutorial and help system

### Version 1.0.0 - First Stable Release

**Focus**: Complete, playable game

- All core features complete and polished
- Comprehensive testing and bug fixes
- Full documentation
- Balanced and enjoyable gameplay loop
- Ready for public release
- Modding support (if planned)

---

## Post-1.0 Considerations

After reaching version 1.0.0, future updates will follow:

- **PATCH versions (1.0.x)**: Bug fixes, minor tweaks, balance adjustments
- **MINOR versions (1.x.0)**: New content, features, quality-of-life improvements
- **MAJOR versions (x.0.0)**: Significant changes, major features, breaking changes

---

## Version Update Guidelines

When to increment versions:

- **PATCH (0.1.x)**: Bug fixes, small tweaks, documentation updates
- **MINOR (0.x.0)**: New features, significant additions, non-breaking changes
- **MAJOR (x.0.0)**: Major milestones, breaking changes (after 1.0.0)

During pre-1.0 development, MINOR versions represent significant feature milestones, while the MAJOR version remains 0 to indicate the project is still in development and APIs may change.
