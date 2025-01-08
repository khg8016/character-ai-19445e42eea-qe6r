import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Prototype } from '../types/prototype';

export function usePrototypes() {
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrototypes = useCallback(async () => {
    setLoading(true);
    try {
      const { data: prototypesData, error: prototypesError } = await supabase
        .from('prototypes')
        .select(`
          *,
          author:profiles!prototypes_author_id_fkey (
            id,
            display_id,
            full_name,
            avatar_url
          ),
          features:prototype_features(feature),
          requirements:prototype_requirements(requirement),
          getting_started:prototype_getting_started(step, order_index)
        `)
        .order('created_at', { ascending: false });

      if (prototypesError) throw prototypesError;

      const formattedPrototypes = prototypesData.map(prototype => ({
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
          name: prototype.author?.full_name || prototype.author?.display_id || 'Unknown',
          avatar: prototype.author?.avatar_url || 
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${prototype.author?.id}`,
        },
        tags: prototype.tags || [],
        features: prototype.features?.map(f => f.feature) || [],
        requirements: prototype.requirements?.map(r => r.requirement) || [],
        gettingStarted: prototype.getting_started
          ?.sort((a, b) => a.order_index - b.order_index)
          .map(s => s.step) || [],
      }));

      setPrototypes(formattedPrototypes);
      setError(null);
      return { data: formattedPrototypes, error: null };
    } catch (err) {
      console.error('Error fetching prototypes:', err);
      const error = err instanceof Error ? err : new Error('Failed to fetch prototypes');
      setError(error);
      return { data: [], error };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel('prototypes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prototypes'
        },
        () => {
          fetchPrototypes();
        }
      )
      .subscribe();

    fetchPrototypes();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPrototypes]);

  return {
    prototypes,
    loading,
    error,
    refreshPrototypes: fetchPrototypes,
  };
}