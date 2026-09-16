import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ArrivalAnimation({ planet }) {
  const [step, setStep] = useState(0);
  const steps = [
    "INCOMING TRANSMISSION...",
    "DESTINATION LOCKED",
    planet.name,
    "MISSION AVAILABLE",
  ];

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i), i * 750)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center px-4"
        >
          {step < 2 ? (
            <div className="font-display tracking-[0.3em] text-cyan-300/90 text-sm md:text-base">
              {steps[step]}
            </div>
          ) : step === 2 ? (
            <div
              className="font-display text-3xl md:text-5xl font-black tracking-[0.1em]"
              style={{ textShadow: `0 0 40px ${planet.accent}aa` }}
            >
              {steps[step]}
            </div>
          ) : (
            <div className="font-display tracking-[0.3em] text-white/70 text-xs md:text-sm border border-white/20 rounded-full px-5 py-2 inline-block">
              {steps[step]}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
