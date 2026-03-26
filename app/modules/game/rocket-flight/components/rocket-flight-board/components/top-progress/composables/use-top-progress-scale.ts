import { clamp, lerp } from '../../../../../utils/math.utils'
import type { TopProgressTick } from '../types/top-progress.types'
import {
    TOP_PROGRESS_MAX_MULTIPLIER,
    TOP_PROGRESS_MILESTONES,
    TOP_PROGRESS_MIN_MULTIPLIER,
    TOP_PROGRESS_POSITIONS,
    TOP_PROGRESS_TICK_VALUES
} from '../constants/top-progress.constants'

// Преобразует multiplier в процент позиции на UI-шкале прогресса.
// Отметки x2, x5, x10000 стоят равномерно, а внутри сегмента
// интерполяция идёт в log10-пространстве, чтобы ранние значения не "летали".
export const toTopProgressPercent = (value: number): number => {
    const v = clamp(value, TOP_PROGRESS_MIN_MULTIPLIER, TOP_PROGRESS_MAX_MULTIPLIER)
    const idx = v <= TOP_PROGRESS_MILESTONES[1] ? 0 : v <= TOP_PROGRESS_MILESTONES[2] ? 1 : 2

    const a = TOP_PROGRESS_MILESTONES[idx]!
    const b = TOP_PROGRESS_MILESTONES[idx + 1]!
    const pa = TOP_PROGRESS_POSITIONS[idx]!
    const pb = TOP_PROGRESS_POSITIONS[idx + 1]!

    const la = Math.log10(a)
    const lb = Math.log10(b)
    const lv = Math.log10(v)
    const t = lb === la ? 0 : clamp((lv - la) / (lb - la), 0, 1)

    return lerp(pa, pb, t)
}

// Обратное преобразование. Нужно для корректной подписи коэффициента при анимации,
// которая идёт линейно по позиции на шкале, а не по самому multiplier.
export const fromTopProgressPercent = (percent: number): number => {
    const p = clamp(percent, TOP_PROGRESS_POSITIONS[0]!, TOP_PROGRESS_POSITIONS[TOP_PROGRESS_POSITIONS.length - 1]!)
    const idx = p <= TOP_PROGRESS_POSITIONS[1] ? 0 : p <= TOP_PROGRESS_POSITIONS[2] ? 1 : 2

    const pa = TOP_PROGRESS_POSITIONS[idx]!
    const pb = TOP_PROGRESS_POSITIONS[idx + 1]!
    const a = TOP_PROGRESS_MILESTONES[idx]!
    const b = TOP_PROGRESS_MILESTONES[idx + 1]!
    const t = pb === pa ? 0 : clamp((p - pa) / (pb - pa), 0, 1)

    const la = Math.log10(a)
    const lb = Math.log10(b)
    const lv = lerp(la, lb, t)

    return clamp(10 ** lv, TOP_PROGRESS_MIN_MULTIPLIER, TOP_PROGRESS_MAX_MULTIPLIER)
}

export const getTopProgressTicks = (): TopProgressTick[] =>
    TOP_PROGRESS_TICK_VALUES.map((value: (typeof TOP_PROGRESS_TICK_VALUES)[number], i: number) => {
        const percent = TOP_PROGRESS_POSITIONS[i + 1]!
        const tickWidthPercent = 1
        const safeLeftPercent = clamp(percent, tickWidthPercent / 2, 100 - tickWidthPercent / 2)
        const labelWidthPercent = value === 10000 ? 18 : 10
        const labelOffsetPercent = value === 10000 ? 10 : 0
        const labelLeftPercent = clamp(percent + labelOffsetPercent, labelWidthPercent / 2, 100 - labelWidthPercent / 2)

        return {
            value,
            label: value === 10000 ? 'x10.000' : `x${value}`,
            percent: safeLeftPercent,
            labelLeftPercent
        }
    })
