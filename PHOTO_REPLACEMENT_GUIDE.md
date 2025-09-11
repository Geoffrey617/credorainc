# 📸 Heritage House Photo Replacement Guide

## 🎯 **Quick Setup Instructions**

### **Step 1: Download Photos from Apartments.com**
1. Visit: https://www.apartments.com/heritage-house-by-outpost-new-york-ny/wxgrrzh/#wxgrrzh-0-photos
2. Right-click on each photo and select "Save image as..."
3. Download the key photos you want to use

### **Step 2: Replace Placeholder Images**
Navigate to: `/public/images/apartments/heritage-house/`

Replace these placeholder files with your downloaded photos:
- `main-exterior.jpg` - Main building exterior photo
- `interior-1.jpg` - Interior room/apartment photo
- `interior-2.jpg` - Another interior view
- `common-area.jpg` - Common area/amenity photo

### **Step 3: Add More Photos (Optional)**
To add more photos to the gallery:

1. **Save additional photos** to `/public/images/apartments/heritage-house/`
2. **Update the code** in `/src/app/apartments/[id]/page.tsx`
3. **Find this section** around line 77:
```javascript
images: [
  '/images/apartments/heritage-house/main-exterior.jpg',
  '/images/apartments/heritage-house/interior-1.jpg',
  '/images/apartments/heritage-house/interior-2.jpg',
  '/images/apartments/heritage-house/common-area.jpg'
],
```
4. **Add your new photo paths** to the array:
```javascript
images: [
  '/images/apartments/heritage-house/main-exterior.jpg',
  '/images/apartments/heritage-house/interior-1.jpg',
  '/images/apartments/heritage-house/interior-2.jpg',
  '/images/apartments/heritage-house/common-area.jpg',
  '/images/apartments/heritage-house/your-new-photo.jpg',
  // Add as many as you want!
],
```

### **Step 4: Test the Gallery**
1. Save your changes
2. Visit: `http://localhost:3000/apartments/1`
3. You should see:
   - ✅ Image gallery with navigation arrows
   - ✅ Thumbnail navigation at the bottom
   - ✅ Image counter (1/4, 2/4, etc.)
   - ✅ Smooth transitions between photos

## 🎨 **Photo Recommendations**
For best results, use photos that show:
- **Building exterior** - Main entrance/facade
- **Interior rooms** - Bedroom, living area
- **Common areas** - Kitchen, lounge, gym
- **Amenities** - Any special features

## 🚀 **What's Already Done**
✅ Photo gallery component created  
✅ Heritage House listing updated to support multiple images  
✅ Proper folder structure organized  
✅ Responsive design with thumbnails and navigation  
✅ Integration with existing apartment listing system  

**Just replace the placeholder images with your real photos and you're all set!** 📱✨
