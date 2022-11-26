const fs = require('fs');
const CloudFlareApi = require("./CloudFlareApi.js")

const TOKEN_FILE = "auth.json"
const DOMAIN_FILE = "domains.json"

let auth_info = JSON.parse(fs.readFileSync(TOKEN_FILE).toString());
let domains = JSON.parse(fs.readFileSync(DOMAIN_FILE).toString());
//TODO: 파일이 없을 시 파일 자동 생성하도록.

let api = new CloudFlareApi(auth_info.api_token, auth_info.api_key, auth_info.email);
api.validate().then(result => {
    if (!result) {
        console.log("Invalid Token, edit auth.json and rerun program")
        process.exit(0)
    }
    console.log("Token Validation succeeded.")
    api.update(domains.zones, domains.subdomains.A).then(fails => {
        if (fails.length > 0) {
            let fail_message = ""
            for (let fail in fails)
                fail_message += fail + " "
            console.log("DNS Record Update Failed: " + fail_message)
        } else {
            console.log("DNS Record Update Succeeded")
        }
    })
});
