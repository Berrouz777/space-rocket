<template>
    <div
        class="relative flex h-screen w-full touch-none items-center justify-center overflow-hidden [padding-bottom:env(safe-area-inset-bottom)] [padding-left:env(safe-area-inset-left)] [padding-right:env(safe-area-inset-right)] [padding-top:env(safe-area-inset-top)] supports-[height:100svh]:h-svh"
    >
        <div ref="gameStretchShellRef" class="game-stretch-shell h-full">
            <div ref="gameContainerRef" :style="gameContainerStyle" class="game-container relative flex flex-col overflow-hidden [container-type:inline-size]">
                <div class="relative min-h-0 w-full flex-1">
                    <RocketFlightBoard
                        :phase="phase"
                        :countdown-value="countdownValue"
                        :multiplier="multiplier"
                        :rocket-x-percent="rocketXPercent"
                        :rocket-scale="rocketScale"
                        :moon-offset-y-percent="moonOffsetYPercent"
                        :asteroids="asteroids"
                        :is-explosion-visible="isExplosionVisible"
                    />
                </div>

                <div class="w-full">
                    <FooterBlock :phase="phase" @go="startRound" @stop="cashOut" />
                </div>
            </div>
        </div>

        <OrientationOverlay />
    </div>
</template>

<script setup lang="ts">
    // Modules
    import { RocketFlightBoard, useRocketFlightFlow, useRocketFlightStore } from '~/modules/game/rocket-flight'
    import { FooterBlock } from '~/modules/footer-panel'

    // Shared
    import { useMobileGameStretch } from '~/shared/composables/utils/useMobileGameStretch'
    import OrientationOverlay from '~/shared/ui/orientation/OrientationOverlay.vue'

    // Bindings
    const rocketFlightStore = useRocketFlightStore()
    const { phase, countdownValue, multiplier, rocketXPercent, rocketScale, moonOffsetYPercent, asteroids, isExplosionVisible } = storeToRefs(rocketFlightStore)
    const { startRound, cashOut } = useRocketFlightFlow()
    const { gameStretchShellRef, gameContainerRef, gameContainerStyle } = useMobileGameStretch({ mobileMaxWidth: 599 })
</script>

<style scoped>
    .game-container {
        width: min(100vw, calc(100svh / 2.04));
        height: min(100svh, calc(100vw * 2.04));
        background: linear-gradient(180deg, #14073c 0%, #0e0629 100%);
    }

    @supports not (height: 100svh) {
        .game-container {
            width: min(100vw, calc(100vh / 2.04));
            height: min(100vh, calc(100vw * 2.04));
        }
    }

    @media (max-width: 599px) {
        .game-container {
            width: min(100vw, calc(100svh / 2.04));
        }

        .game-stretch-shell {
            width: 100vw;
            display: flex;
            justify-content: center;
            overflow: hidden;
        }
    }
</style>
