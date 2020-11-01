import React from 'react';
import axios from 'axios';

class SchemaConfig extends React.Component {
    state = {
        featureName:"",
        attributes: [{ attribute: "", attributeName: "", attributeType: "", derived: "" }],
        configurations:[{geom:"POINT", dtg:"YYYYMMDD", featureId:""}],
        features: [{featureName:"", attributes: [], configurations:[] }],
        errorMsg:{featureName:"", atttributes:"", configurations:""},
        response:""
    }
    
 
    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let id =  e.target.dataset.id
        if (["attribute", "attributeName", "attributeType", "derived"].includes(e.target.id)) {
            let attributes = [...this.state.attributes]
            console.log("data set id:", e.target.dataset.id)
            attributes[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
            this.setState({ attributes }, () => {
                let err = '';
                if(!this.state.attributes[id]["attribute"] ||!this.state.attributes[id]["attributeName"]||
                !this.state.attributes[id]["attributeType"]||!this.state.attributes[id]["derived"] ){
                    err = "Attribute fieldS can not be empty";
                    errorMsg["atttributes"] = err
                    this.setState({errorMsg});
                } else {
                    err = "";
                    errorMsg["atttributes"] = err
                    this.setState({errorMsg}); 
                }
                //console.log(this.state.attributes)
            })
        } else if (["geom","dtg","featureId"].includes(e.target.id)) {
            console.log("configuration change")
            let configurations = [...this.state.configurations]
            let error = ""
            errorMsg["configurations"] = error
            this.setState({errorMsg})
            configurations[0][e.target.id] = e.target.value.toUpperCase()
            this.setState({ configurations }, () => {
                let err = '';
                if(!this.state.configurations[0]["featureId"] ){
                    err = "FeatureId field can not be empty";
                    errorMsg["configurations"] = err
                    this.setState({errorMsg});
                } else {
                    err = "";
                    errorMsg["configurations"] = err
                    this.setState({errorMsg}); 
                }
            })
        }
        else {
            let error = ""
            if (!e.target.value) {
                error = `${e.target.name} field cannot be empty`
            }
            errorMsg["featureName"] = error
            this.setState({errorMsg});
            this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }
        

    }

