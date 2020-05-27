import React from 'react'

import Wavy from './UI/Wavy/Wavy'
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

    

    return <div style={{margin:'300px'}}><Wavy>Loading...</Wavy></div>
    
    





}

export default TestComponent