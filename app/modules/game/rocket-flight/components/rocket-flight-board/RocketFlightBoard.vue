<template>
    <div class="relative h-full w-full overflow-hidden bg-[#130737]">
        <div
            class="duration-400 absolute inset-y-0 -left-px -right-px bg-[#130737] transition-opacity"
            :class="isBlurBackgroundVisible ? 'opacity-0' : 'opacity-100'"
            :style="backgroundStyle"
        />
        <div
            class="absolute inset-y-0 -left-px -right-px bg-[#130737] transition-opacity duration-700"
            :class="isBlurBackgroundVisible ? 'opacity-100' : 'opacity-0'"
            :style="blurBackgroundStyle"
        />

        <div class="board-content-shell absolute inset-y-0 left-1/2 h-full w-full -translate-x-1/2 [container-type:inline-size]">
            <TopProgress :multiplier="multiplier" />

            <div class="absolute inset-0" :class="isIdleFloatActive ? 'board-idle-float' : ''">
                <div class="absolute bottom-0 left-1/2 z-10 w-[90%] -translate-x-1/2 transition-all duration-300" :style="moonStyle">
                    <img class="block w-full" :src="moonImage" alt="" />
                    <div class="pointer-events-none absolute left-0 top-0 h-full w-full" aria-hidden="true">
                        <div class="absolute top-[50%] h-[60%] w-[30%] rounded-[50%] bg-black/40" :style="moonShadowStyle" />
                    </div>
                </div>

                <FlightRocket
                    :wrapper-style="rocketWrapperStyle"
                    :long-flame-style="longFlameStyle"
                    :long-flame-scale-y="longFlameScaleY"
                    :fair-launch-t="fairLaunchT"
                    :fair-mode="fairMode"
                    :is-explosion-visible="isExplosionVisible"
                    :is-crashed="phase === 'crashed'"
                />
            </div>

            <FlightPlanets :phase="phase" :launch-progress="launchProgress" />
            <FlightAsteroids :asteroids="props.asteroids" :phase="phase" :is-flying="phase === 'flying'" />

            <div class="pointer-events-none absolute inset-0 -top-[30%] z-50 flex items-center justify-center">
                <p v-if="isMultiplierVisible" class="text-game-2xl font-black text-white drop-shadow-[0_0.6cqw_1cqw_rgba(0,0,0,0.9)]">
                    {{ multiplierText }}
                </p>
            </div>

            <div v-if="phase === 'countdown'" class="absolute inset-0 z-[60] flex items-center justify-center text-game-2xl font-black text-white">
                {{ countdownValue }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    // Components
    import TopProgress from './components/top-progress/TopProgress.vue'
    import FlightRocket from './components/flight-rocket/FlightRocket.vue'
    import FlightAsteroids from './components/flight-asteroids/FlightAsteroids.vue'
    import FlightPlanets from './components/flight-planets/FlightPlanets.vue'

    // Composables
    import { useRocketFlightBoard } from './composables/use-rocket-flight-board'

    // Assets
    import moonImage from '~/assets/moon.png'

    // Types
    import type { RocketFlightBoardProps } from './types/rocket-flight-board.types'

    // Props
    const props = defineProps<RocketFlightBoardProps>()

    const {
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
        multiplierText,
        isMultiplierVisible,
        isIdleFloatActive
    } = useRocketFlightBoard(props)
</script>

<style scoped>
    .board-content-shell {
        width: min(100%, calc(100svh / 2.04));
    }

    @supports not (height: 100svh) {
        .board-content-shell {
            width: min(100%, calc(100vh / 2.04));
        }
    }

    .board-idle-float {
        animation: board-idle-float 5.2s ease-in-out infinite;
        will-change: transform;
    }

    @keyframes board-idle-float {
        0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
        }
        25% {
            transform: translate3d(0.25cqw, -0.35cqw, 0) rotate(-0.2deg);
        }
        50% {
            transform: translate3d(0, -0.65cqw, 0) rotate(0deg);
        }
        75% {
            transform: translate3d(-0.25cqw, -0.3cqw, 0) rotate(0.2deg);
        }
        100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
        }
    }
</style>
