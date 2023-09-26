import http from "../http-common";

class CategoryService{
    async getAllSubCategories(){
        try{
            const res = await http.get("/categories/")
            return res.data
        }catch (err) {
            console.log(err);
        }
    }

    async getAllHeadCategories(){
        try {
            const res = await http.get("/head_categories/")
            return res.data
        }catch (err) {
            console.log(err);
        }
    }

    async getSubCategory(id){
        try {
            const res = await http.get(`/categories/${id}/`)
            return res.data
        }catch (err) {
            console.log(err);
        }
    }

    async getHeadCategory(id){
        try {
            const res = await http.get(`/head_categories/${id}`)
            return res.data
        }catch (err) {
            console.log(err);
        }
    }
    async getCategories(){
        try {
            const head = await http.get('/head_categories/');
            const sub = await http.get('/categories/');

            for (const s of sub.data){
                for (const h of head.data){
                    if (s.head_category == h.id && !s.hidden){
                        if (h.subcategories){
                            h.subcategories.push(s)
                        }else{
                            h.subcategories = [s]
                        }
                    }
                }
            }

            return head.data
        }catch (err ){
            console.log(err);
        }
    }
}

export default new CategoryService();