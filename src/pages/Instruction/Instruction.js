import React from 'react'
import HomeAppBar from '../../components/UI/HomeAppBar/HomeAppBar'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import { Grid } from '@material-ui/core'
import Waiting from '../../components/Instructions/Waiting'
import Strengthening from '../../components/Instructions/Strengthening'
import Placing from '../../components/Instructions/Placing'
import Fighting from '../../components/Instructions/Fighting'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Waiting Opponent', 'Strengthening Guards', 'Placing Guards','Fighting'];
}

function getInstructionContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return <Waiting />
        case 1:
            return <Strengthening />
        case 2:
            return <Placing />
        case 3:
            return <Fighting />
        default:
            return 'Unknown stepIndex';
  }
}


const Instruction = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <React.Fragment>
            <HomeAppBar currentPage='instruction'/>
            <div className={classes.root}>
                <Stepper style={{backgroundColor: '#fafafa'}} activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
                <Container>
                    <Grid container justify='center' spacing={3}>
                        {/* <Typography align="center" className={classes.instructions}>{getStepContent(activeStep)}</Typography> */}
                        <Grid item xs={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.backButton}
                                color="primary"
                            >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                fullWidth
                                disabled={activeStep === steps.length - 1} 
                                variant="outlined" color="primary" 
                                onClick={handleNext}>
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container justify='center' spacing={3}>
                        <Grid item xs={12}>
                            {getInstructionContent(activeStep)}
                        </Grid>
                    
                    </Grid>
                    
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Instruction
