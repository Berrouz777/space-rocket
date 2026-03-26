import { FLIGHT_LEVELS } from '../../constants'
import {
    FLIGHT_POST_CASHOUT_MAX_MULTIPLIER,
    FLIGHT_POST_CASHOUT_VIRTUAL_MAX_STEPS,
    FLIGHT_POST_CASHOUT_VIRTUAL_STEP_SECONDS
} from '../../constants/flight-post-cashout.constants'
import type { PostCashoutScenario, PostCashoutScenarioInput } from '../../types'
import { clamp } from '../../utils/math.utils'
import { getCollisionCumulativeProbability, getLevelByMultiplier, toIncrementalCollisionProbability } from '../use-flight-curve'

const roundMoney = (value: number): number => Math.round(value * 100) / 100

// Докручиваем раунд после кешаута: пошагово растит множитель,
// на каждом шаге проверяет вероятность краша и возвращает итоговый возможный максимум.
export const resolvePostCashoutScenario = ({ cashoutMultiplier, betAmount }: PostCashoutScenarioInput): PostCashoutScenario => {
    let simulatedMultiplier = clamp(cashoutMultiplier, 1, FLIGHT_POST_CASHOUT_MAX_MULTIPLIER)
    let previousCumulative = getCollisionCumulativeProbability(simulatedMultiplier)

    for (let step = 0; step < FLIGHT_POST_CASHOUT_VIRTUAL_MAX_STEPS && simulatedMultiplier < FLIGHT_POST_CASHOUT_MAX_MULTIPLIER; step += 1) {
        const simulatedLevel = getLevelByMultiplier(simulatedMultiplier)
        const levelConfig = FLIGHT_LEVELS[simulatedLevel - 1] ?? FLIGHT_LEVELS[0]!
        const growthFactor = 1 + levelConfig.growthRate * FLIGHT_POST_CASHOUT_VIRTUAL_STEP_SECONDS
        const nextMultiplier = clamp(simulatedMultiplier * growthFactor, 1, FLIGHT_POST_CASHOUT_MAX_MULTIPLIER)

        const nextCumulative = getCollisionCumulativeProbability(nextMultiplier)
        const incrementalCollisionChance = toIncrementalCollisionProbability(previousCumulative, nextCumulative)

        simulatedMultiplier = nextMultiplier
        previousCumulative = nextCumulative

        if (Math.random() < incrementalCollisionChance) {
            return {
                virtualCrashMultiplier: simulatedMultiplier,
                virtualMaxWin: roundMoney(betAmount * simulatedMultiplier)
            }
        }
    }

    return {
        virtualCrashMultiplier: simulatedMultiplier,
        virtualMaxWin: roundMoney(betAmount * simulatedMultiplier)
    }
}
