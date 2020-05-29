import * as actionTypes from '../actions/actionTypes'
//import { updateObject } from '../../shared/utility'

const guardsInit = {
    Knight: {
        name: 'Knight',
        fullHp: 200,
        hp: 200,
        prevHp: 200,
        dmg: 60,
        step: 1,
        range: 1,
        isPlaced: false,
        actived: false,
        disabled: true,
        pos: 'unknown',
        ability: false,
        isShelled: false
    },
    Archer: {
        name: 'Archer',
        fullHp: 130,
        prevHp: 130,
        hp: 130,
        dmg: 60,
        step: 1,
        range: 2,
        isPlaced: false,
        actived: false,
        disabled: true,
        pos: 'unknown',
        ability: false,
        isShelled: false
    },
    Wizard: {
        name: 'Wizard',
        fullHp: 110,
        prevHp: 110,
        hp: 110,
        dmg: 70,
        step: 1,
        range: 2,
        isPlaced: false,
        actived: false,
        disabled: true,
        pos: 'unknown',
        ability: false,
        isShelled: false
    },
    King: {
        name: 'King',
        fullHp: 160,
        prevHp: 160,
        hp: 160,
        dmg: 30,
        step: 1,
        range: 1,
        isPlaced: false,
        actived: false,
        disabled: true,
        pos: 'unknown',
        ability: 'none',
        isShelled: false
    },
    Assassin: {
        name: 'Assassin',
        fullHp: 160,
        prevHp: 160,
        hp: 160,
        dmg: 80,
        step: 1,
        range: 1,
        isPlaced: false,
        actived: false,
        disabled: true,
        pos: 'unknown',
        ability: false,
        isShelled: false
    },
    Angel: {
        name: 'Angel',
        fullHp: 110,
        prevHp: 110,
        hp: 110,
        dmg: 20,
        step: 1,
        range: 1,
        isPlaced: false,
        actived: false,
        disabled: true,
        pos: 'unknown',
        ability: 'none',
        isShelled: false
    }

}
const settingGuards = [
    {
        ...guardsInit.Knight,
        id: 1,
        side: 'red'
    },
    {
        ...guardsInit.Archer,
        id: 2,
        side: 'red'
    },
    {
        ...guardsInit.Wizard,
        id: 3,
        side: 'red'
    },
    {
        ...guardsInit.King,
        id: 4,
        side: 'red'
    },
    {
        ...guardsInit.Assassin,
        id: 5,
        side: 'red'
    },
    {
        ...guardsInit.Angel,
        id: 6,
        side: 'red'
    },
    {
        ...guardsInit.Knight,
        id: 7,
        side: 'blue'
    },
    {
        ...guardsInit.Archer,
        id: 8,
        side: 'blue'
    },
    {
        ...guardsInit.Wizard,
        id: 9,
        side: 'blue'
    },
    {
        ...guardsInit.King,
        id: 10,
        side: 'blue'
    },
    {
        ...guardsInit.Assassin,
        id: 11,
        side: 'blue'
    },
    {
        ...guardsInit.Angel,
        id: 12,
        side: 'blue'
    },
]
const initialState = settingGuards

const setGuardsUpdate = (state,action) => {
    return action.guards
}

const resetGuards = () => {
    return settingGuards
}


const setGuardPos = (state,action) => {

    return state.map( g => {
        if(g.id === +action.id) {
            return {...g,pos: action.pos}
        }
        return g
    })

}

const setTeamDisabled = (state,action) => {   
    //console.log("action.side : ",action.side)
    return [...state].map( g => {
        if (g.side === action.side) {
            return {...g, disabled: action.disabled}
        }
        else {
            return {...g}
        }
    })
}
// const setKingDied = (side) => {
//     console.log('[checkIsKingDead]')
//     const copyState = [...initialState]
//     return copyState.map( g => {
//         if (g.side === side) return {...g, hp: 200}
//         else return {...g}
//     })
// }
const setGuardAttacking = (state,action) => {
    // action.attacker
    // action.defender
    const copyState = [...state]
    const attacker = copyState[action.attacker - 1]
    const defender = copyState[action.defender - 1] 
    defender.hp = defender.hp > attacker.dmg ? defender.hp - attacker.dmg : 0
    
    if (defender.name === 'King' && defender.hp <= 0) {
        for (let i = 0; i < copyState.length; i++) {
            if (copyState[i].side === defender.side) {
                copyState[i].hp = (copyState[i].hp/3).toFixed(0)
                copyState[i].dmg = (copyState[i].dmg/3).toFixed(0)
            }
        }
    }
    
    if (withinDistance(attacker.pos, defender.pos, defender.range)) {
        attacker.hp = attacker.hp - defender.dmg
        if (attacker.name === 'King' && attacker.hp <= 0) {
            for (let i = 0; i < copyState.length; i++) {
                if (copyState[i].side === attacker.side) {
                    copyState[i].hp = (copyState[i].hp/3).toFixed(0)
                    copyState[i].dmg = (copyState[i].dmg/3).toFixed(0)
                }
            }
        }
    }
    return copyState
}

