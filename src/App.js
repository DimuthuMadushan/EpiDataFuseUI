import React,{useRef, useState} from 'react';
import './App.css';
import './w3.css';
import Configuration from './components/configuration'
import Query from './components/query';
import SourceConnector from './components/sourceConnector';
import {Route, BrowserRouter as Router, Switch, Link} from 'react-router-dom';
import IngestConfig from './components/ingestConfig';
import Start from './components/start';

function App() {
  return (
    <Router>
      
      <div className="App">
      <div className="w3-container w3-blue ">
        <h1>EpiDataFuse</h1>
        <p>Spatio Temporal Data Fusion Engine for Machine Learning Platform</p>
      </div>
      <div className="w3-bar w3-teal">
            <button className="w3-bar-item w3-button" >Pipilines</button>
            <button className="w3-bar-item w3-button">Create Pipeline</button>
            <button className="w3-bar-item w3-button">Dashboard</button>
          </div>
          
      <header className="App-header">
        <div className="">
        <button className="w3-button w3-block w3-left-align"> 
          <h6><Link to="/configuration">Create Pipeline</Link></h6>
        </button>
       
        <Route path="/configuration">
              <Configuration/>
            </Route> 
        </div>
        <div>
        <button className="w3-button w3-block  w3-left-align"> 
        <h6><Link to="/initiate">Initiate Pipeline</Link></h6>
        </button>
        <Route path="/initiate">
              <Start/>
            </Route> 
        </div>
        <div>
        <button className="w3-button w3-block w3-left-align"> 
        <h6><Link to="/ingest">Ingest Data</Link></h6>
        </button>
        <Route path="/ingest">
          <div className="box w3-panel w3-border">
              <IngestConfig/>
              </div>
            </Route> 
        </div>
        <div>
        <button className="w3-button w3-block w3-left-align"> 
        <h6><Link to="/query">Query Data</Link></h6>
        </button>
        <Route path="/query">
          <div className="box w3-panel w3-border">
              <Query/>
              </div>
            </Route> 
        </div>
        <div>
        <button className="w3-button w3-block w3-left-align"> 
        <h6><Link to="/sourceConnector">Connect to External Data Sources</Link></h6>
        </button>
        <Route path="/sourceConnector">
          <div className="box w3-panel w3-border">
              <SourceConnector/>
              </div>
            </Route> 
        </div>
      </header>
      </div>
    </Router>
  );
}

export default App;
