import React from 'react';
import AddFeature from "../configuration/single/addfeature";
import Granularity from "../configuration/single/addGranularity";
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import SpatialGranularity from '../map/SpatialGranularity';
import IngestToGranularity from "../configuration/single/ingestToGranularity";
import IngestToFeature from "../configuration/single/ingestToFeature";
import PipelineInfo from './pipelineinfo'
import Api from '../api';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class Pipeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipelineName: this.props.location.state.pipelineId,
            features: [],
            granularities: [],
            addFeature: false,
            addGranularity: false,
            ingestToFeature: false,
            ingestToGranularity: false,
            fusionFrequency: null,
            initialTimestamp: null,
            initTimestamp: null,
            fusionFQUnit: null,
            fusionFQMultiplier: null,
            openDialog: false
        }
        this.api = new Api();
    }

    initializePipeline = (initialTimestamp) => {
        var data = {
            pipeline_name: this.state.pipelineName,
            initialTimestamp: initialTimestamp
        }
        this.api.initializePipeline(data, (res) => {
            console.log(res)
            window.location.reload(false);
        });
    }

    addStreamingConfig = (data) => {
        this.api.addStreamingConfiguration(data, (res) => {
            console.log(res)
            window.location.reload(false);
        })
    }

    handleClickOpen = () => {
        this.setState({ openDialog: true })
    };

    handleClose = () => {
        this.setState({ openDialog: false })
    };

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
                    var features = featureData['features']
                    var granularityConfigs = featureData['granularityConfigs']
                    var granularities = featureData['granularities']
                    var granules = featureData['granules']
                    var streamingConfig = featureData['streamingConfig']
                    console.log(streamingConfig)
                    var featurelist = []
                    this.setState({ fusionFrequency: featureData["fusionFrequency"] })
                    this.setState({ fusionFQMultiplier: featureData["fusionFQMultiplier"] })
                    this.setState({ fusionFQUnit: featureData["fusionFQUnit"] })
                    this.setState({ initialTimestamp: featureData["initialTimestamp"] })
                    this.setState({ initTimestamp: featureData["initTimestamp"] })
                    var self = this
                    Object.keys(features).forEach(function (key, index) {
                        let obj = {
                            'featureName': key,
                            'attributes': features[key],
                            'spatialGranularity': granularityConfigs[key]['spatialGranularity'],
                            'temporalGranularity': granularityConfigs[key]['temporalGranularity'],
                            'temporalMultiplier': granularityConfigs[key]['temporalMultiplier'],
                            'targetTemporalMultiplier': granularityConfigs[key]['targetTemporalMultiplier'],
                            'targetSpatialGranularity': granularityConfigs[key]['targetSpatialGranularity'],
                            'targetTemporalGranularity': granularityConfigs[key]['targetTemporalGranularity'],
                            'mappingMethod': granularityConfigs[key],
                            'externalSource': streamingConfig[key]
                        }
                        featurelist.push(obj)
                    })

                    self.setState({ features: featurelist })

                    Object.keys(granularities).forEach(function (key, index) {
                        var data = {
                            pipeline_name: self.state.pipelineName,
                            feature_name: key,
                            file_name: granules[key]
                        }
                        var granularitylist = self.state.granularities
                        axios({ url: 'http://localhost:8080/getFile', method: 'POST', responseType: 'blob', data: data })
                            .then(function (res) {

                                var file = new File([res.data], granules[key])
                                // //Create blob link to download
                                // // var url = window.URL.createObjectURL(blob);
                                // // var link = document.createElement('a');
                                // // link.href = url;
                                // // link.setAttribute(
                                // //     'download',
                                // //     `SL_MOH.zip`,
                                // // );

                                // // // Append to html link element page
                                // // document.body.appendChild(link);

                                // // // Start download
                                // // link.click();

                                // // // Clean up and remove the link
                                // // link.parentNode.removeChild(link);

                                // var url = window.URL.createObjectURL(new Blob([res.data]));
                                // var link = document.createElement('a');
                                // link.href = url;
                                // link.setAttribute('download', 'SL_MOH.zip'); //or any other extension
                                // document.body.appendChild(link);
                                // link.click();

                                let obj = {
                                    'granularityName': key,
                                    'attributes': granularities[key],
                                    'shapefile': file
                                }
                                granularitylist.push(obj)
                                self.setState({ granularities: granularitylist })
                            })
                    })
                }
            })
    }

    componentDidMount() {
        var id = this.props.location.state.pipelineId
        this.setState({ pipelineName: id })
        this.retriveData(id)
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    handleChange = (event) => {
        this.setState({ age: event.target.value })
    }

    toggleAddFeature = () => {
        if (this.state.addFeature) {
            this.setState({ addFeature: false })
            this.handleClose()
        } else {
            this.setState({ addFeature: true })
            this.setState({ addGranularity: false, ingestToGranularity: false, ingestToFeature: false })
            this.handleClickOpen()
        }
    }

    toggleAddGranularity = () => {
        if (this.state.addGranularity) {
            this.setState({ addGranularity: false })
            this.handleClose()
        } else {
            this.setState({ addGranularity: true })
            this.setState({ addFeature: false, ingestToGranularity: false, ingestToFeature: false })
            this.handleClickOpen()
        }
    }

    toggleIngestToFeature = () => {
        if (this.state.ingestToFeature) {
            this.setState({ ingestToFeature: false })
            this.handleClose()
        } else {
            this.setState({ ingestToFeature: true })
            this.setState({ addGranularity: false, addFeature: false, ingestToGranularity: false })
            this.handleClickOpen()
        }

    }

    toggleIngestToGranularity = () => {
        if (this.state.ingestToGranularity) {
            this.setState({ ingestToGranularity: false })
        } else {
            this.setState({ ingestToGranularity: true })
            this.setState({ addGranularity: false, ingestToFeature: false, addFeature: false })
        }

    }

    setFusionFrequuency = (data) => {
        this.api.setFusionFrequency(data, (res) => {
            console.log(res)
            window.location.reload(false);
        });
    }

    render() {
        let { granularities, pipelineName, features, fusionFrequency, fusionFQMultiplier, fusionFQUnit
            , initTimestamp, initialTimestamp } = this.state
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
                        <td><div>
                            <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Unit: {feature['temporalGranularity']}</Typography>
                            <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Frequency: {feature['temporalMultiplier']}</Typography>
                            <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}> {feature['temporalMultiplier'] + " " + feature['temporalGranularity']}</Typography>
                        </div>
                        </td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['targetSpatialGranularity']}</Typography></td>

                        <td><div>
                            <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Unit: {feature['targetTemporalGranularity']}</Typography>
                            <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Frequency: {feature['targetTemporalMultiplier']}</Typography>
                            <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}> {feature['targetTemporalMultiplier'] + " " + feature['targetTemporalGranularity']}</Typography>
                        </div>
                        </td>
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
                        {/* <td> <Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['mappingMethod']['temporalRelationMappingMethod']}</Typography></td> */}
                        {/* <td><Typography style={{
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
                        }}>{feature['externalSource']}</Typography></td> */}
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
            <div style={{ padding: 20 }}>
                <div>
                    <PipelineInfo pipelineName={pipelineName} fusionFrequency={fusionFrequency}
                        setFusionFrequency={this.setFusionFrequuency}
                        fusionFQMultiplier={fusionFQMultiplier}
                        fusionFQUnit={fusionFQUnit}
                        initializePipeline={this.initializePipeline}
                        initTimestamp={initTimestamp}
                        initialTimestamp={initialTimestamp}
                        features={features}
                        addStreamingConfig={this.addStreamingConfig}
                    />
                </div>
                <div>
                    <Typography style={{
                        fontSize: 12.5,
                        fontFamily: 'Courier New',
                        color: 'grey',
                        fontWeight: 'bolder',
                        marginBottom: 5,
                        marginTop: 30
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
                                {/* <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Temporal conversion Method</Typography></th> */}
                                {/* <th><Typography style={{
                                    fontSize: 10,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                    fontWeight: 'bolder'
                                }}>Fusion frequency</Typography></th>
                                <th><Typography style={{
                                    fontSize: 10,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                    fontWeight: 'bolder'
                                }}>External source confguration</Typography></th> */}
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
                        <button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round" >
                            <Typography style={{
                                fontSize: 12,
                                fontFamily: 'Courier New',
                                color: 'white',
                                fontWeight: 'bolder'
                            }} onClick={this.toggleAddGranularity}>Add New Granularity</Typography></button>

                        <button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"> <Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }} onClick={this.toggleAddFeature}>Add New Feature</Typography></button>

                        {/* <button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                        fontSize: 12,
                        fontFamily: 'Courier New',
                        color: 'white',
                        fontWeight: 'bolder'
                    }} onClick={this.toggleAddNewSource}>Add New Source</Typography></button> */}

                        <button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }} onClick={this.toggleIngestToFeature}>Ingest to Feature</Typography></button>
                        {/* <button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                        fontSize: 12,
                        fontFamily: 'Courier New',
                        color: 'white',
                        fontWeight: 'bolder'
                    }} onClick={this.toggleIngestToGranularity}>Ingest to Granularity</Typography></button> */}

                        {/* <Link to="/addAggreConfig"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border w3-round"> <Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Bulk ingest</Typography></button></Link> */}
                        {/* <Switch>
                            <PrivateRoute exact path="/addFeature"><Schema pipelineName={pipelineName} /></PrivateRoute>
                            <PrivateRoute exact path="/addGranularity"><Granularity pipelineName={pipelineName} /></PrivateRoute>
                            <PrivateRoute exact path="/addSource"><SourceConnector /></PrivateRoute>
                            <PrivateRoute exact path="/ingestToGranularity"><IngestToGranularity pipelineName={pipelineName} /></PrivateRoute>
                            <PrivateRoute exact path="/ingestToFeature"><IngestToFeature pipelineName={pipelineName} /></PrivateRoute>
                        </Switch> */}

                        {/* 
                        <div style={!this.state.addGranularity ? { display: 'none' } : {}}>
                            <Granularity pipelineName={pipelineName} />
                        </div>
                        <div style={!this.state.addFeature ? { display: 'none' } : {}}>
                            <AddFeature pipelineName={pipelineName} />
                        </div>
                        <div style={!this.state.ingestToFeature ? { display: 'none' } : {}}>
                            <IngestToFeature pipelineName={pipelineName} features={features} />
                        </div>
                        <div style={!this.state.ingestToGranularity ? { display: 'none' } : {}}>
                            <IngestToGranularity pipelineName={pipelineName} />
                        </div> */}
                    </div>
                    <div>
                        <Dialog maxWidth={'xl'} open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">
                                <Typography style={{
                                    fontSize: 15,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                    fontWeight: 'bolder',
                                }}>
                                    Add new
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                                {/* <DialogContentText>
                                    <Typography style={{
                                        fontSize: 12,
                                        fontFamily: 'Courier New',
                                        color: 'grey',
                                        fontWeight: 'bolder',
                                    }}>
                                        Set the fusion frequenchy of the pipeline
                                </Typography>
                                </DialogContentText> */}
                                <div style={!this.state.addGranularity ? { display: 'none' } : {}}>
                                    <Granularity pipelineName={pipelineName} />
                                </div>
                                <div style={!this.state.addFeature ? { display: 'none' } : {}}>
                                    <AddFeature pipelineName={pipelineName} />
                                </div>
                                <div style={!this.state.ingestToFeature ? { display: 'none' } : {}}>
                                    <IngestToFeature pipelineName={pipelineName} features={features} />
                                </div>
                                <div style={!this.state.ingestToGranularity ? { display: 'none' } : {}}>
                                    <IngestToGranularity pipelineName={pipelineName} />
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Cancel
                            </Button>
                                <Button onClick={this.handleSubmit} color="primary">
                                    Set
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>
        )
    }
}

export default Pipeline;