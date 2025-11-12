Create a new ECS system in src/ts/systems/ with the following:

System Name: relationSystem
Purpose: Adds relationComponent to game entities that track their relation score with each other entity.
Required Components: relationComponent, entity
Parameters:
- ecs: ECS
- entity: entity - The entity with the relation component.
- targetEntity: entity - The target entity that is the subject of the relation.

Behavior:
Tracks changes in an entity's relation towards another (target entity) after each action from target entity that can impact the relation.

Requirements:
1. Create src/ts/systems/relationSystem.ts with proper file header
2. Implement system as a pure function
3. Query entities with required components
4. Handle undefined components safely
5. Add comprehensive JSDoc with @param, @example
6. Export function
7. Add export to src/ts/systems/index.ts
8. Keep cognitive complexity under 15
9. Follow ESLint rules (use for...of, not forEach)

Integration:
- Call in game loop at: gameUpdate
- Call order: after other systems