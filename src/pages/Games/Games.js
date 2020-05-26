import React, { useEffect, useState } from 'react'
import NavigationItems from '../../components/Navigation/NavigationItems/NavigationItems'
import { db, auth } from '../../services/firebase'
//import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'

const Games = props => {
    
    const [gameKey] = useState(props.location.state.gameKey)
    //const [message, setMessage] = useState(null)
    const [content, setContent] = useState(null)
    const [user] = useState(auth().currentUser)
    const [loading, setLoading] = useState(true)
    const [firebaseError, setFirebaseError] = useState(null)

    useEffect( () => {
        const fetchData = async () => {
            try {
                //console.log(`fetch data from game ${gameKey}`)
                await db.ref("games/"+gameKey).on("value", snapshot => {
                    //console.log("snapshot.val() : ",snapshot.val())
                    setContent(snapshot.val())
                    if (props.location.state.blue) {
                        updateGame({
                            gid: snapshot.val().gid,
                            red: snapshot.val().red,
                            timestamp: snapshot.val().timestamp,
                            blue: auth().currentUser.email,
                            currentState: 'blueJoin'
                        })
                    }
                setLoading(false)
                })
            } catch(error) {
                setFirebaseError(error.message)
            }
        }

        const updateGame = async (data) => {
            let updates = {}
            updates['/games/' + gameKey] = {...data}
            try {
                setLoading(true)
                await db.ref().update(updates)
                setLoading(false)
            } catch (error) {
                setFirebaseError(error.message)
            }    
        }

        fetchData()
        
    },[])

    const renderCotent = loading 
    ? <Spinner/> 
    : content === null 
        ? null 
        : Object.keys(content).map( key => (
            <p key={key}>{key} : {content[key]}</p>
        ))

    console.log("content : ",content)

    


    return (
        <React.Fragment>
            <NavigationItems />
            <p>Login as : <strong>{user.email}</strong></p>
            <p>Game ID : <strong>{gameKey}</strong></p>
            {firebaseError ? firebaseError : null}
            {renderCotent}
        </React.Fragment>

    )
}

export default Games