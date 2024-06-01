import axios from "axios";

export default class Api{
    urlBase="";
    constructor(){
        this.urlBase = 'http://localhost:3001/';
    }   
    post = (url,data)=>{
        return axios.post(this.urlBase + url, data, {headers: {'Content-Type': 'application/json'}})
    }
}

