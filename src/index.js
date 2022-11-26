const fs = require('fs');
const CloudFlareApi = require("./CloudFlareApi.js")

const TOKEN_FILE = "api_token.txt"
const DOMAIN_FILE = "domains.json"

let token = fs.readFileSync(TOKEN_FILE).toString().trim();
let domains = JSON.parse(fs.readFileSync(DOMAIN_FILE).toString());

console.log(domains)

let api = new CloudFlareApi(token)
api.validate().then(result => {
    if (!result) {
        console.log("Invalid Token, edit api_token.txt and rerun program")
        process.exit(0)
    }
    console.log("Token Validation succeeded.")
});
