#!/bin/bash

echo "Setting up .env.local file for OAuth authentication..."

cat > .env.local << 'EOF'
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=SfL297mvRAIj6XJ7TgWJJOOeFuV+U31rzIpZ6o7kvEU=

# Google OAuth - Fill these in after setting up Google Cloud Console
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Microsoft Azure AD OAuth - Fill these in after setting up Azure Portal
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=common

# Apple OAuth - Fill these in after setting up Apple Developer account
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Live Chat Configuration (optional)
TAWK_TO_PROPERTY_ID=
TAWK_TO_WIDGET_ID=
EOF

echo "✅ Created .env.local file with NextAuth secret!"
echo "📝 Now follow the OAuth setup guide to fill in the provider credentials."
echo "📖 See OAUTH_SETUP_GUIDE.md for detailed instructions."
