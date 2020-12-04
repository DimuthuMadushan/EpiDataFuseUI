import React from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import PrivateRoute from '../route/router';
import Schema from "../configuration/single/schema";
import Ingest from "../configuration/single/ingest";
import Granularity from "../configuration/single/granularity";
import BulkIngest from "../configuration/single/bulkIngest";
import SourceConnector from "../configuration/single/sourceConnector";
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

class Pipeline extends React.Component {

    constructor() {
        super();
        this.state = {
            features: []
        }
    }

    retriveData = (id) => {
        var data = {
            pipeline_names: [id]
        }
        axios.post('http://localhost:8080/getPipelineInfo', data)
            .then(function (response) {
                if (response.data.success) {
                    return response.data.data[id];
                }
                else {
                    return null;
                }
            }).then(featureData => {
                console.log(featureData)
                var featurelist = []
                var features = featureData['features']
                var granularityConfigs = featureData['granularityConfigs']
                Object.keys(features).forEach(function (key, index) {
                    let obj = {
                        'featureName': key,
                        'attributes': features[key],
                        'spatialGranularity': granularityConfigs[key]['spatialGranularity'],
                        'temporalGranularity': granularityConfigs[key]['temporalGranularity'],
                        'targetSpatialGranularity': granularityConfigs[key]['targetSpatialGranularity'],
                        'targetTemporalGranularity': granularityConfigs[key]['targetTemporalGranularity'],
                        'spatialMappingMethod': granularityConfigs[key]['spatialMappingMethod'],
                        'temporalMappingMethod': granularityConfigs[key]['temporalMappingMethod'],
                        'conversionFrequency': '24hrs',
                        'externalSource': 'http://localhost/3000/weatherdata'

                    }
                    featurelist.push(obj)
                })
                this.setState(prevState => ({ features: featurelist }))
                console.log(this.state)
            })
    }

    componentDidMount() {
        var id = this.props.location.state.pipelineId
        //this.retriveData(id)

    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    handleChange = (event) => {
        this.setState({ age: event.target.value })
    }

    render() {
        let { features } = this.state
        let featureList = features.length > 0
            && features.map((val, i) => {
                return (
                    <option key={i} value={val.pipelineName}>{val.pipelineName}</option>
                )
            }, this);
        let featureInfoList = features.length > 0 &&
            features.map((feature, i) => {
                console.log(feature)
                return (
                    <tr key={i} >
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['featureName']}</Typography></td>
                        <td>
                            <ul style={{ "listStyleType": "none", marginLeft: 0 }}>
                                {feature['attributes'].map(function (d, idx) {
                                    return (
                                        <li key={idx}>
                                            <Typography style={{
                                                fontSize: 10,
                                                fontFamily: 'Courier New',
                                                color: 'grey',
                                                fontWeight: 'bolder'
                                            }}>
                                                {d['attribute_name'] + ":" + d['attribute_type']}
                                            </Typography>
                                        </li>
                                    )
                                })}
                            </ul>
                        </td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['spatialGranularity']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['temporalGranularity']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['targetSpatialGranularity']}</Typography></td>

                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['targetTemporalGranularity']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['spatialMappingMethod']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['temporalMappingMethod']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['conversionFrequency']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['externalSource']}</Typography></td>
                    </tr>
                )
            }, this);

        return (
            <div>
                <table className="w3-table-all w3-col-50">
                    <thead>
                        <tr>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Feature Name</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Attributes</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Spatial granularity</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Temporal granularity</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Target spatial granularity</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Target temporal granularity</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Spatial conversion</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Temporal conversion</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Conversion job frequency</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>External source confguration</Typography></th>
                        </tr>
                    </thead>
                    <tbody>
                        {featureInfoList}
                    </tbody>
                </table>
                <div style={{ marginTop: 20 }} className="w3-container w3-center">
                    <Router>
                        <Link to="/addGranular"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round" >
                            <Typography style={{
                                fontSize: 12,
                                fontFamily: 'Courier New',
                                color: 'white',
                                fontWeight: 'bolder'
                            }}>Add New Granularity</Typography></button></Link>
                        <Link to="/addFeature"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"> <Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Add New Feature</Typography></button></Link>
                        <Link to="/addSource"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Add New Source</Typography></button></Link>
                        <Link to="/addGranConfig"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Add New Granularity</Typography></button></Link>

                        <Link to="/addAggreConfig"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border w3-round"> <Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Bulk ingest</Typography></button></Link>
                        <Switch>
                            <PrivateRoute exact path="/addGranular"><Schema /></PrivateRoute>
                            <PrivateRoute exact path="/addFeature"><Ingest /></PrivateRoute>
                            <PrivateRoute exact path="/addSource"><SourceConnector /></PrivateRoute>
                            <PrivateRoute exact path="/addGranConfig"><Granularity /></PrivateRoute>
                            <PrivateRoute exact path="/addAggreConfig"><BulkIngest /></PrivateRoute>
                        </Switch>
                    </Router>
                </div>
            </div>
        )
    }
}

export default Pipeline;