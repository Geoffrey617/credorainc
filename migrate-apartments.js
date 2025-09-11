// Migrate apartment listings to Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lzpeggbbytjgeoumomsg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGVnZ2JieXRqZ2VvdW1vbXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MTUyODIsImV4cCI6MjA3MzA5MTI4Mn0.SVZhcJD2Mw2IatKjdntW_6F54j1XzkEdMIXpHL8O4fw'

const supabase = createClient(supabaseUrl, supabaseKey)

// Your existing apartment data from localStorage (removing id field - Supabase will auto-generate)
const apartments = [
  {
    title: "Idyl Fenway",
    address: "1282 Boylston Street",
    city: "Boston",
    state: "MA",
    zip_code: "02215",
    neighborhood: "Fenway",
    description: "Modern luxury apartment in the heart of Fenway",
    price: 3500,
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 850,
    images: ["idyl-fenway-1.jpg", "idyl-fenway-2.jpg"],
    amenities: ["Gym", "Rooftop Deck", "Concierge"],
    contact_phone: "(617) 536-9510",
    contact_email: "leasing@idylfenway.com",
    website: "https://www.idylfenway.com",
    apply_url: "https://www.idylfenway.com/apply",
    verified: true
  },
  {
    id: "the-q-topanga",
    title: "The Q Topanga",
    address: "6320 Canoga Ave",
    city: "Woodland Hills", 
    state: "CA",
    price: 2800,
    bedrooms: 1,
    bathrooms: 1,
    verified: true
  },
  {
    id: "outpost-club-east-harlem",
    title: "Outpost Club East Harlem",
    address: "520 E 117th St",
    city: "New York",
    state: "NY", 
    price: 1200,
    bedrooms: 1,
    bathrooms: 1,
    verified: true
  },
  {
    id: "the-point-at-ridgeline",
    title: "The Point at Ridgeline",
    address: "1000 Ridgeline Blvd",
    city: "Highlands Ranch",
    state: "CO",
    price: 2200,
    bedrooms: 2,
    bathrooms: 2,
    verified: true
  },
  {
    id: "rise-red-mountain",
    title: "Rise Red Mountain",
    address: "3661 Independence Dr",
    city: "Homewood",
    state: "AL",
    price: 1800,
    bedrooms: 2,
    bathrooms: 2,
    verified: true
  },
  {
    id: "tributary-rise",
    title: "Tributary Rise",
    address: "2800 Tributary Rise Ln",
    city: "Birmingham",
    state: "AL",
    price: 1600,
    bedrooms: 1,
    bathrooms: 1,
    verified: true
  },
  {
    id: "apex-hoover",
    title: "Apex Hoover",
    address: "3900 Crossings Blvd",
    city: "Hoover",
    state: "AL",
    price: 1750,
    bedrooms: 2,
    bathrooms: 2,
    verified: true
  },
  {
    id: "riverchase-landing",
    title: "Riverchase Landing",
    address: "3661 Lorna Rd",
    city: "Hoover",
    state: "AL",
    price: 1650,
    bedrooms: 1,
    bathrooms: 1,
    verified: true
  },
  {
    id: "the-onyx-hoover",
    title: "The Onyx Hoover",
    address: "4500 Creekside Ave",
    city: "Hoover",
    state: "AL",
    price: 1900,
    bedrooms: 2,
    bathrooms: 2,
    verified: true
  },
  {
    id: "the-whitby-birmingham",
    title: "The Whitby Birmingham",
    address: "2208 5th Ave N",
    city: "Birmingham",
    state: "AL",
    price: 1550,
    bedrooms: 1,
    bathrooms: 1,
    verified: true
  },
  {
    id: "the-landing-on-emerald-pointe",
    title: "The Landing on Emerald Pointe",
    address: "1901 Emerald Pointe Dr",
    city: "Birmingham",
    state: "AL",
    price: 1400,
    bedrooms: 1,
    bathrooms: 1,
    verified: true
  },
  {
    id: "colony-woods",
    title: "Colony Woods",
    address: "4600 Colony Woods Dr",
    city: "Birmingham",
    state: "AL",
    price: 1300,
    bedrooms: 1,
    bathrooms: 1,
    verified: true
  },
  {
    id: "wildforest-apartments",
    title: "Wildforest Apartments",
    address: "1600 Wildforest Dr",
    city: "Birmingham",
    state: "AL",
    price: 1200,
    bedrooms: 1,
    bathrooms: 1,
    verified: true
  }
];

async function migrateApartments() {
  console.log('🏠 Migrating apartment listings to Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('apartments')
      .insert(apartments)
      .select()

    if (error) {
      console.error('❌ Migration failed:', error)
    } else {
      console.log('✅ Migration successful!')
      console.log(`📊 Migrated ${data.length} apartments`)
      console.log('🏠 Apartments in database:', data.map(apt => apt.title))
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

migrateApartments()
