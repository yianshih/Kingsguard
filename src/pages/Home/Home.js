import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Modal from '../../components/UI/Modal/Modal'

import { db, auth } from '../../services/firebase'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import * as actions from '../../store/actions/index'
import GamesTable from '../../components/UI/GamesTable/GamesTable'
import { logout } from '../../helpers/auth' 
import { useHistory } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import HomeAppBar from '../../components/UI/HomeAppBar/HomeAppBar'




const Home = _ => {

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
    
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const dispatch = useDispatch()
    const [inputConfig, setInputConfig] = useState({
        value: '',
        type:'text',
        placeholder: 'Game ID',
        invalid: false,
        touched: false

    })
    const drawerWidth = 240
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
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }))
  
      const classes = useStyles()

    const writeUserData = async (key, content) => {
        try {
            //console.log('writing data')
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
        //console.log('creating') 
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
        //console.log('[clickGameHandler]')
        //console.log(gameKey)
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
                //console.log('Join')
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
    
    return (
        <React.Fragment>
            <HomeAppBar currentPage='home' logoutHandler={logoutHandler}/>
            {/* <AppBar 
                position="static" 
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                <Toolbar>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Grid container justify="space-between">
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={() => setOpen(true)}
                                    edge="start"
                                    className={clsx(classes.menuButton, open && classes.hide)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Grid item>
                                    <Typography variant="h6" className={classes.title}>
                                        Kingsguard
                                    </Typography>
                                </Grid>
                            </Grid>
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
            </AppBar> */}
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={() => setOpen(false)}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
            </Drawer>
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