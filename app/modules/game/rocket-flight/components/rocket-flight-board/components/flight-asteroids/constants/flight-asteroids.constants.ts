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

import asteroid2BlurImage from '~/assets/asteroids/asteroid-2_blur.png'
import asteroid3BlurImage from '~/assets/asteroids/asteroid-3_blur.png'
import asteroid6BlurImage from '~/assets/asteroids/asteroid-6_blur.png'
import asteroid7BlurImage from '~/assets/asteroids/asteroid-7_blur.png'
import asteroid11BlurImage from '~/assets/asteroids/asteroid-11_blur.png'

export const ASTEROID_IMAGES = [
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

export const ASTEROID_BLUR_IMAGES_BY_INDEX: Partial<Record<number, string>> = {
    1: asteroid2BlurImage,
    2: asteroid3BlurImage,
    5: asteroid6BlurImage,
    6: asteroid7BlurImage,
    10: asteroid11BlurImage
}
