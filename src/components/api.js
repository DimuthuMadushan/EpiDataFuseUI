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

    initializePipeline = (data) =>{
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
    configureSchema = (data) => {
        return this.init().post("/configureschema", { data: data });
    };
}