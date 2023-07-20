import http from "../http-common";

class FlowerService{
    async getAll(){
        try{
            const res = await http.get("flowers/");
            return res.data;
        }catch (err){
            console.log(err);
        }
    }

    async getFlowers(ids){
        // assums ids.length > 1
        // passing an array example: 127.0.0.1:8000/blogs?years=2018&years=2019
        // [2018, 2019]
        let queryString = "";

        ids.forEach((id) => {
            queryString = queryString + `&ids=${id}`;
        })

        queryString = queryString.slice(1);

        try{
            const res = await http.get(`flowers/?${queryString}`);
            const arr = res.data;
            
            return res.data;
        }catch (err){
            console.log(err);
        }
    }

    async getFlower(id){
        try{
            const res = await http.get(`flowers/${id}/`);
            return res.data;
        }catch (err){
            console.log(err);
        }
    }

    async getFlowersFromHead(head_id){
        try{
            const res = await http.get(`flowers/?head=${head_id}`);
            return res.data;
        }catch (err){
            console.log(err);   
        }
    }

    async getFlowersFromSub(sub_id){
        try{
            const res = await http.get(`flowers/?sub=${sub_id}`);
            return res.data;
        }catch (err){
            console.log(err);   
        }
    }

    async getPopularFlowers(){
        try {
            const res = await http.get("flowers/?popular=true");
            return res.data;
        }catch (err) {
            console.log(err);
        }
    }

}

export default new FlowerService();