import React, { useState}from 'react'
//import { useSelector } from 'react-redux'
//import { useDispatch } from 'react-redux'
//import { useDispatch } from 'react-redux'
import styles from './GuardsStrengthen.module.css'
import GuardStrengthen from './GuardStrengthen/GuardStrengthen'
import Button from '../UI/Button/Button'
//import * as actions from '../../store/actions/index'

const GuardsStrengthen = props => {
    
    //const dispatch = useDispatch()
    const [ points, setPoints ] = useState(5)
    //const guards = useSelector(state => state.guards)
    const copyGuards = props.guards
    //const copyGuards = [...guards]
    //console.log("copyGuards : ",copyGuards)
    const sideGuards = copyGuards.filter( g => g.side === props.side)

    const guardClicked = (id,type,method) => {
        switch(method) {
            case 'add':
                if (type === 'hp'){
                    copyGuards[id - 1].fullHp = copyGuards[id - 1].fullHp + 20
                    copyGuards[id - 1].hp = copyGuards[id - 1].hp + 20
                    return 
                }
                else {
                    return copyGuards[id - 1].dmg = copyGuards[id - 1].dmg + 10
                }
            case 'deduct':
                if (type === 'hp'){
                    copyGuards[id - 1].fullHp = copyGuards[id - 1].fullHp - 20
                    copyGuards[id - 1].hp = copyGuards[id - 1].hp - 20
                    return
                }
                else {
                    return copyGuards[id - 1].dmg = copyGuards[id - 1].dmg - 10
                }
            default:
                console.log("Error")
        }
    }

    const finishedHandler = () => {
        //dispatch(actions.setGuardsUpdate(copyGuards))
        props.setGuardsStrengthen(copyGuards)
        props.finished()
    }

    const renderGuards = sideGuards.map( g => (
        <GuardStrengthen
            key={g.id}
            id={g.id}
            name={g.name}
            hp={g.hp}
            dmg={g.dmg}
            side={props.side}
            points={points}
            addClicked={() => setPoints(points - 1)}
            deductClicked={ () => setPoints(points + 1)}
            guardClicked={guardClicked}
        />
    ))
    const renderBoard = (
        <React.Fragment>
            <div className={styles.Board}>
                <p>{`You have ${points} points left`}</p>
                <div className={[styles.Guards, styles[props.side]].join(' ')}>
                    {renderGuards}
                </div>
            </div>
            {/* props.finished(copyGuards) */}
            <div style={{
                width:"100%",
                margin: "auto",
                alignItems: "center",
                textAlign: "center"
            }}>
                <Button btnType="Danger" disabled={points !== 0} clicked={finishedHandler}>Finish</Button>
            </div>
            
        </React.Fragment>
    )
    return (renderBoard)
}

export default GuardsStrengthen
