const axios = require('axios');
const BASE_URL = "https://api.cloudflare.com/client/v4/"
const IP_API_URL = "https://api.ip.pe.kr"

class CloudFlareApi {
    constructor(token, key, email) {
        this.token = token;
        this.key = key;
        this.email = email
    }

    async validate() {
        console.log("Verifying token validity")
        let response = await this.get("user/tokens/verify")
        return response.data.result.status === 'active';
    }

    async update(zones, subdomains){
        let failure = [];
        for (let zone of zones) {
            for(let subdomain of subdomains){

                let list_response = await this.get("zones/" + zone + "/dns_records", {match: "all", name: subdomain, type: "A"});
                //any -> 검색 결과에 상관없이 모든 하위 도메인 리턴, all -> 검색 결과 후 매치되는 것만 리턴(?)
                //근데 루트 도메인(@)은 안 돌아오는걸로 봐서 뭔가 규칙이 있는데 잘 모르겠음

                let result = list_response.data.result;
                let record_id = result[0].id

                let ip = await this.getIp();
                let edit_response = await this.put("zones/" + zone + "/dns_records/" + record_id, {
                    type: "A",
                    name: subdomain,
                    content: ip,
                    ttl: 1
                })

                //TODO: ttl 변경할 수 있도록 옵션 조정
                let edit_result = edit_response.data.success;
                if(! edit_result){
                    failure.push(subdomain)
                }
            }
       }
        return failure
    }
    async getIp(){
        let response = await axios.get(IP_API_URL)
        return response.data;
    }
    put(uri, data) {
        let headers = {
            "Content-Type": "application/json",
            "X-Auth-Email": this.email,
            "X-Auth-Key": this.key,
            "Accept-Encoding": ""
        }
        return axios.put(BASE_URL + uri, data, {headers: headers})
    }

    get(uri, data = {}) {
        let headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
            "Accept-Encoding": ""
        }
        return axios.get(BASE_URL + uri, {
            headers: headers,
            params: data
        })
    }
}

module.exports = CloudFlareApi