import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBXtgcS4UsPx-bxyXoVkeGFUG2B4CbYMoE",
    authDomain: "kingsguardgame.firebaseapp.com",
    databaseURL: "https://kingsguardgame.firebaseio.com",
  };

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth;
export const db = firebase.database();

// export const updateGameInfo = async (gameID, gameInfo, data) => {
//     console.log('[Uploading game info]')
//     let updates = {}
//     updates['/games/' + gameID] = {...gameInfo,...data}
//     try {
//         await firebase.database().ref().update(updates)
//     } catch (error) {
//         console.log("Error Occurred",error.message)
//     }    
// }

