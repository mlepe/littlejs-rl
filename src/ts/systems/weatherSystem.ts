/*
 * File: weatherSystem.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025 12:00:00 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025 12:00:00 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

import * as LJS from 'littlejsengine';

import ECS from '../ecs';
import Location from '../location';
import { WeatherComponent, WeatherEffect } from '../components/weather';
import { WeatherType, getBiomeConfig } from '../biomeConfig';
import { EnvironmentalComponent } from '../components/environmental';

/**
 * Weather System - Manages weather conditions and their effects
 *
 * Updates weather state, handles transitions, and applies effects to entities.
 * Should be called once per game update cycle.
 *
 * @param ecs - The ECS instance
 * @param location - Current location
 * @param deltaTime - Time elapsed since last update in seconds
 *
 * @example
 * ```typescript
 * function gameUpdate() {
 *   const location = world.getCurrentLocation();
 *   weatherSystem(ecs, location, LJS.timeDelta);
 * }
 * ```
 */
export function weatherSystem(
  ecs: ECS,
  location: Location,
  deltaTime: number
): void {
  // Get or create weather component for location
  // Note: Weather is stored per-location, not per-entity
  // We could store it in location.metadata or as a separate weather manager
  const locationEntities = ecs.query('weather');

  for (const entityId of locationEntities) {
    const weather = ecs.getComponent<WeatherComponent>(entityId, 'weather');
    if (!weather || weather.paused) continue;

    // Update weather state
    updateWeatherState(weather, deltaTime, location);

    // Apply weather effects to all entities in location
    applyWeatherEffects(ecs, weather, location);
  }
}

/**
 * Update weather state (duration, transitions)
 * @private
 */
function updateWeatherState(
  weather: WeatherComponent,
  deltaTime: number,
  location: Location
): void {
  // Update time remaining
  if (weather.duration > 0) {
    weather.timeRemaining -= deltaTime;

    if (weather.timeRemaining <= 0) {
      // Weather duration expired, transition to next
      if (weather.transitionTo) {
        startWeatherTransition(weather, weather.transitionTo);
      } else {
        // Pick random next weather based on biome
        const nextWeather = selectRandomWeather(location);
        startWeatherTransition(weather, nextWeather);
      }
    }
  }

  // Update transition progress
  if (weather.transitionProgress > 0 && weather.transitionProgress < 1.0) {
    const transitionSpeed = 0.1; // 10% per second = 10 second transition
    weather.transitionProgress += transitionSpeed * deltaTime;

    if (weather.transitionProgress >= 1.0) {
      // Transition complete
      completeWeatherTransition(weather);
    }

    // Update modifiers during transition
    updateWeatherModifiers(weather);
  }
}

/**
 * Start transitioning to new weather
 * @private
 */
function startWeatherTransition(
  weather: WeatherComponent,
  nextWeather: WeatherType
): void {
  weather.transitionTo = nextWeather;
  weather.transitionProgress = 0.01; // Start transition
}

/**
 * Complete weather transition
 * @private
 */
function completeWeatherTransition(weather: WeatherComponent): void {
  if (!weather.transitionTo) return;

  weather.current = weather.transitionTo;
  weather.transitionTo = null;
  weather.transitionProgress = 0;

  // Set new duration
  weather.duration = getWeatherDuration(weather.current);
  weather.timeRemaining = weather.duration;

  // Update modifiers
  updateWeatherModifiers(weather);
}

/**
 * Update weather modifiers based on current weather and transition
 * @private
 */
function updateWeatherModifiers(weather: WeatherComponent): void {
  const current = getWeatherModifiers(weather.current, weather.intensity);
  const target = weather.transitionTo
    ? getWeatherModifiers(weather.transitionTo, weather.intensity)
    : current;

  const blend = weather.transitionProgress;

  // Blend modifiers
  weather.visibilityModifier = LJS.lerp(
    blend,
    current.visibilityModifier,
    target.visibilityModifier
  );
  weather.temperatureModifier = LJS.lerp(
    blend,
    current.temperatureModifier,
    target.temperatureModifier
  );
  weather.movementModifier = LJS.lerp(
    blend,
    current.movementModifier,
    target.movementModifier
  );

  // Combine effects (during transition, both sets can be active)
  weather.effects = [...current.effects];
  if (weather.transitionTo && blend > 0.5) {
    weather.effects.push(...target.effects);
  }
}

/**
 * Get weather modifiers for a specific weather type
 * @private
 */
