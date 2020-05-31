import React from 'react'

import Wavy from './UI/Wavy/Wavy'
import AttackEffect from './UI/AttackEffect/AttackEffect'
import SigninForm from './UI/MaterialUI/SigninForm/SigninForm'
import Table from './UI/GamesTable/GamesTable'
const TestComponent = () => {

    const myObject = {
        id: 1,
        name: 'Tom',
        age: 20
    }

    const updateObject = {
        ...myObject,
        gender: 'male',
        height: 170,
        name: 'Tommy'
    }

    console.log(updateObject)

    

    return <Table />
    
    





}

export default TestComponent