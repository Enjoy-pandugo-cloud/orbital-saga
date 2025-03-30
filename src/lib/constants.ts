
// Solar System Data based on NASA specifications
// All distances in kilometers, converted to AU (Astronomical Units) where needed
// Time periods in Earth days
// Sizes are relative to Earth (Earth = 1)

export const AU = 149597870.7; // 1 Astronomical Unit in kilometers

export interface CelestialBodyData {
  id: string;
  name: string;
  radius: number; // in km
  relativeSize: number; // relative to Earth
  distanceFromSun: number; // in AU
  orbitalPeriod: number; // in Earth days
  rotationPeriod: number; // in Earth days
  axialTilt: number; // in degrees
  color: string;
  textureMap: string;
  hasRings: boolean;
  ringTexture?: string;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  hasAtmosphere: boolean;
  atmosphereColor?: string;
  description: string;
  moons?: Moon[];
  order: number;
}

export interface Moon {
  id: string;
  name: string;
  radius: number; // in km
  distanceFromPlanet: number; // in km
  orbitalPeriod: number; // in Earth days
  textureMap: string;
}

// Scale factor for visualization (reduces the real distances to make visualization possible)
export const DISTANCE_SCALE = 1/50; // Scale down distances
export const SIZE_SCALE = 1/1000; // Scale up sizes for visibility

export const SUN_DATA: CelestialBodyData = {
  id: "sun",
  name: "Sun",
  radius: 696340, // km
  relativeSize: 109.2, // Relative to Earth
  distanceFromSun: 0,
  orbitalPeriod: 0,
  rotationPeriod: 27, // at equator
  axialTilt: 7.25,
  color: "#FDB813",
  textureMap: "/textures/sun.jpg",
  hasRings: false,
  hasAtmosphere: false,
  description: "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.",
  order: 0
};

export const PLANETS_DATA: CelestialBodyData[] = [
  {
    id: "mercury",
    name: "Mercury",
    radius: 2439.7,
    relativeSize: 0.383,
    distanceFromSun: 0.387,
    orbitalPeriod: 87.97,
    rotationPeriod: 58.646,
    axialTilt: 0.034,
    color: "#B5B5B5",
    textureMap: "/textures/mercury.jpg",
    hasRings: false,
    hasAtmosphere: false,
    description: "Mercury is the smallest and innermost planet in the Solar System. It has no natural satellites and no substantial atmosphere.",
    order: 1
  },
  {
    id: "venus",
    name: "Venus",
    radius: 6051.8,
    relativeSize: 0.949,
    distanceFromSun: 0.723,
    orbitalPeriod: 224.7,
    rotationPeriod: -243, // Negative indicates retrograde rotation
    axialTilt: 177.4, // Nearly upside down!
    color: "#E6E6FA",
    textureMap: "/textures/venus.jpg",
    hasRings: false,
    hasAtmosphere: true,
    atmosphereColor: "#FFFBE6",
    description: "Venus is the second planet from the Sun. It has the densest atmosphere of all terrestrial planets, consisting mostly of carbon dioxide.",
    order: 2
  },
  {
    id: "earth",
    name: "Earth",
    radius: 6371,
    relativeSize: 1,
    distanceFromSun: 1,
    orbitalPeriod: 365.25,
    rotationPeriod: 1,
    axialTilt: 23.44,
    color: "#2E76CF",
    textureMap: "/textures/earth.jpg",
    hasRings: false,
    hasAtmosphere: true,
    atmosphereColor: "#88B0DC",
    description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is water-covered.",
    moons: [
      {
        id: "moon",
        name: "Moon",
        radius: 1737.4,
        distanceFromPlanet: 384400,
        orbitalPeriod: 27.3,
        textureMap: "/textures/moon.jpg"
      }
    ],
    order: 3
  },
  {
    id: "mars",
    name: "Mars",
    radius: 3389.5,
    relativeSize: 0.532,
    distanceFromSun: 1.524,
    orbitalPeriod: 686.98,
    rotationPeriod: 1.03,
    axialTilt: 25.19,
    color: "#E27B58",
    textureMap: "/textures/mars.jpg",
    hasRings: false,
    hasAtmosphere: true,
    atmosphereColor: "#FFD1BA",
    description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury.",
    moons: [
      {
        id: "phobos",
        name: "Phobos",
        radius: 11.267,
        distanceFromPlanet: 9376,
        orbitalPeriod: 0.32,
        textureMap: "/textures/phobos.jpg"
      },
      {
        id: "deimos",
        name: "Deimos",
        radius: 6.2,
        distanceFromPlanet: 23463.2,
        orbitalPeriod: 1.26,
        textureMap: "/textures/deimos.jpg"
      }
    ],
    order: 4
  },
  {
    id: "jupiter",
    name: "Jupiter",
    radius: 69911,
    relativeSize: 10.97,
    distanceFromSun: 5.203,
    orbitalPeriod: 4332.59,
    rotationPeriod: 0.41,
    axialTilt: 3.13,
    color: "#E8CAA4",
    textureMap: "/textures/jupiter.jpg",
    hasRings: true,
    ringTexture: "/textures/jupiter_ring.png",
    ringInnerRadius: 92000,
    ringOuterRadius: 225000,
    hasAtmosphere: true,
    atmosphereColor: "#F0E2C4",
    description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets combined.",
    order: 5
  },
  {
    id: "saturn",
    name: "Saturn",
    radius: 58232,
    relativeSize: 9.14,
    distanceFromSun: 9.537,
    orbitalPeriod: 10759.22,
    rotationPeriod: 0.44,
    axialTilt: 26.73,
    color: "#F4D798",
    textureMap: "/textures/saturn.jpg",
    hasRings: true,
    ringTexture: "/textures/saturn_rings.png",
    ringInnerRadius: 74500,
    ringOuterRadius: 136800,
    hasAtmosphere: true,
    atmosphereColor: "#FFF0D8",
    description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine times that of Earth.",
    order: 6
  },
  {
    id: "uranus",
    name: "Uranus",
    radius: 25362,
    relativeSize: 3.98,
    distanceFromSun: 19.191,
    orbitalPeriod: 30688.5,
    rotationPeriod: -0.72, // Negative indicates retrograde rotation
    axialTilt: 97.77, // Rotates on its side!
    color: "#D1E7E7",
    textureMap: "/textures/uranus.jpg",
    hasRings: true,
    ringTexture: "/textures/uranus_rings.png",
    ringInnerRadius: 38000,
    ringOuterRadius: 98000,
    hasAtmosphere: true,
    atmosphereColor: "#D1E7E7",
    description: "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.",
    order: 7
  },
  {
    id: "neptune",
    name: "Neptune",
    radius: 24622,
    relativeSize: 3.86,
    distanceFromSun: 30.069,
    orbitalPeriod: 60182,
    rotationPeriod: 0.67,
    axialTilt: 28.32,
    color: "#3E66F9",
    textureMap: "/textures/neptune.jpg",
    hasRings: true,
    ringTexture: "/textures/neptune_rings.png",
    ringInnerRadius: 40900,
    ringOuterRadius: 62900,
    hasAtmosphere: true,
    atmosphereColor: "#A8D0F9",
    description: "Neptune is the eighth and farthest known Solar planet from the Sun. It is the fourth-largest planet by diameter and the third-most-massive planet.",
    order: 8
  }
];

export const ALL_CELESTIAL_BODIES = [SUN_DATA, ...PLANETS_DATA];
