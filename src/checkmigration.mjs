import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://blucsjdnajosezzatnsf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdWNzamRuYWpvc2V6emF0bnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5OTg3ODEsImV4cCI6MjA1MTU3NDc4MX0.4Wp3UiyMRtXxbOf9KbcbzBafBLUcnMb_9FEl5SRs6JI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMigration() {
  try {
    // Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('Error checking profiles table:', profilesError);
      return;
    }

    console.log('Profiles table exists:', profiles !== null);

    // Check prototypes table
    const { data: prototypes, error: prototypesError } = await supabase
      .from('prototypes')
      .select('*')
      .limit(1);

    if (prototypesError) {
      console.error('Error checking prototypes table:', prototypesError);
      return;
    }

    console.log('Prototypes table exists:', prototypes !== null);

    // Check related tables
    const tables = [
      'prototype_features',
      'prototype_requirements',
      'prototype_getting_started'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.error(`Error checking ${table} table:`, error);
        continue;
      }

      console.log(`${table} table exists:`, data !== null);
    }

  } catch (error) {
    console.error('Error checking migration status:', error);
  }
}

checkMigration();