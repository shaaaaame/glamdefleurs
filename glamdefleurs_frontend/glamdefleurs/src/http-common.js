import axios from "axios";

// TODO: change the base URL 
export default axios.create({
    baseURL: "http://121.121.172.156:8000/",
    headers: {
        "Content-type": "application/json",
        ... ( localStorage.getItem("auth_token") ? {
            "Authorization": "Token " + String(localStorage.getItem("auth_token"))
        } : {})
    }
});