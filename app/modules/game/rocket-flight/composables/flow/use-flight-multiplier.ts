import { storeToRefs } from 'pinia'
import { FLIGHT_LEVELS } from '../../constants'
import { useRocketFlightStore } from '../../store/rocket-flight.store'
import { clamp } from '../../utils/math.utils'
import { getCollisionCumulativeProbability, getLevelByMultiplier, toIncrementalCollisionProbability } from '../use-flight-curve'
import type { FlightLevelConfig } from '../../types/flight.types'
const MAX_MULTIPLIER = FLIGHT_LEVELS.at(-1)?.kMax ?? 10000

export interface UseFlightMultiplierParams {
    onCrashRequest: () => void
    canRequestCrash: () => boolean
}

export const useFlightMultiplier = (params: UseFlightMultiplierParams) => {
    const rocketFlightStore = useRocketFlightStore()
    const { multiplier, level } = storeToRefs(rocketFlightStore)

    const currentLevelConfig = computed<FlightLevelConfig>(() => FLIGHT_LEVELS[level.value - 1] ?? FLIGHT_LEVELS[0]!)
    const currentCollisionPercent = computed<number>(() => getCollisionCumulativeProbability(multiplier.value) * 100)

    const tickMultiplier = (deltaSeconds: number) => {
        const previousMultiplier = multiplier.value
        const levelFromMultiplier = getLevelByMultiplier(previousMultiplier)
        rocketFlightStore.setLevel(levelFromMultiplier)

        const growthFactor = 1 + currentLevelConfig.value.growthRate * deltaSeconds
        const nextMultiplier = clamp(previousMultiplier * growthFactor, 1, MAX_MULTIPLIER)

        const previousCumulative = rocketFlightStore.collisionCumulativePrevious
        const nextCumulative = getCollisionCumulativeProbability(nextMultiplier)
        const incrementalCollisionChance = toIncrementalCollisionProbability(previousCumulative, nextCumulative)
        if (params.canRequestCrash() && Math.random() < incrementalCollisionChance) {
            params.onCrashRequest()
        }

        rocketFlightStore.setCollisionCumulativePrevious(nextCumulative)
        rocketFlightStore.setMultiplier(nextMultiplier)
        rocketFlightStore.setLevel(getLevelByMultiplier(nextMultiplier))
    }

    const resetCollisionAccumulator = () => {
        const cumulativeProbability = getCollisionCumulativeProbability(multiplier.value)
        rocketFlightStore.setCollisionCumulativePrevious(cumulativeProbability)
    }

    return {
        currentLevelConfig,
        currentCollisionPercent,
        tickMultiplier,
        resetCollisionAccumulator
    }
}
