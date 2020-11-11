import React from 'react';
import { Checkbox } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
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

class CreatePipeline extends React.Component {
   
  constructor(){
    super();
    this.state={
      pipelineNames:[],
      pipelineName: "",
      pipelines: [{ pipelineName: "", status: "" }],
      display: "none",
      UI: "none",
      form: "none",
    }

    this.retriveData()
  }

  api = new Api();

  retriveData = () =>{
    var uid = firebase.auth().currentUser.uid;
    firebase
    .database()
    .ref('users/'+uid+'/pipelines/')
    .on("value", snapshot => {
        if (snapshot && snapshot.exists()) {
            let pipelines = []
            snapshot.forEach((childSnapshot)=>{
                pipelines.push(childSnapshot.val());
              })
            this.setState({pipelineNames:pipelines})
        }})
    }

  handleSubmit = (e) => {
      e.preventDefault()
  }

  componentDidMount(){
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
      console.log(this.state.pipelines[id-1])
      PipelineDataService.updatePipeline(pipelineName, this.state.pipelines[id-1]);
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
    let display = this.state.display
    if (display === "none") {
      display = "block"
      this.setState({ display })
    } else {
      display = "none"
      this.setState({ display })
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
  }

  render() {
    let pipelineNames = this.state.pipelineNames
    let pipelineList = pipelineNames.length > 0 &&
     pipelineNames.map((val, i) => {
            return (
              <tr key={i}>
                <td>{val.pipelineName}</td>
                <td>{val.status}</td>
              </tr>
            )
            }, this);

    return (
      <div>
        <div>
          <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.handleCreate} >Create Pipeline</button>
          <button className="w3-btn w3-white w3-border w3-border-green w3-round-large w3-right" >Refresh</button>
          <h6>
            <div className="w3-panel w3-border w3-half" style={{ display: this.state.display }}>
              <label className="col-25">Using</label>
              <br />
              <div>
                <RadioGroup aria-label="select" name="select1" value={this.value} onChange={this.select}>
                  <FormControlLabel value="0" control={<Radio />} label="UI" />
                  <FormControlLabel value="1" control={<Radio />} label="Config File" />
                </RadioGroup>
              </div>

              <div style={{ display: this.state.UI }}>
                <label className="col-25">Pipeline Name</label>
                <input id="pipelineName" onChange={this.handleChange} className="col-75" value={this.state.pipelineName} />
                <button className="w3-btn w3-white w3-border w3-border-red w3-round-large" onClick={this.clearPipelineName}>Cancel</button>
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.createPipeline} >Create</button>
              </div>
              <div style={{ display: this.state.form }}>
                <label className="col-25">Config file</label>
                <label htmlFor="upload-photo">
                  <input
                    style={{ display: "block" }}
                    id="upload-file"
                    name="upload-file"
                    type="file"
                  />
                  <button className="w3-btn w3-white w3-border w3-border-red w3-round-large"  >Cancel</button>
                  <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.createPipeline}>Create</button>
                </label>
              </div>
            </div>
          </h6>
        </div>
        <div>
        <h6>
            <table className="w3-table-all w3-col-50">
              <thead>
              <tr>
                <th>Pipeline</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              {pipelineList}
              </tbody>
            </table>
        </h6>
        </div>
      </div>

    )
  }
}
export default CreatePipeline;


