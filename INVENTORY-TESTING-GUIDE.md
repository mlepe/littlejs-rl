# Inventory System Integration Testing Guide

## Overview

The inventory system is now integrated and ready for testing. This guide explains how to test the core functionality.

## What's Been Integrated

### Systems Added

1. **deathSystem** - Handles entity death and triggers loot drops
2. **pickupSystem** - Handles player picking up items with 'G' key
3. **Loot tables** - Enemies now have loot tables attached

### Integration Points

- Enemy death → loot drops (automatic)
- Player 'G' key → pickup items at position
- Test items spawn automatically in debug mode

## How to Test

### 1. Start the Game

```bash
npm run serve
```

Open `http://localhost:8080` in your browser.

### 2. Test Scenarios

#### A. Pick Up Test Items

- **What**: Test items spawn near player (2-3 tiles east)
- **Items**: Health Potion (x1), Bread (x3)
- **Test**: Press 'G' when standing on items
- **Expected**: Console shows "Picked up: Health Potion", item disappears from ground, added to inventory

#### B. Kill Enemy and Collect Loot

- **What**: Enemy spawns 5 tiles east of player with loot table
- **How to kill**: Stand next to enemy and wait for collision damage (AI will approach you)
- **Expected**:
  - Console shows "Entity X died and dropped Y item(s)"
  - Items appear on ground at enemy position
  - Move to items and press 'G' to pick up

#### C. Test Inventory Weight Capacity

- **What**: Player has carry capacity based on strength (10 str × 10 = 100 weight capacity)
- **Test**: Try picking up many items
- **Expected**: Console shows "Cannot pick up [item] - inventory full (X weight)" when over capacity

### 3. Console Commands for Testing

Open browser console (F12) and try:

```javascript
// Get game instance
const game = Game.getInstance();
const ecs = game.getECS();
const playerId = game.getPlayerId();

// Check player inventory
const inventory = ecs.getComponent(playerId, 'inventory');
console.log('Inventory:', inventory);
console.log('Items:', inventory.items.length);
console.log('Weight:', inventory.currentWeight);

// Check carry capacity
const stats = ecs.getComponent(playerId, 'stats');
console.log('Carry Capacity:', stats.derived.carryCapacity);

// Get item details
inventory.items.forEach((itemId) => {
  const item = ecs.getComponent(itemId, 'item');
  console.log(`${item.name} (x${item.quantity}) - ${item.weight} weight`);
});

// Damage enemy to test death/loot
// Find enemy entities
const enemies = ecs.query('ai', 'health');
const enemyId = enemies[0];
const enemyHealth = ecs.getComponent(enemyId, 'health');
enemyHealth.current = 0; // Kill enemy
// Death system will process next frame and drop loot
```

### 4. Debug Output

Look for these console messages:

```
[Debug] Spawned test enemy at (X, Y) - ID: N
[Debug] Spawned test items at (X, Y)
Entity N died and dropped M item(s)
Picked up: Health Potion
Picked up 1/1 item(s)
Nothing to pick up here. (when pressing G with no items)
```

## Current Limitations (Expected)

1. **No visual feedback** - Items on ground not rendered yet (coming in Step 6: UI)
2. **No inventory display** - Can only check via console (coming in Step 6: UI)
3. **Manual item data** - Test items created manually, not loaded from JSON yet
4. **No combat system** - Must manually damage enemies via console
5. **No item usage** - Can pick up items but can't use consumables yet (needs integration)

## Known Test Items

All test items spawn as "identified" so you can see their full properties:

| Item          | Weight | Quantity | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| Health Potion | 0.5    | 1        | Restores 50 health (crystal material) |
| Bread         | 0.2    | 3        | Food item (stackable)                 |

## Enemy Loot Tables

### Goblin (regular enemy)

- Gold Coin: 100% (1-5)
- Bread: 30% (1-2)
- Health Potion: 15% (1)

### Boss

- Gold Coin: 100% (50-150)
- Steel Sword +1-3: 80% (blessed 30%)
- Iron Armor: 60%
- Health Potion: 100% (3-5)
- Mana Potion: 80% (2-4)
- Mithril Sword (blessed): 5% (rare drop)

## Next Steps

Once basic functionality is verified:

- **Step 6**: Add visual inventory UI
- **Integration**: Connect item usage system (consume health potions)
- **Integration**: Load item templates from base_items.json
- **Integration**: Add combat system to damage enemies naturally
- **Polish**: Add visual indicators for items on ground

## Troubleshooting

**Issue**: No console output

- Check `GAME_DEBUG=true` in `.env`
- Refresh page after build

**Issue**: Can't pick up items

- Check you're standing on item position (player pos must match item pos exactly)
- Press 'G' key (not 'E' or Space)

**Issue**: Items don't appear after enemy death

- Enemy must have loot table attached (check createEnemy/createBoss functions)
- Check console for "Entity X died and dropped 0 item(s)" (means no loot table or bad RNG)

**Issue**: Build errors

- Run `npm run build` to see specific errors
- Check that all imports are correct
