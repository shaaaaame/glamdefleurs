import http from "../http-common";

class CustomerService{
    async getCustomerData(){

        try{
            const res = await http.get('shop/customer/');
            return res.data;
        }catch (err) {
            console.log(err);
        }

    }
}

export default new CustomerService();