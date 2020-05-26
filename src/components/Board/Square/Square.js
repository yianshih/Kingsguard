import React from 'react'
import UnitButton from '../../UI/UnitButton/UnitButton'
//import GuardButton from '../../UI/GuardButton/GuardButton'

const square = (props) => 
  (<UnitButton
    pos={props.pos}
    disabled={props.disabled} 
    actived={props.actived}
    clicked={props.clicked}
    >
    {props.pos}
  </UnitButton>)

export default square