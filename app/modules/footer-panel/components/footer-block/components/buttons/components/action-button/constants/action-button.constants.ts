import type { ActionButtonAction, ActionButtonIcon, BetStepValue } from '../type/action-button.types'

export const BET_STEP_VALUES: readonly BetStepValue[] = [1, 2, 5]

export const CONTROL_ACTION_BUTTONS: ReadonlyArray<{ action: Exclude<ActionButtonAction, 'bet-step'>; icon: ActionButtonIcon }> = [
    { action: 'clear', icon: 'plus-rotated' },
    { action: 'reset', icon: 'rotate' }
]
