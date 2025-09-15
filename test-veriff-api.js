const fetch = require('node-fetch');

const VERIFF_BASE_URL = 'https://stationapi.veriff.com';
const VERIFF_API_KEY = '4d0700ae-1bfd-48a0-83c7-a21721357034';

async function testVeriffAPI() {
  console.log('🧪 Testing Veriff API connection...');
  
  try {
    // Simple test request to create a session
    const response = await fetch(`${VERIFF_BASE_URL}/v1/sessions`, {
      method: 'POST',
      headers: {
        'X-AUTH-CLIENT': VERIFF_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        verification: {
          callback: 'https://credorainc.com/api/veriff/webhook',
          person: {
            reference: 'test-landlord-123'
          },
          vendorData: JSON.stringify({
            test: true,
            timestamp: new Date().toISOString()
          })
        }
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📊 Response body:', responseText);

    if (response.ok) {
      console.log('✅ Veriff API is working correctly!');
      const data = JSON.parse(responseText);
      console.log('🎯 Session created:', data.verification?.id);
    } else {
      console.log('❌ Veriff API error - Status:', response.status);
      console.log('❌ Error details:', responseText);
    }

  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

testVeriffAPI();
