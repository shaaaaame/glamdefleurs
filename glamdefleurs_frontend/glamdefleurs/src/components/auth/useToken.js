import { useState } from "react";

function useToken() {
    const getToken = () => {
        const token = sessionStorage.getItem("auth_token");
        return token;
    }

    const [ token, setToken ] = useState(getToken());

    const saveToken = (token) => {
        sessionStorage.setItem("auth_token", token);
        setToken(token);
    }

    const removeToken = () => {
        sessionStorage.removeItem("auth_token");
        setToken(null);
    }


    return (
        {
            token,
            setToken: saveToken,
            removeToken,
        }
    )
}

export default useToken