    addAttribute = (e) => {
        this.setState((prevState) => ({
            attributes: [...prevState.attributes, { attribute: "", attributeName: "", attributeType: "", derived: "" }],
            records: [...prevState.records, { attributeName: "", columnNumber: "" }],
        }));
    }
    removeAttribute = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayAttribute = this.state.attributes;
        var arrayRecord = this.state.records;
        if (arrayAttribute.length > 0) {
            arrayAttribute.splice(-1, 1)
            arrayRecord.splice(-1, 1)
        }
        errorMsg["atttributes"] = ""
        this.setState((prevState) => ({
            attributes: arrayAttribute,
            records: arrayRecord,
            errorMsg: errorMsg
        }));
    }
    addFeature = (e) => {
        let errorMsg = this.state.errorMsg
        let error = ""
        errorMsg["featureName"] = error
        errorMsg["configurations"] = error
        if (!this.state.featureName) {
            error = `Feature name field cannot be empty`
            errorMsg["featureName"] = error
            this.setState({errorMsg});
        }
        else if(!this.state.configurations[0]["featureId"]){
            error = `FeatureId field cannot be empty`
            errorMsg["configurations"] = error
            this.setState({errorMsg});
        } else if(this.state.errorMsg[1] ){
        } else {
            console.log(this.state.errorMsg)
            var id = this.state.features.length
            let features = [...this.state.features]
            features[id - 1]["featureName"] = this.state.featureName
            features[id - 1]["attributes"] = this.state.attributes
            features[id - 1]["records"] = this.state.records
            features[id - 1]["configurations"] = this.state.configurations
            this.setState({ features }, () => {
                console.log(this.state.features)

            })
            this.setState((prevState) => ({
                features: [...prevState.features, {featureName:"", attributes: [], records: [], configurations:[] }],
                attributes:[{ attribute: "", attributeName: "", attributeType: "", derived: "" }],
                records : [{ attributeName: "", columnNumber: "" }],
                configurations: [{geom:"POINT", dtg:"YYYYMMDD", featureId:""}],
                featureName:""
            }))

            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
            );
            errorMsg = {featureName:"", atttributes:"", records:"", configurations:""}
            this.setState({errorMsg})
        }
        }
    removeFeature = (e) => {
        var arrayFeature = this.state.features;
        if (arrayFeature.length > 1) {
            arrayFeature.splice(-1, 1)
        }
        this.setState((prevState) => ({
            features: arrayFeature,
            errorMsg: {featureName:"", atttributes:"", records:"", configurations:""}
        }),()=>{
            console.log(this.state.features)
        });
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
          );
    }

    postConfigurations = (e) =>{
        let response = this.state.response
        if(!this.state.errorMsg["featureName"] & !this.state.errorMsg["atttributes"] & !this.state.errorMsg["configurations"]){
            axios
            .post('https://localhost:8080', this.state.features)
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
        let { attributes, records, features } = this.state
        return (
            <div>
                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h6>
                        <label>Feature Name</label>
                        <input className="w3-input" type="text" name="featureName"></input>
                        <div className="h7">{this.state.errorMsg["featureName"]}</div>
                        <br />
                        <label>Attributes</label>
                        <br /><br />
                        {
                            attributes.map((val, idx) => {
                                let attributeId = `attribute-${idx}`, nameId = `name-${idx}`, typeId = `type-${idx}`, derivedId = `derive-${idx}`
                                return (
                                    <div key={idx} className="row w3-panel w3-border">
                                        <label htmlFor={attributeId} className="col-25">Attribute #{idx + 1}</label>
                                        <input
                                            type="text"
                                            name={attributeId}
                                            data-id={idx}
                                            id="attribute"
                                            value={attributes[idx].atr}
                                            className="col-75"
                                        />
                                        <label htmlFor={nameId} className="col-25">Name</label>
                                        <input
                                            type="text"
                                            name={nameId}
                                            data-id={idx}
                                            id="attributeName"
                                            value={attributes[idx].ame}
                                            className="col-75"
                                        />
                                        <label htmlFor={typeId} className="col-25">Type</label>
                                        <input
                                            type="text"
                                            name={typeId}
                                            data-id={idx}
                                            id="attributeType"
                                            value={attributes[idx].type}
                                            className="col-75 "
                                        />
                                        <label htmlFor={typeId} className="col-25">Derived</label>
                                        <input
                                            type="text"
                                            name={derivedId}
                                            data-id={idx}
                                            id="derived"
                                            value={attributes[idx].derv}
                                            className="col-75 "
                                        />
                                        <br />
                                    </div>
                                )
                            })
                        }
                        <div className="h7">{this.state.errorMsg["atttributes"]}</div>
                        <br />
                        <button className="w3-button w3-circle w3-teal" onClick={this.removeAttribute}>-</button>
                        <button className="w3-button w3-circle w3-teal" onClick={this.addAttribute}>+</button>
                        
                        {/* <label>Records</label>
                        <br />
                        <label className="col-50">Name</label>
                        <label className="col-50">Column Index</label> */}
                        {/* {
                            records.map((val, idx) => {
                                let attributeName = val["attributeName"]
                                return (
                                    <div key={idx} className="row">
                                        <input
                                            type="text"
                                            name={attributeName}
                                            data-id={idx}
                                            id="columnNumber"
                                            value={val["attributeName"]}
                                            readOnly
                                            className="col-25"
                                        />
                                        <label className="col-25"></label>
                                        <input
                                            type="text"
                                            name={attributeName}
                                            data-id={idx}
                                            id="columnNumber"
                                            value={records[idx].atr}
                                            className="col-25"
                                        />
                                        {this.state.errorMsg[2]}
                                    </div>
                                )
                            })
                        } */}
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
                    </h6>
                    <button className="w3-btn w3-white w3-border w3-border-red w3-round-large" onClick={this.removeFeature}>Remove</button>
                    <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addFeature}>Add Feature</button>
                    <br/>
                </form>
                <div className="response w3-panel w3-border">{this.state.response}</div> 
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.postConfigurations}>Submit</button>     
            </div>
        );
    }
}

export default SchemaConfig;