import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  ipAddress: string;
  userAgent: string;
  visitedAt: Date;
  page: string;
}

const VisitorSchema = new Schema<IVisitor>({
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  visitedAt: { type: Date, default: Date.now },
  page: { type: String, required: true }
});

// Create index for tracking unique visitors
VisitorSchema.index({ ipAddress: 1, visitedAt: 1 });

export default mongoose.model<IVisitor>('Visitor', VisitorSchema);
