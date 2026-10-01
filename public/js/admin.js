let adminProducts = [];
let adminOrders = [];

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadDashboardData();
  setupProductForm();
  setupSettingsForm();
  setupCsvImportForm();
});

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      const contentEl = document.getElementById(tabId);
      if (contentEl) contentEl.style.display = 'block';

      if (tabId === 'productsTab') loadProducts();
      if (tabId === 'ordersTab') loadOrders();
    });
  });
}

async function loadDashboardData() {
  try {
    const res = await fetch('/api/admin/dashboard-stats');
    if (res.status === 401) {
      window.location.reload();
      return;
    }
    const data = await res.json();
    if (data.success) {
      document.getElementById('statRevenue').textContent = data.stats.formattedRevenue;
      document.getElementById('statOrders').textContent = data.stats.totalPaidOrders;
      document.getElementById('statProducts').textContent = data.stats.totalProducts;
      document.getElementById('statDownloads').textContent = data.stats.totalDownloads;

      // Render recent orders preview
      renderRecentOrders(data.recentOrders || []);
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

function renderRecentOrders(orders) {
  const container = document.getElementById('recentOrdersBody');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-muted); padding: 30px;">No orders yet. They will appear here once customers make purchases.</td></tr>`;
    return;
  }

  container.innerHTML = orders.map(o => `
    <tr>
      <td><code>${o.id}</code></td>
      <td><strong>${escapeHtml(o.customer_name)}</strong><br><small style="color: var(--admin-muted);">${escapeHtml(o.customer_email)}</small></td>
      <td>${escapeHtml(o.product_title)}</td>
      <td><strong>$${Number(o.amount).toLocaleString()}</strong></td>
      <td><span class="badge-status ${o.status}">${o.status}</span></td>
      <td>${new Date(o.created_at).toLocaleDateString()}</td>
    </tr>
  `).join('');
}

// ---------------- PRODUCTS ----------------

async function loadProducts() {
  try {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    adminProducts = data.products || [];
    renderProductsTable(adminProducts);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-muted); padding: 40px;">No products added yet. Click "Add Product" or use the CSV Importer!</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="product-row-info">
          <img src="${p.cover_image || '/logo.png'}" class="product-thumb" onerror="this.src='/logo.png'">
          <div>
            <strong>${escapeHtml(p.title)}</strong>
            <div style="font-size: 12px; color: var(--admin-muted);">${escapeHtml(p.category)}</div>
          </div>
        </div>
      </td>
      <td><strong>$${Number(p.price).toLocaleString()}</strong> ${p.compare_price ? `<span style="color:var(--admin-dim); text-decoration:line-through; font-size:12px;">$${Number(p.compare_price).toLocaleString()}</span>` : ''}</td>
      <td>
        <div style="font-size: 13px;">${escapeHtml(p.file_name || 'Cloud Link')}</div>
        <div style="font-size: 11px; color: var(--admin-muted);">${p.file_type === 'upload' ? (p.file_size || 'File Upload') : 'External URL'}</div>
      </td>
      <td><span class="badge-status ${p.status}">${p.status}</span></td>
      <td>${new Date(p.created_at).toLocaleDateString()}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon" onclick="editProduct('${p.id}')">Edit</button>
          <button class="btn-icon danger" onclick="deleteProduct('${p.id}', '${escapeHtml(p.title)}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddProductModal() {
  document.getElementById('productForm').reset();
  document.getElementById('editProductId').value = '';
  document.getElementById('prodModalTitle').textContent = 'Add New Digital Product';
  document.getElementById('productModal').classList.add('active');
}

function editProduct(id) {
  const p = adminProducts.find(x => x.id === id);
  if (!p) return;

  document.getElementById('editProductId').value = p.id;
  document.getElementById('prodTitle').value = p.title;
  document.getElementById('prodSubtitle').value = p.subtitle || '';
  document.getElementById('prodCategory').value = p.category;
  document.getElementById('prodPrice').value = p.price;
  document.getElementById('prodComparePrice').value = p.compare_price || '';
  document.getElementById('prodDescription').value = p.description || '';
  
  let featuresStr = '';
  try {
    const list = typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || []);
    featuresStr = list.join('\n');
  } catch (e) {
    featuresStr = '';
  }
  document.getElementById('prodFeatures').value = featuresStr;
  document.getElementById('prodCoverUrl').value = p.cover_image || '';
  document.getElementById('prodFileType').value = p.file_type || 'upload';
  document.getElementById('prodCloudUrl').value = p.file_type === 'url' ? p.file_path : '';
  document.getElementById('prodStatus').value = p.status || 'active';
  document.getElementById('prodFeatured').checked = !!p.featured;

  toggleDeliverableInputs();

  document.getElementById('prodModalTitle').textContent = 'Edit Digital Product';
  document.getElementById('productModal').classList.add('active');
}

async function deleteProduct(id, title) {
  if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

  try {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      loadProducts();
      loadDashboardData();
    } else {
      alert(data.error || 'Failed to delete product');
    }
  } catch (err) {
    alert('Error deleting product');
  }
}

