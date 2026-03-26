import { computed, type Ref } from 'vue'
import { FLIGHT_POST_CASHOUT_REVEAL_DURATION_MS } from '../../../../../constants'
import { formatMultiplier } from '../../../../../composables/use-flight-curve'
import { clamp, lerp } from '../../../../../utils/math.utils'
import type { FlightPostCashoutSummary, FlightRoundPhase } from '../../../../../types'
import {
    TOP_PROGRESS_REVEAL_ROCKET_SCALE_FROM,
    TOP_PROGRESS_REVEAL_ROCKET_SCALE_TO,
    TOP_PROGRESS_ROCKET_WIDTH_PERCENT
} from '../constants/top-progress.constants'
import { usePostCashoutReveal } from './use-post-cashout-reveal'
import { fromTopProgressPercent, getTopProgressTicks, toTopProgressPercent } from './use-top-progress-scale'

export const useTopProgress = (params: { multiplier: Ref<number>; phase: Ref<FlightRoundPhase>; postCashoutSummary: Ref<FlightPostCashoutSummary> }) => {
    const isPostCashoutRevealActive = computed<boolean>(() => params.phase.value === 'post_cashed_out' && params.postCashoutSummary.value.isActive)
    const isPostCashoutLockedAtMax = computed<boolean>(
        () => params.phase.value === 'cashed_out' && !params.postCashoutSummary.value.isActive && params.postCashoutSummary.value.virtualCrashMultiplier > 1
    )

    const { revealProgress } = usePostCashoutReveal(isPostCashoutRevealActive, FLIGHT_POST_CASHOUT_REVEAL_DURATION_MS)

    const revealEasedProgress = computed<number>(() => clamp(revealProgress.value, 0, 1))

    const revealProgressPercent = computed<number>(() => {
        const summary = params.postCashoutSummary.value
        const startPercent = toTopProgressPercent(summary.cashoutMultiplier)
        const endPercent = toTopProgressPercent(summary.virtualCrashMultiplier)
        return lerp(startPercent, endPercent, revealEasedProgress.value)
    })

    const progressPercent = computed<number>(() => {
        if (isPostCashoutRevealActive.value) {
            return revealProgressPercent.value
        }

        if (isPostCashoutLockedAtMax.value) {
            return toTopProgressPercent(params.postCashoutSummary.value.virtualCrashMultiplier)
        }

        return toTopProgressPercent(params.multiplier.value)
    })

    const revealDisplayMultiplier = computed<number>(() => {
        if (!isPostCashoutRevealActive.value) {
            if (isPostCashoutLockedAtMax.value) {
                return params.postCashoutSummary.value.virtualCrashMultiplier
            }
            return params.multiplier.value
        }

        return fromTopProgressPercent(revealProgressPercent.value)
    })

    const rocketLeftPercent = computed<number>(() =>
        clamp(progressPercent.value, TOP_PROGRESS_ROCKET_WIDTH_PERCENT / 2, 100 - TOP_PROGRESS_ROCKET_WIDTH_PERCENT / 2)
    )
    const rocketRevealScale = computed<number>(() => {
        if (isPostCashoutRevealActive.value) {
            return lerp(TOP_PROGRESS_REVEAL_ROCKET_SCALE_FROM, TOP_PROGRESS_REVEAL_ROCKET_SCALE_TO, revealEasedProgress.value)
        }

        if (isPostCashoutLockedAtMax.value) {
            return TOP_PROGRESS_REVEAL_ROCKET_SCALE_TO
        }

        return TOP_PROGRESS_REVEAL_ROCKET_SCALE_FROM
    })
    const revealMultiplierText = computed<string>(() => formatMultiplier(revealDisplayMultiplier.value))
    const isTicksVisible = computed<boolean>(() => !isPostCashoutRevealActive.value && !isPostCashoutLockedAtMax.value)

    const ticks = computed(() => getTopProgressTicks())

    return {
        progressPercent,
        rocketLeftPercent,
        ticks,
        revealMultiplierText,
        rocketRevealScale,
        isPostCashoutRevealActive,
        isTicksVisible
    }
}
