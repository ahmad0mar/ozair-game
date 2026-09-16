export const planets = [
  {
    id: "mercury",
    name: "MERCURY",
    accent: "#b9b3a8",
    description:
      "Mercury is the smallest planet in our solar system and the closest planet to the Sun. Its surface is covered with craters and experiences some of the most extreme temperature changes of any planet.",
    didYouKnow: "A year on Mercury lasts only 88 Earth days.",
    mission: { name: "SURVIVE THE HEAT", objective: "Scan Mercury and discover 3 facts.", reward: 100 },
    facts: [
      ["Type", "Rocky planet"],
      ["Distance from Sun", "About 58 million km"],
      ["Moons", "0"],
      ["Day length", "About 59 Earth days"],
      ["Year length", "About 88 Earth days"],
      ["Atmosphere", "Extremely thin exosphere"],
      ["Surface", "Rocky and heavily cratered"],
    ],
    visual: {
      base: "radial-gradient(circle at 32% 28%, #d8d2c8 0%, #a9a298 30%, #6d655c 62%, #2f2a24 100%)",
      surface:
        "radial-gradient(circle at 12% 38%, rgba(35,30,26,.55) 0 2%, transparent 2.6%), radial-gradient(circle at 26% 62%, rgba(40,34,28,.5) 0 2.6%, transparent 3.2%), radial-gradient(circle at 40% 34%, rgba(36,30,26,.5) 0 1.6%, transparent 2.2%), radial-gradient(circle at 55% 58%, rgba(42,36,30,.5) 0 2.2%, transparent 2.8%), radial-gradient(circle at 68% 40%, rgba(36,30,26,.5) 0 2%, transparent 2.6%), radial-gradient(circle at 82% 64%, rgba(40,34,28,.45) 0 2.4%, transparent 3%), radial-gradient(circle at 92% 36%, rgba(36,30,26,.45) 0 1.6%, transparent 2.2%)",
      glow: "rgba(190,180,160,0.22)",
      spin: 70,
    },
  },
  {
    id: "venus",
    name: "VENUS",
    accent: "#ffb24d",
    description:
      "Venus is the hottest planet in our solar system. Beneath its thick clouds of carbon dioxide, temperatures are hot enough to melt lead. Venus is similar in size to Earth but has a dramatically different environment.",
    didYouKnow: "Venus rotates so slowly that one Venusian day is longer than its year.",
    mission: { name: "ENTER THE CLOUDS", objective: "Analyze the atmosphere of Venus.", reward: 150 },
    facts: [
      ["Type", "Rocky planet"],
      ["Distance from Sun", "About 108 million km"],
      ["Moons", "0"],
      ["Day length", "About 243 Earth days"],
      ["Year length", "About 225 Earth days"],
      ["Atmosphere", "Extremely thick carbon dioxide atmosphere"],
      ["Surface", "Rocky with mountains, volcanoes, and plains"],
    ],
    visual: {
      base: "radial-gradient(circle at 32% 28%, #ffe6ad 0%, #f1bf66 30%, #c5802e 62%, #6e3a0e 100%)",
      bands:
        "repeating-linear-gradient(180deg, rgba(255,225,160,.35) 0 14px, rgba(210,150,70,.3) 14px 30px, rgba(255,235,180,.3) 30px 46px, rgba(190,120,50,.32) 46px 62px)",
      surface:
        "radial-gradient(circle at 30% 50%, rgba(255,240,200,.25) 0 8%, transparent 12%), radial-gradient(circle at 65% 40%, rgba(200,130,60,.2) 0 10%, transparent 14%)",
      glow: "rgba(255,180,70,0.3)",
      atmosphere: "rgba(255,200,110,0.4)",
      spin: 90,
    },
  },
  {
    id: "earth",
    name: "EARTH",
    accent: "#4ea8ff",
    description:
      "Earth is our home and the only known planet to support life. It has liquid water, a protective atmosphere, diverse ecosystems, and conditions that allow millions of species to thrive.",
    didYouKnow: "Earth is the only world currently known to support life.",
    mission: { name: "HOME PLANET", objective: "Complete the Earth knowledge scan.", reward: 100 },
    facts: [
      ["Type", "Rocky planet"],
      ["Distance from Sun", "About 150 million km"],
      ["Moons", "1"],
      ["Day length", "About 24 hours"],
      ["Year length", "About 365.25 days"],
      ["Atmosphere", "Mostly nitrogen and oxygen"],
      ["Surface", "Oceans, continents, mountains, deserts, forests, and ice"],
    ],
    visual: {
      base: "radial-gradient(circle at 32% 28%, #74c0ee 0%, #2f7fc0 30%, #13406f 64%, #06203f 100%)",
      surface:
        "radial-gradient(ellipse 12% 9% at 22% 40%, #2e7d3a 0 70%, transparent 71%), radial-gradient(ellipse 10% 14% at 30% 60%, #3a8a44 0 70%, transparent 71%), radial-gradient(ellipse 14% 10% at 50% 45%, #6b8f3a 0 70%, transparent 71%), radial-gradient(ellipse 9% 12% at 68% 55%, #8a6a3a 0 70%, transparent 71%), radial-gradient(ellipse 11% 8% at 82% 38%, #2e7d3a 0 70%, transparent 71%), radial-gradient(ellipse 8% 10% at 90% 62%, #3a8a44 0 70%, transparent 71%)",
      clouds:
        "radial-gradient(ellipse 14% 5% at 25% 30%, rgba(255,255,255,.5) 0 70%, transparent 71%), radial-gradient(ellipse 18% 4% at 55% 50%, rgba(255,255,255,.4) 0 70%, transparent 71%), radial-gradient(ellipse 12% 5% at 75% 70%, rgba(255,255,255,.45) 0 70%, transparent 71%), radial-gradient(ellipse 10% 4% at 90% 35%, rgba(255,255,255,.4) 0 70%, transparent 71%)",
      glow: "rgba(70,140,255,0.35)",
      atmosphere: "rgba(130,190,255,0.5)",
      spin: 50,
    },
  },
  {
    id: "mars",
    name: "MARS",
    accent: "#ff6a3d",
    description:
      "Mars is known as the Red Planet because iron minerals in its soil give the surface its reddish color. It contains enormous volcanoes, deep valleys, polar ice caps, and evidence that liquid water once existed on its surface.",
    didYouKnow: "Mars is home to Olympus Mons, the largest volcano known in the solar system.",
    mission: { name: "SEARCH FOR WATER", objective: "Explore the Martian surface and discover evidence of ancient water.", reward: 200 },
    facts: [
      ["Type", "Rocky planet"],
      ["Distance from Sun", "About 228 million km"],
      ["Moons", "2"],
      ["Day length", "About 24.6 hours"],
      ["Year length", "About 687 Earth days"],
      ["Atmosphere", "Thin, mostly carbon dioxide"],
      ["Surface", "Rocky, dusty, mountainous, and cratered"],
    ],
    visual: {
      base: "radial-gradient(circle at 32% 28%, #e89770 0%, #c4602e 30%, #863818 64%, #3a1606 100%)",
      surface:
        "radial-gradient(circle at 20% 40%, rgba(80,30,12,.5) 0 3%, transparent 3.6%), radial-gradient(circle at 38% 60%, rgba(90,35,15,.45) 0 3.5%, transparent 4.2%), radial-gradient(circle at 55% 35%, rgba(70,25,10,.5) 0 2.4%, transparent 3%), radial-gradient(circle at 70% 58%, rgba(85,32,14,.45) 0 3%, transparent 3.6%), radial-gradient(circle at 86% 42%, rgba(70,25,10,.45) 0 2.6%, transparent 3.2%), radial-gradient(ellipse 30% 8% at 50% 12%, rgba(240,235,235,.55) 0 70%, transparent 71%), radial-gradient(ellipse 30% 8% at 50% 90%, rgba(240,235,235,.55) 0 70%, transparent 71%)",
      glow: "rgba(220,100,50,0.3)",
      atmosphere: "rgba(210,95,45,0.25)",
      spin: 55,
    },
  },
  {
    id: "jupiter",
    name: "JUPITER",
    accent: "#e6b572",
    description:
      "Jupiter is the largest planet in our solar system. This enormous gas giant is famous for its colorful cloud bands, powerful storms, and the Great Red Spot, a gigantic storm that has existed for centuries.",
    didYouKnow: "More than 1,300 Earths could fit inside Jupiter by volume.",
    mission: { name: "STORM CHASER", objective: "Locate the Great Red Spot.", reward: 250 },
    facts: [
      ["Type", "Gas giant"],
      ["Distance from Sun", "About 778 million km"],
      ["Moons", "95+ known moons"],
      ["Day length", "About 9.9 hours"],
      ["Year length", "About 11.86 Earth years"],
      ["Atmosphere", "Mostly hydrogen and helium"],
      ["Surface", "No solid surface; deep atmosphere and fluid interior"],
    ],
    visual: {
      base: "radial-gradient(circle at 32% 28%, #f3e3c4 0%, #dbb888 30%, #a9763e 64%, #563418 100%)",
      bands:
        "repeating-linear-gradient(180deg, #e9d5af 0 5%, #c69a64 5% 9%, #f0dcb4 9% 14%, #a8743c 14% 19%, #dec79a 19% 25%, #b8884c 25% 31%, #e8d3a8 31% 37%, #9c6a36 37% 43%)",
      surface:
        "radial-gradient(ellipse 8% 3% at 40% 50%, rgba(180,80,40,.3) 0 70%, transparent 71%)",
      spot: {
        style: {
          width: "22%",
          height: "11%",
          background: "radial-gradient(ellipse at center, #d05838 0%, #a83824 60%, transparent 100%)",
          borderRadius: "50%",
          filter: "blur(1px)",
        },
        top: "52%",
        drift: 80,
      },
      glow: "rgba(225,175,110,0.3)",
      spin: 40,
    },
  },
  {
    id: "saturn",
    name: "SATURN",
    accent: "#ecc870",
    description:
      "Saturn is the second-largest planet in our solar system and is famous for its spectacular ring system. The rings are made primarily of countless pieces of ice and rock.",
    didYouKnow: "Saturn is less dense than water, meaning it would theoretically float in a giant enough ocean.",
    mission: { name: "RING EXPLORER", objective: "Scan Saturn's ring system.", reward: 250 },
    facts: [
      ["Type", "Gas giant"],
      ["Distance from Sun", "About 1.43 billion km"],
      ["Moons", "140+ known moons"],
      ["Day length", "About 10.7 hours"],
      ["Year length", "About 29.5 Earth years"],
      ["Atmosphere", "Mostly hydrogen and helium"],
      ["Surface", "No solid surface"],
    ],
    visual: {
      base: "radial-gradient(circle at 32% 28%, #f8e6b8 0%, #e2c278 30%, #b3863a 64%, #5a3e16 100%)",
      bands:
        "repeating-linear-gradient(180deg, rgba(248,232,184,.4) 0 7%, rgba(206,168,86,.35) 7% 14%, rgba(240,220,160,.35) 14% 22%, rgba(190,150,70,.35) 22% 30%)",
      glow: "rgba(232,196,112,0.3)",
      spin: 70,
      ring: {
        scale: 2.2,
        flatness: 0.3,
        rotate: -18,
        gradient:
          "radial-gradient(ellipse at center, transparent 0 38%, rgba(240,212,150,0.5) 41%, rgba(224,192,128,0.75) 46%, rgba(120,96,60,0.1) 50%, rgba(210,180,120,0.6) 53%, rgba(186,156,96,0.5) 59%, transparent 62%)",
      },
    },
  },
  {
    id: "uranus",
    name: "URANUS",
    accent: "#7fe6e8",
    description:
      "Uranus is an ice giant with a pale blue-green appearance caused by methane in its atmosphere. Unlike most planets, Uranus rotates on its side, making it one of the most unusual worlds in the solar system.",
    didYouKnow: "Uranus rotates at an extreme tilt of about 98 degrees, essentially rolling around the Sun.",
    mission: { name: "THE TILTED WORLD", objective: "Discover why Uranus rotates on its side.", reward: 300 },
    facts: [
      ["Type", "Ice giant"],
      ["Distance from Sun", "About 2.87 billion km"],
      ["Moons", "27 known moons"],
      ["Day length", "About 17 hours"],
      ["Year length", "About 84 Earth years"],
      ["Atmosphere", "Hydrogen, helium, and methane"],
      ["Surface", "No solid surface"],
    ],
    visual: {
      base: "radial-gradient(circle at 32% 28%, #cdf3f0 0%, #8ccad0 30%, #4a8898 64%, #18464f 100%)",
      bands:
        "repeating-linear-gradient(180deg, rgba(205,243,240,.25) 0 12%, rgba(140,200,208,.2) 12% 24%)",
      glow: "rgba(120,225,232,0.3)",
      atmosphere: "rgba(150,235,238,0.3)",
      spin: 60,
      ring: {
        scale: 1.8,
        flatness: 0.16,
        rotate: 80,
        gradient:
          "radial-gradient(ellipse at center, transparent 0 44%, rgba(150,232,235,0.45) 48%, rgba(120,200,210,0.5) 50%, transparent 53%)",
      },
    },
  },
  {
    id: "neptune",
    name: "NEPTUNE",
    accent: "#4f7bff",
    description:
      "Neptune is the most distant major planet in our solar system. It is a cold, dark blue ice giant with incredibly powerful winds and massive storms.",
    didYouKnow: "Neptune has some of the fastest winds in the solar system, reaching more than 2,000 km/h.",
    mission: { name: "EDGE OF THE SOLAR SYSTEM", objective: "Reach Neptune and complete your final planetary scan.", reward: 500 },
    facts: [
      ["Type", "Ice giant"],
      ["Distance from Sun", "About 4.5 billion km"],
      ["Moons", "14 known moons"],
      ["Day length", "About 16 hours"],
      ["Year length", "About 165 Earth years"],
      ["Atmosphere", "Hydrogen, helium, and methane"],
      ["Surface", "No solid surface"],
    ],
    visual: {
      base: "radial-gradient(circle at 32% 28%, #6088ec 0%, #3052c4 30%, #182a7a 64%, #07082a 100%)",
      bands:
        "repeating-linear-gradient(180deg, rgba(96,136,236,.3) 0 12%, rgba(40,70,170,.3) 12% 24%)",
      surface:
        "radial-gradient(ellipse 9% 5% at 40% 55%, rgba(10,20,60,.5) 0 70%, transparent 71%), radial-gradient(ellipse 7% 4% at 70% 40%, rgba(20,40,90,.4) 0 70%, transparent 71%)",
      spot: {
        style: {
          width: "16%",
          height: "10%",
          background: "radial-gradient(ellipse at center, #1a2a6a 0%, #0a1450 70%, transparent 100%)",
          borderRadius: "50%",
        },
        top: "45%",
        drift: 70,
      },
      glow: "rgba(70,110,230,0.35)",
      atmosphere: "rgba(80,120,235,0.35)",
      spin: 55,
    },
  },
];
