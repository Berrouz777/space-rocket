<template>
    <BaseButton class="h-full w-full" :disabled="props.disabled" @click="onClick">
        <component :is="iconComponent" v-if="iconComponent" :class="iconClassName" />
        <span v-else>{{ props.label }}</span>
    </BaseButton>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import BaseButton from '../base-button/BaseButton.vue'
    import SvgPlus from '../icons/svg-plus/SvgPlus.vue'
    import SvgRotate from '../icons/svg-rotate/SvgRotate.vue'
    import type { ActionButtonPayload, ActionButtonProps } from './type/action-button.types'

    const props = withDefaults(defineProps<ActionButtonProps>(), {
        value: undefined,
        disabled: false
    })

    const emit = defineEmits<{
        action: [payload: ActionButtonPayload]
    }>()

    const onClick = () => {
        emit('action', {
            action: props.action,
            value: props.value
        })
    }

    const iconComponent = computed(() => {
        if (props.icon === 'plus-rotated') {
            return SvgPlus
        }

        if (props.icon === 'rotate') {
            return SvgRotate
        }

        return null
    })

    const iconClassName = computed(() => {
        if (props.icon === 'plus-rotated') {
            return 'h-full w-[30%] rotate-45'
        }

        return 'h-full w-[30%]'
    })
</script>
