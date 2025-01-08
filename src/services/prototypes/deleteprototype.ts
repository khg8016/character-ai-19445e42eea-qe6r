import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export async function deletePrototype(id: string, user: User | null) {
  if (!user) {
    toast.error('You must be logged in to delete a prototype');
    return { error: new Error('Not authenticated') };
  }

  try {
    const { error } = await supabase
      .from('prototypes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success('Prototype deleted successfully');
    return { error: null };
  } catch (error) {
    console.error('Error deleting prototype:', error);
    toast.error('Failed to delete prototype');
    return { error };
  }
}