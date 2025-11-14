/*
 * File: itemStackingSystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 9:59:17 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 9:59:17 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import ECS from '../ecs';
import {
  ItemComponent,
  StackableComponent,
  QualityComponent,
  IdentificationComponent,
} from '../components';

/**
 * Check if two items can stack together
 * Items can stack if they have identical properties
 */
export function canItemsStack(
  ecs: ECS,
  itemId1: number,
  itemId2: number
): boolean {
  // Both items must have stackable component
  const stack1 = ecs.getComponent<StackableComponent>(itemId1, 'stackable');
  const stack2 = ecs.getComponent<StackableComponent>(itemId2, 'stackable');
  if (!stack1 || !stack2) return false;

  // Compare item components
  const item1 = ecs.getComponent<ItemComponent>(itemId1, 'item');
  const item2 = ecs.getComponent<ItemComponent>(itemId2, 'item');
  if (!item1 || !item2) return false;

  // Items must have same type, state, material, and broken state
  if (
    item1.type !== item2.type ||
    item1.state !== item2.state ||
    item1.material !== item2.material ||
    item1.isBroken !== item2.isBroken
  ) {
    return false;
  }

  // Compare quality if present
  const quality1 = ecs.getComponent<QualityComponent>(itemId1, 'quality');
  const quality2 = ecs.getComponent<QualityComponent>(itemId2, 'quality');
  if (quality1 && quality2 && quality1.level !== quality2.level) {
    return false;
  }
  if ((quality1 && !quality2) || (!quality1 && quality2)) {
    return false;
  }

  // Compare identification state
  const ident1 = ecs.getComponent<IdentificationComponent>(
    itemId1,
    'identification'
  );
  const ident2 = ecs.getComponent<IdentificationComponent>(
    itemId2,
    'identification'
  );
  if (ident1 && ident2 && ident1.level !== ident2.level) {
    return false;
  }
  if ((ident1 && !ident2) || (!ident1 && ident2)) {
    return false;
  }

  return true;
}

/**
 * Stack item2 into item1
 * Returns true if successful, false if can't stack or would exceed max
 */
export function stackItems(
  ecs: ECS,
  targetItemId: number,
  sourceItemId: number
): boolean {
  if (!canItemsStack(ecs, targetItemId, sourceItemId)) {
    return false;
  }

  const targetStack = ecs.getComponent<StackableComponent>(
    targetItemId,
    'stackable'
  );
  const sourceStack = ecs.getComponent<StackableComponent>(
    sourceItemId,
    'stackable'
  );

  if (!targetStack || !sourceStack) return false;

  // Check if stacking would exceed max stack size
  if (targetStack.maxStackSize > 0) {
    const totalQuantity = targetStack.quantity + sourceStack.quantity;
    if (totalQuantity > targetStack.maxStackSize) {
      return false;
    }
  }

  // Merge stacks
  targetStack.quantity += sourceStack.quantity;

  // Remove source item entity
  ecs.removeEntity(sourceItemId);

  return true;
}

/**
 * Split a stack into two stacks
 * Returns the entity ID of the new stack, or undefined if can't split
 */
export function splitStack(
  ecs: ECS,
  itemId: number,
  splitQuantity: number
): number | undefined {
  const stack = ecs.getComponent<StackableComponent>(itemId, 'stackable');
  if (!stack) return undefined;

  // Can't split if quantity is too small
  if (stack.quantity <= splitQuantity || splitQuantity <= 0) {
    return undefined;
  }

  // Create new item entity with same components
  const newItemId = ecs.createEntity();

  // Copy all components from original item
  const item = ecs.getComponent<ItemComponent>(itemId, 'item');
  if (item) {
    ecs.addComponent<ItemComponent>(newItemId, 'item', { ...item });
  }

  // Copy stackable component with split quantity
  ecs.addComponent<StackableComponent>(newItemId, 'stackable', {
    quantity: splitQuantity,
    maxStackSize: stack.maxStackSize,
  });

  // Copy other components if present
  const quality = ecs.getComponent<QualityComponent>(itemId, 'quality');
  if (quality) {
    ecs.addComponent<QualityComponent>(newItemId, 'quality', { ...quality });
  }

  const ident = ecs.getComponent<IdentificationComponent>(
    itemId,
    'identification'
  );
  if (ident) {
    ecs.addComponent<IdentificationComponent>(newItemId, 'identification', {
      ...ident,
    });
  }

  // Reduce original stack quantity
  stack.quantity -= splitQuantity;

  return newItemId;
}
