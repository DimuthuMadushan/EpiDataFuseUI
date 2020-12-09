import React from 'react';
import axios from 'axios';
import Api from '../../api';
import Granularity from "./granularity";
import Aggregation from "./aggregation";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


class Schema extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pipelineName: this.props.pipelineName,
            featureName: null,
            attributes: [{ attribute_name: null, attribute_type: null }],
            postingFeatures: [{ featureName: null, attributes: [] }],
            granularity: { spatial_granularity: null, temporal_granularity: null, target_spatial_granularity: null, target_temporal_granularity: null, granularity_mapping: { spatial_mapping_method: {}, temporal_mapping_method: {} } },
            aggregation: { aggregatedAttribute: null, spatialAggregation: {}, temporalAggregation: {} },
            schemaConfig: { pipeline_name: null, feature_name: null, attributes: [], granularity_config: [], aggregation_config: [] },
            errorMsg: { featureName: null, atttributes: null },
            response: null
        };

        this.api = new Api();
    }

    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let schemaConfig = this.state.schemaConfig;
        let id = e.target.dataset.id
        if (["attribute_name", "attribute_type"].includes(e.target.id)) {
            let attributes = [...this.state.attributes]
            attributes[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
            this.setState({ attributes }, () => {
                let err = '';
                if (!this.state.attributes[id]["attribute_name"] ||
                    !this.state.attributes[id]["attribute_type"]) {
                    err = "Attribute fields can not be empty";
                    errorMsg["atttributes"] = err
                    this.setState({ errorMsg });
                } else {
                    err = "";
                    errorMsg["atttributes"] = err
                    this.setState({ errorMsg });
                }
            })
            schemaConfig["attributes"] = this.state.attributes;
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
                schemaConfig["feature_name"] = this.state.featureName;
            })
        }
    }

    componentDidMount() {
        var id = this.props.pipelineName
        this.setState({ pipelineName: id })
    }


    addGranularity = (granularity) => {
        //console.log(granularity);
        this.setState({ granularity: granularity })
    }

    addAggregation = (aggregation) => {
        //console.log(aggregation);
        this.setState({ aggregation: aggregation })
    }

    addAttribute = (e) => {
        this.setState((prevState) => ({
            attributes: [...prevState.attributes, { attribute_name: "", attribute_type: "" }]
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
            errorMsg = { featureName: "", atttributes: "" }
            this.setState({ errorMsg })
            this.setState((prevState) => ({
                featureName: "",
                attributes: [{ attribute_name: "", attribute_type: "" }],
                postingFeatures: [...prevState.postingFeatures, { featureName: "", attributes: {} }],
                errorMsg: { featureName: "", atttributes: "" }
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
            errorMsg: { featureName: "", atttributes: "" }
        }), () => {
            console.log(this.state.postingFeatures)
        });
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
    }

    postConfigurations = (e) => {
        let schemaConfig = this.state.schemaConfig;
        schemaConfig["pipeline_name"] = this.state.pipelineName;
        // schemaConfig["feature_name"] = this.state.postingFeatures[0]["feature_name"];
        // schemaConfig["attributes"] = this.state.postingFeatures[0]["attributes"];
        // schemaConfig["uuid_attribute_name"] = this.state.postingFeatures[0]["uuid"];
        schemaConfig["granularity_config"] = this.state.granularity;
        schemaConfig["aggregation_config"] = this.state.aggregation;
        console.log(schemaConfig);
        let response = this.api.configureSchema(schemaConfig);
        console.log(response);
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    handleFN = (e) => {
        this.setState({ featureName: e.target.value })
    }

    render() {
        let { attributes } = this.state
        return (
            <div className="w3-border" style={{ marginTop: 20, padding: 10 }}>
                <form className="" style={{ padding: 10 }} onSubmit={this.handleSubmit} onChange={this.handleChange}>

                    <div className="row">
                        <TextField id="featurename" className="col-50" name="featurename" onChange={this.handleFN}
                            value={this.state.featureName} label="Feature name" />
                        <div className="h7">{this.state.errorMsg["featureName"]}</div>
                    </div>

                    <div className="w3-border row" style={{ marginTop: 10, padding: 10 }}>

                        <Typography style={{
                            fontSize: 14,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder',
                            marginTop: 10
                        }}>Attributes</Typography>
                        {
                            attributes.map((val, idx) => {
                                let nameId = `name-${idx}`, typeId = `type-${idx}`
                                return (
                                    <div key={idx} className="row">
                                        <TextField
                                            name="attribute_name"
                                            data-id={idx}
                                            id="attribute_name"
                                            value={attributes[idx].ame}
                                            className="col-50"
                                            label="Attribute Name" />
                                        <TextField
                                            style={{ marginLeft: 10 }}
                                            name="attribute_type"
                                            data-id={idx}
                                            id="attribute_type"
                                            value={attributes[idx].type}
                                            className="col-25"
                                            label="Attribute Type" />
                                    </div>
                                )
                            })
                        }

                        <div className="h7">{this.state.errorMsg["atttributes"]}</div>
                        <br />
                        <button className="w3-button w3-circle w3-teal" onClick={this.removeAttribute}>-</button>
                        <button className="w3-button w3-circle w3-teal" onClick={this.addAttribute}>+</button>
                        <br /><br />
                        {/*<label>UUID</label>*/}
                        {/*<input className="w3-input" type="text" name="uuid"></input>*/}
                        {/*<button className="w3-btn w3-white w3-border w3-border-red w3-round-large" onClick={this.removeFeature}>Remove</button>*/}
                        {/*<button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addFeature}>Add Feature</button>*/}
                        <br />
                    </div>
                </form>

                <div> <Granularity addGranularity={this.addGranularity} /></div>
                <div> <Aggregation addAggregation={this.addAggregation} /></div>
                <div className="response w3-panel w3-border">{this.state.response}</div>
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.postConfigurations}>Submit</button>

            </div>
        );
    }
}

export default Schema;