import React from 'react'
import styles from './Bar.module.css'

const Bar = (props) => {

    // {props.fullValue}
    //         {props.currentValue}
    const percentage = props.currentValue/props.fullValue*100
    const color = percentage < 50 ? '#fb4141' : '#b6f752'
    const myStyle = {
        width:`${percentage}%`,
        backgroundColor: color
    }
    return (
        <div className={styles.Bar}>
            <div 
                style={myStyle} 
                className={styles.CurrentValue}
                >
                {props.currentValue+"/"+props.fullValue}
            </div>
        </div>
    )
}

export default Bar