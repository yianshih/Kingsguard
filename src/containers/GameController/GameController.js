import React, { useState, useEffect } from 'react'
import { db } from '../../services/firebase'
import { auth } from '../../services/firebase'
import Guard from '../../components/Guard/Guard'
import BoardControl from '../BoardControl/BoardControl'
import Spinner from '../../components/UI/Spinner/Spinner'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom';
import * as actions from '../../store/actions/index'
import styles from './GameController.module.css'
import FillUpModal from '../../components/UI/FillUpModal/FillUpModal'
import Button from '../../components/UI/Button/Button'
// import Modal from '../../components/UI/Modal/Modal'


const GameController = (props) => {
    
     
    const [ gameKey ] = useState(props.location.state.gameKey)
    const [ userSide ] = useState(props.location.state.userSide)
    const [isFilling, setIsFilling] = useState(false)
    const history = useHistory()
    const game = useSelector(state => state.game)
    const guards = useSelector(state => state.guards)
    const squares = useSelector(state => state.squares)
    const [user] = useState(auth().currentUser)
    const [newGameInfo,setNewGameInfo] = useState(null)

    const dispatch = useDispatch()

    

    useEffect( () => {
        if (game.gameInfo === null) dispatch(actions.initGameInfo(localStorage.getItem('gameKey'),userSide))
        else dispatch(actions.initGameInfo(gameKey,userSide))
    },[])


    const updateGameInfo = async (data) => {
        //console.log('Uploading')
        let newData = {...data}
        if ( (newData.currentState.split('_')[0] === 'fighting') && ( (newData.turn !== game.gameInfo.turn) || (game.gameInfo.currentState.split("_")[0] === 'blueJoined') ) ) {
            if (checkKingBonus(newData.turn, newData.guards)) {
                console.log('King Bonus applied')
                const newGuards = [...newData.guards].map( g => {
                    if (g.side === newData.turn && g.isPlaced && g.name !== 'King') {
                        return {...g,dmg:+g.dmg + 10}
                    }
                    else return {...g}
                })
                newData = {
                    ...data,
                    guards: newGuards
                }
            }
            if (checkAngelBonus(newData.turn, newData.guards)) {
                console.log('Angel Bonus applied')
                const newGuards = [...newData.guards].map( g => {
                    if (g.side === newData.turn && g.isPlaced && g.name !== 'Angel') {
                        const newHp = g.hp > 0 
                        ? +g.hp + 30 > +g.fullHp 
                            ? g.fullHp 
                            : +g.hp + 30 
                        : 0
                        return {...g,hp:newHp}
                    }
                    else return {...g}
                })
                newData = {
                    ...data,
                    guards: newGuards
                }
            }
        }
        //console.log('data : ',data)
        let updates = {}
        updates['/games/' + gameKey] = {...newData}
        try {
            //setLoading(true)
            await db.ref().update(updates)
            //setLoading(false)
        } catch (error) {
            console.log("Error Occurred",error.message)
        }    
    }
    const deleteGame = async (key) => {
        try {
            await db.ref('/games/'+key).remove()
        } catch (error) {
            console.log('Remove Failed')
        }
    }
    const actionCompleted = () => {
        updateGameInfo({
            ...game.gameInfo,
        })
    }

    const switchGuardsHandler = (id) => {
        const clickedGuard = game.gameInfo.guards[id - 1]
        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.id === id) return {...g,disabled:false, actived:true}
            else if (g.side === clickedGuard.side && g.isPlaced) return {...g,actived:false,disabled:false}
            else return {...g,disabled:true}
        })
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards
        })
    }

    const switchGuardsClickedTwiceHandler = (id) => {
        const clickedGuard = game.gameInfo.guards[id - 1]
        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.id === id) return {...g,disabled:false, actived:false}
            else if (g.side === clickedGuard.side && g.isPlaced) return {...g,actived:false,disabled:false}
            else return {...g}
        })

        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards
        })
        dispatch(actions.setWhosAttacking(null))
    }   

    const guardsSwitchingHandler = (id) => {
        const newTurn = game.gameInfo.turn === 'red' ? 'blue' : 'red'

        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.side === newTurn) return {...g,disabled:false}
            else {
                if (g.id === +id) return {
                    ...g,
                    disabled: true,
                    isPlaced: false,
                    pos: 'unknown'
                }
                else if (g.id === game.whosAttacking) return {
                    ...g,
                    disabled: true,
                    actived: false,
                    isPlaced: true,
                    pos: game.gameInfo.guards[id-1].pos
                }
                else return {...g,disabled: true}
            }
            
        })

        const newSquares = [...game.gameInfo.squares].map( s => {
            if (s.pos === game.gameInfo.guards[id-1].pos) return {...s,unit:game.whosAttacking}
            else return {...s}
        })
        updateGameInfo({
            ...game.gameInfo,
            turn: newTurn,
            currentState: `fighting_${newTurn}`,
            squares: newSquares,
            guards: newGuards
        })
        dispatch(actions.setWhosAttacking(null))
    }

    const setTeamDisabled = (side,disabled) => { 
        const newGuards = game.gameInfo.guards.map( g => {
            if (g.side === side) {
                return {...g, disabled: disabled}
            }
            else {
                return {...g}
            }
        })
        updateGameInfo({
            ...game.gameInfo,
            updater: userSide,
            guards: newGuards
        })
        
    }
    
    const withinDistance = (g_pos,s_pos,step) => {
        const row = ['A','B','C','D','E','F','G','H']
        const g_rowIndex = row.findIndex( (item) => item === g_pos[0])
        const s_rowIndex = row.findIndex( (item) => item === s_pos[0])
        const rowDis = Math.abs(g_rowIndex - s_rowIndex)
        const noDis = Math.abs(g_pos[1]-s_pos[1])
        return rowDis <= step && noDis <= step
    }
    
    const setUnplacedGuardsDisabled = (side,disabled) => {
    
        const newGuards = game.gameInfo.guards.map( g => {
            if (g.side === side && !g.isPlaced) {
                return {...g,disabled: disabled}
            }
            return g
        })
        dispatch(actions.setUnplacedGuardsDisabled(side,disabled))
        updateGameInfo({
            ...game.gameInfo,
            updater: userSide,
            guards: newGuards
        })
    }

    const setGuardsStrengthen = (guards) => {
        updateGameInfo({
            ...game.gameInfo,
            updater: userSide,
            turn: game.gameInfo.turn === 'red' ? 'blue' : 'red',
            guards: guards
        })
    }
    const checkKingBonus = (side,newGuards) => {
        console.log("newGuards : ",newGuards)
        let isKingBonus = false
        if (side === 'red') {
            isKingBonus = newGuards[3].isPlaced && newGuards[3].hp > 0
            //isKingPlaced = game.gameInfo.guards[3].isPlaced

        }
        else {
            isKingBonus = newGuards[9].isPlaced && newGuards[9].hp > 0
            //isKingPlaced = game.gameInfo.guards[9].isPlaced
        }
        return isKingBonus
        
    }

    const checkAngelBonus = (side,newGuards) => {
        let isAngelBonus = false
        if (side === 'red') {
            //isAngelPlaced = game.gameInfo.guards[5].isPlaced
            isAngelBonus = newGuards[5].isPlaced && newGuards[5].hp > 0 
        }
        else {
            isAngelBonus = newGuards[11].isPlaced && newGuards[11].hp > 0 
        }
        return isAngelBonus
    }

    const guardsPlacingClickTwice = (id,side,disabled) => {
        // const newSquares = game.gameInfo.squares.map( s => {
        //     if (rows[side].includes(s.pos[0])) {
        //         return {...s,disabled: disabled}
        //     }
        //     return s
        // })
        const newSquares = game.gameInfo.squares.map( s => {
            return {...s,disabled: disabled}
        })
        const newGuards = game.gameInfo.guards.map( g => {
            if (g.id === id) return {...g,actived: false}
            else return g
        })
        //console.log("newGuards : ",newGuards)
        updateGameInfo({
            ...game.gameInfo,
            squares: newSquares,
            guards: newGuards    
        })
        // setGameInfo({
        //     ...game.gameInfo,
        //     squares: newSquares,
        //     guards: newGuards
        // })
    }

    const withinAttack = (g_pos,target_pos,range) => {   
        const row = ['A','B','C','D','E','F','G','H']
        const g_rowIndex = row.findIndex( (item) => item === g_pos[0])
        const s_rowIndex = row.findIndex( (item) => item === target_pos[0])
        const rowDis = Math.abs(g_rowIndex - s_rowIndex)
        const noDis = Math.abs(g_pos[1] - target_pos[1])
        if (range > 1) {
            return rowDis === range || noDis === range
        }
        else return rowDis <= range && noDis <= range
    }

    const guardsFightingClickHandler = (clickedId) => {

        
        const attackGuard = game.gameInfo.guards[clickedId - 1]
        console.log("attackGuard : ",attackGuard)
        const newSquares = [...game.gameInfo.squares].map( s => {
            return withinDistance(attackGuard.pos,s.pos,attackGuard.step) 
            ? {...s, disabled: false}
            : {...s, disabled: true}    
        })

        
        const pos = attackGuard.pos // attacking guard pos
        const range = attackGuard.range
        const newGuards = game.gameInfo.guards.map( g => {
            if (g.id === +clickedId) {
                return {...g,actived: true,disabled: false}
            }
            else if (g.side !== attackGuard.side && g.id !== +clickedId) return withinAttack(pos,g.pos,range) 
                ? {...g,disabled: false} 
                : {...g,disabled: true}
            else return {...g,disabled:true}
            
        })
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards,
            squares: newSquares
        })
    }

    const guardsAttackHandler = (clickedId) => {
        const attackGuard = game.gameInfo.guards[clickedId - 1]
        //console.log("attackGuard : ",attackGuard)
        const pos = attackGuard.pos // attacking guard pos
        const range = attackGuard.range
        //console.log("game.whosAttacking : ",game.whosAttacking)
        console.log('[ guardsAttackHandler ]')
        const newGuards = game.gameInfo.guards.map( g => {
            if (g.id === +clickedId) {
                return {...g,actived: true,disabled: false}
            }
                
            else if (g.side !== attackGuard.side && g.id !== +clickedId) return withinAttack(pos,g.pos,range) 
                ? {...g,disabled: false} 
                : {...g,disabled: true}
            else return {...g,disabled:true}
            
        })
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards
        })

    }
    const checkWinner = (guards) => {
        //console.log("[ checkWinner guard ]",guards)
        let isRedLost = true
        let isBlueLost = true
        let winner = "unknown"
        for (let i = 0; i < 6; i++) {
            isRedLost = +guards[i].hp <= 0 && isRedLost
            isBlueLost = +guards[i + 6].hp <= 0 && isBlueLost
        }

        if (isRedLost && isBlueLost) {
            //dispatch(actions.setWinner('Tie'))
            winner = "tie"
        }
        else if (isRedLost) {
            winner = "blue"
            //dispatch(actions.setWinner('blue'))
        }
        else if (isBlueLost) {
            winner = "red"
            //dispatch(actions.setWinner('red'))
        } 
        return winner

    }
    const guardsAttackingClick = (attack,defend) => {
        const copyGuards = [...game.gameInfo.guards]
        const attacker = copyGuards[attack - 1]
        const defender = copyGuards[defend - 1]
        const newSquares = [...game.gameInfo.squares].map( s => {
            return {...s,disabled:true}
        })
        let newMessage = {}
        newMessage[defender.side] = {
            [defender.name] : {
                preHp: defender.hp,
                curHp: defender.hp > attacker.dmg ? defender.hp - attacker.dmg : 0
            }
        }
        defender.prevHp = defender.hp
        defender.hp = defender.hp > attacker.dmg ? defender.hp - attacker.dmg : 0
        
        if (defender.name === 'King' && defender.hp <= 0) {
            for (let i = 0; i < copyGuards.length; i++) {
                if (copyGuards[i].side === defender.side) {
                    copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                    copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                }
            }
        }
        
        if (withinAttack(attacker.pos, defender.pos, defender.range)) {
            newMessage[attacker.side] = {
                [attacker.name] : {
                    preHp: attacker.hp,
                    curHp: attacker.hp > defender.dmg ? attacker.hp - defender.dmg : 0
                }
            }
            attacker.prevHp = attacker.hp
            attacker.hp = attacker.hp > defender.dmg ? attacker.hp - defender.dmg : 0
            if (attacker.name === 'King' && attacker.hp <= 0) {
                for (let i = 0; i < copyGuards.length; i++) {
                    if (copyGuards[i].side === attacker.side) {
                        copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                        copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                    }
                }
            }
        }

        const newGameInfo = {
            ...game.gameInfo,
            guards: copyGuards,
            squares: newSquares,
            message: newMessage
        }
        //newgame.GameInfo.guards = copyGuards
        // if (newGameInfo.guards[attack-1].hp === 0) {
        //     setNewGameInfo(newGameInfo)
        //     setIsFilling(true)
        // }
        checkActionCounts(newGameInfo,attack)
        
    }

    const checkActionCounts = (newGameInfo,attack=null) => {
        let newGuards = null
        const copyGuards = [...newGameInfo.guards]
        dispatch(actions.setActionCounts(0))
        dispatch(actions.setWhosAttacking(null))
        newGuards = copyGuards.map( g => {
            if (g.side === game.gameInfo.turn) return {...g,disabled:true,actived:false}
            else return {...g,disabled: false}
        })
        newGameInfo.guards = newGuards
        newGameInfo.currentState = game.gameInfo.turn === 'red' ? 'fighting_blue' : 'fighting_red'
        newGameInfo.turn = game.gameInfo.turn === 'red' ? 'blue' : 'red'
        //newGameInfo.message = 'unknown'
        newGameInfo.winner = checkWinner(newGameInfo.guards)
        //console.log("checkWinner(newGameInfo.guards) : ",checkWinner(newGameInfo.guards))
        //console.log("newgame.GameInfo : ",newGameInfo)
        if (checkWinner(newGameInfo.guards) !== null) {
            dispatch(actions.resetGuards)
            dispatch(actions.resetSquares)
        }
        if (attack !== null) {
            if (+newGameInfo.guards[attack-1].hp === 0) {
                
                const unplacedGuards = newGameInfo.guards.filter( g => (g.side === newGameInfo.guards[attack-1].side) && !g.isPlaced)
                // let shouldFill = false
                // for(let i = 0; i < newGameInfo.guards.length; i++) {
                //     if ( (newGameInfo.guards[i].side === newGameInfo.guards[attack-1].side) && !newGameInfo.guards[i].isPlaced) {
                //         shouldFill = true
                //     }
                // }
                if (unplacedGuards.length > 0) {
                    //console.log('Should Fill')
                    setNewGameInfo(newGameInfo)
                    setIsFilling(true)
                }
                else {
                    updateGameInfo({
                        ...newGameInfo
                    })
            
                    // setTimeout( () => {
                    //     updateGameInfo({
                    //         ...newGameInfo,
                    //         message: 'unknown'
                    //     })  
                    // },2000)
                }
            }
            else {
                updateGameInfo({
                    ...newGameInfo
                })
        
                // setTimeout( () => {
                //     updateGameInfo({
                //         ...newGameInfo,
                //         message: 'unknown'
                //     })  
                // },2000)
            }
        }
        else {
            updateGameInfo({
                ...newGameInfo,
                message: 'unknown'
            })
    
            setTimeout( () => {
                updateGameInfo({
                    ...newGameInfo,
                    message: 'unknown'
                })  
            },2000)
        }
        
    }

    const guardsFightingMovingHandler = (clickedId) => {
        //props.setOnlyOneGuardDisabled(id,false)
        //props.setGuardActived(id,true)
        //props.setSquaresMovingDisabled(props.game.gameInfo.guards[id - 1].pos,props.game.gameInfo.guards[id - 1].step,true)
        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.id === +clickedId) return {...g,disabled:false,actived:true}
            else return {...g,disabled:true,actived:false}
        })
        const mover = {...game.gameInfo.guards[clickedId - 1]}
        const newSquares = [...game.gameInfo.squares].map( s => {
            return withinDistance(mover.pos,s.pos,mover.step) 
            ? {...s, disabled: false}
            : {...s, disabled: true}    
        })
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards,
            squares: newSquares
        })
    }

    const fightingActionCanceled = () => {

        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.side === game.gameInfo.turn) return {
                ...g,
                actived: false, 
                disabled: false
            }
            else return {...g,disabled:true}
        })
        const newSquares = [...game.gameInfo.squares].map( s => {
            return {...s,disabled:true}
        })
        //props.setGuardActived(id,false)
        //props.setSquaresDisabled(true)
        //props.setTeamDisabled(props.game.gameInfo.turn,false)
        //setIsGuardOptionModalShow(false)
        //setClickedGuard(null)
        dispatch(actions.setWhosMoving(null))
        dispatch(actions.setWhosAttacking(null))
        //setWhosAttacking(null)
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards,
            squares: newSquares
        })
    }

    const guardsPlacingClick = (id,actived,side,disabled) => {

        const newSquares = game.gameInfo.squares.map( s => {
            return {...s,disabled:false}
        })
        const newGuards = game.gameInfo.guards.map( g => {
            if (g.id === id) return {...g,actived: actived}
            else return {...g,actived: !actived}
        })
        //console.log("newGuards : ",newGuards)

        // setGameInfo({
        //     ...game.gameInfo,
        //     squares: newSquares,
        //     guards: newGuards
        // })
        
        updateGameInfo({
            ...game.gameInfo,
            squares: newSquares,
            guards: newGuards
        })
    }
    const squaresPlacingClickHandler = (pos) => {
        //console.log("pos,whosMoving : ",pos,",",game.whosMoving)
        const newSquares = [...game.gameInfo.squares.map( s => {
            if (s.pos === pos) {
                return {
                    ...s,
                    unit: game.whosMoving,
                    disabled: true
                }
            }
            return {
                ...s,
                disabled: true
            }
        })]
        const newGuards = [...game.gameInfo.guards.map( g => {
            if (g.id === game.whosMoving) return {
                ...g,
                disabled: true,
                actived: false,
                pos: pos,
                isPlaced: true
            }
            else return {...g,disabled: true}
        })]

        let copyGameInfo = {
            ...game.gameInfo,
            guards: newGuards,
            squares: newSquares,
            updater: userSide
        }

        if (copyGameInfo.turn === 'red') {
            copyGameInfo.turn = 'blue'
            copyGameInfo.currentState = 'placing_blue'
        }
        else {
            copyGameInfo.turn = 'red'
            //let placementFinish = true
            let placedGuards = 0
            for (let i = 0; i < newGuards.length; i++) {
                if (newGuards[i].isPlaced) placedGuards += 1
                //placementFinish = newGuards[i].isPlaced && placementFinish
            }
            if (placedGuards === 8) copyGameInfo.currentState = 'fighting_red'
            //if (placementFinish) copyGameInfo.currentState = 'fighting_red'
            else copyGameInfo.currentState = 'placing_red' 
        }
        //console.log("newGuards : ",newGuards)
        
        updateGameInfo({
            ...copyGameInfo
        })
        dispatch(actions.setWhosMoving(null))
    }

    const squaresFightingClickHandler = (pos) => {
        
        const newSquares = [...game.gameInfo.squares].map( s => {
            if (s.pos === game.gameInfo.guards[game.whosAttacking-1].pos) {
                //console.log("remove previous pos")
                return {...s,unit: 'unknown',disabled:true}
            }
            else if (s.pos === pos) return {...s,unit: game.whosAttacking,disabled:true}
            else return {...s,disabled:true}
        })

        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.id === +game.whosAttacking) {
                //console.log('set g pos')
                return {...g, pos: pos, actived:false}
            }
            else return {...g}
        })
        
        const newGameInfo = {
            ...game.gameInfo,
            squares: newSquares,
            guards: newGuards 
            
        }
        
        dispatch(actions.setWhosAttacking(null))

        checkActionCounts(newGameInfo)

    }

    const playAgainHandler = () => {
        updateGameInfo({
            ...game.gameInfo,
            currentState: "strengthening_red",
            turn: 'red',
            updater: userSide,
            squares: squares,
            guards: guards,
            winner: 'unknown'
        })
    }

    const backToLobbyHandler = () => {
        //console.log('a')
        history.push("/")
    }
    
    const fillUpHandler = (id) => {
        let deadPos = 'NotFound'
        
        const tempGameInfo = newGameInfo === null ? game.gameInfo : newGameInfo
        const newGuards = [...tempGameInfo.guards].map( g => {
            if (g.side === tempGameInfo.guards[id-1].side && +g.hp === 0 && g.pos !== 'unknown') {
                deadPos = g.pos
                return {...g,pos:'unknown'}
            }
            else return {...g}
        })
        console.log(' [deadPos] : ',deadPos)
        const finalGuards = [...newGuards].map( g => {
            if (g.id === id) return {...g,isPlaced: true, pos: deadPos}
            else return {...g}
        })

        const newSquares = [...tempGameInfo.squares].map( s => {
            if (s.pos === deadPos) return {...s,unit: id}
            else return {...s}
        })

        updateGameInfo({
            ...tempGameInfo,
            squares: newSquares,
            guards: finalGuards
        })
        setIsFilling(false)
        setNewGameInfo(null)
    }

    const setJumpToFighting = () => {
        let newGuards = [...guards]
        let newSquares = [...squares]

        for (let i = 0; i < 4; i++) {
            const redPos = "D"+(i+2)
            const bluePos = "E"+(i+2)
            newGuards[i].pos = redPos
            newGuards[i].isPlaced = true
            newGuards[i+6].pos = bluePos
            newGuards[i+6].isPlaced = true
            newSquares = newSquares.map( s => {
                if (s.pos === redPos) return {...s,unit:i+1}
                else if (s.pos === bluePos) return {...s,unit:i+7}
                else return {...s}
            })
        }

        updateGameInfo({
            ...game.gameInfo,
            currentState: "fighting_red",
            turn: "red",
            guards: newGuards,
            squares: newSquares
        })
    }

    const leaveHandler = () => {
        updateGameInfo({
            ...game.gameInfo,
            currentState: 'userLeft'
        })
        deleteGame(game.gameInfo.gid)
    }

    const renderBoard = <BoardControl 
                            userSide={props.location.state.userSide}
                            uploadGameInfo={updateGameInfo}
                            actionCompleted={actionCompleted}
                            guardsPlacingClick={guardsPlacingClick}
                            guardsPlacingClickTwice={guardsPlacingClickTwice}
                            squaresPlacingClickHandler={squaresPlacingClickHandler}
                            squaresFightingClickHandler={squaresFightingClickHandler}
                            guardsAttackHandler={guardsAttackHandler}
                            guardsAttackingClick={guardsAttackingClick}
                            fightingActionCanceled={fightingActionCanceled}
                            guardsFightingMovingHandler={guardsFightingMovingHandler}
                            setJumpToFighting={setJumpToFighting}
                            playAgainHandler={playAgainHandler}
                            backToLobbyHandler={backToLobbyHandler}
                            guardsFightingClickHandler={guardsFightingClickHandler}
                            setTeamDisabled={setTeamDisabled}
                            setGuardsStrengthen={setGuardsStrengthen}
                            setUnplacedGuardsDisabled={setUnplacedGuardsDisabled}
                            deleteGame={deleteGame}
                            checkKingBonus={checkKingBonus}
                            switchGuardsHandler={switchGuardsHandler}
                            switchGuardsClickedTwiceHandler={switchGuardsClickedTwiceHandler}
                            guardsSwitchingHandler={guardsSwitchingHandler}
                        />

    const renderGuards = 
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
    return (
        <React.Fragment>
            <FillUpModal show={isFilling} modalClosed={null}>
                <h3>One of your unit is dead,please choice an unit to fill </h3>
                {renderGuards}
            </FillUpModal>
            {game.gameInfo 
            ?   <div style={{position:'fixed'}} className={styles.GameInfos}>
                    
                    <Link to="/">
                        <Button btnType="Danger" clicked={leaveHandler}>Leave</Button>
                    </Link>
                    
                    
                    <div className={styles.GameInfo}>Game ID : <strong>{game.gameInfo.gid}</strong></div>
                    <div className={styles.GameInfo}>You're <strong style={{color: userSide === 'red' ? 'red' : 'blue'}}>{userSide}</strong></div>
                    <div className={styles.GameInfo}>User : <strong>{user.email}</strong></div>
                </div>
            : null}

            <div className={styles.GameController}>
                {game.gameInfo === null
                ? localStorage.getItem('gameKey') ?  <Spinner /> : renderBoard
                : renderBoard 
                }
                
            </div>
        </React.Fragment>
    )
}



export default GameController