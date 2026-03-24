<template>
    <div class="relative z-30 w-full">
        <div class="panel-shell relative w-full">
            <img class="relative z-10 w-full select-none object-contain" :src="bottomPanelImage" alt="" />

            <button
                class="absolute right-[3.6%] top-[9%] z-20 h-[81%] w-[26.8%] rounded-[4%] bg-gradient-to-b text-game-2xl font-black text-white"
                type="button"
                :class="isFlying ? 'from-[#FF7E59] to-[#FF6929]' : 'from-[#FF7E59] to-[#FFFF29]'"
                @click="onActionClick"
            >
                {{ actionLabel }}
            </button>
        </div>

        <div class="menu-shell relative w-full">
            <img class="relative z-10 w-full select-none object-contain" :src="menuImage" alt="" />
        </div>
    </div>
</template>

<script setup lang="ts">
    // Assets
    import bottomPanelImage from '~/assets/bottom-panel.png'
    import menuImage from '~/assets/menu.png'

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

<style scoped>
    .panel-shell {
        --footer-bg: linear-gradient(180deg, #ad83be 0%, #251c31 100%);
    }

    .menu-shell {
        --footer-bg: linear-gradient(180deg, #151618 0%, #2a1228 23%, #5b2a65 100%);
    }

    .panel-shell::before,
    .menu-shell::before {
        content: '';
        position: absolute;
        inset-block: 0;
        left: 50%;
        width: 100vw;
        transform: translateX(-50%);
        background: var(--footer-bg);
        pointer-events: none;
    }
</style>
