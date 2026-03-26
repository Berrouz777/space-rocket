<template>
    <div class="absolute left-[3%] right-[3%] top-[4%] z-30 rounded-[1.2%]">
        <div class="relative">
            <div class="relative h-[clamp(3px,0.8cqw,10px)] w-full bg-black/70">
                <div class="h-full rounded-full bg-[linear-gradient(90deg,_#FFFF29_0%,_#FF8142_100%)]" :style="{ width: `${rocketLeftPercent}%` }" />

                <div
                    v-for="tick in ticks"
                    :key="tick.value"
                    class="absolute top-1/2 h-[400%] w-[1%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(-180deg,_#FFFF29_0%,_#FF8142_100%)] transition-opacity duration-500"
                    :class="isTicksVisible ? 'opacity-100' : 'opacity-0'"
                    :style="{ left: `${tick.percent}%` }"
                />

                <div
                    class="absolute top-1/2 z-10"
                    :style="{
                        left: `${rocketLeftPercent}%`,
                        transform: `translate(-50%, -50%) scale(${rocketRevealScale})`
                    }"
                >
                    <img class="w-[5cqw] rotate-90" :src="rocketImage" alt="" />
                    <p
                        v-if="isPostCashoutRevealActive"
                        class="pointer-events-none absolute left-1/2 top-[110%] -translate-x-1/2 whitespace-nowrap text-game-base font-black text-white drop-shadow-[0_0.4cqw_0.8cqw_rgba(0,0,0,0.9)]"
                    >
                        {{ revealMultiplierText }}
                    </p>
                </div>
            </div>
        </div>

        <div
            class="relative mt-[3%] h-[2.2%] text-game-base font-black text-white transition-opacity duration-500"
            :class="isTicksVisible ? 'opacity-100' : 'opacity-0'"
        >
            <span
                v-for="tick in ticks"
                :key="`${tick.value}-label`"
                class="absolute"
                :class="tick.value === 10000 ? 'right-0' : '-translate-x-1/2'"
                :style="tick.value === 10000 ? undefined : { left: `${tick.labelLeftPercent}%` }"
            >
                {{ tick.label }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    // Assets
    import rocketImage from '~/assets/rocket.png'

    // Composables
    import { useTopProgress } from './composables/use-top-progress'

    // Types
    import type { TopProgressProps } from './types/top-progress.types'

    // Props
    const props = defineProps<TopProgressProps>()

    // Computed
    const { rocketLeftPercent, ticks, revealMultiplierText, rocketRevealScale, isPostCashoutRevealActive, isTicksVisible } = useTopProgress({
        multiplier: toRef(props, 'multiplier'),
        phase: toRef(props, 'phase'),
        postCashoutSummary: toRef(props, 'postCashoutSummary')
    })
</script>
