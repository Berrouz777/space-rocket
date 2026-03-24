export const CRASH_ASTEROID_SPAWN_Y_PERCENT = -18
export const CRASH_ASTEROID_SIZE_PERCENT = 24
export const CRASH_ASTEROID_SPEED_PERCENT_PER_SECOND = 200

// Фоновые астероиды: единая упрощенная модель без разделения на "центр/бока".
// Спавн по всей ширине (в процентах ширины поля).
export const AMBIENT_ASTEROID_MIN_X_PERCENT = 0
export const AMBIENT_ASTEROID_MAX_X_PERCENT = 100
export const AMBIENT_ASTEROID_INITIAL_COUNT = 2
// База и разброс скорости фоновых астероидов.
export const AMBIENT_ASTEROID_SPEED_BASE_BY_LEVEL = 16
export const AMBIENT_ASTEROID_SPEED_LEVEL_MULTIPLIER = 3
export const AMBIENT_ASTEROID_SPEED_RANDOM_RANGE = 18
// Вертикальный спавн фоновых астероидов.
export const AMBIENT_ASTEROID_SPAWN_Y_BASE_PERCENT = -5
export const AMBIENT_ASTEROID_SPAWN_Y_RANDOM_RANGE = 15
// Горизонтальный дрифт фоновых астероидов.
export const AMBIENT_ASTEROID_DRIFT_MIN_PERCENT_PER_SECOND = -5
export const AMBIENT_ASTEROID_DRIFT_MAX_PERCENT_PER_SECOND = 5
// Размер фоновых астероидов (единая модель).
export const AMBIENT_ASTEROID_SIZE_BASE = 7
export const AMBIENT_ASTEROID_SIZE_LEVEL_MULTIPLIER = 0.5
export const AMBIENT_ASTEROID_SIZE_RANDOM_RANGE = 4

// Крупные near-miss астероиды: быстрые, визуально как смертельные, но без краша.
// Вероятность, что очередной спавн будет near-miss (0..1).
export const NEAR_MISS_ASTEROID_SPAWN_CHANCE = 0.28
// Сколько near-miss астероидов одновременно может быть на экране.
export const NEAR_MISS_ASTEROID_MAX_ACTIVE = 1
// Стартовая Y-позиция near-miss (обычно выше видимой зоны).
export const NEAR_MISS_ASTEROID_SPAWN_Y_PERCENT = -18
// Диапазон размера near-miss (визуально крупные, как "в одной плоскости" с ракетой).
export const NEAR_MISS_ASTEROID_SIZE_MIN_PERCENT = 15
export const NEAR_MISS_ASTEROID_SIZE_MAX_PERCENT = 30
// Диапазон скорости near-miss. Увеличение = меньше времени на реакцию.
export const NEAR_MISS_ASTEROID_SPEED_MIN_PERCENT_PER_SECOND = 150
export const NEAR_MISS_ASTEROID_SPEED_MAX_PERCENT_PER_SECOND = 220
// На сколько процентов по Y до ракеты начать уклонение заранее.
export const NEAR_MISS_REACTION_Y_OFFSET_PERCENT = 7
// Целевая глубина "захода" near-miss в зону ракеты (визуальное почти-столкновение).
export const NEAR_MISS_OVERLAP_MIN_PERCENT = 1
export const NEAR_MISS_OVERLAP_MAX_PERCENT = 3
// Запас к уходу ракеты сверх overlap (чтобы не было касания из-за инерции/дрейфа).
export const NEAR_MISS_DODGE_PADDING_PERCENT = 3
// Доп. визуальный зазор между ракетой и near-miss (главная ручка против видимого касания).
export const NEAR_MISS_VISUAL_CLEARANCE_PERCENT = 3
// Жесткий лимит разового смещения ракеты от near-miss.
export const NEAR_MISS_DODGE_OFFSET_MAX_PERCENT = 10.5
