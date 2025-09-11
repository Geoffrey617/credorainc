// Test Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lzpeggbbytjgeoumomsg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGVnZ2JieXRqZ2VvdW1vbXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MTUyODIsImV4cCI6MjA3MzA5MTI4Mn0.SVZhcJD2Mw2IatKjdntW_6F54j1XzkEdMIXpHL8O4fw'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
async function testConnection() {
  console.log('🧪 Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1)
    
    if (error) {
      console.log('❌ Error (expected - no tables yet):', error.message)
    } else {
      console.log('✅ Connection successful!')
      console.log('📊 Data:', data)
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message)
  }
}

testConnection()
