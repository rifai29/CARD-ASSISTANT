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

  const [message, setMessage] = useState<string>("Pasang taruhan Anda untuk memulai permainan!");
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
      setMessage("Kredit Anda tidak mencukupi untuk taruhan ini!");
      soundEffects.playClick();
      return;
    }
    if (bet <= 0) {
      setMessage("Silakan pasang taruhan minimal 10 koin!");
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
      setMessage("Blackjack! Dealer akan membuka kartu...");
      // Dealer reveals card
      setTimeout(() => {
        revealAndRunDealer(nextPlayerHand, nextDealerHand, newDeck);
      }, 1000);
    } else {
      setStatus("PLAYER_TURN");
      setMessage("Pilih Hit untuk menambah kartu atau Stand untuk bertahan.");
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
      setMessage("Bust! Anda melebihi angka 21.");
      soundEffects.playLose();
      setStats(prev => ({
        ...prev,
        losses: prev.losses + 1,
        streak: 0
      }));
    } else if (score === 21) {
      // Automate dealer turn
      setStatus("DEALER_TURN");
      setMessage("Menarik! Anda mencapai 21. Giliran dealer...");
      setTimeout(() => {
        revealAndRunDealer(nextPlayerHand, dealerHand, newDeck);
      }, 1000);
    } else {
      setMessage(`Total kartu Anda saat ini: ${score}.`);
    }
  };

  // Double Down
  const handleDoubleDown = () => {
    if (status !== "PLAYER_TURN") return;
    if (balance < bet) {
      setMessage("Kredit Anda tidak mencukupi untuk melakukan Double Down!");
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
      setMessage("Bust saat Double Down! Anda melebihi angka 21.");
      soundEffects.playLose();
      setStats(prev => ({
        ...prev,
        losses: prev.losses + 1,
        streak: 0
      }));
    } else {
      setStatus("DEALER_TURN");
      setMessage("Selesai Double Down. Menunggu hasil dealer...");
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
    setMessage("Dealer bersiap memutar kartunya...");
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
    setMessage("Pasang taruhan baru Anda untuk putaran berikutnya!");
  };

  // Quick reset balance if broke
  const handleRefillBalance = () => {
    soundEffects.playGoldCoins();
    setBalance(500);
    setBet(10);
    setMessage("Diberikan bantuan koin gratis 500! Selamat bermain kembali.");
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
        <div className="flex items-center gap-2.5 font-cinzel">
          <div className="w-2.5 h-2.5 bg-amber-600 rotate-45"></div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-900 font-bold">Aether Blackjack 21</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMute}
            className="p-2 text-stone-600 hover:text-amber-700 bg-stone-50 border border-stone-200 hover:border-amber-500/30 transition cursor-pointer"
            title={isMuted ? "Aktifkan suara" : "Senyap"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
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

      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* CASINO HUD PANELS */}
        <div className="w-full md:w-64 bg-[#faf9f5] border-b md:border-b-0 md:border-r border-stone-200 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-amber-750 tracking-[0.2em] uppercase block mb-3">STATISTIK MEJA</span>
            
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
            <span className="text-[10px] font-mono text-stone-500 tracking-[0.2em] uppercase block mb-3">CONVENANT MEMO</span>
            <div className="bg-amber-500/[0.03] border border-amber-500/20 p-4 text-[11px] text-stone-700 leading-relaxed font-serif italic text-left relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/40"></div>
              Bandar wajib menambah kartu sampai mencapai minimal 17. Blackjack membayar 3:2 secara instan.
            </div>
          </div>
        </div>

        {/* EMERALD FELT BJ TABLE AREA -> CONVERTED TO SOPHISTICATED NEBULA STARDUST */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-[#fbfaf6] relative overflow-hidden grid-bg-dots">
          
          {/* Deck shoe representation */}
          <div className="absolute top-4 right-4 text-[9px] font-mono text-amber-700 bg-white border border-stone-250 px-2.5 py-1 shadow-sm font-medium">
            SEPATU DEK: {deck.length} / 312
          </div>

          {/* DEALER SIDE */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500 font-bold">Kartu Bandar</span>
              {dealerHand.length > 0 && (
                <span className="bg-white border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-mono text-amber-750 font-bold shadow-sm">
                  SCORE: {status === "PLAYER_TURN" ? "?" : calculateHandValue(dealerHand)}
                </span>
              )}
            </div>

            <div className="flex gap-4 justify-center min-h-[145px] items-center relative py-1">
              <AnimatePresence>
                {dealerHand.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.5, x: 200, y: -200, rotate: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 100, damping: 14, delay: idx * 0.15 }}
                    className={`w-20 h-28 sm:w-24 sm:h-34 rounded-none shadow-card transition-all relative ${
                      card.isRevealed 
                        ? "bg-white border border-stone-200 p-2 text-stone-900" 
                        : "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-500/40"
                    }`}
                  >
                    {card.isRevealed ? (
                      <div className="h-full flex flex-col justify-between font-mono font-bold">
                        <div className="text-xs self-start leading-none flex flex-col items-start">
                          <span className="text-sm font-semibold tracking-tight">{card.rank}</span>
                          <span className={`${getSuitIconAndColor(card.suit).color} text-xs mt-0.5`}>
                            {getSuitIconAndColor(card.suit).icon}
                          </span>
                        </div>
                        
                        <div className="text-3xl self-center leading-none text-slate-800 opacity-90 my-auto">
                          <span className={`${getSuitIconAndColor(card.suit).color}`}>
                            {getSuitIconAndColor(card.suit).icon}
                          </span>
                        </div>

                        <div className="text-xs self-end rotate-180 leading-none flex flex-col items-start">
                          <span className="text-sm font-semibold tracking-tight">{card.rank}</span>
                          <span className={`${getSuitIconAndColor(card.suit).color} text-xs mt-0.5`}>
                            {getSuitIconAndColor(card.suit).icon}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                        {/* Elegant Geometric Cardback */}
                        <div className="absolute inset-1 border border-amber-500/30 bg-white flex items-center justify-center">
                          <div className="w-12 h-18 border-2 border-dashed border-amber-500/20 rounded flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-amber-600/50 animate-pulse-slow" />
                          </div>
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
            <div className="flex gap-4 justify-center min-h-[145px] items-center relative py-1">
              <AnimatePresence>
                {playerHand.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.5, x: 200, y: -200, rotate: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 100, damping: 14, delay: idx * 0.15 }}
                    className="w-20 h-28 sm:w-24 sm:h-34 rounded-none shadow-card bg-white border border-stone-200 p-2 text-stone-900 transition-all cursor-default"
                  >
                    <div className="h-full flex flex-col justify-between font-mono font-bold">
                      <div className="text-xs self-start leading-none flex flex-col items-start">
                        <span className="text-sm font-semibold tracking-tight">{card.rank}</span>
                        <span className={`${getSuitIconAndColor(card.suit).color} text-xs mt-0.5`}>
                          {getSuitIconAndColor(card.suit).icon}
                        </span>
                      </div>
                      
                      <div className="text-3xl self-center leading-none text-slate-800 opacity-90 my-auto">
                        <span className={`${getSuitIconAndColor(card.suit).color}`}>
                          {getSuitIconAndColor(card.suit).icon}
                        </span>
                      </div>

                      <div className="text-xs self-end rotate-180 leading-none flex flex-col items-start">
                        <span className="text-sm font-semibold tracking-tight">{card.rank}</span>
                        <span className={`${getSuitIconAndColor(card.suit).color} text-xs mt-0.5`}>
                          {getSuitIconAndColor(card.suit).icon}
                        </span>
                      </div>
                    </div>
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
                      Bagi Kartu (Deal)
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
                          Hit
                        </button>
                        <button
                          onClick={handleStand}
                          className="px-6 py-3 bg-white border border-stone-300 hover:border-amber-500 text-stone-800 font-mono font-bold uppercase tracking-wider transition transform active:scale-95 cursor-pointer shadow-sm"
                        >
                          Stand
                        </button>
                        <button
                          onClick={handleDoubleDown}
                          disabled={balance < bet}
                          className="px-6 py-3 bg-amber-50 border border-amber-500/20 text-amber-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-transparent font-mono font-bold uppercase tracking-wider transition transform active:scale-95 cursor-pointer"
                          title="Melipatgandakan taruhan untuk membagi tepat satu kartu"
                        >
                          Double
                        </button>
                      </>
                    )}

                    {status === "RESOLUTION" && (
                      <button
                        onClick={startNextRound}
                        className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold uppercase tracking-wider transition transform active:scale-95 cursor-pointer shadow-md"
                      >
                        Main Lagi (New Round)
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
                <div className="flex items-center gap-2 font-cinzel">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">PANDUAN BLACKJACK</h3>
                </div>
                <button 
                  onClick={() => { soundEffects.playClick(); setShowRules(false); }}
                  className="text-stone-500 hover:text-amber-600 font-mono text-[11px] uppercase tracking-wider transition cursor-pointer"
                >
                  [tutup]
                </button>
              </div>

              <div className="space-y-4 text-xs text-stone-650 leading-relaxed font-serif italic text-left">
                <p>
                  Tujuan utama Anda adalah mendapatkan kombinasi kartu dengan total nilai sedekat mungkin ke angka <strong className="text-amber-650 not-italic font-bold">21</strong> tanpa melebihinya (Bust).
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 italic">
                  <li>Kartu berangka <strong className="text-stone-900 not-italic font-bold">2 - 10</strong> memiliki nilai sesuai nominal kartunya.</li>
                  <li>Kartu wajah (<strong className="text-stone-900 not-italic font-bold">J, Q, K</strong>) masing-masing bernilai <strong className="text-stone-900 not-italic font-bold">10</strong>.</li>
                  <li>Kartu Ace (<strong className="text-stone-900 not-italic font-bold">A</strong>) bernilai <strong className="text-stone-900 not-italic font-bold">11 atau 1</strong>, menyesuaikan keadaan tangan secara otomatis agar tidak Bust.</li>
                </ul>
                <h4 className="font-semibold text-stone-900 tracking-widest uppercase text-[10px] font-mono mt-4">PILIHAN TINDAKAN:</h4>
                <ul className="list-disc list-inside space-y-1 text-stone-600">
                  <li><strong>Hit:</strong> Menarik satu kartu tambahan dari dek sepatu.</li>
                  <li><strong>Stand:</strong> Menyelesaikan giliran dan tidak menambah kartu lagi.</li>
                  <li><strong>Double Down:</strong> Melipatgandakan nilai taruhan aktif Anda, menarik tepat <strong className="text-stone-900 not-italic font-bold">satu</strong> kartu tambahan, dan otomatis Stand.</li>
                </ul>
                <h4 className="font-semibold text-stone-900 tracking-widest uppercase text-[10px] font-mono mt-4">ATURAN DEALER:</h4>
                <p>
                  Dealer wajib menarik kartu terus menerus jika total nilainya di bawah <strong className="text-amber-650 not-italic font-bold">17</strong>, dan wajib bertahan (Stand) segera setelah bernilai <strong className="text-amber-650 not-italic font-bold">17 atau lebih</strong>.
                </p>
                <div className="bg-amber-500/[0.04] border border-amber-500/20 p-4 text-[11px] text-amber-800 leading-normal not-italic">
                  ⚡ <strong>Blackjack Perk:</strong> Mendapatkan langsung kombinasi kartu bernilai 21 di pembagian pertama bernilai <strong>Blackjack</strong>, memberikan bayaran fantastis <strong>3:2</strong>!
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
