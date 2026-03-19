import { computed, onUnmounted, ref, watch, type Ref } from 'vue'

import { FLIGHT_ROCKET_EXPLOSION_DURATION_MS } from '~/modules/game/rocket-flight'

export const useFlightRocketExplosion = (isVisible: Ref<boolean>, frames: string[]) => {
    const frameIndex = ref<number>(0)
    const intervalId = ref<number | null>(null)

    const stop = () => {
        if (intervalId.value !== null) {
            window.clearInterval(intervalId.value)
            intervalId.value = null
        }
    }

    const start = () => {
        stop()
        frameIndex.value = 0

        if (frames.length <= 1) {
            return
        }

        const stepMs = Math.max(16, Math.floor(FLIGHT_ROCKET_EXPLOSION_DURATION_MS / frames.length))

        intervalId.value = window.setInterval(() => {
            if (frameIndex.value >= frames.length - 1) {
                stop()
                return
            }
            frameIndex.value += 1
        }, stepMs)
    }

    watch(
        isVisible,
        (next: boolean) => {
            if (!next) {
                stop()
                frameIndex.value = 0
                return
            }

            start()
        },
        { immediate: true }
    )

    onUnmounted(() => stop())

    const frameSrc = computed<string>(() => frames[frameIndex.value] ?? frames[0] ?? '')

    return {
        frameIndex,
        frameSrc
    }
}
