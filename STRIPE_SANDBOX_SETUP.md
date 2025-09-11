# 🧪 Stripe Sandbox Setup Guide

## 🚀 Quick Setup (2 minutes)

### 1. Get Your Stripe Test Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in the top left)
3. Copy these keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 2. Create Environment File
Create `.env.local` in your project root:

```bash
# Stripe Test Configuration (Sandbox)
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
STRIPE_MODE=test
```

### 3. Replace the Keys
Replace `YOUR_PUBLISHABLE_KEY_HERE` and `YOUR_SECRET_KEY_HERE` with your actual test keys from Stripe.

## 💳 Test Cards for Sandbox

### ✅ **Successful Payments:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

### ❌ **Declined Payments:**
```
Card: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

### 💰 **Insufficient Funds:**
```
Card: 4000 0000 0000 9995
Expiry: Any future date
CVC: Any 3 digits
```

## 🧪 **Testing Your 3 Payment Pages:**

### **1. Application Payment ($99)**
- URL: `http://localhost:3001/apply/payment`
- Test with: `4242 4242 4242 4242`
- Should redirect to `/apply/review` on success

### **2. Apartment Finder Payment ($250)**
- URL: `http://localhost:3001/apartment-finder/payment?requestId=test123`
- Test with: `4242 4242 4242 4242`
- Should redirect to `/apartment-finder/track` on success

### **3. Landlord Subscription ($20/$60)**
- URL: `http://localhost:3001/landlords/settings`
- Click "Subscribe to Premium" → Payment modal opens
- Test with: `4242 4242 4242 4242`
- Should update subscription status

## 🔍 **Monitoring Payments**

### **Stripe Dashboard:**
- Go to [Payments](https://dashboard.stripe.com/test/payments)
- See all test transactions in real-time
- View payment details and metadata

### **Browser Console:**
- Open DevTools → Console
- Look for payment success logs with Payment Intent IDs
- Check localStorage for payment data

## ⚠️ **Important Notes:**

1. **Test Mode Only**: These keys only work in test mode
2. **No Real Money**: Test payments don't charge real cards
3. **Webhook Optional**: For testing, webhooks aren't required
4. **Environment**: Restart your dev server after adding `.env.local`

## 🚨 **Security Reminder:**
- Never commit `.env.local` to git
- Keep test and live keys separate
- Test keys start with `pk_test_` and `sk_test_`
