/*
 * File: faction.ts
 * Project: littlejs-rl
 * File Created: Thursday, 21st November 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 21st November 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Faction component - Represents allegiance to a group
 */
export interface FactionComponent {
  /** Primary faction ID */
  factionId: string;
  /** Reputation level within faction (0-100) */
  reputation: number;
  /** Rank within faction (0 = outsider, higher = more influence) */
  rank: number;
  /** Is entity a leader/important member? */
  isLeader?: boolean;
}

/**
 * Faction data structure
 */
export interface Faction {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description?: string;
  /** Allied faction IDs */
  allies: string[];
  /** Enemy faction IDs */
  enemies: string[];
  /** Neutral factions (not allied, not enemies) */
  neutral: string[];
  /** Starting reputation for new members */
  defaultReputation: number;
  /** Color for display */
  color: string;
  /** Leader entity IDs */
  leaders: number[];
}

/**
 * Faction registry singleton
 */
export class FactionRegistry {
  private static instance: FactionRegistry | null = null;
  private factions: Map<string, Faction>;

  private constructor() {
    this.factions = new Map();
    this.initializeDefaultFactions();
  }

  static getInstance(): FactionRegistry {
    FactionRegistry.instance ??= new FactionRegistry();
    return FactionRegistry.instance;
  }

  /**
   * Initialize default factions
   */
  private initializeDefaultFactions(): void {
    // Player faction
    this.registerFaction({
      id: 'player',
      name: 'Adventurers',
      description: 'Independent explorers and heroes.',
      allies: ['townsfolk', 'merchants'],
      enemies: ['bandits', 'undead', 'demons', 'corrupted'],
      neutral: ['wildlife', 'jungle_tribes'],
      defaultReputation: 50,
      color: 'blue',
      leaders: [],
    });

    // Friendly factions
    this.registerFaction({
      id: 'townsfolk',
      name: 'Townsfolk',
      description: 'Peaceful villagers and town citizens.',
      allies: ['player', 'merchants'],
      enemies: ['bandits', 'undead', 'demons'],
      neutral: ['wildlife'],
      defaultReputation: 60,
      color: 'green',
      leaders: [],
    });

    this.registerFaction({
      id: 'merchants',
      name: 'Merchant Guild',
      description: 'Traders and craftsmen.',
      allies: ['player', 'townsfolk'],
      enemies: ['bandits'],
      neutral: ['wildlife', 'jungle_tribes'],
      defaultReputation: 50,
      color: 'gold',
      leaders: [],
    });

    // Hostile factions
    this.registerFaction({
      id: 'bandits',
      name: 'Bandit Clans',
      description: 'Lawless raiders and thieves.',
      allies: [],
      enemies: ['player', 'townsfolk', 'merchants'],
      neutral: ['wildlife'],
      defaultReputation: -50,
      color: 'red',
      leaders: [],
    });

    this.registerFaction({
      id: 'undead',
      name: 'Undead Legion',
      description: 'Mindless servants of dark necromancy.',
      allies: ['demons', 'corrupted'],
      enemies: ['player', 'townsfolk', 'wildlife'],
      neutral: [],
      defaultReputation: -100,
      color: 'gray',
      leaders: [],
    });

    this.registerFaction({
      id: 'demons',
      name: 'Demon Horde',
      description: 'Fiendish entities from other realms.',
      allies: ['undead', 'corrupted'],
      enemies: ['player', 'townsfolk', 'wildlife'],
      neutral: [],
      defaultReputation: -100,
      color: 'purple',
      leaders: [],
    });

    this.registerFaction({
      id: 'corrupted',
      name: 'Corrupted',
      description: 'Beings twisted by dark magic.',
      allies: ['undead', 'demons'],
      enemies: ['player', 'townsfolk', 'wildlife'],
      neutral: [],
      defaultReputation: -100,
      color: 'violet',
      leaders: [],
    });

    // Neutral factions
    this.registerFaction({
      id: 'wildlife',
      name: 'Wildlife',
      description: 'Natural creatures of the world.',
      allies: [],
      enemies: ['undead', 'demons', 'corrupted'],
      neutral: ['player', 'townsfolk', 'bandits', 'jungle_tribes'],
      defaultReputation: 0,
      color: 'brown',
      leaders: [],
    });

    this.registerFaction({
      id: 'jungle_tribes',
      name: 'Jungle Tribes',
      description: 'Indigenous warriors of the deep jungle.',
      allies: [],
      enemies: ['corrupted'],
      neutral: ['player', 'townsfolk', 'wildlife', 'bandits'],
      defaultReputation: 0,
      color: 'lime',
      leaders: [],
    });

    this.registerFaction({
      id: 'frost_clans',
      name: 'Frost Clans',
      description: 'Nomadic hunters of the frozen north.',
      allies: [],
      enemies: ['corrupted', 'undead'],
      neutral: ['player', 'wildlife'],
      defaultReputation: 0,
      color: 'cyan',
      leaders: [],
    });

    this.registerFaction({
      id: 'desert_nomads',
      name: 'Desert Nomads',
      description: 'Wandering tribes of the arid wastes.',
      allies: [],
      enemies: ['bandits'],
      neutral: ['player', 'merchants', 'wildlife'],
      defaultReputation: 0,
      color: 'tan',
      leaders: [],
    });
  }

  /**
   * Register a new faction
   */
  registerFaction(faction: Faction): void {
    this.factions.set(faction.id, faction);
  }

  /**
   * Get faction by ID
   */
  getFaction(id: string): Faction | undefined {
    return this.factions.get(id);
  }

  /**
   * Get all factions
   */
  getAllFactions(): Faction[] {
    return Array.from(this.factions.values());
  }

  /**
   * Check if two factions are allied
   */
  areAllied(faction1Id: string, faction2Id: string): boolean {
    const faction1 = this.getFaction(faction1Id);
    return faction1 ? faction1.allies.includes(faction2Id) : false;
  }

  /**
   * Check if two factions are enemies
   */
  areEnemies(faction1Id: string, faction2Id: string): boolean {
    const faction1 = this.getFaction(faction1Id);
    return faction1 ? faction1.enemies.includes(faction2Id) : false;
  }

  /**
   * Get faction color
   */
  getFactionColor(id: string): string {
    const faction = this.getFaction(id);
    return faction ? faction.color : 'white';
  }
}
