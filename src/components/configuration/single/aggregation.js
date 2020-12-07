import React from 'react';
import axios from 'axios';
class Aggregation extends React.Component {
    state = {
        aggregated_attribute:[""],
        spatial_aggregation:{method_name:null, aggregation_arguments:[]},
        temporal_aggregation:{method_name:null, aggregation_argument:[]},
        spatialAggregationArgs:[{argument_name:null, argument_value:null}],
        temporalAggregationArgs:[{argument_name:null, argument_value:null}],
        aggregation:{aggregated_attribute:null, spatial_aggregation: {}, temporal_aggregation:{}},
        errorMsg:{aggregatedAttribute:null},
        response:""
    }


    handleChange = (e) => {
        let errorMsg = {aggregatedAttribute:""}
        let aggregation = this.state.aggregation
        this.setState({errorMsg})
        if(["spatialMethodName", "spatialArgName","spatialArgValue"].includes(e.target.id)){
            let {spatial_aggregation,spatialAggregationArgs} = this.state
            if(e.target.id==="spatialMethodName"){
                spatial_aggregation["method_name"] = e.target.value.toUpperCase()
                this.setState({spatial_aggregation: spatial_aggregation},()=>{
                    console.log(spatial_aggregation)
                })
            } else {
                if(e.target.id==="spatialArgName") {
                    spatialAggregationArgs[e.target.dataset.id]["argument_name"] = e.target.value.toUpperCase()
                }else{
                    spatialAggregationArgs[e.target.dataset.id]["argument_value"] = e.target.value.toUpperCase()
                }
                    spatial_aggregation["aggregation_arguments"] = spatialAggregationArgs
                this.setState({
                    spatialAggregation: spatial_aggregation
                }, () => {
                    console.log(this.state.spatial_aggregation)
                })
            }
            aggregation["spatial_aggregation"] = this.state.spatial_aggregation

        } else if(["temporalMethodName", "temporalArgName","temporalArgValue"].includes(e.target.id)){
            let {temporal_aggregation,temporalAggregationArgs} = this.state
            if(e.target.id==="temporalMethodName"){
                temporal_aggregation["method_name"] = e.target.value.toUpperCase()
                this.setState({temporal_aggregation:temporal_aggregation },()=>{
                    console.log(temporal_aggregation)
                })
            } else {
                if(e.target.id==="temporalArgName") {
                    temporalAggregationArgs[e.target.dataset.id]["argument_name"] = e.target.value.toUpperCase()
                }else{
                    temporalAggregationArgs[e.target.dataset.id]["argument_value"] = e.target.value.toUpperCase()
                }

                temporal_aggregation["aggregation_argument"] = temporalAggregationArgs
                this.setState({
                    temporalAggregation: temporal_aggregation
                }, () => {
                    console.log(this.state.temporal_aggregation)
                })
            }
            aggregation["temporal_aggregation"] = this.state.temporal_aggregation
        } else {
            let error = ""
            if (!e.target.value) {
                error = `${e.target.name} field cannot be empty`
            }
            errorMsg[e.target.id] = error
            this.setState({ errorMsg });
            let aggregated_attribute = this.state.aggregated_attribute;
            aggregated_attribute[e.target.dataset.id] = e.target.value.toUpperCase();
            this.setState({ aggregated_attribute},()=>{
                aggregation["aggregated_attribute"] = this.state.aggregated_attribute
                console.log(this.state.aggregated_attribute)
            })
        }
        this.props.addAggregation(aggregation);

    }

