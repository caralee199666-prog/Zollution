const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./db');
const flutterwave = require('./flutterwave');
const emailService = require('./emailService');
const auth = require('./auth');
const views = require('./views');
const { parseMultipartForm } = require('./multipart');

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function parseUrlEncoded(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const obj = {};
      for (const [k, v] of params.entries()) obj[k] = v;
      resolve(obj);
    });
  });
}

/**
 * Handle incoming HTTP requests
 */
async function handleRequest(req, res) {
  const baseUrl = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host || 'localhost:3000'}`;
  const parsedUrl = new URL(req.url, baseUrl);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams.entries());
  const method = req.method;
  const settings = db.getSettings();
  const secretAdminPath = auth.getAdminPath();

  // 1. Static file serving (CSS, JS, images, uploads)
  if (method === 'GET') {
    let filePath = null;
    if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname === '/logo.png' || pathname === '/favicon.png') {
      filePath = path.join(__dirname, '..', 'public', pathname);
    } else if (pathname.startsWith('/uploads/')) {
      filePath = path.join(__dirname, '..', pathname);
    }

    if (filePath && fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // 2. Prevent discovery of standard admin paths (as user requested: separate link only)
  if (['/admin', '/admin/', '/admin-panel', '/dashboard'].includes(pathname.toLowerCase())) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Page Not Found');
  }

  // 3. Secret Admin Route Handler
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  if (cleanPath === secretAdminPath) {
    if (method === 'GET') {
      if (auth.isAuthenticated(req)) {
        return sendHtml(res, 200, views.renderAdminDashboard({ settings, secretPath: secretAdminPath }));
      } else {
        return sendHtml(res, 200, views.renderAdminLogin({ secretPath: secretAdminPath }));
      }
    }
  }

  if (cleanPath === `${secretAdminPath}/login` && method === 'POST') {
    const formData = await parseUrlEncoded(req);
    const password = formData.password || '';
    if (auth.verifyPassword(password)) {
      const cookieHeader = auth.createSessionCookie();
      res.writeHead(302, {
        'Set-Cookie': cookieHeader,
        'Location': `/${secretAdminPath}`
      });
      return res.end();
    } else {
      return sendHtml(res, 401, views.renderAdminLogin({ secretPath: secretAdminPath, error: 'Incorrect admin passcode. Please try again.' }));
    }
  }

  if (cleanPath === `${secretAdminPath}/logout` && method === 'GET') {
    const cookieHeader = auth.clearSessionCookie(req);
    res.writeHead(302, {
      'Set-Cookie': cookieHeader,
      'Location': '/'
    });
    return res.end();
  }

  // 4. Public Storefront Homepage
  if (pathname === '/' && method === 'GET') {
    const products = db.getActiveProducts();
    return sendHtml(res, 200, views.renderStorefront({ products, settings }));
  }

  // 5. Storefront Products API
  if (pathname === '/api/products' && method === 'GET') {
    const category = query.category;
    const products = db.getActiveProducts(category);
    return sendJson(res, 200, { success: true, products });
  }

  // 6. Checkout API - Initiate Flutterwave Payment
  if (pathname === '/api/checkout' && method === 'POST') {
    const body = await parseJsonBody(req);
    const { productId, customerName, customerEmail, customerPhone } = body;

    if (!productId || !customerName || !customerEmail) {
      return sendJson(res, 400, { success: false, error: 'Missing required buyer information' });
    }

    const product = db.getProductById(productId);
    if (!product || product.status !== 'active') {
      return sendJson(res, 404, { success: false, error: 'Product not available' });
    }

    // Create pending order
    const order = db.createOrder({
      product_id: product.id,
      product_title: product.title,
      amount: product.price,
      currency: settings.currency || 'NGN',
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || ''
    });

    const redirectUrl = `${baseUrl}/api/payment/callback`;
    const flwResult = await flutterwave.createPaymentLink({
      order,
      product,
      settings,
      redirectUrl
    });

    if (flwResult.success) {
      return sendJson(res, 200, {
        success: true,
        orderId: order.id,
        txRef: order.tx_ref,
        checkoutUrl: flwResult.checkout_url
      });
    } else {
      return sendJson(res, 500, { success: false, error: flwResult.error });
    }
  }

  // 7. Flutterwave Test Simulator Page
  if (pathname === '/api/payment/test-checkout' && method === 'GET') {
    const txRef = query.tx_ref;
    const order = db.getOrderByTxRef(txRef);
    if (!order) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Order not found');
    }
    const product = db.getProductById(order.product_id);
    return sendHtml(res, 200, views.renderTestCheckout({ order, product, settings }));
  }

  // 8. Payment Callback (Redirected from Flutterwave after payment)
  if (pathname === '/api/payment/callback' && method === 'GET') {
    const { status, tx_ref, transaction_id } = query;
    console.log(`[Payment Callback] status=${status}, tx_ref=${tx_ref}, transaction_id=${transaction_id}`);

    if (!tx_ref) {
      res.writeHead(302, { 'Location': '/?error=missing_transaction' });
      return res.end();
    }

    const order = db.getOrderByTxRef(tx_ref);
    if (!order) {
      res.writeHead(302, { 'Location': '/?error=order_not_found' });
      return res.end();
    }

    const product = db.getProductById(order.product_id);

    // If already marked paid
    if (order.status === 'paid') {
      res.writeHead(302, { 'Location': `/order-success?order_id=${order.id}` });
      return res.end();
    }

    // Verify payment with Flutterwave if live keys are active
    let isVerified = false;
    if (String(transaction_id).startsWith('TEST_SIM_') || settings.flw_test_mode === '1') {
      isVerified = true;
    } else if (transaction_id && settings.flw_secret_key) {
      try {
        const verifyRes = await flutterwave.verifyTransaction(transaction_id, settings);
        if (verifyRes.status === 'success' && verifyRes.data?.status === 'successful') {
          // Double check amount matches
          if (Number(verifyRes.data.amount) >= Number(order.amount)) {
            isVerified = true;
          }
        }
      } catch (err) {
        console.error('Verification error:', err.message);
      }
    } else if (status === 'successful') {
      isVerified = true;
    }

    if (isVerified) {
      db.markOrderPaid(order.id, transaction_id || 'manual');
      const updatedOrder = db.getOrderById(order.id);

      // Trigger automatic email receipt & download link to buyer
      emailService.sendReceipt({
        order: updatedOrder,
        product,
        settings,
        baseUrl
      }).catch(e => console.error('[Callback] Email send failed:', e));

      res.writeHead(302, { 'Location': `/order-success?order_id=${order.id}` });
      return res.end();
    } else {
      res.writeHead(302, { 'Location': `/?error=payment_failed` });
      return res.end();
    }
  }

  // 9. Payment Webhook (Asynchronous Flutterwave notifications)
  if (pathname === '/api/payment/webhook' && method === 'POST') {
    const rawBody = await parseJsonBody(req);
    const verifHash = req.headers['verif-hash'];

    if (!flutterwave.verifyWebhook(verifHash, settings.flw_secret_hash)) {
      return sendJson(res, 401, { error: 'Invalid webhook signature' });
    }

    if (rawBody.event === 'charge.completed' && rawBody.data?.status === 'successful') {
      const txRef = rawBody.data.tx_ref;
      const order = db.getOrderByTxRef(txRef);
      if (order && order.status !== 'paid') {
        db.markOrderPaid(order.id, rawBody.data.id);
        const product = db.getProductById(order.product_id);
        const updatedOrder = db.getOrderById(order.id);

        emailService.sendReceipt({
          order: updatedOrder,
          product,
          settings,
          baseUrl
        }).catch(e => console.error('[Webhook] Email send error:', e));
      }
    }

    return sendJson(res, 200, { status: 'acknowledged' });
  }

  // 10. Order Success Page
  if (pathname === '/order-success' && method === 'GET') {
    const orderId = query.order_id;
    const order = db.getOrderById(orderId);
    if (!order) {
      res.writeHead(302, { 'Location': '/' });
      return res.end();
    }
    const product = db.getProductById(order.product_id);
    return sendHtml(res, 200, views.renderOrderSuccess({ order, product, settings }));
  }

  // 11. Secure File Download Endpoint
  if (pathname.startsWith('/download/') && method === 'GET') {
    const token = pathname.replace('/download/', '').trim();
    const order = db.getOrderByDownloadToken(token);

    if (!order) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Invalid download link or order not found.');
    }

    if (order.status !== 'paid') {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Payment for this order has not been completed.');
    }

    const product = db.getProductById(order.product_id);
    if (!product) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Product file not found.');
    }

    // Increment download count
    db.incrementDownloadCount(order.id);

    // If external cloud URL, redirect directly
    if (product.file_type === 'url' && product.file_path) {
      res.writeHead(302, { 'Location': product.file_path });
      return res.end();
    }

    // Serve uploaded deliverable file
    const filePath = path.join(__dirname, '..', 'uploads', 'products', product.file_path);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Deliverable file is missing on the server. Please contact support.');
    }

    const filename = product.file_name || path.basename(filePath);
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Type': 'application/octet-stream'
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  // ---------------- ADMIN API ENDPOINTS (Protected) ----------------

  if (pathname.startsWith('/api/admin/')) {
    if (!auth.isAuthenticated(req)) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized admin session' });
    }

    // Dashboard Stats
    if (pathname === '/api/admin/dashboard-stats' && method === 'GET') {
      const orders = db.getAllOrders();
      const products = db.getAllProducts();
      
      const paidOrders = orders.filter(o => o.status === 'paid');
      const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.amount), 0);
      const totalDownloads = orders.reduce((sum, o) => sum + (o.download_count || 0), 0);
      const currencySymbol = settings.currency === 'USD' ? '$' : (settings.currency_symbol || '₦');

      return sendJson(res, 200, {
        success: true,
        stats: {
          totalRevenue,
          formattedRevenue: `${currencySymbol}${totalRevenue.toLocaleString()}`,
          totalPaidOrders: paidOrders.length,
          totalProducts: products.length,
          totalDownloads
        },
        recentOrders: orders.slice(0, 8)
      });
    }

    // Products CRUD
    if (pathname === '/api/admin/products') {
      if (method === 'GET') {
        const products = db.getAllProducts();
        return sendJson(res, 200, { success: true, products });
      }

      if (method === 'POST') {
        try {
          const { fields, files } = await parseMultipartForm(req);
          
          let coverImage = fields.cover_image || '';
          if (files.cover_file) {
            coverImage = files.cover_file.relativeUrl;
          }

          let fileType = fields.file_type || 'upload';
          let filePath = fields.file_path_url || '';
          let fileName = '';
          let fileSize = '';

          if (fileType === 'upload' && files.deliverable_file) {
            filePath = files.deliverable_file.filename;
            fileName = files.deliverable_file.originalName;
            fileSize = files.deliverable_file.size;
          } else if (fileType === 'url') {
            fileName = 'Cloud Deliverable Link';
            fileSize = 'Cloud';
          }

          const featuresArray = (fields.features_text || '').split('\n').map(s => s.trim()).filter(Boolean);

          const newProduct = db.createProduct({
            title: fields.title,
            subtitle: fields.subtitle,
            category: fields.category,
            price: fields.price,
            compare_price: fields.compare_price || null,
            description: fields.description,
            features: featuresArray,
            cover_image: coverImage,
            file_type: fileType,
            file_path: filePath,
            file_name: fileName,
            file_size: fileSize,
            status: fields.status || 'active',
            featured: fields.featured === '1'
          });

          return sendJson(res, 200, { success: true, product: newProduct });
        } catch (err) {
          console.error('Error creating product:', err);
          return sendJson(res, 500, { success: false, error: err.message });
        }
      }
    }

    // Import Products from CSV
    if (pathname === '/api/admin/products/import-csv' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.csv) return sendJson(res, 400, { success: false, error: 'No CSV content provided' });
      const result = db.importProductsFromCsv(body.csv);
      return sendJson(res, 200, { success: true, count: result.count });
    }

    // Update Product
    if (pathname.startsWith('/api/admin/products/') && method === 'PUT') {
      const id = pathname.replace('/api/admin/products/', '');
      try {
        const { fields, files } = await parseMultipartForm(req);
        const existing = db.getProductById(id);
        if (!existing) return sendJson(res, 404, { success: false, error: 'Product not found' });

        let coverImage = fields.cover_image || existing.cover_image;
        if (files.cover_file) {
          coverImage = files.cover_file.relativeUrl;
        }

        let fileType = fields.file_type || existing.file_type;
        let filePath = existing.file_path;
        let fileName = existing.file_name;
        let fileSize = existing.file_size;

        if (fileType === 'upload' && files.deliverable_file) {
          filePath = files.deliverable_file.filename;
          fileName = files.deliverable_file.originalName;
          fileSize = files.deliverable_file.size;
        } else if (fileType === 'url' && fields.file_path_url) {
          filePath = fields.file_path_url;
          fileName = 'Cloud Deliverable Link';
          fileSize = 'Cloud';
        }

        const featuresArray = fields.features_text !== undefined
          ? fields.features_text.split('\n').map(s => s.trim()).filter(Boolean)
          : existing.features;

        const updated = db.updateProduct(id, {
          title: fields.title,
          subtitle: fields.subtitle,
          category: fields.category,
          price: fields.price,
          compare_price: fields.compare_price || null,
          description: fields.description,
          features: featuresArray,
          cover_image: coverImage,
          file_type: fileType,
          file_path: filePath,
          file_name: fileName,
          file_size: fileSize,
          status: fields.status,
          featured: fields.featured === '1'
        });

        return sendJson(res, 200, { success: true, product: updated });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Delete Product
    if (pathname.startsWith('/api/admin/products/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/products/', '');
      db.deleteProduct(id);
      return sendJson(res, 200, { success: true });
    }

    // Orders List
    if (pathname === '/api/admin/orders' && method === 'GET') {
      const orders = db.getAllOrders();
      return sendJson(res, 200, { success: true, orders });
    }

    // Resend Order Email Receipt & File
    if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/resend-email') && method === 'POST') {
      const orderId = pathname.replace('/api/admin/orders/', '').replace('/resend-email', '');
      const order = db.getOrderById(orderId);
      if (!order) return sendJson(res, 404, { success: false, error: 'Order not found' });

      const product = db.getProductById(order.product_id);
      const result = await emailService.sendReceipt({
        order,
        product,
        settings,
        baseUrl
      });

      return sendJson(res, 200, result);
    }

    // Update Store Settings
    if (pathname === '/api/admin/settings' && method === 'POST') {
      const body = await parseJsonBody(req);
      
      const allowedKeys = [
        'flw_public_key', 'flw_secret_key', 'flw_encryption_key', 'flw_secret_hash',
        'flw_test_mode', 'currency', 'email_provider', 'email_api_key',
        'email_sender_name', 'email_sender_address'
      ];

      for (const key of allowedKeys) {
        if (body[key] !== undefined) {
          db.setSetting(key, body[key].trim());
        }
      }

      // Currency symbol update
      if (body.currency) {
        db.setSetting('currency_symbol', body.currency === 'USD' ? '$' : '₦');
      }

      // Admin password update
      if (body.new_admin_password && body.new_admin_password.trim().length >= 4) {
        auth.updatePassword(body.new_admin_password.trim());
      }

      // Secret Admin URL update
      let redirectUrl = null;
      if (body.admin_secret_path && body.admin_secret_path.trim()) {
        const newSlug = auth.updateAdminPath(body.admin_secret_path);
        if (newSlug !== secretAdminPath) {
          redirectUrl = `/${newSlug}`;
        }
      }

      return sendJson(res, 200, { success: true, redirectUrl });
    }
  }

  // Default 404 for unmatched routes
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Page Not Found');
}

module.exports = { handleRequest };
