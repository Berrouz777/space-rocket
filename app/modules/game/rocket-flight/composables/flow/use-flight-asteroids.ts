import {
    CRASH_ASTEROID_SIZE_PERCENT,
    CRASH_ASTEROID_SPAWN_Y_PERCENT,
    CRASH_ASTEROID_SPEED_PERCENT_PER_SECOND,
    CRASH_COLLISION_ASTEROID_RADIUS_FACTOR,
    CRASH_COLLISION_INNER_MULTIPLIER,
    CRASH_COLLISION_MISS_Y_PADDING_PERCENT,
    FLIGHT_ROCKET_Y_PERCENT
} from '../../constants'
import type { FlightAsteroid, FlightLevelConfig } from '../../types/flight.types'
import { clamp } from '../../utils/math.utils'

export interface UseFlightAsteroidsParams {
    asteroids: Ref<FlightAsteroid[]>
    level: Ref<1 | 2 | 3>
    rocketXPercent: Ref<number>
    rocketScale: Ref<number>
    currentLevelConfig: ComputedRef<FlightLevelConfig>
    canSpawn: Ref<boolean>
    setAsteroids: (value: FlightAsteroid[]) => void
    onCrash: () => void
}

export const useFlightAsteroids = (params: UseFlightAsteroidsParams) => {
    const asteroidSpawnAccumulatorMs = ref<number>(0)
    const asteroidIdSequence = ref<number>(0)
    const pendingCrashAsteroidId = ref<number | null>(null)

    const spawnAsteroid = () => {
        const isThreat = Math.random() < 0.56
        const isLeftLane = Math.random() < 0.5
        const playableMinX = 35
        const playableMaxX = 65

        const randomX = isThreat ? playableMinX + Math.random() * (playableMaxX - playableMinX) : isLeftLane ? Math.random() * 30 : 70 + Math.random() * 30

        const speedByLevel = 16 + params.level.value * 3

        // - астероиды в коридоре ракеты (isThreat) рисуем чуть меньше, будто они дальше за ракетой
        // - астероиды в боковых коридорах — крупнее, как будто ближе к камере
        const threatBaseSize = 5 + params.level.value * 0.4
        const threatRandomRange = 3

        const sideBaseSize = 8 + params.level.value * 0.6
        const sideRandomRange = 4

        const baseSize = isThreat ? threatBaseSize : sideBaseSize
        const randomRange = isThreat ? threatRandomRange : sideRandomRange
        const randomSize = baseSize + Math.random() * randomRange

        const nextAsteroid: FlightAsteroid = {
            id: asteroidIdSequence.value++,
            xPercent: randomX,
            yPercent: -12 - Math.random() * 18,
            sizePercent: randomSize,
            speedPercentPerSecond: speedByLevel + Math.random() * 18,
            driftPercentPerSecond: -5 + Math.random() * 10,
            isThreat,
            passedRocketLine: false
        }

        params.setAsteroids([...params.asteroids.value, nextAsteroid])
    }

    const requestCrashByCollision = () => {
        if (pendingCrashAsteroidId.value !== null) {
            return
        }

        const id = asteroidIdSequence.value++
        const crashAsteroid: FlightAsteroid = {
            id,
            xPercent: params.rocketXPercent.value,
            yPercent: CRASH_ASTEROID_SPAWN_Y_PERCENT,
            sizePercent: CRASH_ASTEROID_SIZE_PERCENT,
            speedPercentPerSecond: CRASH_ASTEROID_SPEED_PERCENT_PER_SECOND,
            driftPercentPerSecond: 0,
            isThreat: true,
            passedRocketLine: false
        }

        pendingCrashAsteroidId.value = id
        params.setAsteroids([...params.asteroids.value, crashAsteroid])
    }

    const updateAsteroids = (deltaSeconds: number) => {
        const mappedAsteroids = params.asteroids.value.map((asteroid: FlightAsteroid) => {
            const nextY = asteroid.yPercent + asteroid.speedPercentPerSecond * deltaSeconds
            const nextXRaw =
                pendingCrashAsteroidId.value !== null && asteroid.id === pendingCrashAsteroidId.value
                    ? params.rocketXPercent.value
                    : asteroid.xPercent + asteroid.driftPercentPerSecond * deltaSeconds
            const nextX = clamp(nextXRaw, -12, 112)
            const willPassRocketLine = !asteroid.passedRocketLine && nextY >= FLIGHT_ROCKET_Y_PERCENT

            return {
                ...asteroid,
                xPercent: nextX,
                yPercent: nextY,
                passedRocketLine: asteroid.passedRocketLine || willPassRocketLine
            }
        })

        const shouldCull = params.canSpawn.value
        const updatedAsteroids = shouldCull ? mappedAsteroids.filter((asteroid: FlightAsteroid) => asteroid.yPercent <= 120) : mappedAsteroids

        params.setAsteroids(updatedAsteroids)

        if (pendingCrashAsteroidId.value === null) {
            return
        }

        const crashAsteroid = updatedAsteroids.find((a: FlightAsteroid) => a.id === pendingCrashAsteroidId.value)
        if (!crashAsteroid) {
            pendingCrashAsteroidId.value = null
            return
        }

        const rocketRadiusPercent = 6.6 * params.rocketScale.value
        const asteroidRadiusPercent = crashAsteroid.sizePercent / 2
        const dx = crashAsteroid.xPercent - params.rocketXPercent.value
        const dy = crashAsteroid.yPercent - FLIGHT_ROCKET_Y_PERCENT
        const distance = Math.sqrt(dx * dx + dy * dy)

        const detonationThreshold = rocketRadiusPercent * CRASH_COLLISION_INNER_MULTIPLIER + asteroidRadiusPercent * CRASH_COLLISION_ASTEROID_RADIUS_FACTOR

        if (
            distance <= detonationThreshold ||
            crashAsteroid.yPercent >= FLIGHT_ROCKET_Y_PERCENT + rocketRadiusPercent + CRASH_COLLISION_MISS_Y_PADDING_PERCENT
        ) {
            // Фиксируем позицию "детонировавшего" астероида.
            const frozenAsteroids = updatedAsteroids.map((a: FlightAsteroid) =>
                a.id === crashAsteroid.id ? { ...a, speedPercentPerSecond: 0, driftPercentPerSecond: 0 } : a
            )
            params.setAsteroids(frozenAsteroids)

            pendingCrashAsteroidId.value = null
            params.onCrash()
        }
    }

    const tickAsteroids = (deltaSeconds: number) => {
        asteroidSpawnAccumulatorMs.value += deltaSeconds * 1000

        if (!params.canSpawn.value) {
            // В конце раунда продолжаем двигать уже существующие астероиды,
            asteroidSpawnAccumulatorMs.value = 0
            updateAsteroids(deltaSeconds)
            return
        }

        // Если игра только началась и астероидов ещё нет,
        // сразу создаём несколько, чтобы не было «пустого» старта.
        if (params.asteroids.value.length === 0) {
            const initialCount = 3
            for (let i = 0; i < initialCount; i++) {
                spawnAsteroid()
            }
        }

        while (asteroidSpawnAccumulatorMs.value >= params.currentLevelConfig.value.asteroidSpawnMs) {
            asteroidSpawnAccumulatorMs.value -= params.currentLevelConfig.value.asteroidSpawnMs
            spawnAsteroid()
        }
        updateAsteroids(deltaSeconds)
    }

    const reset = () => {
        asteroidSpawnAccumulatorMs.value = 0
        pendingCrashAsteroidId.value = null
    }

    return {
        tickAsteroids,
        requestCrashByCollision,
        reset
    }
}
