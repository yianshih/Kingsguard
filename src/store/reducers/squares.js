import * as actionTypes from '../actions/actionTypes'
//import { updateObject } from '../../shared/utility'

//const blueRowList = ['A','B','C','D']

//const redRowList = ['E','F','G','H']

const rows = {
    red: ['A','B','C','D'],
    blue: ['E','F','G','H']
}

const squareList = ['1','2','3','4','5','6']

//const allRows = ['B','C','D','E','F','G','H','I']

const allRows = rows['red'].concat(rows['blue'])


const allSquares = []

for (let i = 0; i < allRows.length; i++) {
    for (let j = 0; j < squareList.length; j++) {
        allSquares.push({
            pos: allRows[i]+squareList[j],
            unit: 'unknown',
            disabled: true,
            actived: false
        })
    }    
}

const initialState = allSquares

const resetSquares = () => {
    return allSquares
}

const withinDistance = (g_pos,s_pos,step) => {
    const row = ['A','B','C','D','E','F','G','H']
    const g_rowIndex = row.findIndex( (item) => item === g_pos[0])
    const s_rowIndex = row.findIndex( (item) => item === s_pos[0])
    const rowDis = Math.abs(g_rowIndex - s_rowIndex)
    const noDis = Math.abs(g_pos[1]-s_pos[1])
    return rowDis <= step && noDis <= step
}

const setSquaresUpdate = (state,action) => {
    return action.squares
}

const setSquaresMovingDisabled = (state,action) => {
    return state.map( s => {
        return withinDistance(action.pos,s.pos,action.step) 
        ? {...s, disabled: false}
        : {...s, disabled: true}    
    })
}

const setSquaresPlacingDisabled = (state,action) => {
    return state.map( s => {
        if (rows[action.side].includes(s.pos[0])) {
            return {...s,disabled:action.disabled}
        }
        return s
    })
}

const setSquaresDisabled = (state,action) => {
    
    return state.map( s => {
        return {...s, disabled:action.disabled}
    })
}

const setSquareUnit = (state,action) => {
    return state.map( s => {
        if (s.pos === action.pos) {
            return {...s, unit: action.unit}
        }
        return s
    })
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.setSquaresDisabled : return setSquaresDisabled(state,action)
        case actionTypes.setSquareUnit : return setSquareUnit(state,action)
        case actionTypes.setSquaresMovingDisabled : return setSquaresMovingDisabled(state,action)
        case actionTypes.setSquaresPlacingDisabled : return setSquaresPlacingDisabled(state,action)
        case actionTypes.setSquaresUpdate: return setSquaresUpdate(state,action)
        case actionTypes.resetSquares: return resetSquares()
        default:
            return state
    }
}


export default reducer



