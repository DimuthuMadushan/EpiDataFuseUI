import React from 'react';
import axios from 'axios';
import Api from '../../api';
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

class IngestToFeature extends React.Component {
    state = {
        pipelineName:this.props.pipelineName,
        featureName: null,
        sourceType: null,
        sourceFormat: null,
        transformation: [{ attribute_name: null, transformation: null }],
        dataSources: [{data_source:null}],
        postingFeatures: [{ pipeline_name:null, feature_name: null, source_type: null, source_format: null, transformations: [], data_sources: [] }],
        errorMsg: { featureName: null, sourceType: null, sourceFormat: null, transformation: null },
        response: null,
        attributeTypes:[]
    }

    api = new Api();

    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let id = e.target.id
        if (["attribute_name", "transformation"].includes(e.target.name)) {
            let transformation = [...this.state.transformation]
            if(e.target.name==="attribute_name") {
                transformation[e.target.id]["attribute_name"] = e.target.value.toUpperCase()
            }else{
                transformation[e.target.id]["transformation"] = e.target.value.toUpperCase()
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
        } else if (["data_source"].includes(e.target.name)) {
            let dataSources = [...this.state.dataSources]
            dataSources[e.target.id][e.target.name] = e.target.value.toUpperCase()
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
            errorMsg[e.target.name] = error
            this.setState({ errorMsg });
            this.setState({ [e.target.name]: e.target.value.toUpperCase() }, () => {
            })
        }


    }



    addAttribute = (e) => {
        this.setState((prevState) => ({
            transformation: [...prevState.transformation, { attribute_name: null, transformation: null }]
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
    getAttributeInfo(data) {
        axios.post('http://localhost:8080/getAttributeInfo', data)
            .then(function (response) {
                if (response.data.success) {
                    return response.data
                } else {
                    return null
                }
            }).then((res) => {
            if (res.data.attribute_types) {
                this.setState({ attributeTypes: res.data.attribute_types })
            }
        })
    }
    componentDidMount() {
        var id = this.props.pipelineName
        this.getAttributeInfo({ pipelineName: id })
    }

    addSource = (e) => {
        this.setState((prevState) => ({
            dataSources: [...prevState.dataSources, { data_source: null }]
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
            console.log("Incomplete input found at transformation")
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
                dataSources: [{ data_source: null }],
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
            this.api.ingestToFeature(this.state.features)
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
        let { transformation, dataSources, attributeTypes } = this.state
        let attributeTypeList = attributeTypes.length > 0
            && attributeTypes.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);
        return (
            <div className="w3-border w3-center" style={{ marginTop: 20, width: '70%', 'marginLeft': '15%' }}>
                <form className="w3-container" style={{ paddingLeft: 40 }}  onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        <div className="row">
                            <TextField id="featureName" className="col-75" name="featureName"
                                       value={this.state.featureName} label="Feature Name" />

                        </div>
                        <div className="row">
                            <TextField id="sourceType" className="col-75" name="sourceType"
                                       value={this.state.sourceType} label="Source Type" />

                        </div>
                        <div className="row">
                            <TextField id="sourceFormat" className="col-75" name="sourceFormat"
                                       value={this.state.sourceFormat} label="Source Type" />

                        </div>
                        {/*<label>Feature Name</label>*/}
                        {/*<input className="w3-input" type="text" name="featureName"></input>*/}
                        {/*<label>Source Type</label>*/}
                        {/*<input className="w3-input" type="text" name="sourceType"></input>*/}
                        {/*<label>Source Format</label>*/}
                        {/*<input className="w3-input" type="text" name="sourceFormat"></input>*/}
                        <div className="h7">{this.state.errorMsg["featureName"]}</div>
                        <div className="row" style={{ marginTop: 30, alignItems: 'flex-start' }}>
                            <h4
                                style={{
                                    fontSize: 14, fontFamily: 'Courier New',
                                    color: 'grey', fontWeight: 'bolder', align: 'left'
                                }}>
                                Transformation
                            </h4>
                            {
                                transformation.map((val, idx) => {
                                    let nameId = `name-${idx}`, typeId = `type-${idx}`
                                    return (
                                        <div key={idx} className="row">
                                            <TextField
                                                name={"attribute_name"}
                                                id={idx}
                                                className="col-50"
                                                label="Attribute Name"
                                            />
                                            <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 10 }}>
                                                <InputLabel id="attribute_type_label">Transformation</InputLabel>
                                                <Select
                                                    labelId="attribute_type_label"
                                                    id={idx}
                                                    name={"transformation"}
                                                >
                                                    {attributeTypeList}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="h7">{this.state.errorMsg["transformation"]}</div>
                        <div style={{ "align": 'left' }}>
                            <IconButton aria-label="remove" onClick={this.removeAttribute}>
                                <RemoveCircleIcon></RemoveCircleIcon>
                            </IconButton>
                            <IconButton aria-label="add" onClick={this.addAttribute}>
                                <AddCircleIcon></AddCircleIcon>
                            </IconButton>
                        </div>
                        <div className="row" style={{ marginTop: 30, alignItems: 'flex-start' }}>
                            <h4
                                style={{
                                    fontSize: 14, fontFamily: 'Courier New',
                                    color: 'grey', fontWeight: 'bolder', align: 'left'
                                }}>
                                Data Sources
                            </h4>
                            {
                                dataSources.map((val, idx) => {
                                    let inputId = `${idx}`
                                    return (
                                        <div key={idx} className="row">
                                            <TextField
                                                name={"data_source"}
                                                id={idx}
                                                className="col-75"
                                                label="Data Source"
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div style={{ "align": 'left' }}>
                            <IconButton aria-label="remove" onClick={this.removeSource}>
                                <RemoveCircleIcon></RemoveCircleIcon>
                            </IconButton>
                            <IconButton aria-label="add" onClick={this.addSource}>
                                <AddCircleIcon></AddCircleIcon>
                            </IconButton>
                        </div>
                        {/*// {*/}
                        {/*//     dataSources.map((val, idx) => {*/}
                        {/*//         let inputId = `${idx}`*/}
                        {/*//         return (*/}
                        {/*//             <input className="w3-input" data-id={idx} id="dataSources" type="text" name="dataSource"></input>*/}
                        {/*//         )*/}
                        {/*//     })*/}
                        {/*// }*/}

                        {/*<button className="w3-button w3-circle w3-teal" onClick={this.removeSource}>-</button>*/}
                        {/*<button className="w3-button w3-circle w3-teal" onClick={this.addSource}>+</button>*/}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.ingestData}
                        startIcon={<AddBoxIcon />}>
                        Ingest Data
                    </Button>
                    <div className="response w3-panel w3-border">{this.state.response}</div>
                    {/*<p className="response w3-panel w3-border">{this.state.response}</p>*/}
                    {/*<button className="w3-btn w3-white w3-border w3-border-red w3-round-large" onClick={this.removeIngest}>Remove</button>*/}
                    {/*<button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.ingestData}>Ingest Data</button>*/}
                    {/*<br />*/}
                </form>

            </div>
        );
    }
}

export default IngestToFeature;