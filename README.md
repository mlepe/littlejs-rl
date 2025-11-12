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

## Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running quickly
- **[Architecture Documentation](./ARCHITECTURE.md)** - Detailed system design and patterns
- **[Examples](./src/ts/examples/)** - Code examples for common tasks

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
ecs.addComponent<HealthComponent>(playerId, 'health', { current: 100, max: 100 });

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