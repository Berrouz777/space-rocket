import type { FlightAsteroid, FlightRoundPhase } from '../../../types/flight.types'

export interface RocketFlightBoardProps {
    phase: FlightRoundPhase
    countdownValue: number
    multiplier: number
    rocketXPercent: number
    rocketDodgeNormalized: number
    rocketScale: number
    moonOffsetYPercent: number
    asteroids: FlightAsteroid[]
    isExplosionVisible: boolean
}
