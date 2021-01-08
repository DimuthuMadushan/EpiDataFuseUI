import React from 'react';
import Api from '../../api';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { FilePicker } from "react-file-picker";
import FileCopyIcon from '@material-ui/icons/FileCopy'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import * as XLSX from 'xlsx';

class IngestToFeature extends React.Component {

    state = {
        pipelineName: this.props.pipelineName,
        featureName: null,
        features: this.props.features,
        attributes: [{ attribute_name: null, attribute_type: null }],
        columns: [],
        sourceType: "delimited-text",
        sourceFormat: "Excel",
        inputfile: null,
        transformations: [{ attribute_name: null, transformation: null }],
        dataSources: [],
        fileNames: [],
        errorMsg: { featureName: null, sourceType: null, sourceFormat: null, transformation: null },
        response: null,
    }

    api = new Api();

    handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        if (name === "featureName") {
            this.props.features.forEach((feature) => {
                if (feature["featureName"] === value) {
                    this.setState({ attributes: feature["attributes"] }, () => {
                        let transformations = []
                        this.state.attributes.forEach((attribute) => {
                            transformations.push({
                                "attribute_name": attribute["attribute_name"],
                                "transformation": null
                            })
                        })
                        this.setState({ transformations: transformations })
                    })
                }
            })
        }
        this.setState({ [name]: value })
    }

    processData = (dataString) => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length == headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }

                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }
        // prepare columns list from headers
        this.setState({ columns: headers })
    }

    handleFileChange = event => {
        var files = event.target.files
        for (let file of files) {
            var reader = new FileReader();
            reader.onload = (evt) => {
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                this.processData(data);
            };
            reader.readAsBinaryString(file);
            var dataSources = this.state.dataSources
            var fileNames = this.state.fileNames
            fileNames.push(file.name)
            dataSources.push(file)
            this.setState({ dataSources: dataSources })
            this.setState({ fileNames: fileNames })
        }
    }

    handleTransformationChange = (id) => (e) => {
        let value = e.target.value
        let transformations = this.state.transformations
        transformations[id]["transformation"] = value
        this.setState({ transformations: transformations }, () => {
            console.log(this.state)
        })
    }

    ingestData = () => {
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
            var data = {
                "pipeline_name": this.state.pipelineName,
                "feature_name": this.state.featureName,
                "source_type": this.state.sourceType,
                "source_format": this.state.sourceFormat,
                "transformations": this.state.transformations,
                "data_sources": this.state.fileNames
            }
            var self = this
            this.state.dataSources.forEach((file, index) => {
                let formData = new FormData()
                formData.append("pipeline_name", this.state.pipelineName)
                formData.append("feature_name", this.state.featureName)
                formData.append("file", file)
                const config = {
                    headers: { 'content-type': 'multipart/form-data' }
                }
                this.api.putFile(formData, config, (res) => {
                    if (index === self.state.dataSources.length - 1) {
                        console.log(res)
                        console.log("Here yay")
                        self.api.ingestToFeature(data, (res) => {
                            console.log(res)
                        })
                    }
                })
            })

            // this.setState((prevState) => ({
            //     featureName: null,
            //     sourceType: null,
            //     sourceFormat: null,
            //     transformation: [{ attribute_name: null, transformation: null }],
            //     dataSources: [{ data_source: null }],
            //     postingFeatures: [{ pipeline_name: null, feature_name: null, source_type: null, source_format: null, transformations: [], data_sources: [] }],
            //     errorMsg: { featureName: null, sourceType: null, sourceFormat: null, transformation: null },
            // }))

            // Array.from(document.querySelectorAll("input")).forEach(
            //     input => (input.value = "")
            // );
            // errorMsg = { feature_name: "", atttributes: "", configurations: "" }
            // this.setState({ errorMsg })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render() {
        let { transformations, attributes, columns, fileNames } = this.state

        let columnsList = columns.length > 0
            && columns.map((val, i) => {
                return (
                    <MenuItem key={val} id={val} value={i} >{val}</MenuItem>
                )
            }, this);

        let features = this.props.features
        let featuresList = features.length > 0
            && features.map((val, i) => {
                return (
                    <MenuItem key={i} id={i} value={val["featureName"]} >{val["featureName"]}</MenuItem>
                )
            }, this)

        let fileNameList = fileNames.length > 0
            && fileNames.map((val, i) => {
                return (
                    <ListItem>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={val}
                        />
                    </ListItem>
                )
            }, this)


        return (
            <div style={{ width: "70vw" }}>
                <form onSubmit={this.handleSubmit} >
                    <div className="row">
                        <FormControl variant="filled" size="small" className="col-50" >
                            <InputLabel id="feature_name_label">Feature Name</InputLabel>
                            <Select
                                id="featureName"
                                labelId="feature_name__label"
                                name="featureName"
                                value={this.state.featureName}
                                onChange={this.handleChange}
                            >
                                {featuresList}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="h7">{this.state.errorMsg["featureName"]}</div>
                    <div className="row">
                        <FormControl variant="filled" size="small" className="col-50" >
                            <input
                                type="file"
                                accept={"csv", "xlsx", "xls"}
                                onChange={this.handleFileChange}
                                maxSize={100}
                                className="col-50"
                                multiple={true}
                                style={{ float: 'left', marginTop: 20 }}
                            />
                        </FormControl>

                        {/* <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 20 }}
                            startIcon={<FileCopyIcon />}>
                            Upload File
                        </Button> */}
                    </div>
                    {fileNameList.length > 0 ? <div className="row" style={{ marginLeft: 30 }} >
                        <List>
                            {fileNameList}
                        </List>
                    </div> : ""}
                    <div className="row" style={{ marginTop: 30, alignItems: 'flex-start' }}>
                        <h4
                            style={{
                                fontSize: 14, fontFamily: 'Courier New',
                                color: 'grey', fontWeight: 'bolder', align: 'left'
                            }}>
                            Header mapping
                            </h4>
                        {
                            transformations.map((val, idx) => {
                                return (
                                    <div key={idx} className="row">
                                        <FormControl variant="filled" size="small" className="col-50" style={{ marginLeft: 10 }}>
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
                    <div className="h7">{this.state.errorMsg["transformation"]}</div>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginTop: 40, marginBottom: 20 }}
                        onClick={this.ingestData}
                        startIcon={<AddBoxIcon />}>
                        Ingest Data
                    </Button>
                    <div className="response w3-panel w3-border">{this.state.response}</div>
                </form>

            </div >
        );
    }
}

export default IngestToFeature;