<template>
    <div class="absolute left-1/2 top-1/2 z-30 w-[22%] transition-all duration-150 ease-linear" :style="wrapperStyle">
        <div class="pointer-events-none absolute left-1/2 top-[93%] z-0 w-[50%] -translate-x-1/2">
            <img
                class="h-full w-full origin-top object-contain transition-transform duration-150"
                :style="longFlameStyle"
                :src="longFairImage"
                alt=""
                aria-hidden="true"
            />

            <FlightRocketFair :mode="fairMode" :launch-scale-y="fairLaunchT" />
        </div>

        <img class="relative z-10 w-full object-contain transition-opacity duration-150" :class="rocketOpacityClass" :src="rocketImage" alt="" />

        <FlightRocketExplosion :is-visible="isExplosionVisible" />
    </div>
</template>

<script setup lang="ts">
    import { onUnmounted, ref, watch } from 'vue'

    import longFairImage from '~/assets/long-fair.png'
    import rocketImage from '~/assets/rocket.png'

    import FlightRocketFair from './components/flight-rocket-fair/FlightRocketFair.vue'
    import FlightRocketExplosion from './components/flight-rocket-explosion/FlightRocketExplosion.vue'

    import type { FlightRocketProps } from './types/flight-rocket.types'

    const props = defineProps<FlightRocketProps>()

    const isReturnDelayActive = ref(false)
    let returnDelayTimeoutId: number | null = null

    watch(
        () => props.isCrashed,
        (nextIsCrashed: boolean, prevIsCrashed: boolean) => {
            if (prevIsCrashed && !nextIsCrashed) {
                if (returnDelayTimeoutId !== null) {
                    window.clearTimeout(returnDelayTimeoutId)
                }
                isReturnDelayActive.value = true
                // Даём контейнеру ракеты доехать на луну, затем плавно показываем.
                returnDelayTimeoutId = window.setTimeout(() => {
                    isReturnDelayActive.value = false
                    returnDelayTimeoutId = null
                }, 220)
            }
        }
    )

    onUnmounted(() => {
        if (returnDelayTimeoutId !== null) {
            window.clearTimeout(returnDelayTimeoutId)
        }
    })

    const rocketOpacityClass = computed(() => {
        if (props.isExplosionVisible) {
            return 'opacity-0 delay-[120ms]'
        }

        if (props.isCrashed || isReturnDelayActive.value) {
            return 'opacity-0 delay-0'
        }

        return 'opacity-100 delay-0'
    })
</script>
