import React from 'react';
import axios from 'axios';

class Api extends React.Component{
    constructor() {
        super();
        this.response = "";
        this.client = null;
        this.api_url = "http://localhost:8080";
    }

    // init = () => {
    //
    //     let headers = {
    //         Accept: "application/json",
    //     };
    //
    //     this.client = axios.create({
    //         baseURL: this.api_url,
    //         timeout: 31000,
    //         headers: headers,
    //     });
    //
    //     return this.client;
    // };

    createPipeLine = (data, callback) => {
        axios.post('http://localhost:8080/createPipeline', data)
            .then(function (response) {
                if (response.data.success) {
                    callback(response.data.message);
                    return response.data.message;
                }
                else {
                    callback(response.data.message);
                    return response.data.message;
                }
            })
    }

    initializePipeline = (data, callback) => {
        axios.post('http://localhost:8080/initPipeline', data)
            .then(function (response) {
                if (response.data.success) {
                    callback(response)
                    return response.data.message;
                }
                else {
                    return response.data.message;
                }
            })
    }



    configureSchema = (data, callback) => {
        axios.post('http://localhost:8080/addFeatureSchema', data)
            .then(function (response) {
                console.log(response)
                if (response.data.success) {
                    callback(response.data.message, true)
                    return response.data.message;
                } else {
                    callback(response.data.message, false)
                    return response.data.message;
                }
            })
    }

    addGranularity = (data, callback) => {
        axios.post('http://localhost:8080/addGranularity', data)
            .then(function (response) {
                let res;
                if (response.data=="success!") {
                    res = "Successfully added a new granularity!"
                    callback(res, true);
                    return response.data;
                } else {
                    res = "Operation Failed!"
                    callback(response.data, false);
                    return response.data;
                }
            })
    }

    putFile = (data, config, callback) => {
        axios.put('http://localhost:8080/putFile', data, config)
            .then(function (response) {
                console.log(response);
                callback(response)
            })
    }

    bulkIngest = (data) => {
        axios.post('http://localhost:8080/ingest', data)
            .then(function (response) {
                console.log(response);
                if (response.data.success) {
                    return response.data.message;
                } else {
                    console.log(response);
                    return response.data.message;
                }
            })
    }

    ingestToGranularity = (data) => {
        axios.post('http://localhost:8080/ingestToGranularity', data)
            .then(function (response) {
                console.log(response);
                if (response.data.success) {
                    return response.data.message;
                } else {
                    console.log(response);
                    return response.data.message;
                }
            })
    }

    ingestToFeature = (data, callback) => {
        axios.post('http://localhost:8080/ingestToFeature', data)
            .then(function (response) {
                if (response.data.success) {
                    callback(response.data.message, true);
                    return response.data.message;
                } else {
                    callback(response.data.message, false)
                    return response.data.message;
                }
            })
    }

    getAttributeInfo = (data) => {

    }

    setFusionFrequency = (data, callback) => {
        axios.post('http://localhost:8080/setFusionFrequency', data)
            .then(function (response) {
                callback(response)
                if (response.data.success) {
                    return response.data.message;
                } else {
                    console.log(response);
                    return response.data.message;
                }
            })
    }

    addStreamingConfiguration = (data, callback) => {
        axios.post('http://localhost:8080/addStreamingConfiguration', data)
            .then(function (response) {
                callback(response)
                if (response.data.success) {
                    return response.data.message;
                } else {
                    console.log(response);
                    return response.data.message;
                }
            })
    }

}
export default Api;