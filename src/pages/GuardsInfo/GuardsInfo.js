import React from 'react'
import HomeAppBar from '../../components/UI/HomeAppBar/HomeAppBar'
import GuardCard from '../../components/UI/GuardCard/GuardCard'
import Grid from '@material-ui/core/Grid'
import { Container } from '@material-ui/core'

const GuardsInfo = props => {

    const guardsList = [
        {
            name: 'Knight',
            hp: 200,
            dmg: 60,
            step: 1,
            range: 1,
            tips:'Stick to the guard you want to protect to tank the damage or give a shell',
            description:'Give one of your guards a shell that can deny an attack'
        },
        {
            name: 'Archer',
            hp: 130,
            dmg: 60,
            step: 1,
            range: 2,
            tips:'Take 2 range advantage to attack enemy',
            description:'Shot a strong arrow which damage is 1.5 times of your damage'
        },
        {
            name: 'Wizard',
            hp: 110,
            dmg: 70,
            step: 1,
            range: 2,
            tips:'Take 2 range advantage to attack enemy',
            description:'Throw a fire ball that damage every guards (includes target) around the target (half damge for arounding guards)'
        },
        {
            name: 'King',
            hp: 160,
            dmg: 30,
            step: 1,
            range: 1,
            tips:'When the king died, all your guards on the board will lose 2/3 damage and hp. Do your best to protect the king',
            description:'This is a [ passive ability ] , increase 10 damage for every guards(only yours) on the board at your round'
        },
        {
            name: 'Assassin',
            hp: 160,
            dmg: 80,
            step: 1,
            range: 1,
            tips:'Use the ability to assassinate king or angel',
            description:'Move to any position on the board(once moved, the game will not switch turn)'
        },
        {
            name: 'Angel',
            hp: 110,
            dmg: 20,
            step: 1,
            range: 1,
            tips:'Angel cannot heal herself, try to keep her away from enemies',
            description:'This is a [ passive ability ] , heal 30 hp for every guards(only yours) on the board at your round'
        }
    ]
    const guardsRender = guardsList.map( g => 
        <Grid key={g.name} item xs={4}>
            <GuardCard 
                name={g.name} 
                hp={g.hp} 
                dmg={g.dmg} 
                range={g.range} 
                step={g.step}
                tips={g.tips}
                description={g.description}
                />
        </Grid>)
    return (
        <React.Fragment>
            <HomeAppBar currentPage='guardsInfo'/>
            <Container>
                <Grid container justify='center' spacing={6}>
                    {guardsRender}    
                </Grid>
            </Container>
        </React.Fragment>
    )
}

export default GuardsInfo