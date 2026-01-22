import bcrypt from 'bcrypt';
import crypto from 'crypto';
import httpStatus from 'http-status';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester.ts/academicSemester.interface';
import { AcademicSemester } from '../academicSemester.ts/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import {
  CreateUserInput,
  TPublicUser,
  TUser,
  TUserRole,
  UpdateUserInput,
} from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const SALT_ROUNDS = Number(config.bcrypt_salt_rounds) || 10;

const hashPassword = async (password: string) =>
  bcrypt.hash(password, SALT_ROUNDS);

const sanitizeUser = (user: TUser): TPublicUser => {
  const plain =
    typeof (user as any).toObject === 'function'
      ? (user as any).toObject()
      : (user as any);
  const { passwordHash, _id, id, ...rest } = plain;
  return {
    ...rest,
    id: (id || _id)?.toString(),
  } as TPublicUser;
};

const ensureUniqueEmail = async (email: string, excludeId?: string) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing && existing._id.toString() !== excludeId) {
    const error: any = new Error('Email already exists');
    error.statusCode = httpStatus.CONFLICT;
    throw error;
  }
};

const createUser = async (payload: CreateUserInput) => {
  const generatedPassword =
    payload.password || crypto.randomBytes(9).toString('base64url');

  await ensureUniqueEmail(payload.email);

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
    passwordHash: await hashPassword(generatedPassword),
    status: 'active',
    isDeleted: false,
  });

  return {
    user: sanitizeUser(user),
    generatedPassword: payload.password ? undefined : generatedPassword,
  };
};

const getUsers = async (filters: {
  role?: TUserRole;
  department?: string;
  q?: string;
}) => {
  const { role, department, q } = filters;

  const query: Record<string, unknown> = { isDeleted: { $ne: true } };
  if (role) query.role = role;
  if (department) query.department = { $regex: department, $options: 'i' };

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { department: { $regex: q, $options: 'i' } },
      { course: { $regex: q, $options: 'i' } },
      { studentId: { $regex: q, $options: 'i' } },
      { employeeId: { $regex: q, $options: 'i' } },
    ];
  }

  const users = await User.find(query);
  const total = await User.countDocuments(query);

  return {
    users: users.map(sanitizeUser),
    total,
  };
};

const getUserById = async (id: string) => {
  const user = await User.findById(id);
  return user ? sanitizeUser(user) : null;
};

const updateUser = async (id: string, payload: UpdateUserInput) => {
  if (payload.email) {
    payload.email = payload.email.toLowerCase();
    await ensureUniqueEmail(payload.email, id);
  }

  if (payload.password) {
    (payload as any).passwordHash = await hashPassword(payload.password);
    delete (payload as any).password;
  }

  const updated = await User.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  );

  return updated ? sanitizeUser(updated) : null;
};

const deleteUser = async (id: string) => {
  await User.findByIdAndUpdate(id, { isDeleted: true });
};

const setPassword = async (id: string, password: string) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { passwordHash: await hashPassword(password) },
    { new: true },
  );

  return updated ? sanitizeUser(updated) : null;
};

// Existing flow for creating student users used by other modules
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const userPassword = password || (config.default_password as string);

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const generatedId = await generateStudentId(
    admissionSemester as TAcademicSemester,
  );
  const displayName =
    `${payload.name.firstName} ${payload.name.middleName ? payload.name.middleName + ' ' : ''}${payload.name.lastName}`.trim();

  const user = await User.create({
    id: generatedId,
    studentId: generatedId,
    name: displayName,
    email: payload.email.toLowerCase(),
    role: 'student',
    passwordHash: await hashPassword(userPassword),
    status: 'active',
  });

  if (user) {
    payload.id = generatedId;
    payload.user = user._id;
    payload.email = payload.email.toLowerCase();
    const newStudent = await Student.create(payload);
    return newStudent;
  }

  return null;
};

export const UserService = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  setPassword,
  createStudentIntoDB,
  sanitizeUser,
  hashPassword,
};
