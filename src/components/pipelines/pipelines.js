import React from 'react';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { BrowserRouter as matchPath, Link } from 'react-router-dom';
import Api from '../api';
import PipelineDataService from '../../firebase/pipelineDataService';
import firebase from "../../firebase/firebase";
import Input from '@material-ui/core/Input';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from "@material-ui/core/CircularProgress";

class PipelineMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pipelineNames: [],
      pipelineName: "",
      pipelines: [{ pipelineName: "", status: "", isConfigured: "False" }],
      displayUI: "none",
      errorMsg: "",
      response: "",
      form: "none",
      selectedFile: [],
      openDialog: false,
      isSuccess:false,
      wait:false,
    }
    this.retriveData()
  }

  setResponse=(res)=>{
    this.setState({response:res, isSuccess: true},()=>{
      this.setState({wait:!this.state.wait},()=>{
        console.log(this.state.wait);
      });
      console.log(this.state.response)
    })
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
    this.setState({wait:!this.state.wait});
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
        let data = this.api.createPipeLine({ pipeline_name: pipelineName }, this.setResponse);
        console.log(this.state.pipelines[id - 1])
        PipelineDataService.updatePipeline(pipelineName, this.state.pipelines[id - 1]);
        let { path, url } = matchPath
      });
      this.state.pipelineName = "";
    }
    this.handleClose()

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

  handleClickOpen = () => {
    this.setState({ openDialog: true })
  };

  handleClose = () => {
    this.setState({ openDialog: false })
  };

  handleAlert = () => {
    this.setState({response:"", isSuccess:false})
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
                  variant=""
                  color="grey"
                  size="small"
                  startIcon={<SettingsIcon />}
                  style={{ height: 20 }}
                >
                </Button>
              </Link>
            </td>
            <td>
              <Button
                variant=""
                color="grey"
                size="small"
                onClick={() => { this.deletePipeline(val.pipelineName) }}
                startIcon={<DeleteIcon />}
                style={{ height: 20 }}
              >
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
                <th style={{ width: 20 }}></th>
                <th style={{ width: 20 }}></th>
              </tr>
            </thead>
            <tbody>
              {pipelineList}
            </tbody>
          </table>

          <div className="w3-left" style={{ width: this.state.displayUI === "block" | this.state.form === "block" ? "77%" : "auto" }}>
            <Button className="w3-left" style={{
              "marginBottom": this.state.displayUI === "block" | this.state.form === "block" ? 10 : 0,
              "marginLeft": this.state.displayUI === "block" | this.state.form === "block" ? 120 : 0,
              "marginTop": this.state.displayUI === "block" | this.state.form === "block" ? 10 : 0,
              "height": 30,
              "paddingTop": 4
            }} onClick={this.handleClickOpen}
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              style={{ height: 30 }} >
              Create a new pipeline
            </Button>



            <div>
              <Dialog open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                  <Typography style={{
                    fontSize: 15,
                    fontFamily: 'Courier New',
                    color: 'grey',
                    fontWeight: 'bolder',
                  }}>
                    Create a new Pipeline
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Typography style={{
                      fontSize: 12,
                      fontFamily: 'Courier New',
                      fontWeight: 'bolder',
                    }}>
                      Create a new pipeline for continous spatio-temporal data fusion
                    </Typography>
                  </DialogContentText>
                  <div>
                    <div className="h7">{this.state.errorMsg}</div>
                    <div className="response">{this.state.response}</div>
                    <div>
                      <form noValidate autoComplete="off">
                        <TextField id="pipelineName" onChange={this.handleChange}
                          value={this.state.pipelineName} label="Enter Pipeline name" />
                      </form>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.createPipeline} color="primary">
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
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
            </div>
            <Dialog
                open={this.state.isSuccess}
                onClose={this.handleAlert}
            >
              <DialogContent>
                <div style={!this.state.isSuccess ? { display: 'none' } : {}}>
                <Alert severity="success"><Typography style={{
                  fontSize: 12,
                  fontFamily: 'Courier New',
                  color: 'grey',
                  fontWeight: 'bolder',
                }}>{this.state.response}</Typography>
                </Alert>
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
      </div>
    )
  }
}
export default PipelineMenu;


