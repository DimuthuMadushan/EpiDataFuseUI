import React from 'react';
import axios from 'axios';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CSVLink, CSVDownload } from "react-csv";

class Outputdataframe extends React.Component {

    constructor() {

        super();
        this.state = {
            dataFrames: [],
            tableVisibility: []
        }
    }

    componentDidMount() {
        var data = {
            pipeline_name: this.props.pipelineName
        }
        this.retriveData(data)
    }

    retriveData = (data) => {
        axios.post('http://localhost:8080/getdataframes', data)
            .then(function (response) {
                if (response.data.success) {
                    return response.data.data;
                }
                else {
                    return response.data.message;
                }
            }).then(data => {
                if (data != null) {
                    var dataFrames = data.data;
                    this.setState({ dataFrames, dataFrames });


                    dataFrames.map(frame => {
                        this.setState({
                            tableVisibility: this.state.tableVisibility.concat(false)
                        })

                    })

                    console.log(this.state.tableVisibility);
                }
            })
    }

    toggleTableView = (index) => {
        let tableVisibility = [...this.state.tableVisibility];
        let value = tableVisibility[index];
        console.log(value);

        if (value == true) {
            let newValue = false;
            tableVisibility[index] = newValue;
            this.setState({ tableVisibility: tableVisibility });
        } else {
            let newValue = true;
            tableVisibility[index] = newValue;
            this.setState({ tableVisibility: tableVisibility });
        }

        console.log(this.state.tableVisibility);

    }

    createCSVFILE = (content, headers, fileName) => {
        console.log(headers)
        console.log(fileName)
        console.log(content)
    }

    render() {

        var dataFrames = this.state.dataFrames;

        return (
            <div>
                <List style={{
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 300,
                }}>

                    {dataFrames.map((frame, index) => {
                        var fileName = frame.fileName;
                        var headers = frame.headers;
                        var content = frame.content;

                        var nameParams = fileName.split('_');

                        var spatialGranularity = nameParams[1];
                        var temporalGranularity = nameParams[2];
                        var timestamp = nameParams[3].substring(0, 17);

                        return (

                            <ListItem>
                                <ListItemText >
                                    <Typography style={{
                                        fontSize: 10,
                                        fontFamily: 'Courier New',
                                        color: 'grey',
                                        fontWeight: 'bolder',
                                        marginTop: 2
                                    }}>
                                        Fused data set No:  {index + 1}
                                    </Typography>
                                    <Typography style={{
                                        fontSize: 10,
                                        fontFamily: 'Courier New',
                                        color: 'grey',
                                        fontWeight: 'bolder',
                                        marginTop: 2
                                    }}>
                                        TimeStamp : {timestamp}
                                    </Typography>
                                    <Typography style={{
                                        fontSize: 10,
                                        fontFamily: 'Courier New',
                                        color: 'grey',
                                        fontWeight: 'bolder',
                                        marginTop: 2
                                    }}>
                                        Spatial Granularity : {spatialGranularity}
                                    </Typography>
                                    <Typography style={{
                                        fontSize: 10,
                                        fontFamily: 'Courier New',
                                        color: 'grey',
                                        fontWeight: 'bolder',
                                        marginTop: 2
                                    }}>
                                        Temporal Granularity : {temporalGranularity}
                                    </Typography>
                                    <div className="row">
                                        <Button
                                            variant="contained"
                                            className="row"
                                            color="secondary"
                                            size="small"
                                            onClick={() => this.toggleTableView(index)}
                                            // startIcon={<AvTimerIcon />}
                                            style={{ height: 15 }}>
                                            view
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className="row"
                                            color="secondary"
                                            size="small"
                                            // startIcon={<AvTimerIcon />}
                                            style={{ height: 15, marginLeft: 5 }}>
                                            <CSVLink data={content} separator={","} headers={headers} filename={fileName}>Download</CSVLink>
                                        </Button>

                                    </div>

                                </ListItemText>
                                <div>
                                    <Dialog fullScreen open={this.state.tableVisibility[index]} onClose={() => this.toggleTableView(index)} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">
                                            <Typography style={{
                                                fontSize: 15,
                                                fontFamily: 'Courier New',
                                                color: 'grey',
                                                fontWeight: 'bolder',
                                            }}>
                                                Integration summary
                                            </Typography>
                                        </DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                <Typography style={{
                                                    fontSize: 10,
                                                    fontFamily: 'Courier New',
                                                    color: 'grey',
                                                    fontWeight: 'bolder',
                                                    marginTop: 2
                                                }}>
                                                    Fused data set No:  {index + 1}
                                                </Typography>
                                                <Typography style={{
                                                    fontSize: 10,
                                                    fontFamily: 'Courier New',
                                                    color: 'grey',
                                                    fontWeight: 'bolder',
                                                    marginTop: 2
                                                }}>
                                                    TimeStamp : {timestamp}
                                                </Typography>
                                                <Typography style={{
                                                    fontSize: 10,
                                                    fontFamily: 'Courier New',
                                                    color: 'grey',
                                                    fontWeight: 'bolder',
                                                    marginTop: 2
                                                }}>
                                                    Spatial Granularity : {spatialGranularity}
                                                </Typography>
                                                <Typography style={{
                                                    fontSize: 10,
                                                    fontFamily: 'Courier New',
                                                    color: 'grey',
                                                    fontWeight: 'bolder',
                                                    marginTop: 2
                                                }}>
                                                    Temporal Granularity : {temporalGranularity}
                                                </Typography>
                                            </DialogContentText>
                                            <table style={{
                                                width: "100%"
                                            }}>
                                                <thead>
                                                    <tr>
                                                        {
                                                            headers.map(header => {
                                                                return <th style={{ padding: "15px", borderSpacing: "5px", border: "1px dotted #999" }}>{header}</th>
                                                            })
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        content.map(row => {
                                                            return (
                                                                <tr>
                                                                    {
                                                                        row.map(item => {
                                                                            return (
                                                                                <td style={{ padding: "15px", borderSpacing: "5px", border: "1px dotted #999" }}>
                                                                                    {item}
                                                                                </td>
                                                                            )
                                                                        })
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>

                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => this.toggleTableView(index)} color="primary">
                                                Back
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>

                            </ListItem>
                        );
                    })
                    }
                </List>



            </div>
        )
    }
}
export default Outputdataframe;