    addAggregation = (e) =>{
        let aggregation = this.state.aggregation
        let errorMsg = this.state.errorMsg
        let err = '';
        aggregation["aggregated_attribute"] = this.state.aggregated_attribute
        aggregation["spatial_aggregation"] = this.state.spatial_aggregation
        aggregation["temporal_aggregation"] = this.state.temporal_aggregation
        if(!this.state.aggregation["aggregated_attribute"]){
            err = "Aggregated attribute fields can not be empty"
            errorMsg["aggregatedAttribute"] = err
            this.setState({errorMsg})
        }
        else {
            this.setState({aggregation},()=>{
                //console.log(aggregation)
                this.props.addAggregation(aggregation);
                //this.postConfigurations()
            })
            this.setState({
                aggregated_attribute:[],
                spatial_aggregation:{method_name:null, aggregation_arguments:[]},
                temporal_aggregation:{method_name:null, aggregation_argument:[]},
                spatialAggregationArgs:[{argument_name:null, argument_value:null}],
                temporalAggregationArgs:[{argument_name:null, argument_value:null}],
                aggregation:{aggregated_attribute:null, spatial_aggregation: {}, temporal_aggregation:{}},
                errorMsg:{aggregatedAttribute:null},
                response:""
            })
        }
    }
    postConfigurations=()=>{
        let response = this.state.response
        if(!this.state.errorMsg["featureName"] & !this.state.errorMsg["spatial"] & !this.state.errorMsg["temporal"] &!this.state.errorMsg["spatialGran"]&!this.state.errorMsg["temporalGran"]){
            axios
                .post('https://localhost:8080', this.state.GranularityMappingConfig)
                .then(response =>{
                    console.log(response)
                })
                .catch(error =>{
                    console.log(error)
                })
        }
    }

