import http from "../http-common";

class AuthService{
    async postLogin(data){
        try{
            return http.post('api-token-auth/', data)
        }catch(err){
            console.log(err);
        }
    }

    async postSignUp(data){
        return http.post('shop/customer/create/', data)
    }
    
}

export default new AuthService();