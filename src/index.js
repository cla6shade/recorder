const fs = require('fs');

const TOKEN_FILE = "api_token.txt"

console.log("토큰을 받아오는 중입니다")
let token = fs.readFileSync(TOKEN_FILE).toString().trim();