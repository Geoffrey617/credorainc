#!/bin/bash

echo "🚀 Setting up Credora for development..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your actual values before continuing"
    echo "   - Add your DATABASE_URL"
    echo "   - Add your NEXTAUTH_SECRET"
    echo "   - Add your Stripe keys"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Generating Prisma client..."
npx prisma generate

echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your database URL and other secrets"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "Optional:"
echo "- Run 'npx prisma studio' to view your database"
echo "- Run 'npm run db:seed' to add sample data"
