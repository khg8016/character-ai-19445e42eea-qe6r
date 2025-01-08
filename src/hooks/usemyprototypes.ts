import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthContext';
import type { Prototype } from '../types/prototype';

interface MyPrototype extends Prototype {
  views: number;
  purchases: number;
  created_at: string;
}

export function useMyPrototypes() {
  const { user } = useAuth();
  const [prototypes, setPrototypes] = useState<MyPrototype[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrototypes = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prototypes')
        .select(`
          *,
          purchases:purchased_prototypes(count),
          author:profiles!prototypes_author_id_fkey (
            id,
            display_id,
            full_name,
            avatar_url
          )
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPrototypes = data.map(prototype => ({
        id: prototype.id,
        title: prototype.title,
        description: prototype.description,
        image: prototype.image_url,
        preview_url: prototype.preview_url,
        source_code_url: prototype.source_code_url,
        category: prototype.category,
        creditPrice: prototype.credit_price,
        author: {
          id: prototype.author.id,
          name: prototype.author.full_name || prototype.author.display_id,
          avatar: prototype.author.avatar_url
        },
        tags: prototype.tags,
        views: prototype.views || 0,
        purchases: prototype.purchases[0]?.count || 0,
        created_at: prototype.created_at
      }));

      setPrototypes(formattedPrototypes);
    } catch (error) {
      console.error('Error fetching my prototypes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPrototypes();
  }, [fetchPrototypes]);

  return { 
    prototypes, 
    loading,
    refreshPrototypes: fetchPrototypes 
  };
}