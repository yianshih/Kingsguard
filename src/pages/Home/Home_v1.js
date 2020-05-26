import React, { useState } from 'react'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Modal from '../../components/UI/Modal/Modal'
import { db, auth } from '../../services/firebase'
import { Redirect } from 'react-router-dom'

const Home = props => {

    //const [gameKey] = useState(db.ref().child('games').push().key)
    const [isCreated, setIsCreated] = useState(false)
    const [isJoined, setIsJoined] = useState(false)
    const [isModalShow, setIsModalShow] = useState(false)
    const [joinError, setJoinError] = useState(null)
    const [newKey, setNewKey] = useState(null)
    const [createError,setCreateError] = useState(null)
    const [inputConfig, setInputConfig] = useState({
        value: '',
        type:'text',
        placeholder: 'Game ID',
        invalid: false,
        touched: false

    })

    const writeUserData = async (key, content) => {
        try {
            await db.ref('games/' + key).set(content)
        } catch (error) {
            setCreateError(error.message)
            console.log(createError)
        }
        
    }

    const createGameHandler = () => {
        console.log('creating') 
        const newKey = db.ref().child('games').push().key.substring(1)
        const content = {
            gid: newKey,
            timestamp: Date.now(),
            red: auth().currentUser.email,
            blue: null,
            guards: 'unknown',
            squares: 'unknown',
            currentState: 'waitingBlue'
        }
        writeUserData(newKey,content)
        setIsCreated(true)
        setNewKey(newKey)
    }

    const joinGameHandler = () => {
        setIsModalShow(true)
    }

    const updateGameInfo = async (data) => {
        let updates = {}
        updates['/games/' + inputConfig.value.trim()] = {...data}
        try {
            await db.ref().update(updates)
            setIsJoined(true)
        } catch (error) {
            setJoinError('Cannot join, error occurred')
            console.log(error.message)
        }    
    }

    const joinSubmitHandler = () => {
        db.ref().child("games").orderByChild("gid").equalTo(inputConfig.value.trim()).once("value",snapshot => {
            if (snapshot.exists()){
                setJoinError(null)
                console.log('exists : ',snapshot.val())
                updateGameInfo({
                    gid: snapshot.val()[inputConfig.value.trim()].gid,
                    red: snapshot.val()[inputConfig.value.trim()].red,
                    timestamp: snapshot.val()[inputConfig.value.trim()].timestamp,
                    blue: auth().currentUser.email,
                    currentState: 'blueJoin'
                    
                })
                console.log('Join')
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
        });
        
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
    
    const render = (
        isCreated ? <Redirect to={{ 
            pathname: '/game', 
            state: { 
                gameKey: newKey,
                red: auth().currentUser.email,
            }
        }} />
        : isJoined ? <Redirect to={{ 
            pathname: '/game', 
            state: { 
                gameKey: inputConfig.value.trim(),
                blue: auth().currentUser.email
            }
        }}/>
        :<div>
            <Button btnType="Success" clicked={createGameHandler}>Create Game</Button>
            <Button btnType="Success" clicked={joinGameHandler}>Join Game</Button>
        </div>
    )

    const renderGameInfo = (
        <div>
            <p>Game ID : {props.gameInfo.gid}</p>
            <p>Current State : {props.gameInfo.currentState}</p>
            <p>Turn : {props.gameInfo.turn}</p>
        </div>
        
    )
    return (    
        <React.Fragment>
            <Modal show={isModalShow} modalClosed={() => setIsModalShow(false)}>
                <p>Enter Game ID</p>
                <p style={{color:'red'}}>{joinError}</p>
                <Input 
                    text="input"
                    value={inputConfig.value} 
                    changed={e => inputChangedHandler(e)}
                    elementConfig={{type:inputConfig.type,placeholder:inputConfig.placeholder}}
                    invalid={inputConfig.invalid}
                    touched={inputConfig.touched}
                >   
                </Input>
                <Button disabled={!(inputConfig.touched && !inputConfig.invalid)} btnType="Danger" clicked={joinSubmitHandler}>Join</Button>
            </Modal>
            {render}
            {renderGameInfo}
            
        </React.Fragment>
        
    )
}

export default Home