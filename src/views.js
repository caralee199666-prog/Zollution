function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderStorefront({ products, settings }) {
  const currencySymbol = settings.currency_symbol || '$';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(settings.site_title || 'Zolutions')} - Premium Digital Tools, AI Resources & No-Code Solutions</title>
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="stylesheet" href="/css/style.css">
  <script>window.STORE_CURRENCY_SYMBOL = "${currencySymbol}";</script>
</head>
<body>
  <!-- Top Flash Banner -->
  <div class="top-banner">
    <span>⚡ Flash Sale: Get 25% OFF any digital toolkit today with code <code>ZOL25</code></span>
    <span style="opacity: 0.6;">•</span>
    <span>Instant File Access & Lifetime Updates</span>
  </div>

  <!-- Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-link">
        <img src="/logo.png" alt="Zolutions Logo" class="brand-logo" onerror="this.style.display='none'">
        <div class="brand-name">Zolutions<span>.</span></div>
      </a>

      <nav class="nav-menu">
        <a href="#solutions" class="nav-link">Browse Solutions</a>
        <a href="#reviews" class="nav-link">Customer Reviews</a>
        <a href="#faq" class="nav-link">FAQ</a>
      </nav>

      <div class="nav-actions">
        <div class="currency-badge">
          <span>🇺🇸</span>
          <span>USD ($)</span>
        </div>
        <a href="#solutions" class="btn-buy" style="text-decoration: none; padding: 8px 16px;">
          Explore Store
        </a>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-glow-1"></div>
      <div class="container hero-content">
        <div class="hero-pill">
          <span>✨ Curated 2026 Collection</span>
          <span>•</span>
          <span>100% Verified Digital Assets</span>
        </div>

        <h1 class="hero-title">
          Build Faster. Automate Smarter.<br>
          Scale with <span class="gradient-text">Zolutions</span>
        </h1>

        <p class="hero-subtitle">
          Skip months of development. Instant access to production-ready AI workflows, no-code templates, business automation scripts, and executive tools designed for modern creators and founders.
        </p>

        <div class="hero-actions">
          <a href="#solutions" class="btn-hero-primary">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
            Explore Digital Assets
          </a>
          <a href="#faq" class="btn-hero-secondary">
            How It Works
          </a>
        </div>

        <div class="trust-metrics">
          <div class="metric-item">
            <span class="stars">★★★★★</span>
            <strong>4.9/5</strong> (1,400+ Verified Buyers)
          </div>
          <div class="metric-item">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--accent);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <strong>Instant Delivery</strong> (&lt;5s after payment)
          </div>
          <div class="metric-item">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--accent);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <strong>Flutterwave Secured</strong>
          </div>
          <div class="metric-item">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--accent);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <strong>Free Lifetime Updates</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Catalog Section -->
    <section class="container" id="solutions">
      <div class="controls-wrapper">
        <div class="controls-bar">
          <div class="category-nav">
            <button class="cat-btn active" data-category="All">All Assets</button>
            <button class="cat-btn" data-category="AI & Automations">AI & Automations</button>
            <button class="cat-btn" data-category="No-Code Solutions">No-Code Solutions</button>
            <button class="cat-btn" data-category="Business Tools">Business Tools</button>
            <button class="cat-btn" data-category="AI Resources">AI Resources</button>
            <button class="cat-btn" data-category="Digital Tools">Digital Tools</button>
          </div>

          <div class="search-box">
            <svg class="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" id="productSearch" placeholder="Search templates, automations, blueprints...">
          </div>
        </div>
      </div>

      <div class="products-grid" id="productsGrid">
        <!-- Rendered dynamically by app.js -->
      </div>
    </section>

    <!-- Customer Reviews / Social Proof -->
    <section class="social-proof-section" id="reviews">
      <div class="container">
        <div class="section-title-center">
          <h2>Loved by 5,000+ Builders Worldwide</h2>
          <p>Read what entrepreneurs, agencies, and creators say about Zolutions assets.</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">
              "The AI Business Automation Suite saved our agency at least 3 months of trial and error. The Make.com blueprints worked right out of the box with zero errors."
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">MR</div>
              <div class="author-info">
                <h4>Marcus Reynolds</h4>
                <span>Growth Agency Founder</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">
              "The checkout experience was seamless via Flutterwave. Literally within 3 seconds of paying, I had the download link on screen and the official receipt in my inbox."
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">SO</div>
              <div class="author-info">
                <h4>Sarah O'Connor</h4>
                <span>No-Code Consultant</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">
              "Top quality deliverables. The WhatsApp Sales Bot and CRM template helped us automate our entire customer onboarding pipeline in a single weekend."
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">DA</div>
              <div class="author-info">
                <h4>David Adebayo</h4>
                <span>E-commerce Director</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Accordion -->
    <section class="faq-section" id="faq">
      <div class="container">
        <div class="section-title-center">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about purchasing, file delivery, and licensing.</p>
        </div>

        <div class="faq-list">
          <div class="faq-item active">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>How do I receive my purchased digital files?</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div class="faq-answer">
              Delivery is 100% instant and automated. As soon as your Flutterwave payment confirms, you will be shown an immediate download button on your screen. An official branded receipt with your permanent download access link is also emailed to you immediately.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>What payment methods are accepted?</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div class="faq-answer">
              We process payments securely via Flutterwave. You can pay with any Visa, Mastercard, American Express, Apple Pay, Bank Transfer, USSD, or Mobile Money account internationally.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Can I use these assets for my clients' businesses?</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div class="faq-answer">
              Yes! All Zolutions products include an unlimited commercial use license. You can customize, integrate, and deploy them for both your own projects and client deliverables.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <span>Do I receive free future updates?</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div class="faq-answer">
              Yes! Whenever we upgrade a blueprint, add new prompts, or update a template, your permanent download link will always deliver the latest version at zero additional cost.
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Product Preview Drawer / Modal -->
  <div class="modal-overlay" id="previewModal">
    <div class="modal-card">
      <div class="modal-header">
        <span class="card-category-badge" id="prevCategory">Category</span>
        <button class="btn-close" onclick="closeModal('previewModal')">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <img id="prevImg" src="" alt="Product Cover" style="width: 100%; height: 260px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
        <h2 id="prevTitle" style="color: #ffffff; font-size: 24px; margin-bottom: 8px;"></h2>
        
        <div id="prevFileInfo" style="background: #090e1a; border: 1px solid var(--border); padding: 12px 16px; border-radius: 8px; font-size: 13.5px; color: #cbd5e1; margin-bottom: 20px;"></div>
        
        <p id="prevDesc" style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 24px; white-space: pre-line;"></p>
        
        <div>
          <h4 style="color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 14px;">Deliverables &amp; Features Included:</h4>
          <ul id="prevFeatures" style="list-style: none; padding: 0;"></ul>
        </div>

        <div style="background: rgba(77, 155, 13, 0.08); border: 1px solid rgba(77, 155, 13, 0.25); border-radius: 8px; padding: 14px 18px; margin: 24px 0; font-size: 13px; color: #cbd5e1;">
          🛡️ <strong>100% Risk-Free Guarantee:</strong> If this digital asset doesn't help you build or automate your workflow, contact us within 30 days for a full replacement or refund.
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 22px; margin-top: 24px;">
          <div>
            <div id="prevPrice" style="font-size: 26px; font-weight: 800; color: #ffffff;"></div>
            <span id="prevComparePrice" style="font-size: 14px; color: var(--text-dim); text-decoration: line-through;"></span>
          </div>
          <button class="btn-buy" style="padding: 14px 28px; font-size: 15px;" onclick="openCheckoutModal(selectedProduct.id)">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Checkout Modal -->
  <div class="modal-overlay" id="checkoutModal">
    <div class="modal-card" style="max-width: 500px;">
      <div class="modal-header">
        <h3>Secure Checkout</h3>
        <button class="btn-close" onclick="closeModal('checkoutModal')">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="checkout-summary">
          <div class="summary-row">
            <span>Product</span>
            <strong id="checkoutProdTitle" style="color: #ffffff; text-align: right; max-width: 270px;"></strong>
          </div>
          <div class="summary-row">
            <span>Currency</span>
            <span style="color: #cbd5e1;">USD ($)</span>
          </div>
          <div class="summary-row total">
            <span>Total Due</span>
            <span id="checkoutTotal"></span>
          </div>
        </div>

        <form id="checkoutForm">
          <div class="form-group">
            <label for="buyerName">Your Full Name *</label>
            <input type="text" id="buyerName" required placeholder="e.g. John Doe">
          </div>
          <div class="form-group">
            <label for="buyerEmail">Email Address (for receipt &amp; instant file delivery) *</label>
            <input type="email" id="buyerEmail" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label for="buyerPhone">Phone Number (optional)</label>
            <input type="tel" id="buyerPhone" placeholder="+1 (555) 000-0000">
          </div>

          <button type="submit" class="btn-submit-checkout" id="btnSubmitPay">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Pay with Flutterwave
          </button>
        </form>

        <div class="payment-badges">
          <span>🔒 256-Bit SSL Encrypted</span>
          <span>•</span>
          <span>⚡ Instant Digital Delivery</span>
        </div>
      </div>
    </div>
  </div>

  <footer class="site-footer">
    <div class="container">
      <p style="margin-bottom: 8px; font-weight: 600; color: #ffffff;">&copy; ${new Date().getFullYear()} Zolutions. All rights reserved.</p>
      <p style="font-size: 13px; color: var(--text-dim); max-width: 600px; margin: 0 auto 16px;">
        Zolutions is an independent digital assets marketplace. All transactions are securely processed via Flutterwave. Instant email receipt and deliverable file delivery.
      </p>
      <div style="display: flex; justify-content: center; gap: 20px; font-size: 13px;">
        <a href="#solutions">Catalog</a>
        <a href="#reviews">Reviews</a>
        <a href="#faq">FAQ</a>
        <a href="mailto:${settings.email_sender_address || 'support@zolutions.com'}">Contact Support</a>
      </div>
    </div>
  </footer>

  <script>
    function toggleFaq(el) {
      const parent = el.parentElement;
      parent.classList.toggle('active');
    }
  </script>
  <script src="/js/app.js"></script>
