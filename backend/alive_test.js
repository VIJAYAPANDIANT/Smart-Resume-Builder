const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Persistent Server OK');
});
server.listen(8001, () => {
  console.log('Test server on 8001');
});
setInterval(() => {
  console.log('Heartbeat ' + new Date().toISOString());
}, 2000);
