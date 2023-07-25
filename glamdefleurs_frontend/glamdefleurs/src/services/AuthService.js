import http from "../http-common";

class AuthService{
    async postLogin(data){
        try{
            return http.post('api-token-auth/', data)
        }catch(err){
            console.log(err);
        }
    }

    // get user details
    
}

export default new AuthService();