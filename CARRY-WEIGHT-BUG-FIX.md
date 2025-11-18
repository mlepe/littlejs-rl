# Carry Weight Bug Fix

## Bug Description

**Issue:** Player unable to pick up any items, showing "inventory full" message even for lightweight items like keys.

**Symptom:** When attempting to pick up items by walking over them, the console would show:

```
Cannot pick up [item] - inventory full (X weight)
```

Even though the inventory was empty or had plenty of capacity.

## Root Cause

The bug was in `pickupSystem.ts` line 87. The function was incorrectly calling:

```typescript
canAddItem(ecs, playerId, itemWeight); // ❌ WRONG - passing weight as number
```

But `canAddItem()` expects:

```typescript
canAddItem(ecs: ECS, entityId: number, itemId: number)  // ✅ CORRECT - needs item entity ID
```

**Why this caused the bug:**

1. `canAddItem()` expects an `itemId` (entity ID) as the third parameter
2. It tries to get the `ItemComponent` from this ID: `ecs.getComponent<ItemComponent>(itemId, 'item')`
3. When passed `itemWeight` (a number like `0.5`), it tries to use that as an entity ID
4. Entity with ID `0.5` doesn't exist, so `getComponent()` returns `undefined`
5. The function returns `false` due to the `if (!inventory || !stats || !item) return false;` check
6. All pickup attempts fail

## Fix Applied

### 1. Fixed `pickupSystem.ts`

**Changed:**

```typescript
// OLD - Incorrect parameter order
const itemWeight = getItemWeight(item);
if (!canAddItem(ecs, playerId, itemWeight)) {
  console.log(
    `Cannot pick up ${item.name} - inventory full (${itemWeight} weight)`
  );
  continue;
}
```

**To:**

```typescript
// NEW - Correct parameter order
if (!canAddItem(ecs, playerId, itemId)) {
  const itemWeight = getItemWeight(item);
  console.log(
    `Cannot pick up ${item.name} - inventory full (weight: ${itemWeight})`
  );
  continue;
}
```

### 2. Added Debug Logging in `inventorySystem.ts`

**Enhanced `canAddItem()`** with debug logging to help identify future issues:

```typescript
export function canAddItem(
  ecs: ECS,
  entityId: number,
  itemId: number
): boolean {
  const inventory = ecs.getComponent<InventoryComponent>(entityId, 'inventory');
  const stats = ecs.getComponent<StatsComponent>(entityId, 'stats');
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');

  // Log missing components
  if (!inventory || !stats || !item) {
    console.log('canAddItem: Missing component', {
      inventory: !!inventory,
      stats: !!stats,
      item: !!item,
    });
    return false;
  }

  const itemWeight = getItemWeight(item);
  const newWeight = inventory.currentWeight + itemWeight;
  const canAdd = newWeight <= stats.derived.carryCapacity;

  // Debug logging when capacity check fails
  if (!canAdd) {
    console.log('Carry capacity exceeded:', {
      itemWeight,
      currentWeight: inventory.currentWeight,
      newWeight,
      carryCapacity: stats.derived.carryCapacity,
      strength: stats.base.strength,
    });
  }

  return canAdd;
}
```

This logging will show:

- Which components are missing (if any)
- Current weight vs capacity when pickup fails
- Player's strength stat (for debugging capacity calculation)

## How Carry Weight Works

### System Architecture

1. **Base Stats** (`StatsComponent.base.strength`)
   - Set directly on entity creation
   - Player starts with strength = 10

2. **Derived Stats** (`StatsComponent.derived.carryCapacity`)
   - Calculated from base stats via `calculateDerivedStats()`
   - Formula: `carryCapacity = strength * 10`
   - Example: Strength 10 = 100 carry capacity

3. **Inventory Tracking** (`InventoryComponent`)
   - `items: number[]` - Array of item entity IDs
   - `currentWeight: number` - Sum of all item weights

4. **Item Weight** (`ItemComponent`)
   - `weight?: number` - Individual item weight
   - `quantity: number` - For stackable items
   - Total weight = `weight * quantity`

### Weight Check Flow

```
Player walks over item
  ↓
pickupSystem detects item at position
  ↓
Calls canAddItem(ecs, playerId, itemId)
  ↓
Gets: inventory, stats, item components
  ↓
Calculates: newWeight = currentWeight + itemWeight
  ↓
Checks: newWeight <= derived.carryCapacity
  ↓
If true: Add item, remove from ground
If false: Show "inventory full" message
```

## Testing

After this fix, the following should work correctly:

1. **Empty inventory pickup:**

   ```
   Player: Strength 10 → Capacity 100
   Current weight: 0
   Key weight: 0.1
   New weight: 0.1
   Result: ✅ Can pick up (0.1 ≤ 100)
   ```

2. **Near-capacity pickup:**

   ```
   Player: Strength 10 → Capacity 100
   Current weight: 95
   Sword weight: 3.5
   New weight: 98.5
   Result: ✅ Can pick up (98.5 ≤ 100)
   ```

3. **Over-capacity rejection:**
   ```
   Player: Strength 10 → Capacity 100
   Current weight: 95
   Heavy armor weight: 10
   New weight: 105
   Result: ❌ Cannot pick up (105 > 100)
   Console: "Carry capacity exceeded: { currentWeight: 95, newWeight: 105, carryCapacity: 100, strength: 10 }"
   ```

## Related Files

- `src/ts/systems/pickupSystem.ts` - Pickup input and logic
- `src/ts/systems/inventorySystem.ts` - Inventory management
- `src/ts/systems/derivedStatsSystem.ts` - Carry capacity calculation
- `src/ts/components/stats.ts` - Stats component definition
- `src/ts/components/inventory.ts` - Inventory component definition
- `src/ts/components/item.ts` - Item component definition

## Version

**Fixed in:** v0.11.2
**Date:** 2025-01-19

## Lessons Learned

1. **Type safety doesn't catch all bugs** - TypeScript allowed passing `number` where `number` (entity ID) was expected
2. **Debug logging is essential** - Added comprehensive logging to catch similar issues faster
3. **Parameter naming matters** - Consider renaming to be more explicit: `itemEntityId` instead of just `itemId`
4. **Test edge cases** - Test with empty inventory, full inventory, and near-capacity scenarios

## Future Improvements

1. **Rename parameters for clarity:**

   ```typescript
   canAddItem(ecs: ECS, carrierEntityId: number, itemEntityId: number)
   ```

2. **Add TypeScript branded types:**

   ```typescript
   type EntityId = number & { __brand: 'EntityId' };
   type Weight = number & { __brand: 'Weight' };
   ```

3. **Add unit tests** for inventory system:
   - Test adding items within capacity
   - Test rejection when over capacity
   - Test stacking behavior
   - Test weight calculations
