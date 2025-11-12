import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'tutor' | 'admin';
  educationLevel?: 'High School' | 'University' | 'College' | 'Other';
  phoneNumber?: string;
  address?: string;
  school?: string;
  gradeLevel?: string;
  guardianName?: string;
  guardianContact?: string;
  enrolledCourses: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
  educationLevel: { type: String, enum: ['High School', 'University', 'College', 'Other'] },
  phoneNumber: { type: String },
  address: { type: String },
  school: { type: String },
  gradeLevel: { type: String },
  guardianName: { type: String },
  guardianContact: { type: String },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
