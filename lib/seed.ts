import mongoose from 'mongoose';
import { UserModel, TransactionModel, RequestModel, CardModel } from './db';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Clear existing data
    console.log('Clearing existing data...');
    await UserModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await RequestModel.deleteMany({});
    await CardModel.deleteMany({});

    console.log('Seeding users...');
    const users = await UserModel.create([
      {
        email: 'john@example.com',
        password: 'hashed_password_1', // In a real app, use bcrypt
        fullName: 'John Doe',
        role: 'user',
        balance: 23500, // 20000 base + 5000 credit - 1500 debit
        accountNumber: '1234567890',
        createdAt: new Date('2024-01-15'),
      },
      {
        email: 'jane@example.com',
        password: 'hashed_password_2',
        fullName: 'Jane Smith',
        role: 'user',
        balance: 15000,
        accountNumber: '0987654321',
        createdAt: new Date('2024-02-20'),
      },
      {
        email: 'admin@bank.com',
        password: 'admin_password',
        fullName: 'System Admin',
        role: 'admin',
        balance: 0,
        accountNumber: '0000000000',
        createdAt: new Date('2024-01-01'),
      }
    ]);

    const johnId = users[0]._id;

    console.log('Seeding transactions...');
    await TransactionModel.create([
      {
        userId: johnId,
        type: 'credit',
        amount: 5000,
        description: 'Salary deposit',
        date: new Date('2024-01-20'),
        status: 'completed',
      },
      {
        userId: johnId,
        type: 'debit',
        amount: 1500,
        description: 'Online shopping',
        date: new Date('2024-01-25'),
        status: 'completed',
      },
    ]);

    console.log('Seeding requests...');
    await RequestModel.create([
      {
        userId: johnId,
        type: 'deposit',
        amount: 3000,
        description: 'Bank transfer deposit',
        status: 'pending',
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date('2024-02-03'),
      },
    ]);

    console.log('Seeding cards...');
    await CardModel.create([
      {
        userId: johnId,
        cardNumber: '4532123456789012',
        cardType: 'debit',
        expiryDate: '12/26',
        holderName: 'John Doe',
        createdAt: new Date('2024-01-01'),
      },
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
