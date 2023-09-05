import http from "../http-common";

class ShopService{
    async createOrder(data){
        return await http.post("shop/orders/", data);
    }

    async getOrders(customer_id){
        return await http.get(`shop/orders/?id=${customer_id}`)
    }
}

export default new ShopService();
