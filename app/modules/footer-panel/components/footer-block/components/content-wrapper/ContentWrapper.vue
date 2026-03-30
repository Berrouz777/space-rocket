<template>
    <div class="rounded-[3px] border-2 bg-[#060F1F]" :class="props.disabled ? 'border-[#976552]' : 'border-[#FF8656]'">
        <slot />
    </div>
</template>

<script setup lang="ts">
    import type { ContentWrapperProps } from './types/content-wrapper.types'

    const props = withDefaults(defineProps<ContentWrapperProps>(), {
        disabled: false
    })
</script>
