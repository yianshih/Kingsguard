import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const Waiting = props => {

    function ScrollTop(props) {
        const { children, window } = props;
        //const classes = useStyles();
        // Note that you normally won't need to set the window ref as useScrollTrigger
        // will default to window.
        // This is only being set here because the demo is in an iframe.
        const trigger = useScrollTrigger({
          target: window ? window() : undefined,
          disableHysteresis: true,
          threshold: 100,
        });
      
        const handleClick = (event) => {
          const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
      
          if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        };
      
        return (
          <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation">
              {children}
            </div>
          </Zoom>
        );
      }

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