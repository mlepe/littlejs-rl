/*
 * File: locationGenerator.ts
 * Project: littlejs-rl
 * File Created: Thursday, 14th November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 14th November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import Location from './location';
import { LocationType } from './locationType';
import { TileType } from './tile';

/**
 * Room structure for procedural generation
 */
interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Location generator - Procedural generation algorithms for different location types
 */
export class LocationGenerator {
  /**
   * Generate location based on its type
   * @param location - The location to generate
   */
  static generate(location: Location): void {
    const type = location.metadata.locationType;

    switch (type) {
      case LocationType.DUNGEON:
        this.generateDungeon(location);
        break;
      case LocationType.TOWN:
        this.generateTown(location);
        break;
      case LocationType.RUINS:
        this.generateRuins(location);
        break;
      case LocationType.FACTION_BASE:
        this.generateFactionBase(location);
        break;
      case LocationType.WILDERNESS:
        this.generateWilderness(location);
        break;
      case LocationType.CAVE:
        this.generateCave(location);
        break;
      default:
        this.generateDungeon(location);
    }
  }

  /**
   * Generate a dungeon with rooms and corridors
   * @param location - The location to generate
   */
  private static generateDungeon(location: Location): void {
    // Fill with walls
    this.fillWithWalls(location);

    // Generate rooms
    const rooms = this.generateRooms(location, 5, 10, 3, 8, 3, 8);

    // Carve out rooms
    for (const room of rooms) {
      this.carveRoom(location, room);
    }

    // Connect rooms with corridors
    for (let i = 0; i < rooms.length - 1; i++) {
      this.connectRooms(location, rooms[i], rooms[i + 1]);
    }

    // Add stairs in first and last room
    if (rooms.length > 0) {
      const firstRoom = rooms[0];
      const lastRoom = rooms[rooms.length - 1];

      location.setTileType(
        Math.floor(firstRoom.x + firstRoom.width / 2),
        Math.floor(firstRoom.y + firstRoom.height / 2),
        TileType.STAIRS_UP
      );

      location.setTileType(
        Math.floor(lastRoom.x + lastRoom.width / 2),
        Math.floor(lastRoom.y + lastRoom.height / 2),
        TileType.STAIRS_DOWN
      );
    }

    // Add some doors
    this.addDoors(location, rooms, 0.3);
  }

  /**
   * Generate a town with buildings and streets
   * @param location - The location to generate
   */
  private static generateTown(location: Location): void {
    // Fill with floor (streets)
    this.fillWithFloor(location);

    // Generate buildings (rooms are buildings)
    const buildings = this.generateRooms(location, 8, 15, 4, 10, 4, 10);

    // Build walls around buildings
    for (const building of buildings) {
      this.carveBuilding(location, building);
    }

    // Add doors to buildings
    this.addDoors(location, buildings, 0.8);

    // Add some grass/decoration in open areas
    this.addVegetation(location, 0.1);
  }

  /**
   * Generate ruins with broken structures
   * @param location - The location to generate
   */
  private static generateRuins(location: Location): void {
    // Fill with floor
    this.fillWithFloor(location);

    // Generate broken rooms
    const rooms = this.generateRooms(location, 4, 8, 3, 10, 3, 10);

    // Carve rooms with broken walls
    for (const room of rooms) {
      this.carveRuinedRoom(location, room);
    }

    // Add vegetation taking over
    this.addVegetation(location, 0.3);

    // Add some water (collapsed areas)
    this.addRandomWater(location, 0.1);
  }

  /**
   * Generate faction base with organized layout
   * @param location - The location to generate
   */
  private static generateFactionBase(location: Location): void {
    // Fill with walls
    this.fillWithWalls(location);

    // Create outer perimeter
    const perimeterRoom: Room = {
      x: 2,
      y: 2,
      width: location.width - 4,
      height: location.height - 4,
    };
    this.carveRoom(location, perimeterRoom);

    // Generate organized rooms inside
    const rooms = this.generateOrganizedRooms(location);

    // Build walls for internal rooms
    for (const room of rooms) {
      this.carveBuilding(location, room);
    }

    // Add doors
    this.addDoors(location, rooms, 0.9);

    // Add entrance
    const entranceX = Math.floor(location.width / 2);
    const entranceY = 2;
    location.setTileType(entranceX, entranceY, TileType.DOOR_OPEN);
  }

