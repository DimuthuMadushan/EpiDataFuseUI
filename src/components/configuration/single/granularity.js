import React from 'react';
import axios from 'axios';
class Granularity extends React.Component {
    state = {
        spatial_granularity: null,
        temporal_granularity: null,
        target_spatial_granularity: null,
        target_temporal_granularity: null,
        spatialMapping: { method_name: null, mapping_arguments: [] },
        temporalMapping: { method_name: null, mapping_arguments: [] },
        spatialMappingArgs: [{ argument_name: null, argument_value: null }],
        temporalMappingArgs: [{ argument_name: null, argument_value: null }],
        granularity: { spatial_granularity: null, temporal_granularity: null, target_spatial_granularity: null, target_temporal_granularity: null, granularity_mapping: { spatial_mapping_method: {}, temporal_mapping_method: {} } },
        errorMsg: { spatial: null, temporal: null, target_spatial_granularity: null, target_temporal_granularity: null },
        response: ""
    }


    handleChange = (e) => {
        let mappings = this.state.mappings
        let granularity = this.state.granularity
        let errorMsg = { spatial: "", temporal: "", featureName: "", target_spatial_granularity: "", target_temporal_granularity: "" }
        this.setState({ errorMsg })
        if (["temporalGranType", "temporalGran", "temporalMap"].includes(e.target.id)) {
            let temporal_granularity = this.state.temporal_granularity
            temporal_granularity[e.target.id] = e.target.value.toUpperCase()
            mappings["temporal"] = temporal_granularity
            this.setState({ mappings }, () => {
                console.log(mappings)
            })
        } else if (["spatialMethodName", "spatialArgName", "spatialArgValue"].includes(e.target.id)) {
            let { spatialMapping, spatialMappingArgs } = this.state
            if (e.target.id === "spatialMethodName") {
                spatialMapping["method_name"] = e.target.value.toUpperCase()
                this.setState({ spatialMapping }, () => {
                    console.log(spatialMapping)
                })
            } else {
                if (e.target.id === "spatialArgName") {
                    spatialMappingArgs[e.target.dataset.id]["argument_name"] = e.target.value.toUpperCase()
                } else {
                    spatialMappingArgs[e.target.dataset.id]["argument_value"] = e.target.value.toUpperCase()
                }
                spatialMapping["mapping_arguments"] = spatialMappingArgs
                this.setState({
                    spatialMapping: spatialMapping
                }, () => {
                    console.log(this.state.spatialMapping)
                })
            }
            granularity["granularity_mapping"] = { spatial_mapping_method: this.state.spatialMapping, temporal_mapping_method: this.state.temporalMapping }
        } else if (["temporalMethodName", "temporalArgName", "temporalArgValue"].includes(e.target.id)) {
            let { temporalMapping, temporalMappingArgs } = this.state
            if (e.target.id === "temporalMethodName") {
                temporalMapping["method_name"] = e.target.value.toUpperCase()
                this.setState({ temporalMapping }, () => {
                    console.log(temporalMapping)
                })
            } else {
                if (e.target.id === "temporalArgName") {
                    temporalMappingArgs[e.target.dataset.id]["argument_name"] = e.target.value.toUpperCase()
                } else {
                    temporalMappingArgs[e.target.dataset.id]["argument_value"] = e.target.value.toUpperCase()
                }
                temporalMapping["mapping_arguments"] = temporalMappingArgs
                this.setState({
                    temporalMapping: temporalMapping
                }, () => {
                    console.log(this.state.temporalMapping)
                })
            }
            granularity["granularity_mapping"] = { spatial_mapping_method: this.state.spatialMapping, temporal_mapping_method: this.state.temporalMapping }
        } else {
            let error = ""
            if (!e.target.value) {
                error = `${e.target.name} field cannot be empty`
            }
            errorMsg[e.target.id] = error
            this.setState({ errorMsg });
            this.setState({ [e.target.id]: e.target.value.toUpperCase() }, () => {
                granularity["spatial_granularity"] = this.state.spatial_granularity
                granularity["temporal_granularity"] = this.state.temporal_granularity
                granularity["target_spatial_granularity"] = this.state.target_spatial_granularity
                granularity["target_temporal_granularity"] = this.state.target_temporal_granularity
                // console.log(this.state.spatial_granularity)
                // console.log(this.state.temporal_granularity)
                // console.log(this.state.target_spatial_granularity)
                // console.log(this.state.target_temporal_granularity)
            })
        }
        this.props.addGranularity(granularity);
    }

