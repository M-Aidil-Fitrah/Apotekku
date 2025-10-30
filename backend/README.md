# Apotekku Backend API

Backend API untuk sistem manajemen apotek menggunakan Express.js, TypeScript, dan MongoDB.

## 🚀 Fitur

### MVP (Minimum Viable Product)
- ✅ **Authentication & Authorization** (JWT + RBAC)
  - Login untuk Admin, Kasir, Apoteker
  - Role-based access control
  
- ✅ **Katalog Obat**
  - CRUD obat dengan kategori (OTC/Etikal/Herbal)
  - Pencarian dan filter
  - Tracking batch dan expired date

- ✅ **POS (Point of Sale)**
  - Cart management
  - Diskon dan pajak
  - Multiple payment methods
  - FEFO (First Expired First Out) stock allocation

- ✅ **Manajemen Stok**
  - Batch tracking
  - Stock movement tracking
  - Purchase order & receiving

- ✅ **Pemasok (Supplier)**
  - CRUD supplier
  - Link dengan purchase order

## 📋 Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x (local atau MongoDB Atlas)
- npm atau yarn

## 🛠️ Installation

1. **Clone repository**
```bash
cd backend
```

2. **Install dependencies**
```powershell
npm install
```

3. **Setup environment variables**
```powershell
cp .env.example .env
```

Edit `.env` dan sesuaikan dengan konfigurasi Anda:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/apotekku
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

4. **Seed database (optional)**
```powershell
npm run seed
```

5. **Run development server**
```powershell
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user info
POST   /api/auth/register    - Register new user (admin only)
```

### Medicines
```
GET    /api/medicines                - Get all medicines (with pagination & filters)
GET    /api/medicines/:id            - Get medicine by ID
GET    /api/medicines/:id/batches    - Get batches for medicine
POST   /api/medicines                - Create medicine (admin/apoteker)
PUT    /api/medicines/:id            - Update medicine (admin/apoteker)
DELETE /api/medicines/:id            - Delete medicine (admin/apoteker)
```

### Purchases
```
GET    /api/purchases           - Get all purchase orders
GET    /api/purchases/:id       - Get purchase by ID
POST   /api/purchases           - Create purchase order
POST   /api/purchases/:id/receive  - Receive purchase (update stock)
```

### Sales
```
GET    /api/sales              - Get all sales
GET    /api/sales/:id          - Get sale by ID
POST   /api/sales              - Create new sale (POS)
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── medicineController.ts
│   │   ├── purchaseController.ts
│   │   └── saleController.ts
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── rbac.ts              # Role-based access control
│   │   ├── validate.ts          # Zod validation
│   │   └── errorHandler.ts      # Global error handling
│   ├── models/
│   │   ├── User.ts
│   │   ├── Medicine.ts
│   │   ├── Batch.ts
│   │   ├── Supplier.ts
│   │   ├── Purchase.ts
│   │   ├── Sale.ts
│   │   ├── SaleItem.ts
│   │   ├── Prescription.ts
│   │   ├── StockMovement.ts
│   │   └── AuditLog.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── medicineRoutes.ts
│   │   ├── purchaseRoutes.ts
│   │   └── saleRoutes.ts
│   ├── scripts/
│   │   └── seed.ts              # Database seeding
│   ├── utils/
│   │   ├── auth.ts              # Password hashing, JWT
│   │   ├── stock.ts             # FEFO, stock calculation
│   │   ├── audit.ts             # Audit logging
│   │   └── helpers.ts           # General helpers
│   └── server.ts                # App entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Test Credentials

Setelah menjalankan `npm run seed`:

- **Admin**: `admin@apotekku.com` / `password123`
- **Apoteker**: `apoteker@apotekku.com` / `password123`
- **Kasir**: `kasir@apotekku.com` / `password123`

## 🧪 Testing

```powershell
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Build & Production

```powershell
# Build TypeScript
npm run build

# Run production server
npm start
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Helmet.js for security headers
- CORS configuration
- Role-based access control (RBAC)
- Input validation with Zod
- MongoDB transactions for critical operations

## 📊 Database Models

- **User** - Admin, Apoteker, Kasir
- **Medicine** - Katalog obat
- **Batch** - Batch tracking dengan expired date
- **Supplier** - Data pemasok
- **Purchase** - Purchase order & penerimaan
- **Sale** - Transaksi penjualan
- **SaleItem** - Detail item penjualan
- **Prescription** - Resep dokter
- **StockMovement** - Tracking pergerakan stok
- **AuditLog** - Log aktivitas kritikal

## 📝 License

MIT

## 👨‍💻 Author

M. Aidil Fitrah
