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
import CircularProgress from '@material-ui/core/CircularProgress';
import AddBoxIcon from "@material-ui/icons/AddBox";
import { FilePicker } from "react-file-picker";
import PinDropIcon from '@material-ui/icons/PinDrop';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SpatialGranularity from '../../map/SpatialGranularity'
import shp from 'shpjs'
import DialogContent from "@material-ui/core/DialogContent";
import Alert from "@material-ui/lab/Alert";
import {Typography} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import AddFeature from "./addfeature";

class AddGranularity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pipelineName: this.props.pipelineName,
            featureName: null,
            attributes: [{ attribute_name: null, attribute_type: null, indexed: "false" }],
            geometry: { attribute_name: "geom", attribute_type: null, indexed: "true" },
            uuid_attribute_name: null,
            granularity_file: null,
            postingFeatures: [{ featureName: null, attributes: [], uuid: null }],
            granularity: { feature_name: null, attributes: [], uuid_attribute_name: null },
            errorMsg: { featureName: null, atttributes: null, uuid: null, geom: null },
            response: null,
            attributeTypes: [],
            geomAttributeTypes: [],
            shapefile: null,
            file_name: "",
            isSuccess:false,
            wait:false,
            columns: ["MOH_ID"],
            ingestConfig: {
                "pipeline_name": this.props.pipelineName,
                "feature_name": "",
                "source_type": "shp",
                "source_format": "",
                "transformations": [
                    {
                        "attribute_name": null,
                        "transformation": null,
                    }
                ],
                "data_sources": []
            }
        };

        this.api = new Api();
    }

    handleFileChange = file => {
        this.setState({ file_name: file.name })
        this.setState({ shapefile: file }, () => {
            file.arrayBuffer().then(buffer => {
                shp(buffer).then(function (data) {
                    console.log(data)
                    return data
                }).then(features => {
                    var columns = []
                    Object.keys(features.features[0].properties).forEach(key => {
                        columns.push(key)
                    })
                    this.setState({ columns: columns }, () => {
                        console.log(this.state)
                    })
                })
            })
            var ingestConfig = this.state.ingestConfig
            ingestConfig.data_sources.push(file.name.split('.').slice(0, -1).join('.') + ".shp")
            this.setState({ ingestConfig: ingestConfig })
            this.setState({ granularity_file: file.name })
        })
    };

    setResponse=(res, state)=>{
        this.setState({response:res, isSuccess: state},(res) => {
            this.setState({wait:!this.state.wait});
            console.log(this.state.isSuccess);
        })
    }

    handleAlert = () => {
        this.setState({response:null, isSuccess:false},()=>{
            window.location.reload(true);
        })
    }

    handleChange = (e) => {
        let errorMsg = this.state.errorMsg
        let error = ""
        if (!e.target.value) {
            error = `${e.target.name} field cannot be empty`
        }
        errorMsg[e.target.name] = error
        this.setState({ errorMsg });
        this.setState({ [e.target.name]: e.target.value }, () => {
            console.log(this.state)
        })
        if (e.target.name === "featureName") {
            let ingestConfig = this.state.ingestConfig
            ingestConfig.feature_name = e.target.value
            this.setState({ ingestConfig: ingestConfig }, () => {
                console.log(this.state)
            })
        }
    }
    handleChangeGeom = (e) => {
        let errorMsg = this.state.errorMsg
        var error = ""
        if (!e.target.value) {
            error = `${e.target.name} field cannot be empty`
            errorMsg[e.target.name] = error
        } else {
            var geometry = this.state.geometry
            geometry["attribute_type"] = e.target.value
            this.setState({ geometry: geometry })
        }
        this.setState({ errorMsg });
    }


    handleAttributeChange = (id, name) => (e) => {
        let errorMsg = this.state.errorMsg
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
        if (name === "attribute_name") {
            let ingestConfig = this.state.ingestConfig
            ingestConfig.transformations[id][name] = e.target.value
            ingestConfig.transformations[id]["transformation"] = id
            this.setState({ ingestConfig: ingestConfig }, () => {
                console.log(this.state)
            })
        }
    }

    componentDidMount() {
        var id = this.props.pipelineName
        this.setState({ pipelineName: id })
        this.getAttributeInfo({ pipeline_name: id })
    }

    addAttribute = (e) => {
        this.setState((prevState) => ({
            attributes: [...prevState.attributes, { attribute_name: "", attribute_type: "", indexed: "false" }]
        }));
        let ingestConfig = this.state.ingestConfig
        ingestConfig.transformations.push({ attribute_name: "", transformation: "" })
        this.setState({ ingestConfig: ingestConfig }, () => {
            console.log(this.state)
        })
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
        let ingestConfig = this.state.ingestConfig
        ingestConfig.transformations.pop()
        this.setState({ ingestConfig: ingestConfig }, () => {
            console.log(this.state)
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
                console.log(res.data)
                if (res.data.attribute_types) {
                    this.setState({ attributeTypes: res.data.attribute_types })
                    this.setState({ geomAttributeTypes: res.data.geom_attribute_types })
                }
            })
    }
    // handleWait = ()=>{
    //     let state = this.state.wait;
    //     this.setState({wait:!state});
    // }

    addNewGranularity = (e) => {
        this.setState({wait:!this.state.wait});
        var attributes = this.state.attributes
        attributes.push(this.state.geometry)
        this.setState({ attributes: attributes })
        var granularityConfig = {
            pipeline_name: this.state.pipelineName,
            feature_name: this.state.featureName,
            attributes: this.state.attributes,
            uuid_attribute_name: this.state.uuid_attribute_name,
            file_name: this.state.file_name,
            granularity_name: this.state.granularity_file,
            geom_source: this.state.geomsource,
            ingestion_config: this.state.ingestConfig
        }
        let formData = new FormData()
        // formData.append("payload", granularityConfig)
        formData.append("file", this.state.shapefile)
        formData.append("pipeline_name", this.state.pipelineName)
        formData.append("feature_name", this.state.featureName)
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        this.api.putFile(formData, config, (res) => {
            console.log(res.data)
            this.api.addGranularity(granularityConfig, this.setResponse);
        })

    }

    handleTransformationChange = (id) => (e) => {
        let value = e.target.value
        let ingestConfig = this.state.ingestConfig
        ingestConfig.transformations[id]["transformation"] = value
        this.setState({ ingestConfig: ingestConfig }, () => {
            console.log(this.state)
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render() {
        let { attributes, attributeTypes, geomAttributeTypes, columns } = this.state
        let transformations = this.state.ingestConfig.transformations
        let attributeTypeList = attributeTypes.length > 0
            && attributeTypes.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);

        console.log(geomAttributeTypes)
        let geomAttributeTypeList = geomAttributeTypes.length > 0
            && geomAttributeTypes.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);


        let attributesList = attributes.length > 0
            && attributes.map((val, i) => {
                return (
                    <MenuItem key={i} id={val["attribute_name"]} value={val["attribute_name"]} >{val["attribute_name"]}</MenuItem>
                )
            }, this);

        let columnsList = columns.length > 0
            && columns.map((val, i) => {
                return (
                    <MenuItem key={val} id={val} value={i + 1} >{val}</MenuItem>
                )
            }, this);

        return (
            <div style={{ width: "70vw" }}>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <TextField
                            id="featureName"
                            onChange={this.handleChange}
                            className="col-75" name="featureName"
                            value={this.state.featureName} label="Granularity name" />

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
                                return (
                                    <div key={idx} className="row">

                                        <TextField
                                            name={"attribute_name"}
                                            id={idx}
                                            value={attributes[idx].ame}
                                            s className="col-50"
                                            label="Attribute Name"
                                            onChange={this.handleAttributeChange(idx, "attribute_name")}
                                        />

                                        <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 10 }}>
                                            <InputLabel data-id={idx} id="attribute_type_label">Type</InputLabel>
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
                        <FormControl variant="filled" size="small" className="col-50" >
                            <InputLabel id="geom_label">Geometry type</InputLabel>
                            <Select
                                id="geom"
                                labelId="geom_label"
                                name="geom"
                                value={this.state.geometry.attribute_type}
                                onChange={this.handleChangeGeom}
                            >
                                {geomAttributeTypeList}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="row">
                        <FormControl variant="filled" size="small" className="col-50" >
                            <InputLabel id="uuid_lable">Unique granule identifier</InputLabel>
                            <Select
                                id="uuid_attribute_name"
                                labelId="uuid_lable"
                                name="uuid_attribute_name"
                                value={this.state.uuid_attribute_name}
                                onChange={this.handleChange}
                            >
                                {attributesList}
                            </Select>
                        </FormControl>
                    </div>

                    {this.state.shapefile == null ? <div className="row">
                        <FilePicker
                            extensions={["zip"]}
                            onChange={this.handleFileChange}
                            maxSize={100}
                            onError={errMsg => console.log(errMsg)}
                            className="col-50"
                            style={{ float: 'left' }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: 20 }}
                                startIcon={<FileCopyIcon />}>
                                Shape File
                            </Button>
                        </FilePicker>
                    </div> :
                        <div className="row">
                            <div className="row" style={{ width: 600, height: 400, marginTop: 20 }}>
                                <h4
                                    style={{
                                        fontSize: 14, fontFamily: 'Courier New',
                                        color: 'grey', fontWeight: 'bolder', align: 'left'
                                    }}>
                                    {"Granules of " + this.state.featureName}
                                </h4>
                                <SpatialGranularity shapefile={this.state.shapefile} />
                            </div>
                            <div className="row" style={{ marginTop: 40 }}>
                                <h4
                                    style={{
                                        fontSize: 14, fontFamily: 'Courier New',
                                        color: 'grey', fontWeight: 'bolder', align: 'left'
                                    }}>
                                    Shapefile columns to attributes mapping
                                </h4>
                            </div>
                            {
                                transformations.map((val, idx) => {
                                    return (
                                        <div key={idx} className="row">
                                            <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 10 }}>
                                                <InputLabel data-id={idx} id="column_label">{transformations[idx]["attribute_name"]}</InputLabel>
                                                <Select
                                                    labelId="column_label"
                                                    id={idx}
                                                    name="column_index"
                                                    value={attributes[idx].type}
                                                    onChange={this.handleTransformationChange(idx)}
                                                >
                                                    {columnsList}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }

                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginTop: 40, marginBottom: 20 }}
                        onClick={this.addNewGranularity}
                        startIcon={<AddBoxIcon />}>
                        Add New granularity
                    </Button>

                    {/*{this.state.response ? <div className="response w3-panel w3-border">{this.state.response}</div> : ""}*/}
                </form>
                <div>
                    <Dialog
                        open={this.state.wait}
                        onClose={!this.state.wait}
                    >
                        <DialogContent>
                            <CircularProgress disableShrink />
                        </DialogContent>
                        <DialogActions>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <Dialog
                    open={this.state.response}
                    onClose={this.handleAlert}
                >
                    <DialogContent>
                        <div style={!this.state.isSuccess ? { display: 'none' } : {}}>
                            <Alert severity="success"><Typography style={{
                                fontSize: 12,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder',
                            }}>{this.state.response}</Typography></Alert>
                        </div>
                        <div style={this.state.isSuccess ? { display: 'none' } : {}}>
                            <Alert severity="error"><Typography style={{
                                fontSize: 12,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder',
                            }}>{this.state.response}</Typography></Alert>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAlert} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
                </div>
            </div>
        );
    }
}

export default AddGranularity;