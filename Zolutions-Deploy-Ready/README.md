# Zolutions - Premium Digital Marketplace & Automations

A fast, custom web application built to completely replace Glide for **Zolutions**. Designed with an emerald green dark theme (`#4D9B0D`), instant Flutterwave checkout, automated HTML email receipts with digital file delivery, and a separate, secret Admin Portal.

---

## 🚀 Live Access & Quick Links

- **Public Marketplace (Storefront):** [http://localhost:3000](http://localhost:3000)
- **Secret Admin Portal:** [http://localhost:3000/zol-portal-access](http://localhost:3000/zol-portal-access)
  - **Initial Admin Passcode:** `Zolutions2026!`
  - *Note:* Regular users visiting `/admin` or `/dashboard` get a `404 Not Found`. Only the secret link grants access to the admin portal.

---

## ✨ Features & Upgrades Over Glide

1. **Brand Identity Preserved & Enhanced:**
   - Exact brand name: **Zolutions**.
   - Original logo and favicon preserved and embedded locally.
   - Distinctive emerald green brand accent (`#4D9B0D`) paired with sleek dark surfaces and subtle glassmorphism.
   - Zero Glide branding, zero Glide monthly row limits, and instant loading times.

2. **Customer Experience & Storefront:**
   - Real-time search across products, categories, and descriptions.
   - Category filtering (AI & Automations, No-Code Solutions, Business Tools, AI Resources, Digital Tools).
   - Rich product preview drawers with included deliverables list and pricing comparison badges (e.g. *Save 40%*).
   - High-converting checkout modal with Flutterwave integration.

3. **Flutterwave Payment Gateway:**
   - Seamless checkout for Cards, Bank Transfers, USSD, and Mobile Money.
   - Built-in server verification (`GET /v3/transactions/:id/verify`) to ensure orders are genuine before releasing files.
   - Flutterwave Webhook handler (`POST /api/payment/webhook`) with secret hash verification.
   - **Test Simulator Mode:** Allows immediate test transactions before entering live merchant keys.

4. **Automated Email Receipt & Digital File Delivery:**
   - When a customer pays, an official branded HTML email receipt is automatically dispatched to their email address.
   - Includes the order reference number, amount paid, item summary, and a **Direct File Download Button**.
   - Supports **Resend API** (free 3,000 emails/month, 1-minute setup) and **Brevo API**.
   - Built-in Mock / Log mode for local testing without external API keys.

5. **Separate & Secure Admin Portal:**
   - **Accessible ONLY via secret URL:** `http://localhost:3000/zol-portal-access` (customizable slug in Admin Settings).
   - **Add New Products:** Upload cover images, set pricing/discounts, write rich descriptions, and attach deliverable files (ZIP, PDF, etc.) or external cloud URLs (Google Drive / Dropbox).
   - **Edit & Delete Products:** Manage product visibility (Active/Draft) and homepage spotlight status.
   - **Orders & Deliveries Log:** View all customer transactions, payment references, and download counts.
   - **1-Click "Resend Email":** Re-dispatch receipt and deliverable file to any customer with a single click.
   - **Settings Management:** Configure Flutterwave keys, currency (NGN, USD, etc.), email credentials, secret route slug, and admin password directly from the dashboard.

---

## 🛠️ Project Structure

```
zolutions-app/
├── data/
│   └── zolutions.db          # Embedded SQLite database (products, orders, settings)
├── uploads/
│   ├── products/             # Secure digital deliverable files (ZIP, PDF, JSON)
│   └── covers/               # Uploaded product cover images
├── public/
│   ├── css/
│   │   ├── style.css         # Storefront styling (dark theme, #4D9B0D)
│   │   └── admin.css         # Admin portal dashboard styling
│   ├── js/
│   │   ├── app.js            # Storefront search, filters, modals, checkout
│   │   └── admin.js          # Admin CRUD, file uploads, settings
│   ├── logo.png              # Zolutions official logo
│   └── favicon.png           # Zolutions app icon
├── src/
│   ├── db.js                 # SQLite database models & seed data
│   ├── flutterwave.js        # Payment link creation & verification
│   ├── emailService.js       # HTML receipt generator & email dispatch
│   ├── auth.js               # Admin session security & secret URL router
│   ├── multipart.js          # Native multipart file upload handler
│   ├── views.js              # HTML page templates
│   └── routes.js             # HTTP request router & API controllers
├── server.js                 # Main server entry point (port 3000)
├── start.bat                 # 1-click Windows start script
└── test_suite.js             # Automated end-to-end verification test suite
```

---

## 🏁 How to Start & Run

### Quick Start on Windows:
Double-click `start.bat` in this folder, or run:
```powershell
& "C:\Users\DELL\AppData\Roaming\Antigravity\bin\agy-node.cmd" server.js
```
*(Or standard `node server.js` if Node is in your system PATH).*

The server will start on `http://localhost:3000`.

---

## ⚙️ Connecting Live Flutterwave & Email Delivery

1. Open your secret admin link: `http://localhost:3000/zol-portal-access`
2. Enter passcode `Zolutions2026!`
3. Navigate to the **Store Settings** tab:
   - **Flutterwave:** Paste your `Public Key` and `Secret Key` from your [Flutterwave Dashboard](https://dashboard.flutterwave.com). Set Test Mode to *Disabled* when ready for live payments.
   - **Email Receipt:** Select *Resend API* and paste your API key from [resend.com](https://resend.com) (free 3,000 emails/month). Set your sender email address.
   - **Security:** You can change the secret admin path (e.g. to `my-secret-zol-manager`) and change the admin passcode anytime.
4. Click **Save All Settings**.
