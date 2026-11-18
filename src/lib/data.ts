export type FieldType = "text" | "textarea" | "number" | "date" | "select";

export interface DocField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  hint?: string;
}

export interface DocStep {
  title: string;
  description: string;
  fields: DocField[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  description: string;
  price: number;
  duration: string;
  pages: number;
  popularity: number;
  usedCount: number;
  tags: string[];
  includes: string[];
  steps: DocStep[];
  previewTitle: string;
  previewBody: (values: Record<string, string>) => string[];
}

export const docCategories = [
  "Perjanjian Bisnis",
  "Ketenagakerjaan",
  "Properti & Sewa",
  "Keluarga",
  "Surat Kuasa",
  "Perusahaan",
];

const idr = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const formatIDR = idr;

export const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const v = (values: Record<string, string>, key: string, fallback: string) =>
  values[key]?.trim() ? values[key] : fallback;

export const documents: LegalDocument[] = [
  {
    slug: "perjanjian-kerja-sama",
    title: "Perjanjian Kerja Sama Bisnis",
    category: "Perjanjian Bisnis",
    shortDesc: "Atur hak, kewajiban, dan pembagian hasil antara dua pihak yang berkolaborasi.",
    description:
      "Dokumen ini mengatur ruang lingkup kerja sama, kontribusi masing-masing pihak, pembagian keuntungan, jangka waktu, hingga mekanisme penyelesaian sengketa. Disusun mengikuti asas kebebasan berkontrak dalam KUH Perdata.",
    price: 149000,
    duration: "10 menit",
    pages: 6,
    popularity: 98,
    usedCount: 12480,
    tags: ["Bisnis", "Kemitraan", "Paling dipakai"],
    includes: [
      "Klausul ruang lingkup kerja sama",
      "Skema pembagian keuntungan dan biaya",
      "Klausul kerahasiaan dan larangan persaingan",
      "Mekanisme pengakhiran dan penyelesaian sengketa",
    ],
    previewTitle: "PERJANJIAN KERJA SAMA",
    previewBody: (values) => [
      `Pada hari ini, ${formatTanggal(v(values, "tanggal", new Date().toISOString()))}, bertempat di ${v(values, "kota", "Jakarta")}, yang bertanda tangan di bawah ini:`,
      `1. ${v(values, "pihak1", "[Nama Pihak Pertama]")}, beralamat di ${v(values, "alamat1", "[alamat pihak pertama]")}, selanjutnya disebut PIHAK PERTAMA.`,
      `2. ${v(values, "pihak2", "[Nama Pihak Kedua]")}, beralamat di ${v(values, "alamat2", "[alamat pihak kedua]")}, selanjutnya disebut PIHAK KEDUA.`,
      `Pasal 1 — RUANG LINGKUP\nKedua belah pihak sepakat menjalankan kerja sama berupa ${v(values, "lingkup", "[uraian bidang kerja sama]")}.`,
      `Pasal 2 — JANGKA WAKTU\nPerjanjian ini berlaku selama ${v(values, "jangkaWaktu", "12")} bulan sejak tanggal ditandatangani dan dapat diperpanjang atas kesepakatan tertulis kedua pihak.`,
      `Pasal 3 — KONTRIBUSI DAN PEMBAGIAN HASIL\nPIHAK PERTAMA memberikan kontribusi berupa ${v(values, "kontribusi1", "[bentuk kontribusi]")} dan PIHAK KEDUA berupa ${v(values, "kontribusi2", "[bentuk kontribusi]")}. Pembagian keuntungan bersih ditetapkan ${v(values, "pembagian", "50 : 50")}.`,
      `Pasal 4 — KERAHASIAAN\nPara pihak wajib menjaga kerahasiaan seluruh informasi yang diperoleh selama kerja sama dan tidak mengungkapkannya kepada pihak ketiga tanpa persetujuan tertulis.`,
      `Pasal 5 — PENYELESAIAN SENGKETA\nSetiap perselisihan diselesaikan secara musyawarah. Apabila tidak tercapai, para pihak memilih domisili hukum di ${v(values, "domisiliHukum", "Pengadilan Negeri Jakarta Selatan")}.`,
    ],
    steps: [
      {
        title: "Identitas Para Pihak",
        description: "Isi data pihak pertama dan pihak kedua yang menandatangani perjanjian.",
        fields: [
          { name: "pihak1", label: "Nama Pihak Pertama", type: "text", placeholder: "PT Nusantara Karya Mandiri", required: true },
          { name: "alamat1", label: "Alamat Pihak Pertama", type: "textarea", placeholder: "Jl. Rasuna Said Kav. 12, Jakarta Selatan", required: true },
          { name: "pihak2", label: "Nama Pihak Kedua", type: "text", placeholder: "CV Bina Teknologi Andalan", required: true },
          { name: "alamat2", label: "Alamat Pihak Kedua", type: "textarea", placeholder: "Jl. Diponegoro No. 45, Bandung", required: true },
        ],
      },
      {
        title: "Ruang Lingkup Kerja Sama",
        description: "Jelaskan bidang kerja sama serta kontribusi masing-masing pihak.",
        fields: [
          { name: "lingkup", label: "Ruang Lingkup Kerja Sama", type: "textarea", placeholder: "Pengembangan dan pemasaran produk perangkat lunak logistik", required: true },
          { name: "kontribusi1", label: "Kontribusi Pihak Pertama", type: "text", placeholder: "Modal kerja dan jaringan distribusi", required: true },
          { name: "kontribusi2", label: "Kontribusi Pihak Kedua", type: "text", placeholder: "Tim pengembang dan lisensi teknologi", required: true },
          { name: "pembagian", label: "Pembagian Keuntungan", type: "select", options: ["50 : 50", "60 : 40", "70 : 30", "40 : 60"], required: true },
        ],
      },
      {
        title: "Jangka Waktu & Hukum",
        description: "Tentukan masa berlaku dan domisili hukum penyelesaian sengketa.",
        fields: [
          { name: "jangkaWaktu", label: "Jangka Waktu (bulan)", type: "number", placeholder: "12", required: true },
          { name: "tanggal", label: "Tanggal Penandatanganan", type: "date", required: true },
          { name: "kota", label: "Kota Penandatanganan", type: "text", placeholder: "Jakarta", required: true },
          {
            name: "domisiliHukum",
            label: "Domisili Hukum",
            type: "select",
            options: [
              "Pengadilan Negeri Jakarta Selatan",
              "Pengadilan Negeri Bandung",
              "Pengadilan Negeri Surabaya",
              "Badan Arbitrase Nasional Indonesia",
            ],
            required: true,
          },
        ],
      },
    ],
  },
  {
    slug: "perjanjian-kerja-waktu-tertentu",
    title: "Perjanjian Kerja Waktu Tertentu (PKWT)",
    category: "Ketenagakerjaan",
    shortDesc: "Kontrak kerja karyawan kontrak sesuai ketentuan ketenagakerjaan terbaru.",
    description:
      "PKWT memuat jabatan, masa kontrak, besaran upah, hak cuti, serta ketentuan pengakhiran hubungan kerja. Cocok untuk perusahaan yang merekrut karyawan berbasis proyek atau periode tertentu.",
    price: 129000,
    duration: "8 menit",
    pages: 5,
    popularity: 95,
    usedCount: 9640,
    tags: ["HR", "Karyawan", "Populer"],
    includes: [
      "Detail jabatan dan uraian tugas",
      "Struktur upah dan tunjangan",
      "Hak cuti dan jaminan sosial",
      "Ketentuan pengakhiran kontrak",
    ],
    previewTitle: "PERJANJIAN KERJA WAKTU TERTENTU",
    previewBody: (values) => [
      `Perjanjian ini dibuat di ${v(values, "kota", "Jakarta")} pada tanggal ${formatTanggal(v(values, "tanggalMulai", new Date().toISOString()))} antara ${v(values, "perusahaan", "[Nama Perusahaan]")} (PENGUSAHA) dan ${v(values, "karyawan", "[Nama Karyawan]")} (PEKERJA).`,
      `Pasal 1 — JABATAN\nPEKERJA diterima untuk menduduki jabatan ${v(values, "jabatan", "[jabatan]")} pada divisi ${v(values, "divisi", "[divisi]")} dengan lokasi kerja di ${v(values, "kota", "Jakarta")}.`,
      `Pasal 2 — JANGKA WAKTU\nHubungan kerja berlangsung selama ${v(values, "durasi", "12")} bulan terhitung sejak ${formatTanggal(v(values, "tanggalMulai", new Date().toISOString()))} dan berakhir dengan sendirinya tanpa pesangon sesuai ketentuan peraturan perundang-undangan.`,
      `Pasal 3 — UPAH\nPEKERJA menerima upah sebesar ${idr(Number(v(values, "upah", "8500000")) || 0)} per bulan yang dibayarkan setiap tanggal ${v(values, "tanggalGajian", "25")}.`,
      `Pasal 4 — WAKTU KERJA\nWaktu kerja ${v(values, "polaKerja", "5 hari kerja, 40 jam per minggu")} dengan hak cuti tahunan sebanyak ${v(values, "cuti", "12")} hari kerja.`,
      `Pasal 5 — KERAHASIAAN DAN PENGAKHIRAN\nPEKERJA wajib menjaga rahasia perusahaan. Pengakhiran sebelum masa kontrak berakhir dilakukan dengan pemberitahuan tertulis minimal 30 hari sebelumnya.`,
    ],
    steps: [
      {
        title: "Data Perusahaan",
        description: "Informasi pemberi kerja yang mengikat perjanjian.",
        fields: [
          { name: "perusahaan", label: "Nama Perusahaan", type: "text", placeholder: "PT Arta Digital Nusantara", required: true },
          { name: "kota", label: "Kota Kedudukan", type: "text", placeholder: "Jakarta", required: true },
          { name: "divisi", label: "Divisi", type: "text", placeholder: "Operasional", required: true },
        ],
      },
      {
        title: "Data Karyawan",
        description: "Identitas dan jabatan pekerja.",
        fields: [
          { name: "karyawan", label: "Nama Karyawan", type: "text", placeholder: "Andini Prasetyo", required: true },
          { name: "jabatan", label: "Jabatan", type: "text", placeholder: "Supervisor Operasional", required: true },
          { name: "tanggalMulai", label: "Tanggal Mulai Kerja", type: "date", required: true },
          { name: "durasi", label: "Durasi Kontrak (bulan)", type: "number", placeholder: "12", required: true },
        ],
      },
      {
        title: "Upah & Waktu Kerja",
        description: "Kompensasi dan pola kerja yang disepakati.",
        fields: [
          { name: "upah", label: "Upah per Bulan (Rp)", type: "number", placeholder: "8500000", required: true },
          { name: "tanggalGajian", label: "Tanggal Pembayaran Upah", type: "number", placeholder: "25", required: true },
          {
            name: "polaKerja",
            label: "Pola Kerja",
            type: "select",
            options: ["5 hari kerja, 40 jam per minggu", "6 hari kerja, 40 jam per minggu", "Sistem shift"],
            required: true,
          },
          { name: "cuti", label: "Hak Cuti Tahunan (hari)", type: "number", placeholder: "12", required: true },
        ],
      },
    ],
  },
  {
    slug: "perjanjian-sewa-rumah",
    title: "Perjanjian Sewa Rumah",
    category: "Properti & Sewa",
    shortDesc: "Lindungi pemilik dan penyewa dengan klausul sewa yang jelas dan adil.",
    description:
      "Mengatur objek sewa, harga, jangka waktu, deposit, kewajiban perawatan, hingga larangan pengalihan sewa kepada pihak lain.",
    price: 99000,
    duration: "7 menit",
    pages: 4,
    popularity: 91,
    usedCount: 7320,
    tags: ["Properti", "Sewa"],
    includes: [
      "Deskripsi objek dan fasilitas sewa",
      "Ketentuan harga, deposit, dan denda",
      "Kewajiban perawatan dan perbaikan",
      "Klausul pengakhiran sewa",
    ],
    previewTitle: "PERJANJIAN SEWA RUMAH",
    previewBody: (values) => [
      `Yang bertanda tangan di bawah ini, ${v(values, "pemilik", "[Nama Pemilik]")} sebagai PIHAK YANG MENYEWAKAN dan ${v(values, "penyewa", "[Nama Penyewa]")} sebagai PIHAK PENYEWA, sepakat mengikatkan diri dalam perjanjian sewa rumah.`,
      `Pasal 1 — OBJEK SEWA\nObjek sewa berupa rumah yang terletak di ${v(values, "alamatObjek", "[alamat lengkap objek sewa]")} dengan luas bangunan ${v(values, "luas", "90")} m² beserta fasilitas ${v(values, "fasilitas", "listrik, air, dan perabot dasar")}.`,
      `Pasal 2 — HARGA DAN CARA PEMBAYARAN\nHarga sewa ditetapkan ${idr(Number(v(values, "hargaSewa", "45000000")) || 0)} untuk masa sewa ${v(values, "masaSewa", "12")} bulan, dibayarkan secara ${v(values, "caraBayar", "tahunan di muka")}.`,
      `Pasal 3 — DEPOSIT\nPIHAK PENYEWA menyerahkan uang jaminan sebesar ${idr(Number(v(values, "deposit", "5000000")) || 0)} yang dikembalikan setelah masa sewa berakhir dikurangi biaya kerusakan bila ada.`,
      `Pasal 4 — KEWAJIBAN PENYEWA\nPIHAK PENYEWA wajib menjaga objek sewa, menanggung biaya pemakaian listrik dan air, serta tidak mengalihkan sewa kepada pihak lain tanpa izin tertulis.`,
      `Pasal 5 — PENGAKHIRAN\nPerjanjian berakhir pada ${formatTanggal(v(values, "tanggalMulaiSewa", new Date().toISOString()))} ditambah masa sewa. Perpanjangan diajukan paling lambat 30 hari sebelum masa sewa berakhir.`,
    ],
    steps: [
      {
        title: "Para Pihak",
        description: "Data pemilik dan penyewa rumah.",
        fields: [
          { name: "pemilik", label: "Nama Pemilik", type: "text", placeholder: "Hendra Wijaya", required: true },
          { name: "penyewa", label: "Nama Penyewa", type: "text", placeholder: "Sarah Ramadhani", required: true },
          { name: "tanggalMulaiSewa", label: "Tanggal Mulai Sewa", type: "date", required: true },
        ],
      },
      {
        title: "Objek Sewa",
        description: "Detail rumah yang disewakan.",
        fields: [
          { name: "alamatObjek", label: "Alamat Objek Sewa", type: "textarea", placeholder: "Jl. Melati Indah No. 21, Depok", required: true },
          { name: "luas", label: "Luas Bangunan (m²)", type: "number", placeholder: "90", required: true },
          { name: "fasilitas", label: "Fasilitas", type: "text", placeholder: "Listrik 2200 VA, air PDAM, perabot dasar", required: true },
        ],
      },
      {
        title: "Harga & Jaminan",
        description: "Nilai sewa, cara pembayaran, dan deposit.",
        fields: [
          { name: "hargaSewa", label: "Harga Sewa (Rp)", type: "number", placeholder: "45000000", required: true },
          { name: "masaSewa", label: "Masa Sewa (bulan)", type: "number", placeholder: "12", required: true },
          { name: "caraBayar", label: "Cara Pembayaran", type: "select", options: ["tahunan di muka", "per 6 bulan", "bulanan"], required: true },
          { name: "deposit", label: "Uang Jaminan (Rp)", type: "number", placeholder: "5000000", required: true },
        ],
      },
    ],
  },
  {
    slug: "surat-kuasa-khusus",
    title: "Surat Kuasa Khusus",
    category: "Surat Kuasa",
    shortDesc: "Berikan wewenang terbatas untuk urusan tertentu secara sah dan terukur.",
    description:
      "Surat kuasa khusus memberi wewenang kepada penerima kuasa untuk melakukan tindakan hukum tertentu, dengan batasan yang tegas agar tidak disalahgunakan.",
    price: 79000,
    duration: "5 menit",
    pages: 2,
    popularity: 88,
    usedCount: 6110,
    tags: ["Kuasa", "Cepat"],
    includes: [
      "Identitas pemberi dan penerima kuasa",
      "Rincian wewenang yang diberikan",
      "Batas waktu berlakunya kuasa",
      "Klausul pencabutan kuasa",
    ],
    previewTitle: "SURAT KUASA KHUSUS",
    previewBody: (values) => [
      `Saya yang bertanda tangan di bawah ini, ${v(values, "pemberi", "[Nama Pemberi Kuasa]")}, NIK ${v(values, "nik", "[nomor induk kependudukan]")}, beralamat di ${v(values, "alamatPemberi", "[alamat]")}, selanjutnya disebut PEMBERI KUASA.`,
      `Dengan ini memberikan kuasa kepada ${v(values, "penerima", "[Nama Penerima Kuasa]")}, beralamat di ${v(values, "alamatPenerima", "[alamat]")}, selanjutnya disebut PENERIMA KUASA.`,
      `KHUSUS\nUntuk mewakili PEMBERI KUASA dalam hal ${v(values, "keperluan", "[uraian keperluan]")} pada ${v(values, "instansi", "[nama instansi/pihak terkait]")}.`,
      `Kuasa ini diberikan dengan hak untuk menandatangani dokumen, menerima dan menyerahkan berkas, serta melakukan tindakan lain yang diperlukan sepanjang berkaitan langsung dengan keperluan di atas.`,
      `Kuasa ini berlaku sampai dengan ${formatTanggal(v(values, "berlakuHingga", new Date().toISOString()))} dan tidak dapat dialihkan kepada pihak lain (non-substitusi).`,
      `Demikian surat kuasa ini dibuat di ${v(values, "kota", "Jakarta")} untuk dipergunakan sebagaimana mestinya.`,
    ],
    steps: [
      {
        title: "Pemberi Kuasa",
        description: "Identitas pihak yang memberikan wewenang.",
        fields: [
          { name: "pemberi", label: "Nama Pemberi Kuasa", type: "text", placeholder: "Budi Santoso", required: true },
          { name: "nik", label: "NIK", type: "text", placeholder: "3174xxxxxxxxxxxx", required: true },
          { name: "alamatPemberi", label: "Alamat", type: "textarea", placeholder: "Jl. Kenanga No. 8, Jakarta Timur", required: true },
        ],
      },
      {
        title: "Penerima Kuasa",
        description: "Identitas pihak yang menerima wewenang.",
        fields: [
          { name: "penerima", label: "Nama Penerima Kuasa", type: "text", placeholder: "Ratna Kusuma", required: true },
          { name: "alamatPenerima", label: "Alamat", type: "textarea", placeholder: "Jl. Cendana No. 3, Bekasi", required: true },
        ],
      },
      {
        title: "Keperluan Kuasa",
        description: "Batasan wewenang dan masa berlaku.",
        fields: [
          { name: "keperluan", label: "Keperluan", type: "textarea", placeholder: "Pengurusan sertifikat hak milik atas tanah", required: true },
          { name: "instansi", label: "Instansi / Pihak Terkait", type: "text", placeholder: "Kantor Pertanahan Kota Bekasi", required: true },
          { name: "berlakuHingga", label: "Berlaku Hingga", type: "date", required: true },
          { name: "kota", label: "Kota Pembuatan", type: "text", placeholder: "Jakarta", required: true },
        ],
      },
    ],
  },
  {
    slug: "perjanjian-pra-nikah",
    title: "Perjanjian Pra Nikah",
    category: "Keluarga",
    shortDesc: "Pisahkan harta bawaan dan atur pengelolaan keuangan rumah tangga.",
    description:
      "Perjanjian pra nikah mengatur pemisahan harta, tanggung jawab utang, serta pengelolaan penghasilan selama pernikahan. Wajib disahkan notaris dan dicatatkan.",
    price: 199000,
    duration: "12 menit",
    pages: 5,
    popularity: 84,
    usedCount: 3180,
    tags: ["Keluarga", "Notaris"],
    includes: [
      "Daftar harta bawaan masing-masing pihak",
      "Ketentuan pemisahan harta",
      "Pengaturan tanggung jawab utang",
      "Klausul pencatatan di catatan sipil",
    ],
    previewTitle: "PERJANJIAN PRA NIKAH",
    previewBody: (values) => [
      `Pada tanggal ${formatTanggal(v(values, "tanggal", new Date().toISOString()))}, ${v(values, "calon1", "[Nama Calon Suami]")} dan ${v(values, "calon2", "[Nama Calon Istri]")} yang akan melangsungkan pernikahan pada ${formatTanggal(v(values, "tanggalNikah", new Date().toISOString()))} sepakat membuat perjanjian ini.`,
      `Pasal 1 — PEMISAHAN HARTA\nPara pihak sepakat bahwa ${v(values, "skema", "seluruh harta dipisahkan sepenuhnya")}, sehingga harta yang diperoleh sebelum maupun selama pernikahan tetap menjadi milik masing-masing pihak.`,
      `Pasal 2 — HARTA BAWAAN\nHarta bawaan calon suami meliputi ${v(values, "harta1", "[uraian harta]")}. Harta bawaan calon istri meliputi ${v(values, "harta2", "[uraian harta]")}.`,
      `Pasal 3 — BIAYA RUMAH TANGGA\nBiaya rumah tangga ditanggung secara ${v(values, "biayaRT", "proporsional sesuai penghasilan")}.`,
      `Pasal 4 — UTANG\nSetiap utang yang timbul dari tindakan salah satu pihak menjadi tanggung jawab pribadi pihak tersebut, kecuali disepakati tertulis bersama.`,
      `Pasal 5 — PENGESAHAN\nPerjanjian ini akan dibuat dalam akta notaris dan dicatatkan pada instansi pencatatan pernikahan sebelum akad/pemberkatan dilaksanakan.`,
    ],
    steps: [
      {
        title: "Data Calon Pasangan",
        description: "Identitas kedua calon mempelai.",
        fields: [
          { name: "calon1", label: "Nama Calon Suami", type: "text", placeholder: "Rizky Aditama", required: true },
          { name: "calon2", label: "Nama Calon Istri", type: "text", placeholder: "Nadia Puspita", required: true },
          { name: "tanggalNikah", label: "Rencana Tanggal Pernikahan", type: "date", required: true },
        ],
      },
      {
        title: "Skema Harta",
        description: "Tentukan model pemisahan harta.",
        fields: [
          {
            name: "skema",
            label: "Skema Harta",
            type: "select",
            options: [
              "seluruh harta dipisahkan sepenuhnya",
              "harta bawaan dipisahkan, harta bersama tetap berlaku",
              "pemisahan dengan pengelolaan bersama atas aset tertentu",
            ],
            required: true,
          },
          { name: "harta1", label: "Harta Bawaan Calon Suami", type: "textarea", placeholder: "Apartemen di Jakarta Barat, kendaraan pribadi", required: true },
          { name: "harta2", label: "Harta Bawaan Calon Istri", type: "textarea", placeholder: "Tabungan investasi, tanah warisan di Yogyakarta", required: true },
        ],
      },
      {
        title: "Pengelolaan Keuangan",
        description: "Kesepakatan biaya rumah tangga dan tanggal perjanjian.",
        fields: [
          {
            name: "biayaRT",
            label: "Pembagian Biaya Rumah Tangga",
            type: "select",
            options: ["proporsional sesuai penghasilan", "ditanggung bersama 50:50", "ditanggung oleh salah satu pihak"],
            required: true,
          },
          { name: "tanggal", label: "Tanggal Perjanjian", type: "date", required: true },
        ],
      },
    ],
  },
  {
    slug: "akta-pendirian-cv",
    title: "Draf Akta Pendirian CV",
    category: "Perusahaan",
    shortDesc: "Siapkan draf pendirian persekutuan komanditer sebelum ke notaris.",
    description:
      "Draf lengkap memuat nama persekutuan, kedudukan, maksud dan tujuan, modal, serta pembagian peran sekutu aktif dan sekutu pasif.",
    price: 249000,
    duration: "15 menit",
    pages: 7,
    popularity: 80,
    usedCount: 2410,
    tags: ["Perusahaan", "Legalitas"],
    includes: [
      "Nama dan kedudukan persekutuan",
      "Maksud dan tujuan usaha",
      "Struktur modal dan setoran sekutu",
      "Kewenangan sekutu aktif dan pasif",
    ],
    previewTitle: "DRAF AKTA PENDIRIAN PERSEKUTUAN KOMANDITER",
    previewBody: (values) => [
      `Para pendiri sepakat mendirikan persekutuan komanditer dengan nama ${v(values, "namaCV", "CV [Nama Usaha]")} berkedudukan di ${v(values, "kedudukan", "[kota kedudukan]")}.`,
      `Pasal 1 — MAKSUD DAN TUJUAN\nPersekutuan menjalankan usaha di bidang ${v(values, "bidangUsaha", "[bidang usaha]")}.`,
      `Pasal 2 — MODAL\nModal persekutuan ditetapkan sebesar ${idr(Number(v(values, "modal", "500000000")) || 0)} yang berasal dari setoran para sekutu.`,
      `Pasal 3 — SEKUTU AKTIF\n${v(values, "sekutuAktif", "[Nama Sekutu Aktif]")} bertindak sebagai sekutu aktif yang berwenang mewakili persekutuan di dalam maupun di luar pengadilan.`,
      `Pasal 4 — SEKUTU PASIF\n${v(values, "sekutuPasif", "[Nama Sekutu Pasif]")} bertindak sebagai sekutu pasif yang tanggung jawabnya terbatas pada modal yang disetorkan.`,
      `Pasal 5 — TAHUN BUKU\nTahun buku persekutuan dimulai 1 Januari dan berakhir 31 Desember setiap tahun, dengan pembagian laba ${v(values, "pembagianLaba", "sesuai proporsi setoran modal")}.`,
    ],
    steps: [
      {
        title: "Identitas Persekutuan",
        description: "Nama, kedudukan, dan bidang usaha.",
        fields: [
          { name: "namaCV", label: "Nama CV", type: "text", placeholder: "CV Sentra Boga Nusantara", required: true },
          { name: "kedudukan", label: "Kota Kedudukan", type: "text", placeholder: "Semarang", required: true },
          { name: "bidangUsaha", label: "Bidang Usaha", type: "textarea", placeholder: "Perdagangan bahan pangan dan jasa katering", required: true },
        ],
      },
      {
        title: "Struktur Sekutu",
        description: "Peran masing-masing pendiri.",
        fields: [
          { name: "sekutuAktif", label: "Nama Sekutu Aktif", type: "text", placeholder: "Dimas Ardiansyah", required: true },
          { name: "sekutuPasif", label: "Nama Sekutu Pasif", type: "text", placeholder: "Lestari Handayani", required: true },
        ],
      },
      {
        title: "Modal & Laba",
        description: "Nilai modal serta skema pembagian laba.",
        fields: [
          { name: "modal", label: "Modal Persekutuan (Rp)", type: "number", placeholder: "500000000", required: true },
          {
            name: "pembagianLaba",
            label: "Pembagian Laba",
            type: "select",
            options: ["sesuai proporsi setoran modal", "60% sekutu aktif, 40% sekutu pasif", "dibagi rata"],
            required: true,
          },
        ],
      },
    ],
  },
  {
    slug: "nda-kerahasiaan",
    title: "Perjanjian Kerahasiaan (NDA)",
    category: "Perjanjian Bisnis",
    shortDesc: "Amankan informasi rahasia saat berdiskusi dengan mitra atau investor.",
    description:
      "NDA menetapkan definisi informasi rahasia, kewajiban penerima informasi, jangka waktu kerahasiaan, dan konsekuensi pelanggaran.",
    price: 89000,
    duration: "6 menit",
    pages: 3,
    popularity: 93,
    usedCount: 8420,
    tags: ["Bisnis", "Kerahasiaan"],
    includes: [
      "Definisi informasi rahasia",
      "Kewajiban dan pengecualian",
      "Jangka waktu kerahasiaan",
      "Klausul ganti kerugian",
    ],
    previewTitle: "PERJANJIAN KERAHASIAAN",
    previewBody: (values) => [
      `Perjanjian Kerahasiaan ini dibuat pada ${formatTanggal(v(values, "tanggal", new Date().toISOString()))} antara ${v(values, "pengungkap", "[Pihak Pengungkap]")} dan ${v(values, "penerima", "[Pihak Penerima]")}.`,
      `Pasal 1 — TUJUAN\nPara pihak melakukan pembahasan mengenai ${v(values, "tujuan", "[tujuan kerja sama]")} yang mengharuskan pertukaran informasi rahasia.`,
      `Pasal 2 — INFORMASI RAHASIA\nInformasi rahasia mencakup ${v(values, "cakupan", "data keuangan, strategi bisnis, basis data pelanggan, dan dokumen teknis")} baik lisan maupun tertulis.`,
      `Pasal 3 — KEWAJIBAN\nPihak Penerima wajib menjaga kerahasiaan, membatasi akses hanya kepada personel yang berkepentingan, dan tidak menggunakan informasi untuk kepentingan di luar tujuan perjanjian.`,
      `Pasal 4 — JANGKA WAKTU\nKewajiban kerahasiaan berlaku selama ${v(values, "jangka", "3")} tahun sejak tanggal perjanjian, dan tetap berlaku meski pembahasan tidak berlanjut.`,
      `Pasal 5 — SANKSI\nPelanggaran atas perjanjian ini mewajibkan pihak yang melanggar mengganti seluruh kerugian yang timbul serta memberi hak kepada pihak lain untuk menempuh upaya hukum.`,
    ],
    steps: [
      {
        title: "Para Pihak",
        description: "Pihak pengungkap dan penerima informasi.",
        fields: [
          { name: "pengungkap", label: "Pihak Pengungkap", type: "text", placeholder: "PT Cakra Data Utama", required: true },
          { name: "penerima", label: "Pihak Penerima", type: "text", placeholder: "PT Mitra Investasi Prima", required: true },
          { name: "tanggal", label: "Tanggal Perjanjian", type: "date", required: true },
        ],
      },
      {
        title: "Ruang Lingkup",
        description: "Tujuan pembahasan dan cakupan informasi.",
        fields: [
          { name: "tujuan", label: "Tujuan Pertukaran Informasi", type: "textarea", placeholder: "Penjajakan investasi seri A", required: true },
          { name: "cakupan", label: "Cakupan Informasi Rahasia", type: "textarea", placeholder: "Laporan keuangan, roadmap produk, data pelanggan", required: true },
        ],
      },
      {
        title: "Jangka Waktu",
        description: "Durasi kewajiban menjaga kerahasiaan.",
        fields: [
          { name: "jangka", label: "Jangka Waktu Kerahasiaan (tahun)", type: "select", options: ["1", "2", "3", "5"], required: true },
        ],
      },
    ],
  },
  {
    slug: "perjanjian-hutang-piutang",
    title: "Perjanjian Hutang Piutang",
    category: "Perjanjian Bisnis",
    shortDesc: "Catat pinjaman secara resmi lengkap dengan jadwal pelunasan.",
    description:
      "Dokumen ini mencatat jumlah pinjaman, bunga (bila ada), jadwal angsuran, jaminan, dan konsekuensi keterlambatan pembayaran.",
    price: 109000,
    duration: "8 menit",
    pages: 4,
    popularity: 86,
    usedCount: 5240,
    tags: ["Keuangan", "Pinjaman"],
    includes: [
      "Nilai pokok dan bunga pinjaman",
      "Jadwal dan metode pelunasan",
      "Ketentuan jaminan",
      "Denda keterlambatan dan wanprestasi",
    ],
    previewTitle: "PERJANJIAN HUTANG PIUTANG",
    previewBody: (values) => [
      `Pada ${formatTanggal(v(values, "tanggal", new Date().toISOString()))}, ${v(values, "pemberi", "[Nama Pemberi Pinjaman]")} (KREDITUR) dan ${v(values, "penerima", "[Nama Penerima Pinjaman]")} (DEBITUR) menyepakati perjanjian ini.`,
      `Pasal 1 — POKOK PINJAMAN\nKREDITUR memberikan pinjaman sebesar ${idr(Number(v(values, "jumlah", "50000000")) || 0)} yang telah diterima DEBITUR secara tunai/transfer.`,
      `Pasal 2 — BUNGA DAN TENOR\nPinjaman dikenakan bunga ${v(values, "bunga", "1")}% per bulan dengan tenor ${v(values, "tenor", "12")} bulan, dibayarkan setiap tanggal ${v(values, "tanggalBayar", "10")}.`,
      `Pasal 3 — JAMINAN\nSebagai jaminan pelunasan, DEBITUR menyerahkan ${v(values, "jaminan", "[uraian jaminan]")} kepada KREDITUR.`,
      `Pasal 4 — KETERLAMBATAN\nKeterlambatan pembayaran dikenakan denda ${v(values, "denda", "0,1")}% per hari dari jumlah angsuran yang tertunggak.`,
      `Pasal 5 — WANPRESTASI\nApabila DEBITUR lalai selama 3 kali angsuran berturut-turut, seluruh sisa utang menjadi jatuh tempo seketika dan dapat ditagih sekaligus.`,
    ],
    steps: [
      {
        title: "Para Pihak",
        description: "Identitas kreditur dan debitur.",
        fields: [
          { name: "pemberi", label: "Nama Pemberi Pinjaman", type: "text", placeholder: "Agus Riyanto", required: true },
          { name: "penerima", label: "Nama Penerima Pinjaman", type: "text", placeholder: "Maya Fitriani", required: true },
          { name: "tanggal", label: "Tanggal Perjanjian", type: "date", required: true },
        ],
      },
      {
        title: "Nilai Pinjaman",
        description: "Pokok, bunga, dan tenor.",
        fields: [
          { name: "jumlah", label: "Jumlah Pinjaman (Rp)", type: "number", placeholder: "50000000", required: true },
          { name: "bunga", label: "Bunga per Bulan (%)", type: "number", placeholder: "1", required: true },
          { name: "tenor", label: "Tenor (bulan)", type: "number", placeholder: "12", required: true },
          { name: "tanggalBayar", label: "Tanggal Jatuh Tempo Angsuran", type: "number", placeholder: "10", required: true },
        ],
      },
      {
        title: "Jaminan & Denda",
        description: "Pengamanan pelunasan pinjaman.",
        fields: [
          { name: "jaminan", label: "Jaminan", type: "textarea", placeholder: "BPKB kendaraan bermotor tahun 2021", required: true },
          { name: "denda", label: "Denda Keterlambatan (% per hari)", type: "number", placeholder: "0.1", required: true },
        ],
      },
    ],
  },
];

export const getDocument = (slug: string) => documents.find((d) => d.slug === slug);

export interface Consultant {
  id: string;
  name: string;
  title: string;
  specialities: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  city: string;
  languages: string[];
  bio: string;
  education: string[];
  availability: string[];
  initials: string;
  online: boolean;
}

export const consultants: Consultant[] = [
  {
    id: "adv-anindita",
    name: "Anindita Kusumaningrum, S.H., M.H.",
    title: "Advokat — Hukum Bisnis & Kontrak",
    specialities: ["Kontrak Bisnis", "Merger & Akuisisi", "Kepatuhan"],
    experience: 12,
    rating: 4.9,
    reviewCount: 214,
    pricePerSession: 350000,
    city: "Jakarta Selatan",
    languages: ["Indonesia", "Inggris"],
    bio: "Menangani penyusunan dan negosiasi kontrak komersial untuk perusahaan teknologi dan manufaktur. Fokus pada mitigasi risiko dan penyelesaian sengketa di luar pengadilan.",
    education: ["S.H. Universitas Indonesia", "M.H. Hukum Bisnis Universitas Gadjah Mada"],
    availability: ["09.00", "10.30", "13.00", "15.30"],
    initials: "AK",
    online: true,
  },
  {
    id: "adv-bramantyo",
    name: "Bramantyo Nugraha, S.H.",
    title: "Konsultan Hukum Ketenagakerjaan",
    specialities: ["PKWT & PKWTT", "Perselisihan Hubungan Industrial", "Kebijakan HR"],
    experience: 9,
    rating: 4.8,
    reviewCount: 168,
    pricePerSession: 275000,
    city: "Bandung",
    languages: ["Indonesia"],
    bio: "Mendampingi perusahaan dalam menyusun peraturan perusahaan, perjanjian kerja, hingga mediasi perselisihan hubungan industrial di Dinas Tenaga Kerja.",
    education: ["S.H. Universitas Padjadjaran", "Sertifikasi Mediator Hubungan Industrial"],
    availability: ["08.30", "11.00", "14.00", "16.00"],
    initials: "BN",
    online: true,
  },
  {
    id: "adv-cempaka",
    name: "Cempaka Ayu Lestari, S.H., M.Kn.",
    title: "Notaris & Konsultan Properti",
    specialities: ["Jual Beli Properti", "Sewa Menyewa", "Sertifikat Tanah"],
    experience: 14,
    rating: 4.9,
    reviewCount: 301,
    pricePerSession: 400000,
    city: "Surabaya",
    languages: ["Indonesia", "Inggris"],
    bio: "Berpengalaman dalam pengurusan peralihan hak atas tanah, due diligence properti, dan pembuatan akta perjanjian sewa jangka panjang.",
    education: ["S.H. Universitas Airlangga", "M.Kn. Kenotariatan Universitas Airlangga"],
    availability: ["09.30", "11.30", "13.30"],
    initials: "CL",
    online: false,
  },
  {
    id: "adv-daniel",
    name: "Daniel Sitorus, S.H.",
    title: "Advokat — Litigasi Perdata",
    specialities: ["Wanprestasi", "Perbuatan Melawan Hukum", "Eksekusi Putusan"],
    experience: 11,
    rating: 4.7,
    reviewCount: 142,
    pricePerSession: 320000,
    city: "Medan",
    languages: ["Indonesia"],
    bio: "Mewakili klien dalam sengketa perdata di pengadilan negeri hingga tingkat kasasi, dengan penekanan pada strategi pembuktian yang rapi.",
    education: ["S.H. Universitas Sumatera Utara", "Pendidikan Khusus Profesi Advokat"],
    availability: ["10.00", "13.00", "15.00", "17.00"],
    initials: "DS",
    online: true,
  },
  {
    id: "adv-elvira",
    name: "Elvira Rahmawati, S.H., M.H.",
    title: "Konsultan Hukum Keluarga",
    specialities: ["Perjanjian Pra Nikah", "Waris", "Perceraian"],
    experience: 8,
    rating: 4.8,
    reviewCount: 189,
    pricePerSession: 260000,
    city: "Yogyakarta",
    languages: ["Indonesia"],
    bio: "Mendampingi klien pada urusan hukum keluarga dengan pendekatan mediasi terlebih dahulu untuk menekan konflik berkepanjangan.",
    education: ["S.H. Universitas Gadjah Mada", "M.H. Hukum Keluarga Islam UII"],
    availability: ["09.00", "10.00", "14.30"],
    initials: "ER",
    online: true,
  },
  {
    id: "adv-fajar",
    name: "Fajar Maulana, S.H., LL.M.",
    title: "Konsultan Legalitas Usaha & Startup",
    specialities: ["Pendirian Badan Usaha", "Perizinan", "Pendanaan"],
    experience: 10,
    rating: 4.9,
    reviewCount: 226,
    pricePerSession: 380000,
    city: "Jakarta Pusat",
    languages: ["Indonesia", "Inggris"],
    bio: "Membantu pendiri usaha memilih bentuk badan hukum, menyiapkan dokumen pendanaan, serta memenuhi kewajiban perizinan berbasis risiko.",
    education: ["S.H. Universitas Diponegoro", "LL.M. Corporate Law, Leiden University"],
    availability: ["08.00", "11.00", "13.00", "16.30"],
    initials: "FM",
    online: false,
  },
];

export const getConsultant = (id: string) => consultants.find((c) => c.id === id);

export interface ConsultantReview {
  consultantId: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export const consultantReviews: ConsultantReview[] = [
  {
    consultantId: "adv-anindita",
    name: "Rendra Pratomo",
    rating: 5,
    date: "2026-08-14",
    comment: "Penjelasan klausul pembatasan tanggung jawab sangat rinci. Kontrak vendor kami akhirnya bisa ditandatangani minggu itu juga.",
  },
  {
    consultantId: "adv-anindita",
    name: "Siska Herlina",
    rating: 5,
    date: "2026-07-30",
    comment: "Sesi 45 menit terasa padat tapi terstruktur. Saya dapat catatan tindak lanjut yang jelas setelah konsultasi.",
  },
  {
    consultantId: "adv-bramantyo",
    name: "Yoga Adriansyah",
    rating: 5,
    date: "2026-08-02",
    comment: "Membantu kami merapikan perjanjian kerja untuk 40 karyawan kontrak tanpa mengubah struktur biaya.",
  },
  {
    consultantId: "adv-cempaka",
    name: "Melati Anggraini",
    rating: 5,
    date: "2026-08-21",
    comment: "Pemeriksaan dokumen tanah dilakukan teliti, termasuk mengingatkan risiko yang tidak saya sadari sebelumnya.",
  },
  {
    consultantId: "adv-daniel",
    name: "Bagas Winarno",
    rating: 4,
    date: "2026-06-19",
    comment: "Strategi pembuktian dijelaskan realistis, tidak menjanjikan hasil berlebihan. Saya menghargai kejujuran itu.",
  },
  {
    consultantId: "adv-elvira",
    name: "Karina Dwi",
    rating: 5,
    date: "2026-08-09",
    comment: "Pembahasan perjanjian pra nikah dibawakan dengan tenang sehingga saya dan pasangan nyaman bertanya apa saja.",
  },
  {
    consultantId: "adv-fajar",
    name: "Tommy Halim",
    rating: 5,
    date: "2026-08-25",
    comment: "Roadmap legalitas startup kami jadi terang: badan usaha, perizinan, sampai struktur kepemilikan saham.",
  },
];

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  content: { heading: string; paragraphs: string[] }[];
}

export const articleCategories = ["Kontrak", "Ketenagakerjaan", "Properti", "Usaha", "Keluarga"];

export const articles: Article[] = [
  {
    slug: "lima-klausul-wajib-perjanjian-kerja-sama",
    title: "Lima Klausul yang Wajib Ada di Perjanjian Kerja Sama",
    category: "Kontrak",
    excerpt: "Banyak kerja sama gagal bukan karena niat buruk, tetapi karena klausul dasar tidak pernah dituliskan sejak awal.",
    readTime: "6 menit",
    date: "2026-08-18",
    author: "Anindita Kusumaningrum, S.H., M.H.",
    content: [
      {
        heading: "Kejelasan ruang lingkup",
        paragraphs: [
          "Ruang lingkup adalah pagar dari sebuah kerja sama. Tanpa batasan yang tegas, salah satu pihak bisa merasa dirugikan karena mengerjakan hal di luar kesepakatan awal.",
          "Tuliskan pekerjaan yang termasuk dan yang tidak termasuk. Kalimat sederhana seperti \"pemasangan tidak termasuk biaya perizinan\" sering menyelamatkan hubungan bisnis dari perdebatan panjang.",
        ],
      },
      {
        heading: "Pembagian hasil dan biaya",
        paragraphs: [
          "Pembagian keuntungan harus disertai definisi keuntungan itu sendiri: kotor atau bersih, dihitung sebelum atau sesudah pajak, dan siapa menanggung biaya operasional.",
          "Sertakan contoh perhitungan dalam lampiran agar tidak ada tafsir berbeda saat pembayaran pertama jatuh tempo.",
        ],
      },
      {
        heading: "Mekanisme pengakhiran",
        paragraphs: [
          "Setiap perjanjian sebaiknya memuat cara keluar yang beradab: pemberitahuan tertulis, masa transisi, dan penyelesaian kewajiban yang masih tersisa.",
          "Klausul pengakhiran yang jelas justru membuat kedua pihak lebih percaya karena mereka tahu tidak akan terjebak dalam hubungan yang sudah tidak sehat.",
        ],
      },
    ],
  },
  {
    slug: "perbedaan-pkwt-dan-pkwtt",
    title: "Perbedaan PKWT dan PKWTT yang Sering Disalahpahami",
    category: "Ketenagakerjaan",
    excerpt: "Salah memilih jenis perjanjian kerja bisa menimbulkan kewajiban kompensasi yang tidak diperhitungkan perusahaan.",
    readTime: "7 menit",
    date: "2026-08-05",
    author: "Bramantyo Nugraha, S.H.",
    content: [
      {
        heading: "Dasar pembeda utama",
        paragraphs: [
          "PKWT dibuat untuk pekerjaan yang selesai dalam waktu tertentu, sementara PKWTT untuk hubungan kerja tetap tanpa batas waktu.",
          "Kesalahan umum terjadi ketika perusahaan memakai PKWT untuk pekerjaan yang sifatnya terus-menerus, sehingga secara hukum status pekerja dapat berubah menjadi tetap.",
        ],
      },
      {
        heading: "Konsekuensi administratif",
        paragraphs: [
          "PKWT wajib dibuat tertulis. Jika tidak tertulis, hubungan kerja dianggap PKWTT dengan seluruh konsekuensi yang menyertainya.",
          "Perusahaan juga perlu mencatat masa kontrak dan perpanjangan secara rapi agar tidak melewati batas total masa PKWT yang diperbolehkan.",
        ],
      },
      {
        heading: "Langkah praktis bagi perusahaan",
        paragraphs: [
          "Audit seluruh perjanjian kerja yang berjalan, lalu kelompokkan berdasarkan sifat pekerjaan: sementara, musiman, atau berkelanjutan.",
          "Setelah itu susun template terpisah untuk masing-masing kelompok agar tim rekrutmen tidak salah memakai dokumen.",
        ],
      },

    ],
  },
  {
    slug: "memeriksa-legalitas-properti-sebelum-membeli",
    title: "Cara Memeriksa Legalitas Properti Sebelum Membeli",
    category: "Properti",
    excerpt: "Pemeriksaan dokumen selama satu hari dapat mencegah sengketa yang memakan waktu bertahun-tahun.",
    readTime: "8 menit",
    date: "2026-07-22",
    author: "Cempaka Ayu Lestari, S.H., M.Kn.",
    content: [
      {
        heading: "Mulai dari sertifikat",
        paragraphs: [
          "Periksa jenis hak yang tertera pada sertifikat, nama pemegang hak, luas, dan batas bidang tanah. Pastikan data cocok dengan kondisi fisik di lapangan.",
          "Ajukan pengecekan keaslian sertifikat ke kantor pertanahan setempat. Langkah ini murah, cepat, dan menutup banyak celah risiko.",
        ],
      },
      {
        heading: "Cek pembebanan dan sengketa",
        paragraphs: [
          "Pastikan tanah tidak sedang dijaminkan, disita, atau menjadi objek perkara. Riwayat pembebanan biasanya tercatat pada buku tanah.",
          "Tanyakan juga kepada tetangga sekitar. Informasi lapangan sering mengungkap sengketa batas yang belum tercatat resmi.",
        ],
      },
      {
        heading: "Susun perjanjian yang aman",
        paragraphs: [
          "Gunakan perjanjian pengikatan jual beli dengan syarat pembayaran bertahap yang terkait pada penyelesaian dokumen.",
          "Cantumkan sanksi bila penjual gagal menyerahkan dokumen sesuai jadwal agar posisi pembeli terlindungi.",
        ],
      },
    ],
  },
  {
    slug: "memilih-badan-usaha-untuk-bisnis-baru",
    title: "Memilih Badan Usaha yang Tepat untuk Bisnis Baru",
    category: "Usaha",
    excerpt: "PT, CV, atau usaha perorangan — pilihan ini menentukan tanggung jawab, pajak, dan peluang pendanaan Anda.",
    readTime: "6 menit",
    date: "2026-08-27",
    author: "Fajar Maulana, S.H., LL.M.",
    content: [
      {
        heading: "Pertimbangkan tanggung jawab",
        paragraphs: [
          "Perseroan terbatas memisahkan harta pribadi pendiri dari harta perusahaan. Pada CV, sekutu aktif menanggung risiko sampai harta pribadi.",
          "Jika bisnis Anda berisiko tinggi atau melibatkan kontrak bernilai besar, pemisahan tanggung jawab menjadi alasan kuat memilih PT.",
        ],
      },
      {
        heading: "Rencana pendanaan",
        paragraphs: [
          "Investor institusional umumnya hanya masuk ke PT karena struktur saham memudahkan pencatatan kepemilikan dan pengalihan.",
          "Bila pendanaan berasal dari kas internal atau keluarga, bentuk yang lebih sederhana bisa cukup pada tahap awal.",
        ],
      },
      {
        heading: "Biaya dan kepatuhan",
        paragraphs: [
          "Hitung biaya pendirian sekaligus biaya kepatuhan tahunan seperti laporan pajak dan pembaruan perizinan.",
          "Memilih bentuk yang terlalu kompleks di awal dapat menyita waktu pendiri yang seharusnya dipakai membangun produk.",
        ],
      },
    ],
  },
  {
    slug: "perjanjian-pra-nikah-bukan-tanda-tidak-percaya",
    title: "Perjanjian Pra Nikah Bukan Tanda Tidak Percaya",
    category: "Keluarga",
    excerpt: "Perjanjian ini justru membuat pembicaraan keuangan rumah tangga menjadi lebih terbuka sejak awal.",
    readTime: "5 menit",
    date: "2026-08-11",
    author: "Elvira Rahmawati, S.H., M.H.",
    content: [
      {
        heading: "Fungsi utamanya",
        paragraphs: [
          "Perjanjian pra nikah mengatur status harta bawaan dan tanggung jawab utang, sehingga tidak ada kebingungan bila terjadi hal yang tidak diinginkan.",
          "Bagi pasangan yang keduanya memiliki usaha, perjanjian ini melindungi mitra bisnis masing-masing dari dampak persoalan rumah tangga.",
        ],
      },
      {
        heading: "Prosedur yang harus dipenuhi",
        paragraphs: [
          "Perjanjian harus dibuat sebelum pernikahan berlangsung, dituangkan dalam akta notaris, lalu dicatatkan pada instansi pencatatan pernikahan.",
          "Tanpa pencatatan, perjanjian berpotensi tidak mengikat pihak ketiga seperti bank atau kreditur.",
        ],
      },
      {
        heading: "Cara membicarakannya",
        paragraphs: [
          "Ajukan pembahasan jauh sebelum tanggal pernikahan agar tidak terasa mendesak dan emosional.",
          "Fokus pada tujuan bersama: kejelasan, bukan kecurigaan. Kejelasan justru menurunkan potensi konflik di kemudian hari.",
        ],
      },
    ],
  },
  {
    slug: "denda-keterlambatan-dalam-kontrak",
    title: "Menyusun Denda Keterlambatan yang Wajar dalam Kontrak",
    category: "Kontrak",
    excerpt: "Denda terlalu kecil tidak menimbulkan efek, terlalu besar berisiko dianggap tidak proporsional.",
    readTime: "5 menit",
    date: "2026-07-08",
    author: "Daniel Sitorus, S.H.",
    content: [
      {
        heading: "Tetapkan dasar perhitungan",
        paragraphs: [
          "Denda umumnya dihitung dari nilai pekerjaan yang terlambat, bukan nilai keseluruhan kontrak. Dasar ini perlu ditulis eksplisit.",
          "Sertakan batas maksimum denda, misalnya lima persen dari nilai kontrak, agar sanksi tetap proporsional.",
        ],
      },
      {
        heading: "Bedakan keterlambatan dan kegagalan",
        paragraphs: [
          "Keterlambatan dikenai denda harian, sedangkan kegagalan total menyediakan hak pengakhiran dan ganti kerugian.",
          "Pisahkan pula keadaan memaksa yang di luar kendali pihak pelaksana agar klausul tetap adil.",
        ],
      },
      {
        heading: "Buat mekanisme penagihan",
        paragraphs: [
          "Tentukan cara pemotongan denda: langsung dari tagihan berikutnya atau ditagih terpisah dengan tenggat pembayaran.",
          "Mekanisme yang jelas mencegah denda menjadi sumber sengketa baru.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

export const plans: Plan[] = [
  {
    id: "dasar",
    name: "Dasar",
    price: 0,
    period: "selamanya",
    tagline: "Untuk kebutuhan dokumen sesekali.",
    features: [
      "1 dokumen aktif per bulan",
      "Akses seluruh katalog template",
      "Pratinjau A4 sebelum unduh",
      "Unduhan dengan tanda pratinjau",
    ],
    cta: "Mulai gratis",
  },
  {
    id: "profesional",
    name: "Profesional",
    price: 149000,
    period: "bulan",
    tagline: "Untuk pemilik usaha dan tim kecil.",
    features: [
      "Dokumen tanpa batas",
      "Unduh PDF dan DOCX tanpa tanda air",
      "Riwayat revisi 12 bulan",
      "1 sesi konsultasi 30 menit per bulan",
      "Dukungan prioritas dalam 4 jam kerja",
    ],
    highlight: true,
    cta: "Pilih Profesional",
  },
  {
    id: "korporat",
    name: "Korporat",
    price: 599000,
    period: "bulan",
    tagline: "Untuk perusahaan dengan banyak pengguna.",
    features: [
      "Hingga 15 akun pengguna",
      "Template khusus sesuai kebijakan internal",
      "4 sesi konsultasi per bulan",
      "Jejak audit dan persetujuan bertingkat",
      "Manajer akun khusus",
    ],
    cta: "Hubungi tim kami",
  },
];

export const faqs: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "Dokumen",
    items: [
      {
        q: "Apakah dokumen yang dihasilkan sah secara hukum?",
        a: "Template disusun mengikuti ketentuan hukum Indonesia yang berlaku umum. Dokumen menjadi mengikat setelah ditandatangani para pihak, dan untuk dokumen tertentu perlu pengesahan notaris. LegalDoc adalah demo produk, sehingga hasil unduhan bersifat simulasi.",
      },
      {
        q: "Bisakah saya mengubah dokumen setelah selesai dibuat?",
        a: "Ya. Setiap dokumen tersimpan di dasbor Anda dan dapat dibuka kembali, disunting, lalu diunduh ulang tanpa mengulangi seluruh langkah.",
      },
      {
        q: "Format apa yang tersedia untuk unduhan?",
        a: "PDF siap cetak dan DOCX yang dapat disunting kembali. Paket Dasar menyertakan tanda pratinjau pada hasil unduhan.",
      },
    ],
  },
  {
    category: "Konsultasi",
    items: [
      {
        q: "Bagaimana cara memesan sesi konsultasi?",
        a: "Pilih konsultan pada halaman Konsultasi, tekan Jadwalkan Sesi, lalu tentukan tanggal, jam, dan metode sesi berupa chat, panggilan video, atau tatap muka.",
      },
      {
        q: "Apakah pembicaraan dengan konsultan dijaga kerahasiaannya?",
        a: "Ya. Setiap konsultan terikat kewajiban kerahasiaan profesi, dan riwayat percakapan hanya dapat diakses oleh Anda serta konsultan terkait.",
      },
      {
        q: "Bisakah saya menjadwalkan ulang sesi?",
        a: "Penjadwalan ulang dapat dilakukan paling lambat 6 jam sebelum sesi berlangsung melalui halaman detail pesanan di dasbor.",
      },
    ],
  },
  {
    category: "Pembayaran & Akun",
    items: [
      {
        q: "Apakah ada masa percobaan untuk paket berlangganan?",
        a: "Paket Profesional dapat dicoba selama 7 hari. Anda dapat berhenti kapan pun sebelum masa percobaan berakhir tanpa biaya.",
      },
      {
        q: "Metode pembayaran apa yang didukung?",
        a: "Transfer bank, kartu kredit, serta dompet digital. Pada versi demo ini seluruh proses pembayaran hanya disimulasikan.",
      },
      {
        q: "Bagaimana cara menghapus akun saya?",
        a: "Buka Pengaturan, pilih Zona Berbahaya, lalu tekan Hapus Akun. Anda akan diminta mengonfirmasi sebelum data dihapus.",
      },
    ],
  },
];

export interface UserDocument {
  id: string;
  title: string;
  slug: string;
  status: "Selesai" | "Draf" | "Ditinjau";
  updatedAt: string;
  progress: number;
}

export const userDocuments: UserDocument[] = [
  { id: "DOC-2431", title: "Perjanjian Kerja Sama Bisnis", slug: "perjanjian-kerja-sama", status: "Selesai", updatedAt: "2026-08-29", progress: 100 },
  { id: "DOC-2428", title: "Perjanjian Kerja Waktu Tertentu (PKWT)", slug: "perjanjian-kerja-waktu-tertentu", status: "Draf", updatedAt: "2026-08-27", progress: 66 },
  { id: "DOC-2415", title: "Perjanjian Kerahasiaan (NDA)", slug: "nda-kerahasiaan", status: "Selesai", updatedAt: "2026-08-20", progress: 100 },
  { id: "DOC-2402", title: "Perjanjian Sewa Rumah", slug: "perjanjian-sewa-rumah", status: "Ditinjau", updatedAt: "2026-08-15", progress: 90 },
  { id: "DOC-2390", title: "Surat Kuasa Khusus", slug: "surat-kuasa-khusus", status: "Draf", updatedAt: "2026-08-09", progress: 33 },
];

export interface Booking {
  id: string;
  consultantId: string;
  date: string;
  time: string;
  method: "Chat" | "Panggilan Video" | "Tatap Muka";
  status: "Terjadwal" | "Selesai" | "Dibatalkan";
}

export const bookings: Booking[] = [
  { id: "SES-1189", consultantId: "adv-anindita", date: "2026-09-04", time: "10.30", method: "Panggilan Video", status: "Terjadwal" },
  { id: "SES-1172", consultantId: "adv-bramantyo", date: "2026-08-26", time: "14.00", method: "Chat", status: "Selesai" },
  { id: "SES-1150", consultantId: "adv-cempaka", date: "2026-08-12", time: "09.30", method: "Tatap Muka", status: "Selesai" },
];

export const chatTranscript = [
  { from: "consultant" as const, time: "10.31", text: "Selamat pagi, Pak Krisna. Saya sudah membaca ringkasan perkara yang Anda kirimkan tadi malam." },
  { from: "user" as const, time: "10.32", text: "Terima kasih. Yang saya khawatirkan klausul pembagian keuntungan dengan calon mitra." },
  { from: "consultant" as const, time: "10.33", text: "Betul, di draf saat ini keuntungan disebut tanpa definisi. Sebaiknya kita tegaskan bahwa yang dibagi adalah laba bersih setelah biaya operasional." },
  { from: "user" as const, time: "10.35", text: "Apakah perlu lampiran contoh perhitungan?" },
  { from: "consultant" as const, time: "10.36", text: "Sangat disarankan. Satu tabel sederhana biasanya cukup mencegah perbedaan tafsir pada pembayaran pertama." },
];

export const stats = [
  { label: "Dokumen dibuat", value: "128.400+" },
  { label: "Konsultan terverifikasi", value: "240" },
  { label: "Rata-rata penilaian", value: "4,9 / 5" },
  { label: "Waktu rata-rata penyusunan", value: "9 menit" },
];
