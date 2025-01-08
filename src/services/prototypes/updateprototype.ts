import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { PrototypeInput } from '../../types/prototype';
import toast from 'react-hot-toast';

export async function updatePrototype(id: string, input: PrototypeInput, user: User | null) {
  if (!user) {
    toast.error('You must be logged in to update a prototype');
    return { prototype: null, error: new Error('Not authenticated') };
  }

  try {
    // First verify the prototype exists and user has permission
    const { data: existing, error: checkError } = await supabase
      .from('prototypes')
      .select('id')
      .eq('id', id)
      .eq('author_id', user.id)
      .single();

    if (checkError || !existing) {
      throw new Error('Prototype not found or permission denied');
    }

    // Update main prototype data
    const { data: prototype, error: updateError } = await supabase
      .from('prototypes')
      .update({
        title: input.title,
        description: input.description,
        image_url: input.image_url,
        preview_url: input.preview_url,
        source_code_url: input.source_code_url,
        category: input.category,
        credit_price: input.credit_price,
        tags: input.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    // Delete existing related data
    await Promise.all([
      supabase.from('prototype_features').delete().eq('prototype_id', id),
      supabase.from('prototype_requirements').delete().eq('prototype_id', id),
      supabase.from('prototype_getting_started').delete().eq('prototype_id', id),
    ]);

    // Insert new related data
    const insertPromises = [];

    if (input.features.length > 0) {
      insertPromises.push(
        supabase.from('prototype_features').insert(
          input.features.map(feature => ({
            prototype_id: id,
            feature
          }))
        )
      );
    }

    if (input.requirements.length > 0) {
      insertPromises.push(
        supabase.from('prototype_requirements').insert(
          input.requirements.map(requirement => ({
            prototype_id: id,
            requirement
          }))
        )
      );
    }

    if (input.getting_started.length > 0) {
      insertPromises.push(
        supabase.from('prototype_getting_started').insert(
          input.getting_started.map((step, index) => ({
            prototype_id: id,
            step,
            order_index: index
          }))
        )
      );
    }

    await Promise.all(insertPromises);

    toast.success('Prototype updated successfully');
    return { prototype, error: null };
  } catch (error) {
    console.error('Error updating prototype:', error);
    toast.error('Failed to update prototype');
    return { prototype: null, error };
  }
}