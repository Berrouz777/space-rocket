export type BetStepValue = 1 | 2 | 5

export type ActionButtonAction = 'bet-step' | 'clear' | 'reset'
export type ActionButtonIcon = 'plus-rotated' | 'rotate'

export interface ActionButtonProps {
    label?: string
    icon?: ActionButtonIcon
    action: ActionButtonAction
    value?: BetStepValue
    disabled?: boolean
}

export interface ActionButtonPayload {
    action: ActionButtonAction
    value?: BetStepValue
}
