const axios = require('axios');
const BASE_URL = "https://api.cloudflare.com/client/v4/"

class CloudFlareApi {
    constructor(token) {
        this.token = token;
    }

    async validate() {
        console.log("Verifying token validity")
        let response = await this.request("user/tokens/verify")
        return response.data.result.status === 'active';

    }

    request(uri, data = {}) {
        let body_text = "?"
        let headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
            "Accept-Encoding": ""
        }
        for (let datum in data) {
            body_text += datum + "=" + data[datum] + "&"
        }
        body_text = body_text.slice(0, -1)
        return axios.get(BASE_URL + uri + body_text, {
            headers
        })
    }


}

module.exports = CloudFlareApi