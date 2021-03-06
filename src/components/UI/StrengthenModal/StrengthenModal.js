import React from 'react'
import styles from './StrengthenModal.module.css'
import Backdrop from '../Backdrop/Backdrop'

const StrengthenModal = props => {
    return (
        <React.Fragment>
            <Backdrop styled={props.backdropStyle} show={props.show} clicked={props.modalClosed} />
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

export default StrengthenModal