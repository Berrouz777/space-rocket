import type { FlightAsteroid, FlightRoundPhase } from '../../../types/flight.types'

export interface RocketFlightBoardProps {
    phase: FlightRoundPhase
    countdownValue: number
    multiplier: number
    rocketXPercent: number
    rocketScale: number
    moonOffsetYPercent: number
    asteroids: FlightAsteroid[]
    isExplosionVisible: boolean
}
