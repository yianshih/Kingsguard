import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const Strengthening = _ => {
    return (
        <React.Fragment>
            <Container>
                <Divider />
                <div style={{margin:'20px',textAlign:'center'}}>
                    <Typography variant="h6" gutterBottom>
                        In this Stage, you have 5 points to strengthen your guards, once 5 points have been completed, click the FINISH button to continue
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        (Increase 20 hp or 10 dmg each point)
                    </Typography>
                    <Paper elevation={5}>
                        <img alt="" src={require(`../../assets/images/instruction/strengthening.png`)}></img>
                    </Paper>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default Strengthening