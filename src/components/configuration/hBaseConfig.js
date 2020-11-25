import React from 'react';
import axios from 'axios';
class hBaseConfig extends React.Component {
    state = {
        hbase: {zookeepers:"", catalog:""},
        errorMsg: {zookeepers:"",catalog:""},
        response:""
    }
    
 
    handleChange = (e) => {
        let hbase = this.state.hbase
        let errorMsg = {zookeepers:"",catalog:""}
        let err=""
        this.setState({errorMsg})
        hbase[e.target.id] = e.target.value.toUpperCase()
        this.setState({hbase},()=>{
            console.log(hbase)
            if(!this.state.hbase["zookeepers"]){
                err = "Zookeepers can not be null"
                errorMsg["zookeepers"] = err
                this.setState({errorMsg})
            } else if(!this.state.hbase["catalog"]){
                err = "Catalog can not be null"
                errorMsg["catalog"] = err
                this.setState({errorMsg})
            } 
        })
    }
    addHBaseConfig =()=>{
        this.postConfigurations()
    }
    postConfigurations=()=>{
        let response = this.state.response
        if(!this.state.errorMsg["catalog"] & !this.state.errorMsg["zookeepers"]){
            axios
            .post('https://localhost:8080', this.state.features)
            .then(response =>{
                console.log(response)
            })
            .catch(error =>{
                console.log(error)
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let {records, shpFile} = this.state
        return(
        <div >
            <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h6>
                    <div className="w3-panel w3-border">
                        <label>HBase</label>
                        <br/>
                        <label>Zookeepers</label>
                        <input className="w3-input" type="text" id="zookeepers"></input>
                        <div className="h7">{this.state.errorMsg["zookeepers"]}</div>
                        <br/>
                        <label>Catalog</label>
                        <input className="w3-input" type="text" id="catalog"></input>
                        <div className="h7">{this.state.errorMsg["catalog"]}</div>
                    </div>
                    
                </h6>
            </form>
            <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.addHBaseConfig}>Submit</button>

        </div>
        )
    }
}

export default hBaseConfig;