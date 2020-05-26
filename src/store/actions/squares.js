import * as actionTypes from './actionTypes'


export const setSquaresDisabled = ( disabled ) => {
    return {
        type: actionTypes.setSquaresDisabled,
        disabled: disabled
    }
}

export const setSquareUnit = ( pos, unit ) => {
    return {
        type: actionTypes.setSquareUnit,
        pos: pos,
        unit: unit
    }
}

export const setSquaresMovingDisabled = (pos, step) => {
    return {
        type: actionTypes.setSquaresMovingDisabled,
        pos: pos,
        step: step
    }
}

export const setSquaresPlacingDisabled = (side, disabled) => {
    return {
        type: actionTypes.setSquaresPlacingDisabled,
        side: side,
        disabled: disabled
    }
}

export const setSquaresUpdate = (squares) => {
    return {
        type: actionTypes.setSquaresUpdate,
        squares: squares
    }
}

export const resetSquares = () => {
    return {
        type: actionTypes.resetSquares
    }
}