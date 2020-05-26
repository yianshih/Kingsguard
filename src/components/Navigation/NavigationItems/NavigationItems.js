import React from 'react'
//import Button from '../../UI/Button/Button'
import styles from './NavigationItems.module.css'
import NavigationItem from './NavigationItem/NavigationItem'
//import { logout } from '../../../helpers/auth' 
//import { useHistory } from 'react-router-dom';

const NavigationItems = ( props ) => {

    //const history = useHistory()

    // const logoutHandler = () => {
    //     history.push("/")
    //     logout()
    // }

    return <ul className={styles.NavigationItems}>
        <NavigationItem link="/" exact>Home</NavigationItem>
        {/* <NavigationItem link="/game" exact>Game</NavigationItem> */}
        {/* <Button className={styles.Logout} btnType="Danger" clicked={logoutHandler}>Logout</Button> */}
        
    </ul>
}

export default NavigationItems