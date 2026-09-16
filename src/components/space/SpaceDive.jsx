import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import SpaceDiveGame from "./SpaceDiveGame";

export default function SpaceDive({ planet, onExit }) {
  const v = planet.visual;
  const content = (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9999]">
      {/* cockpit + game */}
      <SpaceDiveGame planet={planet} onExit={onExit} />

      {/* fly-into-planet zoom */}
      <motion.div
        initial={{ scale: 0.2, opacity: 1 }}
        animate={{ scale: 7, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeIn" }}
        className="pointer-events-none absolute left-1/2 top-1/2 w-72 h-72 -ml-36 -mt-36 rounded-full"
        style={{ zIndex: 20, background: v.base, boxShadow: `0 0 90px ${v.glow}` }}
      />
      {/* entry flash */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ zIndex: 20 }}
      />
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : content;
}
