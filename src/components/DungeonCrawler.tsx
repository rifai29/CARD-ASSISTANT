import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Shield, 
  Sword, 
  Coins, 
  Award, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Terminal,
  Skull,
  Play,
  Flame,
  User,
  Compass,
  ChevronRight
} from "lucide-react";
import { DungeonCard, DungeonCardType, DungeonPlayer, DungeonState } from "../types";
import { soundEffects } from "../audio";

// Initializing beautiful Card template values
const MONSTERS = [
  { title: "Slime Lumpur", baseValue: 3, flavor: "Gumpalan jeli lengket yang ramah namun beracun." },
  { title: "Goblin Belantara", baseValue: 4, flavor: "Licik dan cepat, mengincar koin emas di saku penjelajah." },
  { title: "Prajurit Skeleton", baseValue: 6, flavor: "Kerangka mati yang berjalan membawa pedang karat lapuk." },
  { title: "Orc Penjarah", baseValue: 9, flavor: "Berotot kuat dengan amarah membara yang menghancurkan pertahanan." },
  { title: "Golem Kegelapan", baseValue: 12, flavor: "Manusia batu purba besar, kebal sebagian dari tebasan senjata biasa." },
  { title: "Naga Api Kuno", baseValue: 18, flavor: "Penguasa kedalaman dungeon yang melontarkan nafas bara api membakar." }
];

const WEAPONS = [
  { title: "Belati Karat", value: 3, flavor: "Senjata darurat, tajam secukupnya untuk bertahan." },
  { title: "Pedang Baja Besi", value: 6, flavor: "Senjata seimbang standar kesatria kerajaan." },
  { title: "Kapak Raksasa", value: 10, flavor: "Sangat berat dan destruktif, mampu menghancurkan golem batu." }
];

const SHIELDS = [
  { title: "Perisai Kayu", value: 3, durability: 2, flavor: "Ringan dan rapuh, terbuat dari papan kayu pinus tua." },
  { title: "Perisai Besi Kuat", value: 7, durability: 3, flavor: "Baja bundar dengan lambang perlindungan besi tempa." },
  { title: "Aegis Sanctum", value: 14, durability: 3, flavor: "Perisai pelindung magis suci yang memancarkan aura emas." }
];

const POTIONS = [
  { title: "Ramuan Merah", value: 5, flavor: "Cairan stroberi manis berkhasiat memulihkan stamina lesu." },
  { title: "Elixir Kehidupan", value: 12, flavor: "Sari bunga hutan kuno yang meregenerasi jaringan terluka." }
];

const GOLDS = [
  { title: "Kepingan Koin", value: 4, flavor: "Sisa peninggalan petualang malang terdahulu." },
  { title: "Peti Harta Karun", value: 15, flavor: "Peti kayu lapis besi berisi batangan koin berkilau." }
];