  /**
   * Generate wilderness with natural features
   * @param location - The location to generate
   */
  private static generateWilderness(location: Location): void {
    // Fill with floor
    this.fillWithFloor(location);

    // Add lots of vegetation
    this.addVegetation(location, 0.5);

    // Add water features
    this.addRandomWater(location, 0.2);

    // Add some rocky areas (walls)
    this.addRandomWalls(location, 0.1);
  }

  /**
   * Generate cave with organic tunnels
   * @param location - The location to generate
   */
  private static generateCave(location: Location): void {
    // Fill with walls
    this.fillWithWalls(location);

    // Use cellular automata for cave generation
    this.generateCellularCave(location, 0.45, 4);

    // Ensure connectivity
    this.ensureConnectivity(location);

    // Add some water pools
    this.addRandomWater(location, 0.05);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Fill entire location with walls
   */
  private static fillWithWalls(location: Location): void {
    for (let x = 0; x < location.width; x++) {
      for (let y = 0; y < location.height; y++) {
        location.setTileType(x, y, TileType.WALL);
      }
    }
  }

  /**
   * Fill entire location with floor
   */
  private static fillWithFloor(location: Location): void {
    for (let x = 0; x < location.width; x++) {
      for (let y = 0; y < location.height; y++) {
        location.setTileType(x, y, TileType.FLOOR);
      }
    }
  }

  /**
   * Generate random rooms
   */
  private static generateRooms(
    location: Location,
    minRooms: number,
    maxRooms: number,
    minWidth: number,
    maxWidth: number,
    minHeight: number,
    maxHeight: number
  ): Room[] {
    const rooms: Room[] = [];
    const numRooms = Math.floor(
      Math.random() * (maxRooms - minRooms + 1) + minRooms
    );

    for (let i = 0; i < numRooms; i++) {
      const width = Math.floor(
        Math.random() * (maxWidth - minWidth + 1) + minWidth
      );
      const height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );
      const x = Math.floor(Math.random() * (location.width - width - 2)) + 1;
      const y = Math.floor(Math.random() * (location.height - height - 2)) + 1;

      const newRoom: Room = { x, y, width, height };

      // Check for overlap
      let overlap = false;
      for (const room of rooms) {
        if (this.roomsOverlap(newRoom, room)) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        rooms.push(newRoom);
      }
    }

    return rooms;
  }

  /**
   * Generate organized rooms (grid layout)
   */
  private static generateOrganizedRooms(location: Location): Room[] {
    const rooms: Room[] = [];
    const roomsPerSide = 3;
    const spacing = 2;

    const availableWidth = location.width - 6;
    const availableHeight = location.height - 6;

    const roomWidth = Math.floor(
      (availableWidth - spacing * (roomsPerSide - 1)) / roomsPerSide
    );
    const roomHeight = Math.floor(
      (availableHeight - spacing * (roomsPerSide - 1)) / roomsPerSide
    );

    for (let i = 0; i < roomsPerSide; i++) {
      for (let j = 0; j < roomsPerSide; j++) {
        // Skip center room (courtyard)
        if (i === 1 && j === 1) continue;

        const x = 4 + i * (roomWidth + spacing);
        const y = 4 + j * (roomHeight + spacing);

        rooms.push({ x, y, width: roomWidth, height: roomHeight });
      }
    }

    return rooms;
  }

  /**
   * Check if two rooms overlap
   */
  private static roomsOverlap(room1: Room, room2: Room): boolean {
    return (
      room1.x < room2.x + room2.width + 1 &&
      room1.x + room1.width + 1 > room2.x &&
      room1.y < room2.y + room2.height + 1 &&
      room1.y + room1.height + 1 > room2.y
    );
  }

