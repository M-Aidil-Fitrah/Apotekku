import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Medicine } from '../models/Medicine';
import { Supplier } from '../models/Supplier';
import { Batch } from '../models/Batch';
import { hashPassword } from '../utils/auth';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI tidak ditemukan');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Medicine.deleteMany({}),
      Supplier.deleteMany({}),
      Batch.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create users
    const password = await hashPassword('password123');
    const users = await User.create([
      {
        name: 'Admin Apotek',
        email: 'admin@apotekku.com',
        passwordHash: password,
        roles: ['admin'],
        isActive: true,
      },
      {
        name: 'Apoteker Joko',
        email: 'apoteker@apotekku.com',
        passwordHash: password,
        roles: ['apoteker'],
        isActive: true,
      },
      {
        name: 'Kasir Siti',
        email: 'kasir@apotekku.com',
        passwordHash: password,
        roles: ['kasir'],
        isActive: true,
      },
    ]);
    console.log('👤 Created users');

    // Create suppliers
    const suppliers = await Supplier.create([
      {
        name: 'PT Kimia Farma',
        phone: '021-12345678',
        address: 'Jakarta Pusat',
        email: 'sales@kimiafarma.co.id',
      },
      {
        name: 'PT Kalbe Farma',
        phone: '021-87654321',
        address: 'Jakarta Timur',
        email: 'order@kalbe.co.id',
      },
      {
        name: 'PT Sanbe Farma',
        phone: '022-11223344',
        address: 'Bandung',
        email: 'info@sanbe.co.id',
      },
    ]);
    console.log('🏢 Created suppliers');

    // Create medicines
    const medicines = await Medicine.create([
      {
        name: 'Paracetamol 500mg',
        sku: 'MED-001',
        category: 'OTC',
        dosageForm: 'tablet',
        sellingPrice: 5000,
        minStock: 50,
        isPrescriptionOnly: false,
        description: 'Obat penurun panas dan pereda nyeri',
        composition: 'Paracetamol 500mg',
      },
      {
        name: 'Amoxicillin 500mg',
        sku: 'MED-002',
        category: 'Etikal',
        dosageForm: 'kapsul',
        sellingPrice: 15000,
        minStock: 30,
        isPrescriptionOnly: true,
        description: 'Antibiotik untuk infeksi bakteri',
        composition: 'Amoxicillin 500mg',
      },
      {
        name: 'OBH Combi',
        sku: 'MED-003',
        category: 'OTC',
        dosageForm: 'sirup',
        sellingPrice: 25000,
        minStock: 20,
        isPrescriptionOnly: false,
        description: 'Obat batuk flu',
      },
      {
        name: 'Omeprazole 20mg',
        sku: 'MED-004',
        category: 'Etikal',
        dosageForm: 'kapsul',
        sellingPrice: 12000,
        minStock: 40,
        isPrescriptionOnly: true,
        description: 'Obat maag dan asam lambung',
      },
      {
        name: 'Vitamin C 1000mg',
        sku: 'MED-005',
        category: 'OTC',
        dosageForm: 'tablet',
        sellingPrice: 30000,
        minStock: 50,
        isPrescriptionOnly: false,
        description: 'Suplemen vitamin C',
      },
    ]);
    console.log('💊 Created medicines');

    // Create batches for medicines
    const batches = [];
    for (let i = 0; i < medicines.length; i++) {
      const medicine = medicines[i];
      const supplier = suppliers[i % suppliers.length];

      // Create 2-3 batches per medicine with different expiry dates
      for (let j = 0; j < 2; j++) {
        const expDate = new Date();
        expDate.setMonth(expDate.getMonth() + 6 + j * 6); // 6 months, 12 months

        batches.push({
          medicineId: medicine._id,
          batchNo: `BATCH-${medicine.sku}-${j + 1}`,
          expDate,
          qtyOnHand: 100 + j * 50,
          buyPrice: medicine.sellingPrice * 0.6, // 60% dari harga jual
          receivedAt: new Date(),
          supplierId: supplier._id,
        });
      }
    }

    await Batch.create(batches);
    console.log('📦 Created batches');

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📝 Test credentials:');
    console.log('Admin: admin@apotekku.com / password123');
    console.log('Apoteker: apoteker@apotekku.com / password123');
    console.log('Kasir: kasir@apotekku.com / password123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
