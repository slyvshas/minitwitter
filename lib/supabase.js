// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xjfhehnjgybotbvdtpoo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqZmhlaG5qZ3lib3RidmR0cG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTIzMTMsImV4cCI6MjA2MzQ2ODMxM30.ei13tgCf8OIxAxu5c4VaYrQC3eE3coBSz8MaWwu-QI8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