const setGuardStrengthen = (state,action) => {
    // action.name
    // action.type (hp,dmg)
    // action.method (add,deduct)

    const copyState = [...state]
    for (let i = 0; i < copyState.length; i++){
        if (copyState[i].id === action.id) {
            if (action.attribute === 'hp') {
                if (action.method === 'add') copyState[i].hp += 20
                else copyState[i].hp -= 20
            }
            else {
                if (action.method === 'add') copyState[i].dmg += 10
                else copyState[i].dmg -= 10
            }
        }
    }
    return copyState
}

const withinDistance = (g_pos,s_pos,step) => {
    const row = ['A','B','C','D','E','F','G','H']
    const g_rowIndex = row.findIndex( (item) => item === g_pos[0])
    const s_rowIndex = row.findIndex( (item) => item === s_pos[0])
    const rowDis = Math.abs(g_rowIndex - s_rowIndex)
    const noDis = Math.abs(g_pos[1]-s_pos[1])
    return rowDis <= step && noDis <= step
}

const setGuardsAttackable = (state,action) => {
    const attackGuard = [...state][action.id - 1]
    const pos = attackGuard.pos // attacking guard pos
    const range = attackGuard.range

    return [...state].map( g => {
        if (g.id !== action.id && g.side !== attackGuard.side){
            return withinDistance(pos,g.pos,range)
            ? {...g,disabled:false}   
            : {...g,disabled:true}
        }
        return g
    })
}
const setOnlyOneGuardDisabled = (state,action) => {
    
    return [...state].map( g => {
        if (g.id === +action.id) {
            return {...g,disabled: action.disabled}
        }
        return {...g,disabled: !action.disabled}
    })

}

const setOneGuardDisabled = (state,action) => {
    
    return [...state].map( g => {
        if (g.id === +action.id) {
            return {...g,disabled: action.disabled}
        }
        return g
    })

}

const setUnplacedGuardsDisabled = (state,action) => {
    return [...state].map( g => {
        if (g.side === action.side && !g.isPlaced) {
            return {...g,disabled: action.disabled}
        }
        return g
    })
}

const setGuardActived = (state,action) => {

    return [...state].map( g => {
        if (g.id === +action.id) {
            return {...g,actived: action.actived}
        }
        return g
    })
    // const updatedSide = [
    //     ...state[action.side].map( g => {
    //         if (g.id === +action.id) {
    //             return {
    //                 ...g,
    //                 actived: action.actived
    //             }
    //         }
    //         return g
    //     })
    // ]
    // const updatedState = {redSide: updatedSide}
    // return updateObject( state, updatedState )

}

const setGuardisPlaced = (state,action) => {

    return [...state].map( g => {
        if (g.id === +action.id) {
            return {...g,isPlaced: action.isPlaced}
        }
        return g
    })

}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.setTeamDisabled : return setTeamDisabled(state,action)
        case actionTypes.setGuardActived : return setGuardActived(state,action)
        case actionTypes.setOneGuardDisabled: return setOneGuardDisabled(state,action)
        case actionTypes.setGuardisPlaced: return setGuardisPlaced(state,action)
        case actionTypes.setGuardPos: return setGuardPos(state,action)
        case actionTypes.setUnplacedGuardsDisabled: return setUnplacedGuardsDisabled(state,action)
        case actionTypes.setOnlyOneGuardDisabled: return setOnlyOneGuardDisabled(state,action)
        case actionTypes.setGuardsAttackable: return setGuardsAttackable(state,action)
        case actionTypes.setGuardAttacking: return setGuardAttacking(state,action)
        case actionTypes.setGuardStrengthen: return setGuardStrengthen(state,action)
        case actionTypes.setGuardsUpdate: return setGuardsUpdate(state,action)
        case actionTypes.resetGuards: return resetGuards()
        default:
            return state
    }
}


export default reducer



