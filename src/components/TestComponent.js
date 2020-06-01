import React from 'react'
import HomeAppBar from './UI/HomeAppBar/HomeAppBar'
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

    

    return <HomeAppBar />
    
    





}

export default TestComponent