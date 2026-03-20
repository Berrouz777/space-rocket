<template>
    <div class="pointer-events-none absolute inset-0 z-[8] transition-opacity duration-150" :class="planetsOpacityClass">
        <div v-for="planet in PLANETS" :key="planet.id" class="absolute h-full w-full will-change-transform" :style="planetStyle(planet)">
            <div class="planet-drift h-full w-full">
                <img class="h-full w-full select-none object-contain" :src="planet.image" alt="" draggable="false" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { FlightPlanetsProps } from './types/flight-planets.types'
    import { PLANETS } from './constants/flight-planets.constants'
    import { useFlightPlanets } from './composables/use-flight-planets'

    const props = defineProps<FlightPlanetsProps>()
    const { planetsOpacityClass, planetStyle } = useFlightPlanets(props)
</script>

<style scoped>
    .planet-drift {
        animation: planet-drift-x var(--planet-drift-duration) ease-in-out var(--planet-drift-delay) infinite;
        will-change: transform;
    }

    @keyframes planet-drift-x {
        0% {
            transform: translate3d(calc(var(--planet-drift-amplitude) * var(--planet-drift-strength) * -1), 0, 0);
        }
        50% {
            transform: translate3d(calc(var(--planet-drift-amplitude) * var(--planet-drift-strength)), 0, 0);
        }
        100% {
            transform: translate3d(calc(var(--planet-drift-amplitude) * var(--planet-drift-strength) * -1), 0, 0);
        }
    }
</style>
