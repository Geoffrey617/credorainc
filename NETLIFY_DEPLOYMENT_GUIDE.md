# 🚀 Netlify Deployment & DNS Setup Guide

## 📋 Step-by-Step Deployment

### 1. 🌐 Deploy to Netlify

#### **Connect Repository:**
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub/GitLab repository
4. Select your `credora` repository

#### **Build Settings (Auto-detected):**
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node.js version**: `18` (set in netlify.toml)

#### **Deploy:**
- Click "Deploy site"
- Wait for build to complete
- Get your temporary URL: `https://amazing-name-123456.netlify.app`

### 2. 🌍 Configure Custom Domain

#### **Add Your Domain:**
1. In Netlify dashboard → **Domain settings**
2. Click "Add custom domain"
3. Enter your domain: `bredora.com`
4. Click "Add domain"

#### **Set Up DNS:**
1. **Option A - Netlify DNS (Recommended):**
   - In domain settings, click "Set up Netlify DNS"
   - Copy the 4 nameservers provided
   - Update nameservers at your domain registrar
   - Wait for DNS propagation (up to 48 hours)

2. **Option B - External DNS:**
   - Point your domain's A record to Netlify's IP
   - Add CNAME for www subdomain

### 3. 📧 Configure Resend Email Domain

#### **Add Domain to Resend:**
1. Go to [resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter: `bredora.com`
4. Copy the DNS records provided

#### **Add DNS Records in Netlify:**
1. In Netlify → **Domain settings** → **DNS records**
2. Add the following records from Resend:

```dns
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Record  
Type: TXT
Name: resend._domainkey
Value: [provided by Resend - unique key]

# DMARC Record (Optional but recommended)
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@bredora.com
```

### 4. ⚙️ Environment Variables

#### **Set in Netlify Dashboard:**
1. Go to **Site settings** → **Environment variables**
2. Add the following:

```bash
# Resend Configuration
RESEND_API_KEY=re_39TvdQPL_65KwBqZZLZgq5mtGwZXF82dV

# Production URL (update with your domain)
NEXT_PUBLIC_BASE_URL=https://bredora.com

# Email sender (use your verified domain)
FROM_EMAIL=Bredora <noreply@bredora.com>
```

### 5. 🔄 Redeploy

#### **Trigger New Build:**
1. In Netlify dashboard → **Deploys**
2. Click "Trigger deploy" → "Deploy site"
3. Wait for build to complete
4. Your site is live with email functionality!

## 🧪 Testing the Email Flow

### **Test Signup Process:**
1. Go to: `https://bredora.com/auth/signup`
2. Sign up with any email address
3. Check inbox for verification email
4. Click verification link
5. Sign in successfully

### **Email Features to Test:**
- ✅ Beautiful glassmorphism email template
- ✅ Verification link functionality  
- ✅ Mobile responsive design
- ✅ Professional sender name
- ✅ Support contact information

## 🔧 Troubleshooting

### **Build Errors:**
```bash
# If build fails, check:
- Node.js version (should be 18+)
- Dependencies installed correctly
- Environment variables set
```

### **Email Not Sending:**
```bash
# Check:
- Domain verified in Resend
- DNS records propagated
- FROM_EMAIL uses verified domain
- RESEND_API_KEY is correct
```

### **API Routes 404:**
```bash
# Ensure:
- @netlify/plugin-nextjs is installed
- netlify.toml is configured correctly
- API routes are in src/app/api/ directory
```

## 📊 Performance Optimizations

### **Netlify Features:**
- ✅ **CDN**: Global content delivery
- ✅ **Edge Functions**: Fast API responses
- ✅ **Image Optimization**: Automatic image processing
- ✅ **Form Handling**: Built-in form processing
- ✅ **Analytics**: Traffic and performance insights

### **Next.js Optimizations:**
- ✅ **Static Generation**: Fast page loads
- ✅ **Image Optimization**: Disabled for static export
- ✅ **Code Splitting**: Optimized bundle sizes
- ✅ **Caching**: Efficient asset caching

## 🔒 Security Features

### **Netlify Security:**
- ✅ **HTTPS**: Automatic SSL certificates
- ✅ **Headers**: Security headers configured
- ✅ **DDoS Protection**: Built-in protection
- ✅ **Access Control**: IP restrictions available

### **Email Security:**
- ✅ **SPF**: Sender authentication
- ✅ **DKIM**: Message integrity
- ✅ **DMARC**: Policy enforcement
- ✅ **Secure Tokens**: Time-limited verification

## 🎯 Production Checklist

### **Before Launch:**
- [ ] Domain verified in Resend
- [ ] DNS records added and propagated
- [ ] Environment variables configured
- [ ] Test email flow working
- [ ] SSL certificate active
- [ ] Custom domain pointing correctly

### **After Launch:**
- [ ] Monitor email delivery rates
- [ ] Check Resend dashboard for analytics
- [ ] Test from multiple email providers
- [ ] Monitor Netlify build logs
- [ ] Set up monitoring/alerts

## 🚀 Go Live!

Once all steps are complete:

1. **Domain**: `https://bredora.com`
2. **Email**: Sending from `noreply@bredora.com`
3. **Verification**: Full email verification flow
4. **Performance**: Global CDN delivery
5. **Security**: HTTPS + email authentication

**Your professional apartment finder platform is ready for users!** 🏠✨
