import React, { useState, useEffect } from 'react'
import { db } from '../../services/firebase'
import { auth } from '../../services/firebase'
import Guard from '../../components/Guard/Guard'
import BoardControl from '../BoardControl/BoardControl'
//import Spinner from '../../components/UI/Spinner/Spinner'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import * as actions from '../../store/actions/index'
import styles from './GameController.module.css'
import FillUpModal from '../../components/UI/FillUpModal/FillUpModal'
//import Button from '../../components/UI/Button/Button'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper';

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
    const useStyles = makeStyles((theme) => ({
        paper: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        avatar: {
          margin: theme.spacing(1),
          backgroundColor: theme.palette.secondary.main,
        },
        green: {
          color: '#fff',
          backgroundColor: green[500],
        },
        form: {
          width: '100%', // Fix IE 11 issue.
          marginTop: theme.spacing(1),
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
      }))
  
      const classes = useStyles()
    

    useEffect( () => {
        if (game.gameInfo === null) dispatch(actions.initGameInfo(localStorage.getItem('gameKey'),userSide))
        else dispatch(actions.initGameInfo(gameKey,userSide))
    },[])



    const updateGameInfo = async (data) => {
        //console.log('Uploading')
        //console.log('Uploading',data)
        
        let newData = {...data}
        const isGuardsDead = [...newData.guards].filter( g => g.side === userSide && +g.hp === 0 && g.pos !== 'unknown')
        const unplacedGuards = [...newData.guards].filter( g => (g.side === userSide) && !g.isPlaced)
        
        
        

        if (isGuardsDead.length > 0 && unplacedGuards.length > 0) {
            //console.log('should fill')
            if (newGameInfo === null) {
                setNewGameInfo({...newData})
            }
            else {
                setNewGameInfo({
                    ...newGameInfo,
                    guards: [...newData.guards],
                    squares: [...newData.squares]
                })
            }
            let fillingPos = null
            for (let i = 0; i < newData.guards.length; i++) {
                let g = newData.guards[i]
                if (g.side === userSide && +g.hp === 0 && g.pos !== 'unknown') {
                    fillingPos = g.pos
                    break
                }
            }
            const newSquares = [...newData.squares].map( s => {
                if (s.pos === fillingPos) return {...s,actived: true}
                else return {...s}
            })

            fillingUpdate({
                ...newData,
                currentState: game.gameInfo.currentState,
                turn: game.gameInfo.turn,
                squares: newSquares
            })

            setIsFilling(true)
            return
        }
        else {
            setIsFilling(false)
            setNewGameInfo(null)
        }
        
        if ( (newData.currentState.split('_')[0] === 'fighting') && ( (newData.turn !== game.gameInfo.turn) || (game.gameInfo.currentState === 'blueJoined') ) ) {


        }
        //console.log(newData)
        if (newData.currentState.split("_")[0] === 'fighting' && ( (newData.turn !== game.gameInfo.turn) || (game.gameInfo.currentState === 'blueJoined') ) ) {
            //switch turn
            //console.log('here')
            const finalGuards = [...newData.guards].map( g => {
                if (g.side === newData.turn) {
                    return {...g, disabled: false}
                }
                else {
                    return {...g,disabled: true}
                }
            })
            newData.guards = finalGuards
        }
        
        if (newData.turn !== userSide){
            newData.bonus = false
        }
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

    const bonusUpdate = async (side) => {

        let newGuards = [...game.gameInfo.guards]
        let shouldUpdate = false
        let attacked = []
        if (checkAngelBonus(side,game.gameInfo.guards)) {
            //console.log('angel bonus')
            shouldUpdate = true
            newGuards = [...newGuards].map( g => {
                if (g.side === side && g.isPlaced && g.name !== 'Angel' && g.hp > 0) {
                    attacked.push(g.id)
                    const newHp = +g.hp + 30 > +g.fullHp 
                    ? g.fullHp 
                    : +g.hp + 30 
                    return {
                        ...g,
                        prevHp: g.hp,
                        hp:newHp
                    }
                }
                else return {...g}
            })
        }

        if (checkKingBonus(side,game.gameInfo.guards)) {
            //console.log('king bonus')
            shouldUpdate = true
            newGuards = [...newGuards].map( g => {
                if (g.side === side && g.isPlaced && g.name !== 'King') {
                    //console.log('dmg + 10')
                    return {...g,dmg:+g.dmg + 10}
                }
                else return {...g}
            })
        }

        if (shouldUpdate) {

            // console.log('bonus updating')
            // console.log("newGuards : ",newGuards)
            let updates = {}
            updates['/games/' + gameKey] = {
                ...game.gameInfo,
                bonus: true,
                attacked : attacked,
                guards: newGuards
            }
            try {
                await db.ref().update(updates)
            } catch (error) {
                console.log("Error Occurred",error.message)
            }
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
        //console.log("newGuards : ",newGuards)
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
        const t_rowIndex = row.findIndex( (item) => item === target_pos[0])
        const rowDis = Math.abs(g_rowIndex - t_rowIndex)
        const noDis = Math.abs(g_pos[1] - target_pos[1])
        let attackable = false
        if (range > 1) {
            if (noDis === range) {
                attackable = rowDis <= range
            }
            else if (rowDis === range) {
                attackable = noDis <= range
            }
            
        }
        else {
            attackable = rowDis <= range && noDis <= range
        }
        return attackable
    }

    const guardsFightingClickHandler = (clickedId) => {

        
        const attackGuard = game.gameInfo.guards[clickedId - 1]
        //console.log("attackGuard : ",attackGuard)
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
        let newAttacked = []
        if (!defender.isShelled) {
            newAttacked.push(defender.id)
            // newMessage[defender.side] = {
            //     [defender.name] : {
            //         preHp: defender.hp,
            //         curHp: defender.hp > attacker.dmg ? defender.hp - attacker.dmg : 0
            //     }
            // }
            defender.prevHp = defender.hp
            defender.hp = defender.hp > attacker.dmg ? defender.hp - attacker.dmg : 0
            if (defender.name === 'King' && defender.hp <= 0) {
                for (let i = 0; i < copyGuards.length; i++) {
                    if (copyGuards[i].side === defender.side && copyGuards[i].isPlaced) {
                        copyGuards[i].prevHp = copyGuards[i].hp
                        copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                        copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                    }
                }
            }
        }

        if (withinAttack(attacker.pos, defender.pos, defender.range)) {
            if (!attacker.isShelled) {
                newAttacked.push(attacker.id)
                attacker.prevHp = attacker.hp
                attacker.hp = attacker.hp > defender.dmg ? attacker.hp - defender.dmg : 0
                if (attacker.name === 'King' && attacker.hp <= 0) {
                    for (let i = 0; i < copyGuards.length; i++) {
                        if (copyGuards[i].side === attacker.side && copyGuards[i].isPlaced) {
                            newAttacked.push(copyGuards[i].id)
                            copyGuards[i].prevHp = copyGuards[i].hp
                            copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                            copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                        }
                    }
                }
                
            }
            if (attacker.isShelled) copyGuards[attacker.id - 1].isShelled = false
        }

        if (defender.isShelled) copyGuards[defender.id - 1].isShelled = false

        const newGameInfo = {
            ...game.gameInfo,
            guards: copyGuards,
            squares: newSquares,
            attacked: newAttacked
        }
        
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
        newGameInfo.winner = checkWinner(newGameInfo.guards)
        
        if (checkWinner(newGameInfo.guards) !== null) {
            dispatch(actions.resetGuards)
            dispatch(actions.resetSquares)
        }
        if (attack !== null) {
            updateGameInfo({
                ...newGameInfo
            })

            // if (+newGameInfo.guards[attack-1].hp === 0) {
                
            //     const unplacedGuards = newGameInfo.guards.filter( g => (g.side === newGameInfo.guards[attack-1].side) && !g.isPlaced)

            //     if (unplacedGuards.length > 0) {
            //         setNewGameInfo(newGameInfo)
            //         setIsFilling(true)
            //     }
            //     else {
            //         updateGameInfo({
            //             ...newGameInfo
            //         })
            //     }
            // }
            // else {
            //     updateGameInfo({
            //         ...newGameInfo
            //     })
            // }
        }
        else {
            updateGameInfo({
                ...newGameInfo,
                attacked: 'unknown'
            })
    
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
        dispatch(actions.setWhosMoving(null))
        dispatch(actions.setWhosAttacking(null))
        dispatch(actions.setWhosAbility(null))
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
        
        const whosMoving = game.whosAttacking 
            ? game.whosAttacking 
            : game.whosAbility 
                ? game.whosAbility 
                : null

        const newSquares = [...game.gameInfo.squares].map( s => {
            if (s.pos === game.gameInfo.guards[whosMoving-1].pos) {
                //console.log("remove previous pos")
                return {...s,unit: 'unknown',disabled:true}
            }
            else if (s.pos === pos) return {...s,unit: whosMoving,disabled:true}
            else return {...s,disabled:true}
        })

        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.id === +whosMoving) {
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
        
        if (game.whosAbility === null) {
            dispatch(actions.setWhosAttacking(null))
            return checkActionCounts(newGameInfo)
        }
        else {
            updateGameInfo({
                ...newGameInfo,
                squares: [...newGameInfo.squares].map( s => {return {...s,disabled:true}}),
                guards: [...newGameInfo.guards].map( g => {
                    if (g.id === game.whosAbility) return {...g,actived: false, disabled:false,ability: true} 
                    else if (g.side === userSide) return {...g,disabled:false}
                    else return {...g,disabled:true}
                })
            })
            dispatch(actions.setWhosAbility(null))
        } 


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
    
    const fillingUpdate = async (data) => {
        let updates = {}
            updates['/games/' + gameKey] = {...data}
            try {
                //setLoading(true)
                await db.ref().update(updates)
                //setLoading(false)
            } catch (error) {
                console.log("Error Occurred",error.message)
            }
    }

    const fillUpHandler = (id) => {
        let deadPos = 'NotFound'
        
        //const tempGameInfo = newGameInfo === null ? game.gameInfo : newGameInfo
        const tempGameInfo = {...newGameInfo}
        const isGuardsDead = [...tempGameInfo.guards].filter( g => g.side === userSide && +g.hp === 0 && g.pos !== 'unknown')
        const unplacedGuards = [...tempGameInfo.guards].filter( g => (g.side === userSide) && !g.isPlaced)

        let fillingTwice = isGuardsDead.length > 1 && unplacedGuards.length > 1
        
        //console.log("fillingTwice : ",fillingTwice)
        for (let i = 0; i < tempGameInfo.guards.length; i++) {
            let g = tempGameInfo.guards[i]
            if (g.side === tempGameInfo.guards[id - 1].side && +g.hp === 0 && g.pos !== 'unknown') {
                deadPos = g.pos
                g.pos = 'unknown'
                break
            }
        }

        //console.log("deadPos : ",deadPos)
        const finalGuards = [...tempGameInfo.guards].map( g => {
            if (g.id === id) return {...g,isPlaced: true, pos: deadPos}
            else return {...g}
        })

        const newSquares = [...tempGameInfo.squares].map( s => {
            if (s.pos === deadPos) return {...s,unit: id,actived: false}
            else return {...s}
        })
        if (fillingTwice) return fillingUpdate({
                ...tempGameInfo,
                attacked: 'unknown',
                currentState: game.gameInfo.currentState,
                turn: game.gameInfo.turn,
                squares: newSquares,
                guards: finalGuards
            })
        
        else {
            //console.log("tempGameInfo : ",tempGameInfo)
            updateGameInfo({
                ...tempGameInfo,
                attacked: 'unknown',
                squares: newSquares,
                guards: finalGuards
            })
        }
        
    }

    const setJumpToFighting = () => {
        let newGuards = [...guards]
        let newSquares = [...squares]

        for (let i = 2; i < 6; i++) {
            const redPos = "D"+(i)
            const bluePos = "E"+(i)
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

    const abilityHandler = (name,id) => {
        if (game.whosAbility !== null) return fightingActionCanceled()
        switch(name) {
            case 'Knight':
                return knightAbilityHandler(id)
            case 'Archer': 
                return archerAbilityHandler(id)
            case 'Wizard': 
                return wizardAbilityHandler(id)
            case 'Assassin':
                return assassinAbilityHandler(id)
            default:
                return console.log('Unknown Case')
        }
    }

    const abilityAttackHandler = (id) => {
        const defender = game.gameInfo.guards[id - 1]
        const attacker = game.gameInfo.guards[game.whosAbility - 1]
        switch(attacker.name) {
            case 'Knight':
                return knightAbilityAttacking(attacker,defender)
            case 'Archer': 
                return archerAbilityAttacking(attacker,defender)
            case 'Wizard': 
                return wizardAbilityAttacking(attacker,defender)
            default:
                return console.log('Unknown Case')
        }
    }

    const knightAbilityAttacking = (knight,target) => {
        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.id === knight.id) return {...g,actived:false,ability: true,disabled: false}
            else if (g.id === target.id) return {...g,isShelled: true,disabled: false}
            else if (g.side === knight.side) return {...g,disabled: false}
            else return {...g}
        })
        dispatch(actions.setWhosAbility(null))
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards
        })
    }

    const wizardAbilityAttacking = (attack,defend) => {
        const copyGuards = [...game.gameInfo.guards]
        const attacker = copyGuards[attack.id - 1]
        const defender = copyGuards[defend.id - 1]
        
        attacker.ability = true
        let newAttacked = []

        if (!defender.isShelled) {    
            newAttacked.push(defender.id)
            defender.prevHp = defender.hp
            defender.hp = defender.hp > attacker.dmg ? defender.hp - attacker.dmg : 0
            
            if (defender.name === 'King' && defender.hp <= 0) {
                for (let i = 0; i < copyGuards.length; i++) {
                    if (copyGuards[i].side === defender.side && copyGuards[i].isPlaced) {
                        newAttacked.push(copyGuards[i].id)
                        copyGuards[i].prevHp = copyGuards[i].hp
                        copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                        copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                    }
                }
            }
        }
        
        
        
        if (withinAttack(attacker.pos, defender.pos, defender.range)) {
            if (!attacker.isShelled) {
                newAttacked.push(attacker.id)
                attacker.prevHp = attacker.hp
                attacker.hp = attacker.hp > defender.dmg ? attacker.hp - defender.dmg : 0
                if (attacker.name === 'King' && attacker.hp <= 0) {
                    for (let i = 0; i < copyGuards.length; i++) {
                        if (copyGuards[i].side === attacker.side && copyGuards[i].isPlaced) {
                            newAttacked.push(copyGuards[i].id)
                            copyGuards[i].prevHp = copyGuards[i].hp
                            copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                            copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                        }
                    }
                }
            }
            if (attacker.isShelled) copyGuards[attacker.id - 1].isShelled = false
        }

        for (let i = 0; i < copyGuards.length; i++) {
            //AOE 
            if (withinAttack(defender.pos,copyGuards[i].pos,1) && i !== (defender.id-1)) {
                if (!copyGuards[i].isShelled) {
                    newAttacked.push(copyGuards[i].id)
                    copyGuards[i].preHp = copyGuards[i].hp
                    copyGuards[i].hp = copyGuards[i].hp - (attacker.dmg/2) > 0 ? copyGuards[i].hp - (attacker.dmg/2) : 0
                }
                if (copyGuards[i].isShelled) copyGuards[i].isShelled = false
            }
        }

        if (checkKingDied(copyGuards,'red')) {
            for (let i = 0; i < copyGuards.length; i++) {
                if (copyGuards[i].side === 'red' && copyGuards[i].isPlaced) {
                    newAttacked.push(copyGuards[i].id)
                    copyGuards[i].prevHp = copyGuards[i].hp
                    copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                    copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                }
            }
        }
        if (checkKingDied(copyGuards,'blue')) {
            for (let i = 0; i < copyGuards.length; i++) {
                newAttacked.push(copyGuards[i].id)
                if (copyGuards[i].side === 'blue' && copyGuards[i].isPlaced) {
                    copyGuards[i].prevHp = copyGuards[i].hp
                    copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                    copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                }
            }
        }

        if (defender.isShelled) copyGuards[defender.id -1 ].isShelled = false
        if (newAttacked.length === 0 ) newAttacked = 'unknown'
        const newGameInfo = {
            ...game.gameInfo,
            guards: copyGuards,
            attacked: newAttacked,
            currentState: game.gameInfo.currentState === 'fighting_red' ? 'fighting_blue' : 'fighting_red',
            turn: game.gameInfo.turn === 'red' ? 'blue' : 'red'
        }
        dispatch(actions.setWhosAbility(null))
        checkActionCounts(newGameInfo,attacker.id)
    }

    const checkKingDied = (guards,side) => {
        if (side === 'red') return guards[3].hp <= 0
        else return guards[9].hp <= 0
    }

    const archerAbilityAttacking = (attack,defend) => {
        
        const copyGuards = [...game.gameInfo.guards]
        const attacker = copyGuards[attack.id - 1]
        const defender = copyGuards[defend.id - 1]

        attacker.ability = true

        let newAttacked = []
        if (!defender.isShelled) {
            newAttacked.push(defender.id)
            defender.prevHp = defender.hp
            defender.hp = defender.hp > attacker.dmg ? defender.hp - (attacker.dmg*1.5) : 0
            if (defender.name === 'King' && defender.hp <= 0) {
                for (let i = 0; i < copyGuards.length; i++) {
                    if (copyGuards[i].side === defender.side && copyGuards[i].isPlaced) {
                        newAttacked.push(copyGuards[i].id)
                        copyGuards[i].prevHp = copyGuards[i].hp
                        copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                        copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                    }
                }
            }
        }
        
        if (withinAttack(attacker.pos, defender.pos, defender.range)) {
            if (!attacker.isShelled) {
                newAttacked.push(attacker.id)
                attacker.prevHp = attacker.hp
                attacker.hp = attacker.hp > defender.dmg ? attacker.hp - defender.dmg : 0
                if (attacker.name === 'King' && attacker.hp <= 0) {
                    for (let i = 0; i < copyGuards.length; i++) {
                        if (copyGuards[i].side === attacker.side && copyGuards[i].isPlaced) {
                            newAttacked.push(copyGuards[i].id)
                            copyGuards[i].prevHp = copyGuards[i].hp
                            copyGuards[i].hp = (copyGuards[i].hp/3).toFixed(0)
                            copyGuards[i].dmg = (copyGuards[i].dmg/3).toFixed(0)
                        }
                    }
                }
            }
            if (attacker.isShelled) copyGuards[attacker.id - 1].isShelled = false
        }
        if (defender.isShelled) copyGuards[defender.id - 1].isShelled = false
        const newGameInfo = {
            ...game.gameInfo,
            guards: copyGuards,
            attacked: newAttacked,
            currentState: game.gameInfo.currentState === 'fighting_red' ? 'fighting_blue' : 'fighting_red',
            turn: game.gameInfo.turn === 'red' ? 'blue' : 'red'
        }
        dispatch(actions.setWhosAbility(null))
        checkActionCounts(newGameInfo,attacker.id)
    }

    const knightAbilityHandler = (id) => {
        //console.log(`${id} ability clicked`)
        dispatch(actions.setWhosAbility(id))
        const knight = game.gameInfo.guards[id - 1]
        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.id === id) return {...g,actived:true,disabled: true}
            else if (withinDistance(knight.pos,g.pos,1) && g.side === knight.side && g.id !== id) return {...g,disabled:false}
            else return {...g,disabled: true}
        })
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards
        })
    }

    const archerAbilityHandler = (id) => {
        //console.log('archer ability handler')
        dispatch(actions.setWhosAbility(id))
        const attacker = game.gameInfo.guards[id - 1]
        const pos = attacker.pos // attacking guard pos
        const range = attacker.range
        const newGuards = game.gameInfo.guards.map( g => {
            if (g.id === +id) {
                return {...g,actived: true,disabled: true}
            }
            else if (g.side === attacker.side) return {...g,disabled: true}
            else if (g.side !== attacker.side && g.id !== +id) return withinAttack(pos,g.pos,range) 
                ? {...g,disabled: false} 
                : {...g,disabled: true}
            else return {...g,disabled:true}
            
        })
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards
        })
    }

    const wizardAbilityHandler = (id) => {

        dispatch(actions.setWhosAbility(id))
        const attacker = game.gameInfo.guards[id - 1]
        const pos = attacker.pos // attacking guard pos
        const range = attacker.range
        const newGuards = game.gameInfo.guards.map( g => {
            if (g.id === +id) {
                return {...g,actived: true,disabled: true}
            }
            else if (g.side === attacker.side) return {...g,disabled: true}
            else if (g.side !== attacker.side && g.id !== +id) return withinAttack(pos,g.pos,range) 
                ? {...g,disabled: false} 
                : {...g,disabled: true}
            else return {...g,disabled:true}
            
        })
        updateGameInfo({
            ...game.gameInfo,
            guards: newGuards
        })
    }

    const assassinAbilityHandler = (id) => {
        dispatch(actions.setWhosAbility(id))
        const newSquares = [...game.gameInfo.squares].map( s => {
            if (s.unit === 'unknown') return {...s,disabled: false}
            else return {...s}
        })
        const newGuards = [...game.gameInfo.guards].map( g => {
            if (g.id === id) return {...g,actived: true, disabled: true}
            else return {...g, disabled:true}
        })
        updateGameInfo({
            ...game.gameInfo,
            squares: newSquares,
            guards: newGuards
        })
    }

    const renderBoard = <BoardControl 
                            userSide={props.location.state.userSide}
                            updateGameInfo={updateGameInfo}
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
                            abilityHandler={abilityHandler}
                            abilityAttackHandler={abilityAttackHandler}
                            checkAngelBonus={checkAngelBonus}
                            bonusUpdate={bonusUpdate}
                        />

    const renderGuards = 
    <div className={styles.GuardsBoard}>
        { game.gameInfo 
        ? game.gameInfo.guards.map( g => 
            !g.isPlaced && g.side === userSide
            ? <Guard
                id={g.id}
                key={g.id}
                side={g.side}
                clicked={() => fillUpHandler(g.id)} 
                pos={g.pos}
                name={g.name} 
                disabled={false}
                actived={g.actived}
            /> 
            :null
        )
        :null}
    </div>
    return (
        <React.Fragment>
            {game.gameInfo?
            <AppBar style={{zIndex:'700'}} position="fixed">
                <Toolbar>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Typography variant="h6" className={classes.title}>
                                Kingsguard
                            </Typography> 
                        </Grid>
                        <Grid item>
                            <Paper style={{padding:'10px'}} elevation={5}>{game.gameInfo.gid}</Paper>
                        </Grid>
                        <Grid item>
                            <Paper style={{padding:'10px'}} elevation={5}>Team <strong style={{color: userSide === 'red' ? 'red' : 'blue'}}>{userSide}</strong></Paper>
                        </Grid>
                        <Grid item>
                            <Paper style={{padding:'10px'}} elevation={5}><strong>{user.email}</strong></Paper>
                        </Grid>
                        <Grid item>
                            <Link underline='none' href="/">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={leaveHandler}>
                                    Leave
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>:null}
            <FillUpModal show={isFilling} modalClosed={null}>
                <h3>One of your unit is dead,please choice an unit to fill </h3>
                {renderGuards}
            </FillUpModal>
            {/* {game.gameInfo
            ? <Grid style={{marginTop:'20px'}} container justify="center" alignItems="center" spacing={10}>
                <Grid item>
                    <Paper style={{padding:'10px'}} elevation={5}>ID :{game.gameInfo.gid}</Paper>
                </Grid>
                <Grid item>
                    <Paper style={{padding:'10px'}} elevation={5}>You're <strong style={{color: userSide === 'red' ? 'red' : 'blue'}}>{userSide}</strong></Paper>
                </Grid>
                <Grid item>
                    <Paper style={{padding:'10px'}} elevation={5}>User : <strong>{user.email}</strong></Paper>
                </Grid>
            </Grid>
            : null} */}

            <div className={styles.GameController}>
                {game.gameInfo === null
                ? localStorage.getItem('gameKey') ?  <CircularProgress /> : renderBoard
                : renderBoard 
                }
                
            </div>
        </React.Fragment>
    )
}



export default GameController