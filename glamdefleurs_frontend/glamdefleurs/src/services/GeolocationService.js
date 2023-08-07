import http from "../http-common";

// TODO: HIDE API KEY

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

    async getDistanceFromOrigin(address){
        try{
            const geocode = await this.getGeocode(address);
            const destination = String(geocode.lat) + ", " + String(geocode.lon);
            const res = await http.get('https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix', {
                params: {
                    origins: ORIGIN_COORDS,
                    destinations: destination
                },
                headers: {
                    'X-RapidAPI-Key': 'f688891cb9mshf100bfe48237605p118762jsn36e61cd40949',
                    'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com'
                }
            })

            return res.data.distances[0][0];
        }catch (err){
            console.log(err);
        }
    }
    
}

export default new GeolocationService();