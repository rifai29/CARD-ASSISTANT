/**
 * Type declarations for the Card Game Suite
 */

export enum CardSuit {
  HEARTS = "HEARTS",
  DIAMONDS = "DIAMONDS",
  CLUBS = "CLUBS",
  SPADES = "SPADES",
}

export interface BJCard {
  id: string;
  suit: CardSuit;
  rank: string;
  value: number;
  isRevealed: boolean;
}

export type BJGameStatus = 
  | "BETTING" 
  | "DEAL" 
  | "PLAYER_TURN" 
  | "DEALER_TURN" 
  | "RESOLUTION";

export type HandOutcome = 
  | "PLAYING"
  | "BLACKJACK"
  | "BUST"
  | "STAND"
  | "WON"
  | "LOST"
  | "PUSH"
  | "DOUBLE_DOWN";

export interface BJGameState {
  deck: BJCard[];
  playerHand: BJCard[];
  dealerHand: BJCard[];
  bet: number;
  balance: number;
  status: BJGameStatus;
  playerOutcome: HandOutcome;
  dealerOutcome: HandOutcome;
  message: string;
}

export enum DungeonCardType {
  MONSTER = "MONSTER",
  WEAPON = "WEAPON",
  SHIELD = "SHIELD",
  POTION = "POTION",
  GOLD = "GOLD",
  DUNGEON_KEY = "DUNGEON_KEY"
}

export interface DungeonCard {
  id: string;
  type: DungeonCardType;
  title: string;
  value: number;          // HP/damage for Monster, Attack power for Weapon, Block for Shield, Healing for Potion, Amount for Gold
  maxValue?: number;       // For displays (e.g., initial monster health)
  flavor: string;          // Cute or epic lore snippet
  isScavenged: boolean;   // Visually marks if it's already spent/fading
  animKey?: number;       // Trigger animations
}

export interface DungeonPlayer {
  hp: number;
  maxHp: number;
  weaponPower: number;
  weaponDurability: number; // Num. usages remaining
  shieldBlock: number;
  gold: number;
  monstersDefeated: number;
  score: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface DungeonState {
  player: DungeonPlayer;
  grid: (DungeonCard | null)[]; // exactly 9 elements (3x3 grid)
  deck: DungeonCard[];
  turns: number;
  isGameOver: boolean;
  isVictory: boolean;
  historyLogs: string[];
}
