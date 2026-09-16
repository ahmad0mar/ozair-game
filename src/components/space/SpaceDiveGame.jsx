import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Crosshair, Rocket, Target } from "lucide-react";
import { useGame } from "@/state/GameContext";
import sound from "@/utils/soundManager";

/* ─── SHARED ─────────────────────────────────────────────── */
function ExitBtn({ onExit }) {
  return (
    <button
      onClick={() => {
        sound.playClick();
        onExit();
      }}
      className="absolute top-5 right-5 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-4 py-2 text-xs font-display tracking-[0.2em] text-white/80 hover:text-white hover:border-rose-400/50 hover:bg-rose-950/30 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
      title="Exit Space Dive (Esc)"
      aria-label="Exit Space Dive"
    >
      <X className="w-4 h-4 text-rose-400" /> EXIT
    </button>
  );
}

/* ─── MODE SELECT ─────────────────────────────────────────── */
function ModeSelect({ planet, onPick }) {
  const modes = [
    {
      id: "scan",
      icon: <Crosshair className="w-8 h-8" />,
      title: "SCAN MODE",
      sub: "Click glowing targets before time runs out. Chain combos for bonus points!",
      color: "#7fd3ff",
      glow: "rgba(127,211,255,0.35)",
    },
    {
      id: "shooter",
      icon: <Rocket className="w-8 h-8" />,
      title: "ASTEROID BLASTER",
      sub: "Fly your ship and destroy incoming asteroids. Don't let them reach you!",
      color: "#ff7a4d",
      glow: "rgba(255,122,77,0.35)",
    },
  ];

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="font-display text-xs tracking-[0.5em] mb-2 text-center"
          style={{ color: planet.accent }}
        >
          PLANET DIVE · {planet.name}
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-black tracking-[0.1em] text-center text-white">
          CHOOSE YOUR MISSION
        </h2>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-5 w-full max-w-2xl">
        {modes.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            onClick={() => {
              sound.playClick();
              sound.playWarp();
              onPick(m.id);
            }}
            className="flex-1 rounded-2xl border p-6 flex flex-col items-center gap-3 text-center transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{
              borderColor: m.color + "55",
              background: m.color + "12",
              boxShadow: `0 0 40px ${m.glow}`,
              color: m.color,
            }}
          >
            {m.icon}
            <div className="font-display text-lg tracking-[0.15em]">{m.title}</div>
            <p className="text-white/60 text-sm leading-relaxed">{m.sub}</p>
            <div
              className="mt-2 px-5 py-1.5 rounded-full text-xs font-display tracking-[0.2em] border"
              style={{ borderColor: m.color + "80", color: m.color }}
            >
              START →
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── SCAN MODE ───────────────────────────────────────────── */
function ScanMode({ planet, onComplete }) {
  const [targets, setTargets] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 8 + Math.random() * 84,
      y: 12 + Math.random() * 76,
      size: 20 + Math.random() * 26,
      pulse: Math.random() * 2,
    }))
  );
  const [hits, setHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState([]);
  const [floats, setFloats] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [done, setDone] = useState(false);
  const comboTimer = useRef(null);
  const total = 10;

  // Countdown timer
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          sound.playGameOver();
          setDone(true);
          return 0;
        }
        if (t <= 6) {
          sound.playCountdownTick();
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [done]);

  const hit = useCallback((t, e) => {
    setTargets((prev) => prev.filter((x) => x.id !== t.id));
    const newCombo = combo + 1;
    setCombo(newCombo);
    sound.playTargetHit(newCombo);
    if (newCombo >= 3 && newCombo % 2 === 1) {
      sound.playComboMilestone();
    }
    const pts = newCombo >= 3 ? newCombo * 15 : 10;
    setScore((s) => s + pts);
    setHits((h) => {
      if (h + 1 >= total) {
        sound.playVictory();
        setDone(true);
      }
      return h + 1;
    });

    // Spawn particles
    const id = Date.now();
    const burst = Array.from({ length: 6 }, (_, i) => ({
      id: id + i, x: t.x, y: t.y,
      angle: (i / 6) * 360,
      color: newCombo >= 3 ? "#facc15" : "#7fd3ff",
    }));
    setParticles((p) => [...p, ...burst]);
    setTimeout(() => setParticles((p) => p.filter((x) => x.id < id || x.id > id + 5)), 700);

    // Float score text
    const fid = id + 1000;
    setFloats((f) => [...f, { id: fid, x: t.x, y: t.y, text: newCombo >= 3 ? `x${newCombo} COMBO! +${pts}` : `+${pts}` }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== fid)), 900);

    // Reset combo timer
    clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 1200);
  }, [combo]);

  const success = hits >= total;
  const timerPct = (timeLeft / 30) * 100;

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* BG */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at 50% 50%, ${planet.visual.glow}, transparent 45%),
          radial-gradient(circle at 20% 30%, rgba(80,100,180,.18), transparent 40%)`,
      }} />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* HUD */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-3">
        <div className="rounded-xl border border-cyan-400/20 bg-black/50 px-4 py-2 backdrop-blur">
          <div className="font-display text-[10px] tracking-[0.25em] text-cyan-300">TARGETS</div>
          <div className="font-display text-2xl text-white">{hits}/{total}</div>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-black/50 px-4 py-2 backdrop-blur">
          <div className="font-display text-[10px] tracking-[0.25em] text-amber-300">SCORE</div>
          <div className="font-display text-2xl text-white">{score}</div>
        </div>
        {combo >= 2 && (
          <motion.div
            key={combo}
            initial={{ scale: 1.4, opacity: 1 }} animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl border border-yellow-400/40 bg-yellow-400/15 px-3 py-2"
          >
            <div className="font-display text-yellow-300 text-sm tracking-[0.2em]">🔥 x{combo} COMBO</div>
          </motion.div>
        )}
      </div>

      {/* Timer bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full transition-all"
          style={{
            width: timerPct + "%",
            background: timeLeft > 10 ? "#4ade80" : timeLeft > 5 ? "#facc15" : "#f87171",
          }}
          animate={{ width: timerPct + "%" }}
        />
      </div>
      <div className="absolute top-3 right-20 z-20 font-display text-xs tracking-[0.3em] text-white/60">
        {timeLeft}s
      </div>

      {/* Targets */}
      {!done && targets.map((t) => (
        <motion.button
          key={t.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.5 + t.pulse, repeat: Infinity }}
          onClick={(e) => hit(t, e)}
          className="absolute rounded-full border-2 border-cyan-300/80 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-300/25 hover:border-cyan-200 transition-colors"
          style={{
            left: `${t.x}%`, top: `${t.y}%`,
            width: t.size, height: t.size,
            transform: "translate(-50%,-50%)",
            boxShadow: `0 0 ${t.size}px rgba(100,220,255,0.5)`,
          }}
        >
          <Crosshair className="w-full h-full p-1" />
        </motion.button>
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <motion.div key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: Math.cos((p.angle * Math.PI) / 180) * 40, y: Math.sin((p.angle * Math.PI) / 180) * 40, scale: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.color, boxShadow: `0 0 8px ${p.color}` }}
        />
      ))}

      {/* Float scores */}
      {floats.map((f) => (
        <motion.div key={f.id}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.9 }}
          className="absolute font-display text-sm text-yellow-300 pointer-events-none whitespace-nowrap"
          style={{ left: `${f.x}%`, top: `${f.y}%`, transform: "translate(-50%,-100%)" }}
        >
          {f.text}
        </motion.div>
      ))}

      {/* Done overlay */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="text-center px-6">
              <div className="text-5xl mb-4">{success ? "🎯" : "⏱️"}</div>
              <div className="font-display text-3xl font-black tracking-[0.1em] text-white mb-2">
                {success ? "MISSION COMPLETE!" : "TIME'S UP!"}
              </div>
              <div className="text-white/60 mb-2">Score: <span className="text-cyan-300 font-display text-xl">{score}</span></div>
              <div className="text-white/60 mb-6">Targets: <span className="text-cyan-300 font-display">{hits}/{total}</span></div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    sound.playClick();
                    onComplete(success);
                  }}
                  className="px-6 py-3 rounded-full font-display tracking-[0.2em] text-xs border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 cursor-pointer transition-all"
                >
                  {success ? "COMPLETE DIVE ✓" : "TRY AGAIN"}
                </button>
                {!success && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onComplete(false);
                    }}
                    className="px-6 py-3 rounded-full font-display tracking-[0.2em] text-xs border border-rose-400/40 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20 cursor-pointer transition-all"
                  >
                    EXIT
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ExitBtn onExit={() => onComplete(false)} />
    </div>
  );
}

/* ─── ASTEROID SHOOTER MODE ───────────────────────────────── */
function ShooterMode({ planet, onComplete }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    ship: { x: 0.5, y: 0.88 },
    bullets: [],
    asteroids: [],
    particles: [],
    score: 0,
    lives: 3,
    wave: 0,
    spawnTimer: 0,
    over: false,
    win: false,
    keys: {},
    lastTime: 0,
    targetScore: 300,
  });
  const [ui, setUi] = useState({ score: 0, lives: 3, over: false, win: false });
  const [restartKey, setRestartKey] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      s.ship.x = 0.5;
    };
    resize();
    window.addEventListener("resize", resize);

    // Touch / mouse move for ship
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      s.ship.x = Math.max(0.05, Math.min(0.95, cx / canvas.width));
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });

    // Tap/click to shoot
    const onShoot = () => {
      if (s.over) return;
      s.bullets.push({ x: s.ship.x, y: s.ship.y - 0.04, vy: -0.018 });
      sound.playLaser();
    };
    canvas.addEventListener("click", onShoot);
    canvas.addEventListener("touchstart", onShoot, { passive: true });

    // Keyboard
    const onKey = (e) => { s.keys[e.code] = e.type === "keydown"; };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    // Auto-shoot interval
    // Reset state on restart
    s.bullets = []; s.asteroids = []; s.particles = [];
    s.score = 0; s.lives = 3; s.wave = 0; s.over = false; s.win = false; s.spawnTimer = 0;
    s.ship.x = 0.5;
    setUi({ score: 0, lives: 3, over: false, win: false });

    const autoShoot = setInterval(() => {
      if (!s.over) {
        s.bullets.push({ x: s.ship.x, y: s.ship.y - 0.04, vy: -0.018 });
        sound.playLaser();
      }
    }, 320);

    const accentHex = planet.accent;
    const glowColor = planet.visual.glow;

    function spawnAsteroid(w, h) {
      const x = 0.05 + Math.random() * 0.9;
      const size = (18 + Math.random() * 22) / w;
      const speed = 0.003 + Math.random() * 0.004 + s.wave * 0.0008;
      s.asteroids.push({ x, y: -0.05, vy: speed, size, r: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.06 });
    }

    function explode(x, y, color, n = 8) {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        s.particles.push({
          x, y,
          vx: Math.cos(a) * (0.004 + Math.random() * 0.006),
          vy: Math.sin(a) * (0.004 + Math.random() * 0.006),
          life: 1, color, size: 3 + Math.random() * 3,
        });
      }
    }

    function drawShip(ctx, x, y, w, h) {
      const sx = x * w, sy = y * h;
      ctx.save();
      ctx.translate(sx, sy);
      // body
      ctx.fillStyle = "#d0e8ff";
      ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(10, 8); ctx.lineTo(-10, 8); ctx.closePath(); ctx.fill();
      // window
      ctx.fillStyle = accentHex;
      ctx.beginPath(); ctx.arc(0, -4, 5, 0, Math.PI * 2); ctx.fill();
      // thrusters
      ctx.fillStyle = "#ff9d3c";
      ctx.globalAlpha = 0.7 + Math.random() * 0.3;
      ctx.beginPath(); ctx.moveTo(-7, 9); ctx.lineTo(-4, 9); ctx.lineTo(-5, 18 + Math.random() * 6); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(7, 9); ctx.lineTo(4, 9); ctx.lineTo(5, 18 + Math.random() * 6); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function loop(ts) {
      const dt = Math.min(ts - s.lastTime, 50);
      s.lastTime = ts;
      const w = canvas.width, h = canvas.height;

      // Keyboard ship control
      if (s.keys["ArrowLeft"] || s.keys["KeyA"]) s.ship.x = Math.max(0.05, s.ship.x - 0.012);
      if (s.keys["ArrowRight"] || s.keys["KeyD"]) s.ship.x = Math.min(0.95, s.ship.x + 0.012);

      // Clear
      ctx.clearRect(0, 0, w, h);

      // BG
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      grad.addColorStop(0, "rgba(10,12,30,0.9)");
      grad.addColorStop(1, "#020308");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (!s.over) {
        // Spawn
        s.spawnTimer += dt;
        const spawnInterval = Math.max(800, 2000 - s.wave * 150);
        if (s.spawnTimer > spawnInterval) { spawnAsteroid(w, h); s.spawnTimer = 0; s.wave = Math.floor(s.score / 100); }

        // Move bullets
        s.bullets = s.bullets.filter((b) => b.y > -0.05);
        s.bullets.forEach((b) => { b.y += b.vy; });

        // Move asteroids
        s.asteroids.forEach((a) => { a.y += a.vy; a.r += a.spin; });

        // Collision: bullet vs asteroid
        s.bullets = s.bullets.filter((b) => {
          let hit = false;
          s.asteroids = s.asteroids.filter((a) => {
            const dx = (b.x - a.x) * w, dy = (b.y - a.y) * h;
            if (Math.sqrt(dx * dx + dy * dy) < a.size * w + 4) {
              explode(a.x, a.y, "#7fd3ff");
              sound.playExplosion("medium");
              s.score += 10;
              hit = true;
              return false;
            }
            return true;
          });
          return !hit;
        });

        // Asteroid off-screen or hits ship
        s.asteroids = s.asteroids.filter((a) => {
          if (a.y > 1.05) {
            s.lives--;
            if (s.lives <= 0) {
              s.over = true;
              sound.playGameOver();
            } else {
              sound.playShipHit();
            }
            return false;
          }
          const dx = (a.x - s.ship.x) * w, dy = (a.y - s.ship.y) * h;
          if (Math.sqrt(dx * dx + dy * dy) < a.size * w + 12) {
            explode(s.ship.x, s.ship.y, "#ff7a4d", 14);
            sound.playShipHit();
            s.lives--;
            if (s.lives <= 0) {
              s.over = true;
              sound.playGameOver();
            }
            return false;
          }
          return true;
        });

        if (s.score >= s.targetScore && !s.win) {
          s.win = true;
          s.over = true;
          sound.playVictory();
        }
      }

      // Particles
      s.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life -= 0.04; });
      s.particles = s.particles.filter((p) => p.life > 0);

      // Draw asteroids
      s.asteroids.forEach((a) => {
        ctx.save();
        ctx.translate(a.x * w, a.y * h);
        ctx.rotate(a.r);
        const sz = a.size * w;
        ctx.fillStyle = "#7a6a5a";
        ctx.strokeStyle = "#c0a888";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 7; i++) {
          const ang = (i / 7) * Math.PI * 2;
          const r = sz * (0.75 + Math.sin(i * 2.3 + a.r) * 0.25);
          i === 0 ? ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r) : ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      });

      // Draw bullets
      s.bullets.forEach((b) => {
        ctx.save();
        ctx.fillStyle = accentHex;
        ctx.shadowColor = accentHex;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(b.x * w - 2, b.y * h - 10, 4, 12, 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw particles
      s.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw ship
      drawShip(ctx, s.ship.x, s.ship.y, w, h);

      setUi({ score: s.score, lives: s.lives, over: s.over, win: s.win });
      if (!s.over) rafRef.current = requestAnimationFrame(loop);
    }

    s.lastTime = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      s.over = true;
      cancelAnimationFrame(rafRef.current);
      clearInterval(autoShoot);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("click", onShoot);
      canvas.removeEventListener("touchstart", onShoot);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planet, restartKey]);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none cursor-none" />

      {/* HUD overlay */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-3 pointer-events-none">
        <div className="rounded-xl border border-amber-400/20 bg-black/60 px-3 py-2 backdrop-blur">
          <div className="font-display text-[10px] tracking-[0.2em] text-amber-300">SCORE</div>
          <div className="font-display text-xl text-white">{ui.score}<span className="text-white/30 text-xs">/{stateRef.current.targetScore}</span></div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`text-lg ${i < ui.lives ? "text-red-400" : "text-white/15"}`}>♥</div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <div className="font-display text-[10px] tracking-[0.2em] text-white/30">MOVE MOUSE · CLICK TO SHOOT · ARROWS / WASD</div>
      </div>

      {/* Game Over */}
      <AnimatePresence>
        {ui.over && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          >
            <div className="text-center px-6">
              <div className="text-5xl mb-4">{ui.win ? "🚀" : "💥"}</div>
              <div className="font-display text-3xl font-black tracking-[0.1em] text-white mb-2">
                {ui.win ? "SECTOR CLEAR!" : "SHIP DESTROYED"}
              </div>
              <div className="text-white/60 mb-6">Score: <span className="text-amber-300 font-display text-xl">{ui.score}</span></div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    sound.playClick();
                    setRestartKey((k) => k + 1);
                  }}
                  className="px-6 py-3 rounded-full font-display tracking-[0.2em] text-xs border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
                >
                  RETRY
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onComplete(ui.win);
                  }}
                  className={`px-6 py-3 rounded-full font-display tracking-[0.2em] text-xs border cursor-pointer transition-all ${
                    ui.win
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                      : "border-rose-400/40 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"
                  }`}
                >
                  {ui.win ? "COMPLETE DIVE ✓" : "EXIT"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ExitBtn onExit={() => onComplete(false)} />
    </div>
  );
}

/* ─── ROOT COMPONENT ──────────────────────────────────────── */
export default function SpaceDiveGame({ planet, onExit }) {
  const game = useGame();
  const [mode, setMode] = useState(null);

  const handleComplete = useCallback((success) => {
    if (success) game.completeScan(planet);
    onExit();
  }, [game, planet, onExit]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        sound.playClick();
        onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit]);

  return (
    <div className="absolute inset-0 z-10 bg-[#02030a] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {!mode && (
          <motion.div key="select" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* BG */}
            <div className="absolute inset-0" style={{
              background: `radial-gradient(circle at 50% 50%, ${planet.visual.glow}, transparent 55%)`,
            }} />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:40px_40px]" />
            <ModeSelect planet={planet} onPick={setMode} />
            <ExitBtn onExit={onExit} />
          </motion.div>
        )}

        {mode === "scan" && (
          <motion.div key="scan" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScanMode planet={planet} onComplete={handleComplete} />
          </motion.div>
        )}

        {mode === "shooter" && (
          <motion.div key="shooter" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ShooterMode planet={planet} onComplete={handleComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
