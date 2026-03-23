import type { FlightAsteroid, FlightLevelConfig } from './flight.types'

export interface FlightAsteroidsFlowParams {
    asteroids: Ref<FlightAsteroid[]>
    level: Ref<1 | 2 | 3>
    rocketXPercent: Ref<number>
    rocketScale: Ref<number>
    currentLevelConfig: ComputedRef<FlightLevelConfig>
    canSpawn: Ref<boolean>
    setAsteroids: (value: FlightAsteroid[]) => void
    onCrash: () => void
    onNearMissDodge: (offsetPercent: number) => void
}

export interface AmbientAsteroidParams {
    id: number
    level: 1 | 2 | 3
}

export interface NearMissAsteroidParams {
    id: number
    rocketXPercent: number
    rocketScale: number
}

export interface DeadlyAsteroidParams {
    id: number
    rocketXPercent: number
}

export interface NearMissPlanParams {
    rocketXPercent: number
    rocketScale: number
    asteroidSizePercent: number
}

export interface NearMissPlan {
    targetXPercent: number
    dodgeOffsetPercent: number
}

export interface AdvanceAsteroidsParams {
    asteroids: FlightAsteroid[]
    deltaSeconds: number
}

export interface ResolveCrashCollisionParams {
    asteroids: FlightAsteroid[]
    pendingCrashAsteroidId: number | null
    rocketXPercent: number
    rocketScale: number
}

export interface AdvanceAsteroidsResult {
    asteroids: FlightAsteroid[]
    nearMissDodgeRequestPercent: number | null
}

export interface ResolveCrashCollisionResult {
    pendingCrashAsteroidId: number | null
    shouldCrash: boolean
    frozenAsteroids: FlightAsteroid[] | null
}
