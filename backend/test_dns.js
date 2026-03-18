const dns = require('dns').promises;

async function testDns() {
  const hostname = '_mongodb._tcp.cluster0.rcnbjae.mongodb.net';
  console.log(`Resolving ${hostname}...`);
  try {
    const addresses = await dns.resolveSrv(hostname);
    console.log('SUCCESS:', addresses);
  } catch (err) {
    console.log('FAILURE:', err.message);
  }
  process.exit();
}

testDns();
