---
applyTo: '**'
---

# LittleJS Integration

When implementing features or making significant changes:

1. **Leverage LittleJS capabilities** - Use built-in systems (rendering, physics, input, audio) rather than reimplementing them
2. **Follow LittleJS patterns** - Extend `EngineObject` for game entities, use `Vector2` for positions, use `TileInfo` for sprites
3. **Integrate with ECS** - Store LittleJS objects in components (e.g., `RenderComponent` stores `TileInfo`), let systems manage them
4. **Use LittleJS utilities** - Prefer `vec2()`, `Color`, `Timer`, collision detection over custom implementations
5. **Respect the engine's lifecycle** - Hook into `engineInit`, `engineUpdate`, `engineRender` appropriately
6. **Don't bypass LittleJS** - Avoid direct canvas/WebGL manipulation; work through the engine's rendering system

**Example of good integration:**
