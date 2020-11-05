import React from 'react';
import axios from 'axios';
class IngestConfig extends React.Component {
    state = {
        featureName:"",
        records: [{ attributeName: "", columnNumber: "" }],
        configurations:{geom:"POINT", dtg:"YYYYMMDD", featureId:""},
        dataSource:"",
        shpFile:{shpSource:"", shpFeatureId:""},
        ingester:{featureName:"", records:[], configuration:{}, dataSource:"", shpFile:{}},
        errorMsg:{featureName:"", records:"", dataSource:"", configurations:""},
        response:""
    }
    
 
    handleChange = (e) => {
        let errorMsg = {featureName:"", records:"", dataSource:"", configurations:""}
        let val = e.target.value;
        let err = '';
        this.setState({errorMsg})
        if (["attributeName","columnNumber"].includes(e.target.id)) {
            let records = [...this.state.records]
            if(e.target.id=="columnNumber"){
                if (val !=="" && !Number(val)) {
                    err = "Index must be a number";
                }
                errorMsg["records"] = err
                this.setState({errorMsg});
            }
            records[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
            this.setState({ records },()=>{
                console.log(records)
            })
        }else if (["geom","dtg","featureId"].includes(e.target.id)) {
            let configurations = this.state.configurations
            configurations[e.target.id] = e.target.value.toUpperCase()
            this.setState({ configurations },()=>{
                console.log(configurations)
            })
        } else if(["shpSource","shpFeatureId"].includes(e.target.id)){
            let shpFile = this.state.shpFile
            shpFile[e.target.id] = e.target.value.toUpperCase()
            this.setState({ shpFile },()=>{
                console.log(shpFile)
            }) 
        } else {
            this.setState({ [e.target.name]: e.target.value.toUpperCase() },()=>{
                console.log(this.state.featureName)
            })
        }
    }
    addRecord = () =>{
        this.setState((prevState) => ({
            records: [...prevState.records, { attributeName: "", columnNumber: "" }],
        }));
    }

    addIngestion = ()=>{
        let ingester = this.state.ingester
        let errorMsg = this.state.errorMsg
        let err = '';
        ingester["featureName"] = this.state.featureName
        ingester["records"] = this.state.records
        ingester["configuration"] = this.state.configurations
        ingester["dataSource"] = this.state.dataSource
        ingester["shpFile"] = this.state.shpFile
        if(!this.state.featureName){
            err = "Feature name can not be empty"
            errorMsg["featureName"] = err
            this.setState({errorMsg})
        } else if(this.state.records.includes()){
            err = "Record field can not be empty"
            errorMsg["records"] = err
            this.setState({errorMsg})
        }else if(!this.state.configurations["featureId"]){
            err = "Feature Id can not be empty"
            errorMsg["configurations"] = err
            this.setState({errorMsg})
        } else if(!this.state.dataSource){
            err = "Data source can not be empty"
            errorMsg["dataSource"] = err
            this.setState({errorMsg})
        } else {
            this.setState({ ingester }, () => {
                console.log(this.state.ingester)
                this.postConfigurations()
            })
    }
    }
    removeRecord = (e) => {
        var arrayRecord = this.state.records;
        if (arrayRecord.length > 0) {
            arrayRecord.splice(-1, 1)
        }
        this.setState((prevState) => ({
            records: arrayRecord
        }));
    }

    postConfigurations=()=>{
        let response = this.state.response
        if(!this.state.errorMsg["featureName"] & !this.state.errorMsg["records"] & !this.state.errorMsg["configurations"] & !this.state.errorMsg["dataSource"] ){
            axios
            .post('https://localhost:8080/ingest', this.state.ingester)
            .then(response =>{
                console.log(response)
            })
            .catch(error =>{
                console.log(error)
            })
        }else{
            console.log("found error")
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let {records, shpFile} = this.state
        return(
        <div className="w3-border" >
            <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h6>
                <label>Feature Name</label>
                <input className="w3-input" type="text" name="featureName"></input>
                <div className="h7">{this.state.errorMsg["featureName"]}</div>
                <br />
                 <label>Records</label>
                <br />
                <label className="col-50">Name</label>
                <label className="col-25"></label>
                <label className="col-25">Index</label>
                {
                    records.map((val, idx) =>{
                        return(
                            <div key={idx} className="row">
                                <input
                                    type="text"
                                    data-id={idx}
                                    id="attributeName"
                                    value={records[idx].atr}
                                    className="col-50"
                                />
                                <label className="col-25"></label>
                                <input
                                    type="text"
                                    data-id={idx}
                                    id="columnNumber"
                                    value={records[idx].atr}
                                    className="col-25"
                                />
                            </div>
                        )
                    })
                }
                <div className="h7">{this.state.errorMsg["records"]}</div>
                <br/>
                <button className="w3-button w3-circle w3-teal" onClick={this.removeRecord}>-</button>
                <button className="w3-button w3-circle w3-teal" onClick={this.addRecord}>+</button>
                <br /><br />
                <label>Configuration</label>
                <br />
                <div className="row" id="configuration">
                    <label className="col-50">GeomFormat</label>
                    <div className="col-50">
                        <select id="geom" name="geom">
                            <option value="point">Point</option>
                            <option value="polygon">Polygon</option>
                            <option value="multipolygon">Multi Polygon</option>
                        </select>
                    </div>
                    <label className="col-50">DateTimeFormat</label>
                    <div className="col-50">
                        <select id="dtg" name="dtg" >
                            <option value="yyyyMMdd">yyyy/mm/dd</option>
                            <option value="ddMMyyyy">dd/mm/yyyy</option>
                            <option value="MMddyyyy">mmm/dd/yyyy</option>
                        </select>
                    </div>
                    <label className="col-50">FeatureID</label>
                    <input className="col-25" type="text" id="featureId"></input>
                    <div className="h7">{this.state.errorMsg["configurations"]}</div>
                </div>
                <br/>
                <label>Data Source</label>
                <input className="w3-input" type="text" name="dataSource"></input>
                <div className="h7">{this.state.errorMsg["dataSource"]}</div>
                <br /><br />
                <label>Shape File</label>
                <br />
                <label className="col-25">Source</label>
                <input
                    type="text"
                    id="shpSource"
                    className="col-75"
                />
                <label className="col-25">Feature Id</label>
                <input
                    type="text"
                    id="shpFeatureId"
                    className="col-75"
                />
                
                
                </h6>
            </form>
            <br/>
            <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addIngestion}>Submit</button>
        </div>
        )
    }
}

export default IngestConfig;