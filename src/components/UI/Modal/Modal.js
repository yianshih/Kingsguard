import React from 'react'
import styles from './Modal.module.css'
import Backdrop from '../Backdrop/Backdrop'
import Fade from '@material-ui/core/Fade'

const Modal = props => {
    return (
        <React.Fragment>
            <Backdrop styled={props.backdropStyle} show={props.show} clicked={props.modalClosed} />
            <Fade in={props.show} timeout={500}>
            <div
                className={styles.Modal}
                style={{
                    ...props.styled,
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>
                {props.children}
            </div>
            </Fade>
        </React.Fragment>
    )
}

export default Modal