import http from "../http-common";

class ShopService{
    async createOrder(data){
        const res = await http.post("shop/orders/", data);
        return res.data;
    }

    async getOrders(customer_id){
        const res = await http.get(`shop/orders/?id=${customer_id}`)
        return res.data
    }
}

export default new ShopService();