    addArgs = (e) => {
        this.setState((prevState) => ({
            spatialAggregationArgs: [...prevState.spatialAggregationArgs, {argument_name:"", argument_value:""}]
        }));
    }
    removeArgs = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayArgs = this.state.spatialAggregationArgs;
        if (arrayArgs.length > 0) {
            arrayArgs.splice(-1, 1)
        }
        errorMsg["spatialAggregationArgs"] = ""
        this.setState((prevState) => ({
            spatialAggregationArgs: arrayArgs,
            errorMsg: errorMsg
        }));
    }
    addAttribute = (e) => {
        this.setState((prevState) => ({
            aggregated_attribute: [...prevState.aggregated_attribute,""]
        }));
    }
    removeAttribute = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayArgs = this.state.aggregated_attribute;
        if (arrayArgs.length > 0) {
            arrayArgs.splice(-1, 1)
        }
        errorMsg["aggregatedAttribute"] = ""
        this.setState((prevState) => ({
            aggregatedAttribute: arrayArgs,
            errorMsg: errorMsg
        }));
    }

    addTempArgs = (e) => {
        this.setState((prevState) => ({
            temporalAggregationArgs: [...prevState.temporalAggregationArgs, {argument_name:"", argument_value:""}]
        }));
    }
    removeTempArgs = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayArgs = this.state.temporalAggregationArgs;
        if (arrayArgs.length > 0) {
            arrayArgs.splice(-1, 1)
        }
        errorMsg["temporalAggregationArgs"] = ""
        this.setState((prevState) => ({
            temporalAggregationArgs: arrayArgs,
            errorMsg: errorMsg
        }));
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let {spatialAggregationArgs, temporalAggregationArgs, aggregated_attribute} = this.state
        return(
            <div>
                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h6>
                        <label>Aggregation Configg</label>
                        <div className="w3-panel w3-border">

                            <br/>
                            {
                                aggregated_attribute.map((val, idx)=>{
                                    let nameId = `name-${idx}`, valueId = `value-${idx}`
                                    return(
                                        <div key={idx} className="row w3-panel w3-border">
                                            <label htmlFor={nameId} className="col-25">Aggregated Attributes</label>
                                            <input
                                                type="text"
                                                name={nameId}
                                                data-id={idx}
                                                id="aggregatedAttribute"
                                                value={aggregated_attribute[idx].ame}
                                                className="col-75"
                                            />
                                            <div className="h7">{this.state.errorMsg["aggregatedAttributes"]}</div>
                                        </div>
                                    )
                                })
                            }
                            <div className="h7">{this.state.errorMsg["spatialAggregationArgs"]}</div>
                            <button className="w3-button w3-circle w3-teal" onClick={this.removeAttribute}>-</button>
                            <button className="w3-button w3-circle w3-teal" onClick={this.addAttribute}>+</button>

                            <br/>
                        </div>
                        <div className="" >
                            <label>Spatial Aggregation</label>
                            <br/>
                            <div className="row w3-panel w3-border" id="spatialMethodName">
                                <label className="col-50">Method Name</label>
                                <div className="col-50">
                                    <select id="spatialMethodName" name="spatialMethodName">
                                        <option value="inverseDistance">InverseDistance</option>
                                        <option value="inverseDistance">InverseDistance</option>
                                    </select>
                                </div>
                                <br/>
                                <label className="col-50">Arguments</label>
                                {
                                    spatialAggregationArgs.map((val, idx) => {
                                        let nameId = `name-${idx}`, valueId = `value-${idx}`
                                        return (
                                            <div key={idx} className="row w3-panel w3-border">
                                                <label htmlFor={nameId} className="col-25">Argument Name</label>
                                                <input
                                                    type="text"
                                                    name={nameId}
                                                    data-id={idx}
                                                    id="spatialArgName"
                                                    value={spatialAggregationArgs[idx].ame}
                                                    className="col-75"
                                                />
                                                <label htmlFor={valueId} className="col-25">Value</label>
                                                <input
                                                    type="text"
                                                    name={valueId}
                                                    data-id={idx}
                                                    id="spatialArgValue"
                                                    value={spatialAggregationArgs[idx].type}
                                                    className="col-75 "
                                                />
                                                <br />
                                            </div>
                                        )
                                    })
                                }
                                <div className="h7">{this.state.errorMsg["spatialAggregationArgs"]}</div>
                                <br />
                                <button className="w3-button w3-circle w3-teal" onClick={this.removeArgs}>-</button>
                                <button className="w3-button w3-circle w3-teal" onClick={this.addArgs}>+</button>
                                <br /><br />
                            </div>
                            <br/>
                            <label>Temporal Aggregation</label>
                            <br/>
                            <div className="row w3-panel w3-border" id="temporalMethodName">
                                <label className="col-50">Method Name</label>
                                <div className="col-50">
                                    <select id="temporalMethodName" name="temporalMethodName">
                                        <option value="mean">Mean</option>
                                        <option value="nedian">Median</option>
                                    </select>
                                </div>
                                <br/>
                                <label className="col-50">Arguments</label>
                                {
                                    temporalAggregationArgs.map((val, idx) => {
                                        let nameId = `name-${idx}`, valueId = `value-${idx}`
                                        return (
                                            <div key={idx} className="row w3-panel w3-border">
                                                <label htmlFor={nameId} className="col-25">Argument Name</label>
                                                <input
                                                    type="text"
                                                    name={nameId}
                                                    data-id={idx}
                                                    id="temporalArgName"
                                                    value={temporalAggregationArgs[idx].ame}
                                                    className="col-75"
                                                />
                                                <label htmlFor={valueId} className="col-25">Value</label>
                                                <input
                                                    type="text"
                                                    name={valueId}
                                                    data-id={idx}
                                                    id="temporalArgValue"
                                                    value={temporalAggregationArgs[idx].type}
                                                    className="col-75 "
                                                />
                                                <br />
                                            </div>
                                        )
                                    })
                                }
                                <div className="h7">{this.state.errorMsg["temporalAggregationArgs"]}</div>
                                <br />
                                <button className="w3-button w3-circle w3-teal" onClick={this.removeTempArgs}>-</button>
                                <button className="w3-button w3-circle w3-teal" onClick={this.addTempArgs}>+</button>
                                <br /><br />
                            </div>
                        </div>
                    </h6>
                </form>
            </div>
        )
    }
}

export default Aggregation;