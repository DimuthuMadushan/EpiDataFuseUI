import React from 'react';
import axios from 'axios';
import { Typography } from '@material-ui/core';

class Outputdataframe extends React.Component {

    constructor() {

        super();
        this.state = {
            dataFrames: [],
            tableVisibility: []
        }
    }

    componentDidMount() {
        this.retriveData()
    }

    retriveData = () => {
        axios.post('http://localhost:8080/getdataframes')
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

    render() {

        var dataFrames = this.state.dataFrames;

        return (
            <div>
                <div>

                    {dataFrames.map((frame, index) => {
                        var fileName = frame.fileName;
                        var headers = frame.headers;
                        var content = frame.content;

                        var nameParams = fileName.split('_');

                        var spatialGranularity = nameParams[1];
                        var temporalGranularity = nameParams[2];
                        var timestamp = nameParams[3].substring(0, 17);

                        return (

                            <div>
                                <span style={{ display: "inline-block" }}>
                                    <h4>
                                        Data Frame {index + 1}
                                    </h4>

                                    <h4>
                                        TimeStamp : {timestamp}
                                    </h4>

                                    <h4>
                                        Spatial Granularity : {spatialGranularity}
                                    </h4>

                                    <h4>
                                        Spatial Granularity : {temporalGranularity}
                                    </h4>

                                    <button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                                        fontSize: 12,
                                        fontFamily: 'Courier New',
                                        color: 'white',
                                        fontWeight: 'bolder'
                                    }} onClick={() => this.toggleTableView(index)}>Show/Hide</Typography></button>
                                </span>
                                <table style={{
                                    display: this.state.tableVisibility[index] === true ? "block" : "none",
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
                            </div>
                        );


                    })
                    }
                </div>
                {/* <Fragment>
                    {attendence.map(person => {
                        return (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        {person.Attendence.map(personAttendendance => {
                                            return <th>{personAttendendance.date}</th>;
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{person.Name}</td>
                                        {person.Attendence.map(personAttendendance => {
                                            return <td>{personAttendendance.attendence}</td>;
                                        })}
                                    </tr>
                                </tbody>
                            </Table>
                        );
                    })}
                </Fragment> */}


            </div>
        )
    }
}
export default Outputdataframe;