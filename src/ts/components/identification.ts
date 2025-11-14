/*
 * File: identification.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 9:59:17 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 9:59:17 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Identification level of an item
 */
export enum IdentificationLevel {
  /** Completely unidentified */
  UNIDENTIFIED = 'unidentified',
  /** Partially identified (e.g., "sword" but not "steel sword +1") */
  PARTIAL = 'partial',
  /** Fully identified */
  FULL = 'full',
}

/**
 * Identification component - Tracks item identification state
 */
export interface IdentificationComponent {
  /** Current identification level */
  level: IdentificationLevel;
  /** Display name when unidentified/partial (e.g., "unknown potion", "sword") */
  apparentName: string;
  /** Display description when unidentified/partial */
  apparentDescription: string;
}
