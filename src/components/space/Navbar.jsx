import { useEffect, useState } from "react";
import { Menu, X, Rocket, Volume2, VolumeX, Radio } from "lucide-react";
import sound from "@/utils/soundManager";

const links = [
  { label: "Home", href: "#home" },
  { label: "Solar System", href: "#solar-system" },
  { label: "Planets", href: "#planets" },
  { label: "Universe", href: "#universe" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [audioState, setAudioState] = useState({
    muted: sound.muted,
    ambientEnabled: sound.ambientEnabled,
  });

  useEffect(() => {
    return sound.subscribe(setAudioState);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    sound.playClick();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSound = () => {
    sound.playClick();
    sound.toggleMute();
  };

  const toggleAmbient = () => {
    sound.playClick();
    sound.toggleAmbient();
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-[#05060c]/75 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => go("#home")}
          className="flex items-center gap-2 font-display tracking-[0.25em] text-sm text-white"
        >
          <Rocket className="w-4 h-4 text-cyan-300" /> SPACE EXPLORE
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-sm text-white/70 hover:text-white transition-colors tracking-wide"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAmbient}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-display tracking-[0.15em] transition-all ${
              audioState.ambientEnabled && !audioState.muted
                ? "border-violet-400/50 bg-violet-400/15 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.3)]"
                : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white/80"
            }`}
            title={
              audioState.ambientEnabled
                ? "Turn off Ambient Cosmic Drone"
                : "Turn on Ambient Cosmic Drone"
            }
          >
            <Radio className="w-3 h-3 text-violet-300" />
            <span className="hidden sm:inline">AMBIENT</span>
          </button>

          <button
            onClick={toggleSound}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-display tracking-[0.15em] text-white/80 hover:text-white hover:border-cyan-400/40 transition-all"
            title={audioState.muted ? "Unmute Audio" : "Mute Audio"}
          >
            {audioState.muted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
            )}
            <span className="hidden sm:inline">
              {audioState.muted ? "MUTED" : "SOUND"}
            </span>
            {!audioState.muted && (
              <span className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-2.5 bg-cyan-400 rounded-full animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-150" />
              </span>
            )}
          </button>

          <button
            className="md:hidden text-white ml-2"
            onClick={() => {
              sound.playClick();
              setOpen((o) => !o);
            }}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#05060c]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-left text-white/80 hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
