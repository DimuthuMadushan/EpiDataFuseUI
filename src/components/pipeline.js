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


class Pipeline extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        return(
            <div>
                <Router>
                    <Link to="/addGranular"><button className="w3-btn w3-white w3-border w3-border-green w3-round-large" >Add New Granularity</button></Link>
                    <Link to="/addFeature"><button className="w3-btn w3-white w3-border w3-border-green w3-round-large">Add New Feature</button></Link>
                    <Link to="/addSource"><button className="w3-btn w3-white w3-border w3-border-green w3-round-large">Add New Sources</button></Link>
                    <Link to="/addGranConfig"> <button className="w3-btn w3-white w3-border w3-border-green w3-round-large">Add Granularity Config</button></Link>
                    <Link to="/addAggreConfig"><button className="w3-btn w3-white w3-border w3-border-green w3-round-large">Add Granularity Mapping Config</button></Link>
                <Switch>
                    <Route exact path="/addGranular"><SchemaConfig/></Route>
                    <Route exact path="/addFeature"><IngestConfig/></Route>
                    <Route exact path="/addSource"><SourceConnector/></Route>
                    <Route exact path="/addGranConfig"><GranularityConfig/></Route>
                    <Route exact path="/addAggreConfig"><GranularityMappingConfig/></Route>
                </Switch>
                <br/><br/>
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
                </Router>
            </div>
            
        )
    }
}

export default Pipeline;