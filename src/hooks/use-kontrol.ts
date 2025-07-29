// hooks/use-kontrol.ts

'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, update } from "firebase/database"; // Import 'update'
import useSWR from 'swr';
import { db } from "@/lib/firebase";

// --- Definisi Tipe Data ---
// Menambahkan 'buzzer' sesuai dengan UI Anda
export interface DataControl {
  fan: boolean;
  mode: string;
  pump: boolean;
  buzzer: boolean; 
}

// Fungsi untuk mengupdate data ke Firebase
// Menggunakan Partial<DataControl> agar kita bisa update sebagian data saja
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
        mutate(result, false); // Update SWR cache tanpa re-fetching
        setListenerError(result ? null : "Data 'control' tidak ditemukan.");
      }, 
      (error) => {
        console.error("Firebase read error:", error);
        setListenerError("Gagal terhubung ke Firebase.");
      }
    );
    return () => unsubscribe();
  }, [swrKey, mutate]);

  // Fungsi yang akan dipanggil dari komponen UI
  const updateControl = async (updates: Partial<DataControl>) => {
    setIsUpdating(true);
    try {
      await updateControlData(updates);
      // Optimistic UI update, SWR akan disinkronkan oleh onValue listener
      mutate((currentData) => (currentData ? { ...currentData, ...updates } : null), false);
    } catch (error) {
      console.error("Gagal update data:", error);
      // Bisa tambahkan state untuk error update jika perlu
    } finally {
      setIsUpdating(false);
    }
  };

  return { data, isLoading, error: listenerError, updateControl, isUpdating };
}

export default useKontrol;