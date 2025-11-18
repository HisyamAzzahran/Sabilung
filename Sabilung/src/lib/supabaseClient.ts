import { createClient } from "@supabase/supabase-js";

const FALLBACK_URL = "https://axugejhyqjwwjygxsdgp.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dWdlamh5cWp3d2p5Z3hzZGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDI3MTQsImV4cCI6MjA3OTAxODcxNH0.-rounS_L5EbHxTmQfqRDs3aaeC0ygcU2Yj0FMj2JIIM";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});
