import axios from 'axios';

export default class Api {
    constructor() {
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

    createPipeLine = (data) => {
        axios.post('http://localhost:8080/createPipeline', data)
            .then(function (response) {
                if (response.data.success) {
                    console.log(response.data.message);
                    return response.data.message;
                }
                else {
                    return response.data.message;
                }
            })
    }

    initializePipeline = (data) => {
        axios.post('http://localhost:8080/initPipeline', data)
            .then(function (response) {
                if (response.data.success) {
                    console.log(response.data.message);
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
                if (response.data.success) {
                    callback(response.data.message)

                } else {
                    callback(response.data.message)
                }
            })
    }

    addGranularity = (data) => {
        axios.post('http://localhost:8080/addGranularity', data)
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
                callback(response)
                if (response.data.success) {
                    return response.data.message;
                } else {
                    console.log(response);
                    return response.data.message;
                }
            })
    }

    getAttributeInfo = (data) => {

    }
}