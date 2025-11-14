/*
 * File: stackable.ts
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
 * Stackable component - Items with identical properties can stack
 */
export interface StackableComponent {
  /** Current quantity in this stack */
  quantity: number;
  /** Maximum stack size (0 = infinite) */
  maxStackSize: number;
}
