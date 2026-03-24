import { AMBIENT_ASTEROID_INITIAL_COUNT, NEAR_MISS_ASTEROID_MAX_ACTIVE, NEAR_MISS_ASTEROID_SPAWN_CHANCE } from '../../constants'
import type { FlightAsteroid, FlightAsteroidsFlowParams } from '../../types'
import { createAmbientAsteroid, createDeadlyAsteroid, createNearMissAsteroid } from './asteroids/asteroids-factories'
import { advanceAsteroids, resolveCrashCollision } from './asteroids/asteroids-update'

export type UseFlightAsteroidsParams = FlightAsteroidsFlowParams

export const useFlightAsteroids = (params: UseFlightAsteroidsParams) => {
    const asteroidSpawnAccumulatorMs = ref<number>(0)
    const asteroidIdSequence = ref<number>(0)
    const pendingCrashAsteroidId = ref<number | null>(null)

    const appendAsteroid = (asteroid: FlightAsteroid) => {
        params.setAsteroids([...params.asteroids.value, asteroid])
    }

    const spawnAmbientAsteroid = () =>
        appendAsteroid(
            createAmbientAsteroid({
                id: asteroidIdSequence.value++,
                level: params.level.value
            })
        )

    const spawnNearMissAsteroid = () =>
        appendAsteroid(
            createNearMissAsteroid({
                id: asteroidIdSequence.value++,
                rocketXPercent: params.rocketXPercent.value,
                rocketScale: params.rocketScale.value
            })
        )

    const spawnAsteroid = () => {
        const activeNearMissCount = params.asteroids.value.filter((asteroid: FlightAsteroid) => asteroid.kind === 'near_miss').length
        const shouldSpawnNearMiss = activeNearMissCount < NEAR_MISS_ASTEROID_MAX_ACTIVE && Math.random() < NEAR_MISS_ASTEROID_SPAWN_CHANCE

        if (shouldSpawnNearMiss) {
            spawnNearMissAsteroid()
            return
        }

        spawnAmbientAsteroid()
    }

    const requestCrashByCollision = () => {
        if (pendingCrashAsteroidId.value !== null) {
            return
        }

        const id = asteroidIdSequence.value++
        const crashAsteroid = createDeadlyAsteroid({
            id,
            rocketXPercent: params.rocketXPercent.value
        })

        pendingCrashAsteroidId.value = id
        params.setAsteroids([...params.asteroids.value, crashAsteroid])
    }

    const updateAsteroids = (deltaSeconds: number) => {
        const { asteroids: advancedAsteroids, nearMissDodgeRequestPercent } = advanceAsteroids({
            asteroids: params.asteroids.value,
            deltaSeconds
        })

        const shouldCull = params.canSpawn.value
        const updatedAsteroids = shouldCull ? advancedAsteroids.filter((asteroid: FlightAsteroid) => asteroid.yPercent <= 120) : advancedAsteroids

        params.setAsteroids(updatedAsteroids)

        if (nearMissDodgeRequestPercent !== null) {
            params.onNearMissDodge(nearMissDodgeRequestPercent)
        }

        const crashResolution = resolveCrashCollision({
            asteroids: updatedAsteroids,
            pendingCrashAsteroidId: pendingCrashAsteroidId.value,
            rocketXPercent: params.rocketXPercent.value,
            rocketScale: params.rocketScale.value
        })

        pendingCrashAsteroidId.value = crashResolution.pendingCrashAsteroidId
        if (crashResolution.shouldCrash && crashResolution.frozenAsteroids) {
            params.setAsteroids(crashResolution.frozenAsteroids)
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
            for (let i = 0; i < AMBIENT_ASTEROID_INITIAL_COUNT; i++) {
                spawnAmbientAsteroid()
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
