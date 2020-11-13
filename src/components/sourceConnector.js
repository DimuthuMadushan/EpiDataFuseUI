import React from 'react';
import axios from 'axios';

class Connector extends React.Component {
    state = {
        parameters:{url:"",requestFrequency:"",batchSize:""},
        sourceConnector:[{featureName:"", sourceType:"", parameters:{}}],
        response:""
        
    }
    
 
    handleChange = (e) => {
        let sourceConnector = this.state.sourceConnector
        if(["featureName","sourceType"].includes(e.target.id)){
            sourceConnector[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
            this.setState({sourceConnector},()=>{
                console.log(sourceConnector)
            })
        } else {
            let parameters = this.state.parameters
            parameters[e.target.id] = e.target.value.toUpperCase()
            sourceConnector[e.target.dataset.id]["parameters"] = parameters
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
                                <br />
                                <label>Source Type</label>
                                <input className="w3-input" data-id={idx} type="text" id="sourceType"></input>
                                <br />
                                <label>Parameters</label>
                                <br/>
                                <label  className="col-50">URL</label>
                                <input type="text" data-id={idx} id="url" className="col-75"/>
                                <label  className="col-50">Request Frequency</label>
                                <input type="text"  data-id={idx} id="requestFrequency" className="col-75"/>
                                <label  className="col-50">Batch Size</label>
                                <input type="text" data-id={idx} id="batchSize" className="col-75"/>
                                
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
            <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.postConfigurations}>Submit</button>
        </div>
        )
    }
}

export default Connector;