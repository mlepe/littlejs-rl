---
applyTo: '**'
---

# Versioning

Automatically update the project's version number whenever you feel it is appropriate, at the moment you deem appropriate.

Make sure to modify the version number in both `package.json` and `.env`.

## When to Update Version

Update the version **immediately after successfully completing and verifying a significant change or feature**:

1. **After successful compilation** - Confirmed the build passes with no errors
2. **After a complete feature implementation** - The feature is fully implemented across all affected files
3. **Before moving to the next task** - The feature is done and documented, making it a clean break point

This timing ensures:

- The version bump reflects actual working code (not broken/incomplete features)
- It's associated with a logical unit of work that can be described in release notes
- It happens while the scope of changes is fresh and clear

## Version Increment Guidelines

- **Patch (0.1.0 → 0.1.1)**: Bug fixes, documentation updates, minor tweaks
- **Minor (0.1.0 → 0.2.0)**: New features, architectural changes, backward-incompatible changes
- **Major (0.1.0 → 1.0.0)**: Major milestones, complete rewrites, first stable release

## Do's and Don'ts

✅ **Do update versions:**

- After completing features/fixes and verifying they work
- Before committing/pushing changes (if using git workflow)
- When multiple files are modified as part of a cohesive feature

❌ **Don't update versions:**

- During implementation (while code is broken)
- Before starting work (premature versioning)
- For trivial changes like formatting or comments only