</body>
</html>`;
}

function renderAdminLogin({ secretPath, error = null }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zolutions - Admin Authentication</title>
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="stylesheet" href="/css/admin.css">
</head>
<body class="admin-body">
  <div class="admin-login-wrapper">
    <div class="login-card">
      <img src="/logo.png" alt="Zolutions" class="login-logo" onerror="this.style.display='none'">
      <div class="login-title">Zolutions Admin Portal</div>
      <div class="login-subtitle">Enter your secret passcode to manage products, orders, and settings.</div>

      ${error ? `<div class="login-alert error">${escapeHtml(error)}</div>` : ''}

      <form method="POST" action="/${secretPath}/login">
        <input type="password" name="password" class="login-input" placeholder="Enter Admin Passcode" required autofocus>
        <button type="submit" class="btn-login">Unlock Admin Access</button>
      </form>
    </div>
  </div>
</body>
</html>`;
}

function renderAdminDashboard({ settings, secretPath }) {
  const currencySymbol = settings.currency_symbol || '$';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zolutions - Admin Dashboard</title>
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="stylesheet" href="/css/admin.css">
</head>
<body class="admin-body">
  <nav class="admin-navbar">
    <div class="admin-nav-brand">
      <img src="/logo.png" alt="Logo" style="height: 32px; border-radius: 4px;" onerror="this.style.display='none'">
      <span>Zolutions</span> Admin
      <span class="admin-nav-badge">Separate Portal</span>
    </div>
    <div class="admin-nav-right">
      <a href="/" target="_blank" class="btn-view-store">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
        View Storefront
      </a>
      <a href="/${secretPath}/logout" class="btn-logout">Logout</a>
    </div>
  </nav>

  <main class="admin-main">
    <div class="secret-url-banner">
      <div>
        <strong>Secret Admin Route:</strong> Only you know this link. Regular store visitors cannot see or access this page.<br>
        URL: <code id="secretUrlDisplay" data-path="${secretPath}">/${secretPath}</code>
      </div>
      <button class="btn-icon success" onclick="copySecretUrl()">Copy Link</button>
    </div>

    <div class="admin-tabs">
      <button class="tab-btn active" data-tab="overviewTab">Overview</button>
      <button class="tab-btn" data-tab="productsTab">Products</button>
      <button class="tab-btn" data-tab="ordersTab">Orders &amp; Deliveries</button>
      <button class="tab-btn" data-tab="importTab">CSV Product Importer</button>
      <button class="tab-btn" data-tab="settingsTab">Store Settings</button>
    </div>

    <!-- TAB 1: OVERVIEW -->
    <div class="tab-content" id="overviewTab" style="display: block;">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <div class="stat-val" id="statRevenue">$0</div>
            <div class="stat-lbl">Total Sales (USD)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <div>
            <div class="stat-val" id="statOrders">0</div>
            <div class="stat-lbl">Verified Paid Orders</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div>
            <div class="stat-val" id="statProducts">0</div>
            <div class="stat-lbl">Active Products</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </div>
          <div>
            <div class="stat-val" id="statDownloads">0</div>
            <div class="stat-lbl">Files Downloaded</div>
          </div>
        </div>
      </div>

      <div class="section-header">
        <div class="section-title">Recent Transactions</div>
      </div>
      <div class="table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id="recentOrdersBody"></tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: PRODUCTS -->
    <div class="tab-content" id="productsTab" style="display: none;">
      <div class="section-header">
        <div class="section-title">Products &amp; Deliverables</div>
        <button class="btn-primary" onclick="openAddProductModal()">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Product
        </button>
      </div>

      <div class="table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price (${currencySymbol})</th>
              <th>Deliverable File</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="productsTableBody"></tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: ORDERS & DELIVERIES -->
    <div class="tab-content" id="ordersTab" style="display: none;">
      <div class="section-header">
        <div class="section-title">Customer Orders &amp; Deliveries</div>
      </div>
      <p style="color: var(--admin-muted); font-size: 14px; margin-bottom: 20px;">
        Every time a customer completes a purchase through Flutterwave, their receipt and secure download access are automatically generated and emailed. You can manually re-send the receipt and deliverable file to any customer with 1 click below.
      </p>
      <div class="table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Payment &amp; Email</th>
              <th>Date &amp; Activity</th>
              <th>Delivery Actions</th>
            </tr>
          </thead>
          <tbody id="ordersTableBody"></tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: CSV PRODUCT IMPORTER -->
    <div class="tab-content" id="importTab" style="display: none;">
      <div class="settings-section">
        <div class="settings-title">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--admin-accent);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Import Existing Products from Glide / CSV
        </div>
        <div class="settings-desc">
          Easily import your existing product rows from your Glide sheet or Excel spreadsheet in seconds.
        </div>

        <div style="background: #090e1a; border: 1px solid var(--admin-border); border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 13px; color: var(--admin-muted);">
          <strong>Expected CSV Header Columns:</strong><br>
          <code>title, category, price, compare_price, subtitle, description, file_url, cover_image</code><br>
          <em style="color: var(--admin-dim);">Paste your CSV text below or upload a .csv file:</em>
        </div>

        <form id="csvImportForm">
          <div class="admin-field">
            <label>Paste CSV Content</label>
            <textarea id="csvContent" name="csv" style="height: 180px; font-family: monospace; font-size: 13px;" placeholder="title,category,price,compare_price,subtitle,description,file_url&#10;My Existing Tool,AI Resources,29,49,One line pitch,Full description,https://drive.google.com/..."></textarea>
          </div>

          <button type="submit" class="btn-primary" id="btnImportCsv">
            Import Products Now
          </button>
        </form>
      </div>
    </div>

    <!-- TAB 5: SETTINGS -->
    <div class="tab-content" id="settingsTab" style="display: none;">
      <form id="settingsForm">
        <!-- Flutterwave Settings -->
        <div class="settings-section">
          <div class="settings-title">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--admin-accent);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            Flutterwave Payment Gateway
          </div>
          <div class="settings-desc">
            Connect your Flutterwave merchant account to collect payments via Card, Bank Transfer, Mobile Money, and USSD.
          </div>

          <div class="settings-grid-2">
            <div class="admin-field">
              <label>Flutterwave Public Key</label>
              <input type="text" name="flw_public_key" value="${escapeHtml(settings.flw_public_key || '')}" placeholder="FLWPUBK-xxxxxxxx">
              <div class="hint-text">Found in your Flutterwave Dashboard &gt; Settings &gt; API Keys</div>
            </div>
            <div class="admin-field">
              <label>Flutterwave Secret Key</label>
              <input type="password" name="flw_secret_key" value="${escapeHtml(settings.flw_secret_key || '')}" placeholder="FLWSECK-xxxxxxxx">
              <div class="hint-text">Used to verify payments securely on the server</div>
            </div>
            <div class="admin-field">
              <label>Webhook Secret Hash</label>
              <input type="text" name="flw_secret_hash" value="${escapeHtml(settings.flw_secret_hash || '')}" placeholder="e.g. zolutions_webhook_secret_key">
              <div class="hint-text">Matches the Secret Hash in Flutterwave Webhooks settings</div>
            </div>
            <div class="admin-field">
              <label>Store Currency</label>
              <select name="currency">
                <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>USD - US Dollar ($)</option>
                <option value="NGN" ${settings.currency === 'NGN' ? 'selected' : ''}>NGN - Nigerian Naira (₦)</option>
                <option value="GHS" ${settings.currency === 'GHS' ? 'selected' : ''}>GHS - Ghanaian Cedi (GH₵)</option>
                <option value="KES" ${settings.currency === 'KES' ? 'selected' : ''}>KES - Kenyan Shilling (KSh)</option>
                <option value="ZAR" ${settings.currency === 'ZAR' ? 'selected' : ''}>ZAR - South African Rand (R)</option>
              </select>
            </div>
            <div class="admin-field">
              <label>Test Mode</label>
              <select name="flw_test_mode">
                <option value="1" ${settings.flw_test_mode === '1' ? 'selected' : ''}>Enabled (Test / Simulation Mode)</option>
                <option value="0" ${settings.flw_test_mode === '0' ? 'selected' : ''}>Disabled (Live Production Payments)</option>
              </select>
              <div class="hint-text">When enabled, test transactions can be completed for quick end-to-end verification.</div>
            </div>
          </div>
        </div>

        <!-- Email Receipt & Delivery Settings -->
        <div class="settings-section">
          <div class="settings-title">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--admin-accent);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Email Receipt &amp; File Delivery
          </div>
          <div class="settings-desc">
            Configure how receipts and download links are automatically sent to buyers upon successful Flutterwave checkout.
          </div>

          <div class="settings-grid-2">
            <div class="admin-field">
              <label>Email Delivery Provider</label>
              <select name="email_provider">
                <option value="resend" ${settings.email_provider === 'resend' ? 'selected' : ''}>Resend API (Recommended - Free 3,000 emails/mo)</option>
                <option value="brevo" ${settings.email_provider === 'brevo' ? 'selected' : ''}>Brevo API (Sendinblue)</option>
                <option value="mock" ${settings.email_provider === 'mock' ? 'selected' : ''}>Mock / Console Log Mode (For testing)</option>
              </select>
            </div>
            <div class="admin-field">
              <label>Email Provider API Key</label>
              <input type="password" name="email_api_key" value="${escapeHtml(settings.email_api_key || '')}" placeholder="re_xxxxxxxx or api-key">
              <div class="hint-text">Get your free API key at resend.com or brevo.com</div>
            </div>
            <div class="admin-field">
              <label>Sender Name</label>
              <input type="text" name="email_sender_name" value="${escapeHtml(settings.email_sender_name || 'Zolutions Store')}" placeholder="Zolutions Deliveries">
            </div>
            <div class="admin-field">
              <label>Sender Email Address</label>
              <input type="email" name="email_sender_address" value="${escapeHtml(settings.email_sender_address || 'orders@zolutions.com')}" placeholder="orders@zolutions.com">
            </div>
          </div>
        </div>

        <!-- Admin Security -->
        <div class="settings-section">
          <div class="settings-title">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--admin-accent);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Separate Admin Link &amp; Security
          </div>
          <div class="settings-desc">
            As requested, your admin panel is accessed via a separate secret URL path unknown to public buyers.
          </div>

          <div class="settings-grid-2">
            <div class="admin-field">
              <label>Secret Admin Route Slug</label>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: var(--admin-muted); font-size: 14px;">https://your-domain.com/</span>
                <input type="text" name="admin_secret_path" value="${escapeHtml(settings.admin_secret_path || 'zol-portal-access')}" required style="flex: 1;">
              </div>
              <div class="hint-text">Change this to any secret word (e.g. <code>zol-mgr-9201</code>). Only someone with this exact URL can reach the admin login.</div>
            </div>
            <div class="admin-field">
              <label>Update Admin Passcode</label>
              <input type="password" name="new_admin_password" placeholder="Leave blank to keep current passcode">
              <div class="hint-text">Current default passcode: <code>Zolutions2026!</code></div>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-primary" id="btnSaveSettings" style="padding: 14px 28px; font-size: 15px;">
          Save All Settings
        </button>
      </form>
    </div>
  </main>

  <!-- Add/Edit Product Modal -->
  <div class="modal-overlay" id="productModal">
    <div class="modal-card" style="max-width: 650px;">
      <div class="modal-header">
        <h3 id="prodModalTitle">Add New Digital Product</h3>
        <button class="btn-close" onclick="closeAdminModal('productModal')">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="productForm">
          <input type="hidden" id="editProductId" name="id">

          <div class="admin-field">
            <label>Product Title *</label>
            <input type="text" id="prodTitle" name="title" required placeholder="e.g. AI Business Automation Suite">
          </div>

          <div class="admin-field">
            <label>Subtitle / One-line Pitch</label>
            <input type="text" id="prodSubtitle" name="subtitle" placeholder="e.g. Ready-to-deploy Make &amp; Zapier blueprints">
          </div>

          <div class="settings-grid-2">
            <div class="admin-field">
              <label>Category *</label>
              <select id="prodCategory" name="category" required>
                <option value="AI &amp; Automations">AI &amp; Automations</option>
                <option value="No-Code Solutions">No-Code Solutions</option>
                <option value="Business Tools">Business Tools</option>
                <option value="AI Resources">AI Resources</option>
                <option value="Digital Tools">Digital Tools</option>
              </select>
            </div>
            <div class="admin-field">
              <label>Price (in ${currencySymbol}) *</label>
              <input type="number" id="prodPrice" name="price" required min="1" step="any" placeholder="49">
            </div>
          </div>

          <div class="settings-grid-2">
            <div class="admin-field">
              <label>Compare Price (optional discount display)</label>
              <input type="number" id="prodComparePrice" name="compare_price" min="0" step="any" placeholder="89">
            </div>
            <div class="admin-field">
              <label>Status</label>
              <select id="prodStatus" name="status">
                <option value="active">Active (Visible in Store)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div class="admin-field">
            <label>Cover Image (URL or Upload)</label>
            <input type="text" id="prodCoverUrl" name="cover_image" placeholder="https://images.unsplash.com/... or paste image URL">
            <div style="margin-top: 8px;">
              <span style="font-size: 12px; color: var(--admin-muted);">Or upload image file: </span>
              <input type="file" name="cover_file" accept="image/*" style="font-size: 12px; color: var(--admin-muted);">
            </div>
          </div>

          <!-- Deliverable File Options -->
          <div class="admin-field">
            <label>Deliverable Type *</label>
            <select id="prodFileType" name="file_type">
              <option value="upload">Upload Deliverable File (ZIP, PDF, JSON, etc.)</option>
              <option value="url">External Cloud Download Link (Google Drive, Dropbox, Mega, etc.)</option>
            </select>
          </div>

          <div class="admin-field" id="fileUploadWrap">
            <label>Select Deliverable File</label>
            <input type="file" name="deliverable_file" style="padding: 8px;">
            <div class="hint-text">The uploaded file will be securely stored and served only to verified buyers.</div>
          </div>

          <div class="admin-field" id="cloudUrlWrap" style="display: none;">
            <label>External Download / Access URL</label>
            <input type="url" id="prodCloudUrl" name="file_path_url" placeholder="https://drive.google.com/drive/folders/...">
            <div class="hint-text">Buyers will be emailed and given this link upon successful Flutterwave payment.</div>
          </div>

          <div class="admin-field">
            <label>Full Product Description</label>
            <textarea id="prodDescription" name="description" placeholder="Explain the benefits, what the customer gets, and how it helps them build or scale..."></textarea>
          </div>

          <div class="admin-field">
            <label>Key Features Checklist (one per line)</label>
            <textarea id="prodFeatures" name="features_text" placeholder="25+ Make &amp; Zapier blueprints&#10;OpenAI &amp; Gemini integration scripts&#10;Step-by-step setup video guide&#10;Lifetime updates"></textarea>
          </div>

          <div class="admin-field" style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="prodFeatured" name="featured" value="1" style="width: auto;">
            <label for="prodFeatured" style="margin-bottom: 0; cursor: pointer;">Feature on homepage spotlight</label>
          </div>

          <button type="submit" class="btn-primary" id="btnSaveProduct" style="width: 100%; justify-content: center; padding: 12px; margin-top: 10px;">
            Save Product
          </button>
        </form>
      </div>
    </div>
  </div>

  <script src="/js/admin.js"></script>
