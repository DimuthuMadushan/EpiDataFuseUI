import React from 'react';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { BrowserRouter as matchPath, Link } from 'react-router-dom';
import Api from '../api';
import PipelineDataService from '../../firebase/pipelineDataService';
import firebase from "../../firebase/firebase";
import Input from '@material-ui/core/Input';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';

class PipelineMenu extends React.Component {

  constructor() {
    super();
    this.state = {
      pipelineNames: [],
      pipelineName: "",
      pipelines: [{ pipelineName: "", status: "", isConfigured: "False" }],
      displayUI: "none",
      errorMsg: "",
      response: "",
      form: "none",
      selectedFile: []
    }

    this.retriveData()
  }

  api = new Api();

  retriveData = () => {
    console.log("Here")
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
    if (pipelineName == "") {
      let error = "Pipeline Name can not be null"
      this.setState({ errorMsg: error })
    } else {
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

      let data = this.api.createPipeLine({ pipeline_name: pipelineName });
      this.setState({ response: data });
      this.state.pipelineName = "";
    }

  }

  handleChange = (e) => {
    this.setState({ errorMsg: "" })
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

  handleClick = (e) => {
    console.log(e)
  }

  initializePipeline = (name) => {
    let data = this.api.initializePipeline(name);
    console.log("data in pipeline" + data);
  }

  deletePipeline = (name) => {
    PipelineDataService.deletePipeline(name);
  }

  clearPipelineName = () => {
    this.setState({ pipelineName: "" });
    this.setState({ "displayUI": "none" });
    this.setState({ "form": "none" });
  }

  fileHandler = (e) => {
    let fileList = this.state.selectedFile
    fileList.push(e.target.files[0])
    this.setState({
      selectedFile: fileList
    }, () => {
      console.log(this.state.selectedFile)
    })
  }

  uploadHandler = () => {
    const fd = new FormData();
    const files = this.state.selectedFile
    for (let i = 0; i < files.length; i++) {
      fd.append(`config[${i}]`, files[i], files[i].name)
    }
    axios.post("url", fd)
      .then(res => {
      })
  }

  render() {
    let pipelineNames = this.state.pipelineNames
    let selectedFile = this.state.selectedFile
    let pipelineList = pipelineNames.length > 0 &&
      pipelineNames.map((val, i) => {
        let status = val.status
        return (
          <tr key={i} >
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
            <td>
              <Link to={{ pathname: '/pipeline', state: { pipelineId: val.pipelineName } }} style={{ 'height': 10, 'paddingTop': 1, textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  color="default"
                  size="small"
                  startIcon={<SettingsIcon />}
                >
                  Configure
                </Button>
              </Link>
            </td>
            <td>
              <Button
                variant="contained"
                color="default"
                size="small"
                onClick={() => { this.deletePipeline(val.pipelineName) }}
                startIcon={<DeleteIcon />}
              >
                Delete
               </Button>
            </td>
          </tr>
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

          <table className="w3-table-all w3-col-50" style={{ "marginBottom": 10 }}>
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
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pipelineList}
            </tbody>
          </table>

          <div className="w3-border w3-left" style={{ width: this.state.displayUI === "block" | this.state.form === "block" ? "77%" : "auto" }}>
            <button className="w3-btn w3-border w3-blue w3-small w3-left" style={{
              "marginBottom": this.state.displayUI === "block" | this.state.form === "block" ? 10 : 0,
              "marginLeft": this.state.displayUI === "block" | this.state.form === "block" ? 120 : 0,
              "marginTop": this.state.displayUI === "block" | this.state.form === "block" ? 10 : 0,
              "height": 25,
              "paddingTop": 4
            }} onClick={this.handleCreate} >
              <Typography style={{
                fontSize: 12,
                fontFamily: 'Courier New',
                color: 'white',
                fontWeight: 'bolder'
              }}>Create a new pipeline</Typography>
            </button>

            <div className="w3-border w3-left" style={{
              display: this.state.displayUI, "marginBottom": 10,
              "marginLeft": 50, padding: 5, width: "77%"
            }}>
              <div className="h7">{this.state.errorMsg}</div>
              <div className="response">{this.state.response}</div>
              <div style={{ "marginBottom": 10 }}>
                <form noValidate autoComplete="off">
                  <TextField id="pipelineName" onChange={this.handleChange}
                    value={this.state.pipelineName} label="Enter Pipeline name" />
                </form>
              </div>
              <button className="w3-btn w3-red w3-bar w3-bar-item  w3-border w3-border  w3-left"
                style={{ "marginLeft": 40, "height": 20, paddingTop: 3 }} onClick={this.clearPipelineName}><Typography style={{
                  fontSize: 10,
                  fontFamily: 'Courier New',
                  color: 'white',
                  fontWeight: 'bolder',
                }}>cancel</Typography></button>
              <button className="w3-btn w3-green w3-bar-item w3-bar w3-border w3-border  w3-right"
                style={{ "marginRight": 40, "height": 20, paddingTop: 3 }} onClick={this.createPipeline} ><Typography style={{
                  fontSize: 10,
                  fontFamily: 'Courier New',
                  color: 'white',
                  fontWeight: 'bolder'
                }}>create</Typography></button>

              <button className="w3-btn w3-white w3-border w3-left"
                style={{
                  "display": this.state.form === "none" ? "block" : "none",
                  "marginBottom": 10,
                  "marginLeft": 40,
                  "marginTop": 10,
                  "height": 17,
                  "paddingTop": 2
                }} onClick={this.useConfig}>

                <Typography style={{
                  fontSize: 8,
                  fontFamily: 'Courier New',
                  color: 'black',
                  textDecoration: "underline",
                  fontWeight: 'bolder'
                }}>USE CONFIG FILE INSTEAD
                </Typography>
              </button>
            </div>

            <div className="w3-border w3-left" style={{
              display: this.state.form, "marginBottom": 10,
              "marginLeft": 50, padding: 5, width: "77%"
            }}>
              <div style={{ "marginBottom": 10 }}>
                <form noValidate autoComplete="off">
                  <Input className="formCotrol" type="file" placeholder="choose file" onChange={this.fileHandler} multiple></Input>
                </form>
                <div>
                  {
                    selectedFile.map((val, idx) => {
                      let inputId = `${idx}`
                      return (
                        <h4
                          style={{
                            fontSize: 14, fontFamily: 'Courier New',
                            color: 'grey', fontWeight: 'bolder', align: 'left'
                          }}>
                          {val.name}
                        </h4>
                      )
                    })
                  }
                </div>
              </div>

              <button className="w3-btn w3-white w3-bar w3-bar-item  w3-border w3-border-red w3-round w3-left"
                style={{ "marginLeft": 40, "height": 13 }} onClick={this.clearPipelineName}><Typography style={{
                  fontSize: 12,
                  fontFamily: 'Courier New',
                  color: 'grey',
                  fontWeight: 'bolder'
                }}>cancel</Typography></button>
              <button className="w3-btn w3-white w3-bar-item w3-bar w3-border w3-border-green w3-round w3-right"
                style={{ "marginRight": 40, "height": 13 }} onClick={this.createPipeline} ><Typography style={{
                  fontSize: 12,
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
export default PipelineMenu;


