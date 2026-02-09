import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://psdyafuhrjvnorsysfqa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZHlhZnVocmp2bm9yc3lzZnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTQ1OTgsImV4cCI6MjA4NTAzMDU5OH0.kAqC7SBO8q5nZV06BFJDzEKG95kqRqcbC3xGXnGrYyA';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
