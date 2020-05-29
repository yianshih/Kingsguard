import React from 'react'

import Wavy from './UI/Wavy/Wavy'
import AttackEffect from './UI/AttackEffect/AttackEffect'
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

    

    return <div style={{
                width:'50px',
                height:'50px'
            }}><AttackEffect>123</AttackEffect></div>
    
    





}

export default TestComponent