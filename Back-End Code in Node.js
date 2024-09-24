// Back-End Code in Node.js

const http = require ('http')

// server creation
const server = http.createServer((request, response) => {

  if (request.url === '/about') {
    return response.end('About Page')
  
  } else if (request.url === '/contact') {
    return response.end('Contact Page')
  
  } else if (request.url === '/') {
    return response.end('Home Page')
  
  } else {
    response.writeHead(404)

    response.end('Page not Found')
  }
})
                          

// server responds with hello node js
server.listen(3000)

// node index.js
// visit port 3000
// localhost 3000
