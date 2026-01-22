import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wlpqifxosgeoiofmjbsa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndscHFpZnhvc2dlb2lvZm1qYnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwODI2MjQsImV4cCI6MjA4NDY1ODYyNH0.so9319rjbYLXWA8zjYb9ZiqHAx8S8K5leH2ch8BbEo8';

export const supabase = createClient(supabaseUrl, supabaseKey);