import { useEffect, useState } from "react";
import { useGame } from "@/state/GameContext";

export default function ShootingStar() {
  const game = useGame();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2800);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  const handleClick = () => {
    game.findEasterEgg("shooting_star", {
      xp: 25,
      credits: 0,
      message: "You caught a shooting star! +25 XP",
    });
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <button
        onClick={handleClick}
        aria-label="Shooting star"
        className="shooting-star pointer-events-auto"
        style={{
          position: "absolute",
          top: "12%",
          left: 0,
          width: 140,
          height: 4,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(180,220,255,0.6))",
          borderRadius: 4,
          boxShadow: "0 0 10px rgba(180,220,255,0.9)",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