function getWeatherModifiers(
  weatherType: WeatherType,
  intensity: number
): {
  visibilityModifier: number;
  temperatureModifier: number;
  movementModifier: number;
  effects: WeatherEffect[];
} {
  const baseIntensity = LJS.clamp(intensity, 0, 1);

  switch (weatherType) {
    case WeatherType.CLEAR:
      return {
        visibilityModifier: 1.0,
        temperatureModifier: 0,
        movementModifier: 1.0,
        effects: [],
      };

    case WeatherType.CLOUDY:
      return {
        visibilityModifier: 0.9,
        temperatureModifier: -2 * baseIntensity,
        movementModifier: 1.0,
        effects: [],
      };

    case WeatherType.RAIN:
      return {
        visibilityModifier: 0.7 - baseIntensity * 0.2,
        temperatureModifier: -5 * baseIntensity,
        movementModifier: 0.9 - baseIntensity * 0.1,
        effects: [WeatherEffect.WET, WeatherEffect.SLOWED],
      };

    case WeatherType.HEAVY_RAIN:
      return {
        visibilityModifier: 0.4,
        temperatureModifier: -8,
        movementModifier: 0.7,
        effects: [
          WeatherEffect.WET,
          WeatherEffect.SLOWED,
          WeatherEffect.BLINDED,
        ],
      };

    case WeatherType.SNOW:
      return {
        visibilityModifier: 0.6 - baseIntensity * 0.2,
        temperatureModifier: -10 * baseIntensity,
        movementModifier: 0.8 - baseIntensity * 0.1,
        effects: [WeatherEffect.FROZEN, WeatherEffect.SLOWED],
      };

    case WeatherType.BLIZZARD:
      return {
        visibilityModifier: 0.3,
        temperatureModifier: -15,
        movementModifier: 0.5,
        effects: [
          WeatherEffect.FROZEN,
          WeatherEffect.SLOWED,
          WeatherEffect.BLINDED,
          WeatherEffect.BUFFETED,
        ],
      };

    case WeatherType.FOG:
      return {
        visibilityModifier: 0.3 - baseIntensity * 0.1,
        temperatureModifier: -3 * baseIntensity,
        movementModifier: 1.0,
        effects: [WeatherEffect.BLINDED],
      };

    case WeatherType.STORM:
      return {
        visibilityModifier: 0.5,
        temperatureModifier: -5,
        movementModifier: 0.8,
        effects: [
          WeatherEffect.WET,
          WeatherEffect.BUFFETED,
          WeatherEffect.SLOWED,
        ],
      };

    case WeatherType.SANDSTORM:
      return {
        visibilityModifier: 0.2,
        temperatureModifier: 10,
        movementModifier: 0.6,
        effects: [
          WeatherEffect.BLINDED,
          WeatherEffect.BUFFETED,
          WeatherEffect.SLOWED,
        ],
      };

    case WeatherType.HEATWAVE:
      return {
        visibilityModifier: 0.8,
        temperatureModifier: 15,
        movementModifier: 0.9,
        effects: [WeatherEffect.BURNING],
      };

    case WeatherType.ASH_FALL:
      return {
        visibilityModifier: 0.4,
        temperatureModifier: 5,
        movementModifier: 0.85,
        effects: [WeatherEffect.BLINDED, WeatherEffect.SLOWED],
      };

    case WeatherType.TOXIC_RAIN:
      return {
        visibilityModifier: 0.6,
        temperatureModifier: 0,
        movementModifier: 0.9,
        effects: [WeatherEffect.WET, WeatherEffect.BURNING], // Burning = acid damage
      };

    default:
      return {
        visibilityModifier: 1.0,
        temperatureModifier: 0,
        movementModifier: 1.0,
        effects: [],
      };
  }
}

/**
 * Apply weather effects to all entities in location
 * @private
 */
function applyWeatherEffects(
  ecs: ECS,
  weather: WeatherComponent,
  location: Location
): void {
  // Get all entities with environmental component in current location
  const entities = ecs.query('position', 'environmental', 'location');

  for (const entityId of entities) {
    const env = ecs.getComponent<EnvironmentalComponent>(
      entityId,
      'environmental'
    );
    if (!env) continue;

    // Apply visibility modifier
    env.visibilityModifier *= weather.visibilityModifier;

    // Apply temperature modifier
    // (This affects elemental resistances via environmentalSystem)

    // Apply movement modifier
    // (Handled by movement systems checking weather component)

    // Note: Status effects (burning, frozen, etc.) would be applied
    // by a separate status effect system
  }
}

