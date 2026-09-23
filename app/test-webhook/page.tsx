
// app/test-webhook/page.tsx
'use client'

import { useState } from 'react';

// Define the type for webhook result
interface WebhookResult {
  success: boolean;
  data?: any;
  error?: string;
  warning?: boolean;
}

export default function TestWebhookPage() {
  const [result, setResult] = useState<WebhookResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const testWebhook = async () => {
    setLoading(true);
    try {
      // Test with sample data
      const testData = {
        title: 'Test Product - iPhone 13',
        description: 'This is a test product to verify email notifications',
        category: 'Electronics',
        brand: 'Apple',
        condition: 'Like New',
        price: 899.99,
        discount: 10,
        deliveryType: 'self',
        paymentMethod: 'mtn',
        tags: ['test', 'iphone', 'apple'],
        imageUrls: [],
        confidence: 0.95
      };

      const testSeller = {
        sellerName: 'Test User',
        sellerEmail: email || 'test@example.com',
        sellerPhone: '+233 123 456 789',
        userType: 'student',
        location: 'Test Campus'
      };

      // Use the webhook service from your Lister component
      const webhookService = {
        sendListingNotification: async (listingData: any, sellerData: any) => {
          const ADMIN_WEBHOOK_URL = 'https://unimart-admin-ecru.vercel.app/';
          
          try {
            const tags = Array.isArray(listingData.tags) ? listingData.tags : (listingData.tags ? [listingData.tags] : []);
            const imageUrls = Array.isArray(listingData.imageUrls) ? listingData.imageUrls : (listingData.imageUrls ? [listingData.imageUrls] : []);
            
            const payload = {
              event: 'listing_submission',
              source: 'unimart-listing',
              submitted_at: new Date().toISOString(),
              seller: {
                name: sellerData.sellerName,
                email: sellerData.sellerEmail,
                phone: sellerData.sellerPhone,
                type: sellerData.userType,
                location: sellerData.location,
              },
              product: {
                title: listingData.title,
                description: listingData.description,
                category: listingData.category,
                brand: listingData.brand,
                condition: listingData.condition,
                price: Number(listingData.price) || 0,
                discount: Number(listingData.discount) || 0,
                edition: listingData.edition,
                deliveryType: listingData.deliveryType,
                paymentMethod: listingData.paymentMethod,
                tags,
                imageUrls,
                status: 'pending',
              },
              metadata: {
                image_count: imageUrls.length,
                confidence_score: Number(listingData.confidence) || 0,
                listing_url: listingData.listingUrl || '',
              }
            };

            console.log('📤 Sending admin webhook notification...');
            
            const response = await fetch(ADMIN_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            if (data.status === 'success') {
              console.log('✅ Webhook sent successfully:', data);
              return { success: true, data };
            } else {
              console.warn('⚠️ Webhook responded but may not be configured correctly:', data);
              return { success: true, warning: true, data };
            }
          } catch (error) {
            console.error('❌ Webhook error:', error);
            return { 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            };
          }
        }
      };

      const result = await webhookService.sendListingNotification(testData, testSeller);
      setResult(result);
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>📧 Test Zapier Webhook</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Test Email Address:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to receive test notification"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '10px'
          }}
        />
      </div>

      <button
        onClick={testWebhook}
        disabled={loading}
        style={{
          padding: '12px 24px',
          background: '#FF6A00',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Sending...' : 'Send Test Webhook'}
      </button>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          color: result.success ? '#155724' : '#721c24'
        }}>
          <h3 style={{ marginBottom: '10px' }}>
            {result.success ? '✅ Success!' : '❌ Failed'}
          </h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
        <h3 style={{ marginBottom: '10px' }}>📋 What happens when you submit:</h3>
        <ol style={{ marginLeft: '20px' }}>
          <li>Listing is saved to MongoDB</li>
          <li>Zapier webhook is triggered automatically</li>
          <li>Seller receives email confirmation</li>
          <li>Email includes product details and next steps</li>
        </ol>
      </div>
    </div>
  );
}