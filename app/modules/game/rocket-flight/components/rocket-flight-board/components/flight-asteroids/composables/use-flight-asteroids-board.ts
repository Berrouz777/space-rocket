import type { FlightAsteroid } from '../../../../../types/flight.types'
import { ASTEROID_BLUR_IMAGES_BY_INDEX, ASTEROID_IMAGES } from '../constants/flight-asteroids.constants'

export const useFlightAsteroidsBoard = () => {
    const asteroidStyle = (asteroid: FlightAsteroid): Record<string, string> => ({
        left: `${asteroid.xPercent}%`,
        top: `${asteroid.yPercent}%`,
        width: `${asteroid.sizePercent}%`,
        height: `${asteroid.sizePercent}%`,
        transform: 'translate(-50%, -50%)'
    })

    const getAsteroidImage = (asteroid: FlightAsteroid) => {
        if (!ASTEROID_IMAGES.length) {
            return undefined
        }

        const index = Math.abs(asteroid.id) % ASTEROID_IMAGES.length
        return ASTEROID_IMAGES[index]
    }

    const getBlurAsteroidImage = (asteroid: FlightAsteroid) => {
        if (!ASTEROID_IMAGES.length) {
            return undefined
        }

        const index = Math.abs(asteroid.id) % ASTEROID_IMAGES.length
        return ASTEROID_BLUR_IMAGES_BY_INDEX[index]
    }

    return {
        asteroidStyle,
        getAsteroidImage,
        getBlurAsteroidImage
    }
}
