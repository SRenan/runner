const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World3!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


const https = require('https');

// Load script from an external URL
function loadScript(url) {
  https.get(url, (response) => {
    let data = '';
    
    // Accumulate the data from the response
    response.on('data', (chunk) => {
      data += chunk;
    });

    // Execute the script once the response is complete
    response.on('end', () => {
      eval(data); // Caution: eval executes the code directly
    });
  }).on('error', (err) => {
    console.error('Error loading script:', err);
  });
}

// Usage example:
loadScript('https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser-arcade-physics.min.js');

