import { storeToRefs } from 'pinia'
import { FLIGHT_ROCKET_EXPLOSION_DURATION_MS } from '../constants'
import { useRocketFlightStore } from '../store/rocket-flight.store'
import { clamp } from '../utils/math.utils'
import { useFlowRuntime } from './flow/use-flow-runtime'
import { useFlightAsteroids } from './flow/use-flight-asteroids'
import { useFlightMultiplier } from './flow/use-flight-multiplier'

export const useRocketFlightFlow = () => {
    // Bindings
    const rocketFlightStore = useRocketFlightStore()
    const { phase, level, potentialWin, asteroids, roundSeed, rocketXPercent, rocketScale } = storeToRefs(rocketFlightStore)

    // State
    const elapsedFlightSeconds = ref<number>(0)
    const LAUNCH_ANIMATION_MS = 500

    const { pushTimeout, clearRuntime, startLoop, stopLoop } = useFlowRuntime()

    const resetToIdle = () => {
        clearRuntime()
        elapsedFlightSeconds.value = 0
        rocketFlightStore.resetRoundView()
        rocketFlightStore.setPhase('idle')
    }

    let requestCrashByCollision: () => void = () => {}

    const { currentLevelConfig, currentCollisionPercent, tickMultiplier, resetCollisionAccumulator } = useFlightMultiplier({
        onCrashRequest: () => requestCrashByCollision(),
        canRequestCrash: () => phase.value === 'flying'
    })

    const crashRound = () => {
        if (phase.value !== 'flying') {
            return
        }

        stopLoop()
        clearRuntime()
        flightAsteroids.reset()
        rocketFlightStore.setExplosionVisible(true)
        rocketFlightStore.setPhase('crashed')

        void pushTimeout(() => {
            rocketFlightStore.setExplosionVisible(false)
        }, FLIGHT_ROCKET_EXPLOSION_DURATION_MS)

        void pushTimeout(() => {
            resetToIdle()
        }, 1200)
    }

    const flightAsteroids = useFlightAsteroids({
        asteroids,
        level,
        rocketXPercent,
        rocketScale,
        currentLevelConfig,
        setAsteroids: rocketFlightStore.setAsteroids,
        onCrash: crashRound
    })

    requestCrashByCollision = flightAsteroids.requestCrashByCollision

    const updateFlightObjects = (deltaSeconds: number) => {
        elapsedFlightSeconds.value += deltaSeconds

        // Держим ракету около центра с небольшим дрейфом влево/вправо.
        const phaseA = roundSeed.value * 0.00073
        const phaseB = roundSeed.value * 0.00019
        const waveA = Math.sin(elapsedFlightSeconds.value * 1.25 + phaseA)
        const waveB = Math.sin(elapsedFlightSeconds.value * 0.68 + phaseB)
        const driftEnvelope = clamp(elapsedFlightSeconds.value / 0.55, 0, 1)
        const rocketXPercent = clamp(50 + (waveA * 10 + waveB * 5) * driftEnvelope, 30, 70)
        rocketFlightStore.setRocketXPercent(rocketXPercent)

        // Размер ракеты полностью анимируется только в фазе countdown.
        rocketFlightStore.setRocketScale(0.6)

        const moonOffsetY = clamp(elapsedFlightSeconds.value * 8, 0, 60)
        rocketFlightStore.setMoonOffsetYPercent(moonOffsetY)

        flightAsteroids.tickAsteroids(deltaSeconds)
    }

    const startFlying = () => {
        rocketFlightStore.setRocketScale(0.8)
        rocketFlightStore.setPhase('flying')
        resetCollisionAccumulator()
        elapsedFlightSeconds.value = 0

        startLoop((_timestamp: number, deltaSeconds: number) => {
            if (phase.value !== 'flying') {
                return
            }

            tickMultiplier(deltaSeconds)
            if (phase.value !== 'flying') {
                return
            }

            updateFlightObjects(deltaSeconds)
        })
    }

    const startRound = async (): Promise<void> => {
        if (phase.value !== 'idle') {
            return
        }

        clearRuntime()
        rocketFlightStore.resetRoundView()
        rocketFlightStore.setRoundSeed(Date.now())
        rocketFlightStore.setLastWinAmount(0)
        rocketFlightStore.setPhase('countdown')

        for (const count of [3, 2, 1]) {
            rocketFlightStore.setCountdown(count)
            await pushTimeout(() => undefined, 650)
        }

        rocketFlightStore.setPhase('launching')
        await pushTimeout(() => undefined, LAUNCH_ANIMATION_MS)
        startFlying()
    }

    const cashOut = () => {
        if (phase.value !== 'flying') {
            return
        }

        stopLoop()
        clearRuntime()
        flightAsteroids.reset()
        const winAmount = potentialWin.value
        rocketFlightStore.applyWinToBalance(winAmount)
        rocketFlightStore.setPhase('cashed_out')

        void pushTimeout(() => {
            resetToIdle()
        }, 450)
    }

    onUnmounted(() => {
        clearRuntime()
    })

    return {
        currentCollisionPercent,
        startRound,
        cashOut,
        resetToIdle
    }
}
