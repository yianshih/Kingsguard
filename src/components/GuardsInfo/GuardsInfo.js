import React from 'react'
//import { useSelector } from 'react-redux';
import styles from './GuardsInfo.module.css'
import { useSelector } from 'react-redux'
import Bar from '../UI/Bar/Bar'
import Button from '../UI/Button/Button'

const GuardsInfo = React.memo(props => {

    const game = useSelector(state => state.game)
    
    const renderGuard = (id,side,name,fullHp,hp,dmg,ability) => (
        <div className={[styles.Guard].join(' ')} key={id}>
            <img alt="" className={[styles.UnitImg, styles[side]].join(' ')} src={require(`../../assets/images/icon/${name}.png`)}></img>
            {/* <div style={{margin:'5px'}}>{name}</div> */}
            <div className={styles.Hp}>
                <img alt="" src={require(`../../assets/images/icon/hp.png`)}></img>
                <Bar fullValue={fullHp} currentValue={hp}/>
            </div>
            <div className={styles.Attack}>
                <img alt="" src={require(`../../assets/images/icon/attack.png`)}></img>
                <strong>{dmg}</strong>
            </div>
            {ability !== 'none'
            ? game.gameInfo.currentState.split("_")[0] === 'fighting'
                ?side === props.userSide 
                    ?<div className={styles.Ability}>
                        <p>Ability</p>
                        <Button btnType="Success" disabled={ability} clicked={() => props.abilityHandler(name,id)}>Ability</Button>
                    </div>
                    :null
                :null
            : null}
            
        </div>
    )
    const render = game.gameInfo.guards.map( g => {
        if (game.gameInfo.currentState.split("_")[0] === 'placing' && g.side === props.side) {
            return renderGuard(g.id, g.side, g.name,g.fullHp, g.hp, g.dmg,g.ability)
        }
        else if (g.side === props.side && g.hp > 0) {
            // const imgURL = `../../assets/images/${g.name}.png`
            //console.log(`${g.name} Ability : ${g.ability}`)
            return renderGuard(g.id, g.side, g.name,g.fullHp, g.hp, g.dmg,g.ability)
        }
        else {
            return null
        }
    })

    return (render)
    
})

export default GuardsInfo
    