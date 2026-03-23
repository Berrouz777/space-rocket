import {
    CRASH_COLLISION_ASTEROID_RADIUS_FACTOR,
    CRASH_COLLISION_INNER_MULTIPLIER,
    CRASH_COLLISION_MISS_Y_PADDING_PERCENT,
    FLIGHT_ROCKET_Y_PERCENT
} from '../../../constants'
import type { AdvanceAsteroidsParams, AdvanceAsteroidsResult, FlightAsteroid, ResolveCrashCollisionParams, ResolveCrashCollisionResult } from '../../../types'
import { clamp } from '../../../utils/math.utils'
import { computeNearMissDodgeTriggerY } from './asteroids-near-miss'

export const advanceAsteroids = ({ asteroids, deltaSeconds }: AdvanceAsteroidsParams): AdvanceAsteroidsResult => {
    let nearMissDodgeRequestPercent: number | null = null

    const updatedAsteroids = asteroids.map((asteroid: FlightAsteroid) => {
        const nextY = asteroid.yPercent + asteroid.speedPercentPerSecond * deltaSeconds
        const nextXRaw = asteroid.xPercent + asteroid.driftPercentPerSecond * deltaSeconds
        const nextX = clamp(nextXRaw, -12, 112)
        const willPassRocketLine = !asteroid.passedRocketLine && nextY >= FLIGHT_ROCKET_Y_PERCENT

        const dodgeTriggerY = computeNearMissDodgeTriggerY(asteroid.speedPercentPerSecond, asteroid.nearMissDodgeOffsetPercent)
        const shouldRequestNearMissDodge = asteroid.kind === 'near_miss' && !asteroid.dodgeRequested && nextY >= dodgeTriggerY
        if (shouldRequestNearMissDodge) {
            if (nearMissDodgeRequestPercent === null || Math.abs(asteroid.nearMissDodgeOffsetPercent) > Math.abs(nearMissDodgeRequestPercent)) {
                nearMissDodgeRequestPercent = asteroid.nearMissDodgeOffsetPercent
            }
        }

        return {
            ...asteroid,
            xPercent: nextX,
            yPercent: nextY,
            passedRocketLine: asteroid.passedRocketLine || willPassRocketLine,
            dodgeRequested: asteroid.dodgeRequested || shouldRequestNearMissDodge
        }
    })

    return {
        asteroids: updatedAsteroids,
        nearMissDodgeRequestPercent
    }
}

export const resolveCrashCollision = ({
    asteroids,
    pendingCrashAsteroidId,
    rocketXPercent,
    rocketScale
}: ResolveCrashCollisionParams): ResolveCrashCollisionResult => {
    if (pendingCrashAsteroidId === null) {
        return {
            pendingCrashAsteroidId,
            shouldCrash: false,
            frozenAsteroids: null
        }
    }

    const crashAsteroid = asteroids.find((asteroid: FlightAsteroid) => asteroid.id === pendingCrashAsteroidId)
    if (!crashAsteroid) {
        return {
            pendingCrashAsteroidId: null,
            shouldCrash: false,
            frozenAsteroids: null
        }
    }

    const rocketRadiusPercent = 6.6 * rocketScale
    const asteroidRadiusPercent = crashAsteroid.sizePercent / 2
    const dx = crashAsteroid.xPercent - rocketXPercent
    const dy = crashAsteroid.yPercent - FLIGHT_ROCKET_Y_PERCENT
    const distance = Math.sqrt(dx * dx + dy * dy)

    const detonationThreshold = rocketRadiusPercent * CRASH_COLLISION_INNER_MULTIPLIER + asteroidRadiusPercent * CRASH_COLLISION_ASTEROID_RADIUS_FACTOR
    const shouldDetonate =
        distance <= detonationThreshold || crashAsteroid.yPercent >= FLIGHT_ROCKET_Y_PERCENT + rocketRadiusPercent + CRASH_COLLISION_MISS_Y_PADDING_PERCENT

    if (!shouldDetonate) {
        return {
            pendingCrashAsteroidId,
            shouldCrash: false,
            frozenAsteroids: null
        }
    }

    const frozenAsteroids = asteroids.map((asteroid: FlightAsteroid) =>
        asteroid.id === crashAsteroid.id ? { ...asteroid, speedPercentPerSecond: 0, driftPercentPerSecond: 0 } : asteroid
    )

    return {
        pendingCrashAsteroidId: null,
        shouldCrash: true,
        frozenAsteroids
    }
}