export default function DungeonCrawler() {
  const [player, setPlayer] = useState<DungeonPlayer>({
    hp: 30,
    maxHp: 30,
    weaponPower: 0,
    weaponDurability: 0,
    shieldBlock: 0,
    gold: 0,
    monstersDefeated: 0,
    score: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: 15
  });

  const [grid, setGrid] = useState<(DungeonCard | null)[]>(Array(9).fill(null));
  const [deck, setDeck] = useState<DungeonCard[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [historyLogs, setHistoryLogs] = useState<string[]>(["Pintu Dungeon terbuka. Masuki petualangan Anda!"]);
  
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.getMuteState());
  const [showHelper, setShowHelper] = useState<boolean>(false);

  // Sound triggers
  const toggleMute = () => {
    const nextMuted = soundEffects.toggleMute();
    setIsMuted(nextMuted);
    soundEffects.playClick();
  };

  // Generate a random card for the deck pool
  const generateRandomCard = (idStr: string, level: number): DungeonCard => {
    const roll = Math.random() * 100;
    
    if (roll < 45) { // 45% Monster
      const poolIdx = Math.min(
        Math.floor(Math.random() * Math.min(MONSTERS.length, level + 1)), 
        MONSTERS.length - 1
      );
      const template = MONSTERS[poolIdx];
      // Slightly scale monster health based on dungeon difficulty (level)
      const scaleValue = template.baseValue + Math.floor(Math.random() * (level));
      
      return {
        id: `card_monster_${idStr}_${Date.now()}_${Math.random()}`,
        type: DungeonCardType.MONSTER,
        title: template.title,
        value: scaleValue,
        maxValue: scaleValue,
        flavor: template.flavor,
        isScavenged: false
      };
    } else if (roll < 62) { // 17% Weapon
      const poolIdx = Math.floor(Math.random() * WEAPONS.length);
      const template = WEAPONS[poolIdx];
      return {
        id: `card_weapon_${idStr}_${Date.now()}_${Math.random()}`,
        type: DungeonCardType.WEAPON,
        title: template.title,
        value: template.value,
        flavor: template.flavor,
        isScavenged: false
      };
    } else if (roll < 77) { // 15% Shield
      const poolIdx = Math.floor(Math.random() * SHIELDS.length);
      const template = SHIELDS[poolIdx];
      return {
        id: `card_shield_${idStr}_${Date.now()}_${Math.random()}`,
        type: DungeonCardType.SHIELD,
        title: template.title,
        value: template.value,
        maxValue: template.durability, // Storing shield durability in maxValue
        flavor: template.flavor,
        isScavenged: false
      };
    } else if (roll < 88) { // 11% Potion
      const poolIdx = Math.floor(Math.random() * POTIONS.length);
      const template = POTIONS[poolIdx];
      return {
        id: `card_potion_${idStr}_${Date.now()}_${Math.random()}`,
        type: DungeonCardType.POTION,
        title: template.title,
        value: template.value,
        flavor: template.flavor,
        isScavenged: false
      };
    } else { // 12% Gold
      const poolIdx = Math.floor(Math.random() * GOLDS.length);
      const template = GOLDS[poolIdx];
      return {
        id: `card_gold_${idStr}_${Date.now()}_${Math.random()}`,
        type: DungeonCardType.GOLD,
        title: template.title,
        value: template.value,
        flavor: template.flavor,
        isScavenged: false
      };
    }
  };

  // Start/Restart Dungeon game
  const handleStartGame = () => {
    soundEffects.playShuffle();
    
    // Create new player with base statistics
    const basePlayer: DungeonPlayer = {
      hp: 30,
      maxHp: 30,
      weaponPower: 0,
      weaponDurability: 0,
      shieldBlock: 0,
      gold: 0,
      monstersDefeated: 0,
      score: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: 15
    };
    
    // Create a 40 cards adventure deck
    const adventureDeck: DungeonCard[] = [];
    for (let i = 0; i < 40; i++) {
      adventureDeck.push(generateRandomCard(`dk_${i}`, 1));
    }

    // Populate initial 3x3 grid from deck
    const initialGrid: (DungeonCard | null)[] = [];
    for (let i = 0; i < 9; i++) {
      initialGrid.push(adventureDeck.pop() || null);
    }

    setPlayer(basePlayer);
    setGrid(initialGrid);
    setDeck(adventureDeck);
    setTurns(1);
    setIsGameOver(false);
    setIsVictory(false);
    setHistoryLogs([
      "Gerbang besi runtuh di belakang Anda! 🗡️ Anda terkunci di Dungeon.",
      "9 kartu pertemuan pertama telah disajikan di hadapan Anda."
    ]);
  };

  // Run initial start
  useEffect(() => {
    handleStartGame();
  }, []);

  const addLog = (log: string) => {
    setHistoryLogs(prev => [log, ...prev.slice(0, 50)]);
  };

  // Refill deck grid with remaining cards
  const handleRefillGrid = () => {
    if (isGameOver || isVictory) return;
    
    soundEffects.playShuffle();
    let cardsFilled = 0;
    const nextGrid = [...grid];
    const nextDeck = [...deck];

    for (let i = 0; i < 9; i++) {
      if (nextGrid[i] === null && nextDeck.length > 0) {
        nextGrid[i] = nextDeck.pop() || null;
        cardsFilled++;
      }
    }

    if (cardsFilled > 0) {
      setGrid(nextGrid);
      setDeck(nextDeck);
      setTurns(prev => prev + 1);
      addLog(`Langkah Refill #${turns}: Memasukkan ${cardsFilled} kartu baru ke arena dari sisa dek.`);
    } else {
      addLog("Gagal mengisi arena: Semua kartu telah berserakan di arena atau Dek Habis.");
    }

    // Check game completed if deck empty and grid has no monsters
    checkGameStatus(nextGrid, nextDeck, player.hp);
  };

  const checkGameStatus = (currentGrid: (DungeonCard | null)[], currentDeck: DungeonCard[], currentHp: number) => {
    if (currentHp <= 0) {
      setIsGameOver(true);
      soundEffects.playLose();
      addLog("💀 NYAWA ANDA HABIS! Kutukan gua menyerap jiwa kesatria Anda.");
      return;
    }

    // Check if total deck and remaining monster cards is zero
    const aliveMonsters = currentGrid.filter(c => c !== null && c.type === DungeonCardType.MONSTER).length;
    if (currentDeck.length === 0 && aliveMonsters === 0) {
      setIsVictory(true);
      soundEffects.playWin();
      addLog("🏆 KEMENANGAN MUTLAK! Anda berhasil menaklukkan seluruh tantangan dek dungeon!");
    }
  };

  // INTERACT WITH AREA CARD IN 3X3 GRID
  const handleCardInteraction = (idx: number) => {
    if (isGameOver || isVictory) return;
    const selectedCard = grid[idx];
    if (!selectedCard || selectedCard.isScavenged) return;

    // Trigger visual interaction
    const nextGrid = [...grid];
    const nextPlayer = { ...player };

    switch (selectedCard.type) {
      
      case DungeonCardType.GOLD:
        soundEffects.playGoldCoins();
        nextPlayer.gold += selectedCard.value;
        nextPlayer.score += selectedCard.value;
        nextPlayer.xp += 2; // minor reward XP

        addLog(`🪙 Mengambil ${selectedCard.title}: Koin bertambah +${selectedCard.value}g.`);
        
        // Remove card
        nextGrid[idx] = null;
        break;

      case DungeonCardType.POTION:
        soundEffects.playPotion();
        const healedAmount = Math.min(nextPlayer.maxHp - nextPlayer.hp, selectedCard.value);
        nextPlayer.hp = Math.min(nextPlayer.maxHp, nextPlayer.hp + selectedCard.value);
        nextPlayer.xp += 1;

        addLog(`🧪 Meminum ${selectedCard.title}: Memulihkan kesehatan sebesar +${healedAmount} HP.`);
        
        nextGrid[idx] = null;
        break;

      case DungeonCardType.WEAPON:
        soundEffects.playSlash();
        nextPlayer.weaponPower = selectedCard.value;
        nextPlayer.weaponDurability = 3; // Reset durability uses

        addLog(`⚔️ Membawa ${selectedCard.title}: Serangan Anda ditingkatkan menjadi ${selectedCard.value} (3 Kali Penggunaan).`);
        
        nextGrid[idx] = null;
        break;

      case DungeonCardType.SHIELD:
        soundEffects.playShieldBlock();
        // Shield max block sets durability too
        nextPlayer.shieldBlock = selectedCard.value;

        addLog(`🛡️ Memasang ${selectedCard.title}: Membawa blok penangkis bahaya sebesar +${selectedCard.value} poin.`);
        
        nextGrid[idx] = null;
        break;

      case DungeonCardType.MONSTER:
        // FIGHT MECHANIC
        // Player attacks first using weapon if available
        let monsterHp = selectedCard.value;
        let pWeaponPowerUsed = 0;
        let wasWeaponDestroyed = false;

        if (nextPlayer.weaponPower > 0 && nextPlayer.weaponDurability > 0) {
          pWeaponPowerUsed = nextPlayer.weaponPower;
          monsterHp -= pWeaponPowerUsed;
          nextPlayer.weaponDurability -= 1;
          soundEffects.playSlash();

          if (nextPlayer.weaponDurability <= 0) {
            nextPlayer.weaponPower = 0;
            wasWeaponDestroyed = true;
          }
        }

        // Output action text
        let combatLog = `💥 Menghantam ${selectedCard.title} [HP: ${selectedCard.value}]`;
        if (pWeaponPowerUsed > 0) {
          combatLog += `, menyayatnya setajam -${pWeaponPowerUsed} HP dengan pedang`;
          if (wasWeaponDestroyed) combatLog += " (Pedang Anda patah runtuh!)";
        }

        if (monsterHp > 0) {
          // Monster strikes back with remaining HP/power!
          let incomingDmg = monsterHp;
          let blockedDmg = 0;

          if (nextPlayer.shieldBlock > 0) {
            blockedDmg = Math.min(nextPlayer.shieldBlock, incomingDmg);
            nextPlayer.shieldBlock -= blockedDmg;
            incomingDmg -= blockedDmg;
            soundEffects.playShieldBlock();
          }

          if (blockedDmg > 0) {
            combatLog += `. Perisai menahan -${blockedDmg} kerusakan`;
          }

          if (incomingDmg > 0) {
            nextPlayer.hp -= incomingDmg;
            combatLog += `. Anda terkena gigitan luka sisa sebesar -${incomingDmg} HP!`;
          } else {
            combatLog += `. Kerusakan terblokir mutlak!`;
          }

          // Monster survives but is weakened
          if (nextPlayer.hp > 0) {
            nextGrid[idx] = {
              ...selectedCard,
              value: monsterHp,
              animKey: (selectedCard.animKey || 0) + 1
            };
          }
        } else {
          // Monster defeated!
          soundEffects.playGoldCoins();
          nextPlayer.monstersDefeated += 1;
          const xpGained = selectedCard.maxValue || selectedCard.value;
          nextPlayer.xp += xpGained;
          nextPlayer.score += xpGained * 2;
          
          combatLog += `. Anda membantainya berkeping-keping! Menyerap +${xpGained} XP.`;
          nextGrid[idx] = null;
        }

        addLog(combatLog);
        break;
    }

    // CHECK LEVEL UP
    if (nextPlayer.xp >= nextPlayer.xpToNextLevel) {
      soundEffects.playWin();
      nextPlayer.level += 1;
      nextPlayer.xp -= nextPlayer.xpToNextLevel;
      nextPlayer.maxHp += 5;
      nextPlayer.hp = nextPlayer.maxHp; // Heal to full on level-up!
      nextPlayer.xpToNextLevel = Math.floor(nextPlayer.xpToNextLevel * 1.5);
      
      addLog(`✨ LEVEL UP! Anda naik ke Tingkat ${nextPlayer.level}. Kesehatan pulih maksimal, kapasitas HP naik ke +5! 🌟`);
    }

    // Auto-refill empty grids from remaining deck if possible to make the game flow seamless!
    const emptyCount = nextGrid.filter(c => c === null).length;
    let nextDeck = [...deck];
    if (emptyCount >= 3 && nextDeck.length > 0) {
      for (let i = 0; i < 9; i++) {
        if (nextGrid[i] === null && nextDeck.length > 0) {
          nextGrid[i] = nextDeck.pop() || null;
        }
      }
    }

    setPlayer(nextPlayer);
    setGrid(nextGrid);
    setDeck(nextDeck);

    // General status checking
    checkGameStatus(nextGrid, nextDeck, nextPlayer.hp);
  };

  const getCardIconStyle = (type: DungeonCardType) => {
    switch (type) {
      case DungeonCardType.MONSTER:
        return { bg: "bg-white text-rose-600 border-rose-200 hover:border-rose-400 hover:bg-rose-50/20", icon: <Skull className="w-5 h-5 text-rose-500" /> };
      case DungeonCardType.WEAPON:
        return { bg: "bg-white text-sky-700 border-stone-200 hover:border-sky-500 hover:bg-sky-50/20", icon: <Sword className="w-5 h-5 text-sky-600" /> };
      case DungeonCardType.SHIELD:
        return { bg: "bg-white text-indigo-700 border-stone-200 hover:border-indigo-500 hover:bg-indigo-50/20", icon: <Shield className="w-5 h-5 text-indigo-600" /> };
      case DungeonCardType.POTION:
        return { bg: "bg-white text-emerald-600 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/20", icon: <Heart className="w-5 h-5 text-emerald-500" /> };
      case DungeonCardType.GOLD:
        return { bg: "bg-white text-amber-600 border-amber-200 hover:border-amber-500 hover:bg-amber-50/20", icon: <Coins className="w-5 h-5 text-amber-500" /> };
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[580px] bg-white rounded-none border border-stone-200 shadow-card overflow-hidden relative select-none">
      
      {/* HEADER CONTROLS */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-[#faf9f5] relative z-10">
        <div className="flex items-center gap-2.5 font-cinzel">
          <div className="w-2.5 h-2.5 bg-rose-600 rotate-45"></div>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-stone-900">Void Dungeon Crawler</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-2 text-stone-600 hover:text-amber-700 bg-white border border-stone-250 hover:border-amber-600 transition cursor-pointer"
            title={isMuted ? "Aktifkan suara" : "Senyap"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-650" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => { soundEffects.playClick(); setShowHelper(!showHelper); }}
            className="p-2 text-stone-600 hover:text-amber-700 bg-white border border-stone-250 hover:border-amber-600 transition cursor-pointer"
            title="Sintaks Petunjuk"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-stone-200 relative">
        
        {/* CHARACTER HERO HUD (LEFT SIDEBAR) */}
        <div className="w-full lg:w-72 bg-[#faf9f5] p-6 flex flex-col justify-between">
          <div>
            {/* LEVEL & XP STATUS */}
            <div className="p-4 bg-white border border-stone-200 shadow-sm mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1.5 opacity-5">
                <User className="w-16 h-16 text-stone-800" />
              </div>
              
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] uppercase font-mono text-stone-500 tracking-wider">PENJELAJAH AKTIF</span>
                <span className="font-mono text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 animate-pulse">LVL {player.level}</span>
              </div>
              <h4 className="font-cinzel text-xs uppercase tracking-widest text-stone-900 font-bold mb-3">GRAND ARBITER HERO</h4>

              {/* XP progress bar */}
              <div className="text-[9px] text-stone-500 font-mono mb-1.5 flex justify-between">
                <span>PENGALAMAN (XP):</span>
                <span>{player.xp}/{player.xpToNextLevel}</span>
              </div>
              <div className="w-full h-1 bg-stone-200 overflow-hidden">
                <div 
                  className="h-full bg-amber-650 transition-all duration-300"
                  style={{ width: `${Math.min(100, (player.xp / player.xpToNextLevel) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* LIVE HP & MAX HP STAT */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-stone-550 tracking-widest uppercase block">INDIKATOR VITAL</span>
              
              {/* HP Meter */}
              <div className="bg-white border border-stone-205 p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-600 text-xs">
                    <Heart className="w-3.5 h-3.5 fill-rose-600/40 text-rose-600" />
                    <span className="font-mono text-[10px] uppercase tracking-wider">VITALITY (HP)</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-850">{player.hp}/{player.maxHp}</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 overflow-hidden border border-stone-200">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-700 to-rose-505 transition-all duration-300"
                    style={{ width: `${Math.max(0, (player.hp / player.maxHp) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Weapon Power Indicator */}
              <div className="bg-white border border-stone-205 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-stone-600 font-mono">
                  <Sword className="w-3.5 h-3.5 text-amber-600" />
                  <span>ATTACK DECK</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-stone-850">DMG +{player.weaponPower}</div>
                  {player.weaponPower > 0 && (
                    <div className="text-[9px] text-stone-500 font-mono mt-0.5">Daya: {player.weaponDurability}X tebas</div>
                  )}
                </div>
              </div>

              {/* Shield Defense Block Indicator */}
              <div className="bg-white border border-stone-205 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-stone-600 font-mono">
                  <Shield className="w-3.5 h-3.5 text-sky-655" />
                  <span>SHIELD VALUE</span>
                </div>
                <div className="font-mono text-xs font-bold text-sky-700">
                  +{player.shieldBlock} BLK
                </div>
              </div>

              {/* Gold Counter */}
              <div className="bg-white border border-stone-205 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-stone-600 font-mono">
                  <Coins className="w-3.5 h-3.5 text-amber-605" />
                  <span>KUMPULAN EMAS</span>
                </div>
                <div className="font-mono text-xs font-bold text-amber-650">
                  {player.gold} / 500g
                </div>
              </div>

            </div>
          </div>

          {/* SISA DEK BAR */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <div className="flex justify-between items-center text-[10px] font-mono mb-2.5">
              <span className="text-stone-500">SISA DEK TANTANGAN:</span>
              <span className="text-amber-655 font-bold">{deck.length} KARTU</span>
            </div>
            
            <button
              onClick={handleRefillGrid}
              disabled={deck.length === 0}
              className="w-full py-2.5 bg-white border border-stone-300 hover:border-amber-600 disabled:opacity-30 text-stone-700 hover:text-amber-700 hover:bg-stone-50 text-xs font-semibold font-mono uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3 h-3 text-amber-600" />
              <span>Kocok Baru Grid</span>
            </button>
          </div>
        </div>

        {/* 3x3 CARDS ARENA AREA */}
        <div className="flex-1 p-6 bg-[#fbfaf6] relative overflow-hidden flex flex-col justify-between grid-bg-dots">
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500">Arena Penjelajahan (3x3 Grid)</span>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#d97706] bg-white border border-amber-500/30 px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>SKOR HERO: {player.score}</span>
            </div>
          </div>

          {/* GRID OF 9 SLOTS */}
          <div className="grid grid-cols-3 gap-3 md:gap-4.5 max-w-lg mx-auto w-full my-auto py-2 relative z-10">
            {grid.map((card, idx) => {
              if (!card) {
                return (
                  <div 
                    key={`empty_${idx}`}
                    className="aspect-[3/4.2] rounded-none border border-dashed border-stone-250 bg-stone-100 flex flex-col items-center justify-center text-center opacity-70 transition"
                  >
                    <span className="text-[9px] uppercase tracking-wider font-mono text-stone-500">Terbuka</span>
                  </div>
                );
              }

              const visuals = getCardIconStyle(card.type);
              
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.04, translateY: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCardInteraction(idx)}
                  className={`aspect-[3/4.2] cursor-pointer rounded-none border p-2.5 flex flex-col justify-between shadow-sm transition-all relative overflow-hidden group select-none ${visuals?.bg}`}
                >
                  {/* Subtle Light effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#d97706]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Card type icon & quantity indicator */}
                  <div className="flex justify-between items-center relative z-10">
                    <span className="p-1 border border-stone-150 bg-stone-50 text-stone-600">
                      {visuals?.icon}
                    </span>
                    
                    <span className="font-mono text-[9px] font-bold tracking-widest px-1.5 py-0.5 border border-stone-250 bg-white leading-none text-stone-900 shadow-sm">
                      {card.type === DungeonCardType.GOLD ? `+${card.value}` : null}
                      {card.type === DungeonCardType.WEAPON ? `ATK ${card.value}` : null}
                      {card.type === DungeonCardType.SHIELD ? `BLK ${card.value}` : null}
                      {card.type === DungeonCardType.POTION ? `+${card.value} HP` : null}
                      {card.type === DungeonCardType.MONSTER ? `${card.value} HP` : null}
                    </span>
                  </div>

                  {/* Body Content title & lore */}
                  <div className="mt-2 text-left flex-1 flex flex-col justify-end relative z-10">
                    <h5 className="text-[10px] sm:text-[11px] font-semibold text-stone-900 tracking-wider font-cinzel line-clamp-1 uppercase group-hover:text-amber-600 transition-colors">
                      {card.title}
                    </h5>
                    
                    <p className="text-[8.5px] text-stone-500 font-serif leading-relaxed italic line-clamp-2 mt-0.5 group-hover:text-stone-700 transition-colors">
                      {card.flavor}
                    </p>
                  </div>

                  {/* Background specific watermarks */}
                  <div className="absolute -bottom-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity text-stone-300">
                    {visuals?.icon && React.cloneElement(visuals.icon as React.ReactElement, { className: "w-12 h-12" })}
                  </div>

                  {/* Monster health damage bar */}
                  {card.type === DungeonCardType.MONSTER && card.maxValue && (
                    <div className="w-full bg-stone-100 h-1 overflow-hidden mt-1.5 border border-stone-200">
                      <div 
                        className="h-full bg-rose-600 transition-all duration-300"
                        style={{ width: `${Math.max(0, (card.value / card.maxValue) * 100)}%` }}
                      ></div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* COMBAT HISTORY LOGS PANEL */}
          <div className="mt-4 pt-3.5 border-t border-stone-200">
            <div className="flex items-center gap-1.5 text-stone-555 font-mono text-[9px] uppercase mb-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-600" />
              <span>Daftar Kronologi Pertempuran:</span>
            </div>
            
            <div className="bg-[#fafaf7] p-3.5 border border-stone-200 h-24 overflow-y-auto font-mono text-[10px] space-y-1.5 text-left text-stone-650 shadow-inner">
              {historyLogs.map((log, lidx) => (
                <div key={lidx} className="flex gap-1.5 items-start">
                  <ChevronRight className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                  <span className={`${lidx === 0 ? "text-amber-700 font-bold" : ""}`}>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* GAME OVER MODAL BACKDROP */}
      <AnimatePresence>
        {(isGameOver || isVictory) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#1c1917]/75 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border border-stone-250 rounded-none p-8 max-w-sm shadow-2xl text-center relative"
            >
              {/* Corner decorative borders */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-amber-600"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-amber-600"></div>

              {isVictory ? (
                <>
                  <div className="w-14 h-14 bg-amber-50 border border-amber-400 flex items-center justify-center mx-auto mb-4 text-amber-655">
                    <Award className="w-7 h-7" />
                  </div>
                  <h3 className="font-cinzel tracking-widest text-lg text-stone-900 font-bold mb-2">PENJELAJAHAN SELESAI</h3>
                  <p className="text-stone-600 text-[11px] leading-relaxed font-serif italic mb-6">
                    Luar biasa! Anda melaju menyapu semua musuh dungeon dan memenangkan tantangan permainan pertarungan kartu!
                  </p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-rose-50 border border-rose-300 flex items-center justify-center mx-auto mb-4 text-rose-600">
                    <Skull className="w-7 h-7" />
                  </div>
                  <h3 className="font-cinzel tracking-widest text-lg text-stone-900 font-bold mb-2">ANDA TELAH GUGUR</h3>
                  <p className="text-stone-600 text-[11px] leading-relaxed font-serif italic mb-6">
                    Kekuatan monster di arena berhasil melumpuhkan nyawa Anda pada level <span className="text-rose-600 font-bold font-mono">{player.level}</span>. Jangan menyerah penjelajah!
                  </p>
                </>
              )}

              <div className="bg-stone-50 p-4 border border-stone-200 text-[11px] font-mono space-y-2 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-stone-500">Hasil Skor Akhir:</span>
                  <span className="text-amber-700 font-bold">{player.score} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Monster Dikalahkan:</span>
                  <span className="text-stone-800 font-bold">{player.monstersDefeated} ekor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Koin Dikumpulkan:</span>
                  <span className="text-stone-800 font-bold">{player.gold} gold</span>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold uppercase tracking-widest transition duration-150 cursor-pointer shadow-md"
              >
                Mulai Petualangan Baru
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK INSTRUCTION PANEL MODAL */}
      <AnimatePresence>
        {showHelper && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1c1917]/75 backdrop-blur-sm z-40 p-6 flex items-center justify-center"
          >
            <div className="bg-white border border-stone-250 max-w-md p-6 max-h-[90%] overflow-y-auto shadow-2xl text-left relative">
              {/* Decorative Corners */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-amber-600"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-amber-600"></div>

              <div className="flex justify-between items-center mb-5 relative z-10">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <h3 className="font-cinzel uppercase tracking-widest text-xs text-stone-900 font-bold">Panduan Dungeon Crawler</h3>
                </div>
                <button 
                  onClick={() => { soundEffects.playClick(); setShowHelper(false); }}
                  className="text-stone-400 hover:text-amber-600 text-[10px] uppercase font-mono tracking-widest transition cursor-pointer"
                >
                  [Tutup]
                </button>
              </div>

              <div className="space-y-4 text-[11px] text-stone-600 leading-relaxed font-sans relative z-10">
                <p className="font-serif italic text-[12px] text-stone-800">
                  Permainan ini dimainkan di atas <strong>grid 3x3 pertemuan</strong>. Ambil kartu untuk melaju menyelidiki sisa deck dungeon Anda secara bertahap!
                </p>
                
                <div className="space-y-2.5">
                  <div className="flex gap-2 items-start bg-stone-50 p-2.5 border border-stone-200">
                    <span className="text-rose-600">💀</span>
                    <div>
                      <strong className="text-rose-700">Monster (Kartu Merah):</strong> Memilih musuh akan menyerangnya. Sisa HP monster akan mendatangkan kerusakan langsung ke HP Anda setelah dikurangi status persenjataan aktif Anda.
                    </div>
                  </div>

                  <div className="flex gap-2 items-start bg-stone-50 p-2.5 border border-stone-200">
                    <span className="text-sky-600">⚔️</span>
                    <div>
                      <strong className="text-sky-700">Weapon (Kartu Biru):</strong> Melengkapi senjata meningkatkan kekuatan serang (ATK) untuk melumpuhkan HP monster terlebih dahulu secara bertahap (kuota penggunaan: 3 kali).
                    </div>
                  </div>

                  <div className="flex gap-2 items-start bg-stone-50 p-2.5 border border-stone-200">
                    <span className="text-indigo-600">🛡️</span>
                    <div>
                      <strong className="text-indigo-700">Shield (Kartu Indigo):</strong> Melengkapi perisai akan menambah poin Block untuk menyerap sepenuhnya ataupun sebagian kerusakan balik monster.
                    </div>
                  </div>

                  <div className="flex gap-2 items-start bg-stone-50 p-2.5 border border-stone-200">
                    <span className="text-emerald-600">🧪</span>
                    <div>
                      <strong className="text-emerald-700">Potion & Gold (Koin):</strong> Meminum ramuan menyehatkan HP Anda, sedangkan menimbun emas meningkatkan skor akhir petualangan!
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/[0.04] border border-amber-500/20 p-3 text-[10.5px] text-amber-900 font-serif italic">
                  💡 <strong>Kiat Pro:</strong> Kumpulkan XP dari membunuh monster untuk naik Level. Setiap naik level menyembuhkan HP Anda sepenuhnya secara gratis dan memperbesar kapasitas bar HP Anda!
                </div>
              </div>

              <button
                onClick={() => { soundEffects.playClick(); setShowHelper(false); }}
                className="mt-6 w-full py-2.5 bg-stone-50 border border-stone-300 hover:border-amber-600 hover:text-white text-stone-800 text-xs font-mono font-bold uppercase tracking-widest transition cursor-pointer"
              >
                Siap Berjuang!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
