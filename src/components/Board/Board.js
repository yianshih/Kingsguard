import React from 'react'
//import { useSelector } from 'react-redux'
import Square from './Square/Square'
import Guard from '../Guard/Guard'

const Board = props => {

    // const guards = useSelector(state => state.guards)
    // const squares = useSelector(state => state.squares)
    const guards = props.renderGuards
    const squares = props.renderSquares
    //console.log('Board rendering')
    //console.log('Board guards : ',guards)
    //console.log('Board squares : ',squares)
    const renderSquares = squares.map(
        s => {
            const temp = 
            s.unit !== 'unknown' 
            ? guards[s.unit-1].hp > 0
                ?<Guard
                    id={s.unit}
                    key={s.unit}
                    clicked={() => props.gclicked(s.unit)} 
                    side={guards[s.unit - 1].side}
                    pos={guards[s.unit - 1].pos}
                    name={guards[s.unit - 1].name} 
                    disabled={guards[s.unit - 1].disabled}
                    actived={guards[s.unit - 1].actived}/>
                :<Square
                    clicked={() => props.clicked(s.pos)} 
                    key={s.pos}
                    pos={s.pos} 
                    unit={s.unit}
                    disabled={s.disabled}
                    actived={s.actived}
                />
            : <Square
                clicked={() => props.clicked(s.pos)} 
                key={s.pos}
                pos={s.pos} 
                unit={s.unit}
                disabled={s.disabled}
                actived={s.actived}
            />
            return temp
        }
    )
    return renderSquares
}

export default Board