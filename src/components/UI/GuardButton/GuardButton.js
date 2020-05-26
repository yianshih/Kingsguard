import React from 'react'
import { useSelector } from 'react-redux'
import styles from './GuardButton.module.css'

const GuardButton = (props) => {
    //console.log('[g button] props : ',props)
    const game = useSelector(state => state.game)
    const myStyle = {
        position:'relative',
        top: '0px',
        let: '0px',
    }
    let render = <button
                    value={props.id}
                    id={props.id}
                    disabled={props.disabled}
                    className={[styles.GuardButton, styles[props.children], styles[props.side], styles[props.btnType],props.disabled ? null : styles['Clickable'], props.actived ? styles['Active']:null].join(' ')}
                    onClick={props.clicked}>
                        <p style={myStyle}>{props.children}</p>
                        {/* {props.children} */}
                </button>
    
    // const prevHp = game.gameInfo.guards[props.id - 1].prevHp
    // const currentHp = game.gameInfo.guards[props.id - 1].hp
    // if (prevHp !== currentHp) {
        
    //     render = <button
    //                 value={props.id}
    //                 id={props.id}
    //                 disabled={props.disabled}
    //                 className={[styles.GuardButton, styles[props.children], styles[props.side], styles[props.btnType],props.disabled ? null : styles['Clickable'], props.actived ? styles['Active']:null].join(' ')}
    //                 onClick={props.clicked}>
    //                     <p className={styles.ShowHp}>{currentHp - prevHp}</p>
    //             </button>
    // }
    if (game.gameInfo.message !== 'unknown') {
        if (game.gameInfo.message[props.side] && game.gameInfo.message[props.side][props.children]) {
            const deduction = (game.gameInfo.message[props.side][props.children].preHp - game.gameInfo.message[props.side][props.children].curHp)*-1
            //const newBackground = require(`../../../assets/images/${props.children}_transparent.png`)
            const newStyle = {
                fontWeight: "900",
                // backgroundImage: `url(${newBackground})`,
                // backgroundColor: "white"
            }
            render = <button
                        style={newStyle}
                        value={props.id}
                        id={props.id}
                        disabled={props.disabled}
                        className={[styles.GuardButton, styles[props.children], styles[props.side], styles[props.btnType],props.disabled ? null : styles['Clickable'], props.actived ? styles['Active']:null,styles.ShowHp].join(' ')}
                        onClick={props.clicked}>
                        <p style={myStyle}>{deduction}</p>
                    </button>
                    
            
        }
    }
    
    return render
    
}

export default GuardButton