import React from 'react';
import { Checkbox, Typography } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Route, BrowserRouter as Router, useParams, useHistory, useRouteMatch, matchPath, Switch, Link } from 'react-router-dom';
import AddIcon from "@material-ui/icons/Add";
import { Fab, Button } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Api from './api';
import Pipeline from './pipeline';
import PipelineDataService from '../firebase/pipelineDataService';
import firebase from "../firebase/firebase";
import Input from '@material-ui/core/Input';

class CreatePipeline extends React.Component {

  constructor() {
    super();
    this.state = {
      pipelineNames: [],
      pipelineName: "",
      pipelines: [{ pipelineName: "", status: "" }],
      displayUI: "none",
      form: "none",
    }

    this.retriveData()
  }

  api = new Api();

  retriveData = () => {
    var uid = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + uid + '/pipelines/')
      .on("value", snapshot => {
        if (snapshot && snapshot.exists()) {
          let pipelines = []
          snapshot.forEach((childSnapshot) => {
            pipelines.push(childSnapshot.val());
          })
          this.setState({ pipelineNames: pipelines })
        }
      })
  }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  componentDidMount() {
    this.retriveData();
    // this.setState({pipelineNames:this.props.pipelineNames})
  }

  createPipeline = () => {
    let pipelines = [...this.state.pipelines]
    var id = pipelines.length
    let pipelineName = this.state.pipelineName
    pipelines[id - 1]["pipelineName"] = pipelineName
    pipelines[id - 1]["status"] = "idle"
    this.setState({ pipelines }, () => {
      console.log(pipelines)
    })

    this.setState((prevState) => ({
      pipelines: [...prevState.pipelines, { pipelineName: "", status: "" }]
    }), () => {
      console.log(this.state.pipelines[id - 1])
      PipelineDataService.updatePipeline(pipelineName, this.state.pipelines[id - 1]);
      let { path, url } = matchPath
    });

    this.api.createPipeLine({ "pipelineName": pipelineName })
      .then((response) => console.log("response ", response))
      .catch((err) => console.log(err));;

    this.state.pipelineName = "";
  }

  handleChange = (e) => {
    this.setState({ pipelineName: e.target.value });
  }

  handleCreate = () => {
    let displayUI = this.state.displayUI
    if (displayUI === "none") {
      displayUI = "block"
      this.setState({ displayUI })
    } else {
      displayUI = "none"
      this.setState({ displayUI })
    }
  }

  useConfig = () => {
    let form = this.state.form
    let displayUI = this.state.displayUI
    if (form === "none") {
      form = "block"
      displayUI = "none"
      this.setState({ displayUI })
      this.setState({ form })
    } else {
      form = "none"
      displayUI = "none"
      this.setState({ form })
    }
  }

  select = (e) => {
    let UI, form = this.state.display
    if (e.target.value == "0") {
      UI = "block"
      form = "none"
      this.setState({ UI, form })
    } else if (e.target.value == "1") {
      form = "block"
      UI = "none"
      this.setState({ UI, form })
    }
  }

  clearPipelineName = () => {
    this.setState({ pipelineName: "" });
    this.setState({ "displayUI": "none" });
    this.setState({ "form": "none" });
  }

  render() {
    let pipelineNames = this.state.pipelineNames
    let pipelineList = pipelineNames.length > 0 &&
      pipelineNames.map((val, i) => {
        let status = val.status
        return (
          <tr key={i}>
            <td><Typography style={{
              fontSize: 10,
              fontFamily: 'Courier New',
              color: 'grey',
              fontWeight: 'bolder'
            }}>{val.pipelineName}</Typography></td>
            <td><Typography style={{
              fontSize: 10,
              fontFamily: 'Courier New',
              fontWeight: 'bolder',
              color: status === "running" ? "green" : "orange"
            }}>{val.status}</Typography></td>
          </tr >
        )
      }, this);

    return (
      <div className="w3-container w3-center">
        <div className="w3-half w3-border" style={{ "padding": 10 }} >

          <Typography className="w3-bar" style={{
            fontSize: 12,
            fontFamily: 'Courier New',
            color: 'grey',
            fontWeight: 'bolder',
            marginBottom: 3
          }}>Fusion pipelines</Typography>

          <table className="w3-table-all w3-col-50" style={{ "margin-bottom": 10 }}>
            <thead>
              <tr>
                <th><Typography style={{
                  fontSize: 12,
                  fontFamily: 'Courier New',
                  color: 'grey',
                  fontWeight: 'bolder'
                }}> Pipeline</Typography></th>
                <th><Typography style={{
                  fontSize: 12,
                  fontFamily: 'Courier New',
                  color: 'grey',
                  fontWeight: 'bolder'
                }}>Status</Typography></th>
              </tr>
            </thead>
            <tbody>
              {pipelineList}
            </tbody>
          </table>

          <div className="w3-border w3-left" style={{ width: this.state.displayUI === "block" | this.state.form === "block" ? "77%" : "auto" }}>
            <button className="w3-btn w3-white w3-border w3-small w3-left" style={{
              "margin-bottom": this.state.displayUI === "block" | this.state.form === "block" ? 10 : 0,
              "margin-left": this.state.displayUI === "block" | this.state.form === "block" ? 120 : 0,
              "margin-top": this.state.displayUI === "block" | this.state.form === "block" ? 10 : 0
            }} onClick={this.handleCreate} >
              <Typography style={{
                fontSize: 10,
                fontFamily: 'Courier New',
                color: 'grey',
                fontWeight: 'bolder'
              }}>Create a new pipeline</Typography>
            </button>
            <div className="w3-border w3-left" style={{
              display: this.state.displayUI, "margin-bottom": 10,
              "margin-left": 50, padding: 5, width: "77%"
            }}>
              <div style={{ "margin-bottom": 10 }}>
                <form noValidate autoComplete="off">
                  <TextField id="pipelineName" onChange={this.handleChange}
                    value={this.state.pipelineName} label="Pipeline name" />
                </form>
              </div>
              <button className="w3-btn w3-white w3-bar w3-bar-item  w3-border w3-border-red w3-round-large w3-left"
                style={{ "margin-left": 40 }} onClick={this.clearPipelineName}><Typography style={{
                  fontSize: 10,
                  fontFamily: 'Courier New',
                  color: 'grey',
                  fontWeight: 'bolder'
                }}>cancel</Typography></button>
              <button className="w3-btn w3-white w3-bar-item w3-bar w3-border w3-border-green w3-round-large w3-right"
                style={{ "margin-right": 40 }} onClick={this.createPipeline} ><Typography style={{
                  fontSize: 10,
                  fontFamily: 'Courier New',
                  color: 'grey',
                  fontWeight: 'bolder'
                }}>create</Typography></button>

              <button className="w3-btn w3-white w3-border w3-small w3-left"
                style={{
                  "display": this.state.form === "none" ? "block" : "none",
                  "margin-bottom": 10,
                  "margin-left": 40,
                  "margin-top": 10
                }} onClick={this.useConfig}>

                <Typography style={{
                  fontSize: 10,
                  fontFamily: 'Courier New',
                  color: 'black',
                  fontWeight: 'bolder'
                }}>Use a configuration file instead
                </Typography>
              </button>
            </div>

            <div className="w3-border w3-left" style={{
              display: this.state.form, "margin-bottom": 10,
              "margin-left": 50, padding: 5, width: "77%"
            }}>
              <div style={{ "margin-bottom": 10 }}>
                <form noValidate autoComplete="off">
                  <Input className="formCotrol" type="file" id="upload-file" placeholder="choose file"></Input>
                </form>
              </div>

              <button className="w3-btn w3-white w3-bar w3-bar-item  w3-border w3-border-red w3-round-large w3-left"
                style={{ "margin-left": 40 }} onClick={this.clearPipelineName}><Typography style={{
                  fontSize: 10,
                  fontFamily: 'Courier New',
                  color: 'grey',
                  fontWeight: 'bolder'
                }}>cancel</Typography></button>
              <button className="w3-btn w3-white w3-bar-item w3-bar w3-border w3-border-green w3-round-large w3-right"
                style={{ "margin-right": 40 }} onClick={this.createPipeline} ><Typography style={{
                  fontSize: 10,
                  fontFamily: 'Courier New',
                  color: 'grey',
                  fontWeight: 'bolder'
                }}>create</Typography></button>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default CreatePipeline;


