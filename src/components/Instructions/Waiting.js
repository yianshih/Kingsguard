import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'

const Waiting = props => {

    return (
        <React.Fragment>
            <Container>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        The game requires two players, waiting for another player to start the game
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/waiting_1.png`)}></img>
                    </Paper>
                </div>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="subtitle1" gutterBottom>
                        (For another player, join the game by clicking [Join Game] button or the JOIN button on the game list below)
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/waiting_2.png`)}></img>
                    </Paper>
                </div>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        Once the second player joined, the game creater may start the game
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/waiting_3.png`)}></img>
                    </Paper>
                </div>
            </Container>
            {/* <ScrollTop {...props}>
                <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop> */}
        </React.Fragment>
        
    )
}

export default Waiting