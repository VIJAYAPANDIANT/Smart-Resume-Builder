const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello, World!');
});
server.listen(5002, () => {
  console.log('Test server running on port 5002');
});
// Keep it open
setInterval(() => {
  console.log('Heartbeat...');
}, 1000);
