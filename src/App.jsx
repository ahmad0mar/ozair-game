import { GameProvider } from "@/state/GameContext";
import Starfield from "@/components/space/Starfield";
import ShootingStar from "@/components/space/ShootingStar";
import Navbar from "@/components/space/Navbar";
import Hero from "@/components/space/Hero";
import SolarSystemIntro from "@/components/space/SolarSystemIntro";
import SolarSystemMap from "@/components/space/SolarSystemMap";
import PlanetSection from "@/components/space/PlanetSection";
import FinalMission from "@/components/space/FinalMission";
import GameHUD from "@/components/space/GameHUD";
import RocketCursor from "@/components/space/RocketCursor";
import GalaxyBand from "@/components/space/GalaxyBand";
import DwarfPlanets from "@/components/space/DwarfPlanets";
import CosmicGallery from "@/components/space/CosmicGallery";
import SolarQuiz from "@/components/space/SolarQuiz";
import CursorTrail from "@/components/space/CursorTrail";
import MissionControl from "@/components/space/MissionControl";
import ToastHost from "@/components/space/ToastHost";
import LaunchSequence from "@/components/space/LaunchSequence";
import UfoDrifter from "@/components/space/UfoDrifter";
import Spaceman from "@/components/space/Spaceman";
import SolarSystemOrrery from "@/components/space/SolarSystemOrrery";
import MoonsInfo from "@/components/space/MoonsInfo";
import NightSky from "@/components/space/NightSky";
import StarTypes from "@/components/space/StarTypes";
import NearStars from "@/components/space/NearStars";
import MessierObjects from "@/components/space/MessierObjects";
import DrawingCanvas from "@/components/space/DrawingCanvas";
import { planets } from "@/data/planets";

function SpaceExplore() {
  return (
    <div className="relative min-h-screen bg-[#03040a] text-white font-body overflow-x-hidden">
      <Starfield />
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 28%, rgba(90,45,150,0.25), transparent 60%), radial-gradient(50% 50% at 85% 70%, rgba(20,90,170,0.22), transparent 60%), radial-gradient(45% 45% at 50% 95%, rgba(170,40,120,0.14), transparent 60%)",
        }}
      />
      <GalaxyBand />
      <ShootingStar />
      <LaunchSequence />
      <CursorTrail />
      <RocketCursor />
      <Navbar />
      <GameHUD />
      <ToastHost />
      <MissionControl />
      <UfoDrifter />
      <Spaceman />
      <main className="relative">
        <Hero />
        <SolarSystemIntro />
        <SolarSystemMap />
        <SolarSystemOrrery />
        <div id="planets">
          {planets.map((p, i) => (
            <PlanetSection key={p.id} planet={p} index={i} />
          ))}
        </div>
        <MoonsInfo />
        <DwarfPlanets />
        <CosmicGallery />
        <NightSky />
        <StarTypes />
        <NearStars />
        <MessierObjects />
        <DrawingCanvas />
        <SolarQuiz />
        <FinalMission />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <SpaceExplore />
    </GameProvider>
  );
}
