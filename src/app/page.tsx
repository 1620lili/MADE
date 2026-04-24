import { getServiceSupabase } from '@/lib/supabase';
import MallClientWrapper from '@/components/landing/MallClientWrapper';

export const revalidate = 60; // Revalidate every minute for a more dynamic feel

export default async function Home() {
  const supabase = getServiceSupabase();
  
  const { data: stores, error } = await supabase
    .from('Company')
    .select('id, name, city, logoUrl, bannerUrl, isActive')
    .eq('isActive', true)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error("Home fetch error:", error);
  }

  const validStores = stores || [];

  return (
    <MallClientWrapper stores={validStores} />
  );
}
