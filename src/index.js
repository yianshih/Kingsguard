import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import * as serviceWorker from './serviceWorker';
import squaresReducer from './store/reducers/squares'
import guardsReducer from './store/reducers/guards'
import gameReducer from './store/reducers/game'
import authReducer from './store/reducers/auth'
import thunk from 'redux-thunk'

//const composeEnhancers = process.env.NODE_ENV === ('development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) || compose
//const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose
const composeEnhancers = process.env.NODE_ENV === 'development' ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose
const rootReducer = combineReducers({
    squares: squaresReducer,
    guards: guardsReducer,
    game: gameReducer,
    auth: authReducer
})

export const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
))

const app = (
  <Provider store={store}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </Provider>
)
ReactDOM.render(
  app,
  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
