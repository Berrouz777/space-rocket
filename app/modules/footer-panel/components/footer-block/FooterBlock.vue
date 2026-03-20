<template>
    <div class="relative z-30 w-full">
        <img class="w-full select-none object-contain" :src="bottomPanelImage" alt="" />

        <button
            class="absolute right-[3.6%] top-[9%] h-[81%] w-[26.8%] rounded-[4%] bg-gradient-to-b text-game-2xl font-black text-white"
            type="button"
            :class="isFlying ? 'from-[#FF7E59] to-[#FF6929]' : 'from-[#FF7E59] to-[#FFFF29]'"
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
