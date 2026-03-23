import {
    AMBIENT_ASTEROID_DRIFT_MAX_PERCENT_PER_SECOND,
    AMBIENT_ASTEROID_DRIFT_MIN_PERCENT_PER_SECOND,
    AMBIENT_ASTEROID_MAX_X_PERCENT,
    AMBIENT_ASTEROID_MIN_X_PERCENT,
    AMBIENT_ASTEROID_SIZE_BASE,
    AMBIENT_ASTEROID_SIZE_LEVEL_MULTIPLIER,
    AMBIENT_ASTEROID_SIZE_RANDOM_RANGE,
    AMBIENT_ASTEROID_SPAWN_Y_BASE_PERCENT,
    AMBIENT_ASTEROID_SPAWN_Y_RANDOM_RANGE,
    AMBIENT_ASTEROID_SPEED_BASE_BY_LEVEL,
    AMBIENT_ASTEROID_SPEED_LEVEL_MULTIPLIER,
    AMBIENT_ASTEROID_SPEED_RANDOM_RANGE,
    CRASH_ASTEROID_SIZE_PERCENT,
    CRASH_ASTEROID_SPAWN_Y_PERCENT,
    CRASH_ASTEROID_SPEED_PERCENT_PER_SECOND,
    NEAR_MISS_ASTEROID_SIZE_MAX_PERCENT,
    NEAR_MISS_ASTEROID_SIZE_MIN_PERCENT,
    NEAR_MISS_ASTEROID_SPAWN_Y_PERCENT,
    NEAR_MISS_ASTEROID_SPEED_MAX_PERCENT_PER_SECOND,
    NEAR_MISS_ASTEROID_SPEED_MIN_PERCENT_PER_SECOND
} from '../../../constants'
import type { AmbientAsteroidParams, DeadlyAsteroidParams, FlightAsteroid, NearMissAsteroidParams } from '../../../types'
import { randomBetween } from '../../../utils/math.utils'
import { computeNearMissPlan } from './asteroids-near-miss'

export const createAmbientAsteroid = ({ id, level }: AmbientAsteroidParams): FlightAsteroid => {
    const randomX = randomBetween(AMBIENT_ASTEROID_MIN_X_PERCENT, AMBIENT_ASTEROID_MAX_X_PERCENT)
    const speedByLevel = AMBIENT_ASTEROID_SPEED_BASE_BY_LEVEL + level * AMBIENT_ASTEROID_SPEED_LEVEL_MULTIPLIER

    const baseSize = AMBIENT_ASTEROID_SIZE_BASE + level * AMBIENT_ASTEROID_SIZE_LEVEL_MULTIPLIER
    const randomRange = AMBIENT_ASTEROID_SIZE_RANDOM_RANGE
    const randomSize = randomBetween(baseSize, baseSize + randomRange)

    return {
        id,
        xPercent: randomX,
        yPercent: -(AMBIENT_ASTEROID_SPAWN_Y_BASE_PERCENT + randomBetween(0, AMBIENT_ASTEROID_SPAWN_Y_RANDOM_RANGE)),
        sizePercent: randomSize,
        speedPercentPerSecond: speedByLevel + randomBetween(0, AMBIENT_ASTEROID_SPEED_RANDOM_RANGE),
        driftPercentPerSecond: randomBetween(AMBIENT_ASTEROID_DRIFT_MIN_PERCENT_PER_SECOND, AMBIENT_ASTEROID_DRIFT_MAX_PERCENT_PER_SECOND),
        kind: 'ambient',
        isThreat: false,
        passedRocketLine: false,
        dodgeRequested: false,
        nearMissDodgeOffsetPercent: 0
    }
}

export const createNearMissAsteroid = ({ id, rocketXPercent, rocketScale }: NearMissAsteroidParams): FlightAsteroid => {
    const sizePercent = randomBetween(NEAR_MISS_ASTEROID_SIZE_MIN_PERCENT, NEAR_MISS_ASTEROID_SIZE_MAX_PERCENT)
    const nearMissPlan = computeNearMissPlan({
        rocketXPercent,
        rocketScale,
        asteroidSizePercent: sizePercent
    })

    return {
        id,
        xPercent: nearMissPlan.targetXPercent,
        yPercent: NEAR_MISS_ASTEROID_SPAWN_Y_PERCENT,
        sizePercent,
        speedPercentPerSecond: randomBetween(NEAR_MISS_ASTEROID_SPEED_MIN_PERCENT_PER_SECOND, NEAR_MISS_ASTEROID_SPEED_MAX_PERCENT_PER_SECOND),
        driftPercentPerSecond: 0,
        kind: 'near_miss',
        isThreat: true,
        passedRocketLine: false,
        dodgeRequested: false,
        nearMissDodgeOffsetPercent: nearMissPlan.dodgeOffsetPercent
    }
}

export const createDeadlyAsteroid = ({ id, rocketXPercent }: DeadlyAsteroidParams): FlightAsteroid => ({
    id,
    xPercent: rocketXPercent,
    yPercent: CRASH_ASTEROID_SPAWN_Y_PERCENT,
    sizePercent: CRASH_ASTEROID_SIZE_PERCENT,
    speedPercentPerSecond: CRASH_ASTEROID_SPEED_PERCENT_PER_SECOND,
    driftPercentPerSecond: 0,
    kind: 'deadly',
    isThreat: true,
    passedRocketLine: false,
    dodgeRequested: false,
    nearMissDodgeOffsetPercent: 0
})
