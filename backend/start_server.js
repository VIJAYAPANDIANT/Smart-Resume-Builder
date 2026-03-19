const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'server_live.log');
const out = fs.openSync(logFile, 'a');
const err = fs.openSync(logFile, 'a');

const server = spawn('node', ['server.js'], {
  detached: true,
  stdio: [ 'ignore', out, err ]
});

server.unref();

fs.writeFileSync(path.join(__dirname, 'server_pid.txt'), server.pid.toString(), 'utf8');
console.log(`Server started with PID ${server.pid}. Logging to ${logFile}`);
process.exit(0);
