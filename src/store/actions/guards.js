import * as actionTypes from './actionTypes'


export const setTeamDisabled = ( side, disabled ) => {
    return {
        type: actionTypes.setTeamDisabled,
        side: side,
        disabled: disabled
    }
}

export const setGuardActived = ( id, actived ) => {
    return {
        type: actionTypes.setGuardActived,
        id: id,
        actived: actived,
    }
}

export const setGuardsAttackable = (id) => {
    return {
        type: actionTypes.setGuardsAttackable,
        id: id
    }
}

export const setGuardAttacking = (attacker,defender) => {
    return {
        type: actionTypes.setGuardAttacking,
        attacker: attacker,
        defender: defender
    }
}

export const setUnplacedGuardsDisabled = ( side, disabled ) => {
    return {
        type: actionTypes.setUnplacedGuardsDisabled,
        side: side,
        disabled: disabled
    }
}

export const setOneGuardDisabled = ( id, disabled ) => {
    return {
        type: actionTypes.setOneGuardDisabled,
        id: id,
        disabled: disabled
    }
}

export const setOnlyOneGuardDisabled = ( id, disabled ) => {
    return {
        type: actionTypes.setOnlyOneGuardDisabled,
        id: id,
        disabled: disabled
    }
}


export const setGuardisPlaced = ( id, isPlaced ) => {
    return {
        type: actionTypes.setGuardisPlaced,
        id: id,
        isPlaced: isPlaced
    }
}

export const setGuardPos = ( id, pos ) => {
    return {
        type: actionTypes.setGuardPos,
        id: id,
        pos: pos
    }
}

export const setGuardStrengthen = (id, attribute, method) => {
    return {
        type: actionTypes.setGuardStrengthen,
        id: id,
        attribute: attribute,
        method: method
    }

}

export const setGuardsUpdate = (guards) => {
    return {
        type: actionTypes.setGuardsUpdate,
        guards: guards
    }
}

export const resetGuards = () => {
    return {
        type: actionTypes.resetGuards
    }
}

