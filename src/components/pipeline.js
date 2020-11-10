import React from 'react';
import axios from 'axios';
import {Route,Redirect, BrowserRouter as Router, Switch, Link} from 'react-router-dom';
import GranularityConfig from './granuralityConfig'
import GranularityMappingConfig from './granularityMappingConfig'
import SchemaConfig from './schemaConfig'
import Query from './query';
import SourceConnector from './sourceConnector';
import IngestConfig from './ingestConfig';
import Start from './start';
import { Divider } from '@material-ui/core';
import CreatePipeline from './createPipeline';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PipelineDataService from '../firebase/pipelineDataService';
import firebase from "../firebase/firebase";
import PrivateRoute from './router';

class Pipeline extends React.Component {
    
    constructor(){
        super();
        this.state={
            age:"",
            pipelineNames:[]
        }
        this.retriveData()
    }

    retriveData = () =>{
        var uid = firebase.auth().currentUser.uid;
        firebase
        .database()
        .ref('users/'+uid+'/pipelines/')
        .on("value", snapshot => {
            if (snapshot && snapshot.exists()) {
                let pipelines = []
                snapshot.forEach((childSnapshot)=>{
                    pipelines.push(childSnapshot.val());
                  })
                this.setState({pipelineNames:pipelines})
            }})
        }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    handleChange = (event) => {
        this.setState({age:event.target.value})
    }

    componentDidMount(){
        this.retriveData()
    }
    
    
    render() {
        let {age, pipelineNames} = this.state
        let pipelineList = pipelineNames.length > 0
    	        && pipelineNames.map((val, i) => {
            return (
                <option key={i} value={val.pipelineName}>{val.pipelineName}</option>
            )
            }, this);

        return(
            
            <div>
                <table className="w3-table-all w3-col-50">
                <tr>
                    <th>Feature</th>
                    <th>Spatial</th>
                    <th>Temporal</th>
                    <th>Target Spatial</th>
                    <th>Target Temporal</th>
                    <th>Data Source</th>
                </tr>  
                <tr >
                    <td>val 1</td>
                    <td>val 1</td>
                    <td>val 1</td>
                    <td>val 1</td>
                    <td>val 1</td>
                    <td>val 1</td>
                </tr>
                </table>
                <div >
                    <h6>
                    <select class="w3-select w3-third" name="option">
                    <option value="" disabled selected>Select a Pipelines</option>
                        {pipelineList}
                    </select>
                    </h6>
                    <br/><br/>
                
                <br/><br/>
                <Router>
                    <Link to="/addGranular"><button className="w3-btn w3-white w3-border w3-border-green w3-round-large" >Add New Granularity</button></Link>
                    <Link to="/addFeature"><button className="w3-btn w3-white w3-border w3-border-green w3-round-large">Add New Feature</button></Link>
                    <Link to="/addSource"><button className="w3-btn w3-white w3-border w3-border-green w3-round-large">Add New Sources</button></Link>
                    <Link to="/addGranConfig"> <button className="w3-btn w3-white w3-border w3-border-green w3-round-large">Add Granularity Config</button></Link>
                    <Link to="/addAggreConfig"><button className="w3-btn w3-white w3-border w3-border-green w3-round-large">Add Granularity Mapping Config</button></Link>
                <Switch>
                    <PrivateRoute exact path="/addGranular"><SchemaConfig/></PrivateRoute>
                    <PrivateRoute exact path="/addFeature"><IngestConfig/></PrivateRoute>
                    <PrivateRoute exact path="/addSource"><SourceConnector/></PrivateRoute>
                    <PrivateRoute exact path="/addGranConfig"><GranularityConfig/></PrivateRoute>
                    <PrivateRoute exact path="/addAggreConfig"><GranularityMappingConfig/></PrivateRoute>
                </Switch>
                <br/><br/>
                
                </Router>
                </div>
            </div>
            
        )
    }
}

export default Pipeline;