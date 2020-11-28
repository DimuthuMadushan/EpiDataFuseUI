import React from 'react';
import axios from 'axios';
class Queries extends React.Component {
    state = {
        query: [{ queryName: "", catalog: "", schema: "", query: "" }],
        response: ""
    }

    handleChange = (e) => {
        let query = this.state.query
        query[e.target.dataset.id][e.target.id] = e.target.value.toUpperCase()
        this.setState({ query }, () => {
            console.log(query)
        })
    }

    addQuery = () => {
        this.setState((prevState) => ({
            query: [...prevState.query, { queryName: "", catalog: "", schema: "", query: "" }],
        }));
    }

    postQuery = (e) => {
        let response = this.state.response
        axios
            .post('https://localhost:8080/query', this.state.query)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    removeQuery = (e) => {
        var arrayQuery = this.state.query;
        if (arrayQuery.length > 0) {
            arrayQuery.splice(-1, 1)
        }
        this.setState((prevState) => ({
            query: arrayQuery
        }));
    }
    handleSubmit = (e) => {
        e.preventDefault()
    }
    render() {
        let query = this.state.query
        return (
            <div >
                {
                    query.map((val, idx) => {
                        return (
                            <div key={idx} >
                                <form className="w3-container" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                                    <h6>
                                        <label className="col-100">Query #{idx + 1}</label>
                                        <div >
                                            <label className="col-25">Query Name</label>
                                            <input id="queryName" data-id={idx} className="col-75" />
                                            <label className="col-25">Catalaog</label>
                                            <input id="catalog" data-id={idx} className="col-75" />
                                            <label className="col-25">Schema</label>
                                            <input id="schema" data-id={idx} className="col-75 " />
                                            <label className="col-25">Query</label>
                                            <input id="query" data-id={idx} className="col-75 " />
                                        </div>
                                    </h6>
                                </form>
                                <br />
                            </div>
                        )
                    })
                }
                <button className="w3-button w3-circle w3-teal" onClick={this.removeQuery}>-</button>
                <button className="w3-button w3-circle w3-teal" onClick={this.addQuery}>+</button>
                <div className="response w3-panel w3-border">{this.state.response}</div>
                <button className="w3-btn w3-white w3-border w3-border-green w3-round-large" onClick={this.postQuery}>Execute</button>
            </div>
        )
    }
}

export default Queries;