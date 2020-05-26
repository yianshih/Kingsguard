import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
    isMoving: false
}

const isMoving = (state,action) => {
    return updateObject(state,{isMoving:!state.isMoving})
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.MOVING: return isMoving(state,action)
        default:
            return state
    }
}


export default reducer