    addGranularityMapping = () => {
        let granularity = this.state.granularity
        let errorMsg = this.state.errorMsg
        let err = '';
        granularity["spatial_granularity"] = this.state.spatial_granularity
        granularity["temporal_granularity"] = this.state.temporal_granularity
        granularity["target_spatial_granularity"] = this.state.target_spatial_granularity
        granularity["target_temporal_granularity"] = this.state.target_temporal_granularity
        granularity["granularity_mapping"] = { spatial_mapping_method: this.state.spatialMapping, temporal_mapping_method: this.state.temporalMapping }
        if (!this.state.granularity["spatial_granularity"]) {
            err = "Spatial can not be null value"
            errorMsg["spatial"] = err
            this.setState({ errorMsg })
        } else if (!this.state.granularity["temporal_granularity"]) {
            err = "Temporal can not be null value"
            errorMsg["temporal"] = err
            this.setState({ errorMsg })
        } else if (!this.state.granularity["target_spatial_granularity"]) {
            err = "Target spatial_granularity fields can not be empty"
            errorMsg["target_spatial_granularity"] = err
            this.setState({ errorMsg })
        } else if (!this.state.granularity["target_temporal_granularity"]) {
            err = "Target temporal_granularity fields can not be empty"
            errorMsg["target_temporal_granularity"] = err
            this.setState({ errorMsg })
        } else {
            this.setState({ granularity: granularity }, () => {
                this.props.addGranularity(granularity);
                console.log(granularity)
                //this.postConfigurations()
            })
            this.setState({
                spatial_granularity: null,
                temporal_granularity: null,
                target_spatial_granularity: null,
                target_temporal_granularity: null,
                spatialMapping: { method_name: null, mapping_arguments: [] },
                temporalMapping: { method_name: null, mapping_arguments: [] },
                spatialMappingArgs: [{ argument_name: null, argument_value: null }],
                temporalMappingArgs: [{ argument_name: null, argument_value: null }],
                granularity: { spatial_granularity: null, temporal_granularity: null, target_spatial_granularity: null, target_temporal_granularity: null, granularity_mapping: { spatial_mapping_method: {}, temporal_mapping_method: {} } },
                errorMsg: { spatial: null, temporal: null, target_spatial_granularity: null, target_temporal_granularity: null },
                response: ""
            })
        }
    }
    // postConfigurations=()=>{
    //     let response = this.state.response
    //     if(!this.state.errorMsg["feature_name"] & !this.state.errorMsg["spatial"] & !this.state.errorMsg["temporal"] &!this.state.errorMsg["target_spatial_granularity"]&!this.state.errorMsg["target_temporal_granularity"]){
    //         axios
    //             .post('https://localhost:8080', this.state.GranularityMappingConfig)
    //             .then(response =>{
    //                 console.log(response)
    //             })
    //             .catch(error =>{
    //                 console.log(error)
    //             })
    //     }
    // }

