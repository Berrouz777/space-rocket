import { storeToRefs } from 'pinia'
import {
    FLIGHT_CASHOUT_TO_IDLE_DELAY_MS,
    FLIGHT_CRASH_TO_IDLE_DELAY_MS,
    FLIGHT_ROCKET_EXPLOSION_DURATION_MS,
    NEAR_MISS_DODGE_OFFSET_MAX_PERCENT,
    ROCKET_DODGE_BASE_LOCK_BLEND_PER_SECOND,
    ROCKET_DODGE_RESPONSE_PER_SECOND,
    ROCKET_DODGE_TARGET_DECAY_PER_SECOND,
    ROCKET_DODGE_TILT_RESPONSE_PER_SECOND,
    ROCKET_DODGE_TILT_VELOCITY_NORMALIZATION_PERCENT_PER_SECOND
} from '../constants'
import { useRocketFlightStore } from '../store/rocket-flight.store'
import { clamp, lerp } from '../utils/math.utils'
import { computed } from 'vue'
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
    const rocketDodgeOffsetPercent = ref<number>(0)
    const rocketDodgeTargetOffsetPercent = ref<number>(0)
    const rocketDodgeTiltNormalized = ref<number>(0)
    const dodgeBaseLockXPercent = ref<number>(50)
    const dodgeBaseLockWeight = ref<number>(0)
    const driftCarryOffsetPercent = ref<number>(0)
    const previousDodgeOffsetPercent = ref<number>(0)

    const { pushTimeout, clearRuntime, startLoop } = useFlowRuntime()

    const stepTowards = (current: number, target: number, maxStep: number): number => {
        if (current < target) {
            return Math.min(current + maxStep, target)
        }
        return Math.max(current - maxStep, target)
    }

    const resetRocketDodge = () => {
        rocketDodgeOffsetPercent.value = 0
        rocketDodgeTargetOffsetPercent.value = 0
        rocketDodgeTiltNormalized.value = 0
        dodgeBaseLockWeight.value = 0
        dodgeBaseLockXPercent.value = rocketXPercent.value
        driftCarryOffsetPercent.value = 0
        previousDodgeOffsetPercent.value = 0
        rocketFlightStore.setRocketDodgeNormalized(0)
    }

    const resetToIdle = () => {
        clearRuntime()
        elapsedFlightSeconds.value = 0
        resetRocketDodge()
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

        flightAsteroids.reset()
        resetRocketDodge()
        rocketFlightStore.setExplosionVisible(true)
        rocketFlightStore.setPhase('crashed')

        void pushTimeout(() => {
            rocketFlightStore.setExplosionVisible(false)
        }, FLIGHT_ROCKET_EXPLOSION_DURATION_MS)

        void pushTimeout(() => {
            resetToIdle()
        }, FLIGHT_CRASH_TO_IDLE_DELAY_MS)
    }

    const flightAsteroids = useFlightAsteroids({
        asteroids,
        level,
        rocketXPercent,
        rocketScale,
        currentLevelConfig,
        canSpawn: computed(() => phase.value === 'flying'),
        setAsteroids: rocketFlightStore.setAsteroids,
        onCrash: crashRound,
        onNearMissDodge: (offsetPercent: number) => {
            const clampedOffset = clamp(offsetPercent, -NEAR_MISS_DODGE_OFFSET_MAX_PERCENT, NEAR_MISS_DODGE_OFFSET_MAX_PERCENT)
            const currentTarget = rocketDodgeTargetOffsetPercent.value
            const shouldReplaceTarget = Math.sign(clampedOffset) !== Math.sign(currentTarget) || Math.abs(clampedOffset) > Math.abs(currentTarget)

            if (shouldReplaceTarget) {
                // Фиксируем "базу" в текущей позиции, чтобы синусный дрейф не тянул ракету в противоход dodge.
                dodgeBaseLockXPercent.value = rocketXPercent.value
                rocketDodgeTargetOffsetPercent.value = clampedOffset
            }
        }
    })

    requestCrashByCollision = flightAsteroids.requestCrashByCollision

    const updateFlightObjects = (deltaSeconds: number) => {
        elapsedFlightSeconds.value += deltaSeconds

        if (phase.value === 'flying') {
            // Держим ракету около центра с небольшим дрейфом влево/вправо.
            const phaseA = roundSeed.value * 0.00073
            const phaseB = roundSeed.value * 0.00019
            const waveA = Math.sin(elapsedFlightSeconds.value * 1.25 + phaseA)
            const waveB = Math.sin(elapsedFlightSeconds.value * 0.68 + phaseB)
            const driftEnvelope = clamp(elapsedFlightSeconds.value / 0.55, 0, 1)
            const baseRocketXPercent = clamp(50 + (waveA * 10 + waveB * 5) * driftEnvelope, 30, 70)
            const baseRocketWithCarryXPercent = clamp(baseRocketXPercent + driftCarryOffsetPercent.value, 30, 70)

            const targetDecayStep = ROCKET_DODGE_TARGET_DECAY_PER_SECOND * deltaSeconds
            rocketDodgeTargetOffsetPercent.value = stepTowards(rocketDodgeTargetOffsetPercent.value, 0, targetDecayStep)

            const dodgeResponseStep = ROCKET_DODGE_RESPONSE_PER_SECOND * deltaSeconds
            rocketDodgeOffsetPercent.value = stepTowards(rocketDodgeOffsetPercent.value, rocketDodgeTargetOffsetPercent.value, dodgeResponseStep)

            const hasActiveDodge = Math.abs(rocketDodgeTargetOffsetPercent.value) > 0.02 || Math.abs(rocketDodgeOffsetPercent.value) > 0.02
            const baseLockTarget = hasActiveDodge ? 1 : 0
            dodgeBaseLockWeight.value = stepTowards(dodgeBaseLockWeight.value, baseLockTarget, ROCKET_DODGE_BASE_LOCK_BLEND_PER_SECOND * deltaSeconds)

            const effectiveBaseRocketXPercent = lerp(baseRocketWithCarryXPercent, dodgeBaseLockXPercent.value, dodgeBaseLockWeight.value)
            const nextRocketXPercent = clamp(effectiveBaseRocketXPercent + rocketDodgeOffsetPercent.value, 30, 70)

            // Когда dodge активен, фиксируем новый "базовый" сдвиг относительно синусной траектории,
            // чтобы после уклонения ракета не делала неестественный откат к старой линии.
            if (dodgeBaseLockWeight.value > 0.001) {
                driftCarryOffsetPercent.value = clamp(effectiveBaseRocketXPercent - baseRocketXPercent, -18, 18)
            }

            const deltaSecondsSafe = Math.max(deltaSeconds, 0.0001)
            const dodgeVelocityPercentPerSecond = (rocketDodgeOffsetPercent.value - previousDodgeOffsetPercent.value) / deltaSecondsSafe
            previousDodgeOffsetPercent.value = rocketDodgeOffsetPercent.value

            const isTiltActive = hasActiveDodge || dodgeBaseLockWeight.value > 0.05
            const tiltTargetNormalized = isTiltActive
                ? clamp(dodgeVelocityPercentPerSecond / ROCKET_DODGE_TILT_VELOCITY_NORMALIZATION_PERCENT_PER_SECOND, -1, 1)
                : 0
            rocketDodgeTiltNormalized.value = stepTowards(
                rocketDodgeTiltNormalized.value,
                tiltTargetNormalized,
                ROCKET_DODGE_TILT_RESPONSE_PER_SECOND * deltaSeconds
            )

            rocketFlightStore.setRocketXPercent(nextRocketXPercent)
            rocketFlightStore.setRocketDodgeNormalized(rocketDodgeTiltNormalized.value)

            // Размер ракеты полностью анимируется только в фазе countdown.
            rocketFlightStore.setRocketScale(0.6)

            const moonOffsetY = clamp(elapsedFlightSeconds.value * 8, 0, 60)
            rocketFlightStore.setMoonOffsetYPercent(moonOffsetY)
        }

        flightAsteroids.tickAsteroids(deltaSeconds)
    }

    const startFlying = () => {
        rocketFlightStore.setRocketScale(0.8)
        resetRocketDodge()
        rocketFlightStore.setPhase('flying')
        resetCollisionAccumulator()
        elapsedFlightSeconds.value = 0

        startLoop((_timestamp: number, deltaSeconds: number) => {
            if (phase.value === 'idle' || phase.value === 'countdown' || phase.value === 'launching') {
                return
            }

            if (phase.value === 'flying') {
                tickMultiplier(deltaSeconds)
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

        flightAsteroids.reset()
        resetRocketDodge()
        const winAmount = potentialWin.value
        rocketFlightStore.applyWinToBalance(winAmount)
        rocketFlightStore.setPhase('cashed_out')

        void pushTimeout(() => {
            resetToIdle()
        }, FLIGHT_CASHOUT_TO_IDLE_DELAY_MS)
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
