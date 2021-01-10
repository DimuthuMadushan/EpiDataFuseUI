import React from 'react';
import axios from 'axios';
import Api from '../../api';
import GranularityConfig from "./granularityconfig";
import Aggregation from "./aggregation";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { FlashOffOutlined } from '@material-ui/icons';

class AddFeature extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipelineName: this.props.pipelineName,
            featureName: null,
            attributes: [{ attribute_name: null, attribute_type: null, indexed: "false" }],
            errorMsg: { featureName: null, atttributes: null },
            response: null,
            attributeTypes: [],
            granularity_config: null,
            aggregation_config: []
        };
        this.api = new Api();
    }

    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let error = ""
        if (!e.target.value) {
            error = `${e.target.name} field cannot be empty`
        }
        errorMsg["featureName"] = error
        this.setState({ errorMsg });
        this.setState({ [e.target.name]: e.target.value })
    }

    handleAttributeChange = (id, name) => (e) => {
        let errorMsg = this.state.errorMsg
        let schemaConfig = this.state.schemaConfig;
        let value = e.target.value
        let attributes = [...this.state.attributes]
        attributes[id][name] = value
        this.setState({ attributes }, () => {
            let err = '';
            if (!this.state.attributes[id][name]) {
                err = "Attribute fields can not be empty";
                errorMsg["atttributes"] = err
                this.setState({ errorMsg });
            } else {
                err = "";
                errorMsg["atttributes"] = err
                this.setState({ errorMsg });
            }
        })
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

    addAttribute = (e) => {
        this.setState((prevState) => ({
            attributes: [...prevState.attributes, { attribute_name: "", attribute_type: "", indexed: "false" }]
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

    componentDidMount() {
        var id = this.props.pipelineName
        this.setState({ pipelineName: id })
        var data = {
            "pipeline_name": id
        }
        this.getAttributeInfo(data)
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

    updateGranularityConfig = (config) => {
        this.setState({ granularity_config: config }, () => {
            console.log(this.state.granularity_config)
        })
    }

    updateAggregationConfig = (config) => {
        this.setState({ aggregation_config: config }, () => {
            console.log(this.state.aggregation_config)
        })
    }

    addNewFeature = (e) => {
        var featureConfig = {
            pipeline_name: this.state.pipelineName,
            feature_name: this.state.featureName,
            attributes: this.state.attributes,
            granularity_config: this.state.granularity_config,
            aggregation_config: this.state.aggregation_config
        }
        console.log(featureConfig);
        this.api.configureSchema(featureConfig, (res) => {
            console.log(res);
            window.location.reload(false);
        });
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
            <div style={{ width: "70vw" }}>
                <form onSubmit={this.handleSubmit} >
                    <div className="row">
                        <TextField id="featurename" className="col-75" name="featureName" onChange={this.handleChange}
                            value={this.state.featureName} label="Feature name" />

                    </div>
                    <div className="row h7">{this.state.errorMsg["featureName"]}</div>
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
                                return (
                                    <div key={idx} className="row">

                                        <TextField
                                            name={"attribute_name"}
                                            id={idx}
                                            value={attributes[idx].ame}
                                            className="col-50"
                                            label="Attribute Name"
                                            onChange={this.handleAttributeChange(idx, "attribute_name")}
                                        />

                                        <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 10 }}>
                                            <InputLabel id="attribute_type_label">Type</InputLabel>
                                            <Select
                                                labelId="attribute_type_label"
                                                id={idx}
                                                name="attribute_type"
                                                value={attributes[idx].type}
                                                onChange={this.handleAttributeChange(idx, "attribute_type")}
                                            >
                                                {attributeTypeList}
                                            </Select>
                                        </FormControl>
                                    </div>
                                )
                            })
                        }
                        <div className="h7">{this.state.errorMsg["atttributes"]}</div>

                        <div style={{ "align": 'left' }}>
                            <IconButton aria-label="remove" onClick={this.removeAttribute}>
                                <RemoveCircleIcon></RemoveCircleIcon>
                            </IconButton>
                            <IconButton aria-label="add" onClick={this.addAttribute}>
                                <AddCircleIcon></AddCircleIcon>
                            </IconButton>
                        </div>
                    </div>
                </form>
                <div> <GranularityConfig updateParentState={this.updateGranularityConfig} pipelineName={this.props.pipelineName} /></div>
                <div><Aggregation updateParentState={this.updateAggregationConfig}
                    attributes={this.state.attributes}
                    pipelineName={this.props.pipelineName} /></div>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.addNewFeature}
                    startIcon={<AddBoxIcon />}>
                    Add New Feature
                </Button>
                <div className="response w3-panel w3-border">{this.state.response}</div>

            </div>
        );
    }
}

export default AddFeature;