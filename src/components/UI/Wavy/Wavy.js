import React from 'react'
import styles from './Wavy.module.css'

const Wavy = props => {

    const textArray = []
    for (let i = 0; i < props.children.length; i++) {
        textArray.push(props.children[i])
    }
    
    return (
        <div style={{
                ...props.styled,
                display:'flex',
                textAlign:'center'
            }}>
            {textArray.map( ( e, index ) => {
                const delay = `${ (0.2*(index+1)).toFixed(1)}s`
                return <span style={{
                    
                    animationDelay:delay}}
                            className={styles.Wavy}
                            key={index}
                        >
                        {e}</span>
            })}
        {/* <div className={styles.Wavy}>
            
            {textArray.map( ( e, index ) => {
                const delay = `${ (0.1*(index+1)).toFixed(1)}s`
                return <span style={{animationDelay:delay,}}
                            className={styles.WavySpan}
                            key={index}
                        >
                        {e}</span>
            })}
        </div> */}
        </div>
    )
}

export default Wavy