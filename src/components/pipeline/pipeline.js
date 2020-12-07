import React from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import PrivateRoute from '../route/router';
import Schema from "../configuration/single/schema";
import Ingest from "../configuration/single/ingest";
import Granularity from "../configuration/single/addGranularity";
import BulkIngest from "../configuration/single/bulkIngest";
import SourceConnector from "../configuration/single/sourceConnector";
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import SpatialGranularity from '../map/SpatialGranularity';
import IngestToGranularity from "../configuration/single/ingestToGranularity";
import IngestToFeature from "../configuration/single/ingestToFeature";


class Pipeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipelineName: this.props.location.state.pipelineId,
            features: [],
            granularities: [],
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
                if (featureData != null) {
                    var featurelist = []
                    var granularitylist = []
                    var geodatalist = []
                    var features = featureData['features']
                    var granularityConfigs = featureData['granularityConfigs']
                    var granularities = featureData['granularities']
                    var granules = featureData['granules']
                    console.log(granules)
                    Object.keys(features).forEach(function (key, index) {
                        let obj = {
                            'featureName': key,
                            'attributes': features[key],
                            'spatialGranularity': granularityConfigs[key]['spatialGranularity'],
                            'temporalGranularity': granularityConfigs[key]['temporalGranularity'],
                            'targetSpatialGranularity': granularityConfigs[key]['targetSpatialGranularity'],
                            'targetTemporalGranularity': granularityConfigs[key]['targetTemporalGranularity'],
                            'mappingMethod': granularityConfigs[key],
                            'conversionFrequency': '24hrs',
                            'externalSource': 'http://localhost/3000/weatherdata'

                        }
                        featurelist.push(obj)
                    })
                    this.setState(prevState => ({ features: featurelist }))
                    Object.keys(granularities).forEach(function (key, index) {
                        let obj = {
                            'granularityName': key,
                            'attributes': granularities[key],
                            'shapefile': granules[key]
                        }
                        granularitylist.push(obj)
                    })

                    this.setState(prevState => ({ granularities: granularitylist }))
                }

            })
    }

    componentDidMount() {
        var id = this.props.location.state.pipelineId
        // this.setState({pipelineName:id},()=>{
        //     console.log(this.state.pipelineName)
        // })
       // this.retriveData(id)
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    handleChange = (event) => {
        this.setState({ age: event.target.value })
    }

    render() {
        let { features, granularities, pipelineName } = this.state
        let featureList = features.length > 0
            && features.map((val, i) => {
                return (
                    <option key={i} value={val.pipelineName}>{val.pipelineName}</option>
                )
            }, this);

        let featureInfoList = features.length > 0 &&
            features.map((feature, i) => {
                return (
                    <tr key={i} >
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['featureName']}</Typography></td>
                        <td>
                            <ul style={{ "listStyleType": "none", marginLeft: 0, marginTop: 0, padding: 0 }}>
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
                        <td>
                            {feature['mappingMethod']['spatialRelationMappingMethod'] != null ? <div> <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}> MethodName:{feature['mappingMethod']['spatialRelationMappingMethod']} </Typography>
                                {feature['mappingMethod']['spatialMappingArguments'] != null ?
                                    <div>
                                        <Typography style={{
                                            fontSize: 10,
                                            fontFamily: 'Courier New',
                                            color: 'grey',
                                            fontWeight: 'bolder',
                                            marginTop: 2
                                        }}>
                                            Mapping Arguments
                                        </Typography>
                                        <ul style={{ "listStyleType": "none", marginLeft: 0, padding: 0, marginTop: 0 }}>
                                            {Object.keys(feature['mappingMethod']['spatialMappingArguments']).map(function (arg, idx) {
                                                return (
                                                    <li key={idx}>
                                                        <Typography style={{
                                                            fontSize: 10,
                                                            fontFamily: 'Courier New',
                                                            color: 'grey',
                                                            fontWeight: 'bolder',
                                                            marginLeft: 4
                                                        }}>
                                                            {arg + ":" + feature['mappingMethod']['spatialMappingArguments'][arg]}
                                                        </Typography>
                                                    </li>
                                                )
                                            })} </ul> </div> : ""}
                            </div>
                                : ""}
                        </td>
                        <td> <Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['mappingMethod']['temporalRelationMappingMethod']}</Typography></td>
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

        let granularityInfoList = granularities.length > 0 &&
            granularities.map((granularity, i) => {
                return (
                    <tr key={i} >
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{granularity['granularityName']}</Typography></td>
                        <td>
                            <ul style={{ "listStyleType": "none", marginLeft: 0, marginTop: 0, padding: 0 }}>
                                {granularity['attributes'].map(function (d, idx) {
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
                        <td>
                            <div style={{ width: 900, height: 400 }}>
                                <SpatialGranularity shapefile={granularity['shapefile']}></SpatialGranularity>
                            </div>
                        </td>
                    </tr>
                )
            }, this);

        return (
            <div>
                <Typography style={{
                    fontSize: 12.5,
                    fontFamily: 'Courier New',
                    color: 'grey',
                    fontWeight: 'bolder',
                    marginBottom: 5
                }}> Feature Table</Typography>
                <table className="w3-table-all w3-col-50" style={{ marginBottom: 10 }}>
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
                            }}>Spatial conversion Method</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Temporal conversion Method</Typography></th>
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
                <Typography style={{
                    fontSize: 12.5,
                    fontFamily: 'Courier New',
                    color: 'grey',
                    fontWeight: 'bolder',
                    marginBottom: 5
                }}> Granularity Table</Typography>
                <table className="w3-table-all w3-col-50">
                    <thead>
                        <tr>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Granularity Name</Typography></th>
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
                            }}>Granules</Typography></th>

                        </tr>
                    </thead>
                    <tbody>
                        {granularityInfoList}
                    </tbody>
                </table>
                <div style={{ marginTop: 20 }} className="w3-container w3-center">
                    <Router>
                        <Link to='/addGranular' ><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round" >
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
                        <Link to="/ingestToGranularity"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Ingest to Granularity</Typography></button></Link>
                        <Link to="/ingestToFeature"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Ingest to Feature</Typography></button></Link>

                        <Link to="/addAggreConfig"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border w3-round"> <Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Bulk ingest</Typography></button></Link>
                        <Switch>
                            <PrivateRoute exact path="/addGranular"><Schema pipelineName={pipelineName} /></PrivateRoute>
                            <PrivateRoute exact path="/addFeature"><Ingest pipelineName={pipelineName}/></PrivateRoute>
                            <PrivateRoute exact path="/addSource"><SourceConnector /></PrivateRoute>
                            <PrivateRoute exact path="/addGranConfig"><Granularity pipelineName={pipelineName}/></PrivateRoute>
                            <PrivateRoute exact path="/ingestToGranularity"><IngestToGranularity pipelineName={pipelineName}/></PrivateRoute>
                            <PrivateRoute exact path="/ingestToFeature"><IngestToFeature pipelineName={pipelineName}/></PrivateRoute>
                            <PrivateRoute exact path="/addAggreConfig"><BulkIngest /></PrivateRoute>
                        </Switch>
                    </Router>
                </div>
            </div>
        )
    }
}

export default Pipeline;