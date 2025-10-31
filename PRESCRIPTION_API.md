# 📋 Prescription Management API

Sistem manajemen resep obat untuk Apotekku Marketplace.

## 🎯 Fitur

### Customer (Pembeli)
- Upload resep dokter (dengan gambar)
- Lihat semua resep yang pernah diupload
- Update resep yang belum direview
- Hapus resep yang belum direview
- Tracking status resep (NEW → REVIEWED → APPROVED/REJECTED → DISPENSED)

### Apoteker
- Lihat semua resep dari semua customer
- Review resep (approve/reject)
- Tandai resep sebagai dispensed (obat sudah diberikan)

## 📊 Status Resep

| Status | Deskripsi |
|--------|-----------|
| `NEW` | Resep baru diupload, menunggu review apoteker |
| `REVIEWED` | (tidak digunakan) |
| `APPROVED` | Resep disetujui apoteker, siap diambil obatnya |
| `REJECTED` | Resep ditolak apoteker (dengan catatan) |
| `DISPENSED` | Obat sudah diberikan ke customer |

## 🔐 API Endpoints

### Customer Endpoints

#### 1. Upload Resep Baru
```http
POST /api/prescriptions
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "patientName": "John Doe",
  "patientDOB": "1990-05-15",
  "patientPhone": "081234567890",
  "doctorName": "Dr. Jane Smith",
  "doctorLicense": "SIP123456",
  "imageUrl": "https://cloudinary.com/resep.jpg",
  "lines": [
    {
      "productId": "60d5f8f8f8f8f8f8f8f8f8f8",
      "dose": "500mg",
      "frequency": "3x sehari",
      "duration": "7 hari",
      "notes": "Setelah makan"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "patientName": "John Doe",
    "status": "NEW",
    "lines": [...],
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

#### 2. Lihat Resep Saya
```http
GET /api/prescriptions/my
Authorization: Bearer <customer_token>

# Dengan filter status
GET /api/prescriptions/my?status=APPROVED
```

#### 3. Detail Resep
```http
GET /api/prescriptions/:id
Authorization: Bearer <customer_token>
```

#### 4. Update Resep (hanya status NEW)
```http
PUT /api/prescriptions/:id
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "patientName": "John Doe Updated",
  "lines": [...]
}
```

#### 5. Hapus Resep (hanya status NEW)
```http
DELETE /api/prescriptions/:id
Authorization: Bearer <customer_token>
```

### Apoteker Endpoints

#### 1. Lihat Semua Resep
```http
GET /api/prescriptions
Authorization: Bearer <staff_token>

# Dengan filter dan pagination
GET /api/prescriptions?status=NEW&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

#### 2. Review Resep (Approve/Reject)
```http
PATCH /api/prescriptions/:id/review
Authorization: Bearer <apoteker_token>
Content-Type: application/json

{
  "status": "APPROVED",
  "reviewNotes": "Resep valid, stok tersedia"
}

# Atau reject
{
  "status": "REJECTED",
  "reviewNotes": "Dosis tidak sesuai, harap konsultasi dokter lagi"
}
```

#### 3. Tandai Obat Sudah Diberikan
```http
PATCH /api/prescriptions/:id/dispense
Authorization: Bearer <apoteker_token>
```

## 📝 Model Schema

```typescript
interface IPrescriptionLine {
  productId: ObjectId;  // Referensi ke Product
  dose: string;         // Contoh: "500mg", "1 tablet"
  frequency: string;    // Contoh: "3x sehari", "Setiap 8 jam"
  duration: string;     // Contoh: "7 hari", "Sampai habis"
  notes?: string;       // Catatan tambahan
}

interface IPrescription {
  patientName: string;
  patientDOB?: Date;
  patientPhone?: string;
  doctorName: string;
  doctorLicense?: string;
  imageUrl?: string;           // URL gambar resep
  lines: IPrescriptionLine[];  // Minimal 1 obat
  status: 'NEW' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'DISPENSED';
  reviewedBy?: ObjectId;       // User (apoteker) yang review
  reviewNotes?: string;
  reviewedAt?: Date;
  dispensedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔄 Flow Penggunaan

### Customer Flow
1. **Upload Resep**
   - Customer foto resep dokter
   - Upload ke cloud storage (Cloudinary/dll)
   - Submit form dengan imageUrl dan detail obat
   
2. **Menunggu Review**
   - Status: `NEW`
   - Customer bisa edit/hapus resep selagi masih NEW
   
3. **Review Selesai**
   - Status: `APPROVED` → Customer bisa datang ke apotek ambil obat
   - Status: `REJECTED` → Customer perlu konsultasi dokter lagi
   
4. **Ambil Obat**
   - Customer datang ke apotek
   - Apoteker verifikasi dan berikan obat
   - Status: `DISPENSED`

### Apoteker Flow
1. **Lihat Resep Baru**
   - Filter status=NEW
   - Lihat detail resep dan foto
   
2. **Validasi Resep**
   - Cek keabsahan resep
   - Cek ketersediaan stok
   - Cek dosis dan interaksi obat
   
3. **Review**
   - **Approve**: Jika valid dan stok tersedia
   - **Reject**: Jika ada masalah, berikan catatan
   
4. **Dispensing**
   - Customer datang
   - Siapkan obat sesuai resep
   - Mark as DISPENSED

## 🚀 Contoh Penggunaan di Frontend

### Upload Resep dengan Gambar
```typescript
// 1. Upload gambar ke Cloudinary
const formData = new FormData();
formData.append('file', imageFile);
formData.append('upload_preset', 'prescriptions');

