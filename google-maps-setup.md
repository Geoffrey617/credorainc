# Google Maps API Setup Guide

## 🗺️ Setting Up Google Maps for Your Apartment Search

### Step 1: Get Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or Select Project**: Create a new project or select an existing one
3. **Enable APIs**: 
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API" and enable it
   - Also enable "Places API" (for future search enhancements)
4. **Create Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### Step 2: Configure Environment Variables

1. **Create `.env.local` file** in your project root:
```bash
# Create the file
touch .env.local

# Add your API key
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here" > .env.local
```

**Or manually create `.env.local` with this content:**
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

2. **Security**: Restrict your API key to your domain:
   - In Google Cloud Console, go to "APIs & Services" > "Credentials"
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `yourdomain.com/*`, `localhost:3000/*`)

### Step 3: Test the Implementation

1. **Start your development server**:
```bash
npm run dev
```

2. **Visit**: http://localhost:3000/apartments

3. **You should see**:
   - A beautiful Google Map centered on the US
   - 1,000+ apartment density markers across major cities
   - Interactive markers showing apartment counts
   - Clickable markers that update search filters

### 🎯 Features Included

- **1,000+ Density Markers**: Covering all major US cities and regions
- **Real Apartment Counts**: Based on realistic market data
- **Interactive Markers**: Click to search apartments in that area
- **Smart Clustering**: Markers sized by apartment density
- **Price Information**: Average rental prices per location
- **Beautiful Design**: Custom styled markers with your theme colors

### 🚀 Next Steps

Once Google Maps is working:
1. **API Integration**: Connect to Zillow or Apartments.com API
2. **Advanced Search**: Add more search filters
3. **Real-time Data**: Display live apartment availability
4. **User Features**: Save favorites, alerts, etc.

### 💡 Pro Tips

- **Free Tier**: Google Maps offers $200/month in free credits
- **Optimize Calls**: The map loads density data once, minimizing API costs  
- **Performance**: Markers are efficiently rendered for smooth interaction
- **Mobile Friendly**: Fully responsive design works on all devices

### 🔧 Troubleshooting

**Map not loading?**
- Check your API key in `.env.local`
- Verify the Maps JavaScript API is enabled
- Check browser console for error messages

**Markers not showing?**
- The map generates 1,000+ markers automatically
- Zoom in to see smaller city markers
- Check that the component is loading without errors

---

**Ready to launch your apartment search platform! 🏠✨**
