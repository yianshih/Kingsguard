import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
    redSide: [
        {
            id: 1,
            name: 'Knight',
            hp: 200,
            dmg: 50,
            isPlaced: false,
            actived: false,
            disabled: true,
            pos:null,
            side: 'red'
        },
        {
            id: 2,
            name: 'Archer',
            hp: 150,
            dmg: 70,
            isPlaced: false,
            actived: false,
            disabled: true,
            pos:null,
            side: 'red'
        },
        {
            id: 3,
            name: 'Wizard',
            hp: 120,
            dmg: 80,
            isPlaced: false,
            actived: false,
            disabled: true,
            pos:null,
            side: 'red'
        },
        {
            id: 4,
            name: 'King',
            hp: 100,
            dmg: 30,
            isPlaced: false,
            actived: false,
            disabled: true,
            pos:null,
            side: 'red'
        }
    ],
    blueSide: [
        {
            id: 1,
            name: 'Knight',
            hp: 200,
            dmg: 50,
            isPlaced: false,
            actived: false,
            disabled: true,
            pos:null,
            side: 'blue'
        },
        {
            id: 2,
            name: 'Archer',
            hp: 150,
            dmg: 70,
            isPlaced: false,
            actived: false,
            disabled: true,
            pos:null,
            side: 'blue'
        },
        {
            id: 3,
            name: 'Wizard',
            hp: 120,
            dmg: 80,
            isPlaced: false,
            actived: false,
            disabled: true,
            pos:null,
            side: 'blue'
        },
        {
            id: 4,
            name: 'King',
            hp: 100,
            dmg: 30,
            isPlaced: false,
            actived: false,
            disabled: true,
            pos:null,
            side: 'blue'  
        }
    ] 
}

const setGuardPos = (state,action) => {

    const updatedSide = [
        ...state[action.side].map( g => {
            if (g.id === +action.id) {
                return {
                    ...g,
                    pos: action.pos
                }
            }
            return g
        })
    ]
    const updatedState = {redSide: updatedSide}
    return updateObject( state, updatedState )

}

const setGuardsDisabled = (state,action) => {   
    
    const updatedSide = [
        ...state[action.side].map( g => {
            return {
                ...g,
                disabled: action.disabled
            }
        })
    ]
    const updatedState = {redSide: updatedSide}
    return updateObject( state, updatedState )
}

const setOneGuardDisabled = (state,action) => {
    
    const updatedSide = [
        ...state[action.side].map( g => {
            if (g.id === +action.id) {
                return {
                    ...g,
                    disabled: action.disabled
                }
            }
            return g
        })
    ]
    const updatedState = {redSide: updatedSide}
    return updateObject( state, updatedState )

}

const setGuardActived = (state,action) => {

    const updatedSide = [
        ...state[action.side].map( g => {
            if (g.id === +action.id) {
                return {
                    ...g,
                    actived: action.actived
                }
            }
            return g
        })
    ]
    const updatedState = {redSide: updatedSide}
    return updateObject( state, updatedState )

}

const setGuardisPlaced = (state,action) => {

    const updatedSide = [
        ...state[action.side].map( g => {
            if (g.id === +action.id) {
                return {
                    ...g,
                    isPlaced: action.isPlaced
                }
            }
            return g
        })
    ]
    const updatedState = {redSide: updatedSide}
    return updateObject( state, updatedState )

}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.setGuardsDisabled : return setGuardsDisabled(state,action)
        case actionTypes.setGuardActived : return setGuardActived(state,action)
        case actionTypes.setOneGuardDisabled: return setOneGuardDisabled(state,action)
        case actionTypes.setGuardisPlaced: return setGuardisPlaced(state,action)
        case actionTypes.setGuardPos: return setGuardPos(state,action)
        default:
            return state
    }
}


export default reducer



