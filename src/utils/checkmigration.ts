import { supabase } from '../lib/supabase';

interface TableCheck {
  name: string;
  exists: boolean;
  error?: string;
}

async function checkTable(tableName: string): Promise<TableCheck> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      return {
        name: tableName,
        exists: false,
        error: error.message
      };
    }

    return {
      name: tableName,
      exists: Array.isArray(data)
    };
  } catch (error) {
    return {
      name: tableName,
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkMigration() {
  const tables = [
    'profiles',
    'prototypes',
    'prototype_features',
    'prototype_requirements',
    'prototype_getting_started'
  ];

  console.log('Checking database migration status...\n');

  for (const table of tables) {
    const result = await checkTable(table);
    
    if (result.error) {
      console.log(`❌ ${result.name}: Failed - ${result.error}`);
    } else {
      console.log(`${result.exists ? '✅' : '❌'} ${result.name}: ${result.exists ? 'Exists' : 'Missing'}`);
    }
  }
}

checkMigration();