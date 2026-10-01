const http = require('node:http');
const { handleRequest } = require('./src/routes');
const auth = require('./src/auth');
const db = require('./src/db');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(err => {
    console.error('Unhandled server error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  });
});

server.listen(PORT, () => {
  const secretPath = auth.getAdminPath();
  console.log(`
=============================================================
  ⚡ ZOLUTIONS - PREMIUM DIGITAL MARKETPLACE & AUTOMATIONS ⚡
=============================================================
  Storefront URL:       http://localhost:${PORT}
  Secret Admin Portal:  http://localhost:${PORT}/${secretPath}
  Default Admin Passcode: Zolutions2026!
  Database:             data/zolutions.db (SQLite)
  Status:               Online & Ready
=============================================================
  Note: Regular store visitors cannot see or access the admin
  panel. Only use the secret portal URL above.
=============================================================
  `);
});
