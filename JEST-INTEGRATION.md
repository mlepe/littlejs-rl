# Jest Integration - Implementation Summary

## Problem Statement

Jest tests were failing with:

```
SyntaxError: Unexpected token 'export'
  at node_modules/littlejsengine/dist/littlejs.esm.js:12301
```

**Root Cause:** LittleJS ships as an ES module, but Jest with ts-jest expects CommonJS or needs proper configuration to handle ES modules.

## Solution

### 1. Created LittleJS Mock

**File:** `src/ts/__mocks__/littlejsengine.ts`

**Why:** LittleJS is a browser-based game engine requiring DOM/WebGL. Unit tests should:

- Run in Node.js environment (no browser)
- Test game logic in isolation
- Be fast and reliable

**What's Mocked:**

- `Vector2` class with math operations (add, subtract, distance, length)
- `vec2()` helper function
- `Color`, `TileInfo`, `EngineObject` classes
- Input functions (`keyIsDown`, `keyWasPressed`, `mousePos`)
- Drawing functions (no-ops: `drawTile`, `drawRect`, `drawLine`)
- Utility functions (`rand`, `clamp`, `lerp`)
- `Timer` class

### 2. Updated Jest Configuration

**File:** `jest.config.js`

**Key Changes:**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Redirect littlejsengine imports to mock
  moduleNameMapper: {
    '^littlejsengine$': '<rootDir>/src/ts/__mocks__/littlejsengine.ts',
  },

  // Suppress TypeScript NodeNext module warnings
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },

  // Exclude mocks from coverage
  collectCoverageFrom: ['src/**/*.ts', '!src/ts/__mocks__/**'],
};
```

### 3. Example Test Working

**File:** `src/ts/systems/__tests__/spatialSystem.test.ts`

**Tests:**

- ✅ `getEntitiesAt & isPositionOccupied`
- ✅ `getEntitiesInRadius and getNearestEntity`
- ✅ `getEntitiesInLocation`
- ✅ `hasLineOfSight`

**Output:**

```
PASS  src/ts/systems/__tests__/spatialSystem.test.ts
  spatialSystem
    √ getEntitiesAt & isPositionOccupied (4 ms)
    √ getEntitiesInRadius and getNearestEntity (1 ms)
    √ getEntitiesInLocation (1 ms)
    √ hasLineOfSight (4 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Time:        2.985 s
```

## Files Created/Modified

### New Files

1. **`src/ts/__mocks__/littlejsengine.ts`** (170 lines)
   - Mock implementation of LittleJS for unit testing
   - Includes all commonly used LittleJS features
   - Minimal implementations focused on testability

2. **`TESTING-GUIDE.md`** (430 lines)
   - Comprehensive testing documentation
   - Quick start guide
   - Best practices
   - Troubleshooting
   - Examples for testing components and systems

3. **`jest.config.js`** (updated)
   - Proper ts-jest configuration
   - Module name mapping for LittleJS mock
   - Coverage settings
   - Warning suppression

### Updated Files

1. **`DOCUMENTATION-INDEX.md`**
   - Added TESTING-GUIDE.md to "For Contributors" section
   - Added "Write Tests" task category

2. **`package.json`** (previously modified by user)
   - Already had jest, ts-jest, @jest/globals, ts-node

## Testing Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- spatialSystem.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="getEntitiesAt"
```

## Benefits

### For Development

1. **Unit testing without browser** - Tests run in Node.js, no need for browser environment
2. **Fast feedback loop** - Tests complete in ~3 seconds
3. **Isolation** - Test game logic independently of rendering
4. **TDD-friendly** - Write tests before implementation
5. **CI/CD ready** - Tests can run in automated pipelines

### For Code Quality

1. **Catch bugs early** - Tests run before code reaches production
2. **Prevent regressions** - Automated tests prevent breaking existing features
3. **Documentation** - Tests serve as usage examples
4. **Refactoring confidence** - Safe to refactor with test safety net

### For Collaboration

1. **Clear expectations** - Tests document expected behavior
2. **Onboarding** - New contributors can understand code via tests
3. **PR quality** - Tests required before merging (see PR template)
4. **Review efficiency** - Tests make code review faster and more thorough

## Next Steps

### Immediate

1. ✅ Jest is now working
2. Write tests for existing systems (see `GOOD_FIRST_ISSUES.md`)
3. Aim for >80% coverage on business logic

### Short Term

1. Add tests for all systems in `src/ts/systems/`
2. Add tests for entity factory functions in `entities.ts`
3. Add tests for data loading in `data/`
4. Set up CI/CD to run tests on PRs

### Long Term

1. Integration tests for full gameplay flows
2. Performance benchmarks
3. Visual regression tests (optional, for UI)
4. E2E tests in browser environment (if needed)

## Best Practices Established

### Test Organization

✅ **Co-located tests** - Tests live next to source code in `__tests__/` directories
✅ **Clear naming** - `*.test.ts` or `*.spec.ts` for test files
✅ **Descriptive names** - Test names describe behavior, not implementation

### Test Structure

✅ **AAA Pattern** - Arrange, Act, Assert in every test
✅ **Clean state** - `beforeEach` creates fresh ECS for each test
✅ **Edge cases** - Test empty results, boundary conditions, invalid inputs

### Mock Strategy

✅ **Mock external dependencies** - LittleJS mocked, ECS is real
✅ **Test logic, not rendering** - Focus on data transformations
✅ **Extend mock as needed** - Add missing LittleJS features when required

## Troubleshooting Reference

### Common Issues

| Issue                                 | Solution                                             |
| ------------------------------------- | ---------------------------------------------------- |
| "Cannot find module 'littlejsengine'" | Check `moduleNameMapper` in jest.config.js           |
| "Unexpected token 'export'"           | Already fixed with mock                              |
| Tests pass but code fails in browser  | Update mock to match real LittleJS behavior          |
| Slow tests                            | Run specific tests: `npm test -- filename.test.ts`   |
| TypeScript errors in tests            | Ensure `@types/jest` and jest types in tsconfig.json |
| Mock missing LittleJS function        | Add to `src/ts/__mocks__/littlejsengine.ts`          |

## References

- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Complete testing documentation
- [GOOD_FIRST_ISSUES.md](./GOOD_FIRST_ISSUES.md) - Starter tasks include writing tests
- [DEVELOPER_SUMMARY.md](./DEVELOPER_SUMMARY.md) - ECS best practices
- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)

---

**Status:** ✅ Complete and Working  
**Date:** November 19, 2025  
**Version:** 0.11.2
