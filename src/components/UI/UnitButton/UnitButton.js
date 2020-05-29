import React from 'react'

import styles from './UnitButton.module.css'




const button = (props) => {
    const oddRow = ['A','C','E','G']
    const backgroundColor = 
        oddRow.includes(props.pos[0]) && props.pos[1]%2 !== 0 
        ? '#ffffff8c' 
        : !oddRow.includes(props.pos[0]) && props.pos[1]%2 === 0 ? '#ffffff8c' : '#ff9cbe'
    const buttonStyle = {
        backgroundColor:props.actived ? '#795548' : backgroundColor
    }
    return (
    <button
        style={buttonStyle}
        value={props.pos}
        pos={props.pos}
        disabled={props.disabled}
        className={[styles.UnitButton, styles[props.btnType], props.disabled ? null : styles['Clickable'], props.actived ? styles['Actived'] :null].join(' ')}
        onClick={props.clicked}>
        {props.children}
    </button>)
}

export default button