import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>(
  {
    id: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'lecturer', 'admin'],
      required: true,
    },
    passwordHash: { type: String, required: true, select: false },
    avatar: { type: String },
    department: { type: String },
    course: { type: String },
    studentId: { type: String },
    employeeId: { type: String },
    year: { type: Number },
    gpa: { type: Number },
    enrolledSubjects: { type: [String], default: [] },
    subjects: { type: [String], default: [] },
    permissions: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
      },
    },
  },
);

// Exclude soft-deleted users from find queries by default
userSchema.pre('find', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const User = model<TUser>('User', userSchema);
