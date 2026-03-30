<template>
    <ContentWrapper class="h-full w-full" :disabled="props.disabled">
        <BaseButtonCore :disabled="props.disabled" @click="emit('click', $event)">
            <slot />
        </BaseButtonCore>
    </ContentWrapper>
</template>

<script setup lang="ts">
    import ContentWrapper from '../../../content-wrapper/ContentWrapper.vue'
    import BaseButtonCore from './BaseButtonCore.vue'
    import type { BaseButtonProps } from './types/base-button.types'

    const props = withDefaults(defineProps<BaseButtonProps>(), {
        disabled: false
    })

    const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>
