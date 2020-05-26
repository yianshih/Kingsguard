import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const init = {
    isActionCompleted: false,
    whosMoving: null,
    whosSwitching:null,
    whosAttacking: null,
    actionCounts: 0,
    gameInfo: null,
    userSide: null,
}

const initialState = {
    isActionCompleted: false,
    whosMoving: null,
    whosAttacking: null,
    actionCounts: 0,
    gameInfo: null,
    userSide: null,
    gameIDs: null
}

const setGameIDs = (state,action) => {
    if (action.gameIDs) return updateObject(state,{gameIDs : {...action.gameIDs}})
    else return updateObject(state,{gameIDs : null})
}

const resetGame = (state,aciton) => {
    //console.log("setting gameInfo")
    return updateObject(state,{...init})
}

const setGameInfo = (state,action) => {
    return updateObject(state,{gameInfo: {...action.gameInfo}})
}

const setWinner = (state,action) => {
    return updateObject(state,{ winner: action.winner })
}

const setActionCompleted = (state,action) => {
    return updateObject(state,{isActionCompleted: action.isActionCompleted})
}

const setWhosSwitching = (state,action) => {
    return updateObject(state,{whosSwitching: action.id})
}

const setWhosMoving = (state,action) => {
    return updateObject(state,{whosMoving: action.id})
}

const setWhosAttacking = (state,action) => {
    return updateObject(state,{whosAttacking: action.id})
}

const setActionCounts = (state,action) => {
    return updateObject(state,{actionCounts: action.counts})
}

const setUserSide = (state,action) => {
    return updateObject(state,{userSide: action.userSide})
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.setActionCompleted: return setActionCompleted(state,action)
        case actionTypes.setWhosMoving: return setWhosMoving(state,action)
        case actionTypes.setWhosAttacking: return setWhosAttacking(state,action)
        case actionTypes.setActionCounts: return setActionCounts(state,action)
        case actionTypes.setGameInfo: return setGameInfo(state,action)
        case actionTypes.setUserSide: return setUserSide(state,action)
        case actionTypes.setWinner: return setWinner(state,action)
        case actionTypes.resetGame: return resetGame(state,action)
        case actionTypes.setWhosSwitching: return setWhosSwitching(state,action)
        case actionTypes.setGameIDs: return setGameIDs(state,action)
        default:
            return state
    }
}


export default reducer



