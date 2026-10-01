const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '..', 'data', 'zolutions.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys
db.exec('PRAGMA journal_mode = WAL;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    compare_price REAL,
    description TEXT,
    features TEXT,
    cover_image TEXT,
    file_type TEXT DEFAULT 'upload',
    file_path TEXT,
    file_name TEXT,
    file_size TEXT,
    status TEXT DEFAULT 'active',
    featured INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    tx_ref TEXT UNIQUE NOT NULL,
    flw_transaction_id TEXT,
    product_id TEXT NOT NULL,
    product_title TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    status TEXT DEFAULT 'pending',
    download_token TEXT UNIQUE,
    download_count INTEGER DEFAULT 0,
    email_sent INTEGER DEFAULT 0,
    email_sent_at INTEGER,
    email_error TEXT,
    created_at INTEGER,
    paid_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    created_at INTEGER,
    expires_at INTEGER
  );
`);

// Seed default settings if not existing
const defaultSettings = {
  admin_secret_path: 'zol-portal-access',
  admin_password_hash: crypto.createHash('sha256').update('Zolutions2026!').digest('hex'),
  currency: 'USD',
  currency_symbol: '$',
  flw_public_key: '',
  flw_secret_key: '',
  flw_encryption_key: '',
  flw_secret_hash: '',
  flw_test_mode: '1',
  email_provider: 'mock',
  email_api_key: '',
  email_sender_name: 'Zolutions Deliveries',
  email_sender_address: 'support@zolutions.com',
  smtp_host: '',
  smtp_port: '587',
  smtp_user: '',
  smtp_pass: '',
  site_title: 'Zolutions',
  site_tagline: 'Premium Digital Tools, AI Resources & No-Code Solutions',
  site_description: 'Zolutions is a premium marketplace offering digital tools, no-code solutions, AI resources, and business automation designed to help you build, automate, and scale your business with confidence.'
};

const getSettingStmt = db.prepare('SELECT value FROM settings WHERE key = ?');
const setSettingStmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');

for (const [key, value] of Object.entries(defaultSettings)) {
  const existing = getSettingStmt.get(key);
  if (!existing) {
    setSettingStmt.run(key, value);
  }
}

// Ensure currency is set to USD and $ as user requested
db.prepare("UPDATE settings SET value = 'USD' WHERE key = 'currency' AND value = 'NGN'").run();
db.prepare("UPDATE settings SET value = '$' WHERE key = 'currency_symbol' AND value = '₦'").run();

// Function to seed / migrate products to USD pricing
function seedAndMigrateProducts() {
  const sampleProducts = [
    {
      id: 'prod-ai-business-os',
      title: 'AI Business Automation Suite 2026',
      slug: 'ai-business-automation-suite',
      subtitle: 'Complete AI workflows, automated lead generators, and Make/Zapier blueprints.',
      category: 'AI & Automations',
      price: 49,
      compare_price: 89,
      description: 'Supercharge your business operations with our flagship AI Business Automation Suite. Includes 25+ ready-to-deploy blueprints for customer onboarding, automated CRM synchronization, AI proposal generation, and social media scheduling.',
      features: JSON.stringify([
        '25+ Ready-to-import Make.com & Zapier blueprints',
        'OpenAI & Gemini API integration scripts',
        'Customer Support AI Agent setup guide',
        'Lifetime updates & priority email support'
      ]),
      cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      file_type: 'upload',
      file_name: 'Zolutions_AI_Automation_Suite_v2.6.zip',
      file_path: 'zolutions_ai_suite.zip',
      file_size: '14.2 MB',
      status: 'active',
      featured: 1
    },
    {
      id: 'prod-nocode-crm-starter',
      title: 'Ultimate No-Code CRM & Client Portal',
      slug: 'ultimate-nocode-crm-client-portal',
      subtitle: 'Modern client management system built for agencies and freelancers.',
      category: 'No-Code Solutions',
      price: 39,
      compare_price: 69,
      description: 'Stop paying monthly fees for complex CRMs. This all-in-one client management portal includes pipeline tracking, automated invoice generation, project milestones, and client document sharing.',
      features: JSON.stringify([
        'Full source schema & layout templates',
        'Automated client invoicing & receipts',
        'Project timeline & task kanban boards',
        'Step-by-step 15-minute video walkthrough'
      ]),
      cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      file_type: 'upload',
      file_name: 'Zolutions_NoCode_CRM_Portal.zip',
      file_path: 'zolutions_nocode_crm.zip',
      file_size: '8.7 MB',
      status: 'active',
      featured: 1
    },
    {
      id: 'prod-whatsapp-bot-engine',
      title: 'WhatsApp Automated Sales & Support Bot',
      slug: 'whatsapp-automated-sales-bot',
      subtitle: 'Interactive WhatsApp bot template for automated ordering, FAQs, and lead capture.',
      category: 'Business Tools',
      price: 59,
      compare_price: 99,
      description: 'Turn your WhatsApp into a 24/7 sales machine. Handles product inquiries, auto-replies with product catalogs, collects payments, and sends instant confirmation notifications without human intervention.',
      features: JSON.stringify([
        'Official Cloud API & Webhook compatible',
        'Catalog browsing & cart checkout flows',
        'Flutterwave instant payment link generator',
        'Google Sheets automatic lead sync'
      ]),
      cover_image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&auto=format&fit=crop&q=80',
      file_type: 'upload',
      file_name: 'Zolutions_WhatsApp_Bot_Engine.zip',
      file_path: 'zolutions_whatsapp_bot.zip',
      file_size: '12.1 MB',
      status: 'active',
      featured: 1
    },
    {
      id: 'prod-prompt-engineering-mastery',
      title: 'Executive AI Prompt Vault & Cheat Sheets',
      slug: 'executive-ai-prompt-vault',
      subtitle: 'Over 1,200+ tested prompts for marketing, coding, finance, and legal drafting.',
      category: 'AI Resources',
      price: 19,
      compare_price: 39,
      description: 'The definitive prompt engineering library used by 500+ founders and digital creators. Designed to extract executive-level outputs from ChatGPT, Claude, and Gemini with zero fluff.',
      features: JSON.stringify([
        '1,200+ battle-tested system & user prompts',
        'Categorized by Marketing, Sales, Tech & Ops',
        'Interactive searchable PDF & Notion library',
        'Regular free prompt updates'
      ]),
      cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
      file_type: 'upload',
      file_name: 'Executive_AI_Prompt_Vault_2026.pdf',
      file_path: 'executive_ai_prompt_vault.pdf',
      file_size: '5.4 MB',
      status: 'active',
      featured: 0
    },
    {
      id: 'prod-digital-product-launchkit',
      title: 'Digital Creator Launchpad & Marketing Kit',
      slug: 'digital-creator-launchpad',
      subtitle: 'Everything you need to launch and sell your digital downloads in 48 hours.',
      category: 'Digital Tools',
      price: 29,
      compare_price: 49,
      description: 'High-converting sales copy templates, email launch sequences, Figma product mockup frames, and social media carousels designed specifically for digital product creators.',
      features: JSON.stringify([
        'Figma 3D product mockup generator files',
        '7-day email launch sequence copy',
        'Instagram & Twitter carousels (Canva + Figma)',
        'Pricing psychology handbook'
      ]),
      cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      file_type: 'upload',
      file_name: 'Zolutions_Creator_Launchpad.zip',
      file_path: 'zolutions_creator_launchpad.zip',
      file_size: '22.0 MB',
      status: 'active',
      featured: 0
    },
    {
      id: 'prod-financial-os-sheet',
      title: 'Automated Financial Dashboard & Tax OS',
      slug: 'automated-financial-dashboard-os',
      subtitle: 'Real-time multi-currency income, expense, and tax projection dashboard.',
      category: 'Business Tools',
      price: 25,
      compare_price: 45,
      description: 'Track your business revenue, Flutterwave payouts, operational expenses, and profit margins in real-time with automatic currency conversion and visual financial health graphs.',
      features: JSON.stringify([
        'Multi-currency auto-calculating engine (USD, NGN, EUR, GBP)',
        'Cash flow forecast & burn rate projections',
        'Quarterly tax estimates and expense categorization',
        'Google Sheets & Excel formats included'
      ]),
      cover_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      file_type: 'upload',
      file_name: 'Zolutions_Financial_Tax_OS.xlsx',
      file_path: 'zolutions_financial_tax_os.xlsx',
      file_size: '3.1 MB',
      status: 'active',
      featured: 0
    },
    {
      id: 'prod-saas-starter-kit',
      title: 'SaaS Fast-Track Full-Stack Boilerplate',
      slug: 'saas-fast-track-boilerplate',
      subtitle: 'Production-ready Next.js & Tailwind SaaS foundation with auth, database & billing.',
      category: 'No-Code Solutions',
      price: 79,
      compare_price: 149,
      description: 'Launch your micro-SaaS or client portal in days instead of months. Comes with pre-configured authentication, database schema, transactional emails, and Flutterwave subscription support.',
      features: JSON.stringify([
        'Next.js 15 App Router & Tailwind CSS',
        'Pre-integrated Flutterwave Checkout & Webhooks',
        'Complete user profile & dashboard views',
        'Full commercial license for unlimited apps'
      ]),
      cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      file_type: 'upload',
      file_name: 'Zolutions_SaaS_Boilerplate_Kit.zip',
      file_path: 'zolutions_saas_kit.zip',
      file_size: '18.5 MB',
      status: 'active',
      featured: 1
    },
    {
      id: 'prod-agency-notion-os',
      title: 'Agency Operations & Project Delivery Notion OS',
      slug: 'agency-operations-notion-os',
      subtitle: 'Complete operating system for creative agencies, consultancies, and growth studios.',
      category: 'Digital Tools',
      price: 34,
      compare_price: 59,
      description: 'The operating system used to deliver $500k+ in client projects. Centralize your client onboarding, creative reviews, contract milestones, team allocations, and profit metrics in one intuitive workspace.',
      features: JSON.stringify([
        'Client onboarding portal & intake forms',
        'Milestone tracking with scope creep shields',
        'Contract and proposal swipe files',
        'Instant 1-click duplicate to Notion'
      ]),
      cover_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      file_type: 'upload',
      file_name: 'Zolutions_Agency_Notion_OS.zip',
      file_path: 'zolutions_agency_os.zip',
      file_size: '4.2 MB',
      status: 'active',
      featured: 0
    }
  ];

  const now = Date.now();

  for (const p of sampleProducts) {
    const existing = db.prepare('SELECT id, price FROM products WHERE id = ?').get(p.id);
    if (!existing) {
      db.prepare(`
        INSERT INTO products (
          id, title, slug, subtitle, category, price, compare_price,
          description, features, cover_image, file_type, file_path, file_name,
          file_size, status, featured, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        p.id, p.title, p.slug, p.subtitle, p.category, p.price, p.compare_price,
        p.description, p.features, p.cover_image, p.file_type, p.file_path, p.file_name,
        p.file_size, p.status, p.featured, now, now
      );
    } else if (existing.price >= 500) {
      // Migrate from old NGN price to new USD price
      db.prepare(`
        UPDATE products SET price = ?, compare_price = ? WHERE id = ?
      `).run(p.price, p.compare_price, p.id);
    }

    // Ensure sample file exists in uploads/products
    const fullPath = path.join(__dirname, '..', 'uploads', 'products', p.file_path);
    if (!fs.existsSync(fullPath)) {
      const sampleText = `=====================================================
ZOLUTIONS - PREMIUM DIGITAL PRODUCT
Product: ${p.title}
Version: 2026.1 Official Release
Support: support@zolutions.com
=====================================================

Thank you for your purchase from Zolutions!
Here are your package contents and access links:

1. Complete resource files & templates
2. Setup and deployment documentation
3. Free update notifications

Welcome to the Zolutions community!
=====================================================`;
      fs.writeFileSync(fullPath, sampleText, 'utf-8');
    }
  }
}

