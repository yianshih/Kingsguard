import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup, signInWithGoogle, signInWithGitHub } from "../../helpers/auth";
import styles from './Signup.module.css'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'

export default class SignUp extends Component {

  constructor() {
    super();
    this.state = {
      error: null,
      email: '',
      password: '',
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
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    this.setState({ error: '' })
    try {
      this.setState({ loading: true });
      await signup(this.state.email, this.state.password);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ 
        loading: false,
        error: error.message 
      })
    }
  }

  async googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async githubSignIn() {
    try {
      await signInWithGitHub();
    } catch (error) {
      console.log(error)
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
        <form className="mt-5 py-5 px-5" onSubmit={this.handleSubmit}>
          <h1>
            Sign Up to Kingsguard
          </h1>
          <div className="form-group">
            <input style={inputStyle} placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div className="form-group">
            <input style={inputStyle} placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
          </div>
          <div className="form-group">
            {this.state.loading ? <Spinner /> : this.state.error ? <p style={{color:'red'}}className="text-danger">{this.state.error}</p> : null}
            <Button styled={{marginTop:'20px'}} btnType="Info" clicked={this.handleSubmit}>Sign Up</Button>
          </div>
          <hr style={{marginTop:'60px'}}></hr>
          <div className={styles.GoogleLogin} onClick={this.googleSignIn}>
            <img  alt="" style={{margin:'5px'}} src={require(`../../assets/images/google_logo.png`)}></img>
            <h4>Sign in with Google</h4>
          </div>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
    )
  }
}
