'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, query, orderByChild } from "firebase/database";
import useSWR from 'swr';
import { db } from "@/lib/firebase";
import { LogKejadian } from '@/types/types';

function useLogKejadian() {
  const swrKey = '/log_kejadian';
  const { data, isLoading, mutate } = useSWR<LogKejadian[]>(swrKey, null);
  const [error, setError] = useState<string | null>(null);

  const fetchLogKejadian = useCallback(() => {
    const logRef = query(ref(db, swrKey), orderByChild('timestamp'));
    
    return onValue(logRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const processedData: LogKejadian[] = Object.entries(rawData)
          .map(([id, value]) => ({
            id,
            ...(value as Omit<LogKejadian, 'id'>),
          }))
          .reverse();
        
        mutate(processedData, false);
        setError(null);
      } else {
        mutate([], false);
        setError("Data 'log_kejadian' tidak ditemukan.");
      }
    }, (err) => {
      console.error("Firebase read error:", err);
      setError("Gagal terhubung ke Firebase.");
    });
  }, [swrKey, mutate]);

  useEffect(() => {
    const unsubscribe = fetchLogKejadian();
    return () => unsubscribe();
  }, [fetchLogKejadian]);

  return { data, isLoading, error };
}

export default useLogKejadian;
