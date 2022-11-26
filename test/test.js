const axios = require("axios");
const IP_API_URL = "https://api.ip.pe.kr"

async function getIp(){
    let response = await axios.get(IP_API_URL)
    return response.data;
}

getIp().then(data =>{
    console.log(data)
})