import React, { useState } from 'react'
//import { useDispatch } from 'react-redux'
//import * as actions from '../../../store/actions/index'
import styles from './GuardStrengthen.module.css'

const GuardStrengthen = props => {


    const [hpState, setHpState] = useState(0)
    const [dmgState, setDmgState] = useState(0)
    // const [dmg, setDmg] = useState(props.dmg)
    //const dispatch = useDispatch()
    return (
        <div style={{border: `2px solid ${props.side}`}} className={[styles.Info].join(' ')}>
            {/* <div style={{backgroundColor:"yellow"}}className={styles[props.side]}>{props.name}</div> */}
            <img alt="" className={styles.Icon} src={require(`../../../assets/images/icon/${props.name}.png`)}></img>
            <hr></hr>
            <div className={styles.Attributes}>
                <label style={{color:"red"}}>HP</label>
                <div className={styles.Attribute}>
                    <p>{props.hp}</p>
                    <button
                        className={[styles.Button, styles.Symbol].join(' ')}
                        disabled={props.points === 0}
                        onClick={() => {
                            setHpState(hpState + 1)
                            props.addClicked()
                            props.guardClicked(props.id,'hp','add')
                            //dispatch(actions.setGuardStrengthen(props.id,'hp','add'))
                        }}
                    >+</button>
                    <button 
                        className={[styles.Button, styles.Symbol].join(' ')}
                        disabled={hpState === 0} 
                        onClick={() => {
                            setHpState(hpState - 1)
                            props.deductClicked()
                            props.guardClicked(props.id,'hp','deduct')
                            //dispatch(actions.setGuardStrengthen(props.id,'hp','deduct'))
                        }}
                    >-</button>
                </div>
                <hr></hr>
                <label style={{color:"red"}}>DMG</label>
                <div className={styles.Attribute}>
                    
                    <p>{props.dmg}</p>
                    <button
                        className={[styles.Button, styles.Symbol].join(' ')}
                        disabled={props.points === 0}
                        onClick={() => {
                            setDmgState(dmgState + 1)
                            props.addClicked()
                            props.guardClicked(props.id,'dmg','add')
                            //dispatch(actions.setGuardStrengthen(props.id,'dmg','add'))
                        }}
                    >+</button>
                    <button
                        className={[styles.Button, styles.Symbol].join(' ')}
                        disabled={dmgState === 0} 
                        onClick={() => {
                            setDmgState(dmgState - 1)
                            props.deductClicked()
                            props.guardClicked(props.id,'dmg','deduct')
                            //dispatch(actions.setGuardStrengthen(props.id,'dmg','deduct'))
                        }}
                    >-</button>
                </div>
            </div>
        </div>
    )
}


export default GuardStrengthen

