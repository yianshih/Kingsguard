import React, { useState}from 'react'
//import { useSelector } from 'react-redux'
//import { useDispatch } from 'react-redux'
//import { useDispatch } from 'react-redux'
import styles from './GuardsStrengthen.module.css'
import GuardStrengthen from './GuardStrengthen/GuardStrengthen'
//import Button from '../UI/Button/Button'
import Button from '@material-ui/core/Button'
//import * as actions from '../../store/actions/index'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'
import { makeStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core'


const GuardsStrengthen = props => {
    
    //const dispatch = useDispatch()
    const [ points, setPoints ] = useState(5)
    //const guards = useSelector(state => state.guards)
    const copyGuards = props.guards
    //const copyGuards = [...guards]
    //console.log("copyGuards : ",copyGuards)
    const sideGuards = copyGuards.filter( g => g.side === props.side)
    const useStyles = makeStyles((theme) => ({
        root: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        },
        gridList: {
          width: 'auto',
          height: 'auto',
        },
        icon: {
          color: 'rgba(255, 255, 255, 0.54)',
        },
      }))
    const classes = useStyles();
    const guardClicked = (id,type,method) => {
        switch(method) {
            case 'add':
                if (type === 'hp'){
                    copyGuards[id - 1].fullHp = copyGuards[id - 1].fullHp + 20
                    copyGuards[id - 1].hp = copyGuards[id - 1].hp + 20
                    return 
                }
                else {
                    return copyGuards[id - 1].dmg = copyGuards[id - 1].dmg + 10
                }
            case 'deduct':
                if (type === 'hp'){
                    copyGuards[id - 1].fullHp = copyGuards[id - 1].fullHp - 20
                    copyGuards[id - 1].hp = copyGuards[id - 1].hp - 20
                    return
                }
                else {
                    return copyGuards[id - 1].dmg = copyGuards[id - 1].dmg - 10
                }
            default:
                console.log("Error")
        }
    }

    const finishedHandler = () => {
        //dispatch(actions.setGuardsUpdate(copyGuards))
        props.setGuardsStrengthen(copyGuards)
        props.finished()
    }

    const renderGuards = sideGuards.map( g => (
        <GridListTile key={g.id}>
            <GuardStrengthen
                key={g.id}
                id={g.id}
                name={g.name}
                hp={g.hp}
                dmg={g.dmg}
                side={props.side}
                points={points}
                addClicked={() => setPoints(points - 1)}
                deductClicked={ () => setPoints(points + 1)}
                guardClicked={guardClicked}
            />
        </GridListTile>
    ))
    const renderBoard = (
        <Container>
            <GridList cols={2} cellHeight='auto' className={classes.gridList}>
                <GridListTile key="Subheader" cols={2}>
                    <ListSubheader component="div">{`You have ${points} points left`}</ListSubheader>
                </GridListTile>
                {renderGuards}
            </GridList>
            {/* <div className={styles.Board}>
                <p>{`You have ${points} points left`}</p>
                <div className={[styles.Guards, styles[props.side]].join(' ')}>
                    {renderGuards}
                </div>
            </div> */}
            {/* props.finished(copyGuards) */}
            <div style={{
                width:"100%",
                margin: "auto",
                alignItems: "center",
                textAlign: "center"
            }}>
                <Button
                    variant="contained"
                    color="secondary" 
                    disabled={points !== 0} 
                    onClick={finishedHandler}>Finish
                </Button>
            </div>
            
        </Container>
    )
    return (renderBoard)
}

export default GuardsStrengthen
