import React, { useEffect } from 'react'
import styles from './Guard.module.css'
import GuardButton from '../UI/GuardButton/GuardButton'


const Guard = props => {

  

  useEffect( () => {

  },[])

  return (
    <GuardButton
      //displayed={this.props.displayed}
      id={props.id}
      side={props.side}
      actived={props.actived} 
      disabled={props.disabled} 
      clicked = {props.clicked} 
      className={styles.Guard}
      >{props.name}
    </GuardButton> 
  )
}

export default Guard