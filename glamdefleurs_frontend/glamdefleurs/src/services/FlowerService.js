import http from "../http-common";

class FlowerService{
    async getAll(){
        try{
            const res = await http.get("/flowers");
            return res.data;
        }catch (err){
            console.log(err);
        }
    }

    async get(id){
        try{
            const res = await http.get(`/flowers/${id}`);
            return res.data;
        }catch (err){
            console.log(err);
        }
    }

    async getFlowersFromHead(head_id){
        try{
            const res = await http.get(`/flowers/?head=${head_id}`);
            return res.data;
        }catch (err){
            console.log(err);   
        }
    }

    async getFlowersFromSub(sub_id){
        try{
            const res = await http.get(`/flowers/?sub=${sub_id}`);
            return res.data;
        }catch (err){
            console.log(err);   
        }
    }
}

export default new FlowerService();