/*
 * File: quality.ts
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
 * Quality component - Represents item quality level
 * 
 * Quality affects item stats:
 * - 0 is basic quality
 * - Positive values (e.g., +1, +2) are better
 * - Negative values (e.g., -1) are worse
 */
export interface QualityComponent {
  /** Quality level (0 = basic, +1 = better, -1 = worse, etc.) */
  level: number;
}
