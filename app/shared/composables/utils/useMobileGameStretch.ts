interface UseMobileGameStretchOptions {
    mobileMaxWidth?: number
}

export const useMobileGameStretch = (options: UseMobileGameStretchOptions = {}) => {
    const mobileMaxWidth = options.mobileMaxWidth ?? 599
    const gameStretchShellRef = ref<HTMLElement | null>(null)
    const gameContainerRef = ref<HTMLElement | null>(null)
    const gameScaleX = ref<number>(1)

    const updateMobileScale = () => {
        if (!import.meta.client) {
            return
        }

        const shell = gameStretchShellRef.value
        const container = gameContainerRef.value
        if (!shell || !container) {
            return
        }

        if (window.innerWidth > mobileMaxWidth) {
            gameScaleX.value = 1
            return
        }

        const shellWidth = shell.clientWidth
        const containerWidth = container.offsetWidth
        if (!shellWidth || !containerWidth) {
            gameScaleX.value = 1
            return
        }

        gameScaleX.value = shellWidth > containerWidth ? shellWidth / containerWidth : 1
    }

    const gameContainerStyle = computed<Record<string, string>>(() => ({
        transform: gameScaleX.value > 1 ? `scaleX(${gameScaleX.value})` : 'none'
    }))

    onMounted(async () => {
        await nextTick()
        updateMobileScale()
        requestAnimationFrame(updateMobileScale)
        window.addEventListener('resize', updateMobileScale)
        window.visualViewport?.addEventListener('resize', updateMobileScale)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateMobileScale)
        window.visualViewport?.removeEventListener('resize', updateMobileScale)
    })

    return {
        gameStretchShellRef,
        gameContainerRef,
        gameScaleX,
        gameContainerStyle,
        updateMobileScale
    }
}
