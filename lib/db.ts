import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.warn('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Connecting to MongoDB at:', MONGODB_URI.split('@')[1] || 'local');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      cached.promise = null;
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  accountNumber: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
});

// Request Schema
const RequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'card'], required: true },
  amount: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Card Schema
const CardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cardNumber: { type: String, required: true },
  cardType: { type: String, enum: ['credit', 'debit'], required: true },
  expiryDate: { type: String, required: true },
  holderName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Alert Schema
const AlertSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String },
  type: { type: String, required: true },
  message: { type: String, required: true },
  amount: { type: Number },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  createdAt: { type: Date, default: Date.now },
});

// SavingGoal Schema
const SavingGoalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  monthlyAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Models
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export const RequestModel = mongoose.models.Request || mongoose.model('Request', RequestSchema);
export const CardModel = mongoose.models.Card || mongoose.model('Card', CardSchema);
export const AlertModel = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);
export const SavingGoalModel = mongoose.models.SavingGoal || mongoose.model('SavingGoal', SavingGoalSchema);

export interface User {
  _id?: string;
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'admin';
  balance: number;
  accountNumber: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Transaction {
  _id?: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending';
}

export interface Request {
  _id?: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'card';
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  _id?: string;
  userId: string;
  cardNumber: string;
  cardType: 'credit' | 'debit';
  expiryDate: string;
  holderName: string;
  createdAt: Date;
}

export interface Alert {
  _id?: string;
  userId: string;
  userName?: string;
  type: string;
  message: string;
  amount?: number;
  status: 'unread' | 'read';
  createdAt: Date;
}

export interface SavingGoal {
  _id?: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyAmount: number;
  createdAt: Date;
}

// Database operations
export const db = {
  users: {
    find: async (query: Partial<User>) => {
      await connectDB();
      return UserModel.find(query).lean();
    },
    findById: async (id: string) => {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const user = await UserModel.findById(id).lean();
      if (user) user._id = user._id.toString();
      return user;
    },
    create: async (user: Omit<User, '_id'>) => {
      await connectDB();
      const newUser = await UserModel.create(user);
      const plainUser = newUser.toObject();
      plainUser._id = plainUser._id.toString();
      return plainUser;
    },
    updateOne: async (id: string, update: Partial<User>) => {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const user = await UserModel.findByIdAndUpdate(id, update, { new: true }).lean();
      if (user) user._id = user._id.toString();
      return user;
    },
    all: async () => {
      await connectDB();
      const users = await UserModel.find({}).lean();
      return users.map(u => ({ ...u, _id: u._id.toString() }));
    },
  },
  transactions: {
    find: async (query: Partial<Transaction>) => {
      await connectDB();
      const trans = await TransactionModel.find(query).sort({ date: -1 }).lean();
      return trans.map(t => ({ ...t, _id: t._id.toString() }));
    },
    create: async (transaction: Omit<Transaction, '_id'>) => {
      await connectDB();
      const newTrans = await TransactionModel.create(transaction);
      const plainTrans = newTrans.toObject();
      plainTrans._id = plainTrans._id.toString();
      return plainTrans;
    },
    updateOne: async (id: string, update: Partial<Transaction>) => {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const trans = await TransactionModel.findByIdAndUpdate(id, update, { new: true }).lean();
      if (trans) trans._id = trans._id.toString();
      return trans;
    },
    all: async () => {
      await connectDB();
      const trans = await TransactionModel.find({}).sort({ date: -1 }).lean();
      return trans.map(t => ({ ...t, _id: t._id.toString() }));
    },
  },
  requests: {
    find: async (query: Partial<Request>) => {
      await connectDB();
      const reqs = await RequestModel.find(query).sort({ createdAt: -1 }).lean();
      return reqs.map(r => ({ ...r, _id: r._id.toString() }));
    },
    findOneById: async (id: string) => {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const req = await RequestModel.findById(id).lean();
      if (req) req._id = req._id.toString();
      return req;
    },
    create: async (request: Omit<Request, '_id'>) => {
      await connectDB();
      const newReq = await RequestModel.create(request);
      const plainReq = newReq.toObject();
      plainReq._id = plainReq._id.toString();
      return plainReq;
    },
    updateOne: async (id: string, update: Partial<Request>) => {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const req = await RequestModel.findByIdAndUpdate(id, update, { new: true }).lean();
      if (req) req._id = req._id.toString();
      return req;
    },
    all: async () => {
      await connectDB();
      const reqs = await RequestModel.find({}).sort({ createdAt: -1 }).lean();
      return reqs.map(r => ({ ...r, _id: r._id.toString() }));
    },
  },
  cards: {
    find: async (query: Partial<Card>) => {
      await connectDB();
      const cards = await CardModel.find(query).lean();
      return cards.map(c => ({ ...c, _id: c._id.toString() }));
    },
    create: async (card: Omit<Card, '_id'>) => {
      await connectDB();
      const newCard = await CardModel.create(card);
      const plainCard = newCard.toObject();
      plainCard._id = plainCard._id.toString();
      return plainCard;
    },
    updateOne: async (id: string, update: Partial<Card>) => {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const card = await CardModel.findByIdAndUpdate(id, update, { new: true }).lean();
      if (card) card._id = card._id.toString();
      return card;
    },
    all: async () => {
      await connectDB();
      const cards = await CardModel.find({}).lean();
      return cards.map(c => ({ ...c, _id: c._id.toString() }));
    },
  },
  alerts: {
    find: async (query: Partial<Alert>) => {
      await connectDB();
      const alerts = await AlertModel.find(query).sort({ createdAt: -1 }).lean();
      return alerts.map(a => ({ ...a, _id: a._id.toString() }));
    },
    create: async (alert: Omit<Alert, '_id'>) => {
      await connectDB();
      const newAlert = await AlertModel.create(alert);
      const plainAlert = newAlert.toObject();
      plainAlert._id = plainAlert._id.toString();
      return plainAlert;
    },
    updateOne: async (id: string, update: Partial<Alert>) => {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const alert = await AlertModel.findByIdAndUpdate(id, update, { new: true }).lean();
      if (alert) alert._id = alert._id.toString();
      return alert;
    },
    all: async () => {
      await connectDB();
      const alerts = await AlertModel.find({}).sort({ createdAt: -1 }).lean();
      return alerts.map(a => ({ ...a, _id: a._id.toString() }));
    },
  },
  savings: {
    find: async (query: Partial<SavingGoal>) => {
      await connectDB();
      const goals = await SavingGoalModel.find(query).sort({ createdAt: -1 }).lean();
      return goals.map(g => ({ ...g, _id: g._id.toString() }));
    },
    create: async (saving: Omit<SavingGoal, '_id'>) => {
      await connectDB();
      const newSaving = await SavingGoalModel.create(saving);
      const plainSaving = newSaving.toObject();
      plainSaving._id = plainSaving._id.toString();
      return plainSaving;
    },
    all: async () => {
      await connectDB();
      const goals = await SavingGoalModel.find({}).sort({ createdAt: -1 }).lean();
      return goals.map(g => ({ ...g, _id: g._id.toString() }));
    },
  },
};