</body>
</html>`;
}

function renderOrderSuccess({ order, product, settings }) {
  const currencySymbol = settings.currency_symbol || '$';
  const formattedAmount = `${currencySymbol}${Number(order.amount).toLocaleString()}`;
  const downloadUrl = `/download/${order.download_token}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful - Zolutions</title>
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-link">
        <img src="/logo.png" alt="Zolutions" class="brand-logo" onerror="this.style.display='none'">
        <div class="brand-name">Zolutions<span>.</span></div>
      </a>
    </div>
  </header>

  <main class="container">
    <div class="success-card">
      <div class="success-icon-wrap">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>

      <h1 style="color: #ffffff; font-size: 28px; margin-bottom: 8px;">Payment Verified!</h1>
      <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 24px;">
        Thank you, <strong>${escapeHtml(order.customer_name)}</strong>! Your order has been confirmed via Flutterwave.
      </p>

      <div class="download-box">
        <h3 style="color: #ffffff; font-size: 18px; margin-bottom: 6px;">${escapeHtml(product.title)}</h3>
        <p style="color: var(--accent); font-weight: 700; font-size: 20px; margin-bottom: 18px;">${formattedAmount}</p>

        <a href="${downloadUrl}" class="btn-download-big">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download Your Product Files
        </a>

        ${product.file_name ? `<div style="font-size: 13px; color: var(--text-muted); margin-top: 14px;">File: ${escapeHtml(product.file_name)} ${product.file_size ? '(' + escapeHtml(product.file_size) + ')' : ''}</div>` : ''}
      </div>

      <div style="background: #090e1a; border: 1px solid var(--border); border-radius: 8px; padding: 18px; text-align: left; font-size: 13.5px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Order Number:</span>
          <strong style="color: #ffffff;">${order.id}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Transaction Ref:</span>
          <span style="color: #cbd5e1;">${order.tx_ref}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Receipt Sent To:</span>
          <span style="color: var(--accent); font-weight: 600;">${escapeHtml(order.customer_email)}</span>
        </div>
      </div>

      <p style="font-size: 13px; color: var(--text-dim); margin-bottom: 24px;">
        An official email receipt with your permanent download link has been sent to your email address. You can also bookmark this page to re-download anytime.
      </p>

      <a href="/" class="btn-preview" style="display: inline-block; padding: 12px 24px;">Return to Marketplace</a>
    </div>
  </main>
