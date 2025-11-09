import mongoose, { Schema, Document } from 'mongoose';

export interface IFileUpload extends Document {
  fileId: string;
  originalName: string;
  customName: string;
  mimeType: string;
  size: number;
  catboxUrl: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

const FileUploadSchema = new Schema<IFileUpload>({
  fileId: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  customName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  catboxUrl: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFileUpload>('FileUpload', FileUploadSchema);