    addArgs = (e) => {
        this.setState((prevState) => ({
            spatialMappingArgs: [...prevState.spatialMappingArgs, { argument_name: "", argument_value: "" }]
        }));
    }
    removeArgs = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayArgs = this.state.spatialMappingArgs;
        if (arrayArgs.length > 0) {
            arrayArgs.splice(-1, 1)
        }
        errorMsg["spatialMappingArgs"] = ""
        this.setState((prevState) => ({
            spatialMappingArgs: arrayArgs,
            errorMsg: errorMsg
        }));
    }

    addTempArgs = (e) => {
        this.setState((prevState) => ({
            temporalMappingArgs: [...prevState.temporalMappingArgs, { argument_name: "", argument_value: "" }]
        }));
    }
    removeTempArgs = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayArgs = this.state.temporalMappingArgs;
        if (arrayArgs.length > 0) {
            arrayArgs.splice(-1, 1)
        }
        errorMsg["temporalMappingArgs"] = ""
        this.setState((prevState) => ({
            temporalMappingArgs: arrayArgs,
            errorMsg: errorMsg
        }));
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let { spatialMappingArgs, temporalMappingArgs, granularity, aggregationGran, featureGran } = this.state
        return (
            <div>
                <form className="w3-container" style={{ marginTop: 10 }} onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h6>
                        <label>Granularity Config</label>
                        <div className="w3-panel w3-border">

                            <br />
                            <label>Spatial Granularity</label>
                            <input className="w3-input" type="text" id="spatial_granularity"></input>
                            <div className="h7">{this.state.errorMsg["spatial"]}</div>
                            <br />
                            <label>Temporal Granularity</label>
                            <input className="w3-input" type="text" id="temporal_granularity"></input>
                            <div className="h7">{this.state.errorMsg["temporal"]}</div>
                            <br />
                            <br />
                            <label>Target Spatial Granularity</label>
                            <input className="w3-input" type="text" id="target_spatial_granularity"></input>
                            <div className="h7">{this.state.errorMsg["target_spatial_granularity"]}</div>
                            <br />
                            <label>Target Temporal Granularity</label>
                            <input className="w3-input" type="text" id="target_temporal_granularity"></input>
                            <div className="h7">{this.state.errorMsg["target_temporal_granularity"]}</div>
                            <br />
                        </div>
                        <div className="" >
                            <label>Mappings Method</label>
                            <br />
                            <label>Spatial</label>
                            <br />
                            <div className="row w3-panel w3-border" id="spatialMethodName">
                                <label className="col-50">Method Name</label>
                                <div className="col-50">
                                    <select id="spatialMethodName" name="spatialMethodName">
                                        <option value="nearest">Nearest</option>
                                        <option value="nearest">Nearest</option>
                                    </select>
                                </div>
                                <br />
                                <label className="col-50">Arguments</label>
                                {
                                    spatialMappingArgs.map((val, idx) => {
                                        let nameId = `name-${idx}`, valueId = `value-${idx}`
                                        return (
                                            <div key={idx} className="row w3-panel w3-border">
                                                <label htmlFor={nameId} className="col-25">Argument Name</label>
                                                <input
                                                    type="text"
                                                    name={nameId}
                                                    data-id={idx}
                                                    id="spatialArgName"
                                                    value={spatialMappingArgs[idx].ame}
                                                    className="col-75"
                                                />
                                                <label htmlFor={valueId} className="col-25">Type</label>
                                                <input
                                                    type="text"
                                                    name={valueId}
                                                    data-id={idx}
                                                    id="spatialArgValue"
                                                    value={spatialMappingArgs[idx].type}
                                                    className="col-75 "
                                                />
                                                <br />
                                            </div>
                                        )
                                    })
                                }
                                <div className="h7">{this.state.errorMsg["spatialMappingArgs"]}</div>
                                <br />
                                <button className="w3-button w3-circle w3-teal" onClick={this.removeArgs}>-</button>
                                <button className="w3-button w3-circle w3-teal" onClick={this.addArgs}>+</button>
                                <br /><br />
                            </div>
                            <br />
                            <label>Temporal</label>
                            <br />
                            <div className="row w3-panel w3-border" id="temporalMethodName">
                                <label className="col-50">Method Name</label>
                                <div className="col-50">
                                    <select id="temporalMethodName" name="temporalMethodName">
                                        <option value="nearest">Nearest</option>
                                        <option value="nearest">Nearest</option>
                                    </select>
                                </div>
                                <br />
                                <label className="col-50">Arguments</label>
                                {
                                    temporalMappingArgs.map((val, idx) => {
                                        let nameId = `name-${idx}`, valueId = `value-${idx}`
                                        return (
                                            <div key={idx} className="row w3-panel w3-border">
                                                <label htmlFor={nameId} className="col-25">Argument Name</label>
                                                <input
                                                    type="text"
                                                    name={nameId}
                                                    data-id={idx}
                                                    id="temporalArgName"
                                                    value={temporalMappingArgs[idx].ame}
                                                    className="col-75"
                                                />
                                                <label htmlFor={valueId} className="col-25">Value</label>
                                                <input
                                                    type="text"
                                                    name={valueId}
                                                    data-id={idx}
                                                    id="temporalArgValue"
                                                    value={temporalMappingArgs[idx].type}
                                                    className="col-75 "
                                                />
                                                <br />
                                            </div>
                                        )
                                    })
                                }
                                <div className="h7">{this.state.errorMsg["spatialMappingArgs"]}</div>
                                <br />
                                <button className="w3-button w3-circle w3-teal" onClick={this.removeTempArgs}>-</button>
                                <button className="w3-button w3-circle w3-teal" onClick={this.addTempArgs}>+</button>
                                <br /><br />
                            </div>
                        </div>
                    </h6>
                </form>
                {/*<button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addGranularityMapping}>Add Granularity</button>*/}

            </div>
        )
    }
}

export default Granularity;