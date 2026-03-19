<template>
    <div class="relative z-30 w-full">
        <img class="w-full select-none object-contain" :src="bottomPanelImage" alt="" />

        <button
            class="absolute right-[4%] top-[8.5%] h-[80%] w-[26%] rounded-[4%] bg-[#FFFF29] text-game-2xl font-black text-white"
            type="button"
            @click="onActionClick"
        >
            {{ actionLabel }}
        </button>
    </div>
</template>

<script setup lang="ts">
    // Assets
    import bottomPanelImage from '~/assets/bottom-panel.png'

    // Types
    import type { FooterBlockProps } from './types/footer-block.types'

    // Props
    const props = defineProps<FooterBlockProps>()

    // Emits
    const emit = defineEmits<{
        go: []
        stop: []
    }>()

    // Computed
    const isFlying = computed<boolean>(() => props.phase === 'flying')
    const actionLabel = computed<string>(() => (isFlying.value ? 'STOP' : 'GO'))

    // Methods
    const onActionClick = () => {
        if (isFlying.value) {
            emit('stop')
            return
        }

        emit('go')
    }
</script>
