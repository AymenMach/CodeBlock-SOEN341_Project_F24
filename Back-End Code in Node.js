// Back-End Code in Node.js

const http = require ('http')

// server creation
const server = http.createServer((request, response) => {
  console.log(request.url)

  respone.end('Hello Node JS')
})

// server responds with hello node js
server.listen(3000)

// node index.js
// visit port 3000
// localhost 3000
