import type { FlightPostCashoutSummary, FlightRoundPhase } from '~/modules/game/rocket-flight/types'

export interface TopProgressTick {
    value: number
    label: string
    percent: number
    labelLeftPercent: number
}

export interface TopProgressProps {
    phase: FlightRoundPhase
    multiplier: number
    postCashoutSummary: FlightPostCashoutSummary
}
