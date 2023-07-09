import http from "../http-common";

class ContactService{
    async postForm(form){

        try{
            const res = await http.post('contact/contact_form/', form);
            return res.data;
        }catch (err) {
            console.log(err);
        }

    }
}

export default new ContactService();