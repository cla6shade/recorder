const BASE_URL = "https://api.cloudflare.com/client/v4/user/tokens/verify"
function request(uri, data){
    let body_text = "?"
    for(let datum in data){
        body_text += datum + "=" + data[datum] + "&"
    }
    body_text = body_text.slice(0,-1)
    return BASE_URL + uri + body_text
}
console.log(request("test", {test1: "asdf", test2: "asdf23", test3: "asdfaswq3"}));