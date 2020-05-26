import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { auth } from '../../services/firebase'
import * as actions from '../../store/actions/index'
import styles from './BoardControl.module.css'
import Board from '../../components/Board/Board'
import Button from '../../components/UI/Button/Button'
import Modal from '../../components/UI/Modal/Modal'
import Guard from '../../components/Guard/Guard'
//import Spinner from '../../components/UI/Spinner/Spinner'
import GuardsInfo from '../../components/GuardsInfo/GuardsInfo'
import GuardOptionModal from '../../components/UI/GuardOptionModal/GuardOptionModal'    
import GuardsStrengthen from '../../components/GuardsStrengthen/GuardsStrengthen'
import NavigationItems from '../../components/Navigation/NavigationItems/NavigationItems';
//import { store } from '../../index'

const BoardControl = props => {

    // Connection
    //const [gameKey] = useState(props.location.state.gameKey)
    //const [props.gameInfo] = useState(props.props.gameInfo)
    const [user] = useState(auth().currentUser)
    //const [loading, setLoading] = useState(true)
    const [firebaseError] = useState(null)
    //const [ userSide ] = useState(props.userSide)

    // Game
    const [whosMoving, setWhosMoving] = useState(null)
    //const [initUpdate , setInitUpdate] = useState(false)
    const [whosAttacking, setWhosAttacking] = useState(null)
    const [clickedGuard, setClickedGuard] = useState(null)
    const [doneBtnDisabled, setDoneBtnDisabled] = useState(true)
    
    const [actionCounts, setActionCounts] = useState(0)
    const [isGuardOptionModalShow, setIsGuardOptionModalShow] = useState(false)
    const [isStrengthModalShow, setIsStrengthModalShow] = useState(false)
    //const [initUpdateComplete, setInitUpdateComplete] = useState(false)
    const guards = useSelector(state => state.guards)
    const squares = useSelector(state => state.squares)
    const game = useSelector(state => state.game)
    //const [ifActionComplete, setIfActionComplete] = useState(false)
    const dispatch = useDispatch();
    let ifInitComplete = false
    //let initUpdate = false
    useEffect( () => { 

        //console.log("currentState : ",props.gameInfo.currentState)
        //console.log("props.gameInfo : ",props.gameInfo)
        if ( props.gameInfo.updater !== props.userSide )  {
            updateDataFromCloud()
        }
        else  gameProcessHandler()
        
        
    },[props.gameInfo])

    useEffect( () => {
        if (game.isActionCompleted === true) {
            clickedDoneHandler()
            console.log('Action completed')
        }
    },[game])
    
    // useEffect( () => {
    //     actionComplete()
    // },[ifActionComplete])

    const actionComplete = () => {
        
        let copyGameInfo = {
            ...props.gameInfo,
            guards: guards,
            squares: squares,
            updater: props.userSide
        }
        setDoneBtnDisabled(true)
        const gameStage = props.gameInfo.currentState.split("_")[0]
        const actionTurn = props.gameInfo.currentState.split("_")[1]
        switch(gameStage) {
            case 'strengthening':
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'strengthening_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    copyGameInfo.currentState = 'placing_red'
                }
                return props.uploadGameInfo(copyGameInfo)
            case 'placing':
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'placing_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    let placementFinish = true
                    for (let i = 0; i < guards.length; i++) {
                        placementFinish = guards[i].isPlaced && placementFinish
                    }
                    if (placementFinish) copyGameInfo.currentState = 'fighting_red'
                    else copyGameInfo.currentState = 'placing_red' 
                }
                return props.uploadGameInfo(copyGameInfo)

            case 'fighting':
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'fighting_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    copyGameInfo.currentState = 'fighting_red'
                }
                return props.uploadGameInfo(copyGameInfo)
            default:
                console.log("Unknown Case")
        }
        
    }

    // store.subscribe( () => {
    //     if (ifInitComplete) return 
    //     if ( props.gameInfo.turn === props.userSide ){
    //         console.log("Uploading to Cloud")
    //         const gameStage = props.gameInfo.currentState.split("_")[0]
    //         let nextState = ''
    //         switch(gameStage) {
    //             case 'strengthening':
    //                 nextState = props.gameInfo.turn === 'red' ? 'strengthening_blue' : 'placing_red'
    //                 break
    //             case 'placing':
    //                 let placementFinish = true
    //                 for (let i = 0; i < guards.length; i++) {
    //                     placementFinish = guards[i].isPlaced && placementFinish
    //                 }
    //                 if (placementFinish) nextState = 'fighting_red'
    //                 else nextState = props.gameInfo.turn === 'red' ? 'placing_blue' : 'placing_red'
    //                 break
    //             case 'fighting':
    //                 nextState = props.gameInfo.turn === 'red' ? 'fighting_blue' : 'fighting_red'
    //                 break
    //             default:
    //                 console.log('Error Occurred')
    //         }
    //         props.uploadGameInfo({
    //             ...props.gameInfo,
    //             turn: props.gameInfo.turn === 'red' ? 'blue' : 'red',
    //             currentState: nextState,
    //             updateState: true,
    //             updater: props.userSide,
    //             guards: guards,
    //             squares: squares
    //         })
    //         //setInitUpdateComplete(false)
    //         ifInitComplete = false
    //     }
    // })

    const gameProcessHandler = () => {
        console.log("[ gameProcessHandler ] ")
        const gameStage = props.gameInfo.currentState.split("_")[0]
        const actionTurn = props.gameInfo.currentState.split("_")[1]
        
        switch(gameStage) {
            case 'strengthening':
                console.log("[strengthening]")
                if (props.userSide === actionTurn) return strengtheningHandler()
                else return console.log('waiting for opponent') 
            case 'placing':
                console.log("[placing]")
                // updateGuardsHandler()
                // updateSquaresHandler()
                if (props.userSide === actionTurn) return placingHandler(actionTurn)
                else return console.log('waiting for opponent') 
            case 'fighting':
                console.log("[fighting]")
                // updateGuardsHandler()
                // updateSquaresHandler()
                if (props.userSide === actionTurn) return fightingHandler(actionTurn)
                else return console.log('waiting for opponent') 
            default:
                console.log("Unknown game stage")
        }
    }

    const updateDataFromCloud = () => {

        console.log("[ init update from cloud]")
        // props.uploadGameInfo({
        //     ...props.gameInfo,
        //     updateState: false,
        // })
        ifInitComplete = true
        dispatch(actions.setGuardsUpdate(props.gameInfo.guards))
        dispatch(actions.setSquaresUpdate(props.gameInfo.squares))
        //setInitUpdateComplete(true)
        //console.log('Setting ifInit')
        gameProcessHandler()
        
    }

    // const updateGuardsHandler = () => {
    //     console.log('[update guards from cloud loading')
    //     dispatch(actions.setGuardsUpdate(props.gameInfo.guards))
    // }

    // const updateSquaresHandler = () => {
    //     console.log('[update squares from cloud loading')
    //     dispatch(actions.setSquaresUpdate(props.gameInfo.squares))
    // }

    const squaresFightingClickHandler = (pos) => {
        dispatch(actions.setSquareUnit(guards[whosMoving - 1].pos,'unknown'))
        dispatch(actions.setSquareUnit(pos,whosMoving))
        dispatch(actions.setGuardPos(whosMoving,pos))
        dispatch(actions.setGuardActived(whosMoving,false))
        
        if (actionCounts > 0) {
            dispatch(actions.setSquaresDisabled(true))
            //switchTurn()
            setDoneBtnDisabled(false)
            setActionCounts(0)
            setWhosMoving(null)
            setClickedGuard(null)
            dispatch(actions.setActionCompleted(true))
            setTimeout( () => {
                dispatch(actions.setActionCompleted(false))
            },100)
            //setIfActionComplete(true)
            //actionComplete()
            
        }
        else {
            setActionCounts(1)
            setWhosMoving(null)
            setClickedGuard(null)
            dispatch(actions.setSquaresDisabled(true))
            dispatch(actions.setTeamDisabled(props.gameInfo.turn,false))
        }
    }

    const clickedDoneHandler = () => {
        let copyGameInfo = {
            turn: null,
            currentState: null,
            squares: null,
            guards: null,
            updater: props.userSide
        }
        setDoneBtnDisabled(true)
        const gameStage = props.gameInfo.currentState.split("_")[0]
        const actionTurn = props.gameInfo.currentState.split("_")[1]
        switch(gameStage) {
            case 'strengthening':
                copyGameInfo.guards = guards
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'strengthening_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    copyGameInfo.currentState = 'placing_blue'
                }
                return props.uploadGameInfo(copyGameInfo)
            case 'placing':
                copyGameInfo.guards = guards
                copyGameInfo.squares = squares
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'placing_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    let placementFinish = true
                    for (let i = 0; i < guards.length; i++) {
                        placementFinish = guards[i].isPlaced && placementFinish
                    }
                    if (placementFinish) copyGameInfo.currentState = 'fighting_red'
                    else copyGameInfo.currentState = 'placing_red' 
                }
                return props.uploadGameInfo(copyGameInfo)

            case 'fighting':
                copyGameInfo.guards = guards
                copyGameInfo.squares = squares
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'fighting_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    copyGameInfo.currentState = 'fighting_red'
                }
                return props.uploadGameInfo(copyGameInfo)
            default:
                console.log("Unknown Case")
        }
    }

    const squaresPlacingClickHandler = (pos) => {
        console.log('[squaresPlacingClickHandler]')
        
        dispatch(actions.setSquareUnit(pos,whosMoving))
        dispatch(actions.setSquaresDisabled(true))
        dispatch(actions.setOneGuardDisabled(whosMoving,true))
        dispatch(actions.setGuardActived(whosMoving,false))
        dispatch(actions.setGuardPos(whosMoving,pos))
        dispatch(actions.setGuardisPlaced(whosMoving,true))
        dispatch(actions.setUnplacedGuardsDisabled(props.gameInfo.turn,true))
        //setIfActionComplete(true)
        // setTimeout( () => {
        //     actionComplete()
        // },1000)
        setDoneBtnDisabled(false)
        dispatch(actions.setActionCompleted(true))
        // setWhosMoving(null)
        setTimeout( () => {
            dispatch(actions.setActionCompleted(false))
        },100)
        
    }
 
    const squaresClickedHandler = (e) => {

        switch(props.gameInfo.currentState.split("_")[0]) {
            case 'placing':
                return squaresPlacingClickHandler(e.target.value)
            case 'fighting':
                return squaresFightingClickHandler(e.target.value)
            default:
                return console.log('Error')
        }
    }

    const strengtheningHandler = () => {
        console.log('[strengtheningHandler]')
        setIsStrengthModalShow(true)
    }

    const gameStartHandler = () => {
        const copyGameInfo = {
            ...props.gameInfo,
            turn: 'red',
            currentState:'strengthening_red'
        }
        props.uploadGameInfo(copyGameInfo)
    }

    const closeModalHandler = () => {
        setIsGuardOptionModalShow(false)
    }

    const guardsFightingMovingHandler = () => {
        const id = clickedGuard
        setIsGuardOptionModalShow(false)
        setWhosMoving(id)
        dispatch(actions.setOnlyOneGuardDisabled(id,false))
        dispatch(actions.setGuardActived(id,true))
        dispatch(actions.setSquaresMovingDisabled(guards[id - 1].pos,guards[id - 1].step,true))

    }

    const guardsAttackHandler = () => {
        const id = clickedGuard
        setIsGuardOptionModalShow(false)
        setWhosAttacking(id)
        dispatch(actions.setGuardActived(id,true))
        dispatch(actions.setOnlyOneGuardDisabled(id,false))
        dispatch(actions.setGuardsAttackable(id))
    }

    const guardsAbilityHandler = () => {
        alert('coming soon')
    }

    const guardsFightingClickHandler = (id) => {
        if (whosAttacking !== null && whosAttacking !== id) {
            //clicking attack target
            dispatch(actions.setGuardAttacking(whosAttacking,id))
            dispatch(actions.setGuardActived(whosAttacking,false))
            if (actionCounts > 0) {
                setActionCounts(0)
                setWhosAttacking(null)
                setClickedGuard(null)
                dispatch(actions.setTeamDisabled(props.userSide,true))
                dispatch(actions.setTeamDisabled(props.userSide === 'red' ? 'blue' : 'red',true))
                setDoneBtnDisabled(false)
                dispatch(actions.setActionCompleted(true))
                setTimeout( () => {
                    dispatch(actions.setActionCompleted(false))
                },100)
                //setIfActionComplete(true)
                //actionComplete()
            }
            else {
                setActionCounts(1)
                setClickedGuard(null)
                setWhosAttacking(null)
                dispatch(actions.setTeamDisabled(props.userSide,false))
                dispatch(actions.setTeamDisabled(props.userSide === 'red' ? 'blue' : 'red',true))
            }
        } 
        else if (whosMoving !== null || whosAttacking !== null) {
            // double clicked
            dispatch(actions.setGuardActived(id,false))
            dispatch(actions.setSquaresDisabled(true))
            dispatch(actions.setTeamDisabled(props.gameInfo.turn,false))
            setIsGuardOptionModalShow(false)
            setClickedGuard(null)
            setWhosMoving(null)
            setWhosAttacking(null)
        }
        else {
            // first click 
            setIsGuardOptionModalShow(true)
            setClickedGuard(id)
        }
        

        
    }

    const guardsPlacingClickHandler = (id) => {
        
        if (whosMoving === id) {
            dispatch(actions.setGuardActived(whosMoving,false))
            dispatch(actions.setSquaresPlacingDisabled(props.gameInfo.turn,true))
            setWhosMoving(null)
        }
        else if (whosMoving !== null) {
            dispatch(actions.setGuardActived(whosMoving,false))
            dispatch(actions.setGuardActived(id,true))
            dispatch(actions.setSquaresPlacingDisabled(props.gameInfo.turn,false))
            setWhosMoving(id)
        }
        else {
            dispatch(actions.setGuardActived(id,true))
            dispatch(actions.setSquaresPlacingDisabled(props.gameInfo.turn,false))
            setWhosMoving(id)
        }
    }

    const guardsClickedHandler = (id) => {
        
        switch(props.gameInfo.currentState.split("_")[0]) {
            case 'placing':
                return guardsPlacingClickHandler(id)
            case 'fighting':
                return  guardsFightingClickHandler(id)
            default:
                console.log('Unknown Stage')
        }
        
    }

    const strengtheningFinished = () => {
        console.log("[ strengtheningFinished ]")
        setIsStrengthModalShow(false)
        //setIfActionComplete(true)
        actionComplete()
        // props.uploadGameInfo({
        //     ...props.gameInfo,
        //     updateState: true,
        //     currentState: props.gameInfo.currentState === 'strengthening_red' ? 'strengthening_blue' : 'placing_red',
        //     turn: props.userSide === 'red' ? 'blue' : 'red',
        //     guards: guards,
        //     squares: squares
        // })
    }

    const placingHandler = (side) => {
        console.log('placing start')
        dispatch(actions.setUnplacedGuardsDisabled(side,false))

    }

    const fightingHandler = (turn) => {
        dispatch(actions.setTeamDisabled(turn,false))
    }

    const renderGuards = <div className={styles.GuardsBoard}>
            {guards.map( g => 
            g.isPlaced || ( props.gameInfo ? g.side !== (props.gameInfo.red === user.email ? 'red' : 'blue') : false)
            ? null 
            :<Guard
                id={g.id}
                key={g.id}
                side={g.side}
                clicked={() => guardsClickedHandler(g.id)} 
                pos={g.pos}
                name={g.name} 
                disabled={g.disabled}
                actived={g.actived}
            />
            )}
        </div>

    const renderGameInfo = (
        <div>
            <p>Red : {props.gameInfo.red}</p>
            <p>Blue : {props.gameInfo.blue ? props.gameInfo.blue : 'Waiting blue to join...'}</p>
            <p>Turn : {props.gameInfo.turn ? props.gameInfo.turn : 'Waiting ...'}</p>
            <h1>{props.gameInfo.currentState}</h1>
        </div>
    )
        

    //console.log("props.gameInfo : ",props.gameInfo)
    //console.log("user side : ", userSide)
    // store.subscribe(() => {
    //     console.log("Redux is changing")
    // })
    //console.log("[BoardControl] Updated")
    
    return(
        <div>
        {/* // <div onMouseMove={mouseMovehandler}> */}
            <NavigationItems />
            <p>Login as : <strong>{user.email}</strong></p>
            <p>Game ID : <strong>{props.gameInfo.gid}</strong></p>
            {firebaseError ? firebaseError : null}
            {renderGameInfo}
            {/* <Modal show={isModalShow} modalClosed={null}>
                {modalMessage}
            </Modal> */}
            <Modal show={isStrengthModalShow} modalClosed={null}>
                <GuardsStrengthen finished={strengtheningFinished} side={props.gameInfo ? props.gameInfo.turn : null}/>
            </Modal>
            <GuardOptionModal show={isGuardOptionModalShow} modalClosed={closeModalHandler}>
                <Button btnType='Success' clicked={guardsFightingMovingHandler}>Move</Button>
                <Button btnType='Success' clicked={guardsAttackHandler}>Attack</Button>
                <Button btnType='Success' clicked={guardsAbilityHandler}>Ability</Button>
                <p></p>
                <Button btnType='Danger' clicked={closeModalHandler}>Close</Button>
            </GuardOptionModal>
            {props.userSide === 'red' 
            ? <Button btnType="Success" clicked={gameStartHandler} disabled={!(props.gameInfo.currentState === 'blueJoined')}>Game Start</Button> 
            : null
            }
            <Button btnType="Danger" clicked={clickedDoneHandler} disabled={doneBtnDisabled}>Done</Button>
            
            <div className={styles.BoardControl}>
                <div className={styles.SquareBoard}>
                    <Board 
                        clicked={ e => squaresClickedHandler(e)}
                        gclicked={ e => guardsClickedHandler(e.target.id)} 
                    />
                </div>
                {renderGuards}
            </div>
            <GuardsInfo side={props.userSide}/>
            
        </div>
        
    )


    

}

export default BoardControl