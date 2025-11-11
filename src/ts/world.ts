/*
 * File: world.ts
 * Project: littlejs-rl
 * File Created: Tuesday, 11th November 2025 3:49:50 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 11th November 2025 11:00:00 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import Location from './location';

export default class World {
  readonly width: number;
  readonly height: number;
  readonly locationWidth: number;
  readonly locationHeight: number;

  private readonly locations: Map<string, Location>;
  private currentLocation: Location | null;

  constructor(
    width: number = 10,
    height: number = 10,
    locationWidth: number = 50,
    locationHeight: number = 50
  ) {
    this.width = width;
    this.height = height;
    this.locationWidth = locationWidth;
    this.locationHeight = locationHeight;
    this.locations = new Map();
    this.currentLocation = null;
  }

  private getKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  // Check if world coordinates are valid
  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  // Create or get location at world position
  getOrCreateLocation(worldX: number, worldY: number): Location {
    if (!this.isInBounds(worldX, worldY)) {
      throw new Error(`World position out of bounds: ${worldX}, ${worldY}`);
    }

    const key = this.getKey(worldX, worldY);
    let location = this.locations.get(key);

    if (!location) {
      location = new Location(
        LJS.vec2(worldX, worldY),
        this.locationWidth,
        this.locationHeight,
        `Location_${worldX}_${worldY}`
      );
      location.generate();
      this.locations.set(key, location);
    }

    return location;
  }

  // Get existing location
  getLocation(worldX: number, worldY: number): Location | undefined {
    return this.locations.get(this.getKey(worldX, worldY));
  }

  // Set current active location
  setCurrentLocation(worldX: number, worldY: number): void {
    this.currentLocation = this.getOrCreateLocation(worldX, worldY);
  }

  // Get current location
  getCurrentLocation(): Location | null {
    return this.currentLocation;
  }

  // Get all loaded locations
  getLoadedLocations(): Location[] {
    return Array.from(this.locations.values());
  }

  // Unload location to save memory
  unloadLocation(worldX: number, worldY: number): void {
    const key = this.getKey(worldX, worldY);
    const location = this.locations.get(key);

    // Don't unload the current location
    if (location === this.currentLocation) {
      return;
    }

    this.locations.delete(key);
  }

  // Unload all locations except current
  unloadAllExceptCurrent(): void {
    if (!this.currentLocation) return;

    const currentKey = this.getKey(
      this.currentLocation.worldPosition.x,
      this.currentLocation.worldPosition.y
    );

    const keysToDelete: string[] = [];
    for (const key of this.locations.keys()) {
      if (key !== currentKey) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.locations.delete(key);
    }
  }

  // Render current location
  render(): void {
    if (this.currentLocation) {
      this.currentLocation.render();
    }
  }

  // Get number of loaded locations
  getLoadedLocationCount(): number {
    return this.locations.size;
  }
}
