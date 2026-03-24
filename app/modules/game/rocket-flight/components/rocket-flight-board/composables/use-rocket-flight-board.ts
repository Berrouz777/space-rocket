import { computed, onUnmounted, ref, watch } from 'vue'

import backgroundStarsImage from '~/assets/background-stars.png'
import backgroundStarsBlurImage from '~/assets/background-stars_blur.png'
import { formatMultiplier } from '../../../composables/use-flight-curve'
import { clamp, lerp } from '../../../utils/math.utils'
import {
    LAUNCH_ANIMATION_MS,
    LONG_FLAME_RAMP,
    LONG_FLAME_START_PROGRESS,
    ROCKET_SCALE_END,
    ROCKET_SCALE_START
} from '../constants/rocket-flight-board.constants'
import { ROCKET_DODGE_TILT_MAX_DEG } from '../../../constants'

import type { FlightRoundPhase } from '../../../types/flight.types'
import type { RocketFlightBoardProps } from '../types/rocket-flight-board.types'

const BLUR_PARALLAX_MAX_OFFSET_PERCENT = 20

export const useRocketFlightBoard = (props: RocketFlightBoardProps) => {
    const launchSmoothProgress = ref<number>(0)
    const launchStartedAt = ref<number | null>(null)
    const launchFrameId = ref<number | null>(null)
    const blurParallaxOffsetPercent = ref<number>(0)
    const blurParallaxLastTimestamp = ref<number | null>(null)
    const blurParallaxFrameId = ref<number | null>(null)

    const stopLaunchAnimation = () => {
        if (launchFrameId.value !== null) {
            cancelAnimationFrame(launchFrameId.value)
            launchFrameId.value = null
        }
    }

    const stopBlurParallaxAnimation = () => {
        if (blurParallaxFrameId.value !== null) {
            cancelAnimationFrame(blurParallaxFrameId.value)
            blurParallaxFrameId.value = null
        }
    }

    const tickBlurParallaxAnimation = (timestamp: number) => {
        if (props.phase !== 'flying') {
            blurParallaxLastTimestamp.value = null
            return
        }

        if (blurParallaxLastTimestamp.value === null) {
            blurParallaxLastTimestamp.value = timestamp
        }

        const deltaMs = timestamp - blurParallaxLastTimestamp.value
        blurParallaxLastTimestamp.value = timestamp

        // Медленный, но заметный сдвиг вниз во время полёта (эффект параллакса).
        const shiftPerSecondPercent = 2
        const next = blurParallaxOffsetPercent.value + (deltaMs / 1000) * shiftPerSecondPercent
        blurParallaxOffsetPercent.value = Math.min(next, BLUR_PARALLAX_MAX_OFFSET_PERCENT)
        blurParallaxFrameId.value = requestAnimationFrame(tickBlurParallaxAnimation)
    }

    const tickLaunchAnimation = (timestamp: number) => {
        if (props.phase !== 'launching') {
            return
        }

        if (launchStartedAt.value === null) {
            launchStartedAt.value = timestamp
        }

        const elapsed = timestamp - launchStartedAt.value
        launchSmoothProgress.value = clamp(elapsed / LAUNCH_ANIMATION_MS, 0, 1)
        launchFrameId.value = requestAnimationFrame(tickLaunchAnimation)
    }

    watch(
        () => props.phase,
        (nextPhase: FlightRoundPhase) => {
            if (nextPhase === 'idle') {
                stopLaunchAnimation()
                stopBlurParallaxAnimation()
                launchStartedAt.value = null
                launchSmoothProgress.value = 0
                blurParallaxLastTimestamp.value = null
                blurParallaxOffsetPercent.value = 0
                return
            }

            if (nextPhase === 'countdown') {
                stopLaunchAnimation()
                stopBlurParallaxAnimation()
                launchStartedAt.value = null
                launchSmoothProgress.value = 0
                blurParallaxLastTimestamp.value = null
                blurParallaxOffsetPercent.value = 0
                return
            }

            if (nextPhase === 'launching') {
                stopLaunchAnimation()
                stopBlurParallaxAnimation()
                launchStartedAt.value = null
                launchSmoothProgress.value = 0
                blurParallaxLastTimestamp.value = null
                blurParallaxOffsetPercent.value = 0
                launchFrameId.value = requestAnimationFrame(tickLaunchAnimation)
                return
            }

            stopLaunchAnimation()
            launchSmoothProgress.value = 1

            if (nextPhase === 'flying') {
                stopBlurParallaxAnimation()
                blurParallaxLastTimestamp.value = null
                blurParallaxFrameId.value = requestAnimationFrame(tickBlurParallaxAnimation)
                return
            }

            stopBlurParallaxAnimation()
            blurParallaxLastTimestamp.value = null
        },
        { immediate: true }
    )

    onUnmounted(() => {
        stopLaunchAnimation()
        stopBlurParallaxAnimation()
    })

    const launchProgress = computed<number>(() => {
        if (props.phase === 'idle') {
            return 0
        }

        if (props.phase === 'countdown') {
            return 0
        }

        if (props.phase === 'launching') {
            return clamp(launchSmoothProgress.value, 0, 1)
        }

        return 1
    })

    const backgroundStyle = computed<Record<string, string>>(() => ({
        backgroundImage: `url(${backgroundStarsImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }))

    const blurBackgroundStyle = computed<Record<string, string>>(() => ({
        backgroundImage: `url(${backgroundStarsBlurImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `center ${100 - blurParallaxOffsetPercent.value}%`
    }))

    const isBlurBackgroundVisible = computed<boolean>(() => props.phase === 'flying')

    const moonStyle = computed<Record<string, string>>(() => ({
        transform: `translate(-50%, ${lerp(0, 140, launchProgress.value)}%) scale(${lerp(1, 0.46, launchProgress.value)})`
    }))

    const moonShadowStyle = computed<Record<string, string>>(() => {
        const xWithinMoon = clamp(50 + (props.rocketXPercent - 50) / 0.9, 0, 100)
        const scale = lerp(1, 0, launchProgress.value)

        return {
            left: `${xWithinMoon}%`,
            transform: `translate(-50%, -50%) scale(${scale}) scaleY(0.75)`
        }
    })

    const rocketWrapperStyle = computed<Record<string, string>>(() => ({
        left: `${props.rocketXPercent}%`,
        top: `${lerp(81, 56, launchProgress.value)}%`,
        transform:
            props.phase === 'idle' || props.phase === 'countdown' || props.phase === 'launching'
                ? `translate(-50%, -50%) scale(${lerp(ROCKET_SCALE_START, ROCKET_SCALE_END, launchProgress.value)})`
                : `translate(-50%, -50%) scale(${props.rocketScale}) rotate(${props.rocketDodgeNormalized * ROCKET_DODGE_TILT_MAX_DEG}deg)`
    }))

    const longFlameScaleY = computed<number>(() => {
        if (props.phase === 'idle' || props.phase === 'countdown') {
            return 0
        }

        if (props.isExplosionVisible) {
            return 0
        }

        if (props.phase === 'launching') {
            return clamp((launchProgress.value - LONG_FLAME_START_PROGRESS) / LONG_FLAME_RAMP, 0, 1)
        }

        if (props.phase === 'flying') {
            return 1
        }

        return 0
    })

    // Короткое пламя (fair-1..3) стартует чуть раньше long-fair.
    const fairLaunchT = computed<number>(() => {
        if (props.phase !== 'launching') {
            return 0
        }
        return launchProgress.value
    })

    const longFlameStyle = computed<Record<string, string>>(() => ({
        transform: `scaleY(${longFlameScaleY.value})`
    }))

    const fairMode = computed<'off' | 'launch' | 'fly'>(() => {
        if (props.isExplosionVisible) {
            return 'off'
        }

        if (props.phase === 'launching') {
            return 'launch'
        }

        if (props.phase === 'flying') {
            return 'fly'
        }

        return 'off'
    })

    const isIdleFloatActive = computed<boolean>(() => props.phase === 'idle' || props.phase === 'countdown')

    const multiplierText = computed<string>(() => formatMultiplier(props.multiplier))
    const isMultiplierVisible = computed<boolean>(() => props.phase === 'flying' || props.phase === 'crashed' || props.phase === 'cashed_out')

    return {
        backgroundStyle,
        blurBackgroundStyle,
        isBlurBackgroundVisible,
        moonStyle,
        moonShadowStyle,
        rocketWrapperStyle,
        longFlameStyle,
        longFlameScaleY,
        fairLaunchT,
        launchProgress,
        fairMode,
        isIdleFloatActive,
        multiplierText,
        isMultiplierVisible
    }
}
