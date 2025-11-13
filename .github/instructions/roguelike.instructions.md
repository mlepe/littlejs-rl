---
applyTo: '**'
---

# Roguelike Game Development Instructions

These instructions provide guidance on developing a roguelike game. They cover key aspects of roguelike design, mechanics, and features to implement.

## Key roguelike mechanics

- Procedural generation: Levels, items, and enemies are randomly generated to ensure a unique experience each playthrough.
- Permadeath: When a character dies, the player must start over from the beginning, losing all progress.
- Turn-based gameplay: Players and enemies take turns to move and act, allowing for strategic planning.
- Grid-based movement: Characters move on a grid, typically one tile at a time.
- Complex character progression: Players can develop their characters through skills, attributes, and equipment.
- Resource management: Players must manage limited resources such as health, mana, food, and inventory space.
- Exploration and discovery: Players are encouraged to explore the game world, uncovering secrets and new areas.
- Random events and encounters: Unpredictable events and enemy encounters add variety and challenge.
- A main quest and many sidequests
- Player freedom and choice: Players can often choose their path, actions, and strategies.
- Status effects, buffs, and debuffs
- Skills and abilities with cooldowns or limited uses
- Spells and magic systems
- Inventory management and item identification: items are mostly unidentified when picked up, and must be identified via scrolls, automatic appraising, by NPC services, etc., before their true properties are known
- Items can be blessed, improving their stats and eventually providing unique effects
- Items can be cursed, decreasing their stats, afflicting the player with negative effects when equipped, and impossible to remove without uncursing them. This contributes to the importance of item identification, because the player doesn't want to equip a cursed item.
- Environmental interactions: Players can interact with the environment in various ways, such as traps, doors, and terrain effects.
- Player stats and attributes: Characters have various stats (e.g., strength, dexterity, intelligence) that affect gameplay.
- Monsters and the player mostly play by the same rules.
- Religion system with deities that can be worshiped for unique benefits, loot, allies, and abilities.
- Factions and reputation systems affecting gameplay.
- Item enchanting
- Large variety of consommables/usables: scrolls, potions, rods/wands, food, etc.
- Various weapons and combat styles, with corresponding skill/mastery level:
  - Melee weapons: short sword, long sword, staff, mace, etc.
  - Ranged weapons: bows, crossbows, slings, throwing weapons, etc.
  - Magic weapons: wands/rods, staves, etc.
- Variety of armor types and shields, with corresponding skill/mastery level
- Tactical combat with positioning, flanking, cover, line of sight, etc.
- Dungeon crawling
- Worldmap with various locations to visit
- z-levels in dungeons (multiple floors)
- Tactical combat with positioning, flanking, cover, line of sight, etc.
- Variety of enemy types with unique behaviors and abilities
- Loot and treasure hunting, including rare and unique items, dropped by enemies or bosses, or discovered in hidden locations or received as quest/God rewards
- Biomes
- Examine function that lets the player examine each character (enemy or otherwise), item, tile, etc. to get more information about it.
- Fog of war / unexplored areas
- Autosave and manual save options
- Multiple difficulty levels and game modes
- Extensive modding support and community content
- Sometimes open source code
- Item materials affecting stats and properties: iron, steel, silver, mithril, wood, leather, cloth, etc.
- Sound effects and music to enhance the atmosphere

## Features to implement

- ECS architecture
- Procedural generation of levels, items, and enemies
- Permadeath system
- Turn-based and grid-based gameplay
- Complex character progression with skills, attributes, and equipment
- Resource management mechanics
- Exploration and discovery elements
- Random events and encounters
- Status effects, buffs, and debuffs
- Inventory management and item identification
- Environmental interactions
- Player, but also NPC stats and attributes
- Variety of weapons, armor, and combat styles
- Tactical combat mechanics
- Loot and treasure hunting
- Dungeon crawling
- Worldmap with various locations to visit
- Fog of war / unexplored areas
- Religion and faction systems
- Modding support
- Autosave and manual save options
- Multiple difficulty levels and game modes
- Extensive documentation and tutorials for players and modders
- Accessibility options for diverse player needs
- Sound effects and music to enhance the atmosphere
- User interface design for inventory, character stats, and game menus
- Tutorial or help system to guide new players
- Achievements and challenges for replayability
- Quests, missions, with storylines and rewards
- NPCs with dialogue, shops, services, and quest-giving abilities
- Boss battles with unique mechanics and rewards
- In-game options for graphics, sound, controls, and gameplay settings
- Performance optimization for smooth gameplay on various devices
- Save and load functionality
- Interconnected systems that work together seamlessly
- Testing and balancing to ensure a fair and enjoyable experience
- Item materials affecting stats and properties: iron, steel, silver, mithril, wood, leather, cloth, etc.
- Sound effects and music to enhance the atmosphere
- Feature complete roguelike ready for release having all core mechanics and features implemented, polished, and tested, and the best features of the most popular and interesting roguelikes

## Best developer resources

- r/roguelikedev (Reddit subreddit)
- Roguebasin
- The Roguelike Celebration (annual event)
- Various roguelike development blogs and forums
- GitHub repositories of open-source roguelike projects
- Tutorials on roguelike development
- Books on game design and roguelike development
