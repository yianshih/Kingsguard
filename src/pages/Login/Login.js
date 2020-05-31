import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { green } from '@material-ui/core/colors'
//import Fade from '@material-ui/core/Fade'
import Zoom from '@material-ui/core/Zoom'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { signin, signInWithGoogle } from "../../helpers/auth"
//import styles from './Login.module.css'

const Login = () => {

  const [emailInput,setEmailInput] = useState('')
  const [pwdInput,setPwdInput] = useState('')
  const [error, setError] = useState(null)
  const [success,setSuccess] = useState(false)

  const emailChangeHandler = (e) => {
    setEmailInput(e.target.value)
    setError(null)
  }

  const pwdChangeHandler = (e) => {
    setPwdInput(e.target.value)
    setError(null)
  }

  // const handleChange = (event) => {
  //   this.setState({
  //     [event.target.name]: event.target.value,
  //     error: null
  //   });
  // }

  const signinHandle = async () => {
    setError(null)
    try {
      setSuccess(true)
      await signin(emailInput, pwdInput);
    } catch (error) {
      setSuccess(false)
      setError(error.message)
    }
  }

  const googleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      setError(error.message)
      //this.setState({ error: error.message });
    }
  }
  
    // const inputStyle = {
    //   fontSize:'15px',
    //   width:'200px',
    //   height:'30px',
    // }

    const useStyles = makeStyles((theme) => ({
      paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
      },
      green: {
        color: '#fff',
        backgroundColor: green[500],
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
    }))

    const classes = useStyles()

    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
          {success ? <Zoom in={success}><Avatar className={classes.green}>
            <LockOpenOutlinedIcon />
          </Avatar></Zoom>
          :<Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>}
        
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            value={emailInput}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={emailChangeHandler}
          />
          <TextField
            value={pwdInput}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={pwdChangeHandler}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          {error ? 
          <Zoom in={error !== null} timeout={1500}> 
            <Typography component="h6" variant="h6" color="error">
            {error}
            </Typography>
          </Zoom>:null}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signinHandle}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            className={classes.submit}
            onClick={googleSignIn}
            
          >
            <img alt="" style={{margin:'5px'}} src={require(`../../assets/images/google_logo.png`)}></img>Sign in with Google
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/Signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    )
  
}

export default Login
