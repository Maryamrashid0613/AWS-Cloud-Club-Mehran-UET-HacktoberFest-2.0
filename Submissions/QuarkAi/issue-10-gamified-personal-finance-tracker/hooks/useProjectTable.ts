import { supabase } from '@/utils/supabase';
import { useCallback, useState } from 'react';

// 👇 Define your "projects" table structure
export interface ProjectRow {
  id?: number;
  userId: string;
  projectName: string;
  projectDescription: string;
  projectColor: string;
  status: string;
  projectPanelImage: string;
  created_at?: string;
}

// 🔹 Generic hook for any Supabase table
export const useSupabaseTable = <T extends Record<string, any>>(tableName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🟢 Fetch all data
  const getData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .select('*') // ✅ Fetch all columns
        .order('id', { ascending: false });

      if (error) throw error;
      setData(result as T[]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  // 🟡 Insert new data
  const addData = useCallback(
    async (newRow: T) => {
      setLoading(true);
      setError(null);
      try {
        const { data: inserted, error } = await supabase
          .from(tableName)
          .insert([newRow])
          .select();

        if (error) throw error;
        // ✅ add newly inserted data to the start
        setData((prev) => (inserted ? [...inserted, ...prev] : prev));
      } catch (err: any) {
        setError(err.message || 'Insert failed');
      } finally {
        setLoading(false);
      }
    },
    [tableName]
  );

  // 🟠 Update existing data
  const updateData = useCallback(
    async (id: number, updatedRow: Partial<T>) => {
      setLoading(true);
      setError(null);
      try {
        const { data: updated, error } = await supabase
          .from(tableName)
          .update(updatedRow)
          .eq('id', id)
          .select();

        if (error) throw error;
        // ✅ Update the local state
        setData((prev) =>
          prev.map((item: any) =>
            item.id === id ? { ...item, ...updated?.[0] } : item
          )
        );
      } catch (err: any) {
        setError(err.message || 'Update failed');
      } finally {
        setLoading(false);
      }
    },
    [tableName]
  );

  // 🔴 Delete data
  const deleteData = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);

        if (error) throw error;
        // ✅ Remove from local state
        setData((prev) => prev.filter((item: any) => item.id !== id));
      } catch (err: any) {
        setError(err.message || 'Delete failed');
      } finally {
        setLoading(false);
      }
    },
    [tableName]
  );

  return { data, loading, error, getData, addData, updateData, deleteData };
};
