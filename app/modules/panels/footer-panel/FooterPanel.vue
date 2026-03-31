<template>
    <div class="relative z-30 w-full">
        <div class="panel-shell relative w-full p-[1%]">
            <div class="relative z-10 mx-auto w-full rounded-[4px] bg-[linear-gradient(135deg,_#EACBB8_0%,_#B3917F_13%,_#926A65_50%,_#53312D_100%)] p-[2px]">
                <div
                    class="flex w-full items-center justify-center rounded-[2px] bg-[linear-gradient(180deg,_#4A2A4F_0%,_#543857_48.38%,_#412A4E_100%)] p-[3px] [container-type:inline-size]"
                >
                    <div class="flex w-full gap-[3px]">
                        <div class="min-h-[100px] flex-1 rounded-[3px] bg-[#111737] p-[4px]">
                            <div class="grid h-full w-full grid-rows-[1fr_1fr_1fr] gap-[2px]">
                                <BetControlPanel :value="betAmount" @decrease="onBetDecrease" @increase="onBetIncrease" />

                                <div class="flex h-full w-full gap-[2px]">
                                    <ActionButton
                                        v-for="step in BET_STEP_VALUES"
                                        :key="step"
                                        class="flex-1"
                                        :label="`+${step}`"
                                        action="bet-step"
                                        :value="step"
                                        :disabled="isFlying"
                                        @action="onFooterAction"
                                    />
                                </div>
                                <div class="flex h-full w-full gap-[2px]">
                                    <ActionButton
                                        v-for="button in CONTROL_ACTION_BUTTONS"
                                        :key="button.action"
                                        class="flex-1"
                                        :icon="button.icon"
                                        :action="button.action"
                                        :disabled="isFlying"
                                        @action="onFooterAction"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="relative min-h-[100px] w-[30%] rounded-[3px] bg-[#111737] p-[4px]">
                            <ContentWrapper class="h-full w-full">
                                <button
                                    class="h-full w-full rounded-[1px] bg-gradient-to-b text-game-4xl font-black text-white"
                                    type="button"
                                    :class="isFlying ? 'from-[#FF7E59] to-[#FF6929]' : 'from-[#FF7E59] to-[#FFFF29]'"
                                    @click="onActionClick"
                                >
                                    {{ actionLabel }}
                                </button>
                            </ContentWrapper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { FLIGHT_BET_DEFAULT } from '~/modules/game/rocket-flight/constants'
    import { storeToRefs } from 'pinia'
    import { useRocketFlightStore } from '~/modules/game/rocket-flight'
    import ActionButton from './components/buttons/components/action-button/ActionButton.vue'
    import BetControlPanel from './components/bet-control-panel/BetControlPanel.vue'
    import { BET_STEP_VALUES, CONTROL_ACTION_BUTTONS } from './components/buttons/components/action-button/constants/action-button.constants'
    import ContentWrapper from './components/content-wrapper/ContentWrapper.vue'

    // Types
    import type { FooterPanelProps } from './types/footer-panel.types'
    import type { ActionButtonPayload } from './components/buttons/components/action-button/type/action-button.types'

    // Props
    const props = defineProps<FooterPanelProps>()

    // Emits
    const emit = defineEmits<{
        go: []
        stop: []
    }>()

    // Computed
    const isFlying = computed<boolean>(() => props.phase === 'flying')
    const actionLabel = computed<string>(() => (isFlying.value ? 'STOP' : 'GO'))
    const rocketFlightStore = useRocketFlightStore()
    const { betAmount } = storeToRefs(rocketFlightStore)

    // Methods
    const onActionClick = () => {
        if (isFlying.value) {
            emit('stop')
            return
        }

        emit('go')
    }

    const onFooterAction = (payload: ActionButtonPayload) => {
        if (payload.action === 'bet-step' && payload.value) {
            rocketFlightStore.setBetAmount(betAmount.value + payload.value)
            return
        }

        if (payload.action === 'clear') {
            rocketFlightStore.setBetAmount(FLIGHT_BET_DEFAULT)
            return
        }
    }

    const onBetDecrease = () => {
        rocketFlightStore.setBetAmount(betAmount.value - 1)
    }

    const onBetIncrease = () => {
        rocketFlightStore.setBetAmount(betAmount.value + 1)
    }
</script>

<style scoped>
    .panel-shell {
        --footer-bg: linear-gradient(180deg, #ad83be 0%, #251c31 100%);
    }

    .panel-shell::before {
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
