export type FlightRoundPhase = 'idle' | 'countdown' | 'launching' | 'flying' | 'crashed' | 'cashed_out'

export interface FlightLevelConfig {
    level: 1 | 2 | 3
    kMax: number
    asteroidSpawnMs: number
    growthRate: number
}

export interface FlightCurvePoint {
    level: 1 | 2 | 3
    k: number
    collisionPercent: number
}

export interface FlightAsteroid {
    id: number
    xPercent: number
    yPercent: number
    sizePercent: number
    speedPercentPerSecond: number
    driftPercentPerSecond: number
    kind: 'ambient' | 'deadly' | 'near_miss'
    isThreat: boolean
    passedRocketLine: boolean
    dodgeRequested: boolean
    nearMissDodgeOffsetPercent: number
}
