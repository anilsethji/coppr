const http = require('http');

const data = JSON.stringify({
  url: 'https://youtube.com/shorts/I29peidTQxU?si=dKDYfoPNEbenKhY5'
});

const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/creator/generate-ai',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let chunks = '';
  res.on('data', (d) => chunks += d);
  res.on('end', () => console.log('Response:', chunks));
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
