export interface DataSensor {
  gas_ppm: number;
  status_api: string;
}

export interface StatusAktuator {
  alarm_aktif: boolean;
  kipas_aktif: boolean;
  pompa_aktif: boolean;
}

export interface StatusTerkini {
  data_sensor: DataSensor;
  status_aktuator: StatusAktuator;
  status_sistem: string;
  update_terakhir: number;
}

export interface DataControl {
  fan: boolean;
  mode: string;
  pump: boolean;
  buzzer: boolean; 
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
	fireStatus?: string;
}

// Tipe untuk status aktuator yang diterima dari hook
export interface ActuatorStatus {
	kipas_aktif: boolean;
	pompa_aktif: boolean;
	alarm_aktif: boolean; // Menggunakan nama dari hook Anda
}

// Tipe untuk props komponen utama
export interface StatusKeamananCardProps {
  status: ActuatorStatus | undefined;
}

export interface KontrolProps {
  data: DataControl | null | undefined;
  updateControl: (updates: Partial<DataControl>) => Promise<void>;
  isUpdating: boolean;
}

// Komponen DataTable yang menerima data sebagai props
export interface DataTableRiwayatProps {
  data: LogKejadian[];
}