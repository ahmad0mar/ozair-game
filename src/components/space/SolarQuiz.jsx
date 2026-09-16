import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import sound from "@/utils/soundManager";

const QUESTIONS = {
  easy: [
    { q: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], a: 1 },
    { q: "What is the largest planet in our solar system?", options: ["Saturn", "Neptune", "Jupiter", "Earth"], a: 2 },
    { q: "Which planet do we live on?", options: ["Mars", "Earth", "Venus", "Mercury"], a: 1 },
    { q: "What is the Sun mainly made of?", options: ["Rock", "Gas — hydrogen and helium", "Water", "Iron"], a: 1 },
  ],
  medium: [
    { q: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Mercury"], a: 2 },
    { q: "Which planet is famous for its bright rings?", options: ["Uranus", "Saturn", "Neptune", "Mars"], a: 1 },
    { q: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], a: 1 },
    { q: "Which planet is the hottest?", options: ["Mercury", "Venus", "Mars", "Jupiter"], a: 1 },
  ],
  hard: [
    { q: "Which planet rotates on its side at about a 98° tilt?", options: ["Neptune", "Uranus", "Saturn", "Mars"], a: 1 },
    { q: "Olympus Mons, the largest known volcano, is on which planet?", options: ["Venus", "Mars", "Mercury", "Earth"], a: 1 },
    { q: "Which planet has the fastest winds, over 2,000 km/h?", options: ["Jupiter", "Saturn", "Neptune", "Uranus"], a: 2 },
    { q: "Pluto is officially classified as a…", options: ["Planet", "Moon", "Dwarf planet", "Asteroid"], a: 2 },
  ],
};

const LEVELS = [
  { id: "easy", label: "EASY", color: "#4ade80" },
  { id: "medium", label: "MEDIUM", color: "#facc15" },
  { id: "hard", label: "HARD", color: "#f87171" },
];

export default function SolarQuiz() {
  const [level, setLevel] = useState("easy");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const qs = QUESTIONS[level];
  const total = qs.length;
  const cur = qs[idx];
  const answered = picked !== null;

  const choose = (i) => {
    if (answered) return;
    setPicked(i);
    if (i === cur.a) {
      sound.playQuizCorrect();
      setScore((s) => s + 1);
    } else {
      sound.playQuizWrong();
    }
  };

  const next = () => {
    sound.playClick();
    if (idx + 1 >= total) {
      sound.playAchievement();
      setDone(true);
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    sound.playClick();
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const changeLevel = (l) => {
    sound.playClick();
    setLevel(l);
    restart();
  };

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-400/40 text-cyan-300 text-[11px] tracking-[0.4em] font-display mb-4">
            ◇ SOLAR QUIZ ◇
          </div>
          <h2
            className="font-display text-4xl md:text-6xl font-black tracking-[0.08em]"
            style={{ textShadow: "0 0 30px rgba(80,200,255,0.5)" }}
          >
            TEST YOUR KNOWLEDGE
          </h2>
          <p className="text-white/60 mt-4">Pick a difficulty and answer questions about the planets.</p>
        </motion.div>

        <div className="mt-8 flex justify-center gap-3">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => changeLevel(l.id)}
              className="px-5 py-2 rounded-full text-[11px] font-display tracking-[0.2em] border transition-all"
              style={{
                borderColor: level === l.id ? l.color : "rgba(255,255,255,0.15)",
                color: level === l.id ? "#03040a" : "rgba(255,255,255,0.8)",
                background: level === l.id ? l.color : "transparent",
                boxShadow: level === l.id ? `0 0 20px ${l.color}66` : "none",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.03] backdrop-blur-md p-6 md:p-8 min-h-[260px]">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-6"
              >
                <Trophy className="w-12 h-12 text-amber-300" style={{ filter: "drop-shadow(0 0 14px rgba(250,200,80,0.6))" }} />
                <h3 className="font-display text-3xl mt-4 tracking-[0.1em]">QUIZ COMPLETE</h3>
                <p className="text-white/70 mt-2 text-lg">
                  You scored <span className="text-cyan-300 font-display">{score}</span> / {total}
                </p>
                <div className="mt-3 w-40 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${(score / total) * 100}%` }} />
                </div>
                <button
                  onClick={restart}
                  className="mt-6 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-6 py-3 text-xs font-display tracking-[0.2em] hover:bg-cyan-400/20"
                >
                  <RotateCcw className="w-4 h-4" /> TRY AGAIN
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${level}-${idx}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="flex items-center justify-between text-[10px] tracking-[0.3em] text-white/45 font-display">
                  <span>QUESTION {idx + 1} / {total}</span>
                  <span>SCORE {score}</span>
                </div>
                <h3 className="mt-4 text-xl md:text-2xl font-display tracking-wide leading-snug">{cur.q}</h3>
                <div className="mt-5 grid gap-3">
                  {cur.options.map((opt, i) => {
                    const correct = i === cur.a;
                    const isPicked = i === picked;
                    let style = "border-white/12 bg-white/[0.03] hover:bg-white/[0.07]";
                    if (answered) {
                      if (correct) style = "border-emerald-400/60 bg-emerald-400/15";
                      else if (isPicked) style = "border-rose-400/60 bg-rose-400/15";
                      else style = "border-white/8 bg-white/[0.02] opacity-60";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => choose(i)}
                        disabled={answered}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${style}`}
                      >
                        <span>{opt}</span>
                        {answered && correct && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {answered && isPicked && !correct && <XCircle className="w-5 h-5 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <button
                    onClick={next}
                    className="mt-6 w-full rounded-full bg-cyan-400/15 border border-cyan-400/40 py-3 text-xs font-display tracking-[0.2em] hover:bg-cyan-400/25"
                  >
                    {idx + 1 >= total ? "FINISH" : "NEXT QUESTION →"}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