/**
 * Select random weather based on biome
 * @private
 */
function selectRandomWeather(location: Location): WeatherType {
  const biomeConfig = getBiomeConfig(location.metadata.biome);
  const commonWeather = biomeConfig.weather.common;
  const rareWeather = biomeConfig.weather.rare;

  // 80% chance of common weather, 20% chance of rare
  const useRare = Math.random() < 0.2 && rareWeather.length > 0;
  const weatherList = useRare ? rareWeather : commonWeather;

  if (weatherList.length === 0) return WeatherType.CLEAR;

  const index = Math.floor(Math.random() * weatherList.length);
  return weatherList[index];
}

/**
 * Get duration for weather type in seconds
 * @private
 */
function getWeatherDuration(weatherType: WeatherType): number {
  switch (weatherType) {
    case WeatherType.CLEAR:
      return 300; // 5 minutes
    case WeatherType.CLOUDY:
      return 240; // 4 minutes
    case WeatherType.RAIN:
      return 180; // 3 minutes
    case WeatherType.HEAVY_RAIN:
      return 120; // 2 minutes
    case WeatherType.SNOW:
      return 200; // 3.3 minutes
    case WeatherType.BLIZZARD:
      return 90; // 1.5 minutes
    case WeatherType.FOG:
      return 300; // 5 minutes
    case WeatherType.STORM:
      return 150; // 2.5 minutes
    case WeatherType.SANDSTORM:
      return 120; // 2 minutes
    case WeatherType.HEATWAVE:
      return 600; // 10 minutes
    case WeatherType.ASH_FALL:
      return 180; // 3 minutes
    case WeatherType.TOXIC_RAIN:
      return 90; // 1.5 minutes
    default:
      return 300; // Default 5 minutes
  }
}

/**
 * Initialize weather for a location
 *
 * @param ecs - The ECS instance
 * @param locationEntityId - Entity ID representing the location
 * @param location - The location object
 * @param initialWeather - Optional initial weather (default: biome-appropriate)
 * @param initialIntensity - Optional initial intensity (default: 0.5)
 *
 * @example
 * ```typescript
 * const locationId = ecs.createEntity();
 * initializeWeather(ecs, locationId, location, WeatherType.RAIN, 0.7);
 * ```
 */
export function initializeWeather(
  ecs: ECS,
  locationEntityId: number,
  location: Location,
  initialWeather?: WeatherType,
  initialIntensity: number = 0.5
): void {
  const weather = initialWeather || selectRandomWeather(location);
  const modifiers = getWeatherModifiers(weather, initialIntensity);

  ecs.addComponent<WeatherComponent>(locationEntityId, 'weather', {
    current: weather,
    intensity: initialIntensity,
    duration: getWeatherDuration(weather),
    timeRemaining: getWeatherDuration(weather),
    transitionTo: null,
    transitionProgress: 0,
    paused: false,
    visibilityModifier: modifiers.visibilityModifier,
    temperatureModifier: modifiers.temperatureModifier,
    movementModifier: modifiers.movementModifier,
    effects: modifiers.effects,
  });
}

/**
 * Get current weather for a location
 *
 * @param ecs - The ECS instance
 * @param locationEntityId - Entity ID representing the location
 * @returns Weather component or undefined
 */
export function getLocationWeather(
  ecs: ECS,
  locationEntityId: number
): WeatherComponent | undefined {
  return ecs.getComponent<WeatherComponent>(locationEntityId, 'weather');
}

/**
 * Force weather change
 *
 * @param weather - Weather component to modify
 * @param newWeather - New weather type
 * @param intensity - New intensity (default: current intensity)
 * @param immediate - Skip transition if true (default: false)
 */
export function setWeather(
  weather: WeatherComponent,
  newWeather: WeatherType,
  intensity?: number,
  immediate: boolean = false
): void {
  if (immediate) {
    weather.current = newWeather;
    weather.transitionTo = null;
    weather.transitionProgress = 0;
    weather.duration = getWeatherDuration(newWeather);
    weather.timeRemaining = weather.duration;

    if (intensity !== undefined) {
      weather.intensity = LJS.clamp(intensity, 0, 1);
    }

    updateWeatherModifiers(weather);
  } else {
    startWeatherTransition(weather, newWeather);
    if (intensity !== undefined) {
      weather.intensity = LJS.clamp(intensity, 0, 1);
    }
  }
}
