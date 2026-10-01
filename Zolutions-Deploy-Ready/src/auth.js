const crypto = require('crypto');
const db = require('./db');

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (!rc) return list;
  rc.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const key = parts.shift().trim();
    const value = decodeURIComponent(parts.join('='));
    list[key] = value;
  });
  return list;
}

class AuthService {
  /**
   * Get the current secret admin route slug from settings
   */
  getAdminPath() {
    const customPath = db.getSetting('admin_secret_path');
    return customPath ? customPath.trim().replace(/^\/+/, '') : 'zol-portal-access';
  }

  /**
   * Verify an admin password against stored hash
   */
  verifyPassword(inputPassword) {
    const storedHash = db.getSetting('admin_password_hash');
    const inputHash = crypto.createHash('sha256').update(inputPassword).digest('hex');
    return storedHash === inputHash;
  }

  /**
   * Update admin password
   */
  updatePassword(newPassword) {
    const hash = crypto.createHash('sha256').update(newPassword).digest('hex');
    db.setSetting('admin_password_hash', hash);
  }

  /**
   * Update secret admin route path
   */
  updateAdminPath(newPath) {
    const clean = newPath.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    db.setSetting('admin_secret_path', clean);
    return clean;
  }

  /**
   * Check if request has a valid admin session cookie
   */
  isAuthenticated(req) {
    const cookies = parseCookies(req);
    const token = cookies['zol_admin_session'];
    if (!token) return false;
    return db.verifyAdminSession(token);
  }

  /**
   * Set session cookie for admin
   */
  createSessionCookie() {
    const token = db.createAdminSession();
    // 7 days cookie
    return `zol_admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
  }

  /**
   * Clear session cookie
   */
  clearSessionCookie(req) {
    const cookies = parseCookies(req);
    const token = cookies['zol_admin_session'];
    if (token) db.deleteAdminSession(token);
    return 'zol_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
  }
}

module.exports = new AuthService();
