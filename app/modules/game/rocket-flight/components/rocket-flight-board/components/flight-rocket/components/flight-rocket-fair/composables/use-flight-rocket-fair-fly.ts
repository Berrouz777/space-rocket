import { computed, onUnmounted, ref, watch, type Ref } from 'vue'

import { FLIGHT_ROCKET_FAIR_FLY_FRAME_MS } from '../constants/flight-rocket-fair.constants'

export const useFlightRocketFairFly = (isActive: Ref<boolean>, frames: string[]) => {
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

        intervalId.value = window.setInterval(() => {
            frameIndex.value = (frameIndex.value + 1) % frames.length
        }, FLIGHT_ROCKET_FAIR_FLY_FRAME_MS)
    }

    watch(
        isActive,
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
