import * as actionTypes from './actionTypes'


export const isMoving = () => {
    return {
        type: actionTypes.MOVING
    }
}


export const move = () => {
    return dispatch => {
        dispatch(isMoving())
    }
}   