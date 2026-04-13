<template>
    <div class="menu-shell relative w-full">
        <div class="relative z-10 flex w-full items-center justify-between px-[5%] py-[2%] [container-type:inline-size]">
            <div class="mb-[3%] flex w-full items-center justify-between gap-[2%]">
                <AdminButton :icon="SvgSoundButton" />
                <AdminButton :icon="SvgVolumeButton" />
                <div class="balance-text text-[clamp(12px,5cqw,26px)] uppercase text-[#FBCF67] [text-shadow:0px_0px_7px_#F65858]">
                    BALANCE: {{ balanceLabel }}
                </div>
                <AdminButton :icon="SvgInfoButton" />
                <AdminButton :icon="SvgMenuButton" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia'
    import { useRocketFlightStore } from '~/modules/game/rocket-flight'
    import AdminButton from './components/admin-button/AdminButton.vue'
    import { SvgSoundButton, SvgVolumeButton, SvgInfoButton, SvgMenuButton } from './components/admin-button/components'

    const rocketFlightStore = useRocketFlightStore()
    const { balance } = storeToRefs(rocketFlightStore)

    const balanceFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false
    })

    const balanceLabel = computed(() => {
        const value = typeof balance.value === 'number' ? balance.value : Number.parseFloat(String(balance.value))
        const safeValue = Number.isFinite(value) ? value : 0
        return `${balanceFormatter.format(safeValue)}$`
    })
</script>

<style scoped>
    .menu-shell {
        --footer-bg: linear-gradient(180deg, #151618 0%, #2a1228 23%, #5b2a65 100%);
        min-height: clamp(56px, 10cqw, 96px);
    }

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
