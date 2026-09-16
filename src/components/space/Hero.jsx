import { motion } from "framer-motion";
import { ArrowDown, Rocket } from "lucide-react";
import { useGame } from "@/state/GameContext";
import sound from "@/utils/soundManager";

export default function Hero() {
  const game = useGame();
  const go = (id) => {
    sound.playClick();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {!game.started ? (
        <>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1 }}
            className="text-cyan-300/80 tracking-[0.4em] text-xs md:text-sm uppercase mb-6"
          >
            A Cinematic Journey
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.9, duration: 1.3, ease: "easeOut" }}
            className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-[0.18em] leading-none"
            style={{
              textShadow:
                "0 0 40px rgba(80,160,255,0.6), 0 0 80px rgba(120,80,255,0.35)",
            }}
          >
            SPACE EXPLORE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="mt-6 max-w-xl text-white/70 text-lg md:text-xl font-light"
          >
            Your mission begins here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-5 py-2.5"
          >
            <Rocket className="w-4 h-4 text-cyan-300" />
            <span className="font-display tracking-[0.25em] text-xs text-cyan-200">
              MISSION 01: LEAVE EARTH
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.3, duration: 0.7 }}
            onClick={game.beginLaunch}
            className="group mt-8 relative px-10 py-4 rounded-full font-display tracking-[0.2em] text-sm text-white overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{
              background:
                "linear-gradient(120deg, rgba(80,140,255,0.25), rgba(150,80,255,0.25))",
              border: "1px solid rgba(140,180,255,0.5)",
              boxShadow:
                "0 0 30px rgba(80,140,255,0.4), inset 0 0 20px rgba(140,180,255,0.15)",
            }}
          >
            <span className="relative z-10">[ START MISSION ]</span>
          </motion.button>
        </>
      ) : (
        <>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="font-display text-5xl md:text-7xl font-black tracking-[0.18em]"
            style={{ textShadow: "0 0 40px rgba(80,160,255,0.6)" }}
          >
            SPACE EXPLORE
          </motion.h1>
          <p className="mt-6 text-white/70 text-lg">
            Mission in progress —{" "}
            <span className="text-cyan-300 font-display">
              {game.discoveredCount}/8
            </span>{" "}
            planets discovered
          </p>
          <button
            onClick={() => go("#solar-system")}
            className="mt-10 px-8 py-4 rounded-full font-display tracking-[0.2em] text-sm text-white transition-transform hover:scale-105"
            style={{
              background:
                "linear-gradient(120deg, rgba(80,140,255,0.25), rgba(150,80,255,0.25))",
              border: "1px solid rgba(140,180,255,0.5)",
              boxShadow: "0 0 30px rgba(80,140,255,0.4)",
            }}
          >
            RETURN TO SOLAR SYSTEM
          </button>
        </>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8, duration: 1 }}
        onClick={() => go("#solar-system")}
        className="absolute bottom-8 flex flex-col items-center text-white/40 cursor-pointer"
      >
        <span className="text-[10px] tracking-[0.3em] mb-2">SCROLL</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
