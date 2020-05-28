import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { auth } from '../../services/firebase'
import * as actions from '../../store/actions/index'
import styles from './BoardControl.module.css'
import Board from '../../components/Board/Board'
import Button from '../../components/UI/Button/Button'
import Modal from '../../components/UI/Modal/Modal'
import StrengthenModal from '../../components/UI/StrengthenModal/StrengthenModal'
import Wavy from '../../components/UI/Wavy/Wavy'
import FillUpModal from '../../components/UI/FillUpModal/FillUpModal'
import AbilityModal from '../../components/UI/AbilityModal/AbilityModal'
import Guard from '../../components/Guard/Guard'
//import Spinner from '../../components/UI/Spinner/Spinner'
import GuardsInfo from '../../components/GuardsInfo/GuardsInfo'
import GuardOptionModal from '../../components/UI/GuardOptionModal/GuardOptionModal'    
import GuardsStrengthen from '../../components/GuardsStrengthen/GuardsStrengthen'
//import { useHistory } from 'react-router'
import { Redirect} from 'react-router-dom'
//import NavigationItems from '../../components/Navigation/NavigationItems/NavigationItems';

const BoardControl = props => {

    const [user] = useState(auth().currentUser)
    const [firebaseError] = useState(null)
    const [isFilling, setIsFilling] = useState(false)
    const [isWaiting, setIsWaiting] = useState(false)
    const [isGuardOptionModalShow, setIsGuardOptionModalShow] = useState(false)
    const [isStrengthModalShow, setIsStrengthModalShow] = useState(false)
    const game = useSelector(state => state.game)
    //const history = useHistory()
    const dispatch = useDispatch();

    const gameProcessHandler = () => {
        //console.log("[ gameProcessHandler ] ")
        const gameStage = game.gameInfo.currentState.split("_")[0]
        const actionTurn = game.gameInfo.currentState.split("_")[1]
        
        switch(gameStage) {
            case 'strengthening':
                if (props.userSide === actionTurn) return strengtheningHandler()
                else return console.log('waiting for opponent') 
            case 'placing':
                if (props.userSide === actionTurn) return placingHandler(actionTurn)
                else return console.log('waiting for opponent') 
            case 'fighting':
                if (props.userSide === actionTurn) return fightingHandler(actionTurn)
                else return
            default:
                //console.log("Unknown game stage")
        }
    }

    useEffect( () => {

        const isGuardsDead = [...game.gameInfo.guards].filter( g => g.side === props.userSide && +g.hp === 0 && g.pos !== 'unknown')
        const unplacedGuards = [...game.gameInfo.guards].filter( g => (g.side === props.userSide) && !g.isPlaced)
        if (game.gameInfo.turn !== props.userSide) {
            //waiting
            //setIsWaiting(true)
            if (game.gameInfo.winner !== "unknown") return setIsWaiting(false)
            else return setIsWaiting(true)
            
        }
        else {
            if (isGuardsDead.length > 0 && unplacedGuards.length > 0) {
                setIsWaiting(false)
                props.updateGameInfo({
                    ...game.gameInfo
                })
                // return setTimeout( () => { 
                //     setIsFilling(true)
                // },500)
            }
            if (game.gameInfo.winner !== "unknown") setIsWaiting(false)
            else {
                if (isWaiting) {
                    setTimeout( () => {
                        setIsWaiting(false)
                    },1000)
                }
                else return gameProcessHandler()    
            }
            // user turn
            // if (isGuardsDead.length > 0 && unplacedGuards.length > 0) {
            //     setTimeout( () => {
            //         setIsWaiting(false)
            //         setIsFilling(true)
            //     },1000)
            // }
            // else {
            //     if (game.gameInfo.winner !== "unknown") setIsWaiting(false)
            //     else {
            //         if (isWaiting) {
            //             setTimeout( () => {
            //                 setIsWaiting(false)
            //             },1000)
            //         }
            //         else return gameProcessHandler()    
            //     }
                
            // }
        }
    gameProcessHandler()
        
    },[game.gameInfo])

    const actionComplete = () => {

        let copyGameInfo = {
            ...game.gameInfo,
            guards: game.gameInfo.guards,
            squares: game.gameInfo.squares,
            updater: game.userSide
        }
        //setDoneBtnDisabled(true)
        const gameStage = game.gameInfo.currentState.split("_")[0]
        const actionTurn = game.gameInfo.currentState.split("_")[1]
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
                return props.updateGameInfo(copyGameInfo)
            case 'placing':
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'placing_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    let placementFinish = true
                    for (let i = 0; i < game.gameInfo.guards.length; i++) {
                        placementFinish = game.gameInfo.guards[i].isPlaced && placementFinish
                    }
                    if (placementFinish) copyGameInfo.currentState = 'fighting_red'
                    else copyGameInfo.currentState = 'placing_red' 
                }
                return props.updateGameInfo(copyGameInfo)

            case 'fighting':
                if (actionTurn === 'red') {
                    copyGameInfo.turn = 'blue'
                    copyGameInfo.currentState = 'fighting_blue'
                }
                else {
                    copyGameInfo.turn = 'red'
                    copyGameInfo.currentState = 'fighting_red'
                }
                return props.updateGameInfo(copyGameInfo)
            default:
                console.log("Unknown Case")
        }
        
    }
    const squaresPlacingClickHandler = (pos) => {

        console.log('[squaresPlacingClickHandler]')
        props.squaresPlacingClickHandler(pos)
        //setDoneBtnDisabled(false)
        
    }
 
    const squaresClickedHandler = (pos) => {

        switch(game.gameInfo.currentState.split("_")[0]) {
            case 'placing':
                return squaresPlacingClickHandler(pos)
            case 'fighting':
                return props.squaresFightingClickHandler(pos)
                //return squaresFightingClickHandler(e.target.value)
            default:
                return console.log('Error')
        }
    }

    const strengtheningHandler = () => {
        console.log('[strengtheningHandler]')
        if (props.userSide === 'blue') return setTimeout( () => { setIsStrengthModalShow(true) },1100)
        else return setIsStrengthModalShow(true)
    }

    const gameStartHandler = () => {
        const copyGameInfo = {
            ...game.gameInfo,
            turn: 'red',
            currentState:'strengthening_red'
        }
        props.updateGameInfo(copyGameInfo)
    }

    const closeModalHandler = () => {
        setIsGuardOptionModalShow(false)
        dispatch(actions.setWhosMoving(null))
        dispatch(actions.setWhosAttacking(null))
    }

    const guardsFightingMovingHandler = (id) => {
        //const id = clickedGuard
        setIsGuardOptionModalShow(false)
        props.guardsFightingMovingHandler(id)

    }

    const guardsAttackHandler = (id) => {
        //const id = clickedGuard
        setIsGuardOptionModalShow(false)
        //setWhosAttacking(id)
        props.guardsAttackHandler(id)
    }


    const guardsFightingClickHandler = (id) => {

        if (!game.gameInfo.guards[id-1].isPlaced) {
            // switch
            if (game.whosAttacking === null) {
                dispatch(actions.setWhosAttacking(id))
                props.switchGuardsHandler(id) 
            }
            else {
                dispatch(actions.setWhosAttacking(null))
                props.switchGuardsClickedTwiceHandler(id)
            }
        }
        else {

            if (game.whosAttacking !== null && game.whosAttacking !== id) {
                // -- clicking attack target --
                if (game.gameInfo.guards[game.whosAttacking-1].side === game.gameInfo.guards[id-1].side) {
                    props.guardsSwitchingHandler(id)
                }
                else props.guardsAttackingClick(game.whosAttacking,id)
            }
            else if (game.whosMoving !== null || game.whosAttacking !== null) {
                // -- double clicked --
                props.fightingActionCanceled()
                setIsGuardOptionModalShow(false)
            }
            else {
                if (game.whosAbility !== null) return props.abilityAttackHandler(id)
                // first click 
                dispatch(actions.setWhosAttacking(id))
                props.guardsFightingClickHandler(id)
            }
        }
    }

    const guardsPlacingClickHandler = (id) => {
        
        if (game.whosMoving === id) {
            //double click
            // props.setGuardActived(game.whosMoving,false)
            // props.setSquaresPlacingDisabled(game.gameInfo.turn,true)
            props.guardsPlacingClickTwice(id,game.gameInfo.turn,true)
            dispatch(actions.setWhosMoving(null))
            //props.actionCompleted()
            //setWhosMoving(null)
        }
        else if (game.whosMoving !== null) {
            // -- switch guards --

            //cloud setting
            props.guardsPlacingClick(id,true,game.gameInfo.turn,false)
            dispatch(actions.setWhosMoving(id))

            //local setting
            // props.setGuardActived(game.whosMoving,false)
            // props.setGuardActived(id,true)
            // props.setSquaresPlacingDisabled(game.gameInfo.turn,false)
            //props.actionCompleted()
            //setWhosMoving(id)
        }
        else {
            // -- first click --

            //cloud setting
            props.guardsPlacingClick(id,true,game.gameInfo.turn,false)
            dispatch(actions.setWhosMoving(id))

            //local setting
            // props.setGuardActived(id,true)
            // props.setSquaresPlacingDisabled(game.gameInfo.turn,false)
            //props.actionCompleted()
            //setWhosMoving(id)
            
        }
    }

    const guardsClickedHandler = (id) => {
        
        switch(game.gameInfo.currentState.split("_")[0]) {
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
    }

    const placingHandler = (side) => {
        console.log('placing start')
        props.setUnplacedGuardsDisabled(side,false)

    }

    const jumpToFighting = () => {
        props.setJumpToFighting()
    }

    const fightingHandler = (turn) => {
        //props.checkKingBonus(turn)
        if ( (game.whosAttacking === null) && (game.whosMoving === null) && (game.whosAbility === null) ) {
            
            //return props.setTeamDisabled(turn,false)
        }
        
    }
    
    const fillUpHandler = (id) => {
        let deadPos = null
        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.side === game.gameInfo.guards[id-1].side && +g.hp === 0 && g.pos !== 'unknown') {
                deadPos = g.pos
                return {...g,pos:'unknown'}
            }
            else return {...g}
        })
        const finalGuards = newGuards.map( g => {
            if (g.id === id) return {
                ...g,isPlaced: true, pos: deadPos
            }
            else return {...g}
        })
        const newSquares = [...game.gameInfo.squares].map( s => {
            if (s.pos === deadPos) return {...s,unit: id}
            else return {...s}
        })

        props.updateGameInfo({
            ...game.gameInfo,
            squares: newSquares,
            guards: finalGuards
        })
        setIsFilling(false)
    }

    const renderFillUpGuards = 
    <div className={styles.GuardsBoard}>
        { game.gameInfo ? game.gameInfo.guards.map( g => 
        g.isPlaced || ( game.gameInfo ? g.side !== (game.gameInfo.red === user.email ? 'red' : 'blue') : false)
        ? null 
        :<Guard
            id={g.id}
            key={g.id}
            side={g.side}
            clicked={() => fillUpHandler(g.id)} 
            pos={g.pos}
            name={g.name} 
            disabled={false}
            actived={g.actived}
        />
        ):null}
    </div>

    const renderGuardsList = [...game.gameInfo.guards].filter( g => (g.side === props.userSide) && !g.isPlaced )
    const renderGuards = 
        renderGuardsList.length > 0 ?
        <div className={styles.GuardsBoard}>
            {renderGuardsList.map( g => 
            <Guard
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
        : null

    let renderGuardsBoard = null
    let renderSquaresBoard = null
    if (game.gameInfo.turn === game.userSide) {
        renderGuardsBoard = game.gameInfo.guards
        renderSquaresBoard = game.gameInfo.squares
    }
    else {
        renderGuardsBoard = game.gameInfo.guards
        renderSquaresBoard = game.gameInfo.squares
    }

    const settingMessage = () => {
        let result = <div style={{fontSize:'20px',color:'white'}}>
                <Wavy>Waiting...</Wavy>
            </div>
        return result
    }
    const renderMessage = settingMessage()

    
    return(
        <React.Fragment>
            <FillUpModal show={isFilling} modalClosed={null}>
                <h3>One of your unit is dead,please choice an unit to fill </h3>
                {renderFillUpGuards}
            </FillUpModal>
            
            {firebaseError ? firebaseError : null}
            <Modal styled={{backgroundColor:'#000000b5'}} show={game.gameInfo.currentState === 'waitingBlue'} modalClosed={null}>
                <Wavy styled={{color:'white'}}>Waiting Blue ...</Wavy>
            </Modal>
            <StrengthenModal show={isStrengthModalShow} modalClosed={null}>
                <GuardsStrengthen 
                    guards={game.gameInfo.guards} 
                    finished={strengtheningFinished} 
                    setGuardsStrengthen={props.setGuardsStrengthen}
                    side={game.gameInfo ? game.gameInfo.turn : null}
                />
            </StrengthenModal>
            <Modal styled={{backgroundColor:'#000000b5'}} show={isWaiting} modalClosed={null}>
                {renderMessage}
            </Modal>
            <Modal show={game.gameInfo ? game.gameInfo.winner !== "unknown" ? true : false : false} modalClosed={null}>
                <h1>Winner : {game.gameInfo ? game.gameInfo.winner !== "unknown" ? game.gameInfo.winner : null : false}</h1>
            </Modal>
            <GuardOptionModal show={isGuardOptionModalShow} modalClosed={closeModalHandler}>
                <Button btnType='Success' clicked={guardsFightingMovingHandler}>Move</Button>
                <Button btnType='Success' clicked={guardsAttackHandler}>Attack</Button>
                {/* <Button btnType='Success' clicked={guardsAbilityHandler}>Ability</Button> */}
                <p></p>
                <Button btnType='Danger' clicked={closeModalHandler}>Close</Button>
            </GuardOptionModal>
            {props.userSide === 'red' && game.gameInfo.currentState === 'blueJoined'}
            
            <Modal show={props.userSide === 'red' && game.gameInfo.currentState === 'blueJoined'} modalClosed={null}>
                <div className={styles.GameStart}>
                    <Button btnType="Success" clicked={gameStartHandler} disabled={!(game.gameInfo.currentState === 'blueJoined')}>Game Start</Button>
                    <Button btnType="Info" clicked={jumpToFighting} disabled={game.gameInfo.currentState.split("_")[0] === 'fighting'}> Jump To Fighting</Button>
                </div>
            </Modal>
            
            <AbilityModal show={game.whosAbility !== null} modalClosed={null}>
                <Wavy>Choose your target</Wavy>
                <Button clicked={props.fightingActionCanceled} btnType="Danger">Cancel</Button>
            </AbilityModal>
            
            <div className={styles.GameBoard}>
                <div className={styles.GameInfoDiv}>
                    {game.gameInfo.currentState.split("_")[0] === 'fighting'
                    ? <GuardsInfo abilityHandler={props.abilityHandler} guards={game.gameInfo.guards} userSide={props.userSide} side="red"/> 
                    : props.userSide === 'red' ? <GuardsInfo guards={game.gameInfo.guards} userSide={props.userSide} side="red"/>
                    : null}
                </div>
                <div className={styles.BoardControl}>
                    <div className={styles.SquareBoard}>
                        {game.gameInfo.currentState === 'userLeft' 
                        ? <Redirect to="/" />
                        : <Board
                            renderGuards={renderGuardsBoard}
                            renderSquares={renderSquaresBoard}
                            clicked={ e => squaresClickedHandler(e)}
                            gclicked={guardsClickedHandler} 
                            // gclicked={ e => guardsClickedHandler(e.target.id)} 
                        />}
                        {renderGuards}
                    </div>
                </div>
                <div className={styles.GameInfoDiv}>
                    {game.gameInfo.currentState.split("_")[0] === 'fighting'
                    ? <GuardsInfo abilityHandler={props.abilityHandler} guards={game.gameInfo.guards} userSide={props.userSide} side="blue"/> 
                    : props.userSide === 'blue' ? <GuardsInfo guards={game.gameInfo.guards} userSide={props.userSide} side="blue"/>
                    : null}
                </div>
            </div>
            
        </React.Fragment>
        
    )


    

}

export default BoardControl