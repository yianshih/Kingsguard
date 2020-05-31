import React, { useEffect, useState } from 'react'
import Login from './pages/Login/Login'
import SignUp from './pages/Signup/Signup'
import Home from './pages/Home/Home'
import Instruction from './pages/Instruction/Instruction'
import GameController from './containers/GameController/GameController'
import GuardsInfo from './pages/GuardsInfo/GuardsInfo'
import { auth } from "./services/firebase";
import { Route, Switch } from 'react-router-dom'
import TestComponent from './components/TestComponent'
const App = props => {
  //const isAuthenticated = useSelector(state => state.auth.token !== null);
  //const dispatch = useDispatch()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect( () => {
    //dispatch(actions.authCheckState())
    auth().onAuthStateChanged( user => {
      if (user) {
        setAuthenticated(true)
        setLoading(false)
      }
      else {
        setAuthenticated(false)
        setLoading(false)
      }
    })

  })
  
  const routers = 
  loading ? null
  :authenticated ?
  (
    <Switch>
      <Route path="/Home" component={Home} />
      <Route path="/instruction" component={Instruction} />
      <Route path="/guardsInfo" component={GuardsInfo} />
      <Route path="/game" component={GameController} />
      <Route path="/Test" component={TestComponent} />
      <Route path="/" component={Home} />
      {/* <Route path="/Board" component={BoardControl} /> */}
      {/* <Route path="/chats" component={Chat} /> */}
      {/* <Route path="/auth" component={Auth} /> */}
    </Switch>
  )
  : (
    <Switch>
      <Route path="/Login" component={Login} />
      <Route path="/Signup" component={SignUp} />
      <Route path="/" component={Login} />
    </Switch>
  )

  return (
    <React.Fragment>
      {routers}
    </React.Fragment>
  )
}

export default App