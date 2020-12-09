import React from 'react';
import './App.css';
import './w3.css';
import './Mt.css';
import Home from './components/home/home';
import SignIn from './components/auth/signin'
import SignUp from './components/auth/signup'
import { Route, BrowserRouter as Router, Link } from 'react-router-dom';
import PrivateRoute from './components/route/router';
import { AuthProvider } from './components/auth/authentication';


class App extends React.Component {

  render() {
    return (
      <AuthProvider>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </AuthProvider>
    );
  }
}
export default App;
