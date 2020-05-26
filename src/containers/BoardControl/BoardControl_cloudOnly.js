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

    const [isWaiting, setIsWaiting] = useState(false)

    const [actionCounts, setActionCounts] = useState(0)
    const [isGuardOptionModalShow, setIsGuardOptionModalShow] = useState(false)
    const [isStrengthModalShow, setIsStrengthModalShow] = useState(false)
    //const [initUpdateComplete, setInitUpdateComplete] = useState(false)
    //const guards = useSelector(state => state.guards)
    //const squares = useSelector(state => state.squares)
    const game = useSelector(state => state.game)
    const dispatch = useDispatch();
    //let ifInitComplete = false
    //let initUpdate = false
    useEffect( () => { 

        //console.log("currentState : ",props.gameInfo.currentState)
        console.log("props.gameInfo : ",props.gameInfo)
        if (props.gameInfo.turn !== props.userSide) setIsWaiting(true)
        else setIsWaiting(false)
        
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


        //console.log("BoardControl re-render")
        if ( props.gameInfo.updater !== props.userSide )  {
            gameProcessHandler()
        }
        
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
        
        // let copyGameInfo = {
        //     ...props.gameInfo,
        //     guards: guards,
        //     squares: squares,
        //     updater: props.userSide
        // }
        let copyGameInfo = {
            ...props.gameInfo,
            guards: props.gameInfo.guards,
            squares: props.gameInfo.squares,
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
                    for (let i = 0; i < props.gameInfo.guards.length; i++) {
                        placementFinish = props.gameInfo.guards[i].isPlaced && placementFinish
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

    const squaresFightingClickHandler = (pos) => {
        props.setSquareUnit(props.gameInfo.guards[whosMoving - 1].pos,'unknown')
        props.setSquareUnit(pos,whosMoving)
        props.setGuardPos(whosMoving,pos)
        props.setGuardActived(whosMoving,false)
        
        if (actionCounts > 0) {
            props.setSquaresDisabled(true)
            //switchTurn()
            setDoneBtnDisabled(false)
            setActionCounts(0)
            setWhosMoving(null)
            setClickedGuard(null)
            props.setActionCompleted(true)
            setTimeout( () => {
                props.setActionCompleted(false)
            },100)
            //setIfActionComplete(true)
            //actionComplete()
            
        }
        else {
            setActionCounts(1)
            setWhosMoving(null)
            setClickedGuard(null)
            props.setSquaresDisabled(true)
            props.setTeamDisabled(props.gameInfo.turn,false)
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
                copyGameInfo.guards = props.gameInfo.guards
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
                copyGameInfo.guards = props.gameInfo.guards
                copyGameInfo.squares = props.gameInfo.squares
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'placing_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    let placementFinish = true
                    for (let i = 0; i < props.gameInfo.guards.length; i++) {
                        placementFinish = props.gameInfo.guards[i].isPlaced && placementFinish
                    }
                    if (placementFinish) copyGameInfo.currentState = 'fighting_red'
                    else copyGameInfo.currentState = 'placing_red' 
                }
                return props.uploadGameInfo(copyGameInfo)

            case 'fighting':
                copyGameInfo.guards = props.gameInfo.guards
                copyGameInfo.squares = props.gameInfo.squares
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
        props.squaresPlacingClickHandler(pos)
        //actionComplete()
        //props.actionCompleted()
        // props.setSquareUnit(pos,whosMoving)
        // props.setSquaresDisabled(true)
        // props.setOneGuardDisabled(whosMoving,true)
        // props.setGuardActived(whosMoving,false)
        // props.setGuardPos(whosMoving,pos)
        // props.setGuardisPlaced(whosMoving,true)
        // props.setUnplacedGuardsDisabled(props.gameInfo.turn,true)
        //setIfActionComplete(true)
        // setTimeout( () => {
        //     actionComplete()
        // },1000)
        setDoneBtnDisabled(false)
        //actionComplete()
        //props.setActionCompleted(true)
        // setWhosMoving(null)
        
    }
 
    const squaresClickedHandler = (e) => {

        switch(props.gameInfo.currentState.split("_")[0]) {
            case 'placing':
                return squaresPlacingClickHandler(e.target.value)
            case 'fighting':
                return props.squaresFightingClickHandler(e.target.value)
                //return squaresFightingClickHandler(e.target.value)
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
        dispatch(actions.setWhosMoving(null))
        dispatch(actions.setWhosAttacking(null))
    }

    const guardsFightingMovingHandler = () => {
        //const id = clickedGuard
        setIsGuardOptionModalShow(false)
        props.guardsFightingMovingHandler()
        //dispatch(actions.setWhosMoving(game.whosAttacking))
        // props.setOnlyOneGuardDisabled(id,false)
        // props.setGuardActived(id,true)
        // props.setSquaresMovingDisabled(props.gameInfo.guards[id - 1].pos,props.gameInfo.guards[id - 1].step,true)

    }

    // const guardsAttackHandler = () => {
    //     const id = clickedGuard
    //     setIsGuardOptionModalShow(false)
    //     setWhosAttacking(id)
    //     // props.setGuardActived(id,true)
    //     // props.setOnlyOneGuardDisabled(id,false)
    //     // props.setGuardsAttackable(id)
    // }

    const guardsAbilityHandler = () => {
        alert('coming soon')
    }

    const guardsFightingClickHandler = (id) => {
        if (game.whosAttacking !== null && game.whosAttacking !== id) {
            // -- clicking attack target --
            //props.setGuardAttacking(whosAttacking,id)
            props.guardsAttackingClick(game.whosAttacking,id)
        } 
        else if (game.whosMoving !== null || game.whosAttacking !== null) {
            // -- double clicked --
            props.fightingActionCanceled()
            // props.setGuardActived(id,false)
            // props.setSquaresDisabled(true)
            // props.setTeamDisabled(props.gameInfo.turn,false)
            setIsGuardOptionModalShow(false)
            // setClickedGuard(null)
            // setWhosMoving(null)
            // setWhosAttacking(null)
        }
        else {
            // first click 
            setIsGuardOptionModalShow(true)
            dispatch(actions.setWhosAttacking(id))
            //setClickedGuard(id)
        }
        

        
    }

    const guardsPlacingClickHandler = (id) => {
        
        if (game.whosMoving === id) {
            // props.setGuardActived(game.whosMoving,false)
            // props.setSquaresPlacingDisabled(props.gameInfo.turn,true)
            props.guardsPlacingClickTwice(id,props.gameInfo.turn,true)
            dispatch(actions.setWhosMoving(null))
            props.actionCompleted()
            //setWhosMoving(null)
        }
        else if (game.whosMoving !== null) {
            // props.setGuardActived(game.whosMoving,false)
            // props.setGuardActived(id,true)
            // props.setSquaresPlacingDisabled(props.gameInfo.turn,false)
            props.guardsPlacingClick(id,true,props.gameInfo.turn,false)
            dispatch(actions.setWhosMoving(id))
            props.actionCompleted()
            //setWhosMoving(id)
        }
        else {
            props.guardsPlacingClick(id,true,props.gameInfo.turn,false)
            // props.setGuardActived(id,true)
            // props.setSquaresPlacingDisabled(props.gameInfo.turn,false)
            props.actionCompleted()
            //setWhosMoving(id)
            dispatch(actions.setWhosMoving(id))
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
        actionComplete()
        //setIfActionComplete(true)
        
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
        //if (props.gameInfo.guards)
        props.setUnplacedGuardsDisabled(side,false)

    }

    const fightingHandler = (turn) => {
        props.setTeamDisabled(turn,false)
    }

    const renderGuards = <div className={styles.GuardsBoard}>
            {props.gameInfo.guards.map( g => 
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

    // const renderGameInfo = (
    //     <div>
    //         <p>Red : {props.gameInfo.red}</p>
    //         <p>Blue : {props.gameInfo.blue ? props.gameInfo.blue : 'Waiting blue to join...'}</p>
    //         <p>Turn : {props.gameInfo.turn ? props.gameInfo.turn : 'Waiting ...'}</p>
    //         <h1>{props.gameInfo.currentState}</h1>
    //     </div>
    // )
        

    //console.log("props.gameInfo : ",props.gameInfo)
    //console.log("user side : ", userSide)
    // store.subscribe(() => {
    //     console.log("Redux is changing")
    // })
    //console.log("[BoardControl] Updated")
    //console.log("game.whosMoving : ",game.whosMoving)
    return(
        <div>
        {/* // <div onMouseMove={mouseMovehandler}> */}
            <NavigationItems />
            <div className={styles.GameInfos}>
                <div className={styles.GameInfo}>Game State : <strong>{props.gameInfo.currentState}</strong></div>
                <div className={styles.GameInfo}>Game ID : <strong>{props.gameInfo.gid}</strong></div>
                <div className={styles.GameInfo}>Login as : <strong>{user.email}</strong></div>
            </div>
            
            {firebaseError ? firebaseError : null}
            {/* {renderGameInfo} */}
            {/* <Modal show={isModalShow} modalClosed={null}>
                {modalMessage}
            </Modal> */}
            <Modal show={isStrengthModalShow} modalClosed={null}>
                <GuardsStrengthen 
                    guards={props.gameInfo.guards} 
                    finished={strengtheningFinished} 
                    setGuardsStrengthen={props.setGuardsStrengthen}
                    side={props.gameInfo ? props.gameInfo.turn : null}
                />
            </Modal>
            <Modal show={isWaiting} modalClosed={null}>
                Waiting opponent
            </Modal>
            <GuardOptionModal show={isGuardOptionModalShow} modalClosed={closeModalHandler}>
                <Button btnType='Success' clicked={guardsFightingMovingHandler}>Move</Button>
                <Button btnType='Success' clicked={props.guardsAttackHandler}>Attack</Button>
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
                        cloudGuards={props.gameInfo.guards}
                        cloudSquares={props.gameInfo.squares}
                        clicked={ e => squaresClickedHandler(e)}
                        gclicked={ e => guardsClickedHandler(e.target.id)} 
                    />
                </div>
                {renderGuards}
            </div>
            <GuardsInfo guards={props.gameInfo.guards} side={props.userSide}/>
            
        </div>
        
    )


    

}

export default BoardControl