import { FLIGHT_CURVE_POINTS, FLIGHT_LEVELS } from '../constants/flight.constants'
import type { FlightCurvePoint } from '../types/flight.types'
import { clamp, lerp } from '../utils/math.utils'

const interpolateByPoints = (points: FlightCurvePoint[], multiplier: number): number => {
    const firstPoint = points[0]
    if (!firstPoint) {
        return 0
    }

    if (multiplier <= firstPoint.k) {
        return firstPoint.collisionPercent
    }

    const lastPoint = points[points.length - 1]
    if (!lastPoint) {
        return firstPoint.collisionPercent
    }

    if (multiplier >= lastPoint.k) {
        return lastPoint.collisionPercent
    }

    for (let i = 0; i < points.length - 1; i++) {
        const left = points[i]
        const right = points[i + 1]
        if (!left || !right) {
            continue
        }

        if (multiplier >= left.k && multiplier <= right.k) {
            const weight = (multiplier - left.k) / (right.k - left.k)
            return lerp(left.collisionPercent, right.collisionPercent, weight)
        }
    }

    return lastPoint.collisionPercent
}

export const getLevelByMultiplier = (multiplier: number): 1 | 2 | 3 => {
    const level1 = FLIGHT_LEVELS[0]
    const level2 = FLIGHT_LEVELS[1]

    if (!level1 || !level2) {
        return 1
    }

    if (multiplier <= level1.kMax) {
        return 1
    }
    if (multiplier <= level2.kMax) {
        return 2
    }
    return 3
}

export const getCollisionCumulativeProbability = (multiplier: number): number => {
    const collisionPercent = interpolateByPoints(FLIGHT_CURVE_POINTS, multiplier)
    return clamp(collisionPercent / 100, 0, 0.9999)
}

export const toIncrementalCollisionProbability = (prevCumulative: number, nextCumulative: number): number => {
    if (nextCumulative <= prevCumulative) {
        return 0
    }

    const safeBefore = 1 - clamp(prevCumulative, 0, 0.9999)
    if (safeBefore <= 0) {
        return 1
    }

    return clamp((nextCumulative - prevCumulative) / safeBefore, 0, 1)
}

export const formatMultiplier = (value: number): string => {
    if (value >= 1000) {
        return `x${value.toFixed(0)}`
    }
    if (value >= 100) {
        return `x${value.toFixed(1)}`
    }
    return `x${value.toFixed(2)}`
}
