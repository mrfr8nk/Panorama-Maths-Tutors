import mongoose, { Schema, Document } from 'mongoose';

export interface IUpdate extends Document {
  title: string;
  content: string;
  type: 'announcement' | 'feature' | 'alert';
  active: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UpdateSchema = new Schema<IUpdate>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['announcement', 'feature', 'alert'], default: 'announcement' },
  active: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUpdate>('Update', UpdateSchema);
