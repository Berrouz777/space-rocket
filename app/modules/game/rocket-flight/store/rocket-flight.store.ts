import { defineStore } from 'pinia'
import { FLIGHT_BALANCE_DEFAULT, FLIGHT_BET_DEFAULT } from '../constants/flight.constants'
import type { FlightAsteroid, FlightPostCashoutSummary, FlightRoundPhase } from '../types/flight.types'

export const useRocketFlightStore = defineStore('rocket-flight', () => {
    // State
    const phase = ref<FlightRoundPhase>('idle')
    const countdownValue = ref<number>(3)
    const multiplier = ref<number>(1)
    const level = ref<1 | 2 | 3>(1)
    const balance = ref<number>(FLIGHT_BALANCE_DEFAULT)
    const betAmount = ref<number>(FLIGHT_BET_DEFAULT)
    const lastWinAmount = ref<number>(0)
    const rocketXPercent = ref<number>(50)
    const rocketDodgeNormalized = ref<number>(0)
    const rocketScale = ref<number>(1)
    const moonOffsetYPercent = ref<number>(0)
    const asteroids = ref<FlightAsteroid[]>([])
    const isExplosionVisible = ref<boolean>(false)
    const roundSeed = ref<number>(0)
    const collisionCumulativePrevious = ref<number>(0)
    const postCashoutSummary = ref<FlightPostCashoutSummary>({
        isActive: false,
        cashoutMultiplier: 1,
        virtualCrashMultiplier: 1,
        virtualMaxWin: 0
    })

    // Getters
    const potentialWin = computed<number>(() => betAmount.value * multiplier.value)
    const isFlying = computed<boolean>(() => phase.value === 'flying')
    const isCountdown = computed<boolean>(() => phase.value === 'countdown')
    const isIdle = computed<boolean>(() => phase.value === 'idle')

    // Actions
    const setPhase = (value: FlightRoundPhase) => {
        phase.value = value
    }

    const setCountdown = (value: number) => {
        countdownValue.value = value
    }

    const setMultiplier = (value: number) => {
        multiplier.value = value
    }

    const setLevel = (value: 1 | 2 | 3) => {
        level.value = value
    }

    const setRocketXPercent = (value: number) => {
        rocketXPercent.value = value
    }

    const setRocketDodgeNormalized = (value: number) => {
        rocketDodgeNormalized.value = value
    }

    const setRocketScale = (value: number) => {
        rocketScale.value = value
    }

    const setMoonOffsetYPercent = (value: number) => {
        moonOffsetYPercent.value = value
    }

    const setAsteroids = (value: FlightAsteroid[]) => {
        asteroids.value = value
    }

    const setExplosionVisible = (value: boolean) => {
        isExplosionVisible.value = value
    }

    const setRoundSeed = (value: number) => {
        roundSeed.value = value
    }

    const setCollisionCumulativePrevious = (value: number) => {
        collisionCumulativePrevious.value = value
    }

    const setLastWinAmount = (value: number) => {
        lastWinAmount.value = value
    }

    const setPostCashoutSummary = (value: FlightPostCashoutSummary) => {
        postCashoutSummary.value = value
    }

    const applyWinToBalance = (winAmount: number) => {
        balance.value += winAmount
        lastWinAmount.value = winAmount
    }

    const setBetAmount = (value: number) => {
        betAmount.value = Math.max(0, value)
    }

    const trySpendBetFromBalance = (): boolean => {
        if (betAmount.value <= 0) {
            return true
        }

        if (balance.value < betAmount.value) {
            return false
        }

        balance.value -= betAmount.value
        return true
    }

    const resetRoundView = () => {
        countdownValue.value = 3
        multiplier.value = 1
        level.value = 1
        rocketXPercent.value = 50
        rocketDodgeNormalized.value = 0
        rocketScale.value = 1
        moonOffsetYPercent.value = 0
        asteroids.value = []
        isExplosionVisible.value = false
        collisionCumulativePrevious.value = 0
        postCashoutSummary.value = {
            isActive: false,
            cashoutMultiplier: 1,
            virtualCrashMultiplier: 1,
            virtualMaxWin: 0
        }
    }

    return {
        phase,
        countdownValue,
        multiplier,
        level,
        balance,
        betAmount,
        lastWinAmount,
        rocketXPercent,
        rocketDodgeNormalized,
        rocketScale,
        moonOffsetYPercent,
        asteroids,
        isExplosionVisible,
        roundSeed,
        collisionCumulativePrevious,
        postCashoutSummary,
        potentialWin,
        isFlying,
        isCountdown,
        isIdle,
        setPhase,
        setCountdown,
        setMultiplier,
        setLevel,
        setRocketXPercent,
        setRocketDodgeNormalized,
        setRocketScale,
        setMoonOffsetYPercent,
        setAsteroids,
        setExplosionVisible,
        setRoundSeed,
        setCollisionCumulativePrevious,
        setLastWinAmount,
        setPostCashoutSummary,
        applyWinToBalance,
        setBetAmount,
        trySpendBetFromBalance,
        resetRoundView
    }
})
