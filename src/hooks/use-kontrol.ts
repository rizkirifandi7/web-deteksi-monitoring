'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, update } from "firebase/database";
import useSWR from 'swr';
import { db } from "@/lib/firebase";
import { DataControl } from '@/types/types';

const updateControlData = async (updates: Partial<DataControl>) => {
  const controlRef = ref(db, '/control');
  await update(controlRef, updates);
};

function useKontrol() {
  const swrKey = '/control';
  const { data, isLoading, mutate } = useSWR<DataControl | null>(swrKey, null);
  const [listenerError, setListenerError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // State untuk penanda update

  useEffect(() => {
    const statusRef = ref(db, swrKey);
    const unsubscribe = onValue(statusRef, 
      (snapshot) => {
        const result: DataControl | null = snapshot.exists() ? snapshot.val() : null;
        mutate(result, false);
        setListenerError(result ? null : "Data 'control' tidak ditemukan.");
      }, 
      (error) => {
        console.error("Firebase read error:", error);
        setListenerError("Gagal terhubung ke Firebase.");
      }
    );
    return () => unsubscribe();
  }, [swrKey, mutate]);

  const updateControl = async (updates: Partial<DataControl>) => {
    setIsUpdating(true);
    try {
      await updateControlData(updates);
      mutate((currentData) => (currentData ? { ...currentData, ...updates } : null), false);
    } catch (error) {
      console.error("Gagal update data:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return { data, isLoading, error: listenerError, updateControl, isUpdating };
}

export default useKontrol;