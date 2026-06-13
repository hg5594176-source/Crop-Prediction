/* ============================================================
   SUPABASE-CONFIG.JS
   ⚠ Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY
     with values from your Supabase project settings.
   ============================================================ */

const SUPABASE_URL = 'https://yfqegebigiuvgaturiko.supabase.co';       // e.g. https://xyzabc.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmcWVnZWJpZ2l1dmdhdHVyaWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzgwMjAsImV4cCI6MjA5Njg1NDAyMH0.xtEY12ULrMH7Avh267GzlMY1KpqNPQ3u9h6kfkFxCcY';  // from Settings > API > anon/public


// Initialize Supabase client (uses global `supabase` from CDN)
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,        // keep user logged in across page reloads
    autoRefreshToken: true,
  }
});
