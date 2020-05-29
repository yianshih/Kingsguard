import React from 'react'
import { useSelector } from 'react-redux'
import styles from './GuardButton.module.css'
import AttackEffect from '../AttackEffect/AttackEffect'

const GuardButton = (props) => {
    //console.log('[g button] props : ',props)

    const game = useSelector(state => state.game)
    //const isAttacked = game.gameInfo.guards[props.id - 1].prevHp !== game.gameInfo.guards[props.id - 1].hp
    const isAttacked = (game.gameInfo.attacked === 'unknown' || typeof game.gameInfo.attacked === 'undefined') ? false : game.gameInfo.attacked.includes(props.id)
    const deduction = isAttacked ? game.gameInfo.guards[props.id - 1].hp - game.gameInfo.guards[props.id - 1].prevHp : 0
    const shouldRender = isAttacked && deduction !== 0
    // const myStyle = {
    //     position:'relative',
    //     top: '0px',
    //     left: '0px',
    //     textAlign: 'center',
    //     color: isAttacked ? 'red': '#ffffff00'
    // }
    
    const buttonStyle = {
        border: props.isShelled ? "4px outset yellow" : null,
        position:'relative',
        //color: shouldRender ? 'red': '#ffffff00',
    }
    const deductionStyle = {
        width: '40px',
        height: '40px',
        position: 'absolute',
        top: '10px',
        left: '15px',
        color: 'red'
    }
    let render = <button
                    style={buttonStyle}
                    value={props.id}
                    id={props.id}
                    disabled={props.disabled}
                    className={[styles.GuardButton, styles[props.children], styles[props.side], styles[props.btnType], props.disabled ? null : styles['Clickable'], props.actived ? styles['Active']:null].join(' ')}
                    onClick={props.clicked}>
                    {props.children}
                    {shouldRender 
                        ?<div style={deductionStyle}>
                            <AttackEffect>{deduction}</AttackEffect>
                        </div>
                        :props.children}
                </button>

    // if (game.gameInfo.message !== 'unknown' && typeof game.gameInfo.message !== 'undefined') {
    //     if (game.gameInfo.message[props.side] && game.gameInfo.message[props.side][props.children]) {
    //         const deduction = (game.gameInfo.message[props.side][props.children].preHp - game.gameInfo.message[props.side][props.children].curHp)*-1
    //         const newStyle = {
    //             fontWeight: "900",
                
    //         }
    //         render = <button
    //                     style={newStyle}
    //                     value={props.id}
    //                     id={props.id}
    //                     disabled={props.disabled}
    //                     className={[styles.GuardButton, styles[props.children], styles[props.side], styles[props.btnType],props.disabled ? null : styles['Clickable'], props.actived ? styles['Active']:null,styles.ShowHp,props.isShelled ? styles['Shelled'] :null].join(' ')}
    //                     onClick={props.clicked}>
    //                     <p style={myStyle}>{deduction}</p>
    //                 </button>
                    
            
    //     }
    // }
    
    return render
    
}

export default GuardButton