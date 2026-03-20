import { computed, onUnmounted, ref, watch } from 'vue'

import type { FlightPlanetConfig, FlightPlanetsProps } from '../types/flight-planets.types'
import { COUNTDOWN_SETTLE_MS, MOON_GONE_AT, PLANETS_BASE_OFFSET_VH, PLANETS_FULL_OFFSET_VH, RETURN_DELAY_MS } from '../constants/flight-planets.constants'

export const useFlightPlanets = (props: FlightPlanetsProps) => {
    const isReturnDelayActive = ref(false)
    const countdownSettleProgress = ref(0)

    let returnDelayTimeoutId: number | null = null
    let countdownSettleFrameId: number | null = null
    let countdownSettleStartedAt: number | null = null

    const stopCountdownSettleAnimation = () => {
        if (countdownSettleFrameId !== null) {
            cancelAnimationFrame(countdownSettleFrameId)
            countdownSettleFrameId = null
        }
    }

    const tickCountdownSettle = (timestamp: number) => {
        if (props.phase !== 'countdown') {
            countdownSettleStartedAt = null
            return
        }

        if (countdownSettleStartedAt === null) {
            countdownSettleStartedAt = timestamp
        }

        const elapsedMs = timestamp - countdownSettleStartedAt
        const t = Math.min(Math.max(elapsedMs / COUNTDOWN_SETTLE_MS, 0), 1)
        countdownSettleProgress.value = t

        if (t < 1) {
            countdownSettleFrameId = requestAnimationFrame(tickCountdownSettle)
            return
        }

        countdownSettleFrameId = null
    }

    watch(
        () => props.phase,
        (nextPhase, prevPhase) => {
            const wasEndPhase = prevPhase === 'crashed' || prevPhase === 'cashed_out'
            const isIdleNow = nextPhase === 'idle'

            if (wasEndPhase && isIdleNow) {
                // Коммент: у ракеты есть задержка перед появлением на луне.
                // Планеты должны появляться синхронно, иначе будет визуальный рассинхрон.
                if (returnDelayTimeoutId !== null) {
                    window.clearTimeout(returnDelayTimeoutId)
                }

                isReturnDelayActive.value = true
                returnDelayTimeoutId = window.setTimeout(() => {
                    isReturnDelayActive.value = false
                    returnDelayTimeoutId = null
                }, RETURN_DELAY_MS)
            }

            if (nextPhase === 'idle') {
                stopCountdownSettleAnimation()
                countdownSettleStartedAt = null
                countdownSettleProgress.value = 0
                return
            }

            if (nextPhase === 'countdown') {
                stopCountdownSettleAnimation()
                countdownSettleStartedAt = null
                countdownSettleProgress.value = 0
                countdownSettleFrameId = requestAnimationFrame(tickCountdownSettle)
                return
            }

            stopCountdownSettleAnimation()
            countdownSettleStartedAt = null
            countdownSettleProgress.value = 1
        }
    )

    onUnmounted(() => {
        if (returnDelayTimeoutId !== null) {
            window.clearTimeout(returnDelayTimeoutId)
        }

        stopCountdownSettleAnimation()
    })

    const planetsOpacityClass = computed(() => {
        if (props.phase === 'crashed' || props.phase === 'cashed_out' || isReturnDelayActive.value) {
            return 'opacity-0'
        }

        return 'opacity-100'
    })

    // Возвращает inline-стили для каждой планеты:
    // - вертикальное смещение (уход вниз) синхронизировано по launchProgress
    // - горизонтальный дрейф (невесомость) убирается плавно к началу launching
    const planetStyle = (planet: FlightPlanetConfig): Record<string, string> => {
        const t = props.launchProgress

        // Тайминг исчезновения:
        // луна уходит к концу launch, а планеты начинают основной уход чуть позже.
        const offsetVh =
            t < MOON_GONE_AT
                ? (t / MOON_GONE_AT) * PLANETS_BASE_OFFSET_VH
                : PLANETS_BASE_OFFSET_VH + ((t - MOON_GONE_AT) / (1 - MOON_GONE_AT)) * (PLANETS_FULL_OFFSET_VH - PLANETS_BASE_OFFSET_VH)

        let driftStrength = 0
        if (props.phase === 'idle') {
            driftStrength = 1
        } else if (props.phase === 'countdown') {
            const p = countdownSettleProgress.value
            // smoothstep по прогрессу countdown: мягко сводим дрейф к нулю
            const settleEase = p * p * (3 - 2 * p)
            driftStrength = 1 - settleEase
        }

        return {
            'left': `${planet.xPercent}%`,
            'top': `${planet.yPercent}%`,
            'width': `${planet.sizePercent}%`,
            'height': `${planet.sizePercent}%`,
            'transform': `translate(-50%, -50%) translateY(${offsetVh}vh)`,
            '--planet-drift-duration': `${planet.driftDurationMs}ms`,
            '--planet-drift-delay': `${planet.driftDelayMs}ms`,
            '--planet-drift-amplitude': `${planet.driftAmplitudeCqw}cqw`,
            '--planet-drift-strength': `${driftStrength}`
        }
    }

    return {
        planetsOpacityClass,
        planetStyle
    }
}
