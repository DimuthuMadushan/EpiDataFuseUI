import React from 'react';
import axios from 'axios';
class initiate extends React.Component {

    postConfigurations = (e) => {
        let response = this.state.response
        if (!this.state.errorMsg["featureName"] & !this.state.errorMsg["atttributes"] & !this.state.errorMsg["configurations"]) {
            axios
                .post('https://localhost:8080/init',)
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render() {
        return (
            <div >
                <div></div>
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.initiate}>Initialize</button>

            </div>
        )
    }
}

export default initiate;