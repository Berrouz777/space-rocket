import { computed, type Ref } from 'vue'
import { clamp, lerp } from '../../../../../utils/math.utils'

export const useTopProgress = (multiplier: Ref<number>) => {
    const MIN_MULTIPLIER = 1
    const MAX_MULTIPLIER = 10000

    /**
     * UI шкала как в макете: отметки x2/x5/x10.000 стоят равномерно.
     * При этом прогресс внутри каждого сегмента интерполируем в log-пространстве,
     * чтобы ранние значения не "летали" слишком быстро.
     */
    const milestones = [1, 2, 5, 10000] as const
    const positions = [0, 100 / 3, (100 / 3) * 2, 100] as const

    const toSegmentPercent = (value: number): number => {
        const v = clamp(value, MIN_MULTIPLIER, MAX_MULTIPLIER)
        const idx = v <= milestones[1] ? 0 : v <= milestones[2] ? 1 : 2

        const a = milestones[idx]!
        const b = milestones[idx + 1]!
        const pa = positions[idx]!
        const pb = positions[idx + 1]!

        const la = Math.log10(a)
        const lb = Math.log10(b)
        const lv = Math.log10(v)
        const t = lb === la ? 0 : clamp((lv - la) / (lb - la), 0, 1)

        return lerp(pa, pb, t)
    }

    const progressPercent = computed<number>(() => {
        return toSegmentPercent(multiplier.value)
    })

    // Не даём ракете вылезать за границы трека.
    // Подогнано под текущую вёрстку: ширина ракеты ~7% от ширины трека.
    const ROCKET_WIDTH_PERCENT = 7
    const rocketLeftPercent = computed<number>(() => clamp(progressPercent.value, ROCKET_WIDTH_PERCENT / 2, 100 - ROCKET_WIDTH_PERCENT / 2))

    const TICK_VALUES = [2, 5, 10000] as const
    const ticks = computed(() =>
        TICK_VALUES.map((value: (typeof TICK_VALUES)[number], i: number) => {
            const percent = positions[i + 1]!
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
    )

    return {
        progressPercent,
        rocketLeftPercent,
        ticks
    }
}
