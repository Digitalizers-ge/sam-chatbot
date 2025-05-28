
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KPIData {
  id: string;
  total_questions: number;
  active_sessions: number;
  avg_questions_per_session: number;
  active_users: number;
  languages: string[];
  users_by_country: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export const useKPIs = () => {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLatestKPIs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching KPIs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch KPI data",
          variant: "destructive",
        });
        return;
      }

      setKpis(data);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch KPI data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const insertKPIs = async (kpiData: Omit<KPIData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('kpis')
        .insert([kpiData])
        .select()
        .single();

      if (error) {
        console.error('Error inserting KPIs:', error);
        toast({
          title: "Error",
          description: "Failed to save KPI data",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "KPI data saved successfully",
      });

      await fetchLatestKPIs(); // Refresh the data
      return data;
    } catch (error) {
      console.error('Error inserting KPIs:', error);
      toast({
        title: "Error",
        description: "Failed to save KPI data",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchLatestKPIs();
  }, []);

  return {
    kpis,
    loading,
    fetchLatestKPIs,
    insertKPIs,
  };
};
