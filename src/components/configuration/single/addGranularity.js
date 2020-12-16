import React from 'react';
import axios from 'axios';
import Api from '../../api';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

class AddGranularity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pipelineName: this.props.pipelineName,
            featureName: null,
            attributes: [{ attribute_name: null, attribute_type: null }],
            uuid: null,
            postingFeatures: [{ featureName: null, attributes: [], uuid: null }],
            granularity: { feature_name: null, attributes: [], uuid_attribute_name: null },
            errorMsg: { featureName: null, atttributes: null, uuid: null },
            response: null,
            attributeTypes: [],
        };

        this.api = new Api();
    }




    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let id = e.target.id
        if (["attribute_name", "attribute_type"].includes(e.target.name)) {
            let attributes = [...this.state.attributes]
            attributes[id][e.target.name] = e.target.value.toUpperCase()
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

    componentDidMount() {
        var id = this.props.pipelineName
        this.setState({ pipelineName: id })
        this.getAttributeInfo({ pipelineName: id })
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
                this.postConfigurations();

            });

            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
            );
            errorMsg = { featureName: "", atttributes: "", uuid: "" }
            this.setState({ errorMsg })
            this.setState((prevState) => ({
                featureName: null,
                attributes: [{ attribute_name: null, attribute_type: null }],
                uuid: null,
                postingFeatures: [...prevState.postingFeatures, { featureName: null, attributes: {}, uuid: null }],
                granularity: { feature_name: null, attributes: [], uuid_attribute_name: null },
                errorMsg: { featureName: null, atttributes: null, uuid: null }
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
        let granularity = this.state.granularity;
        granularity["pipeline_name"] = this.state.pipelineName;
        granularity["feature_name"] = this.state.postingFeatures[0]["feature_name"];
        granularity["attributes"] = this.state.postingFeatures[0]["attributes"];
        granularity["uuid_attribute_name"] = this.state.postingFeatures[0]["uuid"];
        console.log(granularity);
        let response = this.api.addGranularity(granularity);
        console.log(response);
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let { attributes, attributeTypes } = this.state
        let attributeTypeList = attributeTypes.length > 0
            && attributeTypes.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);
        return (
            <div className="w3-border w3-center" style={{ marginTop: 20, width: '70%', 'marginLeft': '15%' }}>
                <form style={{ paddingLeft: 40 }}  onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        <div className="row">
                            <TextField id="featurename" className="col-75" name="featureName"
                                       value={this.state.featureName} label="Feature name" />

                        </div>
                        <div className="h7">{this.state.errorMsg["featureName"]}</div>
                        <div className="row" style={{ marginTop: 30, alignItems: 'flex-start' }}>
                            <h4
                                style={{
                                    fontSize: 14, fontFamily: 'Courier New',
                                    color: 'grey', fontWeight: 'bolder', align: 'left'
                                }}>
                                Attributes
                            </h4>
                        {
                            attributes.map((val, idx) => {
                                let nameId = `name-${idx}`, typeId = `type-${idx}`
                                return (
                                    <div key={idx} className="row">

                                        <TextField
                                            name={"attribute_name"}
                                            id={idx}
                                            value={attributes[idx].ame}
                                            className="col-50"
                                            label="Attribute Name"
                                        />

                                        <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 10 }}>
                                            <InputLabel data-id={idx} id="attribute_type_label">Type</InputLabel>
                                            <Select
                                                labelId="attribute_type_label"
                                                id={idx}
                                                name="attribute_type"
                                                value={attributes[idx].type}
                                            >
                                                {attributeTypeList}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    // <div key={idx} className="row w3-panel w3-border">
                                    //     <label htmlFor={nameId} className="col-25">Attribute #{idx + 1}</label>
                                    //     <input
                                    //         type="text"
                                    //         name={nameId}
                                    //         data-id={idx}
                                    //         id="attribute_name"
                                    //         value={attributes[idx].ame}
                                    //         className="col-75"
                                    //     />
                                    //     <label htmlFor={typeId} className="col-25">Type</label>
                                    //     <input
                                    //         type="text"
                                    //         name={typeId}
                                    //         data-id={idx}
                                    //         id="attribute_type"
                                    //         value={attributes[idx].type}
                                    //         className="col-75 "
                                    //     />
                                    //     <br />
                                    // </div>
                                )
                            })
                        }
                        </div>
                        <div className="h7">{this.state.errorMsg["atttributes"]}</div>
                        <div style={{ "align": 'left' }}>
                            <IconButton aria-label="remove" onClick={this.removeAttribute}>
                                <RemoveCircleIcon></RemoveCircleIcon>
                            </IconButton>
                            <IconButton aria-label="add" onClick={this.addAttribute}>
                                <AddCircleIcon></AddCircleIcon>
                            </IconButton>
                        </div>
                        <div className="row">
                            <TextField id="uuid" className="col-75" name="uuid"
                                       value={this.state.uuid} label="UUID" />

                        </div>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.addFeature}
                        startIcon={<AddBoxIcon />}>
                        Add New Feature
                    </Button>

                    <div className="response w3-panel w3-border">{this.state.response}</div>
                </form>
            </div>
        );
    }
}

export default AddGranularity;