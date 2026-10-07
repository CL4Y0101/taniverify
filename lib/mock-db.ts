export interface Sack {
  uid: string;
  merk: string;
  jenis: string;
  beratKg: number;
  batch: string;
  tglProduksi: string;
  distributor: string;
}

export const GENUINE_SACKS: Sack[] = [
  { uid: "04:A3:2B:9C:10", merk: "Tani Subur", jenis: "Urea", beratKg: 50, batch: "TS-U-2026-041", tglProduksi: "2026-03-12", distributor: "UD Maju Tani" },
  { uid: "04:A3:2B:9C:11", merk: "Tani Subur", jenis: "NPK 15-15-15", beratKg: 50, batch: "TS-N-2026-038", tglProduksi: "2026-03-08", distributor: "UD Maju Tani" },
  { uid: "04:5E:77:01:2A", merk: "Sawah Makmur", jenis: "SP-36", beratKg: 50, batch: "SM-S-2026-112", tglProduksi: "2026-02-27", distributor: "Toko Tani Berkah" },
  { uid: "04:5E:77:01:2B", merk: "Sawah Makmur", jenis: "ZA", beratKg: 50, batch: "SM-Z-2026-109", tglProduksi: "2026-02-25", distributor: "Toko Tani Berkah" },
  { uid: "04:C1:08:D4:77", merk: "Panen Raya", jenis: "Urea", beratKg: 50, batch: "PR-U-2026-203", tglProduksi: "2026-04-02", distributor: "Kios Tani Sido Mulyo" },
  { uid: "04:C1:08:D4:78", merk: "Panen Raya", jenis: "NPK 16-16-16", beratKg: 50, batch: "PR-N-2026-198", tglProduksi: "2026-03-30", distributor: "Kios Tani Sido Mulyo" },
];

export interface FakeUid {
  uid: string;
  reason: string;
}

export const FAKE_UIDS: FakeUid[] = [
  { uid: "04:9F:11:AA:02", reason: "UID tidak terdaftar di basis data" },
  { uid: "04:77:BC:3D:91", reason: "UID tidak terdaftar di basis data" },
];
