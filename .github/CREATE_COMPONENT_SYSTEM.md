# Development Prompt: Create a 📦 component and its associated ⚙️ system

```
Create a set of component and system.

1.Create a new ECS component in src/ts/components/ with the following:

Component Name: [ComponentName]
Purpose: [Brief description of what this component tracks]
Properties:
- [propertyName]: [type] - [description]
- [propertyName]: [type] - [description]

Requirements:
1. Create src/ts/components/[componentName].ts with proper file header
2. Define [ComponentName]Component interface with JSDoc documentation
3. Export the interface
4. Add export to src/ts/components/index.ts
5. Follow the project's TypeScript strict mode standards
6. Include usage example in JSDoc if complex

Example values: [if applicable]


2.Create a new ECS system in src/ts/systems/ with the following:

System Name: [systemName]System
Purpose: [What this system does and when it runs]
Required Components: [component1, component2, ...]
Optional Components: [component3, ...]
Parameters:
- ecs: ECS
- [paramName]: [type] - [description]

Behavior:
[Detailed description of what the system does each frame/update]

Requirements:
1. Create src/ts/systems/[systemName]System.ts with proper file header
2. Implement system as a pure function
3. Query entities with required components
4. Handle undefined components safely
5. Add comprehensive JSDoc with @param, @example
6. Export function
7. Add export to src/ts/systems/index.ts
8. Keep cognitive complexity under 15
9. Follow ESLint rules (use for...of, not forEach)

Integration:
- Call in game loop at: [gameUpdate/gameRender/gameUpdatePost/etc.]
- Call order: [before/after which other systems]
```
