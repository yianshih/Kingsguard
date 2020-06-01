import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const Fighting = _ => {
    return (
        <React.Fragment>
            <Container>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        Click your guards on the board to attack or move
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/fighting_1.png`)}></img>
                    </Paper>
                </div>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="subtitle1" gutterBottom>
                        (Click opponent's guards to attack or squares to move)
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/fighting_2.png`)}></img>
                    </Paper>
                </div>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        Click your guards below the board to switch guards
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        (Note: once switched, game will switch the turn)
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/fighting_3.png`)}></img>
                    </Paper>
                </div>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        Click icon next to the dmg on right/left side to launch the ability
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        (Note: Each ability can only be launched one time)
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/fighting_4.png`)}></img>
                    </Paper>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default Fighting