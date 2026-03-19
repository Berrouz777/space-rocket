export interface FlightRocketProps {
    isExplosionVisible: boolean
    isCrashed: boolean
    wrapperStyle: Record<string, string>
    longFlameStyle: Record<string, string>
    longFlameScaleY: number
    fairLaunchT: number
    fairMode: 'off' | 'launch' | 'fly'
}
