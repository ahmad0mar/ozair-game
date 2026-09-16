import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import sound from "@/utils/soundManager";

const LEVEL_STEP = 500;

export const ACHIEVEMENTS = [
  { id: "first_contact", icon: "Satellite", name: "First Contact", desc: "Discover your first planet." },
  { id: "solar_explorer", icon: "Orbit", name: "Solar Explorer", desc: "Discover 4 planets." },
  { id: "giant_hunter", icon: "Flame", name: "Giant Hunter", desc: "Discover Jupiter." },
  { id: "ring_master", icon: "CircleDot", name: "Ring Master", desc: "Discover Saturn." },
  { id: "edge_of_system", icon: "Waves", name: "Edge of the System", desc: "Reach Neptune." },
  { id: "master_explorer", icon: "Crown", name: "Master Explorer", desc: "Discover all 8 planets." },
  { id: "cosmic_detective", icon: "Telescope", name: "Cosmic Detective", desc: "Find all hidden objects.", secret: true },
];

export const EASTER_EGGS = ["shooting_star", "ufo", "moon", "great_red_spot", "spaceman"];

const SAVE_KEY = "space-explore-save";

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const saved = load();
  const [started, setStarted] = useState(saved?.started ?? false);
  const [launching, setLaunching] = useState(false);
  const [xp, setXp] = useState(saved?.xp ?? 0);
  const [credits, setCredits] = useState(saved?.credits ?? 0);
  const [arrived, setArrived] = useState(saved?.arrived ?? []);
  const [scanned, setScanned] = useState(saved?.scanned ?? []);
  const [revealedFacts, setRevealedFacts] = useState(saved?.revealedFacts ?? []);
  const [revealedData, setRevealedData] = useState(saved?.revealedData ?? []);
  const [achievements, setAchievements] = useState(saved?.achievements ?? []);
  const [easterEggs, setEasterEggs] = useState(saved?.easterEggs ?? []);
  const [activePlanet, setActivePlanet] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({ started, xp, credits, arrived, scanned, revealedFacts, revealedData, achievements, easterEggs })
    );
  }, [started, xp, credits, arrived, scanned, revealedFacts, revealedData, achievements, easterEggs]);

  const pushToast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3800);
  }, []);

  const addXp = useCallback((n) => {
    setXp((prevXp) => {
      const newXp = prevXp + n;
      const oldLevel = Math.floor(prevXp / LEVEL_STEP) + 1;
      const newLevel = Math.floor(newXp / LEVEL_STEP) + 1;
      if (newLevel > oldLevel) {
        sound.playLevelUp();
      }
      return newXp;
    });
  }, []);

  const addCredits = useCallback((n) => setCredits((c) => c + n), []);

  const unlockAchievement = useCallback(
    (id) => {
      setAchievements((prev) => {
        if (prev.includes(id)) return prev;
        const ach = ACHIEVEMENTS.find((a) => a.id === id);
        if (ach) {
          sound.playAchievement();
          pushToast({ icon: "🏆", title: "ACHIEVEMENT UNLOCKED", subtitle: ach.name });
        }
        return [...prev, id];
      });
    },
    [pushToast]
  );

  const checkAchievements = useCallback(
    (scannedList) => {
      if (scannedList.length >= 1) unlockAchievement("first_contact");
      if (scannedList.length >= 4) unlockAchievement("solar_explorer");
      if (scannedList.includes("jupiter")) unlockAchievement("giant_hunter");
      if (scannedList.includes("saturn")) unlockAchievement("ring_master");
      if (scannedList.includes("neptune")) unlockAchievement("edge_of_system");
      if (scannedList.length >= 8) unlockAchievement("master_explorer");
    },
    [unlockAchievement]
  );

  const completeScan = useCallback(
    (planet) => {
      setScanned((prev) => {
        if (prev.includes(planet.id)) return prev;
        const next = [...prev, planet.id];
        sound.playVictory();
        addXp(planet.mission.reward);
        addCredits(100);
        pushToast({ icon: "🛰️", title: "MISSION COMPLETE", subtitle: `${planet.name} · +${planet.mission.reward} XP` });
        pushToast({ icon: "🌍", title: "PLANET DISCOVERED", subtitle: planet.name });
        checkAchievements(next);
        return next;
      });
    },
    [addXp, addCredits, pushToast, checkAchievements]
  );

  const revealFacts = useCallback(
    (id) => {
      setRevealedFacts((prev) => {
        if (prev.includes(id)) return prev;
        sound.playDecrypt();
        addCredits(10);
        pushToast({ icon: "📖", title: "FACTS DECRYPTED", subtitle: "+10 credits" });
        return [...prev, id];
      });
    },
    [addCredits, pushToast]
  );

  const revealData = useCallback(
    (id) => {
      setRevealedData((prev) => {
        if (prev.includes(id)) return prev;
        sound.playTelemetry();
        addCredits(10);
        pushToast({ icon: "📊", title: "TELEMETRY UNLOCKED", subtitle: "+10 credits" });
        return [...prev, id];
      });
    },
    [addCredits, pushToast]
  );

  const markArrived = useCallback((id) => {
    setArrived((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const findEasterEgg = useCallback(
    (id, reward = {}) => {
      setEasterEggs((prev) => {
        if (prev.includes(id)) return prev;
        sound.playEasterEgg();
        if (reward.xp) addXp(reward.xp);
        if (reward.credits) addCredits(reward.credits);
        pushToast({
          icon: "✨",
          title: reward.xp ? `+${reward.xp} XP` : "HIDDEN DISCOVERY",
          subtitle: reward.message || "You found a secret!",
        });
        const next = [...prev, id];
        if (EASTER_EGGS.every((e) => next.includes(e))) unlockAchievement("cosmic_detective");
        return next;
      });
    },
    [addXp, addCredits, pushToast, unlockAchievement]
  );

  const beginLaunch = useCallback(() => {
    sound.playLaunch();
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      setStarted(true);
      document.querySelector("#solar-system")?.scrollIntoView({ behavior: "smooth" });
    }, 2600);
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setStarted(false);
    setXp(0);
    setCredits(0);
    setArrived([]);
    setScanned([]);
    setRevealedFacts([]);
    setRevealedData([]);
    setAchievements([]);
    setEasterEggs([]);
    setActivePlanet(null);
  }, []);

  const level = Math.floor(xp / LEVEL_STEP) + 1;
  const intoLevel = xp % LEVEL_STEP;

  const value = {
    started, launching, xp, credits, level, intoLevel, levelMax: LEVEL_STEP,
    arrived, scanned, discoveredCount: scanned.length, revealedFacts, revealedData,
    achievements, easterEggs, activePlanet, toasts,
    setActivePlanet, markArrived, completeScan, revealFacts, revealData,
    findEasterEgg, unlockAchievement, beginLaunch, resetGame, pushToast,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
