/*
 * File: littlejsengine.d.ts
 * Project: littlejs-rl
 * File Created: Friday, 10th January 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Friday, 10th January 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

// Type declaration for the LittleJS mock

declare module 'littlejsengine' {
  export const mockTime: { time: number; timeDelta: number };
  export class Vector2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    add(v: Vector2): Vector2;
    subtract(v: Vector2): Vector2;
    length(): number;
    distance(v: Vector2): number;
    scale(s: number): Vector2;
  }
  export function vec2(x?: number, y?: number): Vector2;
  export class Color {
    constructor(r?: number, g?: number, b?: number, a?: number);
    r: number;
    g: number;
    b: number;
    a: number;
  }
  export class TileInfo {
    constructor(pos?: Vector2, size?: Vector2);
    pos: Vector2;
    size: Vector2;
  }
  export class EngineObject {
    constructor(pos?: Vector2, size?: Vector2);
    pos: Vector2;
    size: Vector2;
    angle: number;
    update(): void;
    render(): void;
    destroy(): void;
  }
  export class TileLayer {
    constructor(
      pos?: Vector2,
      size?: Vector2,
      tileInfo?: TileInfo,
      scale?: Vector2,
      renderOrder?: number
    );
    pos: Vector2;
    size: Vector2;
    setData(x: number, y: number, data: any): void;
    getData(x: number, y: number): any;
    update(): void;
    render(): void;
  }
  export class Timer {
    constructor(duration?: number);
    time: number;
    duration: number;
    elapsed(): boolean;
    set(time?: number): Timer;
  }
  export function rand(min?: number, max?: number): number;
  export function randInt(min: number, max: number): number;
  export function clamp(value: number, min: number, max: number): number;
  export function lerp(a: number, b: number, t: number): number;
  export function keyIsDown(key: string): boolean;
  export function keyWasPressed(key: string): boolean;
  export function mouseIsDown(button: number): boolean;
  export const mousePos: Vector2;
  export const time: number;
  export const timeDelta: number;
  export function drawTile(...args: any[]): void;
  export function drawRect(...args: any[]): void;
  export function drawLine(...args: any[]): void;
  export function drawText(...args: any[]): void;
  export function engineInit(...args: any[]): void;
  export function tileCollisionTest(...args: any[]): boolean;
  export function isOverlapping(...args: any[]): boolean;
}
