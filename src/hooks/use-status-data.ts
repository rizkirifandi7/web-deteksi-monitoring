'use client'; // Menandakan ini adalah Client Component

import { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import useSWR from 'swr'; // Import SWR
import { db } from "@/lib/firebase"; // Pastikan path ini benar

// --- Definisi Tipe Data (Tetap sama) ---
interface DataSensor {
  gas_ppm: number;
  status_api: string;
}

interface StatusAktuator {
  alarm_aktif: boolean;
  kipas_aktif: boolean;
  pompa_aktif: boolean;
}

interface StatusTerkini {
  data_sensor: DataSensor;
  status_aktuator: StatusAktuator;
  status_sistem: string;
  update_terakhir: number;
}

function useStatusData() {
  const swrKey = '/status_terkini';
  const { data, isLoading, mutate } = useSWR<StatusTerkini | null>(swrKey, null);
  const [listenerError, setListenerError] = useState<string | null>(null);

  useEffect(() => {
    const statusRef = ref(db, swrKey);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const result: StatusTerkini | null = snapshot.exists() ? snapshot.val() : null;
      mutate(result, false);
      if (result) {
        setListenerError(null);
      } else {
        setListenerError("Data 'status_terkini' tidak ditemukan di database.");
      }

    }, (error) => {
      console.error("Firebase read error:", error);
      setListenerError("Gagal terhubung ke Firebase. Periksa koneksi atau konfigurasi Anda.");
    });

    return () => unsubscribe();
  }, [swrKey, mutate]); 

  return { data, isLoading, error: listenerError };
}

export default useStatusData;