import React from 'react'

import styles from './AttackEffect.module.css'

const spinner = props => {

    const contentStyle = {
        color: props.children < 0 ? 'red' : 'greenyellow'
    }

    const LoaderStyle = {
        borderTop: props.children < 0 ? '3px solid red' : '3px solid greenyellow'
    }
    return (<div style={contentStyle} className={styles.Content}>
                <div style={LoaderStyle} className={styles.Loader}></div>
                <p className={styles.Pstyle}>{props.children > 0 ? "+"+props.children :props.children}</p>
            </div>)
    
    
}

export default spinner