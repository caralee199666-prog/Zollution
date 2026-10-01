const { EventEmitter } = require('events');
const { handleRequest } = require('../../src/routes');

exports.handler = async (event, context) => {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = event.httpMethod || 'GET';
    
    // Build path with query string
    let reqPath = event.path || '/';
    // Remove .netlify/functions/server prefix if redirected
    reqPath = reqPath.replace(/^\/\.netlify\/functions\/server/, '') || '/';
    
    if (event.queryStringParameters && Object.keys(event.queryStringParameters).length > 0) {
      const q = new URLSearchParams(event.queryStringParameters).toString();
      reqPath += (reqPath.includes('?') ? '&' : '?') + q;
    }
    
    req.url = reqPath;
    req.headers = event.headers || {};
    
    // Response collector
    let statusCode = 200;
    const responseHeaders = {};
    const chunks = [];

    const res = {
      headersSent: false,
      writeHead(code, headers = {}) {
        statusCode = code;
        this.headersSent = true;
        for (const [k, v] of Object.entries(headers)) {
          responseHeaders[k] = v;
        }
      },
      setHeader(k, v) {
        responseHeaders[k] = v;
      },
      write(chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      },
      end(data) {
        this.headersSent = true;
        if (data) chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
        const bodyBuffer = Buffer.concat(chunks);
        const contentType = responseHeaders['Content-Type'] || responseHeaders['content-type'] || '';
        const isBinary = !contentType.includes('text') && !contentType.includes('json') && !contentType.includes('javascript');
        
        resolve({
          statusCode,
          headers: responseHeaders,
          body: isBinary ? bodyBuffer.toString('base64') : bodyBuffer.toString('utf-8'),
          isBase64Encoded: isBinary
        });
      }
    };

    handleRequest(req, res).catch(err => {
      console.error('Netlify function error:', err);
      resolve({
        statusCode: 500,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Internal Server Error: ' + err.message
      });
    });

    // Send body if present
    if (event.body) {
      const bodyBuffer = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(event.body);
      req.emit('data', bodyBuffer);
    }
    req.emit('end');
  });
};
