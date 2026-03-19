import type { FlightAsteroid } from '../../../../../types/flight.types'

import asteroid1Image from '~/assets/asteroids/asteroid-1.png'
import asteroid2Image from '~/assets/asteroids/asteroid-2.png'
import asteroid3Image from '~/assets/asteroids/asteroid-3.png'
import asteroid4Image from '~/assets/asteroids/asteroid-4.png'
import asteroid5Image from '~/assets/asteroids/asteroid-5.png'
import asteroid6Image from '~/assets/asteroids/asteroid-6.png'
import asteroid7Image from '~/assets/asteroids/asteroid-7.png'
import asteroid8Image from '~/assets/asteroids/asteroid-8.png'
import asteroid9Image from '~/assets/asteroids/asteroid-9.png'
import asteroid10Image from '~/assets/asteroids/asteroid-10.png'
import asteroid11Image from '~/assets/asteroids/asteroid-11.png'

const asteroidImages = [
    asteroid1Image,
    asteroid2Image,
    asteroid3Image,
    asteroid4Image,
    asteroid5Image,
    asteroid6Image,
    asteroid7Image,
    asteroid8Image,
    asteroid9Image,
    asteroid10Image,
    asteroid11Image
]

export const useFlightAsteroidsBoard = () => {
    const asteroidStyle = (asteroid: FlightAsteroid): Record<string, string> => ({
        left: `${asteroid.xPercent}%`,
        top: `${asteroid.yPercent}%`,
        width: `${asteroid.sizePercent}%`,
        height: `${asteroid.sizePercent}%`,
        transform: 'translate(-50%, -50%)'
    })

    const getAsteroidImage = (asteroid: FlightAsteroid) => {
        if (asteroidImages.length === 0) {
            return undefined
        }

        const index = Math.abs(asteroid.id) % asteroidImages.length
        return asteroidImages[index]
    }

    return {
        asteroidStyle,
        getAsteroidImage
    }
}
