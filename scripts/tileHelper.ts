/*
 * File: tileHelper.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Tile Helper Script
 *
 * Command-line utility for working with tile configuration functions.
 *
 * Usage:
 *   npm run tile-helper getTileCoords <index> [gridWidth]
 *   npm run tile-helper getTileIndex <x> <y> [gridWidth]
 *   npm run tile-helper getTileName <tileType>
 *
 * Examples:
 *   npm run tile-helper getTileCoords 121
 *   npm run tile-helper getTileCoords 121 49
 *   npm run tile-helper getTileIndex 23 2
 *   npm run tile-helper getTileIndex 23 2 49
 *   npm run tile-helper getTileName 1
 */

import { getTileCoords, getTileIndex } from '../src/ts/tileConfig';
import {
  getTileName,
  getTileProperties,
  isTileWalkable,
  isTileTransparent,
  getTileCollisionValue,
  TileType,
} from '../src/ts/tile';

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.error('Error: No command specified');
  console.log('\nAvailable commands:');
  console.log('  getTileCoords <index> [gridWidth]');
  console.log('  getTileIndex <x> <y> [gridWidth]');
  console.log('  getTileName <tileType>');
  console.log('  getTileProperties <tileType>');
  console.log('  isTileWalkable <tileType>');
  console.log('  isTileTransparent <tileType>');
  console.log('  getTileCollisionValue <tileType>');
  console.log('\nExamples:');
  console.log('  npm run tile-helper getTileCoords 121');
  console.log('  npm run tile-helper getTileIndex 23 2');
  console.log('  npm run tile-helper getTileName 1');
  process.exit(1);
}

// Execute commands
try {
  switch (command) {
    case 'getTileCoords': {
      const index = parseInt(args[1]);
      const gridWidth = args[2] ? parseInt(args[2]) : undefined;

      if (isNaN(index)) {
        console.error('Error: Invalid index. Must be a number.');
        process.exit(1);
      }

      const coords = gridWidth
        ? getTileCoords(index, gridWidth)
        : getTileCoords(index);

      console.log(`\nTile Coordinates for index ${index}:`);
      console.log(`  x: ${coords.x}`);
      console.log(`  y: ${coords.y}`);
      console.log(`  Grid Width: ${gridWidth || 49} (default)`);
      break;
    }

    case 'getTileIndex': {
      const x = parseInt(args[1]);
      const y = parseInt(args[2]);
      const gridWidth = args[3] ? parseInt(args[3]) : undefined;

      if (isNaN(x) || isNaN(y)) {
        console.error(
          'Error: Invalid coordinates. Both x and y must be numbers.'
        );
        process.exit(1);
      }

      const index = gridWidth
        ? getTileIndex(x, y, gridWidth)
        : getTileIndex(x, y);

      console.log(`\nTile Index for coordinates (${x}, ${y}):`);
      console.log(`  Index: ${index}`);
      console.log(`  Grid Width: ${gridWidth || 49} (default)`);
      break;
    }

    case 'getTileName': {
      const tileType = parseInt(args[1]) as TileType;

      if (isNaN(tileType)) {
        console.error('Error: Invalid tile type. Must be a number.');
        console.log('\nAvailable TileType values:');
        console.log('  0: VOID');
        console.log('  1: FLOOR');
        console.log('  2: WALL');
        console.log('  3: DOOR_OPEN');
        console.log('  4: DOOR_CLOSED');
        console.log('  5: STAIRS_UP');
        console.log('  6: STAIRS_DOWN');
        console.log('  7: WATER');
        console.log('  8: GRASS');
        console.log('  9: TREE');
        console.log('  10: FLORA');
        process.exit(1);
      }

      const name = getTileName(tileType);
      console.log(`\nTile Name for type ${tileType}:`);
      console.log(`  ${name}`);
      break;
    }

    case 'getTileProperties': {
      const tileType = parseInt(args[1]) as TileType;

      if (isNaN(tileType)) {
        console.error('Error: Invalid tile type. Must be a number.');
        process.exit(1);
      }

      const props = getTileProperties(tileType);
      const name = getTileName(tileType);

      console.log(`\nTile Properties for ${name} (type ${tileType}):`);
      console.log(`  Walkable: ${props.walkable}`);
      console.log(`  Transparent: ${props.transparent}`);
      console.log(`  Collision Value: ${props.collisionValue}`);
      console.log(`  Base Color: ${props.baseColor}`);
      if (props.opacity !== undefined) {
        console.log(`  Opacity: ${props.opacity}`);
      }
      break;
    }

    case 'isTileWalkable': {
      const tileType = parseInt(args[1]) as TileType;

      if (isNaN(tileType)) {
        console.error('Error: Invalid tile type. Must be a number.');
        process.exit(1);
      }

      const walkable = isTileWalkable(tileType);
      const name = getTileName(tileType);

      console.log(`\nIs ${name} (type ${tileType}) walkable?`);
      console.log(`  ${walkable ? 'Yes' : 'No'}`);
      break;
    }

    case 'isTileTransparent': {
      const tileType = parseInt(args[1]) as TileType;

      if (isNaN(tileType)) {
        console.error('Error: Invalid tile type. Must be a number.');
        process.exit(1);
      }

      const transparent = isTileTransparent(tileType);
      const name = getTileName(tileType);

      console.log(`\nIs ${name} (type ${tileType}) transparent?`);
      console.log(`  ${transparent ? 'Yes' : 'No'}`);
      break;
    }

    case 'getTileCollisionValue': {
      const tileType = parseInt(args[1]) as TileType;

      if (isNaN(tileType)) {
        console.error('Error: Invalid tile type. Must be a number.');
        process.exit(1);
      }

      const collision = getTileCollisionValue(tileType);
      const name = getTileName(tileType);

      console.log(`\nCollision value for ${name} (type ${tileType}):`);
      console.log(
        `  ${collision} (${collision === 0 ? 'no collision' : 'solid'})`
      );
      break;
    }

    default:
      console.error(`Error: Unknown command "${command}"`);
      console.log('\nAvailable commands:');
      console.log('  getTileCoords');
      console.log('  getTileIndex');
      console.log('  getTileName');
      console.log('  getTileProperties');
      console.log('  isTileWalkable');
      console.log('  isTileTransparent');
      console.log('  getTileCollisionValue');
      process.exit(1);
  }
} catch (error) {
  console.error('\nError executing command:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
