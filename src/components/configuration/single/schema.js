import React from 'react';
import axios from 'axios';
import Api from '../../api';
import Granularity from "./granularity";
import Aggregation from "./aggregation";

class Schema extends React.Component {
    state = {
        featureName: "",
        attributes: [{ attributeName: "", attributeType: "" }],
        uuid: "",
        postingFeatures: [{ featureName: "", attributes: [], uuid: "" }],
        granularity:{spatial:"", temporal:"", targetSpatial:"", targetTemporal:"", spatialMapping: {}, temporalMapping:{}},
        aggregation:{aggregatedAttribute:"", spatialAggregation: {}, temporalAggregation:{}},
        schemaConfig:{postingFeatures:[], granularity: [], aggregation: []},
        errorMsg: { featureName: "", atttributes: "", uuid: "" },
        response: ""
    }

    api = new Api();

    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let id = e.target.dataset.id
        if (["attributeName", "attributeType"].includes(e.target.id)) {
            let attributes = [...this.state.attributes]
            attributes[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
            this.setState({ attributes }, () => {
                let err = '';
                if (!this.state.attributes[id]["attributeName"] ||
                    !this.state.attributes[id]["attributeType"]) {
                    err = "Attribute fields can not be empty";
                    errorMsg["atttributes"] = err
                    this.setState({ errorMsg });
                } else {
                    err = "";
                    errorMsg["atttributes"] = err
                    this.setState({ errorMsg });
                }
                //console.log(this.state.attributes)
            })
        }
        else {
            let error = ""
            if (!e.target.value) {
                error = `${e.target.name} field cannot be empty`
            }
            errorMsg["featureName"] = error
            this.setState({ errorMsg });
            this.setState({ [e.target.name]: e.target.value.toUpperCase() }, () => {
                console.log(this.state.featureName);
                console.log(this.state.uuid);
            })
        }


    }

    addGranularity = (granularity) =>{
        //console.log(granularity);
        this.setState({granularity:granularity})
    }

    addAggregation = (aggregation) =>{
        //console.log(aggregation);
        this.setState({aggregation:aggregation})
    }



    addAttribute = (e) => {
        this.setState((prevState) => ({
            attributes: [...prevState.attributes, { attributeName: "", attributeType: "" }]
        }));
    }
    removeAttribute = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayAttribute = this.state.attributes;
        if (arrayAttribute.length > 0) {
            arrayAttribute.splice(-1, 1)
        }
        errorMsg["atttributes"] = ""
        this.setState((prevState) => ({
            attributes: arrayAttribute,
            errorMsg: errorMsg
        }));
    }
    addFeature = (e) => {
        let errorMsg = this.state.errorMsg
        let error = ""
        errorMsg["featureName"] = error
        let postingFeatues = {
            featureName: this.state.featureName,
            attributes: this.state.attributes,
            uuid: this.state.uuid
        }
        console.log(postingFeatues)
        if (!this.state.featureName) {
            error = `Feature name field cannot be empty`
            errorMsg["featureName"] = error
            this.setState({ errorMsg });
        }
        else if (this.state.errorMsg["attributes"]) {
        } else {
            this.setState({
                postingFeatures: [postingFeatues]
            }, () => {
                console.log(this.state.postingFeatures);
            });

            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
            );
            errorMsg = { featureName: "", atttributes: "", uuid: "" }
            this.setState({ errorMsg })
            this.setState((prevState) => ({
                featureName: "",
                attributes: [{ attributeName: "", attributeType: "" }],
                uuid: "",
                postingFeatures: [...prevState.postingFeatures, { featureName: "", attributes: {}, uuid: "" }],
                errorMsg: { featureName: "", atttributes: "", uuid: "" }
            }));
        }
    }
    removeFeature = (e) => {
        var arrayFeature = this.state.postingFeatures;
        if (arrayFeature.length > 1) {
            arrayFeature.splice(-1, 1)
        }
        this.setState((prevState) => ({
            postingFeatures: arrayFeature,
            errorMsg: { featureName: "", atttributes: "", uuid: "" }
        }), () => {
            console.log(this.state.postingFeatures)
        });
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
    }

    postConfigurations = (e) => {
        let schemaConfig = this.state.schemaConfig;
        schemaConfig["postingFeatures"] = this.state.postingFeatures[0];
        schemaConfig["granularity"] = this.state.granularity;
        schemaConfig["aggregation"] = this.state.aggregation;
        console.log(schemaConfig);
        let response = this.api.configureSchema(schemaConfig);
        console.log(response);
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let { attributes } = this.state
        return (
            <div className="w3-border">
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
                                let nameId = `name-${idx}`, typeId = `type-${idx}`
                                return (
                                    <div key={idx} className="row w3-panel w3-border">
                                        <label htmlFor={nameId} className="col-25">Attribute #{idx + 1}</label>
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
                                        <br />
                                    </div>
                                )
                            })
                        }
                        <div className="h7">{this.state.errorMsg["atttributes"]}</div>
                        <br />
                        <button className="w3-button w3-circle w3-teal" onClick={this.removeAttribute}>-</button>
                        <button className="w3-button w3-circle w3-teal" onClick={this.addAttribute}>+</button>
                        <br /><br />
                        <label>UUID</label>
                        <input className="w3-input" type="text" name="uuid"></input>
                    </h6>
                    <button className="w3-btn w3-white w3-border w3-border-red w3-round-large" onClick={this.removeFeature}>Remove</button>
                    <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addFeature}>Add Feature</button>
                    <br />
                </form>
                <div> <Granularity addGranularity={this.addGranularity}/></div>
                <div> <Aggregation addAggregation = {this.addAggregation}/></div>
                <div className="response w3-panel w3-border">{this.state.response}</div>
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.postConfigurations}>Submit</button>
            </div>
        );
    }
}

export default Schema;