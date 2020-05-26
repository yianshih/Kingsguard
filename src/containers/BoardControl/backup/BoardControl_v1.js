import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
//import { Link } from 'react-router-dom';
import { auth, db } from '../../services/firebase'
import * as actions from '../../store/actions/index'
import styles from './BoardControl.module.css'
import Board from '../../components/Board/Board'
import Button from '../../components/UI/Button/Button'
import Modal from '../../components/UI/Modal/Modal'
import Guard from '../../components/Guard/Guard'
import Spinner from '../../components/UI/Spinner/Spinner'
import GuardsInfo from '../../components/GuardsInfo/GuardsInfo'
import GuardOptionModal from '../../components/UI/GuardOptionModal/GuardOptionModal'    
import GuardsStrengthen from '../../components/GuardsStrengthen/GuardsStrengthen'
import NavigationItems from '../../components/Navigation/NavigationItems/NavigationItems';
//import square from '../../components/Board/Square/Square'
//import square from '../../components/Board/Square/Square'
// import ReactCursorPosition, { INTERACTIONS } from 'react-cursor-position';
// import PositionLabel from './PositionLabel'

const BoardControl = props => {

    const guards = useSelector(state => state.guards);
    const squares = useSelector(state => state.squares);
    const dispatch = useDispatch();

    // Connection
    const [gameKey] = useState(props.location.state.gameKey)
    //const [message, setMessage] = useState(null)
    const [gameInfo, setGameInfo] = useState(null)
    //const [guardsCloud, setGuardsCloud] = useState(null)
    //const [squaresCloud, setSquaresCloud] = useState(null)
    const [user] = useState(auth().currentUser)
    const [loading, setLoading] = useState(true)
    const [firebaseError, setFirebaseError] = useState(null)

    // Game
    //const [userSide, setUserSide] = useState(null)
    //const [userAction, setUserAction] = useState(null)
    //const [turn, setTurn] = useState(null)
    //const [gameStage, setGameStage] = useState(null)
    //const [fightStart, setFightStart] = useState(false)
    //const [gameStart, setGameStart] = useState(false)
    //const [modalMessage, setModalMessage] = useState(null)
    //const [isModalShow, setIsModalShow] = useState(false)
    const [whosMoving, setWhosMoving] = useState(null)
    const [whosAttacking, setWhosAttacking] = useState(null)
    const [clickedGuard, setClickedGuard] = useState(null)
    const [doneBtnDisabled, setDoneBtnDisabled] = useState(true)
    
    const [actionCounts, setActionCounts] = useState(0)
    const [isGuardOptionModalShow, setIsGuardOptionModalShow] = useState(false)
    const [isStrengthModalShow, setIsStrengthModalShow] = useState(false)
    //const [isStrengthFinished, setIsStrengthFinished] = useState(false)
    const fetchData = async () => {
        try {
            //console.log(`fetch data from game ${gameKey}`)
            console.log('[fetching data]')
            await db.ref("games/" + gameKey).on("value", snapshot => {
                //console.log("snapshot.val() : ",snapshot.val())
                setGameInfo(snapshot.val())
                // if (snapshot.val().guards !== 'unknown') {
                //     console.log('[setGuardsCloud] : ', snapshot.val().guards)
                //     setGuardsCloud(snapshot.val().guards)
                // }
                // if (snapshot.val().squares !== 'unknown') {
                //     console.log('[setSquaresCloud] : ', snapshot.val().squares)
                //     setSquaresCloud(snapshot.val().squares)
                // }

                // if (snapshot.val().red === user.email) {
                //     setUserSide('red')
                // }
                // else {
                //     setUserSide('blue')
                // }
            setLoading(false)
            })
            
        } catch(error) {
            setFirebaseError(error.message)
        }
    }

    // useEffect( () => {
    //     gameProcessHandler()
    // },[userSide])

    useEffect( () => {
        fetchData()
    },[gameKey,user.email])

    useEffect( () => { 
        if (gameInfo !== null) {
            gameProcessHandler()
        }
    },[gameInfo])

    const gameProcessHandler = () => {
        console.log("[ gameProcessHandler ] ")
        const gameStage = gameInfo.currentState.split("_")[0]
        const actionTurn = gameInfo.currentState.split("_")[1]
        switch(gameStage) {
            case 'strengthening':
                if (user.email === gameInfo[actionTurn])
                    return strengtheningHandler()
                else
                    return console.log('waiting for opponent') 
                
            case 'placing':
                updateGuardsHandler()
                updateSquaresHandler()
                if (user.email === gameInfo[actionTurn])
                    return placingHandler('red')
                else
                    return console.log('waiting for opponent') 
                
            case 'fighting':
                updateGuardsHandler()
                updateSquaresHandler()
                if (user.email === gameInfo[actionTurn])
                    return fightingHandler()
                else
                    return console.log('waiting for opponent') 
            default:
                console.log("Unknown game stage")
        }
    }

    const updateGuardsHandler = () => {
        console.log('[update guards from cloud loading')
        dispatch(actions.setGuardsUpdate(gameInfo.guards))
    }

    const updateSquaresHandler = () => {
        console.log('[update squares from cloud loading')
        dispatch(actions.setSquaresUpdate(gameInfo.squares))
    }

    const squaresFightingClickHandler = (pos) => {
        dispatch(actions.setSquareUnit(guards[whosMoving - 1].pos,null))
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
        }
        else {
            setActionCounts(1)
            setWhosMoving(null)
            setClickedGuard(null)
            dispatch(actions.setSquaresDisabled(true))
            dispatch(actions.setTeamDisabled(gameInfo.turn,false))
        }
    }

    const clickedDoneHandler = () => {
        let copyGameInfo = null
        setDoneBtnDisabled(true)
        switch(gameInfo.currentState) {
            case 'strengthening_red':
                copyGameInfo = {
                    turn: 'blue',
                    currentState: 'strengthening_blue',
                    guards: guards
                }
                return updateGameInfo(copyGameInfo)
            case 'strengthening_blue':
                copyGameInfo = {
                    turn: 'red',
                    currentState: 'placing_red',
                    guards: guards
                }
                return updateGameInfo(copyGameInfo)
            case 'placing_red':
                copyGameInfo = {
                    turn: 'blue',
                    currentState: 'placing_blue',
                    squares: squares,
                    guards: guards
                }
                return updateGameInfo(copyGameInfo)
            case 'placing_blue':
                let placementFinish = true
                for (let i = 0; i < guards.length; i++) {
                    placementFinish = guards[i].isPlaced && placementFinish
                }
                if (placementFinish) {
                    copyGameInfo = {
                        turn: 'red',
                        currentState: 'fighting_red',
                        squares: squares,
                        guards: guards
                    }
                }
                else {
                    copyGameInfo = {
                        turn: 'red',
                        currentState: 'placing_red',
                        squares: squares,
                        guards: guards
                    }
                }
                
                return updateGameInfo(copyGameInfo)
            case 'fighting_red':
                copyGameInfo = {
                    turn: 'blue',
                    currentState: 'fighting_blue',
                    squares: squares,
                    guards: guards
                }
                return updateGameInfo(copyGameInfo)
            case 'fighting_blue':
                copyGameInfo = {
                    turn: 'red',
                    currentState: 'fighting_red',
                    squares: squares,
                    guards: guards
                }
                return updateGameInfo(copyGameInfo)
            default:
                console.log(gameInfo.currentState)
        }
        
    }

    const updateGameInfo = async (data) => {
        console.log('[Upload game info]')
        let updates = {}
        updates['/games/' + gameKey] = {...gameInfo,...data}
        try {
            setLoading(true)
            await db.ref().update(updates)
            setLoading(false)
        } catch (error) {
            setFirebaseError(error.message)
        }    
    }

    const squaresPlacingClickHandler = async (pos) => {
        console.log('[squaresPlacingClickHandler]')
        try {
            dispatch(actions.setSquareUnit(pos,whosMoving))
            dispatch(actions.setSquaresDisabled(true))
            dispatch(actions.setOneGuardDisabled(whosMoving,true))
            dispatch(actions.setGuardActived(whosMoving,false))
            dispatch(actions.setGuardPos(whosMoving,pos))
            dispatch(actions.setGuardisPlaced(whosMoving,true))
            dispatch(actions.setUnplacedGuardsDisabled(gameInfo.turn,true))
        } catch (error) {
            console.log(error)
        }
        setDoneBtnDisabled(false)
        // setWhosMoving(null)
    }

    // const squaresPlacingClickFinishedHandler = () => {
    //     let placementFinish = true
    //     for (let i = 0; i < guards.length; i++) {
    //         placementFinish = guards[i].isPlaced && placementFinish
    //     }
    //     if (placementFinish) {
    //         setFightStart(true)
    //         fightStartHandler()
    //     }
    //     else {
    //         const copyGameInfo = {
    //             turn: gameInfo.turn === 'red' ? 'blue' : 'red',
    //             currentState: gameInfo.turn === 'red' ? 'placing_blue' : 'placing_red',
    //             newguards: guards,
    //             newsquares: squares
    //         }
    //         console.log('copyGameInfo : ',copyGameInfo)
    //         updateGameInfo(copyGameInfo)
    //     }
    // }

    const squaresClickedHandler = (e) => {

        switch(gameInfo.currentState.split("_")[0]) {
            case 'placing':
                return squaresPlacingClickHandler(e.target.value)
            case 'fighting':
                return squaresFightingClickHandler(e.target.value)
            default:
                return console.log('Error')
        }
    }

    // const fightStartHandler = () => {
    //     //setGameStage('fighting')
    //     //setTurn('red')
    //     showModalHandler(0.5,`It is red turn`)
    //     dispatch(actions.setTeamDisabled('red',false))
    // }

    const strengtheningHandler = () => {
        console.log('[strengtheningHandler]')
        //showModalHandler(1,`It is ${turn} turn`)
        setIsStrengthModalShow(true)
        // setTimeout( () => {
        //     setIsStrengthModalShow(true)
        // },1000)
    }

    const gameStartHandler = () => {
        //showModalHandler(1,'Game Start')
        //setTurn('red')
        
        const copyGameInfo = {
            turn: 'red',
            currentState:'strengthening_red'
        }
        updateGameInfo(copyGameInfo)
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
            dispatch(actions.setTeamDisabled(gameInfo.turn,false))
            if (actionCounts > 0) {
                //switchTurn()
                setActionCounts(0)
                setWhosAttacking(null)
                setClickedGuard(null)
                setDoneBtnDisabled(false)
                // setTimeout( () => {
                //     set{
                //         isModalShow: false
                //     })
                // },500)
            }
            else {
                setActionCounts(1)
                setClickedGuard(null)
                setWhosAttacking(null)
            }
        } 
        else if (whosMoving !== null || whosAttacking !== null) {
            // double clicked
            dispatch(actions.setGuardActived(id,false))
            dispatch(actions.setSquaresDisabled(true))
            dispatch(actions.setTeamDisabled(gameInfo.turn,false))
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
            dispatch(actions.setSquaresPlacingDisabled(gameInfo.turn,true))
            setWhosMoving(null)
        }
        else if (whosMoving !== null) {
            dispatch(actions.setGuardActived(whosMoving,false))
            dispatch(actions.setGuardActived(id,true))
            dispatch(actions.setSquaresPlacingDisabled(gameInfo.turn,false))
            setWhosMoving(id)
        }
        else {
            dispatch(actions.setGuardActived(id,true))
            dispatch(actions.setSquaresPlacingDisabled(gameInfo.turn,false))
            setWhosMoving(id)
        }
    }

    const guardsClickedHandler = (id) => {
        
        switch(gameInfo.currentState.split("_")[0]) {
            case 'placing':
                return guardsPlacingClickHandler(id)
            case 'fighting':
                return  guardsFightingClickHandler(id)
            default:
                console.log('Unknown Stage')
        }
        
    }
    
    // const showModalHandler = (seconds,message) => {
    //     setModalMessage(message)
    //     setIsModalShow(true)
    //     setTimeout( () => {
    //         setIsModalShow(false)
    //     },seconds*1000)
    // }


    // const jumpToFightHandler = () => {

    //     for (let i = 0; i < guards.length; i++) {
    //         const id = guards[i].id
    //         dispatch(actions.setGuardisPlaced(id,true))
    //         if (i < 4) {
    //             dispatch(actions.setGuardPos(id,'D'+id))
    //             dispatch(actions.setSquareUnit('D'+id,id))
    //         }
    //         else if (i > 5){
    //             dispatch(actions.setGuardPos(id,'E'+(id-4)))
    //             dispatch(actions.setSquareUnit('E'+(id-4),id))
    //         }
    //         else {
    //             dispatch(actions.setGuardPos(id,'E'+id))
    //             dispatch(actions.setSquareUnit('E'+id,id))
    //         }
   
    //     }
    //     //setTurn('red')
    //     //setGameStage('fighting')
    //     //setGameStart(true)
    //     setFightStart(true)
    //     showModalHandler(1,'Fight Start')
    //     setTimeout( () => {
    //         fightStartHandler()
    //     },500)
        
        
    // }

    const strengtheningFinished = () => {

        const copyGameInfo = {
            turn: gameInfo.turn === 'red' ? 'blue' : 'red',
            currentState: gameInfo.turn === 'red' ? 'strengthening_blue' : 'placing_red',
            guards: guards,
            squares: squares

        }
        updateGameInfo(copyGameInfo)
        setIsStrengthModalShow(false)
    }

    const placingHandler = (side) => {
        console.log('placing start')
        dispatch(actions.setUnplacedGuardsDisabled(side,false))

    }

    const fightingHandler = () => {
        dispatch(actions.setTeamDisabled(gameInfo.turn,false))
    }

    

    // console.log("whosMoving : ",whosMoving)
    // console.log("whosAttacking : ",whosAttacking)
    // console.log("clickedGuard : ",clickedGuard)
    //const currentUserSide = gameInfo.red === user.email ? 'red' : 'blue'
    const renderGuards = <div className={styles.GuardsBoard}>
            {guards.map( g => 
            g.isPlaced || ( gameInfo ? g.side !== (gameInfo.red === user.email ? 'red' : 'blue') : false)
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

    const renderGameInfo = loading 
    ? <Spinner/> 
    : gameInfo === null 
        ? null 
        : 
        <div>
            <p>Red : {gameInfo.red}</p>
            <p>Blue : {gameInfo.blue ? gameInfo.blue : 'waiting'}</p>
            <p>Turn : {gameInfo.turn ? gameInfo.turn : 'waiting'}</p>
            <div>Current State : <h1>{gameInfo.currentState}</h1></div>
        </div>
        

    //console.log("gameInfo : ",gameInfo)
    //console.log("user side : ", userSide)

    //console.log("[BoardControl] Updated")
    return(
        <div>
        {/* // <div onMouseMove={mouseMovehandler}> */}
            <NavigationItems />
            <p>Login as : <strong>{user.email}</strong></p>
            <p>Game ID : <strong>{gameKey}</strong></p>
            {firebaseError ? firebaseError : null}
            {renderGameInfo}
            {/* <Modal show={isModalShow} modalClosed={null}>
                {modalMessage}
            </Modal> */}
            <Modal show={isStrengthModalShow} modalClosed={null}>
                <GuardsStrengthen finished={strengtheningFinished} side={gameInfo ? gameInfo.turn : null}/>
            </Modal>
            <GuardOptionModal show={isGuardOptionModalShow} modalClosed={closeModalHandler}>
                <Button btnType='Success' clicked={guardsFightingMovingHandler}>Move</Button>
                <Button btnType='Success' clicked={guardsAttackHandler}>Attack</Button>
                <Button btnType='Success' clicked={guardsAbilityHandler}>Ability</Button>
                <p></p>
                <Button btnType='Danger' clicked={closeModalHandler}>Close</Button>
            </GuardOptionModal>
            {gameInfo ? 
                gameInfo.red === user.email ? 
                    <Button btnType="Success" clicked={gameStartHandler} disabled={gameInfo === null ? true : !(gameInfo.currentState === 'blueJoin')}>Game Start</Button> 
                    : null
                : null
            }
            {/* <Button btnType="Success" clicked={jumpToFightHandler} disabled={gameStage === 'fighting'}>Jump To Fight</Button> */}
            <Button btnType="Danger" clicked={clickedDoneHandler} disabled={doneBtnDisabled}>Done</Button>
            {/* <Link to="/chats">
                <Button btnType="Success">Chat</Button>
            </Link>
            <Link to="/logout">
                <Button btnType="Danger">Logout</Button>
            </Link> */}
            
            <div className={styles.BoardControl}>
                <div className={styles.SquareBoard}>
                    <Board 
                        clicked={ e => squaresClickedHandler(e)}
                        gclicked={ e => guardsClickedHandler(e.target.id)} 
                    />
                </div>
                {renderGuards}
            </div>
            {/* <Button clicked={() => {set{isGuardOptionModalShow:true})}}>Open</Button> */}
            {gameInfo === null ? null : <GuardsInfo side={gameInfo.red === user.email ? 'red' : 'blue'}/>}
            {/* <ReactCursorPosition>
                <PositionLabel/>
            </ReactCursorPosition> */}
        </div>
        
    )


    

}

export default BoardControl