import React from 'react';
import axios from 'axios';
import Api from '../../api';

class BulkIngest extends React.Component {
    state = {
        feature_name: "",
        source_type: "",
        source_format: "",
        transformations: [{ attribute_name: "", transformations: "" }],
        geomConfigurations: [{ geomFormat: "POINT", dataSource: "", featureId: "" }],
        data_sources: [{ source: "" }],
        postingFeatures: [],
        errorMsg: { feature_name: "", source_type: "", source_format: "", transformations: "", geomConfiguration: "" },
        response: ""
    }

    api = new Api();

    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let id = e.target.dataset.id
        if (["attribute_name", "attributeType"].includes(e.target.id)) {
            let transformations = [...this.state.transformations]
            console.log("data set id:", e.target.dataset.id)
            transformations[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
            this.setState({ transformations }, () => {
                let err = '';
                if (!this.state.transformations[id]["attribute_name"] ||
                    !this.state.transformations[id]["transformations"]) {
                    err = "Attribute fieldS can not be empty";
                    errorMsg["transformations"] = err
                    this.setState({ errorMsg });
                } else {
                    err = "";
                    errorMsg["transformations"] = err
                    this.setState({ errorMsg });
                }
                //console.log(this.state.attributes)
            })
        } else if (["geomFormat", "dataSource", "featureId"].includes(e.target.id)) {
            console.log("configuration change")
            let geomConfigurations = [...this.state.configurations]
            let error = ""
            errorMsg["geomConfigurations"] = error
            this.setState({ errorMsg })
            geomConfigurations[0][e.target.id] = e.target.value.toUpperCase()
            this.setState({ geomConfigurations }, () => {
                let err = '';
                if (!this.state.geomConfigurations[0]["featureId"]) {
                    err = "FeatureId field can not be empty";
                    errorMsg["geomConfigurations"] = err
                    this.setState({ errorMsg });
                } else {
                    err = "";
                    errorMsg["geomConfigurations"] = err
                    this.setState({ errorMsg });
                }
            })
        }
        else {
            let error = ""
            if (!e.target.value) {
                error = `${e.target.name} field cannot be empty`
            }
            errorMsg[e.target.id] = error
            this.setState({ errorMsg });
            this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }


    }

