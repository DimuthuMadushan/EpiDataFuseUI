import React from 'react';
import axios from 'axios';
class Aggregation extends React.Component {
    state = {
        aggregatedAttribute:[""],
        spatialAggregation:{spatialMethodName:"", aggregationArgs:[]},
        temporalAggregation:{temporalMethodName:"", aggregationArgs:[]},
        spatialAggregationArgs:[{spatialArgName:"", spatialArgValue:""}],
        temporalAggregationArgs:[{temporalArgName:"", temporalArgValue:""}],
        aggregation:{aggregatedAttribute:"", spatialAggregation: {}, temporalAggregation:{}},
        errorMsg:{aggregatedAttribute:""},
        response:""
    }


    handleChange = (e) => {
        let errorMsg = {aggregatedAttribute:""}
        this.setState({errorMsg})
        if(["spatialMethodName", "spatialArgName","spatialArgValue"].includes(e.target.id)){
            let {spatialAggregation,spatialAggregationArgs} = this.state
            if(e.target.id==="spatialMethodName"){
                spatialAggregation[e.target.name] = e.target.value.toUpperCase()
                this.setState({spatialAggregation},()=>{
                    //console.log(spatialAggregation)
                })
            } else {
                spatialAggregationArgs[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
                spatialAggregation["aggregationArgs"] = spatialAggregationArgs
                this.setState({
                    spatialAggregation: spatialAggregation
                }, () => {
                    //console.log(this.state.spatialAggregation)
                })
            }

        } else if(["temporalMethodName", "temporalArgName","temporalArgValue"].includes(e.target.id)){
            let {temporalAggregation,temporalAggregationArgs} = this.state
            if(e.target.id==="temporalMethodName"){
                temporalAggregation[e.target.name] = e.target.value.toUpperCase()
                this.setState({temporalAggregation:temporalAggregation },()=>{
                    //console.log(temporalAggregation)
                })
            } else {
                temporalAggregationArgs[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
                temporalAggregation["aggregationArgs"] = temporalAggregationArgs
                this.setState({
                    temporalAggregation: temporalAggregation
                }, () => {
                    //console.log(this.state.temporalAggregation)
                })
            }

        } else {
            let error = ""
            if (!e.target.value) {
                error = `${e.target.name} field cannot be empty`
            }
            errorMsg[e.target.id] = error
            this.setState({ errorMsg });
            let aggregatedAttribute = this.state.aggregatedAttribute;
            aggregatedAttribute[e.target.dataset.id] = e.target.value.toUpperCase();
            this.setState({ aggregatedAttribute},()=>{
                //console.log(this.state.aggregatedAttribute)
            })
        }
    }

    addAggregation = (e) =>{
        let aggregation = this.state.aggregation
        let errorMsg = this.state.errorMsg
        let err = '';
        aggregation["aggregatedAttribute"] = this.state.aggregatedAttribute
        aggregation["spatialAggregation"] = this.state.spatialAggregation
        aggregation["temporalAggregation"] = this.state.temporalAggregation
        if(!this.state.aggregation["aggregatedAttribute"]){
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
                aggregatedAttribute:[""],
                spatialAggregation:{spatialMethodName:"", mappingArgs:[]},
                temporalAggregation:{temporalMethodName:"", mappingArgs:[]},
                spatialAggregationArgs:[{spatialArgName:"", spatialArgValue:""}],
                temporalAggregationArgs:[{temporalArgName:"", temporalArgValue:""}],
                granularity:{aggregatedAttribute:"", spatialAggregation: {}, temporalAggregation:{}},
                errorMsg:{aggregatedAttribute:""},
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
            spatialAggregationArgs: [...prevState.spatialAggregationArgs, {spatialArgName:"", spatialArgValue:""}]
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
            aggregatedAttribute: [...prevState.aggregatedAttribute,""]
        }));
    }
    removeAttribute = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayArgs = this.state.aggregatedAttribute;
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
            temporalAggregationArgs: [...prevState.temporalAggregationArgs, {temporalArgName:"", temporalArgValue:""}]
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
        let {spatialAggregationArgs, temporalAggregationArgs, aggregatedAttribute} = this.state
        return(
            <div>
                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h6>
                        <label>Aggregation Configg</label>
                        <div className="w3-panel w3-border">

                            <br/>
                            {
                                aggregatedAttribute.map((val,idx)=>{
                                    let nameId = `name-${idx}`, valueId = `value-${idx}`
                                    return(
                                        <div key={idx} className="row w3-panel w3-border">
                                            <label htmlFor={nameId} className="col-25">Aggregated Attributes</label>
                                            <input
                                                type="text"
                                                name={nameId}
                                                data-id={idx}
                                                id="aggregatedAttribute"
                                                value={aggregatedAttribute[idx].ame}
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
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addAggregation}>Add Aggregation</button>

            </div>
        )
    }
}

export default Aggregation;