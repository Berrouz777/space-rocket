<template>
    <div class="absolute inset-0 z-20" :style="asteroidsFadeStyle">
        <div v-for="asteroid in asteroids" :key="asteroid.id" class="absolute" :style="asteroidStyle(asteroid)">
            <img class="absolute inset-0 block h-full w-full select-none object-contain" :src="getAsteroidImage(asteroid)" alt="" draggable="false" />
            <img
                v-if="getBlurAsteroidImage(asteroid)"
                class="absolute inset-0 block h-full w-full select-none object-contain transition-opacity duration-200"
                :class="props.isFlying ? 'opacity-100' : 'opacity-0'"
                :src="getBlurAsteroidImage(asteroid)"
                alt=""
                draggable="false"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useFlightAsteroidsBoard } from './composables/use-flight-asteroids-board'

    import type { FlightAsteroidsProps } from './types/flight-asteroids.types'
    import { FLIGHT_CASHOUT_TO_IDLE_DELAY_MS, FLIGHT_CRASH_TO_IDLE_DELAY_MS, FLIGHT_ROCKET_EXPLOSION_DURATION_MS } from '../../../../constants'

    const props = defineProps<FlightAsteroidsProps>()

    const { asteroidStyle, getAsteroidImage, getBlurAsteroidImage } = useFlightAsteroidsBoard()

    const asteroids = computed(() => props.asteroids)

    const asteroidsFadeStyle = computed<Record<string, string | number>>(() => {
        const baseStyle = {
            transitionProperty: 'opacity',
            transitionTimingFunction: 'linear'
        }

        if (props.phase === 'crashed') {
            const durationMs = Math.max(0, FLIGHT_CRASH_TO_IDLE_DELAY_MS - FLIGHT_ROCKET_EXPLOSION_DURATION_MS)
            return {
                ...baseStyle,
                opacity: 0,
                transitionDelay: `${FLIGHT_ROCKET_EXPLOSION_DURATION_MS}ms`,
                transitionDuration: `${durationMs}ms`
            }
        }

        if (props.phase === 'cashed_out') {
            return {
                ...baseStyle,
                opacity: 0,
                transitionDelay: '0ms',
                transitionDuration: `${FLIGHT_CASHOUT_TO_IDLE_DELAY_MS}ms`
            }
        }

        return {
            ...baseStyle,
            opacity: 1,
            transitionDelay: '0ms',
            transitionDuration: '0ms'
        }
    })
</script>
