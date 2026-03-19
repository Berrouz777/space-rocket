<template>
    <div
        v-if="isVisible"
        class="flight-rocket-explosion pointer-events-none absolute left-1/2 top-1/2 z-50 h-[500%] w-[500%] -translate-x-1/2 -translate-y-1/2"
        :style="explosionStyle"
    >
        <img class="h-full w-full select-none object-contain" :src="frameSrc" alt="" aria-hidden="true" />
    </div>
</template>

<script setup lang="ts">
    import { toRef } from 'vue'

    import frame1 from '~/assets/explosion/explosion-1.png'
    import frame2 from '~/assets/explosion/explosion-2.png'
    import frame3 from '~/assets/explosion/explosion-3.png'
    import frame4 from '~/assets/explosion/explosion-4.png'
    import frame5 from '~/assets/explosion/explosion-5.png'
    import frame6 from '~/assets/explosion/explosion-6.png'
    import frame7 from '~/assets/explosion/explosion-7.png'
    import frame8 from '~/assets/explosion/explosion-8.png'
    import frame9 from '~/assets/explosion/explosion-9.png'
    import frame10 from '~/assets/explosion/explosion-10.png'

    import { useFlightRocketExplosion } from './composables/use-flight-rocket-explosion'
    import { FLIGHT_ROCKET_EXPLOSION_DURATION_MS } from '~/modules/game/rocket-flight'

    export interface FlightRocketExplosionProps {
        isVisible: boolean
    }

    const props = defineProps<FlightRocketExplosionProps>()

    const frames = [frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8, frame9, frame10]
    const { frameSrc } = useFlightRocketExplosion(toRef(props, 'isVisible'), frames)

    const explosionStyle = {
        animationDuration: `${FLIGHT_ROCKET_EXPLOSION_DURATION_MS}ms`
    }
</script>

<style scoped>
    @keyframes flight-rocket-explosion-fade {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
        }
        18% {
            opacity: 1;
        }
        82% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.05);
        }
    }

    .flight-rocket-explosion {
        will-change: opacity, transform;
        animation-name: flight-rocket-explosion-fade;
        animation-timing-function: linear;
        animation-fill-mode: both;
    }
</style>
