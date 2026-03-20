import planet1Image from '~/assets/planets/planet-1.png'
import planet2Image from '~/assets/planets/planet-2.png'
import planet3Image from '~/assets/planets/planet-3.png'
import type { FlightPlanetConfig } from '../types/flight-planets.types'

export const PLANETS: FlightPlanetConfig[] = [
    {
        id: 1,
        image: planet1Image,
        xPercent: 34,
        yPercent: 40,
        sizePercent: 16,
        driftDurationMs: 5400,
        driftDelayMs: 0,
        driftAmplitudeCqw: 1.2
    },
    {
        id: 2,
        image: planet2Image,
        xPercent: 15,
        yPercent: 66,
        sizePercent: 15,
        driftDurationMs: 6200,
        driftDelayMs: 260,
        driftAmplitudeCqw: 1.5
    },
    {
        id: 3,
        image: planet3Image,
        xPercent: 80,
        yPercent: 56,
        sizePercent: 17,
        driftDurationMs: 5800,
        driftDelayMs: 420,
        driftAmplitudeCqw: 1.3
    }
]

// Планеты перед уходом вниз должны “успокоить” горизонтальный дрейф.
// Поэтому за время countdown мы плавно сводим амплитуду к нулю.
export const COUNTDOWN_SETTLE_MS = 1950

// Ракета после `crashed/cashed_out -> idle` возвращается на луну с задержкой.
// Чтобы планеты появились синхронно, делаем ту же задержку.
export const RETURN_DELAY_MS = 220

// Тайминг: сначала почти уходит луна/ракета, а планеты начинают основной уход чуть позже.
export const MOON_GONE_AT = 0.92
export const PLANETS_BASE_OFFSET_VH = 22
export const PLANETS_FULL_OFFSET_VH = 140
