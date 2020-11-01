import React from 'react';
import axios from 'axios';
class GranularityConfig extends React.Component {
    state = {
        featureName:"",
        spatial:{type:"point",granularityId:""},
        aggregationGran:{temporal:"Daily",spatial:{}},
        featureGran:[{featureName:"",temporal:"point", spatial:{}}],
        granularityConfig:{aggregationGran:{},featureGran:[]},
        errorMsg:{aggragationGran:"", featureGran:""},
        response:""
    }
    
 
    handleChange = (e) => {
        let id =  e.target.dataset.id
        let errorMsg = {aggragationGran:"", featureGran:""}
        this.setState({errorMsg})
        let err = '';
        if (["temporal","type","granularityId"].includes(e.target.id)) {
            let spatial = this.state.spatial
            let aggragationGran = this.state.aggregationGran
            if(e.target.id==="temporal"){
                aggragationGran[e.target.id] = e.target.value.toUpperCase()
            } else {
                spatial[e.target.id] = e.target.value.toUpperCase()
                aggragationGran["spatial"] = spatial
            }
            this.setState({aggragationGran},()=>{
                console.log(aggragationGran)
            })
            
        } else if(["ftemporal","ftype","fgranularityId"].includes(e.target.id)){
            let spatial = this.state.spatial
            let featureGran = this.state.featureGran
            if(e.target.id==="ftype" || e.target.id==="fgranularityId"){
                spatial[e.target.name] = e.target.value.toUpperCase()
                featureGran[id]["spatial"] = spatial
            } else {
                featureGran[id][e.target.name] = e.target.value.toUpperCase()
                
            }
            this.setState({featureGran},()=>{
               
                if(!this.state.featureGran[id]["spatial"]["granularityId"]){
                    err = "Feature Granularity id can not be null";
                    errorMsg["featureGran"] = err
                    this.setState({errorMsg});
                }
                else if(!this.state.featureGran[id]["featureName"]){
                   err = "Feature name can not be null"
                    errorMsg["featureGran"] = err
                    this.setState({errorMsg});
                } else {
                    err = "";
                    errorMsg["featureGran"] = err
                    this.setState({errorMsg}); 
                }
                console.log(this.state.featureGran)
            })
        } else {
            let featureGran = this.state.featureGran
            featureGran[id][e.target.name] = e.target.value.toUpperCase()
            this.setState({featureGran},()=>{
                if(!this.state.featureGran[id]["spatial"]["granularityId"]){
                    err = "Feature Granularity id can not be null";
                    errorMsg["featureGran"] = err
                    this.setState({errorMsg});
                }
            })
        }
    }
    addFeatureGran = () =>{
        this.setState((prevState) => ({
            featureGran: [...prevState.featureGran, {featureName:"",temporal:"", spatial:{}}],
        }));
    }
    removeFeatureGran = (e) => {
        
        var arrayFeatureGran = this.state.featureGran
        if (arrayFeatureGran.length > 0) {
            arrayFeatureGran.splice(-1, 1)
        }
        this.setState((prevState) => ({
            featureGran: arrayFeatureGran
        }));
    }
    addGranurality = ()=>{
        let granuralityConfig = this.state.granularityConfig
        let errorMsg = this.state.errorMsg
        let err = '';
        var id = this.state.featureGran.length
        granuralityConfig["aggregationGran"] = this.state.aggregationGran
        granuralityConfig["featureGran"] = this.state.featureGran
        if(!this.state.aggregationGran["spatial"]["granularityId"]){
            err = "Granularity id can not be empty"
            errorMsg["aggregationGran"] = err
            this.setState({errorMsg})
        } else if(!this.state.featureGran[id-1]["featureName"]){
            err = "Feature Name fields can not be null"
            errorMsg["featureGran"] = err
            this.setState({errorMsg})
        } else {
            this.setState({ granuralityConfig }, () => {
            console.log(this.state.granularityConfig)
            this.postConfigurations()

        })
    }
    }
    postConfigurations=()=>{
        let response = this.state.response
        if(!this.state.errorMsg["aggragationGran"] & !this.state.errorMsg["featureGran"]){
            axios
            .post('https://localhost:8080', this.state.granularityConfig)
            .then(response =>{
                console.log(response)
            })
            .catch(error =>{
                console.log(error)
            })
        } else {
            console.log("error found")
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let {featureGran} = this.state
        return(
        <div >
            <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h6>
                    <div className="w3-panel w3-border">
                        <label>Aggragation granularities</label>
                        <br />
                        <div className="row" id="aggragationGran">
                            <label className="col-50">Temporal</label>
                            <div className="col-50">
                                <select id="temporal" name="temporal">
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>
                            <br/><br/>
                            <label className="col-50">Spatial</label>
                            <br/> <br/>
                            <label className="col-50">Type</label>
                            <div className="col-50">
                                <select id="type" name="type">
                                    <option value="point">Point</option>
                                    <option value="polygon">Polygon</option>
                                    <option value="multipolygon">Multi Polygon</option>
                                </select>
                            </div>
                            <label className="col-50">Granularity Id</label>
                            <input className="col-25" type="text" id="granularityId"></input>
                        </div>
                        <div className="h7">{this.state.errorMsg["aggregationGran"]}</div>
                    </div>
                    <label>Feature Granularities</label>
                    <br/>
                    {
                        featureGran.map((val,idx)=>{
                            return (
                                <div key={idx} className="w3-panel w3-border">
                                <br/>
                                <label>Feature Name</label>
                                <input className="w3-input" data-id={idx} type="text" name="featureName"></input>
                                <div className="row" id="granularities">
                                    <label className="col-50">Temporal</label>
                                    <div className="col-50">
                                        <select data-id={idx} id="ftemporal" name="temporal">
                                            <option value="Daily">Daily</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="Monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <br/><br/>
                                    <label className="col-50">Spatial</label>
                                    <br/> <br/>
                                    <label className="col-50">Type</label>
                                    <div className="col-50">
                                        <select data-id={idx} id="ftype" name="type">
                                            <option value="point">Point</option>
                                            <option value="polygon">Polygon</option>
                                            <option value="multipolygon">Multi Polygon</option>
                                        </select>
                                    </div>
                                    <label className="col-50">Granularity Id</label>
                                    <input className="col-25" data-id={idx} type="text" id="fgranularityId" name="granularityId"></input>
                                </div> 
                                </div>
                            )
                        })
                    
                    }
                    <div className="h7">{this.state.errorMsg["featureGran"]}</div>
                    <button className="w3-button w3-circle w3-teal" onClick={this.removeFeatureGran}>-</button>
                    <button className="w3-button w3-circle w3-teal" onClick={this.addFeatureGran}>+</button>
                </h6>
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addGranurality}>Submit</button>
                
            </form>

        </div>
        )
    }
}

export default GranularityConfig;