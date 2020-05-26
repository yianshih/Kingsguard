import React from 'react'
import styles from './FillUpModal.module.css'
import Backdrop from '../Backdrop/Backdrop'

const FillUpModal = props => {
    return (
        <React.Fragment>
            <Backdrop show={props.show} clicked={props.modalClosed} />
            <div
                className={styles.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>
                {props.children}
            </div>
        </React.Fragment>
    )
}

export default FillUpModal