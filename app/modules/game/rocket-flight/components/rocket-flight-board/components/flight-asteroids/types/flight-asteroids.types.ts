import type { FlightAsteroid, FlightRoundPhase } from '../../../../../types/flight.types'

export interface FlightAsteroidsProps {
    asteroids: FlightAsteroid[]
    phase: FlightRoundPhase
    isFlying: boolean
}
