import React, { useImperativeHandle, useRef, forwardRef } from 'react'

import styles from './Input.module.css'

const Input = forwardRef( ( props, ref) => {
    let inputElement = null
    const inputClasses = [styles.InputElement]
    const joinInput = useRef()
    useImperativeHandle( ref, () => ({
        focus: () => {
            joinInput.current.focus()
        }
    }) )

    if (props.invalid && props.touched) {
        inputClasses.push(styles.Invalid)
    }

    switch ( props.elementType ) {
        case ( 'input' ):
            inputElement = <input
                ref={joinInput}
                id={props.id}
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />
            break
        case ( 'textarea' ):
            inputElement = <textarea
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />
            break
        case ( 'select' ):
            inputElement = (
                <select
                    className={inputClasses.join(' ')}
                    value={props.value}
                    onChange={props.changed}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            )
            break
        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />
    }

    return (
        <div className={styles.Input}>
            <label className={styles.Label}>{props.label}</label>
            {inputElement}
        </div>
    )

})

export default Input