import React from 'react'
import Guard from '../Guard/Guard'

const guardBoard = (props) => {


    //console.log('[guardBoard] : ',props.guardsList)    

    const renderGuards = props.guardsList.map( 
        g => {
            const render = 
            g.placed ?
            <Guard
                id={g.id}
                key={g.name}
                clicked={props.clicked} 
                pos={g.pos}
                name={g.name} 
                disabled={g.disabled}
                actived={g.actived}/> 
            :<Guard
                id={g.id}
                key={g.name}
                clicked={props.clicked} 
                pos={g.pos}
                name={g.name} 
                disabled={g.disabled}
                actived={g.actived}/>
            
                return render
            
        })
    
    return (renderGuards)

}



export default guardBoard