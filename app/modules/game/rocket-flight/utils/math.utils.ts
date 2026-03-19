export const lerp = (start: number, end: number, t: number): number => start + (end - start) * t

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))