  /**
   * Carve out a room
   */
  private static carveRoom(location: Location, room: Room): void {
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        location.setTileType(x, y, TileType.FLOOR);
      }
    }
  }

  /**
   * Carve out a building (room with walls)
   */
  private static carveBuilding(location: Location, building: Room): void {
    // Build walls
    for (let x = building.x; x < building.x + building.width; x++) {
      location.setTileType(x, building.y, TileType.WALL);
      location.setTileType(x, building.y + building.height - 1, TileType.WALL);
    }
    for (let y = building.y; y < building.y + building.height; y++) {
      location.setTileType(building.x, y, TileType.WALL);
      location.setTileType(building.x + building.width - 1, y, TileType.WALL);
    }

    // Fill interior with floor
    for (let x = building.x + 1; x < building.x + building.width - 1; x++) {
      for (let y = building.y + 1; y < building.y + building.height - 1; y++) {
        location.setTileType(x, y, TileType.FLOOR);
      }
    }
  }

  /**
   * Carve out a ruined room (some walls missing)
   */
  private static carveRuinedRoom(location: Location, room: Room): void {
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        // Randomly keep some walls
        if (
          (x === room.x ||
            x === room.x + room.width - 1 ||
            y === room.y ||
            y === room.y + room.height - 1) &&
          Math.random() > 0.4
        ) {
          location.setTileType(x, y, TileType.WALL);
        } else {
          location.setTileType(x, y, TileType.FLOOR);
        }
      }
    }
  }

  /**
   * Connect two rooms with a corridor
   */
  private static connectRooms(
    location: Location,
    room1: Room,
    room2: Room
  ): void {
    const x1 = Math.floor(room1.x + room1.width / 2);
    const y1 = Math.floor(room1.y + room1.height / 2);
    const x2 = Math.floor(room2.x + room2.width / 2);
    const y2 = Math.floor(room2.y + room2.height / 2);

    // Horizontal then vertical corridor
    if (Math.random() < 0.5) {
      this.carveHorizontalCorridor(location, x1, x2, y1);
      this.carveVerticalCorridor(location, y1, y2, x2);
    } else {
      this.carveVerticalCorridor(location, y1, y2, x1);
      this.carveHorizontalCorridor(location, x1, x2, y2);
    }
  }

  /**
   * Carve horizontal corridor
   */
  private static carveHorizontalCorridor(
    location: Location,
    x1: number,
    x2: number,
    y: number
  ): void {
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    for (let x = startX; x <= endX; x++) {
      location.setTileType(x, y, TileType.FLOOR);
    }
  }

  /**
   * Carve vertical corridor
   */
  private static carveVerticalCorridor(
    location: Location,
    y1: number,
    y2: number,
    x: number
  ): void {
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    for (let y = startY; y <= endY; y++) {
      location.setTileType(x, y, TileType.FLOOR);
    }
  }

  /**
   * Add doors to rooms
   */
  private static addDoors(
    location: Location,
    rooms: Room[],
    probability: number
  ): void {
    for (const room of rooms) {
      if (Math.random() < probability) {
        // Add door on one of the walls
        const side = Math.floor(Math.random() * 4);
        let x: number, y: number;

        switch (side) {
          case 0: // Top
            x = Math.floor(room.x + Math.random() * (room.width - 2) + 1);
            y = room.y;
            break;
          case 1: // Right
            x = room.x + room.width - 1;
            y = Math.floor(room.y + Math.random() * (room.height - 2) + 1);
            break;
          case 2: // Bottom
            x = Math.floor(room.x + Math.random() * (room.width - 2) + 1);
            y = room.y + room.height - 1;
            break;
          default: // Left
            x = room.x;
            y = Math.floor(room.y + Math.random() * (room.height - 2) + 1);
            break;
        }

        // Check if adjacent to floor
        const adjacentFloor =
          location.getTileType(x - 1, y) === TileType.FLOOR ||
          location.getTileType(x + 1, y) === TileType.FLOOR ||
          location.getTileType(x, y - 1) === TileType.FLOOR ||
          location.getTileType(x, y + 1) === TileType.FLOOR;

        if (adjacentFloor) {
          const doorType =
            Math.random() < 0.7 ? TileType.DOOR_OPEN : TileType.DOOR_CLOSED;
          location.setTileType(x, y, doorType);
        }
      }
    }
  }

  /**
   * Add vegetation tiles
   */
  private static addVegetation(location: Location, density: number): void {
    for (let x = 0; x < location.width; x++) {
      for (let y = 0; y < location.height; y++) {
        if (
          location.getTileType(x, y) === TileType.FLOOR &&
          Math.random() < density
        ) {
          location.setTileType(x, y, TileType.GRASS);
        }
      }
    }
  }

  /**
   * Add random water tiles
   */
  private static addRandomWater(location: Location, density: number): void {
    for (let x = 1; x < location.width - 1; x++) {
      for (let y = 1; y < location.height - 1; y++) {
        if (
          location.getTileType(x, y) === TileType.FLOOR &&
          Math.random() < density
        ) {
          location.setTileType(x, y, TileType.WATER);
        }
      }
    }
  }

  /**
   * Add random wall tiles (rocky areas)
   */
  private static addRandomWalls(location: Location, density: number): void {
    for (let x = 1; x < location.width - 1; x++) {
      for (let y = 1; y < location.height - 1; y++) {
        if (
          location.getTileType(x, y) === TileType.FLOOR &&
          Math.random() < density
        ) {
          location.setTileType(x, y, TileType.WALL);
        }
      }
    }
  }

  /**
   * Generate cave using cellular automata
   */
  private static generateCellularCave(
    location: Location,
    initialDensity: number,
    iterations: number
  ): void {
    // Initialize with random walls
    const grid: boolean[][] = [];
    for (let x = 0; x < location.width; x++) {
      grid[x] = [];
      for (let y = 0; y < location.height; y++) {
        grid[x][y] = Math.random() < initialDensity;
      }
    }

    // Run cellular automata
    for (let iter = 0; iter < iterations; iter++) {
      const newGrid: boolean[][] = [];
      for (let x = 0; x < location.width; x++) {
        newGrid[x] = [];
        for (let y = 0; y < location.height; y++) {
          const neighbors = this.countNeighborWalls(grid, x, y);
          newGrid[x][y] = neighbors >= 5 || neighbors === 0;
        }
      }
      grid.splice(0, grid.length, ...newGrid);
    }

    // Apply to location
    for (let x = 0; x < location.width; x++) {
      for (let y = 0; y < location.height; y++) {
        location.setTileType(x, y, grid[x][y] ? TileType.WALL : TileType.FLOOR);
      }
    }
  }

  /**
   * Count neighboring walls for cellular automata
   */
  private static countNeighborWalls(
    grid: boolean[][],
    x: number,
    y: number
  ): number {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= grid.length || ny < 0 || ny >= grid[0].length) {
          count++; // Treat out of bounds as walls
        } else if (grid[nx][ny]) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Ensure all floor tiles are connected (basic flood fill)
   */
  private static ensureConnectivity(location: Location): void {
    // Find first floor tile
    let startX = -1,
      startY = -1;
    for (let x = 0; x < location.width && startX === -1; x++) {
      for (let y = 0; y < location.height; y++) {
        if (location.getTileType(x, y) === TileType.FLOOR) {
          startX = x;
          startY = y;
          break;
        }
      }
    }

    if (startX === -1) return; // No floor tiles

    // Flood fill to find connected region
    const visited = new Set<string>();
    const queue: Array<[number, number]> = [[startX, startY]];
    visited.add(`${startX},${startY}`);

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;

      for (const [dx, dy] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;

        if (
          nx >= 0 &&
          nx < location.width &&
          ny >= 0 &&
          ny < location.height &&
          !visited.has(key) &&
          location.getTileType(nx, ny) === TileType.FLOOR
        ) {
          visited.add(key);
          queue.push([nx, ny]);
        }
      }
    }

    // Fill unconnected areas with walls
    for (let x = 0; x < location.width; x++) {
      for (let y = 0; y < location.height; y++) {
        if (
          location.getTileType(x, y) === TileType.FLOOR &&
          !visited.has(`${x},${y}`)
        ) {
          location.setTileType(x, y, TileType.WALL);
        }
      }
    }
  }
}
