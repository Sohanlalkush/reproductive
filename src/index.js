const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);

        const options = {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer pk-aMWiVVdxaVYluEFHbslyKQEuHPNeNZZIzCRzXhuOAhMJopsP',
            'Content-Type': 'application/json'
          }
        };

        const apiUrl = 'https://api.pawan.krd/api/completions';
        const apiReq = https.request(apiUrl, options, (apiRes) => {
          let apiData = '';

          apiRes.on('data', (chunk) => {
            apiData += chunk;
          });

          apiRes.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.end(apiData);
          });
        });

        apiReq.on('error', (error) => {
          console.error(error);
          res.statusCode = 500;
          res.end();
        });

        apiReq.write(JSON.stringify(payload));
        apiReq.end();
      } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.end();
      }
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})
