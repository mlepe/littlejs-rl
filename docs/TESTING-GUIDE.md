# Testing Guide

## Overview

This project uses **Jest** with **ts-jest** for unit testing. Tests are written in TypeScript and focus on testing ECS components and systems in isolation.

## Quick Start

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

## Test Structure

### File Organization

```
src/
├── ts/
│   ├── __mocks__/
│   │   └── littlejsengine.ts    # Mock LittleJS for testing
│   ├── systems/
│   │   ├── __tests__/
│   │   │   └── spatialSystem.test.ts
│   │   └── spatialSystem.ts
│   └── components/
│       └── position.ts
```

**Conventions:**

- Test files: `*.test.ts` or `*.spec.ts`
- Co-located tests: `__tests__/` directory next to source
- Mocks: `__mocks__/` directory

### Example Test

```typescript
import { describe, test, expect, beforeEach } from '@jest/globals';
import ECS from '../../ecs';
import { getEntitiesAt, isPositionOccupied } from '../spatialSystem';
import { PositionComponent } from '../../components';

describe('spatialSystem', () => {
  let ecs: ECS;

  beforeEach(() => {
    ecs = new ECS();
  });

  test('getEntitiesAt returns entities at specific position', () => {
    // Arrange
    const entity1 = ecs.createEntity();
    ecs.addComponent<PositionComponent>(entity1, 'position', { x: 10, y: 20 });

    const entity2 = ecs.createEntity();
    ecs.addComponent<PositionComponent>(entity2, 'position', { x: 10, y: 20 });

    // Act
    const result = getEntitiesAt(ecs, 10, 20);

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toContain(entity1);
    expect(result).toContain(entity2);
  });
});
```

## Mocking LittleJS

**Why mock?**

- LittleJS is a browser-based game engine (requires DOM, WebGL)
- Unit tests should run in Node.js environment
- Tests should focus on game logic, not rendering

**Mock Location:** `src/ts/__mocks__/littlejsengine.ts`

**What's mocked:**

- `Vector2` class with math operations
- `vec2()` helper function
- `Color`, `TileInfo`, `EngineObject` classes
- Input functions (`keyIsDown`, `mousePos`, etc.)
- Drawing functions (no-ops)
- Utility functions (`rand`, `clamp`, etc.)

**Usage in tests:**

```typescript
import * as LJS from 'littlejsengine'; // Automatically uses mock

const pos = LJS.vec2(10, 20);
const distance = pos.distance(LJS.vec2(5, 10));
```

**Extending the mock:**

If you use LittleJS features not in the mock:

1. Open `src/ts/__mocks__/littlejsengine.ts`
2. Add the missing function/class
3. Provide minimal implementation or return mock data

```typescript
// Example: Adding a missing function
export function myMissingFunction(arg: number): number {
  return arg * 2; // Simple mock behavior
}
```

## Testing ECS Components

**Components are data-only** - test by creating and verifying properties:

```typescript
test('PositionComponent stores x and y', () => {
  const ecs = new ECS();
  const entity = ecs.createEntity();

  ecs.addComponent<PositionComponent>(entity, 'position', { x: 5, y: 10 });

  const pos = ecs.getComponent<PositionComponent>(entity, 'position');
  expect(pos?.x).toBe(5);
  expect(pos?.y).toBe(10);
});
```

## Testing ECS Systems

**Systems are functions** - test inputs and outputs:

```typescript
test('movementSystem moves entities', () => {
  const ecs = new ECS();
  const entity = ecs.createEntity();
  ecs.addComponent<PositionComponent>(entity, 'position', { x: 0, y: 0 });
  ecs.addComponent<MovableComponent>(entity, 'movable', { speed: 1.0 });

  movementSystem(ecs, 5, 10); // Move +5x, +10y

  const pos = ecs.getComponent<PositionComponent>(entity, 'position');
  expect(pos?.x).toBe(5);
  expect(pos?.y).toBe(10);
});
```

## Best Practices

### 1. Test Pure Logic, Not Rendering

❌ **Don't test:**

```typescript
// Bad: Testing LittleJS rendering
test('renderSystem draws entities', () => {
  renderSystem(ecs);
  expect(/* canvas pixel check? */); // Difficult and brittle
});
```

✅ **Do test:**

```typescript
// Good: Testing data transformations
test('renderSystem processes all entities with render components', () => {
  const ecs = new ECS();
  const entity1 = ecs.createEntity();
  ecs.addComponent(entity1, 'position', { x: 0, y: 0 });
  ecs.addComponent(entity1, 'render', {
    /* ... */
  });

  const entities = ecs.query('position', 'render');
  expect(entities).toContain(entity1);
});
```

### 2. Use `beforeEach` for Clean State

