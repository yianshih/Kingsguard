import React from 'react'

import styles from './UnitButton.module.css'




const button = (props) => {
    const oddRow = ['A','C','E','G']
    const backgroundColor = 
        oddRow.includes(props.pos[0]) && props.pos[1]%2 !== 0 
        ? '#ffffff8c' 
        : !oddRow.includes(props.pos[0]) && props.pos[1]%2 === 0 ? '#ffffff8c' : '#ff9cbe'
    return (
    <button
        style={{backgroundColor:backgroundColor}}
        value={props.pos}
        pos={props.pos}
        disabled={props.disabled}
        className={[styles.UnitButton, styles[props.btnType], props.disabled ? null : styles['Clickable']].join(' ')}
        onClick={props.clicked}>
        {props.children}
    </button>)
}

export default button