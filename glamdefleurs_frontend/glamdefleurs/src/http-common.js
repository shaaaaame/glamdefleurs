import axios from "axios";

const headers = {
    "Content-type": "application/json",
}

if(sessionStorage.getItem("auth_token")){
    headers["Authorization"] = "Token " + sessionStorage.getItem("auth_token")
}

// TODO: change the base URL 
export default axios.create({
    baseURL: "https://api.glamdefleurs.ca/",
    headers: headers
});