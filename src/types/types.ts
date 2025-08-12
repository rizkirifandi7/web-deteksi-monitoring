export interface StatusTerkini {
  gas_ppm: number;
  api_terdeteksi: boolean;
  alarm_aktif: boolean;
  kipas_aktif: boolean;
  pompa_aktif: boolean;
  update_terakhir: number;
}

// Tipe data untuk setiap item log
export interface LogKejadian {
  id: string; // Kunci unik dari Firebase
  jenis_ancaman: string;
  level: "Aman" | "Siaga" | "Bahaya";
  nilai_sensor: number;
  timestamp: number;
}

// Tipe untuk level bahaya
export interface DangerLevels {
	LOW: number;
	HIGH: number;
}

// Tipe untuk props komponen
export interface ChartPieGasProps {
	gasValue?: number;
	maxPpm?: number;
}

export interface FireStatusProps {
	fireStatus?: boolean;
}

// Tipe untuk props komponen utama
export interface StatusKeamananCardProps {
  data: StatusTerkini | undefined | null;
}

// Komponen DataTable yang menerima data sebagai props
export interface DataTableRiwayatProps {
  data: LogKejadian[];
}