const crypto = require('crypto');

class FlutterwaveService {
  /**
   * Initialize a Flutterwave checkout payment link
   */
  async createPaymentLink({ order, product, settings, redirectUrl }) {
    const isTestMode = settings.flw_test_mode === '1';
    const secretKey = settings.flw_secret_key?.trim();

    // If keys are not configured or test mode without secret key, return instant demo checkout
    if (!secretKey) {
      return {
        success: true,
        mode: 'test_simulation',
        checkout_url: `/api/payment/test-checkout?tx_ref=${encodeURIComponent(order.tx_ref)}`,
        message: 'Running in Test Simulation Mode. Configure Flutterwave Secret Key in Admin to accept live payments.'
      };
    }

    try {
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_ref: order.tx_ref,
          amount: order.amount,
          currency: order.currency || 'NGN',
          redirect_url: redirectUrl,
          customer: {
            email: order.customer_email,
            name: order.customer_name,
            phonenumber: order.customer_phone || ''
          },
          meta: {
            order_id: order.id,
            product_id: product.id
          },
          customizations: {
            title: settings.site_title || 'Zolutions',
            description: `Payment for ${product.title}`,
            logo: `${redirectUrl.split('/api')[0]}/logo.png`
          }
        })
      });

      const data = await response.json();
      if (data.status === 'success' && data.data?.link) {
        return {
          success: true,
          mode: 'flutterwave',
          checkout_url: data.data.link
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to initialize payment with Flutterwave'
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Verify Flutterwave payment by transaction ID
   */
  async verifyTransaction(transactionId, settings) {
    const secretKey = settings.flw_secret_key?.trim();
    if (!secretKey) {
      throw new Error('Flutterwave secret key is not configured');
    }

    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  }

  /**
   * Verify Flutterwave Webhook Secret Hash
   */
  verifyWebhook(reqHeaderHash, configuredHash) {
    if (!configuredHash) return true; // if no secret hash set, proceed with Caution
    return reqHeaderHash === configuredHash;
  }
}

module.exports = new FlutterwaveService();
