import axios from "axios";

// TODO: change the base URL 
export default axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Content-type": "application/json"
    }
});