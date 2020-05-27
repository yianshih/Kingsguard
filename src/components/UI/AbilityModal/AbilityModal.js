import React from 'react'
import styles from './AbilityModal.module.css'
import Backdrop from '../Backdrop/Backdrop'

const AbilityModal = props => {
    return (
        <React.Fragment>
            <div
                className={styles.Modal}
                style={{
                    ...props.styled,
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>
                {props.children}
            </div>
        </React.Fragment>
    )
}

export default AbilityModal