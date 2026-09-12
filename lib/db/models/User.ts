import mongoose, { Schema, Document, Types } from 'mongoose';
import { User as IUser, CalculationRecord } from '@/types';

interface UserDocument extends Omit<IUser, '_id'>, Document<Types.ObjectId> {}

const CalculationRecordSchema = new Schema<CalculationRecord>(
  {
    id: { type: String, required: true },
    calculatorId: { type: String, required: true },
    calculatorName: { type: String, required: true },
    category: { type: String, required: true },
    inputs: { type: Schema.Types.Mixed, required: true },
    results: { type: Schema.Types.Mixed, required: true },
    name: { type: String, trim: true, maxlength: 120 },
    createdAt: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email address',
      ],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    password: {
      type: String,
      required: function (this: UserDocument) {
        return this.provider === 'email';
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    // Email Verification Fields
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    verificationAttempts: {
      type: Number,
      default: 0,
    },
    lastVerificationSent: {
      type: Date,
    },
    // Password Reset Fields
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    resetAttempts: {
      type: Number,
      default: 0,
    },
    lastResetSent: {
      type: Date,
    },
    history: { type: [CalculationRecordSchema], default: [] },
    savedCalculations: { type: [CalculationRecordSchema], default: [] },
    favoriteCalculators: { type: [String], default: [] },
    recentlyUsed: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
