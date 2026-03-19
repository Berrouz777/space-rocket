<template>
    <div class="relative h-full w-full overflow-hidden bg-[#130737] [container-type:inline-size]">
        <div class="absolute inset-0 bg-[#130737]" :style="backgroundStyle" />

        <TopProgress :multiplier="multiplier" />

        <div class="absolute bottom-0 left-1/2 z-10 w-[90%] -translate-x-1/2 transition-all duration-300" :style="moonStyle">
            <img class="block w-full" :src="moonImage" alt="" />
            <div class="pointer-events-none absolute left-0 top-0 h-full w-full" aria-hidden="true">
                <div class="absolute top-[50%] h-[60%] w-[30%] rounded-[50%] bg-black/40" :style="moonShadowStyle" />
            </div>
        </div>

        <FlightAsteroids :asteroids="props.asteroids" />

        <FlightRocket
            :wrapper-style="rocketWrapperStyle"
            :long-flame-style="longFlameStyle"
            :long-flame-scale-y="longFlameScaleY"
            :fair-launch-t="fairLaunchT"
            :fair-mode="fairMode"
            :is-explosion-visible="isExplosionVisible"
            :is-crashed="phase === 'crashed'"
        />

        <div class="pointer-events-none absolute inset-0 -top-[30%] z-50 flex items-center justify-center">
            <p v-if="isMultiplierVisible" class="text-game-2xl font-black text-white drop-shadow-[0_0.6cqw_1cqw_rgba(0,0,0,0.9)]">
                {{ multiplierText }}
            </p>
        </div>

        <div v-if="phase === 'countdown'" class="absolute inset-0 z-[60] flex items-center justify-center text-game-2xl font-black text-white">
            {{ countdownValue }}
        </div>
    </div>
</template>

<script setup lang="ts">
    // Components
    import TopProgress from './components/top-progress/TopProgress.vue'
    import FlightRocket from './components/flight-rocket/FlightRocket.vue'
    import FlightAsteroids from './components/flight-asteroids/FlightAsteroids.vue'

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
        moonStyle,
        moonShadowStyle,
        rocketWrapperStyle,
        longFlameStyle,
        longFlameScaleY,
        fairLaunchT,
        fairMode,
        multiplierText,
        isMultiplierVisible
    } = useRocketFlightBoard(props)
</script>
