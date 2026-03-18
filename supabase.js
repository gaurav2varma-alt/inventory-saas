const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://mwzqxkoabopkfchtaedw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_CmhG8xtsCMz5djmCxJjtYQ_khBkQDdz";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

module.exports = supabase