import React, { useState } from 'react'
//import { useDispatch } from 'react-redux'
//import * as actions from '../../../store/actions/index'
import styles from './GuardStrengthen.module.css'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import Paper from '@material-ui/core/Paper'

const GuardStrengthen = props => {


    const [hpState, setHpState] = useState(0)
    const [dmgState, setDmgState] = useState(0)
    // const [dmg, setDmg] = useState(props.dmg)
    //const dispatch = useDispatch()
    return (
        <Paper style={{margin:'5px',padding:'10px'}} elevation={3}>
        {/* <div style={{border: `2px solid ${props.side}`}} className={[styles.Info].join(' ')}> */}
            {/* <div style={{backgroundColor:"yellow"}}className={styles[props.side]}>{props.name}</div> */}
            <img alt="" className={styles.Icon} src={require(`../../../assets/images/icon/${props.name}.png`)}></img>
            {/* <hr></hr> */}
            <div className={styles.Attributes}>
                {/* <label style={{color:"red"}}>HP</label> */}
                <div className={styles.Attribute}>
                <img alt="" className={styles.Icon} src={require(`../../../assets/images/icon/hp.png`)}></img>
                    <p>{props.hp}</p>
                    {/* <button
                        className={[styles.Button, styles.Symbol].join(' ')}
                        disabled={props.points === 0}
                        onClick={() => {
                            setHpState(hpState + 1)
                            props.addClicked()
                            props.guardClicked(props.id,'hp','add')
                        }}
                    >+</button>
                    <button 
                        className={[styles.Button, styles.Symbol].join(' ')}
                        disabled={hpState === 0} 
                        onClick={() => {
                            setHpState(hpState - 1)
                            props.deductClicked()
                            props.guardClicked(props.id,'hp','deduct')
                        }}
                    >-</button> */}
                    <ButtonGroup>
                        <Button
                            disabled={hpState === 0}
                            aria-label="reduce"
                            onClick={() => {
                                setHpState(hpState - 1)
                                props.deductClicked()
                                props.guardClicked(props.id,'hp','deduct')
                            }}
                        >
                            <RemoveIcon fontSize="small" />
                        </Button>
                        <Button
                            disabled={props.points === 0}
                            aria-label="increase"
                            onClick={() => {
                                setHpState(hpState + 1)
                                props.addClicked()
                                props.guardClicked(props.id,'hp','add')
                            }}
                        >
                            <AddIcon fontSize="small" />
                        </Button>
                    </ButtonGroup>
                </div>
                {/* <hr></hr> */}
                {/* <label style={{color:"red"}}>DMG</label> */}
                <div className={styles.Attribute}>
                    <img alt="" className={styles.Icon} src={require(`../../../assets/images/icon/attack.png`)}></img>
                    <p>{props.dmg}</p>
                    {/* <button
                        className={[styles.Button, styles.Symbol].join(' ')}
                        disabled={props.points === 0}
                        onClick={() => {
                            setDmgState(dmgState + 1)
                            props.addClicked()
                            props.guardClicked(props.id,'dmg','add')
                        }}
                    >+</button>
                    <button
                        className={[styles.Button, styles.Symbol].join(' ')}
                        disabled={dmgState === 0} 
                        onClick={() => {
                            setDmgState(dmgState - 1)
                            props.deductClicked()
                            props.guardClicked(props.id,'dmg','deduct')
                        }}
                    >-</button> */}
                    <ButtonGroup>
                        <Button
                            disabled={dmgState === 0}
                            aria-label="reduce"
                            onClick={() => {
                                setDmgState(dmgState - 1)
                                props.deductClicked()
                                props.guardClicked(props.id,'dmg','deduct')
                            }}
                        >
                            <RemoveIcon fontSize="small" />
                        </Button>
                        <Button
                            disabled={props.points === 0}
                            aria-label="increase"
                            onClick={() => {
                                setDmgState(dmgState + 1)
                                props.addClicked()
                                props.guardClicked(props.id,'dmg','add')
                            }}
                        >
                            <AddIcon fontSize="small" />
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        {/* </div> */}
        </Paper>
    )
}


export default GuardStrengthen

