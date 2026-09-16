import {
  Satellite,
  Orbit,
  Flame,
  CircleDot,
  Waves,
  Crown,
  Telescope,
  Lock,
} from "lucide-react";

const ICONS = { Satellite, Orbit, Flame, CircleDot, Waves, Crown, Telescope };

export default function AchievementBadge({ ach, unlocked }) {
  const Icon = ICONS[ach.icon] || Telescope;
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-all ${
        unlocked
          ? "border-cyan-400/30 bg-cyan-400/10"
          : "border-white/10 bg-white/[0.02] opacity-55"
      }`}
    >
      <div className="shrink-0">
        {unlocked ? (
          <Icon className="w-5 h-5 text-cyan-300" />
        ) : (
          <Lock className="w-5 h-5 text-white/30" />
        )}
      </div>
      <div className="min-w-0">
        <div className="font-display text-[10px] tracking-[0.12em] text-white/85 truncate">
          {ach.name}
        </div>
        <div className="text-[10px] text-white/45 leading-snug">{ach.desc}</div>
      </div>
    </div>
  );
}
