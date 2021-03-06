import React from 'react';
import axios from 'axios';
import Api from '../../api';

class Ingest extends React.Component {
    state = {
        pipelineName:this.props.pipelineName,
        featureName: null,
        sourceType: null,
        sourceFormat: null,
        transformation: [{ attribute_name: null, transformation: null }],
        dataSources: [],
        postingFeatures: [{ pipeline_name:null, feature_name: null, source_type: null, source_format: null, transformations: [], data_sources: [] }],
        errorMsg: { featureName: null, sourceType: null, sourceFormat: null, transformation: null },
        response: null
    }

    api = new Api();

    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let id = e.target.dataset.id
        if (["attributeName", "transformation"].includes(e.target.id)) {
            let transformation = [...this.state.transformation]
            if(e.target.id==="attributeName") {
                transformation[e.target.dataset.id]["attribute_name"] = e.target.value.toUpperCase()
            }else{
                transformation[e.target.dataset.id]["transformation"] = e.target.value.toUpperCase()
            }
                this.setState({ transformation }, () => {
                let err = '';
                if (!this.state.transformation[id]["attribute_name"] ||
                    !this.state.transformation[id]["transformation"]) {
                    err = "Attribute fields can not be empty";
                    errorMsg["transformation"] = err
                    this.setState({ errorMsg });
                } else {
                    err = "";
                    errorMsg["transformation"] = err
                    this.setState({ errorMsg });
                }
                console.log(this.state.transformation)
            })
        } else if (["dataSources"].includes(e.target.id)) {
            let dataSources = [...this.state.dataSources]
            dataSources[e.target.dataset.id][e.target.name] = e.target.value.toUpperCase()
            this.setState({
                dataSources
            }, () => {
                console.log(this.state.dataSources)
            })
        }
        else {
            let error = ""
            if (!e.target.value) {
                error = `${e.target.name} field cannot be empty`
            }
            errorMsg[e.target.id] = error
            this.setState({ errorMsg });
            this.setState({ [e.target.name]: e.target.value.toUpperCase() }, () => {
            })
        }


    }



    addAttribute = (e) => {
        this.setState((prevState) => ({
            transformation: [...prevState.transformation, { attributeName: "", transformation: "" }]
        }));
    }
    removeAttribute = (e) => {
        let errorMsg = this.state.errorMsg
        var arrayTransformation = this.state.transformation;
        if (arrayTransformation.length > 0) {
            arrayTransformation.splice(-1, 1)
        }
        errorMsg["transformation"] = ""
        this.setState((prevState) => ({
            transformation: arrayTransformation,
            errorMsg: errorMsg
        }));
    }
    addSource = (e) => {
        this.setState((prevState) => ({
            dataSources: [...prevState.dataSources, { dataSource: "" }]
        }));
    }
    removeSource = (e) => {
        let errorMsg = this.state.errorMsg
        var arraySources = this.state.dataSources;
        if (arraySources.length > 0) {
            arraySources.splice(-1, 1)
        }
        errorMsg["dataSources"] = ""
        this.setState((prevState) => ({
            dataSources: arraySources,
            errorMsg: errorMsg
        }));
    }
    ingestData = (e) => {
        let errorMsg = this.state.errorMsg
        let error = ""
        errorMsg["featureName"] = error
        errorMsg["sourceType"] = error
        if (!this.state.featureName) {
            error = `Feature name field cannot be empty`
            errorMsg["featureName"] = error
            this.setState({ errorMsg });
        }
        else if (!this.state.sourceType) {
            error = `SourceType field cannot be empty`
            errorMsg["sourceType"] = error
            this.setState({ errorMsg });
        } else if (this.state.errorMsg["transformation"]) {
            console.log("inside igest")
        } else {
            let postingFeatures = {
                pipeline_name: this.state.pipelineName,
                feature_name: this.state.featureName,
                source_type: this.state.sourceType,
                source_format: this.state.sourceFormat,
                transformations: this.state.transformation,
                data_sources: this.state.dataSources
            }

            console.log(postingFeatures);

            this.setState({
                postingFeatures: [postingFeatures]
            }, () => {
                console.log(this.state.postingFeatures);
            });

            this.setState((prevState) => ({
                featureName: null,
                sourceType: null,
                sourceFormat: null,
                transformation: [{ attribute_name: null, transformation: null }],
                dataSources: [{ dataSource: null }],
                postingFeatures: [{ pipeline_name:null, feature_name: null, source_type: null, source_format: null, transformations: [], data_sources: [] }],
                errorMsg: { featureName: null, sourceType: null, sourceFormat: null, transformation: null },
            }))



            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
            );
            errorMsg = { feature_name: "", atttributes: "", configurations: "" }
            this.setState({ errorMsg })
        }
    }
    removeIngest = (e) => {
        var arrayFeature = this.state.postingFeatures;
        if (arrayFeature.length > 1) {
            arrayFeature.splice(-1, 1)
        }
        this.setState((prevState) => ({
            postingFeature: arrayFeature,
            errorMsg: { featureName: "", sourceType: "", sourceFormat: "", transformation: "" },
        }), () => {
            console.log(this.state.postingFeatures)
        });
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
    }

    postConfigurations = (e) => {
        let response = this.state.response
        if (!this.state.errorMsg["featureName"] & !this.state.errorMsg["atttributes"] & !this.state.errorMsg["configurations"]) {
            this.api.configureSchema(this.state.features)
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
        let { transformation, dataSources } = this.state
        return (
            <div className="w3-border">
                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h6>
                        <label>Feature Name</label>
                        <input className="w3-input" type="text" name="featureName"></input>
                        <label>Source Type</label>
                        <input className="w3-input" type="text" name="sourceType"></input>
                        <label>Source Format</label>
                        <input className="w3-input" type="text" name="sourceFormat"></input>
                        <div className="h7">{this.state.errorMsg["featureName"]}</div>
                        <br />
                        <label>Transformation</label>
                        <br /><br />
                        {
                            transformation.map((val, idx) => {
                                let nameId = `name-${idx}`, typeId = `type-${idx}`
                                return (
                                    <div key={idx} className="row w3-panel w3-border">
                                        <label htmlFor={nameId} className="col-25">Attribute Name</label>
                                        <input
                                            type="text"
                                            name={nameId}
                                            data-id={idx}
                                            id="attributeName"
                                            value={transformation[idx].ame}
                                            className="col-75"
                                        />
                                        <label htmlFor={typeId} className="col-25">Type</label>
                                        <input
                                            type="text"
                                            name={typeId}
                                            data-id={idx}
                                            id="transformation"
                                            value={transformation[idx].type}
                                            className="col-75 "
                                        />
                                        <br />
                                    </div>
                                )
                            })
                        }
                        <div className="h7">{this.state.errorMsg["transformation"]}</div>
                        <br />
                        <button className="w3-button w3-circle w3-teal" onClick={this.removeAttribute}>-</button>
                        <button className="w3-button w3-circle w3-teal" onClick={this.addAttribute}>+</button>
                        <br /><br />
                        <label>Data Sources</label>
                        {
                            dataSources.map((val, idx) => {
                                let inputId = `${idx}`
                                return (
                                    <input className="w3-input" data-id={idx} id="dataSources" type="text" name="dataSource"></input>
                                )
                            })
                        }
                        <br />
                        <button className="w3-button w3-circle w3-teal" onClick={this.removeSource}>-</button>
                        <button className="w3-button w3-circle w3-teal" onClick={this.addSource}>+</button>
                        <br /><br />

                    </h6>
                    <p className="response w3-panel w3-border">{this.state.response}</p>
                    <button className="w3-btn w3-white w3-border w3-border-red w3-round-large" onClick={this.removeIngest}>Remove</button>
                    <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.ingestData}>Ingest Data</button>
                    <br />
                </form>
                <div className="response w3-panel w3-border">{this.state.response}</div>
            </div>
        );
    }
}

export default Ingest;