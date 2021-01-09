import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SettingsIcon from '@material-ui/icons/Settings';


class PipelineInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipelineName: this.props.pipelineName,
            fusionFrequency: this.props.fusionFrequency,
            openDialog: false,
            openDialogInit: false,
            openDialogStreaming: false,
            temporalGranularities: ["week", "day"],
            fusionfq_unit: "",
            fusionfq_multiplier: "",
            features: this.props.features,
            initialTimestamp: this.props.initialTimestamp,
            initTimestamp: this.props.initTimestamp,
            intStatus: false,
            streamingConfig: {
                pipeline_name: this.props.pipelineName,
                feature_name: null,
                parameters: {
                    url: null,
                    request_frequency: {
                        granularity: null,
                        multiplier: null
                    }
                }
            }
        }
    }

    handleChange = (name) => (e) => {
        let value = e.target.value
        this.setState({ [name]: value })
    }

    handleStreamingChange = (name) => (e) => {
        var streamingConfig = this.state.streamingConfig
        streamingConfig.parameters[name] = e.target.value
        this.setState({ streamingConfig: streamingConfig }, () => {
            console.log(this.state.streamingConfig)
        })
    }

    handleSubmitInit = (e) => {
        console.log(this.state.initialTimestamp)
        this.props.initializePipeline(this.state.initialTimestamp)
        this.handleCloseInit()
    }
    handleSubmitStreaming = (e) => {
        this.props.addStreamingConfig(this.state.streamingConfig)
    }

    handleSubmit = (e) => {
        // var fusionfq = this.state.fusionfq_multiplier + " " + this.state.fusionfq_unit
        // this.setState({ fusionFrequency: fusionfq })
        this.setState({ openDialog: false })
        var data = {
            pipeline_name: this.state.pipelineName,
            granularity: this.state.fusionfq_unit,
            multiplier: this.state.fusionfq_multiplier
        }
        this.props.setFusionFrequency(data)
    }

    handleClickOpen = () => {
        this.setState({ openDialog: true })
    };

    handleClickOpenInit = () => {
        this.setState({ openDialogInit: true })
    };

    handleCloseInit = () => {
        this.setState({ openDialogInit: false })
    };

    handleClose = () => {
        this.setState({ openDialog: false })
    };

    handleClickOpenStreaming = (featureName, temporalMultiplier, temporalGranularity) => (e) => {
        var streamingConfig = this.state.streamingConfig
        streamingConfig.feature_name = featureName
        streamingConfig.parameters.request_frequency.granularity = temporalGranularity
        streamingConfig.parameters.request_frequency.multiplier = temporalMultiplier
        this.setState({ streamingConfig: streamingConfig })
        this.setState({ openDialogStreaming: true })
    };

    handleCloseStreaming = () => {
        this.setState({ openDialogStreaming: false })
    };

    render() {
        let { temporalGranularities, streamingConfig } = this.state
        var features = this.props.features
        let temporalGranularityList = temporalGranularities.length > 0
            && temporalGranularities.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);
        let featureList = features.length > 0 &&
            features.map((feature, i) => {
                return (
                    <tr key={i} >
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['featureName']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature["temporalMultiplier"] + " " + feature["temporalGranularity"]}</Typography></td>
                        <td> {feature["externalSource"] != null ?
                            <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>{feature["externalSource"]}
                            </Typography> : <Button variant="outlined"
                                color="grey"
                                size="small"
                                onClick={this.handleClickOpenStreaming(feature["featureName"], feature["temporalMultiplier"], feature["temporalGranularity"])}
                                style={{ height: 20 }}
                                startIcon={<SettingsIcon />}>configure</Button>}</td>
                    </tr>
                )
            })
        return (
            <div>
                <div className="row">
                    <div className="col-25">
                        <Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder',
                            marginTop: 2
                        }}>
                            Pipeline Name :  {this.props.pipelineName}
                        </Typography>

                        <Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder',
                            marginTop: 10
                        }}>
                            Status :
                                {this.props.initTimestamp != null ?
                                <div className="row">
                                    <div className="col-50">
                                        <Typography style={{
                                            fontSize: 10,
                                            fontFamily: 'Courier New',
                                            color: 'green',
                                            fontWeight: 'bolder',
                                        }}>
                                            Initialized
                                      </Typography>
                                    </div>
                                </div> :
                                <div className="row">
                                    <div className="col-50">
                                        <Typography style={{
                                            fontSize: 10,
                                            fontFamily: 'Courier New',
                                            color: 'orange',
                                            fontWeight: 'bolder',
                                            marginTop: 10
                                        }}>
                                            Not initialized
                                        </Typography>
                                    </div>
                                </div>
                            }
                        </Typography>

                        {
                            this.props.fusionFQUnit == null | this.props.fusionFrequency == null | this.props.fusionFQMultiplier == null ?
                                <div>
                                    <Typography style={{
                                        fontSize: 10,
                                        fontFamily: 'Courier New',
                                        color: 'grey',
                                        fontWeight: 'bolder',
                                        marginTop: 10
                                    }}>
                                        Fusion Frequency: <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={this.handleClickOpen}
                                            startIcon={<AvTimerIcon />}>
                                            Set
                                        </Button>
                                    </Typography>
                                </div>
                                :
                                <Typography style={{
                                    fontSize: 10,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                    fontWeight: 'bolder',
                                    marginTop: 10
                                }}>
                                    Fusion Frequency: {this.props.fusionFrequency +
                                        " seconds (" + this.props.fusionFQMultiplier + " " + this.props.fusionFQUnit + ")"}

                                </Typography>
                        }

                        {this.props.initTimestamp != null ?
                            <div>
                                <Typography style={{
                                    fontSize: 10,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                    fontWeight: 'bolder',
                                    marginTop: 10
                                }}>
                                    Initial timestamp :  {this.props.initialTimestamp}
                                </Typography>

                                <Typography style={{
                                    fontSize: 10,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                    fontWeight: 'bolder',
                                    marginTop: 10
                                }}>
                                    Initialized on :  {this.props.initTimestamp}
                                </Typography>
                            </div>
                            : ""}
                        {this.props.initTimestamp != null ? <div className="col-50">
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={this.handleClickOpenInit}
                                startIcon={<AvTimerIcon />}
                                style={{ marginLeft: 10 }}>
                                Terminate
                                </Button>
                        </div> :
                            <div className="col-50">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={this.handleClickOpenInit}
                                    startIcon={<AvTimerIcon />}
                                    style={{}}>
                                    Initialize
                                </Button>
                            </div>}
                    </div>
                    <div className="col-25" style={{ marginLeft: 5 }}>
                        <Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder',
                            marginTop: 2
                        }}>
                            Fusion summary
                        </Typography>
                    </div>
                </div>

                <table className="w3-table-all w3-col-50" style={{ marginBottom: 10, marginTop: 20 }}>
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
                            }}>Fetch Frequenchy(Temporal granularity)</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>API endpoint(Streaming)</Typography></th>
                        </tr>
                    </thead>
                    <tbody>
                        {featureList}
                    </tbody>
                </table>
                <div>
                    <Dialog open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            <Typography style={{
                                fontSize: 15,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder',
                            }}>
                                Fusion Frequency
                                </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography style={{
                                    fontSize: 12,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                    fontWeight: 'bolder',
                                }}>
                                    Set the fusion frequenchy of the pipeline
                                </Typography>
                            </DialogContentText>
                            <FormControl variant="filled" size="small" className="col-50">
                                <InputLabel id="fusionfq_unit_label">unit</InputLabel>
                                <Select
                                    labelId="fusionfq_unit_label"
                                    id="fusionfq_unit"
                                    value={this.state.fusionfq_unit}
                                    onChange={this.handleChange("fusionfq_unit")}
                                >
                                    {temporalGranularityList}
                                </Select>
                            </FormControl>
                            <FormControl size="small" className="col-25" style={{ marginLeft: 20 }}>
                                <TextField id="fusionfq_multipler" label="frequency"
                                    value={this.state.fusionfq_multiplier}
                                    type="number"
                                    min="0"
                                    pattern="^[0-9]"
                                    onChange={this.handleChange("fusionfq_multiplier")}
                                />
                            </FormControl>
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

                <div>
                    <Dialog open={this.state.openDialogInit} onClose={this.handleCloseInit} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            <Typography style={{
                                fontSize: 15,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder',
                            }}>
                                {"Initialize " + this.props.pipelineName + " pipeline"}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography style={{
                                    fontSize: 10,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                }}>
                                    Set the initial timestamp from which the system should start continous data collection and fusion
                                </Typography>
                            </DialogContentText>
                            <form noValidate>
                                <TextField
                                    id="datetime-local"
                                    label="Initial timestamp"
                                    type="datetime-local"
                                    value={this.state.initialTimestamp}
                                    onChange={this.handleChange("initialTimestamp")}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseInit} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleSubmitInit} color="primary">
                                Start
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <Dialog open={this.state.openDialogStreaming} onClose={this.handleCloseStreaming} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            <Typography style={{
                                fontSize: 15,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder',
                            }}>
                                {"Streaming configuration of " + this.state.featureOnFocus}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography style={{
                                    fontSize: 10,
                                    fontFamily: 'Courier New',
                                    color: 'grey',
                                }}>
                                    Streaming configuration to fetch data continously from external data sources.
                                </Typography>
                            </DialogContentText>
                            <form noValidate>
                                <FormControl size="small" className="col-50" style={{ marginLeft: 20 }}>
                                    <TextField id="url" label="URL of the extenal data source"
                                        value={this.state.streamingConfig.parameters.url}
                                        type="url"
                                        onChange={this.handleStreamingChange("url")}
                                    />
                                </FormControl>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseStreaming} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleSubmitStreaming} color="primary">
                                Proceed
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    }
}
export default PipelineInfo;