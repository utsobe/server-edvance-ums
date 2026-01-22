import { Types } from 'mongoose';

export type TUserRole = 'student' | 'lecturer' | 'admin';

export type TUserStatus = 'active' | 'blocked';

export type TUser = {
  _id?: Types.ObjectId;
  id?: string; // legacy/student-facing identifier
  name: string;
  email: string;
  role: TUserRole;
  passwordHash: string;
  avatar?: string;
  department?: string;
  course?: string;
  studentId?: string;
  employeeId?: string;
  year?: number;
  gpa?: number;
  enrolledSubjects?: string[];
  subjects?: string[];
  permissions?: string[];
  status?: TUserStatus;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TPublicUser = Omit<TUser, 'passwordHash'> & { id: string };

export type CreateUserInput = {
  name: string;
  email: string;
  role: TUserRole;
  password?: string;
  avatar?: string;
  department?: string;
  course?: string;
  studentId?: string;
  employeeId?: string;
  year?: number;
  gpa?: number;
  enrolledSubjects?: string[];
  subjects?: string[];
  permissions?: string[];
};

export type UpdateUserInput = Partial<CreateUserInput>;
