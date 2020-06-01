import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const Placing = _ => {
    return (
        <React.Fragment>
            <Container>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        Click the guards below then click one of the squares to place
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        (Only 4 guards can be on the board at once)
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/placing_1.png`)}></img>
                    </Paper>
                </div>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        Once placed the guards, waiting for opponent to place
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/placing_2.png`)}></img>
                    </Paper>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default Placing