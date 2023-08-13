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

    async patchCustomerData(data){
        const res = await http.patch('shop/customer/', data)
        return res.data

    }
}

export default new CustomerService();