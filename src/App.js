import React,{useRef, useState} from 'react';
import './App.css';
import './w3.css';
import './Mt.css';
import Home from './components/home'
import SignIn from './components/signin'
import SignUp from './components/signup'
import {Route,Redirect, BrowserRouter as Router, Switch, Link} from 'react-router-dom';
import CustomRouter from './components/router';
import fire from './firebase/firebase';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
    }

    this.authListenr = this.authListener.bind(this);
  }

  componentDidMount(){
    console.log(this.state.user)
    this.authListener();
  }

  authListener(){
    fire.auth().onAuthStateChanged((user)=>{
      if(user){
        this.setState({ user });
      } else {
        this.setState({user:null});
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
}
  render(){
  return (
    <div>
      <Switch>
      <Route exact path="/">
      {this.state.user ? (<Home/>) : (<SignIn/>)}
      </Route>
      <CustomRouter exact path="/signup" component={SignUp} {...this.state}/> 
      </Switch>   
    </div>
  );
  }
}
export default App;
