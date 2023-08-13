import axios from "axios";

const headers = {
    "Content-type": "application/json",
}

if(sessionStorage.getItem("auth_token")){
    headers["Authorization"] = "Token " + sessionStorage.getItem("auth_token")
}

// TODO: change the base URL 
export default axios.create({
    baseURL: "http://121.121.163.173:8000/",
    headers: headers
});