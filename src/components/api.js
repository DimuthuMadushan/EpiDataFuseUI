import * as axios from "axios";

export default class Api {
    constructor() {
        this.client = null;
        this.api_url = "https://82322875-5249-4d82-b45a-e1778c35457a.mock.pstmn.io";
    }

    init = () => {

        let headers = {
            Accept: "application/json",
        };

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000,
            headers: headers,
        });

        return this.client;
    };

    createPipeLine = (data) => {
        return this.init().post("/createnewpipeline", { data: data });
    };

    configureSchema = (data) => {
        return this.init().post("/configureschema", { data: data });
    };
}