<template>
    <div v-if="mode !== 'off'" class="pointer-events-none absolute left-0 top-0 z-[6] flex w-full justify-center">
        <img class="h-auto rotate-180 select-none object-contain" :class="imgWidthClass" :src="frameSrc" alt="" aria-hidden="true" />
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    import fair1 from '~/assets/fair/fair-1.png'
    import fair2 from '~/assets/fair/fair-2.png'
    import fair3 from '~/assets/fair/fair-3.png'
    import fair4 from '~/assets/fair/fair-4.png'
    import fair5 from '~/assets/fair/fair-5.png'
    import fair6 from '~/assets/fair/fair-6.png'
    import fair7 from '~/assets/fair/fair-7.png'
    import fair8 from '~/assets/fair/fair-8.png'
    import fair9 from '~/assets/fair/fair-9.png'
    import fair10 from '~/assets/fair/fair-10.png'
    import fair11 from '~/assets/fair/fair-11.png'
    import fair12 from '~/assets/fair/fair-12.png'

    import { useFlightRocketFairFly } from './composables/use-flight-rocket-fair-fly'

    import type { FlightRocketFairProps } from './types/flight-rocket-fair.types'

    const props = defineProps<FlightRocketFairProps>()

    const launchFrames = [fair1, fair2, fair3]
    const flyFrames = [fair4, fair5, fair6, fair7, fair8, fair9, fair10, fair11, fair12]

    // В launch фазе выбираем кадр синхронно со scaleY длинного пламени (0..1).
    const launchFrameSrc = computed<string>(() => {
        const t = Math.min(1, Math.max(0, props.launchScaleY))
        const idx = Math.min(launchFrames.length - 1, Math.floor(t * launchFrames.length))
        return launchFrames[idx]!
    })

    const { frameSrc: flyFrameSrc } = useFlightRocketFairFly(
        computed(() => props.mode === 'fly'),
        flyFrames
    )

    const imgWidthClass = computed<string>(() => (props.mode === 'launch' ? 'w-[65%]' : 'w-[80%]'))

    const frameSrc = computed<string>(() => (props.mode === 'launch' ? launchFrameSrc.value : flyFrameSrc.value))
</script>