    addAttribute = (e) => {
        this.setState((prevState) => ({
            transformations: [...prevState.transformations, { attribute_name: "", transformations: "" }]
        }));
    }
    removeAttribute = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayTransformation = this.state.transformations;
        if (arrayTransformation.length > 0) {
            arrayTransformation.splice(-1, 1)
        }
        errorMsg["transformations"] = ""
        this.setState((prevState) => ({
            transformations: arrayTransformation,
            errorMsg: errorMsg
        }));
    }
    addSource = (e) => {
        this.setState((prevState) => ({
            data_sources: [...prevState.data_sources, { source: "" }]
        }));
    }
    removeSource = (e) => {
        let errorMsg = this.state.errorMsg
        var arraySources = this.state.data_sources;
        if (arraySources.length > 0) {
            arraySources.splice(-1, 1)
        }
        errorMsg["data_sources"] = ""
        this.setState((prevState) => ({
            data_sources: arraySources,
            errorMsg: errorMsg
        }));
    }
    addFeature = (e) => {
        let errorMsg = this.state.errorMsg
        let error = ""
        errorMsg["feature_name"] = error
        errorMsg["configurations"] = error
        if (!this.state.feature_name) {
            error = `Feature name field cannot be empty`
            errorMsg["feature_name"] = error
            this.setState({ errorMsg });
        }
        else if (!this.state.configurations[0]["featureId"]) {
            error = `FeatureId field cannot be empty`
            errorMsg["configurations"] = error
            this.setState({ errorMsg });
        } else if (this.state.errorMsg[1]) {
        } else {
            let addedFeature = {
                feature_name: this.state.feature_name,
                attributes: this.state.transformations,
                configurations: this.state.configurations
            }

            this.setState(prevState => ({
                postingFeatures: [...prevState.postingFeatures, addedFeature]
            }), () => {
                console.log(this.state.postingFeatures);
            });

            this.setState((prevState) => ({
                features: [{ feature_name: "", attributes: [], configurations: [] }],
                attributes: [{ attribute: "", attribute_name: "", attributeType: "", derived: "" }],
                configurations: [{ geom: "POINT", dtg: "YYYYMMDD", featureId: "" }],
                feature_name: ""
            }))



            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
            );
            errorMsg = { feature_name: "", atttributes: "", configurations: "" }
            this.setState({ errorMsg })
        }
    }
    removeFeature = (e) => {
        var arrayFeature = this.state.features;
        if (arrayFeature.length > 1) {
            arrayFeature.splice(-1, 1)
        }
        this.setState((prevState) => ({
            features: arrayFeature,
            errorMsg: { feature_name: "", atttributes: "", configurations: "" }
        }), () => {
            console.log(this.state.features)
        });
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
    }

    postConfigurations = (e) => {
        let response = this.state.response
        if (!this.state.errorMsg["feature_name"] & !this.state.errorMsg["atttributes"] & !this.state.errorMsg["configurations"]) {
            this.api.bulkIngest(this.state.features)
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let { transformations, data_sources } = this.state
        return (
            <div className="w3-border">
                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h6>
                        <label>Feature Name</label>
                        <input className="w3-input" type="text" name="feature_name"></input>
                        <label>Source Type</label>
                        <input className="w3-input" type="text" name="source_type"></input>
                        <label>Source Format</label>
                        <input className="w3-input" type="text" name="source_format"></input>
                        <div className="h7">{this.state.errorMsg["feature_name"]}</div>
                        <br />
                        <label>Transformation</label>
                        <br /><br />
                        {
                            transformations.map((val, idx) => {
                                let nameId = `name-${idx}`, typeId = `type-${idx}`
                                return (
                                    <div key={idx} className="row w3-panel w3-border">
                                        <label htmlFor={nameId} className="col-25">Attribute Name</label>
                                        <input
                                            type="text"
                                            name={nameId}
                                            data-id={idx}
                                            id="attribute_name"
                                            value={transformations[idx].ame}
                                            className="col-75"
                                        />
                                        <label htmlFor={typeId} className="col-25">Type</label>
                                        <input
                                            type="text"
                                            name={typeId}
                                            data-id={idx}
                                            id="attributeType"
                                            value={transformations[idx].type}
                                            className="col-75 "
                                        />
                                        <br />
                                    </div>
                                )
                            })
                        }
                        <div className="h7">{this.state.errorMsg["transformations"]}</div>
                        <br />
                        <button className="w3-button w3-circle w3-teal" onClick={this.removeAttribute}>-</button>
                        <button className="w3-button w3-circle w3-teal" onClick={this.addAttribute}>+</button>
                        <br /><br />
                        <label>Data Sources</label>
                        {
                            data_sources.map((val, idx) => {
                                let inputId = `${idx}`
                                return (
                                    <input className="w3-input" dataId={inputId} type="text" name="data_sources"></input>
                                )
                            })
                        }
                        <br />
                        <button className="w3-button w3-circle w3-teal" onClick={this.removeSource}>-</button>
                        <button className="w3-button w3-circle w3-teal" onClick={this.addSource}>+</button>
                        <br /><br />
                        <label>Geom Configuration</label>
                        <br />
                        <div className="row" id="geomConfiguration">
                            <label className="col-50">Geom Format</label>
                            <div className="col-50">
                                <select id="geom" name="geom">
                                    <option value="point">Point</option>
                                    <option value="polygon">Polygon</option>
                                    <option value="multipolygon">Multi Polygon</option>
                                </select>
                            </div>
                            <label className="col-50">Data Source</label>
                            <input className="col-25" type="text" id="dataSource"></input>
                            <div className="h7">{this.state.errorMsg["geomConfigurations"]}</div>
                            <label className="col-50">Feature ID</label>
                            <input className="col-25" type="text" id="featureId"></input>
                            <div className="h7">{this.state.errorMsg["geomConfigurations"]}</div>
                        </div>

                    </h6>
                    <button className="w3-btn w3-white w3-border w3-border-red w3-round-large" onClick={this.removeFeature}>Remove</button>
                    <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addFeature}>Add Feature</button>
                    <br />
                </form>
                <div className="response w3-panel w3-border">{this.state.response}</div>
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.postConfigurations}>Submit</button>
            </div>
        );
    }
}

export default BulkIngest;