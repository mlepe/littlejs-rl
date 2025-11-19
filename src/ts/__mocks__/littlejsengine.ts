/**
 * Mock implementation of LittleJS for unit testing
 * Only includes the parts actually used in tests
 */

// Mock Vector2 class
export class Vector2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distance(v: Vector2): number {
    return this.subtract(v).length();
  }

  scale(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }
}

// Mock vec2 helper function
export function vec2(x: number = 0, y: number = 0): Vector2 {
  return new Vector2(x, y);
}

// Mock Color class
export class Color {
  constructor(
    public r: number = 1,
    public g: number = 1,
    public b: number = 1,
    public a: number = 1
  ) {}
}

// Mock TileInfo class
export class TileInfo {
  constructor(
    public pos: Vector2 = vec2(0, 0),
    public size: Vector2 = vec2(16, 16)
  ) {}
}

// Mock EngineObject (minimal implementation)
export class EngineObject {
  pos: Vector2;
  size: Vector2;
  angle: number;

  constructor(pos: Vector2 = vec2(), size: Vector2 = vec2(1, 1)) {
    this.pos = pos;
    this.size = size;
    this.angle = 0;
  }

  update() {}
  render() {}
  destroy() {}
}

// Mock TileLayer class
export class TileLayer {
  pos: Vector2;
  size: Vector2;

  constructor(
    pos: Vector2 = vec2(),
    size: Vector2 = vec2(32, 32),
    tileInfo: TileInfo = new TileInfo(),
    scale: Vector2 = vec2(1, 1),
    renderOrder: number = 0
  ) {
    this.pos = pos;
    this.size = size;
  }

  setData(x: number, y: number, data: any) {}
  getData(x: number, y: number): any {
    return 0;
  }
  update() {}
  render() {}
}

// Mock utility functions
export function rand(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

export function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Mock input functions
export function keyIsDown(key: string): boolean {
  return false;
}

export function keyWasPressed(key: string): boolean {
  return false;
}

export function mouseIsDown(button: number): boolean {
  return false;
}

export const mousePos = vec2(0, 0);

// Mock time values - use a mutable object so tests can modify it
export const mockTime = { time: 0, timeDelta: 0 };

// Getters that reference the mock object
export const time = 0;
Object.defineProperty(exports, 'time', {
  get: () => mockTime.time,
  set: (value: number) => {
    mockTime.time = value;
  },
});

export const timeDelta = 0;
Object.defineProperty(exports, 'timeDelta', {
  get: () => mockTime.timeDelta,
  set: (value: number) => {
    mockTime.timeDelta = value;
  },
});

// Mock drawing functions (no-ops for testing)
export function drawTile(...args: any[]): void {}
export function drawRect(...args: any[]): void {}
export function drawLine(...args: any[]): void {}
export function drawText(...args: any[]): void {}

// Mock engine initialization (no-op for testing)
export function engineInit(...args: any[]): void {}

// Mock collision test
export function tileCollisionTest(...args: any[]): boolean {
  return false;
}

export function isOverlapping(...args: any[]): boolean {
  return false;
}

// Mock Timer class
export class Timer {
  time: number;
  constructor(public duration: number = 0) {
    this.time = 0;
  }

  elapsed(): boolean {
    return this.time >= this.duration;
  }

  set(time: number = 0): Timer {
    this.time = time;
    return this;
  }
}
