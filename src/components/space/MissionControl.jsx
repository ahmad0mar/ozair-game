import { useState } from "react";
import { useGame, ACHIEVEMENTS } from "@/state/GameContext";
import { Gauge, X, RotateCcw, ChevronDown } from "lucide-react";
import AchievementBadge from "./AchievementBadge";
import { planets } from "@/data/planets";
import sound from "@/utils/soundManager";

export default function MissionControl() {
  const game = useGame();
  const [open, setOpen] = useState(false);
  const active = planets.find((p) => p.id === game.activePlanet);
  const coreAch = ACHIEVEMENTS.filter((a) => !a.secret);
  const unlockedCore = coreAch.filter((a) => game.achievements.includes(a.id)).length;
  const secret = ACHIEVEMENTS.find((a) => a.secret);
  const secretUnlocked = game.achievements.includes(secret.id);
  const progressPct = Math.round((game.discoveredCount / 8) * 100);

  const toggle = () => {
    sound.playClick();
    setOpen((o) => !o);
  };

  const handleReset = () => {
    sound.playClick();
    game.resetGame();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => {
              sound.playClick();
              setOpen(false);
            }}
          />
          <div className="fixed md:absolute bottom-0 md:bottom-14 right-0 md:right-0 w-full md:w-96 p-4 md:p-0">
            <div className="rounded-2xl border border-white/15 bg-[#070912]/95 backdrop-blur-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display tracking-[0.2em] text-sm text-cyan-300">MISSION CONTROL</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setOpen(false);
                  }}
                  className="text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Current Mission</div>
                  <div className="text-white/90 font-display tracking-wide mt-0.5">
                    {active?.mission?.name || "Explore the solar system"}
                  </div>
                  <div className="text-white/50 text-xs mt-0.5">
                    {active?.mission?.objective || "Travel from the Sun to Neptune."}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">
                    <span>Progress</span>
                    <span>{game.discoveredCount}/8</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-violet-400"
                      style={{ width: progressPct + "%" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">XP</div>
                    <div className="text-white/90 font-display">{game.xp}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">Credits</div>
                    <div className="text-amber-200 font-display">{game.credits}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
                    <span>Achievements</span>
                    <span>
                      {unlockedCore}/{coreAch.length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {coreAch.map((a) => (
                      <AchievementBadge key={a.id} ach={a} unlocked={game.achievements.includes(a.id)} />
                    ))}
                    {secretUnlocked && <AchievementBadge ach={secret} unlocked={true} />}
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full mt-2 flex items-center justify-center gap-2 text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg py-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Mission
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <button
        onClick={toggle}
        className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#070912]/80 backdrop-blur-xl px-4 py-2.5 text-xs font-display tracking-[0.2em] text-white hover:border-cyan-400/60 transition-colors"
        style={{ boxShadow: "0 0 20px rgba(80,200,255,0.2)" }}
      >
        <Gauge className="w-4 h-4 text-cyan-300" />
        <span className="hidden sm:inline">MISSION CONTROL</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
