import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  type: 'ZIMSEC' | 'Cambridge' | 'Tertiary';
  status: 'Free' | 'Premium';
  price?: number;
  fileUrl?: string;
  youtubeLink?: string;
  resourceType: 'PDF' | 'Video' | 'Image' | 'Audio' | 'Lesson';
  createdBy: mongoose.Types.ObjectId;
  enrollments: number;
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['ZIMSEC', 'Cambridge', 'Tertiary'], required: true },
  status: { type: String, enum: ['Free', 'Premium'], required: true },
  price: { type: Number },
  fileUrl: { type: String },
  youtubeLink: { type: String },
  resourceType: { type: String, enum: ['PDF', 'Video', 'Image', 'Audio', 'Lesson'], required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  enrollments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICourse>('Course', CourseSchema);
