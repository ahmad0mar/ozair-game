import { motion } from "framer-motion";

function Frame({ label, sub, children, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col items-center text-center"
    >
      <div
        className="relative w-56 h-56 md:w-64 md:h-64 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 flex items-center justify-center overflow-hidden"
        style={{ boxShadow: `0 0 40px ${accent}33` }}
      >
        {children}
        <div className="absolute top-3 left-3 text-[9px] tracking-[0.3em] text-white/40 font-display">
          📷 PICTURE
        </div>
      </div>
      <h3
        className="mt-5 font-display tracking-[0.2em] text-lg"
        style={{ color: accent }}
      >
        {label}
      </h3>
      <p className="text-white/55 text-sm mt-1 max-w-xs">{sub}</p>
    </motion.div>
  );
}

function Sun() {
  return (
    <div
      className="relative w-40 h-40 rounded-full"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #fff7d6, #ffd24a 35%, #ff8a1a 65%, #b04a00 100%)",
        animation: "glowPulse 4s ease-in-out infinite",
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,220,120,0.25) 0 6deg, transparent 6deg 12deg)",
          animation: "spin 30s linear infinite",
          opacity: 0.4,
        }}
      />
    </div>
  );
}

function BlackHole() {
  return (
    <div
      className="relative w-44 h-44 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: "rotateX(72deg)" }}
      >
        <div
          className="w-40 h-40 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #ff8a3c, #ffd27a, #ff5a2a, #ffd27a, #ff8a3c)",
            animation: "spin 6s linear infinite",
            filter: "blur(3px)",
          }}
        />
      </div>
      <div
        className="absolute w-24 h-24 rounded-full bg-black"
        style={{
          boxShadow: "0 0 40px 14px rgba(0,0,0,0.95), inset 0 0 24px #000",
        }}
      />
      <div
        className="absolute w-44 h-44 rounded-full border-2 border-amber-300/30"
        style={{ transform: "rotateX(72deg)" }}
      />
    </div>
  );
}

function MilkyWay() {
  return (
    <div className="relative w-44 h-44">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgba(180,160,255,0.55), transparent 60deg, rgba(200,180,255,0.45), transparent 140deg, rgba(160,200,255,0.5), transparent 220deg, rgba(220,200,255,0.45), transparent 300deg)",
          animation: "spin 22s linear infinite",
          maskImage: "radial-gradient(circle, black 25%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(circle, black 25%, transparent 68%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,250,235,0.95), rgba(220,200,255,0.4) 18%, transparent 42%)",
        }}
      />
    </div>
  );
}

function WhiteHole() {
  return (
    <div
      className="relative w-44 h-44 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: "rotateX(72deg)" }}
      >
        <div
          className="w-40 h-40 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #9bf6ff, #ffffff, #6ea8ff, #ffffff, #9bf6ff)",
            animation: "spin 5s linear infinite reverse",
            filter: "blur(3px)",
          }}
        />
      </div>
      <div
        className="absolute w-20 h-20 rounded-full"
        style={{
          background: "radial-gradient(circle, #ffffff, #cfe8ff 60%, transparent)",
          boxShadow: "0 0 50px 16px rgba(180,230,255,0.85)",
        }}
      />
    </div>
  );
}

const ITEMS = [
  {
    label: "THE SUN",
    sub: "Our star — a giant ball of hot plasma that lights and warms the planets.",
    accent: "#ffb84d",
    node: <Sun />,
  },
  {
    label: "BLACK HOLE",
    sub: "A region of spacetime where gravity is so strong not even light can escape.",
    accent: "#ff7a4d",
    node: <BlackHole />,
  },
  {
    label: "MILKY WAY",
    sub: "Our home galaxy — a vast spiral of hundreds of billions of stars.",
    accent: "#b48cff",
    node: <MilkyWay />,
  },
  {
    label: "WHITE HOLE",
    sub: "The theoretical opposite of a black hole — a region that expels matter and light.",
    accent: "#7fd3ff",
    node: <WhiteHole />,
  },
];

export default function CosmicGallery() {
  return (
    <section className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-amber-400/40 text-amber-300 text-[11px] tracking-[0.4em] font-display mb-4">
            ✦ COSMIC GALLERY ✦
          </div>
          <h2
            className="font-display text-4xl md:text-6xl font-black tracking-[0.08em]"
            style={{ textShadow: "0 0 30px rgba(255,200,120,0.4)" }}
          >
            THINGS IN OUR UNIVERSE
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            A picture book of the wonders out there — from our blazing Sun to a
            light-swallowing black hole and the spiral of the Milky Way.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {ITEMS.map((it) => (
            <Frame key={it.label} label={it.label} sub={it.sub} accent={it.accent}>
              {it.node}
            </Frame>
          ))}
        </div>
      </div>
    </section>
  );
}
