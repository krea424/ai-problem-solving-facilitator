import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://frqbzniqkboufmhkpzxy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZycWJ6bmlxa2JvdWZtaGtwenh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTIxODYsImV4cCI6MjA2NzI4ODE4Nn0.Irobsjnz-DIEWRnQNPdmUN5GrXUtBA3vJ5wUwqhewqc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 