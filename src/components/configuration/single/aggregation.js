import React from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

class Aggregation extends React.Component {
    state = {
        aggregation: [{
            "attribute_name": "",
            "spatial_aggregation": "",
            "temporal_aggregation": ""
        }],

        spatialAggregationMethods: [],
        spatialAggregationMethodNames: [],
        temporalAggregationMethods: [],
        temporalAggregationMethodNames: [],
        spatialAggregationMethodNamesList: [],
        temporalAggregationMethodNamesList: [],
        errorMsg: { aggregatedAttribute: null },
        response: "",
    }

    addAttribute = (e) => {
        var obj = {
            attribute_name: "",
            spatial_aggregation: "",
            temporal_aggregation: ""
        }
        let aggregation = this.state.aggregation
        aggregation.push(obj)
        this.setState({ aggregation })
    }

    removeAttribute = (e) => {
        let aggregation = this.state.aggregation
        aggregation.pop()
        this.setState({ aggregation });
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }


    getConversionMethods(data) {
        axios.post('http://localhost:8080/getConversionMethodInfo', data)
            .then(function (response) {
                if (response.data.success) {
                    return response.data
                } else {
                    return null
                }
            }).then((res) => {
                let spatialAggregationMethodNames = []
                let spatialAggregationMethods = res.data.spatialAggregationMethods

                if (spatialAggregationMethods) {
                    Object.keys(spatialAggregationMethods).forEach(function (key, index) {
                        spatialAggregationMethodNames.push(key)
                    })
                    this.setState({ spatialAggregationMethods: spatialAggregationMethods })
                    this.setState({ spatialAggregationMethodNames: spatialAggregationMethodNames })
                }

                let temporalAggregationMethodNames = []
                let temporalAggregationMethods = res.data.temporalAggregationMethods

                if (temporalAggregationMethods) {
                    Object.keys(temporalAggregationMethods).forEach(function (key, index) {
                        temporalAggregationMethodNames.push(key)
                    })
                    this.setState({ temporalAggregationMethods: temporalAggregationMethods })
                    this.setState({ temporalAggregationMethodNames: temporalAggregationMethodNames }, () => {
                        console.log("Heree")
                        console.log(this.state)
                    })
                }
            })
    }

    handleAttributeChange = (id, name) => (e) => {
        let value = e.target.value
        let aggregation = this.state.aggregation
        aggregation[id][name] = value
        this.setState({ aggregation }, () => {
            this.props.updateParentState(this.state.aggregation)
        })
    }

    componentDidMount() {
        var id = this.props.pipelineName
        this.setState({ pipelineName: id })
        var data = {
            "pipeline_name": id
        }
        this.getConversionMethods(data)
    }


    render() {
        let { temporalAggregationMethodNames,
            spatialAggregationMethodNames, aggregation } = this.state

        let spatialAggregationMethodsList = spatialAggregationMethodNames.length > 0
            && spatialAggregationMethodNames.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);

        let temporalAggregationMethodsList = temporalAggregationMethodNames.length > 0
            && temporalAggregationMethodNames.map((val, i) => {
                return (
                    <MenuItem key={i} id={val} value={val} >{val}</MenuItem>
                )
            }, this);

        let attributes = this.props.attributes
        console.log(attributes)

        let attributesList = attributes.length > 0
            && attributes.map((val, idx) => {
                return (
                    <MenuItem key={idx} id={idx} value={val["attribute_name"]}>{val["attribute_name"]}</MenuItem>
                )
            }, this);



        return (

            <div style={{ "paddingLeft": 25 }}>
                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <div className="row" style={{ marginTop: 30, alignItems: 'flex-start' }}>
                        <h4
                            style={{
                                fontSize: 14, fontFamily: 'Courier New',
                                color: 'grey', fontWeight: 'bolder', align: 'left'
                            }}>
                            Integration Configuration
                            </h4>
                    </div>
                    <div className="row" style={{ marginLeft: 30 }}>
                        {
                            aggregation.map((val, idx) => {
                                return (
                                    <div key={idx} style={{ marginTop: 10 }}>
                                        <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 10, marginRight: 20 }}>
                                            <InputLabel id="attribute_name_label">Attribute name</InputLabel>
                                            <Select
                                                labelId="attribute_name_label"
                                                id={idx}
                                                name="attribute_name"
                                                value={aggregation[idx].ame}
                                                onChange={this.handleAttributeChange(idx, "attribute_name")}
                                            >
                                                {attributesList}
                                            </Select>
                                        </FormControl>

                                        <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 0 }}>
                                            <InputLabel id="spatial_aggregation_label">Spatial aggregation</InputLabel>
                                            <Select
                                                labelId="spatial_aggregtaion_label"
                                                id={idx}
                                                name="spatialAggregationMethod"
                                                value={aggregation[idx]["spatial_aggregation"]}
                                                onChange={this.handleAttributeChange(idx, "spatial_aggregation")}
                                            >
                                                {spatialAggregationMethodsList}
                                            </Select>
                                        </FormControl>

                                        <FormControl variant="filled" size="small" className="col-25" style={{ marginLeft: 20 }}>
                                            <InputLabel id="temporal_aggregation_label">Temporal aggregation</InputLabel>
                                            <Select
                                                labelId="temporal_aggregation_label"
                                                id={idx}
                                                name="temporalAggregationMethod"
                                                value={aggregation[idx]["temporal_aggregation"]}
                                                onChange={this.handleAttributeChange(idx, "temporal_aggregation")}
                                            >
                                                {temporalAggregationMethodsList}
                                            </Select>
                                        </FormControl>
                                        <div className="h7">{this.state.errorMsg["aggregatedAttributes"]}</div>
                                    </div>
                                )
                            })
                        }
                        <div className="h7">{this.state.errorMsg["spatialAggregationArgs"]}</div>
                    </div>
                    <div style={{ "align": 'left' }} className="row">
                        <IconButton aria-label="remove" onClick={this.removeAttribute}>
                            <RemoveCircleIcon></RemoveCircleIcon>
                        </IconButton>
                        <IconButton aria-label="add" onClick={this.addAttribute}>
                            <AddCircleIcon></AddCircleIcon>
                        </IconButton>
                    </div>
                </form>
            </div>
        )
    }
}

export default Aggregation;
