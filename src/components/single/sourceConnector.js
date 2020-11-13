import React from 'react';
import axios from 'axios';


class SourceConnector extends React.Component {
    state = {
        parameters:{url:"",requestFrequency:"",batchSize:""},
        sourceConnector:[{featureName:"", sourceType:"", parameters:{}}],
        postingFeatures:[{featureName:"", sourceType:"", parameters:{}}],
        errorMsg:{featureName:"", sourceType:"", url:"",requestFrequency:"",batchSize:""},
        response:""

    }


    handleChange = (e) => {
        let sourceConnector = this.state.sourceConnector
        let errorMsg = this.state.errorMsg
        errorMsg = {featureName:"", sourceType:"", url:"",requestFrequency:"",batchSize:""}
        let err = ""
        let id = e.target.dataset.id
        let val = e.target.value
        if(["featureName","sourceType"].includes(e.target.id)){
            sourceConnector[id][e.target.id] = e.target.value.toUpperCase()
            if (!this.state.sourceConnector[id]["featureName"]) {
                err = "Feature Name can not be null"
                errorMsg["featureName"] = err
                this.setState({errorMsg});
            } else if (!this.state.sourceConnector[id]["sourceType"]) {
                err = "Source Type can not be null"
                errorMsg["sourceType"] = err
                this.setState({errorMsg});
            } else {
                this.setState({sourceConnector, errorMsg}, () => {
                    console.log(sourceConnector)

                })
            }
        } else {
            let parameters = this.state.parameters
            if(e.target.id=="requestFrequency"){
                if (val !=="" && !Number(val)) {
                    err = "Request frequency must be a number";
                }
                errorMsg["requestFrequency"] = err
                this.setState({errorMsg});
            } else if(e.target.id=="batchSize"){
                if (val !=="" && !Number(val)) {
                    err = "Batch Size must be a number";
                }
                errorMsg["batchSize"] = err
                this.setState({errorMsg});
            }

            parameters[e.target.id] = e.target.value.toUpperCase()
            sourceConnector[id]["parameters"] = parameters
            this.setState({sourceConnector},()=>{
                console.log(sourceConnector)
            })
        }
    }
    addSource = () =>{
        this.setState((prevState) => ({
            parameters:{url:"",requestFrequency:"",batchSize:""},
            sourceConnector: [...prevState.sourceConnector, {featureName:"", sourceType:"", parameters:{}}],
        }));
    }
    postConfigurations = (e) =>{
        let response = this.state.response
        axios
            .post('https://localhost:8080', this.state.features)
            .then(response =>{
                console.log(response)
            })
            .catch(error =>{
                console.log(error)
            })
    }

    removeSource = (e) => {
        var arraySource = this.state.sourceConnector;
        if (arraySource.length > 0) {
            arraySource.splice(-1, 1)
        }
        this.setState((prevState) => ({
            sourceConnector: arraySource
        }));
    }

    addSource=()=> {
        let errorMsg = this.state.errorMsg
        let err = ""
        errorMsg["featureName"] = err
        let id = this.state.sourceConnector.length
        if (!this.state.parameters["url"] || !this.state.parameters["requestFrequency"] || !this.state.parameters["batchSize"]) {
            err = "Parameters can not be null"
            errorMsg["url"] = err
            this.setState({errorMsg})
        } else {
            this.setState({
                postingFeatures: [this.state.sourceConnector[id]]
            }, () => {
                console.log(this.state.postingFeatures);
            });

            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
            );

            this.setState((prevState) => ({
                parameters:{url:"",requestFrequency:"",batchSize:""},
                sourceConnector:[{featureName:"", sourceType:"", parameters:{}}],
                errorMsg:{featureName:"", sourceType:"", url:"",requestFrequency:"",batchSize:""},
                response:""
            }));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let sourceConnector = this.state.sourceConnector
        return(
            <div>
                {
                    sourceConnector.map((val, idx)=>{
                        return(
                            <div  key={idx} className="w3-border" >
                                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                                    <h6>
                                        <label>Feature Name</label>
                                        <input className="w3-input" data-id={idx} type="text" id="featureName"></input>
                                        <div className="h7">{this.state.errorMsg["featureName"]}</div>
                                        <br />
                                        <label>Source Type</label>
                                        <input className="w3-input" data-id={idx} type="text" id="sourceType"></input>
                                        <div className="h7">{this.state.errorMsg["sourceType"]}</div>
                                        <br />
                                        <div>
                                            <label>Parameters</label>
                                            <br/>
                                            <label>URL</label>
                                            <br />
                                            <input type="text" data-id={idx} id="url" className="col-75"/>
                                            <br/> <br/>
                                            <label>Request Frequency</label>
                                            <br/>
                                            <input type="text"  data-id={idx} id="requestFrequency" className="col-75"/>
                                            <br/> <br/>
                                            <div className="h7">{this.state.errorMsg["requestFrequency"]}</div>
                                            <label>Batch Size</label>
                                            <br/>
                                            <input type="text" data-id={idx} id="batchSize" className="col-75"/>
                                            <br/> <br/>
                                            <div className="h7">{this.state.errorMsg["batchSize"]}</div>
                                        </div>
                                        <div className="h7">{this.state.errorMsg["url"]}</div>
                                    </h6>
                                </form>
                                <br/><br/>
                            </div>
                        )
                    })
                }
                <button className="w3-button w3-circle w3-teal" onClick={this.removeSource}>-</button>
                <button className="w3-button w3-circle w3-teal" onClick={this.addSource}>+</button>
                <br/>
                <br/>
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addSource}>Submit</button>
            </div>
        )
    }
}

export default SourceConnector;