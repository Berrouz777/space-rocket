<template>
    <button
        type="button"
        class="base-button-core flex h-full w-full items-center justify-center font-abeezee text-game-xl leading-none text-[#FBCF67] transition-opacity [text-shadow:0px_0px_7px_#F65858] active:opacity-80 disabled:cursor-not-allowed disabled:text-[#673420] disabled:[text-shadow:none] md:text-game-2xl"
        :disabled="props.disabled"
        @click="emit('click', $event)"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
    import type { BaseButtonProps } from './types/base-button.types'

    const props = withDefaults(defineProps<BaseButtonProps>(), {
        disabled: false
    })

    const emit = defineEmits<{
        click: [event: MouseEvent]
    }>()
</script>

<style scoped>
    .base-button-core :deep(svg) {
        filter: drop-shadow(0px 0px 7px #f65858);
    }

    .base-button-core:disabled :deep(svg) {
        filter: none;
    }
</style>
