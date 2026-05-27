import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  TrendingUp, 
  Plus, 
  RotateCcw, 
  Coins, 
  Sparkles,
  Award,
  BookOpen
} from "lucide-react";
import { BJCard, CardSuit, HandOutcome, BJGameStatus } from "../types";
import { soundEffects } from "../audio";

interface PokeDetail {
  name: string;
  emoji: string;
  symbol: string;
  bgGrad: string;
  borderTheme: string;
  move: string;
  hp: number;
  flavor: string;
  rarity: string;
  textColor: string;
  type: string;
}

export const getPokemonDetails = (rank: string, suit: CardSuit): PokeDetail => {
  const map: Record<CardSuit, Record<string, { name: string; emoji: string; move: string; hp: number; flavor: string; rarity: string }>> = {
    [CardSuit.HEARTS]: {
      "2": { name: "Charmander", emoji: "🔥🦎", move: "Cakar Hangat", hp: 50, flavor: "Ekornya memancarkan api menyala.", rarity: "Basic" },
      "3": { name: "Vulpix", emoji: "🦊🔥", move: "Semburan Bara", hp: 60, flavor: "Memiliki enam ekor halus yang indah.", rarity: "Basic" },
      "4": { name: "Growlithe", emoji: "🐶🔥", move: "Gigitan Taring", hp: 60, flavor: "Sangat setia pada pelatihnya.", rarity: "Basic" },
      "5": { name: "Ponyta", emoji: "🐴🔥", move: "Lari Cepat", hp: 70, flavor: "Kuku kakinya lebih keras dari baja.", rarity: "Basic" },
      "6": { name: "Flareon", emoji: "🦁🔥", move: "Pusaran Api", hp: 90, flavor: "Menyimpan api membara di ekornya.", rarity: "Stage 1" },
      "7": { name: "Ninetales", emoji: "🦊✨", move: "Kekuatan Psikis", hp: 100, flavor: "Dikatakan hidup hingga seribu tahun.", rarity: "Stage 1" },
      "8": { name: "Magmar", emoji: "👹🔥", move: "Tinju Lahar", hp: 110, flavor: "Lahir di kawah gunung berapi aktif.", rarity: "Basic" },
      "9": { name: "Arcanine", emoji: "🐯🔥", move: "Wira Kilat", hp: 130, flavor: "Berlari lincah laksana angin badai.", rarity: "Stage 1" },
      "10": { name: "Charmeleon", emoji: "🦖🔥", move: "Nafas Api", hp: 80, flavor: "Menyerang musuh tanpa rasa takut.", rarity: "Stage 1" },
      "J": { name: "Typhlosion", emoji: "🌋🐭", move: "Lontaran Erupsi", hp: 140, flavor: "Menciptakan ledakan udara super panas.", rarity: "Stage 2" },
      "Q": { name: "Blaziken", emoji: "🐔🔥", move: "Tendangan Udara", hp: 150, flavor: "Mengeluarkan api dari kaki kuatnya.", rarity: "Stage 2" },
      "K": { name: "Charizard", emoji: "🐉🔥", move: "Fire Blast", hp: 180, flavor: "Nafas apinya mampu mencairkan es batu.", rarity: "Stage 2 EX" },
      "A": { name: "Moltres", emoji: "🦅🔥", move: "Aero Sky", hp: 200, flavor: "Lembayung kepak sayap pembawa bara api.", rarity: "Legendary" },
    },
    [CardSuit.DIAMONDS]: {
      "2": { name: "Pichu", emoji: "🐭⚡", move: "Pesona Ceria", hp: 40, flavor: "Belum mahir mengendalikan arusnya sendiri.", rarity: "Basic" },
      "3": { name: "Magnemite", emoji: "🧲⚡", move: "Sinar Magnet", hp: 50, flavor: "Melayang menggunakan gelombang elektromagnetik.", rarity: "Basic" },
      "4": { name: "Voltorb", emoji: "🔴⚡", move: "Gelinding Kilat", hp: 50, flavor: "Sangat mirip pokeball dan mudah meledak.", rarity: "Basic" },
      "5": { name: "Mareep", emoji: "🐑⚡", move: "Bulu Statis", hp: 60, flavor: "Bulunya menghasilkan listrik statis melimpah.", rarity: "Basic" },
      "6": { name: "Electabuzz", emoji: "🐯⚡", move: "Tinju Petir", hp: 90, flavor: "Menyukai badai petir untuk menyerap energi.", rarity: "Basic" },
      "7": { name: "Jolteon", emoji: "🦊⚡", move: "Jarum Sengat", hp: 100, flavor: "Bulunya tajam berdiri bagai duri petir.", rarity: "Stage 1" },
      "8": { name: "Ampharos", emoji: "🦒⚡", move: "Sinar Penjaga", hp: 120, flavor: "Ekornya bersinar terang sebagai mercusuar.", rarity: "Stage 2" },
      "9": { name: "Magneton", emoji: "⚙️⚡", move: "Discharge", hp: 110, flavor: "Tiga Magnemite menyatu membentuk kekuatan.", rarity: "Stage 1" },
      "10": { name: "Electivire", emoji: "🦍⚡", move: "Thunder Punch", hp: 140, flavor: "Menyalurkan tegangan tinggi lewat ekor.", rarity: "Stage 1" },
      "J": { name: "Pikachu", emoji: "⚡🐀", move: "Volt Tackle", hp: 70, flavor: "Menyimpan listrik di kedua pipi merahnya.", rarity: "Basic" },
      "Q": { name: "Raichu", emoji: "🐹⚡", move: "Thunderbolt", hp: 110, flavor: "Sengatannya melumpuhkan lawan seketika.", rarity: "Stage 1" },
      "K": { name: "Luxray", emoji: "🦁⚡", move: "Taring Petir", hp: 160, flavor: "Matanya menembus tembok untuk berburu.", rarity: "Stage 2 EX" },
      "A": { name: "Zapdos", emoji: "🦅⚡", move: "Guntur Dahsyat", hp: 180, flavor: "Burung petir legendaris pemecah langit.", rarity: "Legendary" },
    },
    [CardSuit.CLUBS]: {
      "2": { name: "Squirtle", emoji: "🐢💧", move: "Pistol Air", hp: 50, flavor: "Tempurungnya memberikan perlindungan sempurna.", rarity: "Basic" },
      "3": { name: "Psyduck", emoji: "🦆💧", move: "Gelombang Psikis", hp: 60, flavor: "Mengeluarkan kekuatan saat pusing melanda.", rarity: "Basic" },
      "4": { name: "Poliwag", emoji: "🌀💧", move: "Gelembung Sabun", hp: 50, flavor: "Pola pusaran perutnya sangat mempesona.", rarity: "Basic" },
      "5": { name: "Staryu", emoji: "⭐💧", move: "Bintang Serang", hp: 60, flavor: "Inti merah di tengah tubuhnya berkelip.", rarity: "Basic" },
      "6": { name: "Shellder", emoji: "🦪💧", move: "Gigitan Keras", hp: 50, flavor: "Menyembunyikan diri dalam cangkang keras.", rarity: "Basic" },
      "7": { name: "Vaporeon", emoji: "🦊💧", move: "Aqua Ring", hp: 110, flavor: "Bisa menyatu di air dan seketika menghilang.", rarity: "Stage 1" },
      "8": { name: "Seadra", emoji: "🐴💧", move: "Pusaran Air", hp: 90, flavor: "Tenggelam dalam pusaran air deras.", rarity: "Stage 1" },
      "9": { name: "Starmie", emoji: "🌟🔮", move: "Hydro Pump", hp: 100, flavor: "Bintang laut geometries penangkap sinyal kosmik.", rarity: "Stage 1" },
      "10": { name: "Lapras", emoji: "🦕❄️", move: "Sinar Es", hp: 130, flavor: "Senang menyanyi merdu di samudera luas.", rarity: "Basic" },
      "J": { name: "Wartortle", emoji: "🐢🌊", move: "Semburan Deras", hp: 80, flavor: "Ekor berbulu lebat lambang usia panjang.", rarity: "Stage 1" },
      "Q": { name: "Gyarados", emoji: "🐉🌊", move: "Dragon Rage", hp: 160, flavor: "Sangat liar dan mampu memicu badai laut.", rarity: "Stage 1" },
      "K": { name: "Blastoise", emoji: "🐢🔫", move: "Hydro Cannon", hp: 170, flavor: "Meriam ganda melontarkan semburan dahsyat.", rarity: "Stage 2 EX" },
      "A": { name: "Lugia", emoji: "🐉🌬️", move: "Aero Blast", hp: 200, flavor: "Mengepakkan sayap menciptakan ombak raksasa.", rarity: "Legendary" },
    },
    [CardSuit.SPADES]: {
      "2": { name: "Bulbasaur", emoji: "🍃🐸", move: "Cambuk Rambat", hp: 50, flavor: "Benih di punggungnya tumbuh seiring usianya.", rarity: "Basic" },
      "3": { name: "Oddish", emoji: "🌱🍃", move: "Spora Tidur", hp: 50, flavor: "Berjalan malam hari menyebarkan benih hara.", rarity: "Basic" },
      "4": { name: "Bellsprout", emoji: "🌿🍃", move: "Cairan Asam", hp: 50, flavor: "Batang tubuh lentur meliuk hindari tebasan.", rarity: "Basic" },
      "5": { name: "Tangela", emoji: "🧶🍃", move: "Lilitan Serat", hp: 70, flavor: "Tertutup jalinan rambat biru misterius.", rarity: "Basic" },
      "6": { name: "Chikorita", emoji: "🦕🌱", move: "Sembuh Daun", hp: 60, flavor: "Aroma manis yang menenangkan dari dedaunan.", rarity: "Basic" },
      "7": { name: "Ivysaur", emoji: "🌺🐸", move: "Taji Aroma", hp: 80, flavor: "Tunas mulai mekar pancarkan wangi harum.", rarity: "Stage 1" },
      "8": { name: "Victreebel", emoji: "🏺🍃", move: "Leaf Tornado", hp: 120, flavor: "Menjerat mangsa dengan madu beraroma madu.", rarity: "Stage 2" },
      "9": { name: "Leafeon", emoji: "🦊🍃", move: "Silet Daun", hp: 110, flavor: "Fotosintesis layaknya sekuntum bunga.", rarity: "Stage 1" },
      "10": { name: "Meganium", emoji: "🦕🌸", move: "Petal Blizzard", hp: 140, flavor: "Napasnya menghidupkan tanaman mati.", rarity: "Stage 2" },
      "J": { name: "Sceptile", emoji: "🦎🍃", move: "Blade Daun", hp: 130, flavor: "Sangat lincah meloncat di hutan belantara.", rarity: "Stage 2" },
      "Q": { name: "Celebi", emoji: "🧚🍃", move: "Magical Leaf", hp: 100, flavor: "Penjelajah waktu pelindung kelestarian hutan.", rarity: "Mythical" },
      "K": { name: "Venusaur", emoji: "🌸🐸", move: "Solar Beam", hp: 180, flavor: "Bunga raksasanya menyerap sinar mentari penuh.", rarity: "Stage 2 EX" },
      "A": { name: "Rayquaza", emoji: "🐉🍃", move: "Dragon Ascent", hp: 200, flavor: "Naga hijau agung pelindung ozon bumi.", rarity: "Legendary" },
    }
  };

  const suitKey = suit as CardSuit;
  const rankKey = rank as string;
  const defaultPoke = { name: "PokéCard", emoji: "✨🐹", move: "Sengatan", hp: 100, flavor: "Kekuatan persahabatan sejati.", rarity: "Mascot" };
  const base = map[suitKey]?.[rankKey] || defaultPoke;

  let bgGrad = "from-amber-50 via-yellow-50 to-amber-100";
  let borderTheme = "border-yellow-400";
  let textColor = "text-amber-655";
  let symbol = "⚡";
  let type = "Umum";

  if (suitKey === CardSuit.HEARTS) {
    bgGrad = "from-orange-50 via-red-50/70 to-orange-100";
    borderTheme = "border-red-400";
    textColor = "text-red-650";
    symbol = "🔥";
    type = "Api";
  } else if (suitKey === CardSuit.DIAMONDS) {
    bgGrad = "from-amber-50 via-yellow-50 to-amber-100";
    borderTheme = "border-yellow-400";
    textColor = "text-amber-500";
    symbol = "⚡";
    type = "Listrik";
  } else if (suitKey === CardSuit.CLUBS) {
    bgGrad = "from-sky-50 via-blue-50/50 to-sky-100";
    borderTheme = "border-sky-450";
    textColor = "text-sky-700";
    symbol = "💧";
    type = "Air";
  } else if (suitKey === CardSuit.SPADES) {
    bgGrad = "from-emerald-50 via-green-50/50 to-emerald-100";
    borderTheme = "border-emerald-450";
    textColor = "text-emerald-800";
    symbol = "🍃";
    type = "Daun";
  }

  return {
    ...base,
    symbol,
    bgGrad,
    borderTheme,
    textColor,
    type
  };
};

