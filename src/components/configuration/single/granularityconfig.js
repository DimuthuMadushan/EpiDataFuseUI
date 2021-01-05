import React from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class GranularityConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            spatial_granularity: null,
            temporal_granularity: null,
            temporal_multiplier: 1,
            target_temporal_multiplier: 1,
            target_spatial_granularity: null,
            target_temporal_granularity: null,
            granularity_mapping: {
                "spatial_mapping_method": {
                    "method_name": null,
                    "mapping_arguments": null
                }
            },
            spatialGranularities: [],
            temporalGranularities: [],
            spatialConversionMethods: [],
            spatialConversionMethodNames: [],
            temporalConversionMethods: [],
            temporalConversionMethodNames: [],
            spatialMethodNamesList: [],
            temporalMethodNamesList: [],
        }
    }

    updateParentState = () => {
        var granulartiyConfig = {
            spatial_granularity: this.state.spatial_granularity,
            temporal_granularity: this.state.temmporal_granularity,
            temporal_multiplier: this.state.temporal_multiplier,
            target_spatial_granularity: this.state.target_spatial_granularity,
            target_temporal_granularity: this.state.target_temporal_granularity,
            temporal_multiplier: this.state.target_temporal_multiplier,
            granularity_mapping: this.state.granularity_mapping
        }
        this.props.updateParentState(granulartiyConfig)
    }

    handleChangeNew = (name) => (e) => {
        let errorMsg = { spatial: "", temporal: "", featureName: "", target_spatial_granularity: "", target_temporal_granularity: "" }
        let value = e.target.value
        this.setState({ errorMsg })
        this.setState({ [name]: value }, () => {
            this.updateParentState()
        })
    }

    handleSpatialMappingMethodChange = (name) => (e) => {
        let value = e.target.value
        let granularity_mapping = this.state.granularity_mapping
        let mapping_arguments = []
        granularity_mapping[name]["method_name"] = value
        Object.keys(this.state.spatialConversionMethods[value]).forEach(key => {
            let argument = {
                "argument_name": key,
                "argument_value": this.state.spatialConversionMethods[value][key]
            }
            mapping_arguments.push(argument)
        })
        granularity_mapping[name]["mapping_arguments"] = mapping_arguments
        this.setState({ granularity_mapping }, () => {
            this.updateParentState()
        })
    }

    handleTemporalMappingMethodChange = (name) => (e) => {
        let value = e.target.value
        let granularity_mapping = this.state.granularity_mapping
        let mapping_arguments = []
        granularity_mapping[name]["method_name"] = value
        Object.keys(this.state.temporalConversionMethods[value]).forEach(key => {
            let argument = {
                "argument_name": key,
                "argument_value": this.state.temporalConversionMethods[value][key]
            }
            mapping_arguments.push(argument)
        })
        granularity_mapping[name]["mapping_arguments"] = mapping_arguments
        this.setState({ granularity_mapping }, () => {
            this.updateParentState()
        })
    }

    handleMappingArgumentChange = (dimension, index) => (e) => {
        let value = e.target.value
        let granularity_mapping = this.state.granularity_mapping
        granularity_mapping[dimension]["mapping_arguments"][index]["argument_value"] = value
        this.setState({ granularity_mapping }, () => {
            this.updateParentState()
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    getGranularityInfo(data) {
        axios.post('http://localhost:8080/getGranularityInfo', data)
            .then(function (response) {
                if (response.data.success) {
                    return response.data
                } else {
                    return null
                }
            }).then((res) => {
                if (res.data.spatialGranularities) {
                    this.setState({ spatialGranularities: res.data.spatialGranularities })
                }
                if (res.data.temporalGranularities) {
                    this.setState({ temporalGranularities: res.data.temporalGranularities })
                }
            })
    }

    getConversionMethods(data) {
        axios.post('http://localhost:8080/getConversionMethodInfo', data)
            .then(function (response) {
                if (response.data.success) {
                    return response.data
                } else {
                    return null
                }
            }).then((res) => {
                let spatialMethodNames = []
                let spatialConversionMethods = res.data.spatialConversionMethods
                if (spatialConversionMethods) {
                    Object.keys(spatialConversionMethods).forEach(function (key, index) {
                        spatialMethodNames.push(key)
                    })
                    this.setState({ spatialConversionMethods: res.data.spatialConversionMethods })
                    this.setState({ spatialConversionMethodNames: spatialMethodNames })
                }

                let temporalMethodNames = []
                let temporalConversionMethods = res.data.temporalConversionMethods

                if (temporalConversionMethods) {
                    Object.keys(temporalConversionMethods).forEach(function (key, index) {
                        temporalMethodNames.push(key)
                    })
                    this.setState({ temporalConversionMethods: res.data.temporalConversionMethods })
                    this.setState({ temporalConversionMethodNames: temporalMethodNames })
                }
            })
    }

    componentDidMount() {
        var id = this.props.pipelineName
        this.setState({ pipelineName: id })
        var data = {
            "pipeline_name": id
        }
        this.getGranularityInfo(data)
        this.getConversionMethods(data)
    }

    render() {
        let { granularity_mapping,
            spatialConversionMethodNames,
            temporalConversionMethodNames,
            spatialGranularities, temporalGranularities,
        } = this.state
        let spatialGranularityList = spatialGranularities.length > 0
            && spatialGranularities.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);
        let temporalGranularityList = temporalGranularities.length > 0
            && temporalGranularities.map((val, i) => {
                console.log(val)
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);

        let spatialConversionMethodsList = spatialConversionMethodNames.length > 0
            && spatialConversionMethodNames.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);


        let spatialMappingArguments = granularity_mapping.spatial_mapping_method.mapping_arguments != null
            && granularity_mapping.spatial_mapping_method.mapping_arguments.map((val, i) => {
                let argument = granularity_mapping.spatial_mapping_method.mapping_arguments[val]
                return (
                    <div className="row">
                        <TextField key={i} id={val} label={val["argument_name"]} className="col-50"
                            value={this.state.granularity_mapping.spatial_mapping_method.mapping_arguments[i]["argument_value"]}
                            onChange={this.handleMappingArgumentChange("spatial_mapping_method", i)}
                        />
                    </div>
                )
            }, this)

        return (
            <div style={{ "paddingLeft": 25 }}>
                <form className="w3-container" style={{ marginTop: 10 }}>
                    <div className="row" style={{ marginTop: 30, alignItems: 'flex-start' }}>
                        <h4
                            style={{
                                fontSize: 14, fontFamily: 'Courier New',
                                color: 'grey', fontWeight: 'bolder', align: 'left'
                            }}>
                            Granularity Configuration
                            </h4>
                    </div>
                    <div className="row" style={{ "marginLeft": 10 }}>
                        <div>
                            <div className="row" style={{ marginTop: 5, alignItems: 'flex-start' }}>
                                <h4
                                    style={{
                                        fontSize: 12, fontFamily: 'Courier New',
                                        color: 'grey', fontWeight: 'bolder', align: 'left'
                                    }}>
                                    Spatial granularity
                            </h4>
                            </div>
                            <div className="row" className="row" style={{ "marginLeft": 30 }}>
                                <FormControl variant="filled" size="small" className=" col-25" >
                                    <InputLabel id="spatial_granularity_label">current</InputLabel>
                                    <Select
                                        labelId="spatial_granularity_label"
                                        id="spatial_granularity"
                                        value={this.state.spatial_granularity}
                                        onChange={this.handleChangeNew("spatial_granularity")}
                                    >
                                        {spatialGranularityList}
                                    </Select>
                                </FormControl>

                                <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 10 }}>
                                    <InputLabel id="target_spatial_granularity_label">target</InputLabel>
                                    <Select
                                        labelId="target_spatial_granularity_label"
                                        id="target_spatial_granularity"
                                        value={this.state.target_spatial_granularity}
                                        onChange={this.handleChangeNew("target_spatial_granularity")}
                                    >
                                        {spatialGranularityList}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="row" style={{ marginTop: 15, marginLeft: 30, alignItems: 'flex-start' }}>
                                <h4
                                    style={{
                                        fontSize: 12, fontFamily: 'Courier New',
                                        color: 'grey', fontWeight: 'bolder', align: 'left'
                                    }}>
                                    Conversion method configuration
                                    </h4>
                            </div>
                            <div className="row" id="spatialMethodName" style={{ "marginLeft": 30 }}>
                                <FormControl variant="filled" size="small" className="col-50">
                                    <InputLabel id="spatialMethodName_label">map granules by</InputLabel>
                                    <Select
                                        labelId="spatialMethodName_label"
                                        id="spatialMethodName"
                                        name="spatialMethodName"
                                        value={this.state.granularity_mapping.spatial_mapping_method.method_name}
                                        onChange={this.handleSpatialMappingMethodChange("spatial_mapping_method")}
                                    >
                                        {spatialConversionMethodsList}
                                    </Select>
                                </FormControl>
                            </div>
                            <div class="row" style={{ marginTop: 20, marginLeft: 30 }}>
                                {spatialMappingArguments.length > 0 ? <div className="row" style={{ alignItems: 'flex-start' }}>
                                    <h4
                                        style={{
                                            fontSize: 10, fontFamily: 'Courier New',
                                            color: 'grey', fontWeight: 'bolder', align: 'left'
                                        }}>
                                        arguments
                                    </h4>
                                </div> : ""}
                                {spatialMappingArguments}
                            </div>

                            {/* <div className="h7">{this.state.errorMsg["spatialMappingArgs"]}</div> */}
                        </div>
                        <div style={{ "marginTop": 40 }}>
                            <div className="row" style={{ marginTop: 5, alignItems: 'flex-start' }}>
                                <h4
                                    style={{
                                        fontSize: 12, fontFamily: 'Courier New',
                                        color: 'grey', fontWeight: 'bolder', align: 'left'
                                    }}>
                                    Temporal granularity
                                </h4>
                            </div>
                            <div className="row" style={{ marginTop: 5, marginLeft: 10, alignItems: 'flex-start' }}>
                                <h4
                                    style={{
                                        fontSize: 10, fontFamily: 'Courier New',
                                        color: 'grey', fontWeight: 'bolder', align: 'left'
                                    }}>
                                    Current
                                </h4>
                            </div>
                            <div className="row" style={{ "marginLeft": 30 }}>
                                <FormControl variant="filled" size="small" className="col-25">
                                    <InputLabel id="temporal_granularity_label">unit</InputLabel>
                                    <Select
                                        labelId="temporal_granularity_label"
                                        id="temporal_granularity"
                                        value={this.state.temporal_granularity}
                                        onChange={this.handleChangeNew("temporal_granularity")}
                                    >
                                        {temporalGranularityList}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" className="col-25" style={{ marginLeft: 20 }}>
                                    <TextField id="base_multiplier" label="frequency" className="col-25"
                                        value={this.state.temporal_multiplier}
                                        type="number"
                                        min="0"
                                        pattern="^[0-9]"
                                        onChange={this.handleChangeNew("temporal_multiplier")}
                                    />
                                </FormControl>

                            </div>
                            <div className="row" style={{ marginTop: 10, marginLeft: 10, alignItems: 'flex-start' }}>
                                <h4
                                    style={{
                                        fontSize: 10, fontFamily: 'Courier New',
                                        color: 'grey', fontWeight: 'bolder', align: 'left'
                                    }}>
                                    Target
                                </h4>
                            </div>
                            <div className="row" style={{ "marginLeft": 30, marginTop: 5 }}>
                                <FormControl variant="filled" size="small" className="col-25">
                                    <InputLabel id="target_temporal_granularity_label">unit</InputLabel>
                                    <Select
                                        labelId="target_temporal_granularity_label"
                                        id="target_temporal_granularity"
                                        value={this.state.target_temporal_granularity}
                                        onChange={this.handleChangeNew("target_temporal_granularity")}
                                    >
                                        {temporalGranularityList}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" className="col-25" style={{ marginLeft: 20 }}>
                                    <TextField id="target_multiplier" label="frequency" className="col-25"
                                        value={this.state.target_temporal_multiplier}
                                        type="number"
                                        min="0"
                                        onChange={this.handleChangeNew("target_temporal_multiplier")}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
export default GranularityConfig;