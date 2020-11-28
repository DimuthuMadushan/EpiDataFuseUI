import React from 'react';
import axios from 'axios';
class Granularity extends React.Component {
    state = {
        spatial:"",
        temporal:"",
        targetSpatial: "",
        targetTemporal: "",
        spatialMapping:{spatialMethodName:"", mappingArgs:[]},
        temporalMapping:{temporalMethodName:"", mappingArgs:[]},
        spatialMappingArgs:[{spatialArgName:"", spatialArgValue:""}],
        temporalMappingArgs:[{temporalArgName:"", temporalArgValue:""}],
        granularity:{spatial:"", temporal:"", targetSpatial:"", targetTemporal:"", spatialMapping: {}, temporalMapping:{}},
        errorMsg:{spatial:"",temporal:"", targetSpatial:"",targetTemporal:""},
        response:""
    }


    handleChange = (e) => {
        let mappings = this.state.mappings
        let errorMsg = {spatial:"",temporal:"", featureName:"" ,spatailGran:"", tempGran:""}
        this.setState({errorMsg})
         if(["temporalGranType","temporalGran","temporalMap"].includes(e.target.id)){
            let temporal = this.state.temporal
            temporal[e.target.id] = e.target.value.toUpperCase()
            mappings["temporal"] = temporal
            this.setState({mappings},()=>{
                console.log(mappings)
            })
        } else if(["spatialMethodName", "spatialArgName","spatialArgValue"].includes(e.target.id)){
            let {spatialMapping,spatialMappingArgs} = this.state
             if(e.target.id==="spatialMethodName"){
                 spatialMapping[e.target.name] = e.target.value.toUpperCase()
                 this.setState({spatialMapping},()=>{
                     console.log(spatialMapping)
                 })
             } else {
                 spatialMappingArgs[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
                 spatialMapping["mappingArgs"] = spatialMappingArgs
                 this.setState({
                     spatialMapping: spatialMapping
                 }, () => {
                     console.log(this.state.spatialMapping)
                 })
             }

        } else if(["temporalMethodName", "temporalArgName","temporalArgValue"].includes(e.target.id)){
             let {temporalMapping,temporalMappingArgs} = this.state
             if(e.target.id==="temporalMethodName"){
                 temporalMapping[e.target.name] = e.target.value.toUpperCase()
                 this.setState({temporalMapping},()=>{
                     console.log(temporalMapping)
                 })
             } else {
                 temporalMappingArgs[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
                 temporalMapping["mappingArgs"] = temporalMappingArgs
                 this.setState({
                     temporalMapping: temporalMapping
                 }, () => {
                     console.log(this.state.temporalMapping)
                 })
             }

         } else {
            let error = ""
            if (!e.target.value) {
                error = `${e.target.name} field cannot be empty`
            }
            errorMsg[e.target.id] = error
            this.setState({ errorMsg });
            this.setState({ [e.target.id]: e.target.value.toUpperCase() },()=>{
                console.log(this.state.spatial)
                console.log(this.state.temporal)
                console.log(this.state.targetSpatial)
                console.log(this.state.targetTemporal)
            })
        }
    }

    addGranuralityMapping = () =>{
        let granularity = this.state.granularity
        let errorMsg = this.state.errorMsg
        let err = '';
        granularity["spatial"] = this.state.spatial
        granularity["temporal"] = this.state.temporal
        granularity["targetSpatial"] = this.state.targetSpatial
        granularity["targetTemporal"] = this.state.targetTemporal
        granularity["spatialMapping"] = this.state.spatialMapping
        granularity["temporalMapping"] = this.state.temporalMapping
        if(!this.state.granularity["spatial"]){
            err = "Spatial can not be null value"
            errorMsg["spatial"] = err
            this.setState({errorMsg})
        }else if(!this.state.granularity["temporal"]){
            err = "Temporal can not be null value"
            errorMsg["temporal"] = err
            this.setState({errorMsg})
        } else if(!this.state.granularity["targetSpatial"]){
            err = "Target spatial fields can not be empty"
            errorMsg["targetSpatial"] = err
            this.setState({errorMsg})
        } else if(!this.state.granularity["targetTemporal"]){
            err = "Target temporal fields can not be empty"
            errorMsg["targetTemporal"] = err
            this.setState({errorMsg})
        } else {
            this.setState({granularity},()=>{
                console.log(granularity)
                this.postConfigurations()
            })
            this.setState({
                spatial:"",
                temporal:"",
                targetSpatial: "",
                targetTemporal: "",
                spatialMapping:{spatialMethodName:"", mappingArgs:[]},
                temporalMapping:{temporalMethodName:"", mappingArgs:[]},
                spatialMappingArgs:[{spatialArgName:"", spatialArgValue:""}],
                temporalMappingArgs:[{temporalArgName:"", temporalArgValue:""}],
                granularity:{spatial:"", temporal:"", targetSpatial:"", targetTemporal:"", spatialMapping: {}, temporalMapping:{}},
                errorMsg:{spatial:"",temporal:"", targetSpatial:"",targetTemporal:""},
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
            spatialMappingArgs: [...prevState.spatialMappingArgs, {spatialArgName:"", spatialArgValue:""}]
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
            temporalMappingArgs: [...prevState.temporalMappingArgs, {temporalArgName:"", temporalArgValue:""}]
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
        let {spatialMappingArgs, temporalMappingArgs, granularity,aggregationGran,featureGran} = this.state
        return(
            <div  >
                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h6>
                        <label>Granularity Config</label>
                        <div className="w3-panel w3-border">

                            <br/>
                            <label>Spatial Granularity</label>
                            <input className="w3-input" type="text" id="spatial"></input>
                            <div className="h7">{this.state.errorMsg["spatial"]}</div>
                            <br/>
                            <label>Temporal Granularity</label>
                            <input className="w3-input" type="text" id="temporal"></input>
                            <div className="h7">{this.state.errorMsg["temporal"]}</div>
                            <br/>
                            <br/>
                            <label>Target Spatial Granularity</label>
                            <input className="w3-input" type="text" id="targetSpatial"></input>
                            <div className="h7">{this.state.errorMsg["targetSpatial"]}</div>
                            <br/>
                            <label>Target Temporal Granularity</label>
                            <input className="w3-input" type="text" id="targetTemporal"></input>
                            <div className="h7">{this.state.errorMsg["targetTemporal"]}</div>
                            <br/>
                        </div>
                        <div className="" >
                            <label>Mappings Method</label>
                            <br/>
                            <label>Spatial</label>
                            <br/>
                            <div className="row w3-panel w3-border" id="spatialMethodName">
                                <label className="col-50">Method Name</label>
                                <div className="col-50">
                                    <select id="spatialMethodName" name="spatialMethodName">
                                        <option value="nearest">Nearest</option>
                                        <option value="nearest">Nearest</option>
                                    </select>
                                </div>
                                <br/>
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
                            <br/>
                            <label>Temporal</label>
                            <br/>
                            <div className="row w3-panel w3-border" id="temporalMethodName">
                                <label className="col-50">Method Name</label>
                                <div className="col-50">
                                    <select id="temporalMethodName" name="temporalMethodName">
                                        <option value="nearest">Nearest</option>
                                        <option value="nearest">Nearest</option>
                                    </select>
                                </div>
                                <br/>
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
                                                <label htmlFor={valueId} className="col-25">Type</label>
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
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addGranuralityMapping}>Submit</button>

            </div>
        )
    }
}

export default Granularity;