const CHIP_VALUES = [10, 25, 50, 100, 500];

export default function BlackjackGame() {
  const [deck, setDeck] = useState<BJCard[]>([]);
  const [playerHand, setPlayerHand] = useState<BJCard[]>([]);
  const [dealerHand, setDealerHand] = useState<BJCard[]>([]);
  
  const [bet, setBet] = useState<number>(50);
  const [balance, setBalance] = useState<number>(1000);
  const [status, setStatus] = useState<BJGameStatus>("BETTING");
  
  // Game stats
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    pushes: 0,
    streak: 0,
    peakBalance: 1000
  });

  const [message, setMessage] = useState<string>("Pasang taruhan PokéCoins Anda untuk memulai duel energi!");
  const [showRules, setShowRules] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.getMuteState());

  // Initialize and Shuffle Deck
  const createDeck = (): BJCard[] => {
    const suits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];
    const ranks = [
      { r: "2", v: 2 }, { r: "3", v: 3 }, { r: "4", v: 4 }, { r: "5", v: 5 },
      { r: "6", v: 6 }, { r: "7", v: 7 }, { r: "8", v: 8 }, { r: "9", v: 9 },
      { r: "10", v: 10 }, { r: "J", v: 10 }, { r: "Q", v: 10 }, { r: "K", v: 10 },
      { r: "A", v: 11 }
    ];

    const tempDeck: BJCard[] = [];
    // 6 Decks pool
    for (let deckNum = 0; deckNum < 6; deckNum++) {
      for (const suit of suits) {
        for (const rank of ranks) {
          tempDeck.push({
            id: `bj_${deckNum}_${suit}_${rank.r}`,
            suit,
            rank: rank.r,
            value: rank.v,
            isRevealed: true
          });
        }
      }
    }
    
    // Fisher-Yates Shuffle
    for (let i = tempDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempDeck[i], tempDeck[j]] = [tempDeck[j], tempDeck[i]];
    }
    return tempDeck;
  };

  // Sound toggler
  const handleToggleMute = () => {
    const mutedStatus = soundEffects.toggleMute();
    setIsMuted(mutedStatus);
    soundEffects.playClick();
  };

  // Initial load
  useEffect(() => {
    setDeck(createDeck());
    
    // Retrieve stats
    const savedStats = localStorage.getItem("bj_game_stats");
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        if (parsed.balance) setBalance(parsed.balance);
      } catch (e) {}
    }
  }, []);

  // Save stats on change
  useEffect(() => {
    localStorage.setItem("bj_game_stats", JSON.stringify({
      ...stats,
      balance
    }));
  }, [stats, balance]);

  const calculateHandValue = (hand: BJCard[]): number => {
    let sum = hand.reduce((acc, card) => acc + card.value, 0);
    let aces = hand.filter(card => card.rank === "A").length;
    
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces -= 1;
    }
    return sum;
  };

  // Start turn / Deal Initial Cards
  const handleStartDeal = () => {
    if (bet > balance) {
      setMessage("PokéCoins Anda tidak mencukupi untuk tantangan Gym ini!");
      soundEffects.playClick();
      return;
    }
    if (bet <= 0) {
      setMessage("Silakan pasang taruhan minimal 10 PokéCoins!");
      soundEffects.playClick();
      return;
    }

    soundEffects.playShuffle();
    const newDeck = deck.length < 20 ? createDeck() : [...deck];
    
    // Take cards
    const cardP1 = { ...newDeck.pop()!, isRevealed: true };
    const cardD1 = { ...newDeck.pop()!, isRevealed: true };
    const cardP2 = { ...newDeck.pop()!, isRevealed: true };
    const cardD2 = { ...newDeck.pop()!, isRevealed: false }; // Face down

    const nextPlayerHand = [cardP1, cardP2];
    const nextDealerHand = [cardD1, cardD2];

    const playerVal = calculateHandValue(nextPlayerHand);
    const dealerVal = calculateHandValue(nextDealerHand.filter(c => c.isRevealed)); // Revealed value only

    setPlayerHand(nextPlayerHand);
    setDealerHand(nextDealerHand);
    setDeck(newDeck);
    setBalance(prev => prev - bet);
    
    // Check instant blackjack
    const isPlayerBJ = playerVal === 21;
    
    if (isPlayerBJ) {
      setStatus("DEALER_TURN");
      setMessage("Perfect Poké-Energy! Gym Leader bersiap membuka kartu pertahanan...");
      // Dealer reveals card
      setTimeout(() => {
        revealAndRunDealer(nextPlayerHand, nextDealerHand, newDeck);
      }, 1000);
    } else {
      setStatus("PLAYER_TURN");
      setMessage("Pilih Tarik (Hit) untuk kumpulkan energi, atau Bertahan (Stand) untuk memulai duel.");
    }

    // Play consecutive deals
    setTimeout(() => soundEffects.playDeal(), 100);
    setTimeout(() => soundEffects.playDeal(), 300);
    setTimeout(() => soundEffects.playDeal(), 500);
    setTimeout(() => soundEffects.playDeal(), 700);
  };

  // Hit Action
  const handleHit = () => {
    if (status !== "PLAYER_TURN") return;
    soundEffects.playDeal();

    const newDeck = [...deck];
    const drawnCard = { ...newDeck.pop()!, isRevealed: true };
    const nextPlayerHand = [...playerHand, drawnCard];
    
    setPlayerHand(nextPlayerHand);
    setDeck(newDeck);

    const score = calculateHandValue(nextPlayerHand);
    if (score > 21) {
      // Bust
      setStatus("RESOLUTION");
      setMessage("Energi Overload! Energi Poké Anda melampaui limit 21 poin.");
      soundEffects.playLose();
      setStats(prev => ({
        ...prev,
        losses: prev.losses + 1,
        streak: 0
      }));
    } else if (score === 21) {
      // Automate dealer turn
      setStatus("DEALER_TURN");
      setMessage("Sempurna 21 poin energi! Menunggu respon Gym Leader...");
      setTimeout(() => {
        revealAndRunDealer(nextPlayerHand, dealerHand, newDeck);
      }, 1000);
    } else {
      setMessage(`Total Poin Energi Anda saat ini: ${score} poin.`);
    }
  };

  // Double Down
  const handleDoubleDown = () => {
    if (status !== "PLAYER_TURN") return;
    if (balance < bet) {
      setMessage("PokéCoins tidak mencukupi untuk melipatgandakan taruhan energi!");
      return;
    }

    soundEffects.playChip();
    soundEffects.playDeal();

    const newDeck = [...deck];
    const drawnCard = { ...newDeck.pop()!, isRevealed: true };
    const nextPlayerHand = [...playerHand, drawnCard];

    setPlayerHand(nextPlayerHand);
    setDeck(newDeck);
    setBalance(prev => prev - bet);
    const totalBet = bet * 2;

    const score = calculateHandValue(nextPlayerHand);
    if (score > 21) {
      setStatus("RESOLUTION");
      setMessage("Overload saat Double Down! Poin energi melampaui batas 21.");
      soundEffects.playLose();
      setStats(prev => ({
        ...prev,
        losses: prev.losses + 1,
        streak: 0
      }));
    } else {
      setStatus("DEALER_TURN");
      setMessage("Energi pertandingan dilipatgandakan! Giliran Gym Leader bertindak...");
      setTimeout(() => {
        revealAndRunDealer(nextPlayerHand, dealerHand, newDeck, totalBet);
      }, 1200);
    }
  };

  // Stand Action
  const handleStand = () => {
    if (status !== "PLAYER_TURN") return;
    soundEffects.playClick();
    setStatus("DEALER_TURN");
    setMessage("Gym Leader bersiap mengaktifkan kartu energinya...");
    setTimeout(() => {
      revealAndRunDealer(playerHand, dealerHand, deck);
    }, 800);
  };

  // Dealer Action Engine
  const revealAndRunDealer = (
    currentPlayerHand: BJCard[], 
    currentDealerHand: BJCard[], 
    currentDeck: BJCard[],
    activeRoundBet: number = bet
  ) => {
    // Reveal all dealer cards
    let nextDealerHand = currentDealerHand.map(card => ({ ...card, isRevealed: true }));
    let nextDeck = [...currentDeck];
    setDealerHand(nextDealerHand);
    soundEffects.playDeal();

    const playerVal = calculateHandValue(currentPlayerHand);
    let dealerVal = calculateHandValue(nextDealerHand);

    // Dealer draws on soft 17 or lower
    const drawInterval = setInterval(() => {
      dealerVal = calculateHandValue(nextDealerHand);
      
      if (dealerVal < 17 && playerVal <= 21) {
        soundEffects.playDeal();
        const nextCard = { ...nextDeck.pop()!, isRevealed: true };
        nextDealerHand = [...nextDealerHand, nextCard];
        setDealerHand(nextDealerHand);
        setDeck(nextDeck);
      } else {
        clearInterval(drawInterval);
        resolveGame(currentPlayerHand, nextDealerHand, activeRoundBet);
      }
    }, 800);
  };

  // Resolve Outcomes
  const resolveGame = (pHand: BJCard[], dHand: BJCard[], activeRoundBet: number) => {
    const pVal = calculateHandValue(pHand);
    const dVal = calculateHandValue(dHand);

    let payout = 0;
    let nextMessage = "";
    let isWin = false;
    let isDraw = false;

    if (pVal > 21) {
      nextMessage = "Anda Kalah! (Bust)";
    } else if (dVal > 21) {
      nextMessage = "Dealer Bust! Anda Menang!";
      payout = activeRoundBet * 2;
      isWin = true;
    } else if (pVal > dVal) {
      if (pVal === 21 && pHand.length === 2) {
        // Blackjack 3:2 payout
        nextMessage = "Luar Biasa! BLACKJACK!";
        payout = Math.floor(activeRoundBet * 2.5);
      } else {
        nextMessage = `Anda Menang! ${pVal} versus ${dVal}`;
        payout = activeRoundBet * 2;
      }
      isWin = true;
    } else if (pVal < dVal) {
      nextMessage = `Dealer Menang! ${dVal} versus ${pVal}`;
    } else {
      nextMessage = `Push! Taruhan dikembalikan (${pVal} sama).`;
      payout = activeRoundBet;
      isDraw = true;
    }

    // Apply outcome payouts
    if (payout > 0) {
      setBalance(prev => {
        const nextBal = prev + payout;
        if (nextBal > stats.peakBalance) {
          setStats(s => ({ ...s, peakBalance: nextBal }));
        }
        return nextBal;
      });
    }

    setMessage(nextMessage);
    setStatus("RESOLUTION");

    // Play sounds & Update stats
    if (isWin) {
      soundEffects.playWin();
      setStats(prev => ({
        ...prev,
        wins: prev.wins + 1,
        streak: prev.streak + 1
      }));
    } else if (isDraw) {
      soundEffects.playClick();
      setStats(prev => ({
        ...prev,
        pushes: prev.pushes + 1
      }));
    } else {
      soundEffects.playLose();
      setStats(prev => ({
        ...prev,
        losses: prev.losses + 1,
        streak: 0
      }));
    }
  };

  // Reset Round
  const startNextRound = () => {
    soundEffects.playClick();
    setPlayerHand([]);
    setDealerHand([]);
    setStatus("BETTING");
    setMessage("Pasang taruhan energi baru untuk duel berikutnya!");
  };

  // Quick reset balance if broke
  const handleRefillBalance = () => {
    soundEffects.playGoldCoins();
    setBalance(500);
    setBet(10);
    setMessage("Liga Trainer memberikan bantuan 500 PokéCoins gratis! Selamat berduel kembali.");
  };

  const adjustBet = (amount: number) => {
    if (status !== "BETTING") return;
    soundEffects.playClick();
    setBet(prev => {
      const target = Math.max(10, prev + amount);
      if (target > balance) return prev;
      return target;
    });
  };

  const setFixedBet = (val: number) => {
    if (status !== "BETTING") return;
    soundEffects.playChip();
    if (val > balance) {
      setBet(balance);
      setMessage(`Taruhan disesuaikan dengan saldo tersisa Anda.`);
    } else {
      setBet(val);
    }
  };

  // Suit character colors
  const getSuitIconAndColor = (suit: CardSuit) => {
    switch (suit) {
      case CardSuit.HEARTS:
        return { icon: "♥", color: "text-rose-650" };
      case CardSuit.DIAMONDS:
        return { icon: "♦", color: "text-amber-650" };
      case CardSuit.CLUBS:
        return { icon: "♣", color: "text-emerald-850" };
      case CardSuit.SPADES:
        return { icon: "♠", color: "text-stone-950" };
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[580px] bg-white rounded-none border border-stone-200 shadow-card overflow-hidden relative select-none">
      
      {/* GAME HEADER CONTROLS */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-[#faf9f5] relative z-10">
        <div className="flex items-center gap-2.5 font-sans">
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-900 font-bold">⚡ POKÉ-ENERGY DUEL (21) ⚡</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMute}
            className="p-2 text-stone-600 hover:text-amber-700 bg-stone-50 border border-stone-200 hover:border-amber-500/30 transition cursor-pointer"
            title={isMuted ? "Aktifkan suara" : "Senyap"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-650" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => { soundEffects.playClick(); setShowRules(!showRules); }}
            className="p-2 text-stone-600 hover:text-amber-700 bg-stone-50 border border-stone-200 hover:border-amber-500/30 transition cursor-pointer"
            title="Cara bermain"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* CASINO HUD PANELS */}
        <div className="w-full lg:w-72 bg-[#faf9f5] border-b lg:border-b-0 lg:border-r border-stone-200 p-6 flex flex-col justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono font-semibold text-amber-750 tracking-[0.2em] uppercase block mb-3">STATISTIK ARENA</span>
            
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-white p-3 border border-stone-200 shadow-sm">
                <div className="text-[10px] text-stone-550 font-sans">Streak</div>
                <div className="text-lg font-mono font-bold text-amber-600">{stats.streak}🔥</div>
              </div>
              <div className="bg-white p-3 border border-stone-200 shadow-sm">
                <div className="text-[10px] text-stone-550 font-sans">Tertinggi</div>
                <div className="text-sm font-mono font-bold text-stone-850">${stats.peakBalance}</div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-205 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-wide text-stone-500">Menang:</span>
                <span className="font-mono text-amber-600 font-bold">{stats.wins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-wide text-stone-500">Kalah:</span>
                <span className="font-mono text-stone-500 font-bold">{stats.losses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-wide text-stone-500">Seri / Push:</span>
                <span className="font-mono text-stone-705 font-medium">{stats.pushes}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-0 pt-6 border-t border-stone-200">
            <span className="text-[10px] font-mono text-stone-500 tracking-[0.2em] uppercase block mb-3">CATATAN ARENA POKÉ</span>
            <div className="bg-yellow-500/[0.04] border border-yellow-500/20 p-4 text-[11px] text-stone-700 leading-relaxed font-semibold italic text-left relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-yellow-500/40"></div>
              Gym Leader wajib menambah energi baru sampai minimal 17. Perfect Poke-Energy melunasi taruhan 3:2!
            </div>
          </div>
        </div>

        {/* EMERALD FELT BJ TABLE AREA -> CONVERTED TO SOPHISTICATED NEBULA STARDUST */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-[#fbfaf6] relative overflow-hidden grid-bg-dots">
          
          {/* Deck shoe representation */}
          <div className="absolute top-4 right-4 text-[9px] font-mono text-yellow-650 bg-white border border-stone-250 px-2.5 py-1 shadow-sm font-medium">
            SISA DEK POKÉ: {deck.length} / 312
          </div>

          {/* DEALER SIDE */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500 font-extrabold">KARTU GYM LEADER</span>
              {dealerHand.length > 0 && (
                <span className="bg-white border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-mono text-amber-750 font-bold shadow-sm">
                  SCORE: {status === "PLAYER_TURN" ? "?" : calculateHandValue(dealerHand)}
                </span>
              )}
            </div>

            <div className="flex gap-3 sm:gap-4 justify-center min-h-[145px] md:min-h-[170px] lg:min-h-[190px] xl:min-h-[220px] items-center relative py-1 flex-wrap">
              <AnimatePresence>
                {dealerHand.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.5, x: 200, y: -200, rotate: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 100, damping: 14, delay: idx * 0.15 }}
                    className={`rounded-lg border-[3px] sm:border-[4px] border-amber-400 bg-white shadow-xl relative shrink-0 transition-all select-none overflow-hidden w-[100px] h-[145px] sm:w-[120px] sm:h-[175px] md:w-[130px] md:h-[188px] xl:w-[140px] xl:h-[200px] flex flex-col ${
                      card.isRevealed 
                        ? getPokemonDetails(card.rank, card.suit).bgGrad 
                        : "bg-gradient-to-b from-[#1e3a8a] to-[#0f172a]"
                    }`}
                  >
                    {card.isRevealed ? (
                      (() => {
                        const poke = getPokemonDetails(card.rank, card.suit);
                        return (
                          <div className="flex flex-col h-full w-full justify-between p-1 sm:p-1.5 font-sans relative">
                            <div className="absolute inset-0.5 border border-amber-400/40 rounded pointer-events-none z-0"></div>
                            
                            <div className="flex justify-between items-center relative z-10 px-0.5">
                              <div className="flex flex-col text-left">
                                <span className="text-[8px] sm:text-[9.5px] md:text-[10px] font-extrabold uppercase text-stone-900 tracking-tight leading-tight truncate max-w-[55px] sm:max-w-[70px]">
                                  {poke.name}
                                </span>
                                <span className="text-[5.5px] sm:text-[6.5px] font-mono text-stone-500 scale-90 -ml-1 mt-0.5 font-bold leading-none">
                                  {poke.rarity}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 leading-none">
                                <span className="font-mono text-[7.5px] sm:text-[9px] font-extrabold text-stone-850 leading-none">
                                  {poke.hp} HP
                                </span>
                                <span className="text-[8px] sm:text-[10px] md:text-[11px] leading-none shrink-0">
                                  {poke.symbol}
                                </span>
                              </div>
                            </div>

                            <div className="relative z-10 w-full aspect-[16/11] bg-gradient-to-br from-white via-stone-50 to-stone-150 rounded border border-stone-300 flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
                              <div className={`absolute inset-0 opacity-15 bg-radial ${
                                card.suit === CardSuit.HEARTS ? "from-red-500" :
                                card.suit === CardSuit.DIAMONDS ? "from-yellow-400" :
                                card.suit === CardSuit.CLUBS ? "from-blue-500" : "from-emerald-500"
                              } to-transparent z-0`}></div>
                              <span className="text-xl sm:text-2xl md:text-3xl relative z-10 transform group-hover:scale-110 transition duration-200">
                                {poke.emoji}
                              </span>
                            </div>

                            <div className="relative z-10 flex-1 flex flex-col justify-center px-0.5 border-t border-dashed border-stone-300 pt-0.5 mt-0.5">
                              <div className="flex items-center justify-between text-left leading-none">
                                <div className="flex items-center gap-0.5 text-stone-800 leading-none">
                                  <span className="text-[6.5px] sm:text-[7.5px] leading-none">{poke.symbol}</span>
                                  <span className="text-[7px] sm:text-[8px] md:text-[8.5px] font-sans font-bold leading-none text-stone-800 tracking-tight">
                                    {poke.move}
                                  </span>
                                </div>
                                <span className="text-[6.5px] sm:text-[8px] font-mono font-bold text-stone-600 leading-none">
                                  +{poke.hp / 2}
                                </span>
                              </div>
                              <span className="hidden sm:block text-[5.5px] sm:text-[6.5px] font-serif leading-tight italic text-stone-500 mt-0.5 line-clamp-1 leading-none">
                                "{poke.flavor}"
                              </span>
                            </div>

                            <div className="relative z-10 mt-1">
                              <div className="bg-stone-900 border border-stone-850 text-amber-400 font-mono text-[7px] sm:text-[8.5px] px-1 sm:px-1.5 py-0.5 rounded-sm flex items-center justify-between font-black shadow-sm tracking-tight leading-none">
                                <span className="text-white scale-90 sm:scale-100 font-bold">ENERGY UNIT</span>
                                <span className="font-extrabold text-amber-300">+{card.value}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-1 sm:p-2 relative overflow-hidden bg-gradient-to-b from-[#1e3a8a] to-[#0f172a]">
                        <div className="absolute inset-0.5 border border-amber-450/35 rounded pointer-events-none z-0"></div>
                        <div className="relative flex flex-col items-center justify-center scale-90 sm:scale-100">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-stone-900 bg-white relative overflow-hidden flex flex-col shadow-lg animate-pulse-slow">
                            <div className="absolute top-0 inset-x-0 h-[48%] bg-rose-600 border-b border-stone-900"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-stone-900 bg-white z-10 flex items-center justify-center shadow-inner">
                              <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                            </div>
                          </div>
                          <span className="text-[6px] sm:text-[7.5px] font-sans font-extrabold tracking-widest text-amber-400 mt-2 text-center uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                            POKÉ BALL
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {dealerHand.length === 0 && (
                <div className="text-[10px] text-stone-550 font-mono tracking-widest uppercase">Meja Bandar Kosong</div>
              )}
            </div>
          </div>

          {/* NOTIFICATION HUB / CENTER MESSAGES */}
          <div className="my-2 min-h-[44px] flex items-center justify-center">
            <motion.div 
              key={message}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-[11px] tracking-wide font-sans bg-white border border-amber-500/40 text-stone-850 px-6 py-2 rounded-none shadow-card max-w-[95%] font-semibold"
            >
              {message}
            </motion.div>
          </div>

          {/* PLAYER SIDE */}
          <div className="flex flex-col items-center mt-4">
            <div className="flex gap-3 sm:gap-4 justify-center min-h-[145px] md:min-h-[170px] lg:min-h-[190px] xl:min-h-[220px] items-center relative py-1 flex-wrap">
              <AnimatePresence>
                {playerHand.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.5, x: 200, y: -200, rotate: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 100, damping: 14, delay: idx * 0.15 }}
                    className={`rounded-lg border-[3px] sm:border-[4px] border-amber-400 bg-white shadow-xl relative shrink-0 transition-all select-none overflow-hidden w-[100px] h-[145px] sm:w-[120px] sm:h-[175px] md:w-[130px] md:h-[188px] xl:w-[140px] xl:h-[200px] flex flex-col ${
                      getPokemonDetails(card.rank, card.suit).bgGrad
                    }`}
                  >
                    {(() => {
                      const poke = getPokemonDetails(card.rank, card.suit);
                      return (
                        <div className="flex flex-col h-full w-full justify-between p-1 sm:p-1.5 font-sans relative">
                          <div className="absolute inset-0.5 border border-amber-400/40 rounded pointer-events-none z-0"></div>
                          
                          <div className="flex justify-between items-center relative z-10 px-0.5">
                            <div className="flex flex-col text-left">
                              <span className="text-[8px] sm:text-[9.5px] md:text-[10px] font-extrabold uppercase text-stone-900 tracking-tight leading-tight truncate max-w-[55px] sm:max-w-[70px]">
                                {poke.name}
                              </span>
                              <span className="text-[5.5px] sm:text-[6.5px] font-mono text-stone-500 scale-90 -ml-1 mt-0.5 font-bold leading-none">
                                {poke.rarity}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5 leading-none">
                              <span className="font-mono text-[7.5px] sm:text-[9px] font-extrabold text-stone-850 leading-none">
                                {poke.hp} HP
                              </span>
                              <span className="text-[8px] sm:text-[10px] md:text-[11px] leading-none shrink-0" title={poke.type}>
                                {poke.symbol}
                              </span>
                            </div>
                          </div>

                          <div className="relative z-10 w-full aspect-[16/11] bg-gradient-to-br from-white via-stone-50 to-stone-150 rounded border border-stone-300 flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
                            <div className={`absolute inset-0 opacity-15 bg-radial ${
                              card.suit === CardSuit.HEARTS ? "from-red-500" :
                              card.suit === CardSuit.DIAMONDS ? "from-yellow-400" :
                              card.suit === CardSuit.CLUBS ? "from-blue-500" : "from-emerald-500"
                            } to-transparent z-0`}></div>
                            <span className="text-xl sm:text-2xl md:text-3xl relative z-10 transform group-hover:scale-110 transition duration-200">
                              {poke.emoji}
                            </span>
                          </div>

                          <div className="relative z-10 flex-1 flex flex-col justify-center px-0.5 border-t border-dashed border-stone-300 pt-0.5 mt-0.5">
                            <div className="flex items-center justify-between text-left leading-none">
                              <div className="flex items-center gap-0.5 text-stone-800 leading-none">
                                <span className="text-[6.5px] sm:text-[7.5px] leading-none">{poke.symbol}</span>
                                <span className="text-[7px] sm:text-[8px] md:text-[8.5px] font-sans font-bold leading-none text-stone-800 tracking-tight">
                                  {poke.move}
                                </span>
                              </div>
                              <span className="text-[6.5px] sm:text-[8px] font-mono font-bold text-stone-600 leading-none">
                                +{poke.hp / 2}
                              </span>
                            </div>
                            <span className="hidden sm:block text-[5.5px] sm:text-[6.5px] font-serif leading-tight italic text-stone-500 mt-0.5 line-clamp-1 leading-none">
                              "{poke.flavor}"
                            </span>
                          </div>

                          <div className="relative z-10 mt-1">
                            <div className="bg-stone-900 border border-stone-850 text-amber-400 font-mono text-[7px] sm:text-[8.5px] px-1 sm:px-1.5 py-0.5 rounded-sm flex items-center justify-between font-black shadow-sm tracking-tight leading-none">
                              <span className="text-white scale-90 sm:scale-100 font-bold">ENERGY UNIT</span>
                              <span className="font-extrabold text-amber-300">+{card.value}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {playerHand.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-stone-300 rounded-none w-52 h-28 text-center text-xs text-stone-550 bg-stone-50">
                  <Coins className="w-5 h-5 mb-1.5 opacity-40 text-amber-500" />
                  <span className="text-[10px] uppercase tracking-wide font-medium">Taruhan Belum Aktif</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500">Kartu Anda</span>
              {playerHand.length > 0 && (
                <span className="bg-white border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-mono text-amber-700 font-bold shadow-sm">
                  KUMPULAN: {calculateHandValue(playerHand)}
                </span>
              )}
            </div>
          </div>

          {/* CHIP SELECTION & GAME CONTROLS FOOTER */}
          <div className="mt-8 pt-5 border-t border-stone-200 bg-[#faf9f5] -mx-6 -mb-6 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              
              {/* CURRENT CREDITS / ADJUST BET */}
              <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-start">
                <div className="flex flex-col">
                  <span className="text-[9px] text-stone-550 uppercase font-mono tracking-widest">KREDIT AKTIF</span>
                  <div className="flex items-center gap-1.5 text-lg font-mono font-bold text-amber-600">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>${balance}</span>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-stone-200"></div>

                <div className="flex flex-col">
                  <span className="text-[9px] text-stone-550 uppercase font-mono tracking-widest">TARUHAN AKTIF</span>
                  <div className="flex items-center gap-2">
                    {status === "BETTING" && (
                      <button 
                        onClick={() => adjustBet(-10)}
                        className="w-5 h-5 bg-white border border-stone-300 hover:border-amber-500 flex items-center justify-center text-xs text-stone-600 hover:text-amber-750 transition cursor-pointer"
                      >
                        -
                      </button>
                    )}
                    <span className="text-lg font-mono font-bold text-stone-800">${bet}</span>
                    {status === "BETTING" && (
                      <button 
                        onClick={() => adjustBet(10)}
                        className="w-5 h-5 bg-white border border-stone-300 hover:border-amber-500 flex items-center justify-center text-xs text-stone-600 hover:text-amber-750 transition cursor-pointer"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                {balance <= 0 && status === "BETTING" && (
                  <button
                    onClick={handleRefillBalance}
                    className="ml-3 px-4 py-2 border border-amber-500/30 hover:border-amber-500 text-[10px] uppercase font-mono tracking-wider font-semibold bg-amber-500/10 text-amber-700 animate-pulse transition cursor-pointer"
                  >
                    🚀 DEK REFILL
                  </button>
                )}
              </div>

              {/* INTERACTIVE BETTING CHIPS OR BUTTONS */}
              <div className="w-full lg:w-auto flex flex-wrap justify-center items-center gap-3">
                {status === "BETTING" ? (
                  <>
                    <div className="hidden sm:flex items-center gap-1.5 mr-2">
                      {CHIP_VALUES.map(v => (
                        <button
                          key={v}
                          onClick={() => setFixedBet(v)}
                          disabled={v > balance}
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-dashed flex items-center justify-center font-mono font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer ${
                            bet === v 
                              ? "bg-amber-600 border-amber-700 text-white scale-110 shadow-md" 
                              : "bg-white border-stone-300 text-stone-700 hover:border-amber-500/80 hover:text-amber-750"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleStartDeal}
                      disabled={balance <= 0}
                      className="w-full sm:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-100 disabled:text-neutral-450 text-white font-mono font-bold uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer shadow-md"
                    >
                      Tantang Gym (Deal)
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 w-full justify-center">
                    {status === "PLAYER_TURN" && (
                      <>
                        <button
                          onClick={handleHit}
                          className="px-6 py-3 bg-stone-900 hover:bg-stone-950 text-white font-mono font-bold uppercase tracking-wider transition transform active:scale-95 cursor-pointer shadow-md"
                        >
                          Tarik (Hit)
                        </button>
                        <button
                          onClick={handleStand}
                          className="px-6 py-3 bg-white border border-stone-300 hover:border-amber-500 text-stone-800 font-mono font-bold uppercase tracking-wider transition transform active:scale-95 cursor-pointer shadow-sm"
                        >
                          Bertahan (Stand)
                        </button>
                        <button
                          onClick={handleDoubleDown}
                          disabled={balance < bet}
                          className="px-6 py-3 bg-amber-50 border border-amber-500/20 text-amber-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-transparent font-mono font-bold uppercase tracking-wider transition transform active:scale-95 cursor-pointer"
                          title="Melipatgandakan taruhan untuk membagi tepat satu kartu"
                        >
                          Dua Kali (Double)
                        </button>
                      </>
                    )}

                    {status === "RESOLUTION" && (
                      <button
                        onClick={startNextRound}
                        className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold uppercase tracking-wider transition transform active:scale-95 cursor-pointer shadow-md"
                      >
                        Duel Baru (New Round)
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* RULES MODAL BACKDROP */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1c1917]/70 backdrop-blur-sm z-40 p-6 flex items-center justify-center overflow-y-auto"
          >
            <div className="bg-white border border-stone-250 max-w-lg p-8 max-h-[90%] overflow-y-auto shadow-2xl relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-600"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-amber-600"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-amber-600"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-amber-600"></div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 font-sans">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold text-stone-900">PANDUAN DUEL ENERGI POKÉMON (21)</h3>
                </div>
                <button 
                  onClick={() => { soundEffects.playClick(); setShowRules(false); }}
                  className="text-stone-500 hover:text-amber-600 font-mono text-[11px] uppercase tracking-wider transition cursor-pointer"
                >
                  [tutup]
                </button>
              </div>

              <div className="space-y-4 text-xs text-stone-655 leading-relaxed font-sans italic text-left">
                <p className="not-italic">
                  Tujuan utama Anda adalah mengumpulkan Kartu Pokémon di tangan dengan total Energi sedekat mungkin ke angka <strong className="text-amber-655 font-bold">21</strong> tanpa melebihinya (Overload / Bust).
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 not-italic">
                  <li>Kartu Pokémon Dasar (<strong className="text-stone-900 font-bold">2 - 10</strong>) memiliki nilai sesuai angka nominal energinya.</li>
                  <li>Kartu Pokémon Evolusi (<strong className="text-stone-900 font-bold">J, Q, K</strong>) masing-masing bernilai <strong className="text-stone-900 font-bold">10</strong>.</li>
                  <li>Kartu Legendaris EX (<strong className="text-stone-900 font-bold">A</strong>) bernilai <strong className="text-stone-900 font-bold">11 atau 1</strong>, menyesuaikan arus energi terbaik otomatis agar tidak Overload.</li>
                </ul>
                <h4 className="font-semibold text-stone-900 tracking-widest uppercase text-[10px] font-mono mt-4 not-italic">PILIHAN TINDAKAN:</h4>
                <ul className="list-disc list-inside space-y-1 text-stone-600 not-italic">
                  <li><strong>Tarik (Hit):</strong> Menarik satu kartu Pokémon tambahan dari dek tumpukan.</li>
                  <li><strong>Bertahan (Stand):</strong> Menyelesaikan giliran kumpul energi dan menantang total energi Gym Leader.</li>
                  <li><strong>Dua Kali (Double):</strong> Melipatgandakan koin taruhan aktif, menarik tepat satu kartu tambahan, lalu otomatis Stand.</li>
                </ul>
                <h4 className="font-semibold text-stone-900 tracking-widest uppercase text-[10px] font-mono mt-4 not-italic">ATURAN GYM LEADER:</h4>
                <p className="not-italic">
                  Gym Leader wajib menarik kartu energi baru jika total nilainya di bawah <strong className="text-amber-655 font-bold">17</strong>, dan wajib bertahan (Stand) segera setelah bernilai <strong className="text-amber-655 font-bold">17 atau lebih</strong>.
                </p>
                <div className="bg-yellow-500/[0.04] border border-yellow-500/20 p-4 text-[11px] text-amber-800 leading-normal not-italic">
                  ⚡ <strong>Perfect Poké-Energy:</strong> Mendapatkan langsung kombinasi bernilai 21 koin energi pada permulaan pembagian memberikan bayaran kemenangan fantastis <strong>3:2</strong>!
                </div>
              </div>

              <button
                onClick={() => { soundEffects.playClick(); setShowRules(false); }}
                className="mt-6 w-full py-2.5 bg-stone-50 border border-stone-300 hover:border-amber-600 text-stone-800 hover:bg-amber-600 hover:text-white text-xs font-semibold uppercase tracking-widest transition cursor-pointer"
              >
                Dipahami
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
