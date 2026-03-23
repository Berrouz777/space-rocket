import {
    FLIGHT_ROCKET_Y_PERCENT,
    NEAR_MISS_DODGE_OFFSET_MAX_PERCENT,
    NEAR_MISS_DODGE_PADDING_PERCENT,
    NEAR_MISS_OVERLAP_MAX_PERCENT,
    NEAR_MISS_OVERLAP_MIN_PERCENT,
    NEAR_MISS_REACTION_Y_OFFSET_PERCENT,
    NEAR_MISS_VISUAL_CLEARANCE_PERCENT,
    ROCKET_DODGE_RESPONSE_PER_SECOND
} from '../../../constants'
import type { NearMissPlan, NearMissPlanParams } from '../../../types'
import { clamp, randomBetween } from '../../../utils/math.utils'

export const computeNearMissPlan = ({ rocketXPercent, rocketScale, asteroidSizePercent }: NearMissPlanParams): NearMissPlan => {
    const rocketRadiusPercent = 6.6 * rocketScale
    const asteroidRadiusPercent = asteroidSizePercent / 2
    const overlapDepthPercent = randomBetween(NEAR_MISS_OVERLAP_MIN_PERCENT, NEAR_MISS_OVERLAP_MAX_PERCENT)
    const centerDistanceAtImpact = Math.max(rocketRadiusPercent + asteroidRadiusPercent + NEAR_MISS_VISUAL_CLEARANCE_PERCENT - overlapDepthPercent, 0.8)

    const asteroidOnLeft = Math.random() < 0.5
    const approachDirection = asteroidOnLeft ? -1 : 1
    const targetXRaw = rocketXPercent + approachDirection * centerDistanceAtImpact
    const targetXPercent = clamp(targetXRaw, 24, 76)

    const dodgeDirection = asteroidOnLeft ? 1 : -1
    const dodgeMagnitude = overlapDepthPercent + NEAR_MISS_DODGE_PADDING_PERCENT + NEAR_MISS_VISUAL_CLEARANCE_PERCENT
    const dodgeOffsetPercent = clamp(dodgeDirection * dodgeMagnitude, -NEAR_MISS_DODGE_OFFSET_MAX_PERCENT, NEAR_MISS_DODGE_OFFSET_MAX_PERCENT)

    return {
        targetXPercent,
        dodgeOffsetPercent
    }
}

export const computeNearMissDodgeTriggerY = (asteroidSpeedPercentPerSecond: number, dodgeOffsetPercent: number): number => {
    const dodgeShiftAbs = Math.abs(dodgeOffsetPercent)
    const dodgeCatchupSeconds = dodgeShiftAbs / Math.max(ROCKET_DODGE_RESPONSE_PER_SECOND, 0.001)
    const safetyBufferSeconds = 0.12
    const adaptiveReactionYOffsetPercent = asteroidSpeedPercentPerSecond * (dodgeCatchupSeconds + safetyBufferSeconds)

    return FLIGHT_ROCKET_Y_PERCENT - Math.max(NEAR_MISS_REACTION_Y_OFFSET_PERCENT, adaptiveReactionYOffsetPercent)
}
