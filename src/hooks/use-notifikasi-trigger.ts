'use client';

import { useEffect, useRef } from 'react';
import { useNotifikasi } from './use-notifikasi';

interface UseNotificationTriggerProps {
  statusData: { gas_ppm: number; api_terdeteksi: boolean; } | undefined | null;
  fcmToken: string | null;
}

const useNotificationTrigger = ({ statusData, fcmToken }: UseNotificationTriggerProps) => {
  const { sendNotification } = useNotifikasi();

  const gasNotifSent = useRef(false);
  const apiNotifSent = useRef(false);

  useEffect(() => {
    if (!statusData || !fcmToken) return;

    const { gas_ppm, api_terdeteksi } = statusData;
    const DANGER_LEVEL_GAS = 300;

    // --- Logika Notifikasi Gas ---
    if (gas_ppm >= DANGER_LEVEL_GAS) {
      if (!gasNotifSent.current) {
        console.log("Memicu pengiriman notifikasi bahaya gas...");
        // Ganti fetch dengan sendNotification
        sendNotification(
          fcmToken,
          "🚨 Bahaya Gas Terdeteksi!",
          `Level gas mencapai ${gas_ppm} PPM.`
        );
        gasNotifSent.current = true;
      }
    } else {
      gasNotifSent.current = false;
    }

    // --- Logika Notifikasi Api ---
    if (api_terdeteksi) {
      if (!apiNotifSent.current) {
        console.log("Memicu pengiriman notifikasi peringatan api...");
        // Ganti fetch dengan sendNotification
        sendNotification(
          fcmToken,
          "🔥 Bahaya Api Terdeteksi!",
          "Sistem mendeteksi adanya api. Segera ambil tindakan!"
        );
        apiNotifSent.current = true;
      }
    } else {
      apiNotifSent.current = false;
    }
  }, [statusData, fcmToken, sendNotification]);
};

export default useNotificationTrigger;