</body>
</html>`;
}

function renderTestCheckout({ order, product, settings }) {
  const currencySymbol = settings.currency_symbol || '$';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flutterwave Payment Simulator - Zolutions</title>
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="container" style="max-width: 500px; margin: 60px auto;">
    <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 36px; box-shadow: var(--shadow-card); text-align: center;">
      <div style="display: inline-block; background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
        Flutterwave Sandbox Simulator
      </div>

      <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">Complete Test Payment</h2>
      <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px;">
        You are in Test Simulation Mode. This allows you to test the complete purchase, automatic receipt generation, and digital file fulfillment before going live.
      </p>

      <div style="background: #090e1a; border: 1px solid var(--border); border-radius: 8px; padding: 18px; text-align: left; margin-bottom: 24px; font-size: 14px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Product:</span>
          <strong style="color: #ffffff;">${escapeHtml(product.title)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Amount:</span>
          <strong style="color: var(--accent); font-size: 18px;">${currencySymbol}${Number(order.amount).toLocaleString()}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Buyer:</span>
          <span style="color: #ffffff;">${escapeHtml(order.customer_name)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Email:</span>
          <span style="color: #ffffff;">${escapeHtml(order.customer_email)}</span>
        </div>
      </div>

      <a href="/api/payment/callback?status=successful&tx_ref=${encodeURIComponent(order.tx_ref)}&transaction_id=TEST_SIM_${Date.now()}" class="btn-submit-checkout" style="text-decoration: none;">
        ✓ Simulate Successful Payment (${currencySymbol}${order.amount})
      </a>

      <div style="margin-top: 18px;">
        <a href="/" style="color: var(--text-dim); font-size: 13px; text-decoration: none;">Cancel and return to store</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

module.exports = {
  renderStorefront,
  renderAdminLogin,
  renderAdminDashboard,
  renderOrderSuccess,
  renderTestCheckout
};
