import React, { useState, useRef, useEffect } from 'react'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Modal from '../../components/UI/Modal/Modal'
import { db, auth } from '../../services/firebase'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as actions from '../../store/actions/index'
import Spinner from '../../components/UI/Spinner/Spinner'
import { logout } from '../../helpers/auth' 
import { useHistory } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {

    //const [gameKey] = useState(db.ref().child('games').push().key)
    const joinInput = useRef()
    //const newRef = useRef()
    const history = useHistory()
    const game = useSelector(state => state.game)
    const guards = useSelector(state => state.guards)
    const squares = useSelector(state => state.squares)

    const [joinKey, setJoinKey] = useState(null)
    const [isCreated, setIsCreated] = useState(false)
    const [isJoined, setIsJoined] = useState(false)
    const [isModalShow, setIsModalShow] = useState(false)
    //const [isGamesViewShow, setIsGamesViewShow] = useState(false)
    const [joinError, setJoinError] = useState(null)
    const [newKey, setNewKey] = useState(null)
    //const [games, setGames] = useState(null)
    const [createError,setCreateError] = useState(null)
    const dispatch = useDispatch()
    const [inputConfig, setInputConfig] = useState({
        value: '',
        type:'text',
        placeholder: 'Game ID',
        invalid: false,
        touched: false

    })

    const writeUserData = async (key, content) => {
        try {
            console.log('writing data')
            await db.ref('games/' + key).set(content)
            dispatch(actions.initGameInfo(key,'red'))

        } catch (error) {
            setCreateError(error.message)
            console.log(createError)
        }
        
    }

    useEffect( () => {
        console.log('[ Resetting ]')
        dispatch(actions.resetGuards())
        dispatch(actions.resetSquares())
        dispatch(actions.resetGame())
    },[])

    useEffect( () => {
        dispatch(actions.loadingGames())
        //fetchGames()
    },[])

    const createGameHandler = () => {
        console.log('creating') 
        const newKey = db.ref().child('games').push().key.substring(1)
        const content = {
            creater: auth().currentUser.email,
            gid: newKey,
            timestamp: Date.now(),
            red: auth().currentUser.email,
            blue: null,
            turn: 'red',
            guards: guards,
            squares: squares,
            currentState: 'waitingBlue',
            updateState: false,
            updater: 'unknown',
            winner: 'unknown',
            message: 'unknown'
        }
        dispatch(actions.setUserSide('red'))
        writeUserData(newKey,content)
        setIsCreated(true)
        setNewKey(newKey)
        localStorage.setItem('gameKey', newKey)
    }

    const joinGameHandler = () => {
        //console.log('joinInput.current',joinInput.current)
        //joinInput.current.focus()
        setIsModalShow(true)
        
    }

    // const viewGamesHandler = async () => {
    //     setIsGamesViewShow(true)
    // }

    const updateGameInfo = async (gameKey,data) => {
        let updates = {}
        updates['/games/' + gameKey] = {...data}
        try {
            await db.ref().update(updates)
            setIsJoined(true)
        } catch (error) {
            setJoinError('Cannot join, error occurred')
            console.log(error.message)
        }    
    }
    const clickGameHandler = (gameKey) => {
        
        db.ref().child("games").orderByChild("gid").equalTo(gameKey).once("value",snapshot => {
            if (snapshot.exists()){
                //console.log("snapshot.val() : ",snapshot.val())
                setJoinKey(gameKey)
                dispatch(actions.setUserSide('red'))
                updateGameInfo(gameKey,{
                    ...snapshot.val()[gameKey],
                    blue: auth().currentUser.email,
                    currentState: 'blueJoined',
                    turn: 'red',
                })
                console.log('Join')
                dispatch(actions.initGameInfo(gameKey,'blue'))
                localStorage.setItem('gameKey', gameKey)
            }
            else {
                alert('ID does not exist !!')
                setInputConfig({
                    ...inputConfig,
                    invalid: true
                })
            }
        })
    }
    const joinSubmitHandler = () => {
        db.ref().child("games").orderByChild("gid").equalTo(inputConfig.value.trim()).once("value",snapshot => {
            if (snapshot.exists()){
                dispatch(actions.setUserSide('red'))
                setJoinError(null)
                setJoinKey(inputConfig.value.trim())
                //console.log('exists : ',snapshot.val())
                updateGameInfo(inputConfig.value.trim(),{
                    ...snapshot.val()[inputConfig.value.trim()],
                    currentState: 'blueJoined',
                    blue: auth().currentUser.email,
                    turn: 'red',
                })
                dispatch(actions.initGameInfo(inputConfig.value.trim(),'blue'))
                console.log('Join')
                localStorage.setItem('gameKey', inputConfig.value.trim())
                //setIsJoined(true)
                setInputConfig({
                    ...inputConfig,
                    invalid: false
                })
            }
            else {
                setJoinError('ID does not exist !!')
                setInputConfig({
                    ...inputConfig,
                    invalid: true
                })
            }
        })
        
    }


    const inputChangedHandler = e => {
        setInputConfig({
            ...inputConfig,
            value:e.target.value,
            touched: true,
            invalid: false
        })
        setJoinError(null)
        
        
    }
    //console.log("inputConfig : ",inputConfig.value)
    const logoutHandler = () => {
        history.push("/")
        logout()
    }
    const optionStyle = {
        margin:'20px',
        width: '180px',
        height: '120px',
        fontSize:'25px',
        borderRadius: '50px'
    }
    const render = (
        isCreated ? <Redirect to={{ 
            pathname: '/game', 
            state: { 
                gameKey: newKey,
                red: auth().currentUser.email,
                userSide: 'red'
            }
        }} />
        : isJoined ? <Redirect to={{ 
            pathname: '/game', 
            state: { 
                gameKey: joinKey,
                blue: auth().currentUser.email,
                userSide: 'blue'
            }
        }}/>
        :<div>
            <Button styled={optionStyle} btnType="Success" clicked={createGameHandler}>Create Game</Button>
            <Button styled={optionStyle} btnType="Success" clicked={joinGameHandler}>Join Game</Button>
            {/* <Button btnType="Success" clicked={viewGamesHandler}>Game Lobby</Button> */}
        </div>
    )
    const tableContent = game.gameIDs !== null 
    ? Object.keys(game.gameIDs).reverse().map( (gameID,index) => {
        if (index < 10)
            return (
                <tbody key={gameID}>
                    <tr>
                        <td style={{
                            color:'red',
                            fontSize:'25px'}}>
                            {gameID}
                        </td>
                        <td>
                            {game.gameIDs[gameID].creater}
                        </td>
                        <td>
                            {game.gameIDs[gameID].currentState === 'waitingBlue' 
                            ? <Button btnType="Info" clicked={ _ => clickGameHandler(gameID)} >Join</Button>
                            : <p style={{color:'red'}}>Playing</p>}
                        </td>
                    </tr>
                </tbody>
            )
        else return null
        })
    : null
    const renderGames = (
        game.gameIDs !== null
        ?
        <table className={styles.Table}>
            <tbody>
                <tr>
                    <th>Game ID</th>
                    <th>User</th>
                    <th></th>
                </tr>
            </tbody>
            {tableContent}
        </table>
        :<div>
            <h3 style={{margin:'10px'}}>Loading Games ...
            <Spinner></Spinner>
            </h3>
        </div>
    )
    
    return (    
        <React.Fragment>
            <Modal show={isModalShow} modalClosed={() => setIsModalShow(false)}>
                <p>Enter Game ID</p>
                <p style={{color:'red'}}>{joinError}</p>
                {/* <input ref={joinInput} type="text"></input> */}
                <Input
                    ref={joinInput}
                    id='joinInput'
                    text="input"
                    value={inputConfig.value} 
                    changed={e => inputChangedHandler(e)}
                    elementConfig={{type:inputConfig.type,placeholder:inputConfig.placeholder}}
                    invalid={inputConfig.invalid}
                    touched={inputConfig.touched}
                >   
                </Input>
                <div>
                    <Button disabled={!(inputConfig.touched && !inputConfig.invalid)} btnType="Success" clicked={joinSubmitHandler}>Join</Button>
                    <Button btnType="Danger" clicked={() => setIsModalShow(false)}>Close</Button>
                </div>
            </Modal>
            {/* <Modal show={isGamesViewShow} modalClosed={ () => setIsGamesViewShow(false)}>
                {renderGames}
            </Modal> */}
            <div className={styles.Logout}>
                <Button btnType="Danger" clicked={logoutHandler}>Logout</Button>
            </div>
            <div className={styles.Options}>
                {render}
            </div>
            <div className={styles.Games}>
                {renderGames}    
            </div>
            
        </React.Fragment>
        
    )
}

export default Home