import React, { Component } from "react"
import { Link } from "react-router-dom"
import { signin, signInWithGoogle, signInWithGitHub } from "../../helpers/auth"
import styles from './Login.module.css'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      email: "",
      password: "",
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.githubSignIn = this.githubSignIn.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });
    try {
      this.setState({ loading: true });
      await signin(this.state.email, this.state.password);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ 
        loading: false,
        error: error.message 
      });
    }
  }

  async googleSignIn() {
    try {
      await signInWithGoogle()
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async githubSignIn() {
    try {
      await signInWithGitHub();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const inputStyle = {
      fontSize:'15px',
      width:'200px',
      height:'30px',
    }
    return (
      <div className={styles.Layout}>
        <div className={styles.Form}>
          <form
            className="mt-5 py-5 px-5"
            autoComplete="off"
            onSubmit={this.handleSubmit}
          >
            <h1>
              Login to Kingsguard
            </h1>
            {/* <p className="lead">
              Fill in the form below to login to your account.
            </p> */}
            <div className="form-group">
              <input
                style={inputStyle}
                className="form-control"
                placeholder="Email"
                name="email"
                type="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
            </div>
            <div className="form-group">
              <input
                style={inputStyle}
                className="form-control"
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
                type="password"
              />
            </div>
            <div className="form-group">
              {this.state.loading ? <Spinner /> : this.state.error ? (
                <p style={{color:'red'}}className="text-danger">{this.state.error}</p>
              ) : null}
              <Button styled={{marginTop:'20px'}} btnType="Info" clicked={this.handleSubmit}>Login</Button>
              {/* <button className="btn btn-primary px-5" type="submit">Login</button> */}
            </div>
            <hr style={{marginTop:'60px'}}></hr>
            <div className={styles.GoogleLogin} onClick={this.googleSignIn}>
                <img alt="" style={{margin:'5px'}} src={require(`../../assets/images/google_logo.png`)}></img>
                <h4>Sign in with Google</h4>
            </div>
            {/* <button className="btn btn-danger mr-2" type="button" onClick={this.googleSignIn}>
              Sign in with Google
            </button>
            <button className="btn btn-secondary" type="button" onClick={this.githubSignIn}>
              Sign in with GitHub
            </button> */}
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    )
  }
}
