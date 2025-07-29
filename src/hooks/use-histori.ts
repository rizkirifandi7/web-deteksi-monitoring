// hooks/useLogKejadian.ts

'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild } from "firebase/database";
import useSWR from 'swr';
import { db } from "@/lib/firebase";

// Tipe data untuk setiap item log
export interface LogKejadian {
  id: string; // Kunci unik dari Firebase
  jenis_ancaman: string;
  level: "Aman" | "Siaga" | "Bahaya";
  nilai_sensor: number;
  timestamp: number; // Firebase akan mengubah ServerValue menjadi angka
}

function useLogKejadian() {
  const swrKey = '/log_kejadian';
  // SWR akan menyimpan array LogKejadian
  const { data, isLoading, mutate } = useSWR<LogKejadian[]>(swrKey, null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Query untuk mengurutkan data berdasarkan timestamp
    const logRef = query(ref(db, swrKey), orderByChild('timestamp'));
    
    const unsubscribe = onValue(logRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        // Ubah objek dari Firebase menjadi array, lalu balik urutannya
        const processedData: LogKejadian[] = Object.entries(rawData)
          .map(([id, value]) => ({
            id,
            ...(value as Omit<LogKejadian, 'id'>),
          }))
          .reverse(); // Balik array agar data terbaru di atas
        
        mutate(processedData, false);
        setError(null);
      } else {
        mutate([], false); // Kirim array kosong jika tidak ada data
        setError("Data 'log_kejadian' tidak ditemukan.");
      }
    }, (err) => {
      console.error("Firebase read error:", err);
      setError("Gagal terhubung ke Firebase.");
    });

    return () => unsubscribe();
  }, [swrKey, mutate]); 

  return { data, isLoading, error };
}

export default useLogKejadian;