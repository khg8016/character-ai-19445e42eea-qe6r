import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthContext';
import type { Prototype } from '../types/prototype';

interface PurchasedPrototype extends Prototype {
  purchased_at: string;
}

export function usePurchasedPrototypes() {
  const { user } = useAuth();
  const [prototypes, setPrototypes] = useState<PurchasedPrototype[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchPurchasedPrototypes() {
      try {
        const { data, error } = await supabase
          .from('purchased_prototypes')
          .select(`
            purchased_at,
            prototype:prototypes (
              id,
              title,
              description,
              image_url,
              source_code_url,
              author:profiles!prototypes_author_id_fkey (
                id,
                display_id,
                full_name,
                avatar_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false });

        if (error) throw error;

        const formattedPrototypes = data.map(item => ({
          id: item.prototype.id,
          title: item.prototype.title,
          description: item.prototype.description,
          image: item.prototype.image_url,
          source_code_url: item.prototype.source_code_url,
          author: {
            id: item.prototype.author.id,
            name: item.prototype.author.full_name || item.prototype.author.display_id,
            avatar: item.prototype.author.avatar_url
          },
          purchased_at: item.purchased_at
        }));

        setPrototypes(formattedPrototypes);
      } catch (error) {
        console.error('Error fetching purchased prototypes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPurchasedPrototypes();
  }, [user]);

  return { prototypes, loading };
}