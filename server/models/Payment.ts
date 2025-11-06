import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  phoneNumber: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  paynowReference?: string;
  paynowPollUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'success', 'failed'], default: 'pending' },
  paynowReference: { type: String },
  paynowPollUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
