<template>
    <ContentWrapper class="h-full w-full" :disabled="props.disabled">
        <div class="flex h-full w-full justify-between overflow-hidden">
            <BaseButtonCore class="w-max px-[6%] text-game-3xl disabled:border-[#976552]" :disabled="props.disabled" @click="emit('decrease')">
                <SvgMinus class="h-[clamp(20px,9cqw,56px)] w-[clamp(20px,9cqw,56px)]" />
            </BaseButtonCore>

            <div
                class="flex h-full flex-1 items-center justify-center font-abeezee text-game-xl leading-none text-[#FBCF67] [text-shadow:0px_0px_7px_#F65858] md:text-game-2xl"
                :class="props.disabled ? 'text-[#673420] [text-shadow:none]' : ''"
            >
                {{ props.value }}
            </div>

            <BaseButtonCore class="w-max px-[6%] text-game-3xl disabled:border-[#976552]" :disabled="props.disabled" @click="emit('increase')">
                <SvgPlus class="h-[clamp(20px,9cqw,56px)] w-[clamp(20px,9cqw,56px)]" />
            </BaseButtonCore>
        </div>
    </ContentWrapper>
</template>

<script setup lang="ts">
    import ContentWrapper from '../content-wrapper/ContentWrapper.vue'
    import BaseButtonCore from '../buttons/components/base-button/BaseButtonCore.vue'
    import type { BetControlPanelProps } from './type/bet-control-panel.types'
    import SvgPlus from '../buttons/components/icons/svg-plus/SvgPlus.vue'
    import SvgMinus from '../buttons/components/icons/svg-minus/SvgMinus.vue'

    const props = withDefaults(defineProps<BetControlPanelProps>(), {
        disabled: false
    })

    const emit = defineEmits<{
        decrease: []
        increase: []
    }>()
</script>
