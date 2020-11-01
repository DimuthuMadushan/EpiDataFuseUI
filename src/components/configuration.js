import React from 'react';
import SchemaConfig from './schemaConfig';
import IngestConfig from './ingestConfig';
import GranularityConfig from './granuralityConfig';
import GranularityMappingConfig from './granularityMappingConfig';
import HBaseConfig from './hBaseConfig';
import SourceConnector from './sourceConnector';
import {Route, BrowserRouter as Router, Switch, Link} from 'react-router-dom';


class Configuration extends React.Component {
    state = {}
    handleChange = (e) => { }
    handleSubmit = (e) => {
        e.preventDefault()
    }

    render() {
        
        return(
            <Router>
            <div>
            <div className="w3-container w3-white w3-cell">
            <div className="w3-card">
            <div className="w3-card-4">
                <img src="config-log.jpg" alt="Alps" style={{width:"100%"}}/>
                <div className="w3-container w3-center">
                    <h6><Link to="/hBase">HBase Configurations</Link></h6>
                </div>
            </div>
            <Route path="/hBase">
              <HBaseConfig/>
            </Route>         
          </div>
      </div>
      <div className="w3-container w3-white w3-cell">
      <div className="w3-card" >
            <div className="w3-card-4">
                <img src="config-log.jpg" alt="Alps" style={{width:"100%"}}/>
                <div className="w3-container w3-center">
                    <h6><Link to="/schema">Schema Configurations</Link></h6>
                </div>
            </div>
            <Route path="/schema">
              <SchemaConfig/>
            </Route>         
          </div>
      </div>
        
        {/* <div className="w3-container w3-white w3-cell">
            <div className="w3-card-4" >
                <img src="config-log.jpg" alt="Alps" style={{width:"100%"}}/>
                <div className="w3-container w3-center">
                <h6><Link to="/ingest">Ingest Configurations</Link></h6>
            </div>
            <Route path="/ingest">
              <IngestConfig/>
            </Route>
            </div>
            </div> */}
        {/* <div className="w3-container w3-white w3-cell">
            <div className="w3-card-4" >
                <img src="config-log.jpg" alt="Alps" style={{width:"100%"}}/>
                <div className="w3-container w3-center">
                <h6><Link to="/sourceConnector">SourceConnector</Link></h6>
            </div>
            <Route path="/sourceConnector">
              <SourceConnector/>
            </Route>
            </div>
          </div> */}
        <div className="w3-container w3-white w3-cell">
          <div className="w3-card-4" >
                <img src="config-log.jpg" alt="Alps" style={{width:"100%"}}/>
                <div className="w3-container w3-center">
                <h6><Link to="/granularity">Granularity Configurations</Link></h6>
                </div>
                <Route path="/granularity">
                  <GranularityConfig/>
                </Route>
            </div>
            </div>
          <div className="w3-container w3-white w3-cell">
            <div className="w3-card-4" >
                <img src="config-log.jpg" alt="Alps" style={{width:"100%"}}/>
                <div className="w3-container w3-center">
                <h6><Link to="/mapping">Granularity Mappings</Link></h6>
                </div>
                <Route path="/mapping">
                  <GranularityMappingConfig/>
                </Route>
            </div>
            </div>
            </div>
            </Router>
        )
    }
}

export default Configuration;