function setupProductForm() {
  const fileTypeSelect = document.getElementById('prodFileType');
  if (fileTypeSelect) {
    fileTypeSelect.addEventListener('change', toggleDeliverableInputs);
  }

  const form = document.getElementById('productForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('btnSaveProduct');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const formData = new FormData(form);
      const isEdit = !!document.getElementById('editProductId').value;
      const url = isEdit ? `/api/admin/products/${document.getElementById('editProductId').value}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method: method,
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          closeAdminModal('productModal');
          loadProducts();
          loadDashboardData();
        } else {
          alert(data.error || 'Failed to save product');
        }
      } catch (err) {
        console.error('Error saving product:', err);
        alert('An unexpected error occurred while saving.');
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Product';
      }
    });
  }
}

function toggleDeliverableInputs() {
  const type = document.getElementById('prodFileType').value;
  const fileUploadWrap = document.getElementById('fileUploadWrap');
  const cloudUrlWrap = document.getElementById('cloudUrlWrap');

  if (type === 'url') {
    fileUploadWrap.style.display = 'none';
    cloudUrlWrap.style.display = 'block';
  } else {
    fileUploadWrap.style.display = 'block';
    cloudUrlWrap.style.display = 'none';
  }
}

// ---------------- ORDERS & DELIVERIES ----------------

async function loadOrders() {
  try {
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    adminOrders = data.orders || [];
    renderOrdersTable(adminOrders);
  } catch (err) {
    console.error('Failed to load orders:', err);
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-muted); padding: 40px;">No customer orders found.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><code>${o.id}</code></td>
      <td>
        <strong>${escapeHtml(o.customer_name)}</strong>
        <div style="font-size: 12px; color: var(--admin-muted);">${escapeHtml(o.customer_email)}</div>
        ${o.customer_phone ? `<div style="font-size: 11px; color: var(--admin-dim);">${escapeHtml(o.customer_phone)}</div>` : ''}
      </td>
      <td>${escapeHtml(o.product_title)}</td>
      <td><strong>$${Number(o.amount).toLocaleString()}</strong></td>
      <td>
        <span class="badge-status ${o.status}">${o.status}</span>
        <div style="font-size: 11px; color: var(--admin-muted); margin-top: 4px;">
          ${o.email_sent ? '✉ Receipt Emailed' : '⏳ Email Pending'}
        </div>
      </td>
      <td>
        <div>${new Date(o.created_at).toLocaleDateString()}</div>
        <div style="font-size: 11px; color: var(--admin-dim);">${o.download_count} downloads</div>
      </td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon success" title="Re-send confirmation email and download file link to buyer" onclick="resendOrderEmail('${o.id}')">
            Resend Email
          </button>
          <a href="/download/${o.download_token}" target="_blank" class="btn-icon" title="Test deliverable file download">
            Test File
          </a>
        </div>
      </td>
    </tr>
  `).join('');
}

async function resendOrderEmail(orderId) {
  if (!confirm(`Resend email receipt and download access to customer for order ${orderId}?`)) return;

  try {
    const res = await fetch(`/api/admin/orders/${orderId}/resend-email`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      alert(`Success! Delivery email triggered to customer.\nProvider: ${data.provider}`);
      loadOrders();
    } else {
      alert(data.error || 'Failed to resend email');
    }
  } catch (err) {
    alert('Error connecting to server');
  }
}

// ---------------- CSV IMPORT ----------------

function setupCsvImportForm() {
  const form = document.getElementById('csvImportForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const csvText = document.getElementById('csvContent').value.trim();
      if (!csvText) {
        alert('Please paste CSV content first.');
        return;
      }

      const btn = document.getElementById('btnImportCsv');
      btn.disabled = true;
      btn.textContent = 'Importing...';

      try {
        const res = await fetch('/api/admin/products/import-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv: csvText })
        });
        const data = await res.json();
        if (data.success) {
          alert(`Successfully imported ${data.count} products!`);
          document.getElementById('csvContent').value = '';
          loadProducts();
          loadDashboardData();
        } else {
          alert(data.error || 'Failed to import products');
        }
      } catch (err) {
        alert('Error connecting to server');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Import Products Now';
      }
    });
  }
}

// ---------------- SETTINGS ----------------

function setupSettingsForm() {
  const form = document.getElementById('settingsForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSaveSettings');
      btn.disabled = true;
      btn.textContent = 'Saving Settings...';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('Settings saved successfully!');
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
          } else {
            window.location.reload();
          }
        } else {
          alert(data.error || 'Failed to save settings');
        }
      } catch (err) {
        alert('Error saving settings');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save All Settings';
      }
    });
  }
}

function copySecretUrl() {
  const urlEl = document.getElementById('secretUrlDisplay');
  if (!urlEl) return;
  const fullUrl = window.location.origin + '/' + urlEl.dataset.path;
  navigator.clipboard.writeText(fullUrl).then(() => {
    alert(`Secret Admin Link copied to clipboard:\n${fullUrl}\n\nKeep this secret! Only you should know this URL.`);
  });
}

function closeAdminModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
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
