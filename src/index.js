const fs = require('fs');
const CloudFlareApi = require("./CloudFlareApi.js")

const TOKEN_FILE = "auth.json"
const DOMAIN_FILE = "domains.json"

//file check
let fileExist = true
if(! fs.existsSync(TOKEN_FILE)){
    let default_auth = {
        api_token: "",
        api_key: "",
        email: ""
    }
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(default_auth))
    fileExist = false;
}
if(! fs.existsSync(DOMAIN_FILE)){
    let default_domains = {
        zones: [],
        subdomains: {
            A: []
        }
    }
    fs.writeFileSync(DOMAIN_FILE, JSON.stringify(default_domains))
    fileExist = false;
}
if(!fileExist){
    console.log("Please rerun after modifying auth.json and domain.json")
    process.exit(0)
    return
}

let auth_info = JSON.parse(fs.readFileSync(TOKEN_FILE).toString());
let domains = JSON.parse(fs.readFileSync(DOMAIN_FILE).toString());

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
