import React, { useState, useEffect } from 'react'
import { db } from '../../services/firebase'
import BoardControl from '../BoardControl/BoardControl'
import Spinner from '../../components/UI/Spinner/Spinner'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as actions from '../../store/actions/index'

const GameController = (props) => {

    const rows = {
        red: ['A','B','C','D'],
        blue: ['E','F','G','H']
    }
    const [ gameInfo, setGameInfo ] = useState(null)
    //const [ firebaseError, setFirebaseError ] = useState(null)
    const [ gameKey ] = useState(props.location.state.gameKey)
    const [ userSide ] = useState(props.location.state.userSide)
    const [ loading, setLoading ] = useState(false)
    const game = useSelector(state => state.game)
    const dispatch = useDispatch()
    useEffect( () => {
        const fetchData = async () => {
            try {            
                console.log('[fetching data]')
                setLoading(true)
                await db.ref("games/" + gameKey).on("value", snapshot => {
                    setGameInfo(snapshot.val())
                })
                setLoading(false)
                
            } catch(error) {
                console.log("Error Occurred",error.message)
            }
        }
        fetchData()
    },[])

    const updateGameInfo = async (data) => {
        //console.log('[Upload game info]')
        //console.log('Ready to upload : ',data)
        let updates = {}
        updates['/games/' + gameKey] = {...data}
        try {
            setLoading(true)
            await db.ref().update(updates)
            setLoading(false)
        } catch (error) {
            console.log("Error Occurred",error.message)
        }    
    }

    const actionCompleted = () => {
        updateGameInfo({
            ...gameInfo,
        })
    }

    const setGuardPos = (id,pos) => {

        const newGuards = gameInfo.guards.map( g => {
            if(g.id === id) {
                return {...g,pos: pos}
            }
            return g
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            guards: newGuards
        })
    }

    const setTeamDisabled = (side,disabled) => {   
        //console.log("action.side : ",action.side)
        const newGuards = gameInfo.guards.map( g => {
            if (g.side === side) {
                return {...g, disabled: disabled}
            }
            else {
                return {...g}
            }
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            guards: newGuards
        })
    }
    
    const setGuardAttacking = (attack,defend) => {
        // action.attacker
        // action.defender
        const copyGuards = gameInfo.guards
        const attacker = copyGuards[attack - 1]
        const defender = copyGuards[defend - 1] 
        defender.hp = defender.hp > attacker.dmg ? defender.hp - attacker.dmg : 0
        
        if (defender.name === 'King' && defender.hp <= 0) {
            for (let i = 0; i < copyGuards.length; i++) {
                if (copyGuards[i].side === defender.side) {
                    copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                    copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                }
            }
        }
        
        if (withinDistance(attacker.pos, defender.pos, defender.range)) {
            attacker.hp = attacker.hp - defender.dmg
            if (attacker.name === 'King' && attacker.hp <= 0) {
                for (let i = 0; i < copyGuards.length; i++) {
                    if (copyGuards[i].side === attacker.side) {
                        copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                        copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                    }
                }
            }
        }
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            guards: copyGuards
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
    
    const setGuardsAttackable = (id) => {
        const attackGuard = gameInfo.guards[id - 1]
        const pos = attackGuard.pos // attacking guard pos
        const range = attackGuard.range
    
        const newGuards = gameInfo.guards.map( g => {
            if (g.id !== id && g.side !== attackGuard.side){
                return withinDistance(pos,g.pos,range)
                ? {...g,disabled:false}   
                : {...g,disabled:true}
            }
            return g
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            guards: newGuards
        })
    }
    const setOnlyOneGuardDisabled = (id,disabled) => {
        
        const newGuards = gameInfo.guards.map( g => {
            if (g.id === id) {
                return {...g,disabled: disabled}
            }
            return {...g,disabled: !disabled}
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            guards: newGuards
        })
    }
    
    const setOneGuardDisabled = (id,disabled) => {
        
        const newGuards = gameInfo.guards.map( g => {
            if (g.id === id) {
                return {...g,disabled: disabled}
            }
            return g
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            guards: newGuards
        })
    }
    
    const setUnplacedGuardsDisabled = (side,disabled) => {
    
        const newGuards = gameInfo.guards.map( g => {
            if (g.side === side && !g.isPlaced) {
                return {...g,disabled: disabled}
            }
            return g
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            guards: newGuards
        })
    }
    
    const setGuardActived = (id,actived) => {
        
        const newGuards = gameInfo.guards.map( g => {
            if (g.id === id) {
                console.log('here')
                return {...g,actived: actived}
            }
            return g
        })
        //console.log("newGuards : ",newGuards)

        setGameInfo({
            ...gameInfo,
            guards: newGuards
        })
        
        // updateGameInfo({
        //     ...gameInfo,
        //     updater: userSide,
        //     guards: newGuards
        // })
    }
    
    const setGuardisPlaced = (id,isPlaced) => {
    
        const newGuards = gameInfo.guards.map( g => {
            if (g.id === +id) {
                return {...g,isPlaced: isPlaced}
            }
            return g
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            guards: newGuards
        })
    }

    const setGuardsStrengthen = (guards) => {
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            turn: gameInfo.turn === 'red' ? 'blue' : 'red',
            guards: guards
        })
    }
    
    const setSquaresMovingDisabled = (pos,step) => {
        
        const newSquares = gameInfo.squares.map( s => {
            return withinDistance(pos,s.pos,step) 
            ? {...s, disabled: false}
            : {...s, disabled: true}    
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            squares: newSquares
        })
    }
    const guardsPlacingClickTwice = (id,side,disabled) => {
        const newSquares = gameInfo.squares.map( s => {
            if (rows[side].includes(s.pos[0])) {
                return {...s,disabled: disabled}
            }
            return s
        })
        const newGuards = gameInfo.guards.map( g => {
            if (g.id === id) return {...g,actived: false}
            else return g
        })
        //console.log("newGuards : ",newGuards)

        setGameInfo({
            ...gameInfo,
            squares: newSquares,
            guards: newGuards
        })
    }
    const guardsAttackHandler = () => {

        
        //props.setGuardActived(id,true)
        //props.setOnlyOneGuardDisabled(id,false)
        //props.setGuardsAttackable(id)
        //dispatch(actions.setWhosAttacking(id))
        const attackGuard = gameInfo.guards[game.whosAttacking - 1]
        //console.log("attackGuard : ",attackGuard)
        const pos = attackGuard.pos // attacking guard pos
        const range = attackGuard.range
        //console.log("game.whosAttacking : ",game.whosAttacking)
        const newGuards = gameInfo.guards.map( g => {
            if (g.id === +game.whosAttacking) {
                return {...g,actived: true,disabled: false}
            }
                
            else if (g.side !== attackGuard.side && g.id !== game.whosMoving) return withinDistance(pos,g.pos,range) 
                ? {...g,disabled: false} 
                : {...g,disabled: true}
            else return {...g,disabled:true}
            
        })
        updateGameInfo({
            ...gameInfo,
            guards: newGuards
        })

    }
    const guardsAttackingClick = (attack,defend) => {
        const copyGuards = [...gameInfo.guards]
        const attacker = copyGuards[attack - 1]
        const defender = copyGuards[defend - 1]
        defender.hp = defender.hp > attacker.dmg ? defender.hp - attacker.dmg : 0
        
        if (defender.name === 'King' && defender.hp <= 0) {
            for (let i = 0; i < copyGuards.length; i++) {
                if (copyGuards[i].side === defender.side) {
                    copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                    copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                }
            }
        }
        
        if (withinDistance(attacker.pos, defender.pos, defender.range)) {
            attacker.hp = attacker.hp - defender.dmg
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
            ...gameInfo,
            guards: copyGuards
        }
        //newGameInfo.guards = copyGuards
        checkActionCounts(newGameInfo)
        // let newGuards = null

        // if (game.actionCounts > 0) {
        //     dispatch(actions.setActionCounts(0))
        //     dispatch(actions.setWhosAttacking(null))
        //     newGuards = copyGuards.map( g => {
        //         if (g.side === gameInfo.turn) return {...g,disabled:true,actived:false}
        //         else return {...g,disabled: false}
        //     })
        //     newGameInfo.guards = newGuards
        //     newGameInfo.currentState = gameInfo.turn === 'red' ? 'fighting_blue' : 'fighting_red'
        //     newGameInfo.turn = gameInfo.turn === 'red' ? 'blue' : 'red'
        // }
        // else {
        //     dispatch(actions.setActionCounts(1))
        //     //setClickedGuard(null)
        //     dispatch(actions.setWhosAttacking(null))
        //     newGuards = copyGuards.map( g => {
        //         if (g.side === gameInfo.turn) return {...g,actived:false, disabled:false}
        //         else return {...g,disabled: true}
        //     })

        //     newGameInfo.guards = newGuards
            
        // }
        
    }

    const checkActionCounts = (newGameInfo) => {    
        let newGuards = null
        const copyGuards = [...newGameInfo.guards]
        if (game.actionCounts > 0) {
            dispatch(actions.setActionCounts(0))
            dispatch(actions.setWhosAttacking(null))
            newGuards = copyGuards.map( g => {
                if (g.side === gameInfo.turn) return {...g,disabled:true,actived:false}
                else return {...g,disabled: false}
            })
            newGameInfo.guards = newGuards
            newGameInfo.currentState = gameInfo.turn === 'red' ? 'fighting_blue' : 'fighting_red'
            newGameInfo.turn = gameInfo.turn === 'red' ? 'blue' : 'red'
        }
        else {
            dispatch(actions.setActionCounts(1))
            //setClickedGuard(null)
            dispatch(actions.setWhosAttacking(null))
            newGuards = copyGuards.map( g => {
                if (g.side === gameInfo.turn) return {...g,actived:false, disabled:false}
                else return {...g,disabled: true}
            })

            newGameInfo.guards = newGuards
            
        }
        console.log("newGameInfo : ",newGameInfo)
        updateGameInfo({
            ...newGameInfo
        })
    }

    const guardsFightingMovingHandler = () => {
        //props.setOnlyOneGuardDisabled(id,false)
        //props.setGuardActived(id,true)
        //props.setSquaresMovingDisabled(props.gameInfo.guards[id - 1].pos,props.gameInfo.guards[id - 1].step,true)
        const newGuards = [...gameInfo.guards].map( g => {
            if (g.id === +game.whosAttacking) return {...g,disabled:false,actived:true}
            else return {...g,disabled:true,actived:false}
        })
        const mover = {...gameInfo.guards[game.whosAttacking - 1]}
        const newSquares = [...gameInfo.squares].map( s => {
            return withinDistance(mover.pos,s.pos,mover.step) 
            ? {...s, disabled: false}
            : {...s, disabled: true}    
        })
        updateGameInfo({
            ...gameInfo,
            guards: newGuards,
            squares: newSquares
        })
    }

    const fightingActionCanceled = () => {

        const newGuards = [...gameInfo.guards].map( g => {
            if (g.side === gameInfo.turn) return {
                ...g,
                actived: false, 
                disabled: false
            }
            else return {...g,disabled:true}
        })
        const newSquares = [...gameInfo.squares].map( s => {
            return {...s,disabled:true}
        })
        //props.setGuardActived(id,false)
        //props.setSquaresDisabled(true)
        //props.setTeamDisabled(props.gameInfo.turn,false)
        //setIsGuardOptionModalShow(false)
        //setClickedGuard(null)
        dispatch(actions.setWhosMoving(null))
        dispatch(actions.setWhosAttacking(null))
        //setWhosAttacking(null)
        updateGameInfo({
            ...gameInfo,
            guards: newGuards,
            squares: newSquares
        })
    }

    const guardsPlacingClick = (id,actived,side,disabled) => {
        const newSquares = gameInfo.squares.map( s => {
            if (rows[side].includes(s.pos[0])) {
                return {...s,disabled: disabled}
            }
            return s
        })
        const newGuards = gameInfo.guards.map( g => {
            if (g.id === id) return {...g,actived: actived}
            else return {...g,actived: !actived}
        })
        //console.log("newGuards : ",newGuards)

        setGameInfo({
            ...gameInfo,
            squares: newSquares,
            guards: newGuards
        })
    }
    const squaresPlacingClickHandler = (pos) => {
        //console.log("pos,whosMoving : ",pos,",",game.whosMoving)
        const newSquares = [...gameInfo.squares.map( s => {
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
        const newGuards = [...gameInfo.guards.map( g => {
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
            ...gameInfo,
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
            let placementFinish = true
            for (let i = 0; i < newGuards.length; i++) {
                placementFinish = newGuards[i].isPlaced && placementFinish
            }
            if (placementFinish) copyGameInfo.currentState = 'fighting_red'
            else copyGameInfo.currentState = 'placing_red' 
        }
        //console.log("newGuards : ",newGuards)
        
        updateGameInfo({
            ...copyGameInfo
        })
        dispatch(actions.setWhosMoving(null))
    }

    const squaresFightingClickHandler = (pos) => {
        //props.setSquareUnit(props.gameInfo.guards[whosMoving - 1].pos,'unknown')
        //props.setSquareUnit(pos,whosMoving)
        //props.setGuardPos(whosMoving,pos)
        //props.setGuardActived(whosMoving,false)
        
        const newSquares = [...gameInfo.squares].map( s => {
            if (s.pos === gameInfo.guards[game.whosAttacking-1].pos) {
                //console.log("remove previous pos")
                return {...s,unit: 'unknown',disabled:true}
            }
            else if (s.pos === pos) return {...s,unit: game.whosAttacking,disabled:true}
            else return {...s,disabled:true}
        })

        const newGuards = [...gameInfo.guards].map( g => {
            if (g.id === +game.whosAttacking) {
                console.log('set g pos')
                return {...g, pos: pos, actived:false}
            }
            else return {...g}
        })
        
        const newGameInfo = {
            ...gameInfo,
            squares: newSquares,
            guards: newGuards 
            
        }
        
        dispatch(actions.setWhosAttacking(null))

        checkActionCounts(newGameInfo)

    }

    const setSquaresPlacingDisabled = (side,disabled) => {
        const newSquares = gameInfo.squares.map( s => {
            if (rows[side].includes(s.pos[0])) {
                return {...s,disabled: disabled}
            }
            return s
        })
        setGameInfo({
            ...gameInfo,
            squares: newSquares
        })
        
        // updateGameInfo({
        //     ...gameInfo,
        //     updater: userSide,
        //     squares: newSquares
        // })
    }
    
    const setSquaresDisabled = (disabled) => {
        
        const newSquares = gameInfo.squares.map( s => {
            return {...s, disabled: disabled}
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            squares: newSquares
        })
    }
    
    const setSquareUnit = (pos,unit) => {
        const newSquares = gameInfo.squares.map( s => {
            if (s.pos === pos) {
                return {...s, unit: unit}
            }
            return s
        })
        updateGameInfo({
            ...gameInfo,
            updater: userSide,
            squares: newSquares
        })
    }

    const renderBoardControl = gameInfo ?
        <BoardControl 
            userSide={props.location.state.userSide}
            gameInfo={gameInfo}
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

            setSquareUnit={setSquareUnit}
            setSquaresDisabled={setSquaresDisabled}
            setSquaresMovingDisabled={setSquaresMovingDisabled}
            setSquaresPlacingDisabled={setSquaresPlacingDisabled}
            setGuardActived={setGuardActived}
            setGuardAttacking={setGuardAttacking}
            setGuardPos={setGuardPos}
            setGuardisPlaced={setGuardisPlaced}
            setGuardsAttackable={setGuardsAttackable}
            setGuardsStrengthen={setGuardsStrengthen}
            setOneGuardDisabled={setOneGuardDisabled}
            setOnlyOneGuardDisabled={setOnlyOneGuardDisabled}
            setUnplacedGuardsDisabled={setUnplacedGuardsDisabled}
            setTeamDisabled={setTeamDisabled}

            
        /> : null
    
    //console.log("[GameController] gameInfo : ",gameInfo)
    return (
        <React.Fragment>
            {loading ? <Spinner /> : renderBoardControl}
        </React.Fragment>
    )
}



export default GameController