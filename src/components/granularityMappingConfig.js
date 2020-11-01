import React from 'react';
import axios from 'axios';
class GranularityMappingConfig extends React.Component {
    state = {
        baseGran:{spatial:"", temporal:""},
        spatial:{spatialGranType:"", spatialGran:"", spatialMap:""},
        temporal:{temporalGranType:"", temporalGran:"", temporalMap:""},
        mappings:{featureName:"", spatial:{},temporal:{}},
        granularityMappingConfig:{baseGran:{},mappings:{}},
        errorMsg:{spatial:"",temporal:"", featureName:"" ,spatialGran:"", temporalGran:""},
        response:""
    }
    
 
    handleChange = (e) => {
        let mappings = this.state.mappings
        let errorMsg = {spatial:"",temporal:"", featureName:"" ,spatailGran:"", tempGran:""}
        this.setState({errorMsg})
        if(["spatial","temporal"].includes(e.target.id)){
            let baseGran = this.state.baseGran
            baseGran[e.target.id] = e.target.value.toUpperCase()
            this.setState({baseGran},()=>{
                console.log(baseGran)
            })
        } else if(["temporalGranType","temporalGran","temporalMap"].includes(e.target.id)){
            let temporal = this.state.temporal
            temporal[e.target.id] = e.target.value.toUpperCase()
            mappings["temporal"] = temporal
            this.setState({mappings},()=>{
                console.log(mappings)
            })
        } else if(["spatialGranType","spatialGran","spatialMap"].includes(e.target.id)){
            let spatial = this.state.spatial
            spatial[e.target.id] = e.target.value.toUpperCase()
            mappings["spatial"] = spatial
            this.setState({mappings},()=>{
                console.log(mappings)
            })
             
        } else {
            let mappings = this.state.mappings
            mappings[e.target.id] = e.target.value.toUpperCase()
            this.setState({mappings},()=>{
                console.log(mappings)
            })
        }
    }

    addGranuralityMapping = () =>{
        let granularityMappingConfig = this.state.granularityMappingConfig
        let errorMsg = this.state.errorMsg
        let err = '';
        granularityMappingConfig["baseGran"] = this.state.baseGran
        granularityMappingConfig["mappings"] = this.state.mappings
        if(!this.state.baseGran["spatial"]){
            err = "Spatial can not be null value"
            errorMsg["spatial"] = err
            this.setState({errorMsg})
        }else if(!this.state.baseGran["temporal"]){
            err = "Temporal can not be null value"
            errorMsg["temporal"] = err
            this.setState({errorMsg})
        } else if(!this.state.mappings["featureName"]){
            err = "Feature name fields can not be empty"
            errorMsg["featureName"] = err
            this.setState({errorMsg})
        } else if(!this.state.mappings["spatial"]["spatialGran"]){
            err = "Spatial granularity can not null value"
            errorMsg["spatialGran"] = err
            this.setState({errorMsg})
        } else if(!this.state.mappings["temporal"]["temporalGran"]){
            err = "Temporal granularity can not be null value"
            errorMsg["temporalGran"] = err
            this.setState({errorMsg})
        }else{
            this.setState({granularityMappingConfig},()=>{
                console.log(granularityMappingConfig)
                this.postConfigurations()
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

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let {spatial, granularity,aggregationGran,featureGran} = this.state
        return(
        <div >
            <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h6>
                    <div className="w3-panel w3-border">
                        <label>Base Granularity</label>
                        <br/>
                        <label>Spatial</label>
                        <input className="w3-input" type="text" id="spatial"></input>
                        <div className="h7">{this.state.errorMsg["spatial"]}</div>
                        <br/>
                        <label>Temporal</label>
                        <input className="w3-input" type="text" id="temporal"></input>
                        <div className="h7">{this.state.errorMsg["temporal"]}</div>
                        <br/>
                    </div>
                    <div className="w3-panel w3-border" >
                    <label>Mappings</label>
                    <br/>
                    <label>Feature Name</label>
                    <input className="w3-input" type="text" id="featureName"></input>
                    <div className="h7">{this.state.errorMsg["featureName"]}</div>
                    <br/>
                    <label>Spatial</label>
                    <br/>
                    <div className="row" id="spatial">
                        <label className="col-50">Spatial Granularity Type</label>
                        <div className="col-50">
                            <select id="spatialGranType" name="type">
                                <option value="point">Point</option>
                                <option value="polygon">Polygon</option>
                                <option value="multipolygon">Multi Polygon</option>
                            </select>
                        </div>
                        <br/>
                        <label className="col-50">Spatial Granularity</label>
                        <input className="col-50" type="text" id="spatialGran"></input>
                        <div className="h7">{this.state.errorMsg["spatialGran"]}</div>
                        <br/> <br/>
                        <label className="col-50">Spatial Mapping</label>
                        <div className="col-50">
                            <select id="spatialMap" name="type">
                                <option value="nearest">Nearest</option>
                                <option value="nearest">Nearest</option>
                             </select>
                        </div>  
                    </div>
                    <br/>
                    <label>Temporal</label>
                    <br/>
                    <div className="row" id="temporal">
                    <label className="col-50">Temporal Granularity Type</label>
                        <div className="col-50">
                            <select id="temporalGranType" name="type">
                                <option value="duration">Duration</option>
                                <option value="duration">Duration</option>
                            </select>
                        </div>
                        <br/><br/><br/>
                        <label className="col-50">Temporal Granularity</label>
                        <input className="col-25" type="text" id="temporalGran"></input>
                        <div className="h7">{this.state.errorMsg["temporalGran"]}</div>
                        <br/><br/>
                        <label className="col-50">Temporal Mapping</label>
                        <div className="col-50">
                            <select id="temporalMap" name="type">
                                <option value="mean">Mean</option>
                                <option value="median">Median</option>
                            </select>
                        </div>
                    </div>
                    </div>
                </h6>
            </form>
            <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addGranuralityMapping}>Submit</button>
               
        </div>
        )
    }
}

export default GranularityMappingConfig;