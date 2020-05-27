import * as actionTypes from './actionTypes'
import { db } from '../../services/firebase'
import * as actions from '../../store/actions/index'


export const setActionCompleted = (isActionCompleted) => {
    return {
        type: actionTypes.setActionCompleted,
        isActionCompleted: isActionCompleted
    }
}

export const setWhosMoving = (id) => {
    return {
        type: actionTypes.setWhosMoving,
        id: id
    }
}

export const setWhosAttacking = (id) => {
    return {
        type: actionTypes.setWhosAttacking,
        id: id
    }
}

export const setActionCounts = (counts) => {
    return {
        type: actionTypes.setActionCounts,
        counts: counts
    }
}

export const setGameInfo = (gameInfo) => {
    return {
        type: actionTypes.setGameInfo,
        gameInfo: gameInfo
    }
}

export const initGameInfo = (gameKey,userSide) => {
    return dispatch => {
        db.ref().child("games").orderByChild("gid").equalTo(gameKey).once("value",snapshot => {
            if (snapshot.exists()){
                try {
                    db.ref("games/" + gameKey).on("value", snapshot => {
                        if (snapshot.val() === null) return 
                        dispatch(actions.setGameInfo(snapshot.val()))
                        if (snapshot.val().turn !== userSide) {
                            dispatch(actions.setSquaresUpdate(snapshot.val().squares))
                            dispatch(actions.setGuardsUpdate(snapshot.val().guards))
                        }
                    })
                } catch  (error) {
                    console.log('Error')
                }
            }
        })
    }
}
export const setGameIDs = (gameIDs) => {
    return {
        type: actionTypes.setGameIDs,
        gameIDs: gameIDs
    }
}
export const loadingGames = () => {
    return dispatch => {
        try {
            db.ref("games/").on("value", snapshot => {
                dispatch(actions.setGameIDs(snapshot.val()))  
            })
        } catch (error) {
            console.log(error.message)
        }
    }
}

export const setUserSide = (userSide) => {
    return {
        type: actionTypes.setUserSide,
        userSide: userSide
    }
}

export const setWinner = (winner) => {
    return {
        type: actionTypes.setWinner,
        winner: winner
    }
}

export const resetGame = () => {
    return {
        type: actionTypes.resetGame
    }
}

export const setWhosSwitching = (id) => {
    return {
        type: actionTypes.setWhosSwitching,
        id: id
    }
}

export const setWhosAbility = (id) => {
    return {
        type: actionTypes.setWhosAbility,
        id: id
    }
}