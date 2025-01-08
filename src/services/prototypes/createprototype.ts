import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { PrototypeInput } from '../../types/prototype';
import toast from 'react-hot-toast';

export async function createPrototype(input: PrototypeInput, user: User | null) {
  if (!user) {
    toast.error('You must be logged in to create a prototype');
    return { prototype: null, error: new Error('Not authenticated') };
  }

  try {
    const { data: prototype, error: prototypeError } = await supabase
      .from('prototypes')
      .insert([{
        title: input.title,
        description: input.description,
        image_url: input.image_url,
        preview_url: input.preview_url,
        source_code_url: input.source_code_url,
        category: input.category,
        credit_price: input.credit_price,
        author_id: user.id,
        tags: input.tags,
      }])
      .select()
      .single();

    if (prototypeError) throw prototypeError;

    // Insert related data
    const insertPromises = [];

    if (input.features.length > 0) {
      insertPromises.push(
        supabase.from('prototype_features').insert(
          input.features.map(feature => ({
            prototype_id: prototype.id,
            feature
          }))
        )
      );
    }

    if (input.requirements.length > 0) {
      insertPromises.push(
        supabase.from('prototype_requirements').insert(
          input.requirements.map(requirement => ({
            prototype_id: prototype.id,
            requirement
          }))
        )
      );
    }

    if (input.getting_started.length > 0) {
      insertPromises.push(
        supabase.from('prototype_getting_started').insert(
          input.getting_started.map((step, index) => ({
            prototype_id: prototype.id,
            step,
            order_index: index
          }))
        )
      );
    }

    await Promise.all(insertPromises);

    toast.success('Prototype created successfully');
    return { prototype, error: null };
  } catch (error) {
    console.error('Error creating prototype:', error);
    toast.error('Failed to create prototype');
    return { prototype: null, error };
  }
}