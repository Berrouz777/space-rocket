import type { FlightRoundPhase } from '../../../../../types/flight.types'

export interface FlightPlanetConfig {
    id: number
    image: string
    xPercent: number
    yPercent: number
    sizePercent: number
    driftDurationMs: number
    driftDelayMs: number
    driftAmplitudeCqw: number
}

export interface FlightPlanetsProps {
    launchProgress: number
    phase: FlightRoundPhase
}
