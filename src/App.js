import React,{useRef, useState} from 'react';
import './App.css';
import './w3.css';
import './Mt.css';
import Home from './components/home';
import SignIn from './components/signin'
import SignUp from './components/signup'
import {Route,Redirect, BrowserRouter as Router, Switch, Link} from 'react-router-dom';
import PrivateRoute from './components/router';
import fire from './firebase/firebase';
import { AuthProvider } from './components/authentication';
import CreatePipeline from './components/createPipeline';

class App extends React.Component {

  render(){
  return (
    <AuthProvider>
      <div>
        <PrivateRoute exact path="/" component={Home}/>
        <Route exact path="/signin" component = {SignIn}/>
        <Route exact path="/signup" component = {SignUp}/>
        {/* <Switch>
        <Route exact path="/">
        {this.state.user ? (<Home/>) : (<SignIn/>)}
        </Route>
        <CustomRouter exact path="/signup" component={SignUp} {...this.state}/> 
        </Switch>    */}
      </div>
    </AuthProvider>
  );
  }
}
export default App;
