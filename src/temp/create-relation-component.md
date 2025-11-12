Create a new ECS component in src/ts/components/ with the following:

Component Name: Relation
Purpose: Tracks an entity's relation score with another entity
Properties:

- targetEntityId: number - Id of the target entity
- relationScore: number - Relation score value
- minRelationScore: number - Minimum possible relation score
- maxRelationScore: number - Maximum possible relation score

Requirements:

1. Create src/ts/components/relation.ts with proper file header
2. Define RelationComponent interface with JSDoc documentation
3. Export the interface
4. Add export to src/ts/components/index.ts
5. Follow the project's TypeScript strict mode standards
6. Include usage example in JSDoc if complex
