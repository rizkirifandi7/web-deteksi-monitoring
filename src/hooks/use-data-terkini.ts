'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue } from "firebase/database";
import useSWR from 'swr';
import { db } from "@/lib/firebase";
import { StatusTerkini } from '@/types/types';

function useStatusData() {
  const swrKey = '/data_terkini';
  const { data, isLoading, mutate } = useSWR<StatusTerkini | null>(swrKey, null);
  const [listenerError, setListenerError] = useState<string | null>(null);

  console.log(data)

  const fetchStatusData = useCallback(() => {
    const statusRef = ref(db, swrKey);
    return onValue(statusRef, (snapshot) => {
      const result: StatusTerkini | null = snapshot.exists() ? snapshot.val() : null;
      mutate(result, false);
      if (result) {
        setListenerError(null);
      } else {
        setListenerError("Data 'data_terkini' tidak ditemukan di database.");
      }
    }, (error) => {
      console.error("Firebase read error:", error);
      setListenerError("Gagal terhubung ke Firebase. Periksa koneksi atau konfigurasi Anda.");
    });
  }, [swrKey, mutate]);

  useEffect(() => {
    const unsubscribe = fetchStatusData();
    return () => unsubscribe();
  }, [fetchStatusData]);

  return { data, isLoading, error: listenerError };
}

export default useStatusData;
