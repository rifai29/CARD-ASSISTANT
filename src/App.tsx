import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Gamepad2, 
  Swords, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Play, 
  ChevronRight, 
  Award, 
  Coins, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Github
} from "lucide-react";
import BlackjackGame from "./components/BlackjackGame";
import DungeonCrawler from "./components/DungeonCrawler";
import { soundEffects } from "./audio";

type GameMode = "HUB" | "BLACKJACK" | "DUNGEON";

export default function App() {
  const [mode, setMode] = useState<GameMode>("HUB");
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.getMuteState());

  const selectMode = (newMode: GameMode) => {
    soundEffects.playClick();
    setMode(newMode);
  };

  const handleToggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    soundEffects.playClick();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200 grid-bg-dots">
      
      {/* SOPHISTICATED DECORATIVE CONCENTRIC CIRCLES (AETHERIC ARCHIVE STYLE) */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] border border-white/[0.02] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] border border-amber-500/5 rounded-full pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[200px] h-[200px] border border-white/[0.01] rounded-full pointer-events-none z-0"></div>

      {/* AMBER COSMIC GLOW ORNAMENTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-amber-500/[0.02] blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-indigo-500/[0.02] blur-[140px] pointer-events-none"></div>
      
      {/* NAVIGATION BAR HEADER */}
      <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Logo Brand / Aetheric style */}
          <button 
            onClick={() => selectMode("HUB")}
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-8 h-8 border border-amber-600/60 flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-305">
              <div className="w-4 h-4 bg-amber-600 rotate-45 group-hover:bg-amber-400"></div>
            </div>
            <div className="text-left font-cinzel">
              <span className="text-xs uppercase tracking-[0.4em] font-bold text-slate-100 block leading-none">Aetheric Hub</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-amber-500 block mt-1.5 font-sans font-medium">Card Archive</span>
            </div>
          </button>

          {/* Quick Header Toggles */}
          <div className="flex items-center gap-4">
            {mode !== "HUB" && (
              <button
                onClick={() => selectMode("HUB")}
                className="px-4 py-2 border border-amber-500/30 hover:border-amber-500 text-[10px] uppercase tracking-[0.15em] font-sans font-medium text-slate-300 hover:text-white bg-white/[0.02] rounded-none transition cursor-pointer"
              >
                Kembali ke Arsip
              </button>
            )}

            <button
              onClick={handleToggleMute}
              className="p-2 text-slate-400 hover:text-amber-500 bg-white/[0.02] border border-white/10 hover:border-amber-500/30 rounded-none transition cursor-pointer"
              title={isMuted ? "Suara Senyap" : "Aktifkan Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-mono text-white/50 bg-white/5 px-4 py-2 border border-white/10 select-none">
              Arbiter: v1.08
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col justify-center relative z-10">
        
        <AnimatePresence mode="wait">
          
          {/* STATE 1: WELCOME LANDING HUB MENU */}
          {mode === "HUB" && (
            <motion.div
              key="hub_screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12 py-4"
            >
              
              {/* HERO CHAMP BANNER */}
              <div className="text-center space-y-5 max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] uppercase tracking-[0.3em] font-mono font-medium mb-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sophisticated Card Collection</span>
                </motion.div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-cinzel font-light tracking-wide leading-tight text-white">
                  PILIH ARENA <br/>
                  <span className="font-serif italic font-normal text-amber-500 tracking-tight">Eteris Kosmik</span>
                </h1>
                
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-serif italic max-w-lg mx-auto opacity-80">
                  "Menembus kekosongan kosmos melalui penataan takdir di atas permukaan meja tarot kuno." Nikmati permainan Blackjack 21 presisi atau penjelajahan Dungeon Roguelike yang legendaris.
                </p>
              </div>

              {/* GAME MODE SELECTIONS GRIDS (2 COLUMNS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
                
                {/* BLACKJACK OPTION CARD */}
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group bg-[#0c0c0c] border border-amber-500/20 p-8 flex flex-col justify-between text-left shadow-[0_0_80px_rgba(245,158,11,0.02)] transition-all cursor-pointer overflow-hidden relative"
                  onClick={() => selectMode("BLACKJACK")}
                >
                  {/* Decorative Amber Corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-amber-500/50 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-amber-500/50 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="space-y-6">
                    <div className="text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Gamepad2 className="w-7 h-7" />
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 block font-bold font-sans">SEPUTU MEJA KASINO</span>
                      <h3 className="font-serif italic text-2xl text-white tracking-tight group-hover:text-amber-400 transition-colors">Blackjack Klasik 21</h3>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans opacity-75">
                        Seni murni dalam berhitung. Berdiri berhadapan dengan bandar dengan setumpuk sepatu berisikan 6 deck. Lakukan taruhan strategis, gandakan taruhan Anda dengan Double Down, dan pertahankan koin emas Anda.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[8px] uppercase tracking-wider font-mono text-slate-500">
                      <span className="bg-white/5 border border-white/5 px-2.5 py-1">6 DECK BAR</span>
                      <span className="bg-white/5 border border-white/5 px-2.5 py-1">PAYOUT 3:2</span>
                      <span className="bg-white/5 border border-white/5 px-2.5 py-1">CHIP AMBER</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-amber-500 group-hover:text-amber-400 transition-colors">
                    <span>Mulai Transaksi Meja</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition duration-150" />
                  </div>
                </motion.div>

                {/* DUNGEON RPG CRAWLER OPTION CARD */}
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group bg-[#0c0c0c] border border-amber-500/20 p-8 flex flex-col justify-between text-left shadow-[0_0_80px_rgba(239,68,68,0.01)] transition-all cursor-pointer overflow-hidden relative"
                  onClick={() => selectMode("DUNGEON")}
                >
                  {/* Decorative Rose Corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-rose-500/50 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-rose-500/50 opacity-40 group-hover:opacity-100 transition-opacity"></div>

                  <div className="space-y-6">
                    <div className="text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Swords className="w-7 h-7" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 block font-bold font-sans">CELestial crawl</span>
                      <h3 className="font-serif italic text-2xl text-white tracking-tight group-hover:text-rose-400 transition-colors">Dungeon Card Crawler</h3>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans opacity-75">
                        Kombinasi taktis Roguelike RPG di atas arena 3x3. Evaluasi ancaman monster, lengkapi persenjataan tajam dan perisai magis, telan elixir kehidupan darurat, kumpulkan emas, dan naikkan level karakter Anda.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[8px] uppercase tracking-wider font-mono text-slate-500">
                      <span className="bg-white/5 border border-white/5 px-2.5 py-1">GRID 3X3</span>
                      <span className="bg-white/5 border border-white/5 px-2.5 py-1">XP LEVEL UP</span>
                      <span className="bg-white/5 border border-white/5 px-2.5 py-1">KRONOLOGI MATRIKS</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-rose-500 group-hover:text-rose-400 transition-colors">
                    <span>Masuki Ruang Singularity</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition duration-150" />
                  </div>
                </motion.div>

              </div>

              {/* FOOTER VALUES STAT */}
              <div className="max-w-xl mx-auto pt-10 text-center border-t border-white/5 flex flex-wrap justify-center items-center gap-6 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500/70" />
                  <span>Sintetis Frekuensi Web Audio</span>
                </div>
                <span>//</span>
                <div>Sistem State Offline-safe (LocalStorage)</div>
                <span>//</span>
                <div>Edisi Terbatas Grand Arbiter</div>
              </div>

            </motion.div>
          )}

          {/* STATE 2: ACTIVE BLACKJACK SCREEN */}
          {mode === "BLACKJACK" && (
            <motion.div
              key="blackjack_active"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center px-2">
                <button
                  onClick={() => selectMode("HUB")}
                  className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  ← KEMBALI KE ARSIP UTAMA
                </button>
                <div className="text-[10px] uppercase tracking-widest text-[#d97706]/70 font-mono">
                  MEJA: <span className="text-[#d97706] font-bold">AETHER BLACKJACK</span>
                </div>
              </div>

              <BlackjackGame />
            </motion.div>
          )}

          {/* STATE 3: ACTIVE DUNGEON CRAWLER SCREEN */}
          {mode === "DUNGEON" && (
            <motion.div
              key="dungeon_active"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center px-2">
                <button
                  onClick={() => selectMode("HUB")}
                  className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  ← KEMBALI KE ARSIP UTAMA
                </button>
                <div className="text-[10px] uppercase tracking-widest text-rose-500/70 font-mono">
                  LOKASI: <span className="text-rose-400 font-bold">VOID DUNGEON CRAWL</span>
                </div>
              </div>

              <DungeonCrawler />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* GLOBAL FOOTER */}
      <footer className="py-8 border-t border-white/5 bg-[#050505] text-[9px] uppercase tracking-[0.2em] text-[#f3f4f6]/40 font-mono">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>AETHERIC ARCHIVE HUB © 2026 // SERIAL NO. 000492-AX</span>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#d97706] transition duration-150">CARA BERMAIN KASINO</span>
            <span>//</span>
            <span className="hover:text-white transition duration-150">GLOBAL COLLECTION</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
