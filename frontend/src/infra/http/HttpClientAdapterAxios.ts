import HttpClientInterface from "./HttpClientInterface";
import axios from "axios";

export default class HttpClientAdapterAxios implements HttpClientInterface {

    async get(url: string): Promise<any> {
        const response = await axios.get(url);
        return response.data;
    }

    async post(url: string, data: any): Promise<any> {
        const response = await axios.post(url, data);
        return response.data;
    }

}