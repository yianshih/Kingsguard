import React, { useState, useRef, useEffect } from 'react'
import Button from '@material-ui/core/Button'
//import Input from '../../components/UI/Input/Input'
import Modal from '../../components/UI/Modal/Modal'
import Backdrop from '@material-ui/core/Backdrop';
import { db, auth } from '../../services/firebase'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import * as actions from '../../store/actions/index'
//import Spinner from '../../components/UI/Spinner/Spinner'
import GamesTable from '../../components/UI/GamesTable/GamesTable'
import { logout } from '../../helpers/auth' 
import { useHistory } from 'react-router-dom'
//import styles from './Home.module.css'
//import Modal from '@material-ui/core/Modal'
//import Backdrop from '@material-ui/core/Backdrop'
//import Fade from '@material-ui/core/Fade'
import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

//import IconButton from '@material-ui/core/IconButton'
//import MenuIcon from '@material-ui/icons/Menu'
//import Slide from '@material-ui/core/Slide'
//import useScrollTrigger from '@material-ui/core/useScrollTrigger'


const Home = _ => {

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
    const [gameInput, setGameInput] = useState('')
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
            attacked: 'unknown',
            bonus: false,
        }
        dispatch(actions.setUserSide('red'))
        writeUserData(newKey,content)
        setIsCreated(true)
        setNewKey(newKey)
        localStorage.setItem('gameKey', newKey)
    }

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
        console.log('[clickGameHandler]')
        console.log(gameKey)
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
                console.log('ID does not exist !!')
                setInputConfig({
                    ...inputConfig,
                    invalid: true
                })
            }
        })
    }
    const joinSubmitHandler = () => {
        const userInput = gameInput.trim()
        db.ref().child("games").orderByChild("gid").equalTo(userInput).once("value",snapshot => {
            if (snapshot.exists()){
                dispatch(actions.setUserSide('red'))
                setJoinError(null)
                setJoinKey(userInput)
                updateGameInfo(userInput,{
                    ...snapshot.val()[userInput],
                    currentState: 'blueJoined',
                    blue: auth().currentUser.email,
                    turn: 'red',
                })
                dispatch(actions.initGameInfo(userInput,'blue'))
                console.log('Join')
                localStorage.setItem('gameKey', userInput)
                //setIsJoined(true)
                setInputConfig({
                    ...inputConfig,
                    invalid: false
                })
            }
            else {
                setJoinError('Game not found !!')
                setInputConfig({
                    ...inputConfig,
                    invalid: true
                })
            }
        })
        
    }


    // const inputChangedHandler = e => {
    //     setInputConfig({
    //         ...inputConfig,
    //         value:e.target.value,
    //         touched: true,
    //         invalid: false
    //     })
    //     setJoinError(null)
        
    // }

    //console.log("inputConfig : ",inputConfig.value)
    const logoutHandler = () => {
        history.push("/")
        logout()
    }

    const gameInputHandler = (e) => {
        setGameInput(e.target.value)
        setJoinError(null)
    }
    // const optionStyle = {
    //     margin:'20px',
    //     width: '180px',
    //     height: '120px',
    //     fontSize:'25px',
    //     borderRadius: '50px'
    // }
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
        :<div style={{margin:'50px'}}><Grid container justify="center" spacing={3}>
            <Grid item xs={3}>
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    className={classes.submit}
                    onClick={createGameHandler}>
                        Create Game
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    className={classes.submit}
                    onClick={() => setIsModalShow(true)}>
                    Join Game
                </Button>
            </Grid>
        </Grid></div>
    )
    // const tableContent = game.gameIDs !== null 
    // ? Object.keys(game.gameIDs).reverse().map( (gameID,index) => {
    //     if (index < 10)
    //         return (
    //             <tbody key={gameID}>
    //                 <tr>
    //                     <td style={{
    //                         color:'red',
    //                         fontSize:'25px'}}>
    //                         {gameID}
    //                     </td>
    //                     <td>
    //                         {game.gameIDs[gameID].creater}
    //                     </td>
    //                     <td>
    //                         {game.gameIDs[gameID].currentState === 'waitingBlue' 
    //                         ? <Button
    //                             fullWidth
    //                             variant="contained"
    //                             color="primary"
    //                             className={classes.submit}
    //                             onClick={() => clickGameHandler(gameID)}>
    //                             Join
    //                         </Button>
    //                     // <Button btnType="Info" clicked={ _ => clickGameHandler(gameID)} >Join</Button>
    //                         : <p style={{color:'red'}}>Playing</p>}
    //                     </td>
    //                 </tr>
    //             </tbody>
    //         )
    //     else return null
    //     })
    // : null

    // const renderGames = (
    //     game.gameIDs !== null
    //     ?
    //     <table className={styles.Table}>
    //         <tbody>
    //             <tr>
    //                 <th>Game ID</th>
    //                 <th>User</th>
    //                 <th></th>
    //             </tr>
    //         </tbody>
    //         {tableContent}
    //     </table>
    //     :<div>
    //         <h3 style={{color:'#2196f3', margin:'10px'}}>Loading Games ...</h3>
    //         {/* <Spinner></Spinner> */}
    //         <CircularProgress />
    //     </div>
    // )
    
    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Typography variant="h6" className={classes.title}>
                                Kingsguard
                            </Typography> 
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={logoutHandler}>
                                Logout
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl">
                <Modal backdropStyle={{backgroundColor:'#0000004d'}} show={isModalShow} modalClosed={() => setIsModalShow(false)}>
                    <Container maxWidth="xl">
                        <form>
                            {joinError ?<TextField 
                                id="standard-basic"
                                error
                                helperText="Game not found"
                                value={gameInput}
                                label="Game ID" 
                                onChange={gameInputHandler}
                                />
                            :<TextField 
                                value={gameInput}
                                id="standard-basic" 
                                label="Game ID" 
                                onChange={gameInputHandler}
                                />}
                        </form>
                    <Grid container justify="center" spacing={3}>
                        <Grid item>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                className={classes.submit}
                                disabled={gameInput === ''}
                                //disabled={!(inputConfig.touched && !inputConfig.invalid)}
                                onClick={joinSubmitHandler}>
                                Join
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="secondary"
                                className={classes.submit}
                                onClick={() => setIsModalShow(false)}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                    </Container>
                </Modal>
                {render}
                {/* <div className={styles.Games}>
                    {renderGames}    
                </div> */}
                {game.gameIDs 
                ?<div style={{
                    margin:'auto',
                    paddingTop:'20px',
                    height:'400px',
                    width:'450px'
                }}>
                    <GamesTable data={game.gameIDs} joinHandler={clickGameHandler} />
                </div>
                // ? <Grid container justify="center" direction="column" alignItems="center">
                //     <Grid item xs={12}>
                //         <GamesTable data={game.gameIDs} joinHandler={clickGameHandler} />
                //     </Grid>
                // </Grid>
                :<Grid container justify="center" direction="column" alignItems="center">
                    <Grid item>
                        <h3 style={{color:'#2196f3', margin:'10px'}}>Loading Games ...</h3>
                    </Grid>
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>}
            </Container>
        </React.Fragment>
    )
}

export default Home