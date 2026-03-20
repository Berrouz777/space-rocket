export const CRASH_ASTEROID_SPAWN_Y_PERCENT = -18
export const CRASH_ASTEROID_SIZE_PERCENT = 24
export const CRASH_ASTEROID_SPEED_PERCENT_PER_SECOND = 80

// Во сколько раз "глубже" астероид должен зайти в ракету до детонации.
// 1.0 = взрыв при касании окружностей, меньше = взрыв ближе к центру ракеты (выглядит как "влетел внутрь").
export const CRASH_COLLISION_INNER_MULTIPLIER = 0.25

// Доля радиуса астероида, которая учитывается в пороге детонации.
// Нужна, чтобы не получить "вечный полёт" из-за слишком точного попадания в центр.
export const CRASH_COLLISION_ASTEROID_RADIUS_FACTOR = 0.35

// Если краш-астероид уже пролетел ниже ракеты достаточно далеко, считаем столкновение состоявшимся (фейл-сейф).
export const CRASH_COLLISION_MISS_Y_PADDING_PERCENT = 4

// Сколько длится переход после события конца раунда.
// Используется и для плавного исчезновения астероидов в UI.
export const FLIGHT_CRASH_TO_IDLE_DELAY_MS = 700
export const FLIGHT_CASHOUT_TO_IDLE_DELAY_MS = 550
