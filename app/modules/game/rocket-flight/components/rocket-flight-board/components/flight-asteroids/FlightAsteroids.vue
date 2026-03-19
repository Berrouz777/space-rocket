<template>
    <div class="absolute inset-0 z-20">
        <img
            v-for="asteroid in asteroids"
            :key="asteroid.id"
            class="absolute block h-full w-full select-none object-contain"
            :style="asteroidStyle(asteroid)"
            :src="getAsteroidImage(asteroid)"
            alt=""
            draggable="false"
        />
    </div>
</template>

<script setup lang="ts">
    import { useFlightAsteroidsBoard } from './composables/use-flight-asteroids-board'

    import type { FlightAsteroidsProps } from './types/flight-asteroids.types'

    const props = defineProps<FlightAsteroidsProps>()

    const { asteroidStyle, getAsteroidImage } = useFlightAsteroidsBoard()

    const asteroids = computed(() => props.asteroids)
</script>
