import http from "../http-common";

const ORIGIN_COORDS = '43.53016, -79.659641'

class GeolocationService{

    async getGeocode(address){
        try{
            const res = await http.get('https://geocode.maps.co/search', {
                params: {
                    q: address
                },
            })

            return res.data[0]
        } catch(err){
            console.log(err);
        }
    }

    async getDistanceFromOrigin(address, rapidapi_key){
        try{
            const geocode = await this.getGeocode(address);
            const destination = String(geocode.lat) + ", " + String(geocode.lon);
            const res = await http.get('https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix', {
                params: {
                    origins: ORIGIN_COORDS,
                    destinations: destination
                },
                headers: {
                    'X-RapidAPI-Key': rapidapi_key,
                    'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com'
                }
            })

            return res.data.distances[0][0];
        }catch (err){
            return 20000
        }
    }
    
}

export default new GeolocationService();