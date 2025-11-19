# Integrate getColor for sprite color and damage text rendering

## Summary

This PR integrates the centralized `getColor()` function from the color palette system into the render system for sprite colors and damage text rendering. This change replaces hardcoded color values with semantic color names, improving code maintainability and enabling theme switching capabilities.

## Type of change

- [x] Refactor
- [x] Code quality improvement
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Changes Made

### Core Changes

**File: `src/ts/systems/renderSystem.ts`**

1. **Added Color Palette Import**
   ```typescript
   import { BaseColor, getColor } from '../colorPalette';
   ```

2. **Replaced Hardcoded Damage Flash Color**
   - **Before:** `spriteColor = new LJS.Color(1, 1, 1, 1);` (hardcoded white)
   - **After:** `spriteColor = getColor(BaseColor.WHITE);`
   - **Benefit:** Uses semantic color name that respects active color palette

3. **Replaced Hardcoded Damage Text Color**
   - **Before:** `const damageColor = new LJS.Color(1, 0.2, 0.2, dmg.timer / 0.5);`
   - **After:** `const damageColor = getColor(BaseColor.RED, dmg.timer / 0.5);`
   - **Benefit:** Consistent with color palette, supports alpha channel for fade-out effect

### Technical Details

#### Why This Change Matters

The game uses a **centralized color palette system** (`src/ts/colorPalette.ts`) that provides:

- **Semantic Color Names**: `BaseColor.RED`, `BaseColor.WHITE`, `BaseColor.PLAYER` instead of RGB values
- **Theme Switching**: Multiple palettes (default, vibrant, monochrome, retro) can be switched at runtime
- **Consistency**: All colors come from one source, ensuring visual coherence
- **Maintainability**: Update colors in one place rather than searching through codebase

#### Code Quality Improvements

1. **Eliminates Magic Numbers**: No more `new LJS.Color(1, 0.2, 0.2, 1)` scattered in code
2. **Self-Documenting**: `getColor(BaseColor.RED)` is clearer than `new LJS.Color(1, 0, 0)`
3. **Future-Proof**: Adding new color palettes doesn't require code changes
4. **Follows Best Practices**: Aligns with project's color management guidelines

## Files Modified

- `src/ts/systems/renderSystem.ts` - Integrated `getColor()` for sprite damage flash and damage text rendering

## Benefits

### Immediate Benefits
- ✅ Consistent color usage across render system
- ✅ Better code readability with semantic color names
- ✅ Aligns with project's color palette architecture

### Future Benefits
- 🎨 Theme switching will automatically update damage colors
- 🔧 Easier to adjust game's visual style
- 📦 Reduces technical debt from hardcoded values

## How Has This Been Tested?

### Manual Testing
- [x] Compiled successfully with no errors
- [x] Damage flash effect displays correctly (white flash on hit)
- [x] Floating damage numbers display in red and fade out
- [x] Visual appearance unchanged from user perspective
- [x] No rendering performance impact

### Code Review
- [x] Verified `getColor()` supports alpha parameter for fade effects
- [x] Confirmed imports are correct
- [x] Checked that semantic color names match intended colors

## Related Documentation

- **Color Palette System**: `.github/copilot-instructions.md` (Color Palette System section)
- **Architecture**: `docs/ARCHITECTURE.md`
- **Color Palette Implementation**: `src/ts/colorPalette.ts`
- **Best Practices**: `docs/BEST-PRACTICES.md`

### Key Documentation Quotes

From `.github/copilot-instructions.md`:

> **CRITICAL: Always use the color palette system for colors, never hardcode RGB/hex values.**

> The game uses a centralized color palette system (`src/ts/colorPalette.ts`) to ensure consistent theming and allow palette switching.

## Implementation Notes

### Alpha Channel Support

The `getColor()` function accepts an optional `alpha` parameter:

```typescript
getColor(baseColor: BaseColor, alpha?: number): LJS.Color
```

This allows the damage text to fade out while still using the centralized color system:

```typescript
const damageColor = getColor(BaseColor.RED, dmg.timer / 0.5); // Fades from 1.0 to 0.0
```

### Visual Effect System Integration

The changes preserve all existing visual effect functionality:
- Flash effects (from `visualEffect` component)
- Damage flash timing
- Floating damage number animation
- Outline rendering

## Checklist

- [x] Code follows project's style guidelines
- [x] Uses centralized color palette system correctly
- [x] Maintains existing functionality
- [x] No breaking changes
- [x] Documentation references included
- [x] Follows architectural best practices
- [x] Semantic color names used appropriately

## Additional Context

This is part of the ongoing effort to migrate all hardcoded color values to the centralized color palette system. Similar changes should be applied to other systems that currently use hardcoded colors.

### Related Systems to Update (Future Work)
- UI systems (already updated: `inventoryUISystem.ts`, `examineRenderSystem.ts`)
- Location rendering (already updated: `locationType.ts`)
- Other visual systems as they're developed

---

**Version**: 0.11.2  
**Related Issue**: N/A (Code quality improvement)  
**Breaking Changes**: None
