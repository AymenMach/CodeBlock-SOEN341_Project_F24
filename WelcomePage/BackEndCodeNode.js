// Back-End Code in Node.js

const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());


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
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// node index.js
// visit port 3000