const cloudinaryResponse = await fetch(
  'https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload',
  { method: 'POST', body: formData }
);
const { secure_url } = await cloudinaryResponse.json();

// 2. Submit prescription
const response = await fetch('/api/prescriptions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    patientName: 'John Doe',
    doctorName: 'Dr. Jane Smith',
    imageUrl: secure_url,
    lines: [
      {
        productId: selectedProduct._id,
        dose: '500mg',
        frequency: '3x sehari',
        duration: '7 hari'
      }
    ]
  })
});
```

### Tracking Status Resep
```typescript
const prescriptions = await fetch('/api/prescriptions/my', {
  headers: { 'Authorization': `Bearer ${token}` }
});

prescriptions.data.forEach(rx => {
  switch(rx.status) {
    case 'NEW':
      console.log('⏳ Menunggu review apoteker');
      break;
    case 'APPROVED':
      console.log('✅ Resep disetujui, silakan ambil di apotek');
      break;
    case 'REJECTED':
      console.log('❌ Resep ditolak:', rx.reviewNotes);
      break;
    case 'DISPENSED':
      console.log('📦 Obat sudah diterima');
      break;
  }
});
```

## ⚠️ Validasi & Error Handling

### Upload Prescription
- ❌ `lines` harus minimal 1 obat
- ❌ Semua `productId` harus valid (ada di database)
- ❌ `patientName` dan `doctorName` wajib diisi

### Update Prescription
- ❌ Hanya resep dengan status `NEW` yang bisa diupdate
- ❌ Jika sudah direview, tidak bisa diubah

### Delete Prescription
- ❌ Hanya resep dengan status `NEW` yang bisa dihapus

### Review Prescription
- ❌ Status harus `APPROVED` atau `REJECTED`
- ❌ Hanya resep dengan status `NEW` yang bisa direview
- ❌ Hanya user dengan role `apoteker` yang bisa review

### Dispense Prescription
- ❌ Hanya resep dengan status `APPROVED` yang bisa di-dispense
- ❌ Hanya user dengan role `apoteker` yang bisa dispense

## 🎨 UI Components yang Dibutuhkan

### Customer Interface
1. **Upload Form**
   - Image upload (drag & drop)
   - Patient info form
   - Doctor info form
   - Product selector dengan dose/frequency/duration

2. **Prescription List**
   - Card view dengan status badge
   - Filter by status
   - Search by patient/doctor name

3. **Prescription Detail**
   - Image preview (zoom)
   - Product list dengan dosage
   - Status timeline
   - Review notes (jika rejected)

### Apoteker Interface
1. **Review Queue**
   - List resep NEW dengan prioritas
   - Quick stats (pending, approved today, etc)
   
2. **Review Modal**
   - Image viewer
   - Product availability checker
   - Approve/Reject buttons
   - Notes textarea

3. **Dispense Interface**
   - Scan QR/barcode
   - Mark as dispensed
   - Print receipt

## 📱 Notification Ideas
- Customer dapat notif saat resep direview (approved/rejected)
- Apoteker dapat notif saat ada resep baru
- Customer dapat notif reminder jika obat sudah bisa diambil

## 🔒 Security Notes
- Customer hanya bisa lihat resep miliknya sendiri
- Apoteker bisa lihat semua resep
- Admin bisa lihat semua resep
- Image URL harus dari sumber terpercaya (Cloudinary dengan signed upload)
