// Complete apartment migration script
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lzpeggbbytjgeoumomsg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGVnZ2JieXRqZ2VvdW1vbXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MTUyODIsImV4cCI6MjA3MzA5MTI4Mn0.SVZhcJD2Mw2IatKjdntW_6F54j1XzkEdMIXpHL8O4fw'

const supabase = createClient(supabaseUrl, supabaseKey)

// All apartment listings (IDs removed - Supabase will auto-generate)
const apartments = [
  {
    title: "Idyl Fenway",
    building_name: "Idyl Fenway",
    address: "1282 Boylston Street",
    city: "Boston",
    state: "MA",
    zip_code: "02215",
    neighborhood: "Fenway",
    description: "Modern luxury apartment in the heart of Fenway with premium amenities",
    price: 3500,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 850,
    images: ["/apartments/idyl-fenway-1.jpg", "/apartments/idyl-fenway-2.jpg"],
    amenities: ["Gym", "Rooftop Deck", "Concierge", "In-unit Laundry"],
    contact_phone: "(617) 536-9510",
    contact_email: "leasing@idylfenway.com",
    website: "https://www.idylfenway.com",
    apply_url: "https://www.idylfenway.com/apply",
    verified: true,
    property_type: "Apartment",
    available_date: "2024-01-01",
    pet_friendly: true,
    parking: true
  },
  {
    title: "The Q Topanga",
    building_name: "The Q Topanga", 
    address: "6320 Canoga Ave",
    city: "Woodland Hills",
    state: "CA",
    zip_code: "91367",
    neighborhood: "Woodland Hills",
    description: "Luxury apartment community in the heart of Woodland Hills",
    price: 2800,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 750,
    images: ["/apartments/q-topanga-1.jpg", "/apartments/q-topanga-2.jpg"],
    amenities: ["Pool", "Gym", "Spa", "Business Center"],
    contact_phone: "(818) 346-4627",
    contact_email: "leasing@theqtopanga.com",
    website: "https://www.theqtopanga.com",
    apply_url: "https://www.theqtopanga.com/apply",
    verified: true,
    property_type: "Apartment",
    available_date: "2024-02-01",
    pet_friendly: true,
    parking: true
  },
  {
    title: "Outpost Club East Harlem",
    building_name: "Outpost Club East Harlem",
    address: "1760 Lexington Ave",
    city: "New York",
    state: "NY", 
    zip_code: "10029",
    neighborhood: "East Harlem",
    description: "Co-living spaces in vibrant East Harlem with modern amenities",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 400,
    images: ["/apartments/outpost-harlem-1.jpg", "/apartments/outpost-harlem-2.jpg"],
    amenities: ["Co-working Space", "Rooftop", "Gym", "Community Events"],
    contact_phone: "(646) 517-0555",
    contact_email: "hello@outpost-club.com",
    website: "https://www.outpost-club.com",
    apply_url: "https://www.outpost-club.com/apply",
    verified: true,
    property_type: "Co-living",
    available_date: "2024-01-15",
    pet_friendly: false,
    parking: false
  },
  {
    title: "Heritage House",
    building_name: "Heritage House",
    address: "1000 W 15th St",
    city: "Chicago",
    state: "IL",
    zip_code: "60608",
    neighborhood: "Near West Side", 
    description: "Historic building converted to modern apartments near downtown Chicago",
    price: 2200,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 650,
    images: ["/apartments/heritage-house-1.jpg", "/apartments/heritage-house-2.jpg"],
    amenities: ["Gym", "Rooftop Deck", "Bike Storage", "Package Service"],
    contact_phone: "(312) 666-3700",
    contact_email: "leasing@heritagehousechicago.com",
    website: "https://www.heritagehousechicago.com",
    apply_url: "https://www.heritagehousechicago.com/apply",
    verified: true,
    property_type: "Apartment",
    available_date: "2024-03-01",
    pet_friendly: true,
    parking: true
  },
  {
    title: "The Whitby Birmingham",
    building_name: "The Whitby Birmingham",
    address: "2001 Park Pl N",
    city: "Birmingham", 
    state: "AL",
    zip_code: "35203",
    neighborhood: "Avondale",
    description: "Modern luxury apartments in Birmingham's trendy Avondale district",
    price: 1500,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 700,
    images: ["/apartments/whitby-birmingham-1.jpg", "/apartments/whitby-birmingham-2.jpg"],
    amenities: ["Pool", "Gym", "Dog Park", "Clubhouse"],
    contact_phone: "(205) 777-8400",
    contact_email: "leasing@thewhitbybirmingham.com", 
    website: "https://www.thewhitbybirmingham.com",
    apply_url: "https://www.thewhitbybirmingham.com/apply",
    verified: true,
    property_type: "Apartment",
    available_date: "2024-04-01",
    pet_friendly: true,
    parking: true
  },
  {
    title: "The Landing on Emerald Pointe",
    building_name: "The Landing on Emerald Pointe",
    address: "5901 Emerald Pointe Dr",
    city: "Birmingham",
    state: "AL", 
    zip_code: "35235",
    neighborhood: "Emerald Pointe",
    description: "Waterfront apartment community with lake views and resort-style amenities",
    price: 1200,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 650,
    images: ["/apartments/landing-emerald-1.jpg", "/apartments/landing-emerald-2.jpg"],
    amenities: ["Lake Access", "Pool", "Tennis Court", "Clubhouse"],
    contact_phone: "(205) 833-8300",
    contact_email: "info@emeraldcityassociates.com",
    website: "https://emeraldcityassociates.appfolio.com",
    apply_url: "https://emeraldcityassociates.appfolio.com/listings/detail/cd5bd834-7d00-4fe0-abc2-8f8c356f16a6",
    verified: true,
    property_type: "Apartment",
    available_date: "2024-05-01",
    pet_friendly: true,
    parking: true
  },
  {
    title: "Wildforest Apartments",
    building_name: "Wildforest Apartments", 
    address: "3901 Wildforest Dr",
    city: "Birmingham",
    state: "AL",
    zip_code: "35244",
    neighborhood: "Hoover",
    description: "Peaceful apartment community in Hoover with spacious floor plans",
    price: 1100,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 600,
    images: ["/apartments/wildforest-1.jpg", "/apartments/wildforest-2.jpg"],
    amenities: ["Pool", "Playground", "Laundry Facility", "Parking"],
    contact_phone: "(205) 988-3612",
    contact_email: "wildforest@rentals.com",
    website: "https://www.wildforestapartments.com", 
    apply_url: "https://www.wildforestapartments.com/apply",
    verified: true,
    property_type: "Apartment",
    available_date: "2024-06-01",
    pet_friendly: true,
    parking: true
  },
  {
    title: "Colony Woods",
    building_name: "Colony Woods",
    address: "1201 Colony Woods Dr",
    city: "Birmingham",
    state: "AL",
    zip_code: "35226", 
    neighborhood: "Vestavia Hills",
    description: "Luxury apartment community in prestigious Vestavia Hills location",
    price: 1400,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 750,
    images: ["/apartments/colony-woods-1.jpg", "/apartments/colony-woods-2.jpg"],
    amenities: ["Pool", "Gym", "Tennis Court", "Clubhouse"],
    contact_phone: "(844) 730-3277",
    contact_email: "leasing@colonywoodsbirmingham.com",
    website: "https://www.colonywoodsbirmingham.com",
    apply_url: "https://www.colonywoodsbirmingham.com/apply",
    verified: true,
    property_type: "Apartment", 
    available_date: "2024-07-01",
    pet_friendly: true,
    parking: true
  }
]

async function migrateApartments() {
  console.log('🏠 Migrating all apartment listings to Supabase...')
  
  try {
    // Clear existing test data first
    await supabase.from('apartments').delete().neq('id', 0)
    console.log('🗑️  Cleared existing test data')
    
    // Insert all apartments
    const { data, error } = await supabase
      .from('apartments')
      .insert(apartments)
      .select()

    if (error) {
      console.error('❌ Migration failed:', error)
      return
    }

    console.log('✅ Migration successful!')
    console.log(`📊 Inserted ${data.length} apartments:`)
    
    data.forEach((apt, index) => {
      console.log(`${index + 1}. ${apt.title} (ID: ${apt.id}) - $${apt.price}`)
    })
    
    console.log('\n🎉 All apartment listings are now in your Supabase database!')
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
  }
}

migrateApartments()