```typescript
describe('mySystem', () => {
  let ecs: ECS;

  beforeEach(() => {
    ecs = new ECS(); // Fresh ECS for each test
  });

  test('test 1', () => {
    // Use clean ecs
  });

  test('test 2', () => {
    // Use clean ecs (independent of test 1)
  });
});
```

### 3. Test Edge Cases

```typescript
test('getEntitiesAt handles empty results', () => {
  const ecs = new ECS();
  const result = getEntitiesAt(ecs, 999, 999);
  expect(result).toEqual([]);
});

test('getEntitiesInRadius handles radius of 0', () => {
  const ecs = new ECS();
  const result = getEntitiesInRadius(ecs, 10, 10, 0);
  expect(result).toEqual([]);
});
```

### 4. Test System Interactions

```typescript
test('combatSystem reduces health when entities collide', () => {
  const ecs = new ECS();

  const attacker = ecs.createEntity();
  ecs.addComponent<PositionComponent>(attacker, 'position', { x: 10, y: 10 });
  ecs.addComponent<StatsComponent>(attacker, 'stats', { strength: 15 });

  const defender = ecs.createEntity();
  ecs.addComponent<PositionComponent>(defender, 'position', { x: 10, y: 10 });
  ecs.addComponent<HealthComponent>(defender, 'health', {
    current: 100,
    max: 100,
  });
  ecs.addComponent<StatsComponent>(defender, 'stats', { defense: 5 });

  combatSystem(ecs);

  const health = ecs.getComponent<HealthComponent>(defender, 'health');
  expect(health?.current).toBeLessThan(100); // Took damage
});
```

### 5. Use Descriptive Test Names

```typescript
// Good test names (describe behavior)
test('adds item to inventory when capacity available');
test('rejects item when inventory is full');
test('stacks identical items together');

// Bad test names (vague)
test('inventory works');
test('test1');
test('items');
```

## Coverage

Generate coverage report:

```bash
npm test -- --coverage
```

View detailed coverage:

```bash
# Generate HTML report
npm test -- --coverage --coverageReporters=html

# Open in browser (Windows)
start coverage/index.html
```

**Coverage excludes:**

- `*.test.ts` files
- `__tests__/` directories
- `examples/` directory
- `__mocks__/` directory

## Configuration

**File:** `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^littlejsengine$': '<rootDir>/src/ts/__mocks__/littlejsengine.ts',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!src/ts/examples/**',
    '!src/ts/__mocks__/**',
  ],
};
```

**Key settings:**

- `preset: 'ts-jest'` - TypeScript support
- `testEnvironment: 'node'` - Node.js (not browser)
- `moduleNameMapper` - Redirect littlejsengine to mock
- `collectCoverageFrom` - What to include in coverage

## Troubleshooting

### "Cannot find module 'littlejsengine'"

**Problem:** Test fails to import LittleJS

**Solution:** Verify `moduleNameMapper` in `jest.config.js` points to mock:

```javascript
moduleNameMapper: {
  '^littlejsengine$': '<rootDir>/src/ts/__mocks__/littlejsengine.ts'
}
```

### "SyntaxError: Unexpected token 'export'"

**Problem:** Jest trying to parse ES modules directly

**Solution:** Already configured! Mock intercepts LittleJS imports.

### Tests Pass but Code Fails in Browser

**Problem:** Mock behavior differs from real LittleJS

**Solution:**

1. Update mock to match real behavior
2. Add integration tests (separate from unit tests)
3. Manually test in browser

### Slow Tests

**Problem:** Tests take too long

**Solution:**

```bash
# Run specific test file
npm test -- spatialSystem.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="getEntitiesAt"

# Run in parallel (default)
npm test -- --maxWorkers=4
```

## Writing Your First Test

**Step 1:** Pick a system to test

- Start with pure functions (no side effects)
- Good candidates: `spatialSystem`, `relationSystem`, utility functions

**Step 2:** Create test file

```bash
# Create __tests__ directory if needed
mkdir src/ts/systems/__tests__

# Create test file
touch src/ts/systems/__tests__/mySystem.test.ts
```

**Step 3:** Write test structure

```typescript
import { describe, test, expect, beforeEach } from '@jest/globals';
import ECS from '../../ecs';
import { mySystem } from '../mySystem';

describe('mySystem', () => {
  let ecs: ECS;

  beforeEach(() => {
    ecs = new ECS();
  });

  test('should do something', () => {
    // Arrange: Set up test data
    // Act: Call the function
    // Assert: Verify results
  });
});
```

**Step 4:** Run test

```bash
npm test -- mySystem.test.ts
```

**Step 5:** See it pass! 🎉

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [@jest/globals API](https://jestjs.io/docs/api)

## Next Steps

1. ✅ Tests are now working
2. Write tests for new features before implementing them (TDD)
3. Add tests for existing systems (see `GOOD_FIRST_ISSUES.md`)
4. Aim for >80% coverage on business logic
5. Keep tests fast (<100ms per test)

---

**Happy Testing!** 🧪
