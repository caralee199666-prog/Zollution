const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Lightweight native multipart/form-data parser for Node.js
 */
function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return reject(new Error('Content-Type must be multipart/form-data'));
    }

    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!boundaryMatch) {
      return reject(new Error('Missing boundary in multipart form'));
    }

    const boundary = boundaryMatch[1] || boundaryMatch[2];
    const boundaryBuffer = Buffer.from('--' + boundary);

    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const fullBuffer = Buffer.concat(chunks);
      const fields = {};
      const files = {};

      let start = 0;
      while (start < fullBuffer.length) {
        const nextBoundary = fullBuffer.indexOf(boundaryBuffer, start);
        if (nextBoundary === -1) break;

        const partStart = nextBoundary + boundaryBuffer.length;
        if (fullBuffer.slice(partStart, partStart + 2).toString() === '--') {
          break; // end of parts
        }

        // skip CRLF
        const headerStart = partStart + 2;
        const headerEnd = fullBuffer.indexOf(Buffer.from('\r\n\r\n'), headerStart);
        if (headerEnd === -1) break;

        const headerStr = fullBuffer.slice(headerStart, headerEnd).toString('utf-8');
        const bodyStart = headerEnd + 4;
        const nextBoundaryPos = fullBuffer.indexOf(boundaryBuffer, bodyStart);
        const bodyEnd = nextBoundaryPos > 2 ? nextBoundaryPos - 2 : nextBoundaryPos; // exclude \r\n

        const partBody = fullBuffer.slice(bodyStart, bodyEnd);

        // Parse Content-Disposition
        const dispMatch = headerStr.match(/Content-Disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i);
        if (dispMatch) {
          const fieldName = dispMatch[1];
          const filename = dispMatch[2];

          if (filename !== undefined && filename !== '') {
            // It's a file
            const ext = path.extname(filename).toLowerCase();
            const safeName = crypto.randomUUID().slice(0, 8) + '-' + filename.replace(/[^a-zA-Z0-9._-]/g, '_');
            
            // Determine directory based on field name
            let uploadDir = path.join(__dirname, '..', 'uploads', 'products');
            if (fieldName.toLowerCase().includes('cover') || fieldName.toLowerCase().includes('image')) {
              uploadDir = path.join(__dirname, '..', 'uploads', 'covers');
            }

            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }

            const targetPath = path.join(uploadDir, safeName);
            fs.writeFileSync(targetPath, partBody);

            const sizeInMb = (partBody.length / (1024 * 1024)).toFixed(1);
            const sizeStr = sizeInMb > 0.1 ? `${sizeInMb} MB` : `${(partBody.length / 1024).toFixed(0)} KB`;

            files[fieldName] = {
              originalName: filename,
              filename: safeName,
              path: targetPath,
              relativeUrl: `/uploads/${uploadDir.endsWith('covers') ? 'covers' : 'products'}/${safeName}`,
              size: sizeStr,
              bytes: partBody.length
            };
          } else {
            // Text field
            fields[fieldName] = partBody.toString('utf-8').trim();
          }
        }

        start = bodyEnd;
      }

      resolve({ fields, files });
    });

    req.on('error', reject);
  });
}

module.exports = { parseMultipartForm };
