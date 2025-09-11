# Idyl Boston Image Replacement Guide

## 📸 **Current Status**
- **Heritage House (ID: 1)**: ✅ Real images uploaded and working
- **Idyl Boston (ID: 2)**: 🔄 Ready for real image replacement

## 🎯 **Next Steps for Idyl Boston Images**

### **Step 1: Download Real Images**
Visit: https://www.apartments.com/idyl-boston-ma/nzjrjtp/

**Download these specific images:**
1. **Main exterior** - Building front/entrance
2. **Interior apartment** - Living room/kitchen
3. **Amenities** - Gym, rooftop, or lobby
4. **Rooftop/outdoor** - Terrace or outdoor spaces

### **Step 2: Save Images to Folder**
Save downloaded images to: `/public/images/apartments/idyl-boston/`

**Recommended filenames:**
- `main-exterior.jpg` (main building photo)
- `interior-1.jpg` (apartment interior)
- `amenities.jpg` (gym/lobby)
- `rooftop.jpg` (outdoor spaces)

### **Step 3: Current Code Integration**
The code is already set up to use these images:

```javascript
// In mockApartments array (ID: 2)
imageUrl: '/images/apartments/idyl-boston/main-exterior.jpg',
images: [
  '/images/apartments/idyl-boston/main-exterior.jpg',
  '/images/apartments/idyl-boston/interior-1.jpg', 
  '/images/apartments/idyl-boston/amenities.jpg',
  '/images/apartments/idyl-boston/rooftop.jpg'
]
```

### **Step 4: Testing**
After replacing images:
1. Visit: `http://localhost:3000/apartments/2`
2. Check main image loads properly
3. Test image gallery navigation
4. Verify unit detail pages show correct images

## 🚀 **Ready for Next Listing**
Once Idyl Boston images are updated, we'll add the third apartment listing!

### **Suggested Third Listing Options:**
1. **The Millennium** (Hollywood) - ID: 3
2. **Barton Springs Commons** (Austin) - ID: 4  
3. **The Summit** (Seattle) - ID: 5

Choose which listing you'd like to add next!
