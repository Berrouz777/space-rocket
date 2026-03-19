import { clamp } from '../../utils/math.utils'

export const useFlowRuntime = () => {
    const animationFrameId = ref<number | null>(null)
    const timeoutIds = ref<number[]>([])
    const lastFrameTime = ref<number>(0)

    const pushTimeout = (handler: () => void, delayMs: number): Promise<void> =>
        new Promise((resolve: () => void) => {
            const timeoutId = window.setTimeout(() => {
                handler()
                resolve()
            }, delayMs)
            timeoutIds.value.push(timeoutId)
        })

    const stopLoop = () => {
        if (animationFrameId.value !== null) {
            cancelAnimationFrame(animationFrameId.value)
            animationFrameId.value = null
        }
    }

    const clearTimeouts = () => {
        timeoutIds.value.forEach((timeoutId: number) => window.clearTimeout(timeoutId))
        timeoutIds.value = []
    }

    const clearRuntime = () => {
        stopLoop()
        clearTimeouts()
        lastFrameTime.value = 0
    }

    const getDeltaSeconds = (timestamp: number) => {
        if (!lastFrameTime.value) {
            lastFrameTime.value = timestamp
        }
        const deltaSeconds = clamp((timestamp - lastFrameTime.value) / 1000, 0, 0.05)
        lastFrameTime.value = timestamp
        return deltaSeconds
    }

    const startLoop = (tick: (timestamp: number, deltaSeconds: number) => void) => {
        stopLoop()
        lastFrameTime.value = 0
        const loop = (timestamp: number) => {
            const deltaSeconds = getDeltaSeconds(timestamp)
            tick(timestamp, deltaSeconds)
            animationFrameId.value = requestAnimationFrame(loop)
        }
        animationFrameId.value = requestAnimationFrame(loop)
    }

    onUnmounted(() => {
        clearRuntime()
    })

    return {
        pushTimeout,
        clearRuntime,
        startLoop,
        stopLoop,
        clearTimeouts,
        lastFrameTime
    }
}
