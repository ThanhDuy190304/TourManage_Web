const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://iqwrriaudyyhtunszfxh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxd3JyaWF1ZHl5aHR1bnN6ZnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTkxNzQsImV4cCI6MjA1MjI3NTE3NH0.1RXhPgtwWpH_Tt-cYeXY7kfhiw5dlzPQR0c02L62XQc';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;