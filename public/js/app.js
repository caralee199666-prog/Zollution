let currentProducts = [];
let activeCategory = 'All';
let selectedProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupEventListeners();
});

async function loadProducts(category = null) {
  try {
    const url = category && category !== 'All' 
      ? `/api/products?category=${encodeURIComponent(category)}` 
      : '/api/products';
    const res = await fetch(url);
    const data = await res.json();
    currentProducts = data.products || [];
    renderProducts(currentProducts);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; color: var(--text-muted);">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="margin: 0 auto 14px; color: var(--text-dim); display: block;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h3 style="color: #ffffff; font-size: 20px; margin-bottom: 8px;">No matching digital solutions</h3>
        <p style="font-size: 14px;">Try searching for different keywords like "AI", "CRM", "WhatsApp", or select another category.</p>
      </div>
    `;
    return;
  }

  const currencySymbol = window.STORE_CURRENCY_SYMBOL || '$';

  grid.innerHTML = products.map((p, idx) => {
    let featuresList = [];
    try {
      featuresList = typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || []);
    } catch (e) {
      featuresList = [];
    }

    const discountPercent = p.compare_price && p.compare_price > p.price
      ? Math.round(((p.compare_price - p.price) / p.compare_price) * 100)
      : null;

    const reviewCount = 45 + ((idx * 37) % 180);

    return `
      <div class="product-card" data-id="${p.id}">
        <div class="card-media">
          <img src="${p.cover_image || '/logo.png'}" alt="${escapeHtml(p.title)}" class="card-img" onerror="this.src='/logo.png'">
          <span class="card-category-badge">${escapeHtml(p.category)}</span>
          ${discountPercent ? `<span class="card-discount-badge">Save ${discountPercent}%</span>` : ''}
        </div>
        <div class="card-body">
          <div class="card-rating">
            <span class="stars">★★★★★</span>
            <strong>4.9</strong>
            <span style="color: var(--text-dim);">(${reviewCount} reviews)</span>
          </div>

          <h3 class="card-title">${escapeHtml(p.title)}</h3>
          <p class="card-subtitle">${escapeHtml(p.subtitle || p.description?.slice(0, 110) || '')}</p>
          
          <div class="card-deliverable-badge">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--accent);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>${p.file_type === 'upload' ? '⚡ Instant ZIP Download' : '📦 Cloud Access Deliverable'} ${p.file_size ? '(' + escapeHtml(p.file_size) + ')' : ''}</span>
          </div>

          ${featuresList.length > 0 ? `
            <ul class="card-features-mini">
              ${featuresList.slice(0, 2).map(f => `
                <li>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  ${escapeHtml(f)}
                </li>
              `).join('')}
            </ul>
          ` : ''}

          <div class="card-footer">
            <div class="price-box">
              <span class="current-price">${currencySymbol}${Number(p.price).toLocaleString()}</span>
              ${p.compare_price ? `<span class="compare-price">${currencySymbol}${Number(p.compare_price).toLocaleString()}</span>` : ''}
            </div>
            <div class="card-actions">
              <button class="btn-preview" onclick="openPreviewModal('${p.id}')">Quick View</button>
              <button class="btn-buy" onclick="openCheckoutModal('${p.id}')">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupEventListeners() {
  // Search filtering
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderProducts(currentProducts);
        return;
      }
      const filtered = currentProducts.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
      renderProducts(filtered);
    });
  }

  // Keyboard shortcut Cmd+K or Ctrl+K to focus search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const s = document.getElementById('productSearch');
      if (s) s.focus();
    }
  });

  // Category buttons
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      loadProducts(activeCategory);
    });
  });

  // Checkout form submit
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }
}

function openPreviewModal(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;
  selectedProduct = product;

  const modal = document.getElementById('previewModal');
  const currencySymbol = window.STORE_CURRENCY_SYMBOL || '$';

  let featuresList = [];
  try {
    featuresList = typeof product.features === 'string' ? JSON.parse(product.features) : (product.features || []);
  } catch (e) {
    featuresList = [];
  }

  document.getElementById('prevTitle').textContent = product.title;
  document.getElementById('prevCategory').textContent = product.category;
  document.getElementById('prevImg').src = product.cover_image || '/logo.png';
  document.getElementById('prevDesc').textContent = product.description || product.subtitle || '';
  document.getElementById('prevPrice').textContent = `${currencySymbol}${Number(product.price).toLocaleString()}`;
  
  const compPriceEl = document.getElementById('prevComparePrice');
  if (product.compare_price) {
    compPriceEl.textContent = `${currencySymbol}${Number(product.compare_price).toLocaleString()}`;
    compPriceEl.style.display = 'inline';
  } else {
    compPriceEl.style.display = 'none';
  }

  // File deliverable info
  const fileInfoEl = document.getElementById('prevFileInfo');
  if (fileInfoEl) {
    fileInfoEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span><strong>Deliverable File:</strong> ${escapeHtml(product.file_name || 'Direct Cloud Package')} ${product.file_size ? '(' + escapeHtml(product.file_size) + ')' : ''}</span>
        <span style="color: var(--accent); font-weight: 600;">⚡ Instant Delivery</span>
      </div>
    `;
    fileInfoEl.style.display = 'block';
  }

  // Features
  const featUl = document.getElementById('prevFeatures');
  if (featUl) {
    if (featuresList.length > 0) {
      featUl.innerHTML = featuresList.map(f => `
        <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: #cbd5e1; font-size: 14.5px;">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" style="color: var(--accent); flex-shrink: 0;">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          ${escapeHtml(f)}
        </li>
      `).join('');
      featUl.parentElement.style.display = 'block';
    } else {
      featUl.parentElement.style.display = 'none';
    }
  }

  modal.classList.add('active');
}

function openCheckoutModal(productId) {
  closeModal('previewModal');
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;
  selectedProduct = product;

  const modal = document.getElementById('checkoutModal');
  const currencySymbol = window.STORE_CURRENCY_SYMBOL || '$';

  document.getElementById('checkoutProdTitle').textContent = product.title;
  document.getElementById('checkoutTotal').textContent = `${currencySymbol}${Number(product.price).toLocaleString()}`;
  
  modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  if (!selectedProduct) return;

  const btn = document.getElementById('btnSubmitPay');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span style="display:inline-block; animation: spin 1s infinite linear;">↻</span> Connecting to Flutterwave...`;

  const name = document.getElementById('buyerName').value.trim();
  const email = document.getElementById('buyerEmail').value.trim();
  const phone = document.getElementById('buyerPhone').value.trim();

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: selectedProduct.id,
        customerName: name,
        customerEmail: email,
        customerPhone: phone
      })
    });

    const data = await res.json();
    if (data.success && data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      alert(data.error || 'Failed to initialize payment with Flutterwave.');
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  } catch (err) {
    console.error('Checkout error:', err);
    alert('An unexpected network error occurred. Please try again.');
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
