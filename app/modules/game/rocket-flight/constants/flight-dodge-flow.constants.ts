// Авто-уклонение ракеты.
// Скорость, с которой текущее смещение ракеты догоняет целевое dodge-смещение.
export const ROCKET_DODGE_RESPONSE_PER_SECOND = 20
// Скорость затухания целевого dodge-смещения обратно к нулю.
export const ROCKET_DODGE_TARGET_DECAY_PER_SECOND = 10
// Скорость включения/выключения "заморозки" базового дрейфа при dodge.
export const ROCKET_DODGE_BASE_LOCK_BLEND_PER_SECOND = 2
// Максимальный угол наклона ракеты при уклонении.
export const ROCKET_DODGE_TILT_MAX_DEG = 20
// Смещение, соответствующее полной нормализации tilt = 1 (вместе с MAX_DEG задает чувствительность крена).
export const ROCKET_DODGE_TILT_NORMALIZATION_PERCENT = 15
// Скорость X (в %/сек), при которой tilt достигает предела.
export const ROCKET_DODGE_TILT_VELOCITY_NORMALIZATION_PERCENT_PER_SECOND = 28
// Скорость, с которой визуальный tilt догоняет целевой.
export const ROCKET_DODGE_TILT_RESPONSE_PER_SECOND = 7.5
