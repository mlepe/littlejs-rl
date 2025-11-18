# LittleJS Roguelike

A roguelike game built with [LittleJS](https://github.com/KilledByAPixel/LittleJS) engine and TypeScript, featuring a clean Entity Component System (ECS) architecture.

## Features

- 🎮 **Pure ECS Architecture** - Clean separation of data (components) and logic (systems)
- 🗺️ **Procedural World Generation** - Grid-based world with multiple locations
- 🎨 **Tile-based Graphics** - 16x16 pixel art tileset with LittleJS rendering
- 🤖 **AI System** - Multiple AI types (aggressive, passive, fleeing)
- 💬 **Relationship System** - Dynamic NPC relationships and attitudes
- 🎯 **Spatial Queries** - Efficient entity lookups by position and radius
- 📦 **TypeScript** - Full type safety and IDE support

## Quick Start

```bash
# Install dependencies
npm install

# Build and run development server
npm run dev
```

The game will be available at `http://localhost:8080`

## Controls

- **Arrow Keys** or **WASD**: Move player
- **Space**: Action (interact, attack)
- **G**: Pickup items
- **I**: Toggle inventory
- **L**: Toggle examine mode
- **[** / **]**: World map navigation

📋 **[Complete Keybindings Reference](./KEYBINDINGS-REFERENCE.md)** - All keyboard controls with alternatives

## Documentation

📚 **[Complete Documentation Index](./DOCUMENTATION-INDEX.md)** - Find all documentation organized by topic

### Getting Started

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running quickly
- **[Quick Start - Data System](./QUICKSTART-DATA.md)** - Using the data-driven content system

### Core References

- **[Architecture Overview](./ARCHITECTURE.md)** - System design and patterns
- **[Components Reference](./COMPONENTS-REFERENCE.md)** - All ECS components
- **[Systems Reference](./SYSTEMS-REFERENCE.md)** - All ECS systems
- **[View Modes](./VIEW-MODES.md)** - UI view mode system

### Feature Guides

- **[Data System](./DATA-SYSTEM.md)** - JSON-based content
- **[Item System](./ITEM-SYSTEM.md)** - Inventory & equipment
- **[Combat & Elements](./ELEMENTAL-SYSTEM.md)** - Damage & effects
- **[AI & Behavior](./DISPOSITION-SYSTEM.md)** - NPC behaviors
- **[Template Mixing](./TEMPLATE-MIXING.md)** - Modular composition
- **[World & Navigation](./LOCATION-TYPES-BIOMES.md)** - Locations & biomes

_See [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md) for the complete list organized by task and category._

## Project Structure

```
src/
├── index.ts              # Entry point & LittleJS initialization
├── ts/
│   ├── game.ts          # Main game singleton
│   ├── ecs.ts           # Entity Component System implementation
│   ├── entities.ts      # Entity factory functions
│   ├── components/      # ECS components (data structures)
│   ├── systems/         # ECS systems (processing logic)
│   ├── world.ts         # World grid management
│   ├── location.ts      # Individual map areas
│   └── tile.ts          # Tile types and utilities
└── assets/
    └── img/
        └── tileset.png  # 16x16 sprite sheet
```

## Development

### Building

```bash
npm run build        # Build production bundle
npm run serve        # Start development server
npm run dev          # Build + serve
```

### TODO: Inventory UI Testing

**Recent Changes:** The inventory UI has been converted from world coordinates to screen coordinates to fix display size issues. The following functionality needs testing:

- [x] Open inventory with **I key** - should display at proper size (not massive)
- [ ] Mouse hover over inventory items - should highlight correctly
- [ ] Mouse drag-and-drop between inventory and equipment slots
- [ ] Keyboard navigation with arrow keys
- [ ] Equipment slot interaction and item display
- [ ] Item details panel display
- [x] **I key** closes inventory properly
- [x] **ESC key** does NOT close inventory (should open LittleJS debug overlay instead)
- [x] Responsive layout scales correctly with different window sizes
- [ ] Tooltip displays correctly when hovering over items

**Note:** If issues are found, see `INVENTORY-UI-COORDINATE-FIX.md` for implementation details.

### Debug Mode

Enable debug mode in `.env`:

```env
GAME_DEBUG=true
```

Shows:

- FPS counter
- Entity count
- Location info
- Collision overlay

## Architecture Highlights

### Entity Component System

```typescript
// Create entity
const playerId = ecs.createEntity();

// Add components (pure data)
ecs.addComponent<PositionComponent>(playerId, 'position', { x: 10, y: 20 });
ecs.addComponent<HealthComponent>(playerId, 'health', {
  current: 100,
  max: 100,
});

// Query entities
const entities = ecs.query('position', 'health');

// Process in systems (pure functions)
for (const id of entities) {
  const pos = ecs.getComponent<PositionComponent>(id, 'position');
  // ... process entity ...
}
```

### World Management

```typescript
// Create world grid
const world = new World(10, 10, 50, 50); // 10x10 locations, 50x50 tiles each

// Generate location
world.setCurrentLocation(5, 5);
const location = world.getCurrentLocation();
location.generate();

// Entities stored in ECS, not in Location
const playerId = createPlayer(ecs, 25, 25, 5, 5);
```

## License

ISC

## Credits

Built with [LittleJS](https://github.com/KilledByAPixel/LittleJS) by Frank Force
