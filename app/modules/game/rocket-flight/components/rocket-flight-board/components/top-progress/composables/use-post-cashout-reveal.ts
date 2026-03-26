import { onUnmounted, ref, watch, type Ref } from 'vue'
import { clamp } from '../../../../../utils/math.utils'

export const usePostCashoutReveal = (isActive: Ref<boolean>, durationMs: number) => {
    const revealProgress = ref<number>(0)
    const revealStartedAt = ref<number | null>(null)
    const revealFrameId = ref<number | null>(null)

    const stopRevealAnimation = () => {
        if (revealFrameId.value !== null) {
            cancelAnimationFrame(revealFrameId.value)
            revealFrameId.value = null
        }
    }

    const tickRevealAnimation = (timestamp: number) => {
        if (!isActive.value) {
            revealStartedAt.value = null
            return
        }

        if (revealStartedAt.value === null) {
            revealStartedAt.value = timestamp
        }

        const elapsed = timestamp - revealStartedAt.value
        revealProgress.value = clamp(elapsed / durationMs, 0, 1)

        if (revealProgress.value >= 1) {
            revealFrameId.value = null
            return
        }

        revealFrameId.value = requestAnimationFrame(tickRevealAnimation)
    }

    watch(
        isActive,
        (nextIsActive: boolean) => {
            stopRevealAnimation()
            revealStartedAt.value = null
            revealProgress.value = 0

            if (nextIsActive) {
                revealFrameId.value = requestAnimationFrame(tickRevealAnimation)
            }
        },
        { immediate: true }
    )

    onUnmounted(() => {
        stopRevealAnimation()
    })

    return {
        revealProgress
    }
}
