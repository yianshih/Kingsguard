import React, { useState, useEffect } from 'react'
import { auth, db } from '../../services/firebase'
const Chats = () => {
    const [user, setUser] = useState(auth().currentUser)
    const [chats, setChats] = useState([])
    const [content, setContent] = useState('')
    const [readError, setReadError] = useState(null)
    const [writeError, setWriteError] = useState(null)


    useEffect( () => {
        try {
            db.ref("chats").on("value",snapshot => {
                let chats = []
                snapshot.forEach( snap => {
                    chats.push(snap.val())
                })
                chats.sort(function (a, b) { return a.timestamp - b.timestamp })
                setChats(chats)
            })
        } catch(error) {
            setReadError(error.message)
        }
    })
    const submitHandler = (e) => {
        e.preventDefault()
        setWriteError(null)
        try {
            db.ref("chats").push({
                content: content,
                timestamp: Date.now(),
                uid: user.uid
            });
            setContent('')
        } catch (error) {
            setWriteError(error.message)
        }
    }
    const inputChangeHandler = (e) => {
        setContent(e.target.value)
    }
    return (
        <div>
            <div>
                Login as : <strong>{user.email}</strong>
            </div>
            <div>
                {chats.map( chat => {
                    return <p key={chat.timestamp}>{chat.content}</p>
                })}
            </div>
            <form onSubmit={e => submitHandler(e)}>
                <input onChange={ e => inputChangeHandler(e)} value={content}></input>
                {writeError ? <p>{writeError}</p> : null}
                <button type="submit">Send</button>
            </form>
        </div>
    )

}

export default Chats