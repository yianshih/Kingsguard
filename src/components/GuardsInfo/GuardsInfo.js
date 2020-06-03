import React from 'react'
import styles from './GuardsInfo.module.css'
import { useSelector } from 'react-redux'
import Bar from '../UI/Bar/Bar'
import GpsFixedRoundedIcon from '@material-ui/icons/GpsFixedRounded'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
const GuardsInfo = React.memo(props => {

    const game = useSelector(state => state.game)

    const renderGuard = (id,side,name,fullHp,hp,dmg,ability,isPlaced) => (
        <div className={[styles.Guard].join(' ')} key={id}>
            <img alt="" className={[styles.UnitImg, styles[side]].join(' ')} src={require(`../../assets/images/icon/${name}.png`)}></img>
            {/* <div style={{margin:'5px'}}>{name}</div> */}
            <div className={styles.Hp}>
                <img style={{marginRight:'10px'}} alt="" src={require(`../../assets/images/icon/hp.png`)}></img>
                <Bar fullValue={fullHp} currentValue={hp}/>
            </div>
            <div className={styles.Attack}>
                <img alt="" src={require(`../../assets/images/icon/attack.png`)}></img>
                <strong>{dmg}</strong>
                {(ability !== 'none' && isPlaced)
                ? game.gameInfo.currentState.split("_")[0] === 'fighting'
                    ?side === props.userSide 
                        ? ability === false
                            ?<IconButton disabled={ability} color="primary" onClick={() => props.abilityHandler(name,id)}>
                                <img alt="" src={require(`../../assets/images/Ability/${name}Ability.png`)}></img>
                            </IconButton>
                            :<IconButton disabled={ability} color="primary" onClick={() => props.abilityHandler(name,id)}>
                                <img style={{opacity:'0.3'}} alt="" src={require(`../../assets/images/Ability/${name}Ability.png`)}></img>
                            </IconButton>
                        : ability === false
                            ?<IconButton disabled={ability} color="primary" onClick={null}>
                                <img alt="" src={require(`../../assets/images/Ability/${name}Ability.png`)}></img>
                            </IconButton>
                            :<IconButton disabled={ability} color="primary" onClick={null}>
                            <img style={{opacity:'0.3'}} alt="" src={require(`../../assets/images/Ability/${name}Ability.png`)}></img>
                        </IconButton>
                    :null
                : null}

                {/* {ability !== 'none'
                ? game.gameInfo.currentState.split("_")[0] === 'fighting'
                    ?side === props.userSide 
                        ?<div className={styles.Ability}>
                            <IconButton disabled={ability} color="primary" onClick={() => props.abilityHandler(name,id)}>
                                <GpsFixedRoundedIcon />
                            </IconButton>
                        </div>
                        :null
                    :null
                : null} */}
            </div>
            {/* {ability !== 'none'
            ? game.gameInfo.currentState.split("_")[0] === 'fighting'
                ?side === props.userSide 
                    ?<div className={styles.Ability}>
                        <p>Ability</p>
                        <IconButton disabled={ability} color="primary" onClick={() => props.abilityHandler(name,id)}>
                            <GpsFixedRoundedIcon />
                        </IconButton>
                    </div>
                    :null
                :null
            : null} */}
            
        </div>
    )
    const render = game.gameInfo.guards.map( g => {
        if (game.gameInfo.currentState.split("_")[0] === 'placing' && g.side === props.side) {
            return renderGuard(g.id, g.side, g.name,g.fullHp, g.hp, g.dmg,g.ability,g.isPlaced)
        }
        else if (g.side === props.side && g.hp > 0) {
            // const imgURL = `../../assets/images/${g.name}.png`
            //console.log(`${g.name} Ability : ${g.ability}`)
            return renderGuard(g.id, g.side, g.name,g.fullHp, g.hp, g.dmg,g.ability,g.isPlaced)
        }
        else {
            return null
        }
    })

    return (render)
    
})

export default GuardsInfo
    