seedAndMigrateProducts();

module.exports = {
  db,
  getSettings() {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const r of rows) settings[r.key] = r.value;
    return settings;
  },
  getSetting(key) {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? row.value : null;
  },
  setSetting(key, value) {
    setSettingStmt.run(key, value);
  },
  updateSettings(obj) {
    for (const [k, v] of Object.entries(obj)) {
      setSettingStmt.run(k, String(v));
    }
  },
  // Products
  getActiveProducts(category = null) {
    if (category && category !== 'All') {
      return db.prepare("SELECT * FROM products WHERE status = 'active' AND category = ? ORDER BY featured DESC, created_at DESC").all(category);
    }
    return db.prepare("SELECT * FROM products WHERE status = 'active' ORDER BY featured DESC, created_at DESC").all();
  },
  getAllProducts() {
    return db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  },
  getProductById(id) {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },
  getProductBySlug(slug) {
    return db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
  },
  createProduct(data) {
    const id = data.id || ('prod-' + crypto.randomUUID().slice(0, 8));
    const now = Date.now();
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    db.prepare(`
      INSERT INTO products (
        id, title, slug, subtitle, category, price, compare_price,
        description, features, cover_image, file_type, file_path, file_name,
        file_size, status, featured, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.title, slug, data.subtitle || '', data.category, Number(data.price),
      data.compare_price ? Number(data.compare_price) : null,
      data.description || '', JSON.stringify(data.features || []),
      data.cover_image || '', data.file_type || 'upload',
      data.file_path || '', data.file_name || '', data.file_size || '',
      data.status || 'active', data.featured ? 1 : 0, now, now
    );
    return this.getProductById(id);
  },
  updateProduct(id, data) {
    const now = Date.now();
    const existing = this.getProductById(id);
    if (!existing) return null;

    const slug = data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : existing.slug);
    
    db.prepare(`
      UPDATE products SET
        title = ?, slug = ?, subtitle = ?, category = ?, price = ?, compare_price = ?,
        description = ?, features = ?, cover_image = ?, file_type = ?, file_path = ?, file_name = ?,
        file_size = ?, status = ?, featured = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.title ?? existing.title,
      slug,
      data.subtitle ?? existing.subtitle,
      data.category ?? existing.category,
      Number(data.price ?? existing.price),
      data.compare_price !== undefined ? (data.compare_price ? Number(data.compare_price) : null) : existing.compare_price,
      data.description ?? existing.description,
      data.features !== undefined ? (typeof data.features === 'string' ? data.features : JSON.stringify(data.features)) : existing.features,
      data.cover_image ?? existing.cover_image,
      data.file_type ?? existing.file_type,
      data.file_path ?? existing.file_path,
      data.file_name ?? existing.file_name,
      data.file_size ?? existing.file_size,
      data.status ?? existing.status,
      data.featured !== undefined ? (data.featured ? 1 : 0) : existing.featured,
      now,
      id
    );
    return this.getProductById(id);
  },
  deleteProduct(id) {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return true;
  },
  // Import CSV
  importProductsFromCsv(csvText) {
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return { count: 0 };

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''));
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, idx) => row[h] = values[idx] || '');

      if (!row.title || !row.price) continue;

      const featuresArr = row.features ? row.features.split(';').map(f => f.trim()) : [];
      this.createProduct({
        title: row.title,
        subtitle: row.subtitle || '',
        category: row.category || 'Digital Tools',
        price: parseFloat(row.price) || 29,
        compare_price: row.compare_price ? parseFloat(row.compare_price) : null,
        description: row.description || '',
        features: featuresArr,
        cover_image: row.cover_image || '',
        file_type: row.file_type || 'url',
        file_path: row.file_path || row.file_url || '',
        file_name: row.file_name || 'Deliverable File',
        status: row.status || 'active'
      });
      imported++;
    }

    return { count: imported };
  },
  // Orders
  createOrder(data) {
    const id = data.id || ('ZOL-' + Date.now().toString().slice(-6) + '-' + crypto.randomBytes(3).toString('hex').toUpperCase());
    const tx_ref = data.tx_ref || ('TX-' + id);
    const download_token = crypto.randomUUID();
    const now = Date.now();

    db.prepare(`
      INSERT INTO orders (
        id, tx_ref, flw_transaction_id, product_id, product_title,
        amount, currency, customer_name, customer_email, customer_phone,
        status, download_token, download_count, email_sent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
    `).run(
      id, tx_ref, data.flw_transaction_id || null, data.product_id, data.product_title,
      Number(data.amount), data.currency || 'USD', data.customer_name, data.customer_email,
      data.customer_phone || '', data.status || 'pending', download_token, now
    );

    return this.getOrderById(id);
  },
  getOrderById(id) {
    return db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  },
  getOrderByTxRef(tx_ref) {
    return db.prepare('SELECT * FROM orders WHERE tx_ref = ?').get(tx_ref);
  },
  getOrderByDownloadToken(token) {
    return db.prepare('SELECT * FROM orders WHERE download_token = ?').get(token);
  },
  getAllOrders() {
    return db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  },
  markOrderPaid(id, flw_transaction_id) {
    const now = Date.now();
    db.prepare(`
      UPDATE orders SET status = 'paid', flw_transaction_id = ?, paid_at = ? WHERE id = ?
    `).run(flw_transaction_id, now, id);
    return this.getOrderById(id);
  },
  markEmailSent(id, success = true, errorMsg = null) {
    const now = Date.now();
    db.prepare(`
      UPDATE orders SET email_sent = ?, email_sent_at = ?, email_error = ? WHERE id = ?
    `).run(success ? 1 : 0, now, errorMsg || null, id);
  },
  incrementDownloadCount(id) {
    db.prepare('UPDATE orders SET download_count = download_count + 1 WHERE id = ?').run(id);
  },
  // Admin Sessions
  createAdminSession() {
    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expires = now + (7 * 24 * 60 * 60 * 1000); // 7 days
    db.prepare('INSERT INTO admin_sessions (token, created_at, expires_at) VALUES (?, ?, ?)').run(token, now, expires);
    return token;
  },
  verifyAdminSession(token) {
    if (!token) return false;
    const session = db.prepare('SELECT * FROM admin_sessions WHERE token = ?').get(token);
    if (!session) return false;
    if (session.expires_at < Date.now()) {
      db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
      return false;
    }
    return true;
  },
  deleteAdminSession(token) {
    if (token) db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  }
};
