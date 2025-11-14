/*
 * File: classSystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 11:55:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 11:55:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import {
  addStatModifier,
  removeStatModifiersBySource,
} from './statModifierSystem';

import type { ClassComponent } from '../components/class';
import { ClassRegistry } from '../data/classRegistry';
import type ECS from '../ecs';
import { ModifierType } from '../components/statModifier';

const CLASS_MODIFIER_SOURCE = 'class';

/**
 * Apply class stat modifiers to an entity
 *
 * Reads the entity's ClassComponent, looks up the class template,
 * and applies all class stat bonuses (base + per-level) as permanent modifiers.
 *
 * Call this once when an entity is created, when its class changes,
 * or when it levels up.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to apply class bonuses to
 */
export function applyClassBonuses(ecs: ECS, entityId: number): void {
  const classComp = ecs.getComponent<ClassComponent>(entityId, 'class');
  if (!classComp) {
    // Entity doesn't have a class (e.g., creatures/beasts)
    return;
  }

  const classRegistry = ClassRegistry.getInstance();
  const classTemplate = classRegistry.get(classComp.classId);

  if (!classTemplate) {
    console.warn(
      `[classSystem] Class "${classComp.classId}" not found in registry`
    );
    return;
  }

  // Remove any existing class modifiers first
  removeStatModifiersBySource(ecs, entityId, CLASS_MODIFIER_SOURCE);

  // Apply base stat modifiers (at level 1)
  if (classTemplate.baseStatModifiers) {
    for (const [stat, modifier] of Object.entries(
      classTemplate.baseStatModifiers
    )) {
      if (!modifier) continue;

      if (modifier.flat !== undefined && modifier.flat !== 0) {
        addStatModifier(
          ecs,
          entityId,
          stat,
          ModifierType.FLAT,
          modifier.flat,
          -1, // Permanent
          CLASS_MODIFIER_SOURCE
        );
      }

      if (modifier.percent !== undefined && modifier.percent !== 0) {
        addStatModifier(
          ecs,
          entityId,
          stat,
          ModifierType.PERCENTAGE,
          modifier.percent,
          -1, // Permanent
          CLASS_MODIFIER_SOURCE
        );
      }
    }
  }

  // Apply per-level stat modifiers
  if (classTemplate.statModifiersPerLevel && classComp.level > 1) {
    const levelsToApply = classComp.level - 1; // Level 1 is covered by base

    for (const [stat, modifier] of Object.entries(
      classTemplate.statModifiersPerLevel
    )) {
      if (!modifier) continue;

      if (modifier.flat !== undefined && modifier.flat !== 0) {
        const totalFlat = modifier.flat * levelsToApply;
        addStatModifier(
          ecs,
          entityId,
          stat,
          ModifierType.FLAT,
          totalFlat,
          -1, // Permanent
          CLASS_MODIFIER_SOURCE
        );
      }

      if (modifier.percent !== undefined && modifier.percent !== 0) {
        const totalPercent = modifier.percent * levelsToApply;
        addStatModifier(
          ecs,
          entityId,
          stat,
          ModifierType.PERCENTAGE,
          totalPercent,
          -1, // Permanent
          CLASS_MODIFIER_SOURCE
        );
      }
    }
  }

  console.log(
    `[classSystem] Applied class bonuses for ${classTemplate.name} level ${classComp.level} to entity ${entityId}`
  );
}

/**
 * Add experience to an entity and handle leveling up
 *
 * Adds XP to the entity, checks for level-up, and applies
 * new class bonuses if leveling occurred.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to add XP to
 * @param amount - Amount of XP to add
 * @returns True if entity leveled up, false otherwise
 */
export function addExperience(
  ecs: ECS,
  entityId: number,
  amount: number
): boolean {
  const classComp = ecs.getComponent<ClassComponent>(entityId, 'class');
  if (!classComp) return false;

  classComp.experience += amount;

  // Check for level-up
  if (classComp.experience >= classComp.experienceToNextLevel) {
    return levelUp(ecs, entityId);
  }

  return false;
}

