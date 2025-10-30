import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apotekku';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Customer.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
    ]);

    // Create Admin Users
    console.log('👥 Creating admin users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        name: 'Admin Apotekku',
        email: 'admin@apotekku.com',
        passwordHash: hashedPassword,
        roles: ['admin', 'apoteker'],
        isActive: true,
      },
      {
        name: 'Apoteker Budi',
        email: 'apoteker@apotekku.com',
        passwordHash: hashedPassword,
        roles: ['apoteker'],
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${users.length} admin users`);

    // Create Demo Customers
    console.log('👤 Creating demo customers...');
    const customers = await Customer.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: hashedPassword,
        phone: '081234567890',
        addresses: [{
          label: 'Rumah',
          recipientName: 'John Doe',
          phone: '081234567890',
          address: 'Jl. Merdeka No. 123',
          city: 'Jakarta Pusat',
          province: 'DKI Jakarta',
          postalCode: '10110',
          isDefault: true,
        }],
        isActive: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: hashedPassword,
        phone: '082345678901',
        addresses: [{
          label: 'Rumah',
          recipientName: 'Jane Smith',
          phone: '082345678901',
          address: 'Jl. Sudirman No. 456',
          city: 'Jakarta Selatan',
          province: 'DKI Jakarta',
          postalCode: '12190',
          isDefault: true,
        }],
        allergies: ['Penisilin'],
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${customers.length} demo customers`);

    // Create Categories
    console.log('📂 Creating categories...');
    const categories = await Category.create([
      {
        name: 'Obat Resep',
        slug: 'obat-resep',
        description: 'Obat yang memerlukan resep dokter',
        icon: 'prescription',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Obat Bebas',
        slug: 'obat-bebas',
        description: 'Obat yang dapat dibeli tanpa resep',
        icon: 'pill',
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Vitamin & Suplemen',
        slug: 'vitamin-suplemen',
        description: 'Vitamin dan suplemen kesehatan',
        icon: 'vitamin',
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Alat Kesehatan',
        slug: 'alat-kesehatan',
        description: 'Alat kesehatan dan medis',
        icon: 'medical',
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Perawatan Kulit',
        slug: 'perawatan-kulit',
        description: 'Produk perawatan kulit',
        icon: 'skincare',
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Ibu & Anak',
        slug: 'ibu-anak',
        description: 'Produk untuk ibu dan anak',
        icon: 'baby',
        sortOrder: 6,
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create Products
    console.log('💊 Creating products...');
    const products = await Product.create([
      // Obat Resep
      {
        name: 'Amoxicillin 500mg',
        slug: 'amoxicillin-500mg',
        sku: 'AMX-500',
        description: 'Antibiotik untuk infeksi bakteri. Harus dikonsumsi sesuai resep dokter hingga habis.',
        shortDescription: 'Antibiotik untuk infeksi bakteri',
        categoryId: categories[0]._id,
        price: 15000,
        comparePrice: 20000,
        costPrice: 10000,
        stockQuantity: 100,
        lowStockThreshold: 20,
        mainImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
          'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
        ],
        requiresPrescription: true,
        activeIngredient: 'Amoxicillin',
        dosageForm: 'Kapsul',
        strength: '500mg',
        manufacturer: 'Kimia Farma',
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Metformin 850mg',
        slug: 'metformin-850mg',
        sku: 'MET-850',
        description: 'Obat untuk diabetes tipe 2. Membantu mengontrol kadar gula darah.',
        shortDescription: 'Obat diabetes',
        categoryId: categories[0]._id,
        price: 25000,
        comparePrice: 30000,
        costPrice: 18000,
        stockQuantity: 80,
        mainImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400',
        images: ['https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800'],
        requiresPrescription: true,
        activeIngredient: 'Metformin HCl',
        dosageForm: 'Tablet',
        strength: '850mg',
        manufacturer: 'Dexa Medica',
        isFeatured: true,
        isActive: true,
      },
      
      // Obat Bebas
      {
        name: 'Paracetamol 500mg',
        slug: 'paracetamol-500mg',
        sku: 'PARA-500',
        description: 'Pereda demam dan nyeri. Aman untuk dewasa dan anak-anak. Diminum setelah makan.',
        shortDescription: 'Pereda demam dan nyeri',
        categoryId: categories[1]._id,
        price: 5000,
        costPrice: 3000,
        stockQuantity: 200,
        mainImage: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
        images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800'],
        requiresPrescription: false,
        activeIngredient: 'Paracetamol',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'Kimia Farma',
        isFeatured: true,
        soldCount: 150,
        rating: 4.8,
        reviewCount: 45,
        isActive: true,
      },
      {
        name: 'Antasida Tablet',
        slug: 'antasida-tablet',
        sku: 'ANT-TAB',
        description: 'Meredakan sakit maag, kembung, dan perut tidak nyaman. Efektif dan cepat bekerja.',
        shortDescription: 'Obat maag',
        categoryId: categories[1]._id,
        price: 8000,
        costPrice: 5000,
        stockQuantity: 150,
        mainImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
        images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800'],
        requiresPrescription: false,
        dosageForm: 'Tablet',
        manufacturer: 'Tempo Scan',
        isFeatured: true,
        soldCount: 120,
        rating: 4.6,
        reviewCount: 38,
        isActive: true,
      },
      {
        name: 'OBH Sirup',
        slug: 'obh-sirup',
        sku: 'OBH-SYR',
        description: 'Sirup obat batuk untuk meredakan batuk berdahak. Rasa jeruk yang enak.',
        shortDescription: 'Obat batuk sirup',
        categoryId: categories[1]._id,
        price: 12000,
        costPrice: 8000,
        stockQuantity: 90,
        mainImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
        requiresPrescription: false,
        dosageForm: 'Sirup',
        manufacturer: 'Combiphar',
        soldCount: 85,
        rating: 4.5,
        reviewCount: 28,
        isActive: true,
      },
      
      // Vitamin & Suplemen
      {
        name: 'Vitamin C 1000mg',
        slug: 'vitamin-c-1000mg',
        sku: 'VITC-1000',
        description: 'Meningkatkan daya tahan tubuh. Mengandung vitamin C dosis tinggi untuk perlindungan maksimal.',
        shortDescription: 'Vitamin daya tahan tubuh',
        categoryId: categories[2]._id,
        price: 35000,
        comparePrice: 45000,
        costPrice: 25000,
        stockQuantity: 120,
        mainImage: 'https://images.unsplash.com/photo-1550572017-4a6a4d9b2945?w=400',
        images: ['https://images.unsplash.com/photo-1550572017-4a6a4d9a2945?w=800'],
        requiresPrescription: false,
        dosageForm: 'Tablet',
        strength: '1000mg',
        manufacturer: 'Wellness',
        isFeatured: true,
        soldCount: 200,
        rating: 4.9,
        reviewCount: 67,
        tags: ['vitamin', 'immunity', 'covid'],
        isActive: true,
      },
      {
        name: 'Multivitamin Daily',
        slug: 'multivitamin-daily',
        sku: 'MULTI-DAY',
        description: 'Multivitamin lengkap untuk kebutuhan harian. Mengandung vitamin A, B kompleks, C, D, E, dan mineral.',
        shortDescription: 'Multivitamin lengkap',
        categoryId: categories[2]._id,
        price: 50000,
        comparePrice: 65000,
        costPrice: 35000,
        stockQuantity: 100,
        mainImage: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=400',
        images: ['https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800'],
        requiresPrescription: false,
        dosageForm: 'Tablet',
        manufacturer: 'Wellness',
        isFeatured: true,
        soldCount: 145,
        rating: 4.7,
        reviewCount: 52,
        tags: ['multivitamin', 'daily'],
        isActive: true,
      },
      {
        name: 'Omega-3 Fish Oil',
        slug: 'omega-3-fish-oil',
        sku: 'OMEGA-3',
        description: 'Suplemen omega-3 untuk kesehatan jantung dan otak. Dari minyak ikan laut dalam berkualitas.',
        shortDescription: 'Suplemen omega-3',
        categoryId: categories[2]._id,
        price: 75000,
        comparePrice: 90000,
        costPrice: 55000,
        stockQuantity: 60,
        mainImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
        images: ['https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800'],
        requiresPrescription: false,
        dosageForm: 'Kapsul',
        strength: '1000mg',
        manufacturer: 'Wellness',
        soldCount: 78,
        rating: 4.6,
        reviewCount: 34,
        tags: ['omega3', 'heart', 'brain'],
        isActive: true,
      },
      
      // Alat Kesehatan
      {
        name: 'Termometer Digital',
        slug: 'termometer-digital',
        sku: 'TERMO-DIG',
        description: 'Termometer digital akurat dan cepat. Hasil dalam 10 detik. Cocok untuk seluruh keluarga.',
        shortDescription: 'Termometer digital cepat',
        categoryId: categories[3]._id,
        price: 45000,
        comparePrice: 60000,
        costPrice: 30000,
        stockQuantity: 50,
        mainImage: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400',
        images: ['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800'],
        requiresPrescription: false,
        manufacturer: 'Omron',
        isFeatured: true,
        soldCount: 95,
        rating: 4.8,
        reviewCount: 41,
        tags: ['thermometer', 'digital', 'fever'],
        isActive: true,
      },
      {
        name: 'Tensimeter Digital',
        slug: 'tensimeter-digital',
        sku: 'TENSI-DIG',
        description: 'Alat ukur tekanan darah digital otomatis. Layar besar, mudah dibaca. Memori hingga 60 pengukuran.',
        shortDescription: 'Alat ukur tekanan darah',
        categoryId: categories[3]._id,
        price: 250000,
        comparePrice: 300000,
        costPrice: 180000,
        stockQuantity: 30,
        mainImage: 'https://images.unsplash.com/photo-1598974357801-cbf3b0cb3f08?w=400',
        images: ['https://images.unsplash.com/photo-1598974357801-cbf3b0cb3f08?w=800'],
        requiresPrescription: false,
        manufacturer: 'Omron',
        soldCount: 45,
        rating: 4.9,
        reviewCount: 28,
        tags: ['blood pressure', 'monitor'],
        isActive: true,
      },
      {
        name: 'Masker KN95',
        slug: 'masker-kn95',
        sku: 'MASK-KN95',
        description: 'Masker KN95 5 lapis. Filtrasi tinggi, nyaman dipakai seharian. Isi 10 pcs per box.',
        shortDescription: 'Masker medis 5 lapis',
        categoryId: categories[3]._id,
        price: 25000,
        costPrice: 15000,
        stockQuantity: 200,
        mainImage: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400',
        images: ['https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800'],
        requiresPrescription: false,
        manufacturer: 'Sensi',
        soldCount: 180,
        rating: 4.7,
        reviewCount: 89,
        tags: ['mask', 'covid', 'protection'],
        isActive: true,
      },
      
      // Perawatan Kulit
      {
        name: 'Sunscreen SPF 50+',
        slug: 'sunscreen-spf-50',
        sku: 'SUN-50',
        description: 'Tabir surya SPF 50+ PA++++. Melindungi dari UVA dan UVB. Non-greasy, cocok untuk kulit berminyak.',
        shortDescription: 'Tabir surya SPF 50+',
        categoryId: categories[4]._id,
        price: 65000,
        comparePrice: 80000,
        costPrice: 45000,
        stockQuantity: 80,
        mainImage: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'],
        requiresPrescription: false,
        manufacturer: 'Emina',
        isFeatured: true,
        soldCount: 112,
        rating: 4.8,
        reviewCount: 56,
        tags: ['sunscreen', 'skincare', 'spf'],
        isActive: true,
      },
      {
        name: 'Acne Cream',
        slug: 'acne-cream',
        sku: 'ACNE-CRM',
        description: 'Krim jerawat dengan salicylic acid. Mengurangi jerawat, mengontrol minyak, dan memperbaiki tekstur kulit.',
        shortDescription: 'Krim anti jerawat',
        categoryId: categories[4]._id,
        price: 45000,
        comparePrice: 55000,
        costPrice: 30000,
        stockQuantity: 70,
        mainImage: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400',
        images: ['https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800'],
        requiresPrescription: false,
        activeIngredient: 'Salicylic Acid 2%',
        manufacturer: 'Wardah',
        soldCount: 98,
        rating: 4.6,
        reviewCount: 47,
        tags: ['acne', 'skincare', 'treatment'],
        isActive: true,
      },
      
      // Ibu & Anak
      {
        name: 'Susu Formula Bayi 0-6 bulan',
        slug: 'susu-formula-bayi-0-6',
        sku: 'MILK-06',
        description: 'Susu formula untuk bayi usia 0-6 bulan. Diperkaya DHA, AA, dan prebiotik untuk tumbuh kembang optimal.',
        shortDescription: 'Susu formula bayi 0-6 bulan',
        categoryId: categories[5]._id,
        price: 150000,
        comparePrice: 175000,
        costPrice: 120000,
        stockQuantity: 60,
        mainImage: 'https://images.unsplash.com/photo-1609017081299-3efd4d0d77f2?w=400',
        images: ['https://images.unsplash.com/photo-1609017081299-3efd4d0d77f2?w=800'],
        requiresPrescription: false,
        dosageForm: 'Bubuk',
        manufacturer: 'Nestle',
        isFeatured: true,
        soldCount: 67,
        rating: 4.9,
        reviewCount: 35,
        tags: ['baby', 'formula', 'milk'],
        isActive: true,
      },
      {
        name: 'Vitamin Anak Sirup',
        slug: 'vitamin-anak-sirup',
        sku: 'VIT-KIDS',
        description: 'Vitamin lengkap untuk anak usia 1-12 tahun. Rasa jeruk yang disukai anak. Meningkatkan nafsu makan.',
        shortDescription: 'Vitamin anak rasa jeruk',
        categoryId: categories[5]._id,
        price: 35000,
        costPrice: 25000,
        stockQuantity: 90,
        mainImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
        images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800'],
        requiresPrescription: false,
        dosageForm: 'Sirup',
        manufacturer: 'Tempo Scan',
        soldCount: 89,
        rating: 4.7,
        reviewCount: 42,
        tags: ['kids', 'vitamin', 'syrup'],
        isActive: true,
      },
    ]);

    console.log(`✅ Created ${products.length} products`);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${users.length} admin users`);
    console.log(`   - ${customers.length} demo customers`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${products.length} products`);
    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@apotekku.com / password123');
    console.log('   Apoteker: apoteker@apotekku.com / password123');
    console.log('   Customer: john@example.com / password123');
    console.log('   Customer: jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
