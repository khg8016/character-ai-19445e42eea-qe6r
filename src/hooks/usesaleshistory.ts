import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthContext';

interface PrototypeSales {
  id: string;
  title: string;
  image: string;
  totalSales: number;
  totalRevenue: number;
  sales: {
    id: string;
    buyer: {
      id: string;
      name: string;
      display_id: string;
    };
    amount: number;
    purchased_at: string;
  }[];
}

export function useSalesHistory() {
  const { user } = useAuth();
  const [prototypeSales, setPrototypeSales] = useState<PrototypeSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchSalesHistory() {
      try {
        console.log('Fetching sales history...');
        
        const { data, error } = await supabase
          .from('purchased_prototypes')
          .select(`
            id,
            purchased_at,
            prototypes!inner (
              id,
              title,
              image_url,
              credit_price,
              author_id
            ),
            purchase_snapshots!inner (
              buyer_id,
              buyer_name,
              buyer_display_id
            )
          `)
          .eq('prototypes.author_id', user.id)
          .order('purchased_at', { ascending: false });

        if (error) {
          console.error('Error fetching sales:', error);
          throw error;
        }

        console.log('Raw sales data:', data);

        // 프로토타입별로 그룹화
        const salesByPrototype = data.reduce((acc, item) => {
          const prototypeId = item.prototypes.id;
          const snapshot = item.purchase_snapshots[0]; // 첫 번째 스냅샷 사용
          
          console.log('Processing sale item:', {
            prototypeId,
            buyerInfo: {
              name: snapshot?.buyer_name,
              displayId: snapshot?.buyer_display_id
            },
            purchaseDate: item.purchased_at
          });

          if (!acc[prototypeId]) {
            acc[prototypeId] = {
              id: prototypeId,
              title: item.prototypes.title,
              image: item.prototypes.image_url,
              totalSales: 0,
              totalRevenue: 0,
              sales: []
            };
          }

          acc[prototypeId].totalSales++;
          acc[prototypeId].totalRevenue += item.prototypes.credit_price;
          acc[prototypeId].sales.push({
            id: item.id,
            buyer: {
              id: snapshot.buyer_id,
              name: snapshot.buyer_name,
              display_id: snapshot.buyer_display_id
            },
            amount: item.prototypes.credit_price,
            purchased_at: item.purchased_at
          });

          return acc;
        }, {} as Record<string, PrototypeSales>);

        const formattedSales = Object.values(salesByPrototype);
        console.log('Formatted sales data:', formattedSales);

        setPrototypeSales(formattedSales);
        setTotalRevenue(formattedSales.reduce((sum, p) => sum + p.totalRevenue, 0));
      } catch (error) {
        console.error('Error fetching sales history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesHistory();
  }, [user]);

  return { prototypeSales, loading, totalRevenue };
}