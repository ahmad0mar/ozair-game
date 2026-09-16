import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PlanetVisual from "./PlanetVisual";
import ArrivalAnimation from "./ArrivalAnimation";
import ScanBeam from "./ScanBeam";
import PlanetMission from "./PlanetMission";
import SpaceDive from "./SpaceDive";
import MoonsOrbit from "./MoonsOrbit";
import { useGame } from "@/state/GameContext";
import sound from "@/utils/soundManager";

export default function PlanetSection({ planet, index }) {
  const ref = useRef(null);
  const [size, setSize] = useState(440);
  const game = useGame();
  const [showArrival, setShowArrival] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanPct, setScanPct] = useState(0);
  const [spotPulse, setSpotPulse] = useState(false);
  const [diving, setDiving] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSize(w < 640 ? 260 : w < 1024 ? 320 : 440);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1, 0.92]);
  const planetOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.85, 1],
    [0, 1, 1, 0.2]
  );

  const reverse = index % 2 === 1;
  const isScanned = game.scanned.includes(planet.id);
  const factsOpen = game.revealedFacts.includes(planet.id);
  const dataOpen = game.revealedData.includes(planet.id);

  const handleEnter = () => {
    game.setActivePlanet(planet.id);
    if (game.arrived.includes(planet.id)) return;
    game.markArrived(planet.id);
    setShowArrival(true);
    setTimeout(() => setShowArrival(false), 3200);
  };

  const startScan = () => {
    if (isScanned || scanning) return;
    sound.playScanBeam();
    setScanning(true);
    setScanPct(0);
    const start = performance.now();
    const dur = 2000;
    const tick = (now) => {
      const p = Math.min(100, ((now - start) / dur) * 100);
      setScanPct(p);
      if (p < 100) {
        requestAnimationFrame(tick);
      } else {
        setScanning(false);
        game.completeScan(planet);
      }
    };
    requestAnimationFrame(tick);
  };

  const onSpotClick = () => {
    if (planet.id !== "jupiter") return;
    setSpotPulse(true);
    setTimeout(() => setSpotPulse(false), 600);
    game.findEasterEgg("great_red_spot", {
      xp: 0,
      credits: 75,
      message:
        "You pinpointed the Great Red Spot — a storm larger than Earth! +75 credits",
    });
  };

  const onMoonClick = () =>
    game.findEasterEgg("moon", {
      xp: 0,
      credits: 50,
      message: "The Moon drifts ~3.8 cm away from Earth each year. +50 credits",
    });

  return (
    <section
      ref={ref}
      id={planet.id}
      className="relative min-h-screen flex items-center justify-center py-28 px-6"
    >
      <motion.div
        onViewportEnter={handleEnter}
        viewport={{ amount: 0.4 }}
        className="max-w-6xl w-full mx-auto grid gap-12 md:gap-16 items-center grid-cols-1 md:grid-cols-2"
      >
        {/* Planet visual side */}
        <motion.div
          style={{ y, scale, opacity: planetOpacity }}
          className={`flex justify-center order-1 ${
            reverse ? "md:order-2" : "md:order-1"
          }`}
        >
          <div className="relative" style={{ width: size, height: size }}>
            <PlanetVisual
              planet={planet}
              size={size}
              onSpotClick={planet.id === "jupiter" ? onSpotClick : undefined}
              spotFlash={spotPulse}
            />
            <MoonsOrbit planet={planet} planetSize={size} />
            {showArrival && <ArrivalAnimation planet={planet} />}
            {scanning && <ScanBeam pct={scanPct} />}
            {planet.id === "earth" && (
              <button
                onClick={onMoonClick}
                aria-label="Moon"
                className="absolute -right-1 top-8 w-5 h-5 rounded-full hover:scale-125 transition-transform"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #f0f0f0, #9a9a9a)",
                  boxShadow: "0 0 12px rgba(255,255,255,0.5)",
                }}
              />
            )}
          </div>
        </motion.div>

        {/* Planet info side */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`order-2 ${reverse ? "md:order-1" : "md:order-2"}`}
        >
          <PlanetMission
            planet={planet}
            index={index}
            isScanned={isScanned}
            scanning={scanning}
            scanPct={scanPct}
            factsOpen={factsOpen}
            dataOpen={dataOpen}
            onScan={startScan}
            onFacts={() => game.revealFacts(planet.id)}
            onData={() => game.revealData(planet.id)}
            onDive={() => {
              sound.playWarp();
              setDiving(true);
            }}
          />
        </motion.div>
      </motion.div>

      {diving && (
        <SpaceDive planet={planet} onExit={() => setDiving(false)} />
      )}
    </section>
  );
}
