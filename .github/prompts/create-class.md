---
title: Create New Class File
description: Creates a new TypeScript class file with proper header and imports for LittleJS RL project
---

# Create New Class File

Create a new TypeScript class file in `src/ts/` with the following structure:

## Input Required
- Class name in PascalCase (e.g., `Enemy`, `Weapon`, `Item`)

## File Structure

**Filename**: Convert class name to lowercase with `.ts` extension (e.g., `Enemy` -> `enemy.ts`)

**File Location**: `src/ts/[classname].ts`

**Content**:

1. **Header Comment Block**:
```typescript
/*
 * File: [classname].ts
 * Project: littlejs-rl
 * File Created: [current date and time]
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: [current date and time]
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */
```

2. **Blank line**

3. **LittleJS Import**:
```typescript
import * as LJS from 'littlejsengine';
```

4. **Blank line**

5. **Class Definition**:
```typescript
export default class [ClassName] {
  constructor() {
  }
}
```

## Example Usage

**Prompt**: "Create a new class file for Enemy"

**Result**: Creates `src/ts/enemy.ts` with:
```typescript
/*
 * File: enemy.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 4:41:14 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 11th November 2025 4:41:20 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

export default class Enemy {
  constructor() {
  }
}
```

## Notes
- The header should match the format used in existing project files
- Use the current date/time for File Created and Last Modified
- The filename must be lowercase
- The class name must be PascalCase