/**
 * Level up an entity
 *
 * Increases the entity's level, calculates new XP requirement,
 * unlocks new abilities, and reapplies class bonuses.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to level up
 * @returns True if level-up succeeded, false otherwise
 */
export function levelUp(ecs: ECS, entityId: number): boolean {
  const classComp = ecs.getComponent<ClassComponent>(entityId, 'class');
  if (!classComp) return false;

  const classRegistry = ClassRegistry.getInstance();
  const classTemplate = classRegistry.get(classComp.classId);

  if (!classTemplate) {
    console.error(`[classSystem] Class "${classComp.classId}" not found`);
    return false;
  }

  // Increase level
  classComp.level++;

  // Deduct XP spent on leveling
  classComp.experience -= classComp.experienceToNextLevel;

  // Calculate new XP requirement
  const nextLevelXP = classRegistry.getExperienceForLevel(
    classComp.classId,
    classComp.level + 1
  );
  classComp.experienceToNextLevel = nextLevelXP || classComp.level * 100;

  // Unlock new abilities for this level
  const newAbilities = classRegistry.getAbilitiesForLevel(
    classComp.classId,
    classComp.level
  );

  if (newAbilities && newAbilities.length > 0) {
    if (!classComp.abilities) {
      classComp.abilities = [];
    }
    classComp.abilities.push(...newAbilities);
    console.log(
      `[classSystem] Entity ${entityId} unlocked abilities:`,
      newAbilities
    );
  }

  // Reapply class bonuses with new level
  applyClassBonuses(ecs, entityId);

  console.log(
    `[classSystem] Entity ${entityId} leveled up to ${classTemplate.name} level ${classComp.level}!`
  );

  return true;
}

/**
 * Change an entity's class
 *
 * Updates the ClassComponent, resets level/XP, and reapplies class bonuses.
 * Removes old class bonuses before applying new ones.
 *
 * @param ecs - The ECS instance
 * @param entityId - Entity to change class for
 * @param newClassId - ID of the new class
 * @param startLevel - Starting level (default: 1)
 */
export function changeClass(
  ecs: ECS,
  entityId: number,
  newClassId: string,
  startLevel: number = 1
): void {
  const classRegistry = ClassRegistry.getInstance();
  const newClass = classRegistry.get(newClassId);

  if (!newClass) {
    console.error(`[classSystem] Class "${newClassId}" not found in registry`);
    return;
  }

  // Calculate XP requirement for next level
  const nextLevelXP = classRegistry.getExperienceForLevel(
    newClassId,
    startLevel + 1
  );

  // Update or create class component
  let classComp = ecs.getComponent<ClassComponent>(entityId, 'class');

  if (!classComp) {
    ecs.addComponent<ClassComponent>(entityId, 'class', {
      classId: newClassId,
      className: newClass.name,
      level: startLevel,
      experience: 0,
      experienceToNextLevel: nextLevelXP || startLevel * 100,
      abilities: [],
    });
  } else {
    classComp.classId = newClassId;
    classComp.className = newClass.name;
    classComp.level = startLevel;
    classComp.experience = 0;
    classComp.experienceToNextLevel = nextLevelXP || startLevel * 100;
    classComp.abilities = [];
  }

  // Unlock abilities for all levels up to start level
  classComp = ecs.getComponent<ClassComponent>(entityId, 'class')!;
  for (let level = 1; level <= startLevel; level++) {
    const abilities = classRegistry.getAbilitiesForLevel(newClassId, level);
    if (abilities && abilities.length > 0) {
      if (!classComp.abilities) {
        classComp.abilities = [];
      }
      classComp.abilities.push(...abilities);
    }
  }

  // Apply new class bonuses
  applyClassBonuses(ecs, entityId);
}
