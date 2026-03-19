import type { FlightCurvePoint, FlightLevelConfig } from '../types/flight.types'

export const FLIGHT_LEVELS: FlightLevelConfig[] = [
    { level: 1, kMax: 2.2, asteroidSpawnMs: 1500, growthRate: 0.18 },
    { level: 2, kMax: 100, asteroidSpawnMs: 980, growthRate: 0.62 },
    { level: 3, kMax: 10000, asteroidSpawnMs: 620, growthRate: 0.95 }
]

export const FLIGHT_CURVE_POINTS: FlightCurvePoint[] = [
    { level: 1, k: 1.0333, collisionPercent: 8.06 },
    { level: 1, k: 1.1318, collisionPercent: 16.06 },
    { level: 1, k: 1.2683, collisionPercent: 25.1 },
    { level: 1, k: 1.4213, collisionPercent: 33.16 },
    { level: 1, k: 1.5927, collisionPercent: 40.35 },
    { level: 1, k: 1.7848, collisionPercent: 46.77 },
    { level: 1, k: 2.2, collisionPercent: 52.5 },
    { level: 2, k: 2.8271, collisionPercent: 66.4 },
    { level: 2, k: 4.6233, collisionPercent: 79.45 },
    { level: 2, k: 8.5499, collisionPercent: 88.89 },
    { level: 2, k: 15.8114, collisionPercent: 93.99 },
    { level: 2, k: 29.2402, collisionPercent: 96.75 },
    { level: 2, k: 54.0742, collisionPercent: 98.24 },
    { level: 2, k: 100, collisionPercent: 99.05 },
    { level: 3, k: 144.66, collisionPercent: 99.34 },
    { level: 3, k: 259.47, collisionPercent: 99.63 },
    { level: 3, k: 538.61, collisionPercent: 99.82 },
    { level: 3, k: 1118.03, collisionPercent: 99.92 },
    { level: 3, k: 2320.79, collisionPercent: 99.96 },
    { level: 3, k: 4817.46, collisionPercent: 99.98 },
    { level: 3, k: 10000, collisionPercent: 99.99 }
]

export const FLIGHT_BET_DEFAULT = 10
export const FLIGHT_BALANCE_DEFAULT = 5000
export const FLIGHT_ROCKET_Y_PERCENT = 56
