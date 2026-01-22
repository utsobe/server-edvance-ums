import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import { TAuthUser } from '../../middlewares/auth';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

export type LoginPayload = {
  email: string;
  password: string;
  role: 'student' | 'lecturer' | 'admin';
};

export const AuthService = {
  async login(payload: LoginPayload) {
    const { email, password, role } = payload;

    const unauthorized = () => {
      const error = new Error('Invalid credentials') as Error & {
        statusCode?: number;
      };
      error.statusCode = httpStatus.UNAUTHORIZED;
      return error;
    };

    const user = await User.findOne({ email: email.toLowerCase(), role })
      .select('+passwordHash')
      .lean({ virtuals: true });

    if (!user || !user.passwordHash) {
      throw unauthorized();
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw unauthorized();
    }

    const tokenPayload: TAuthUser = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const secret = config.jwt_secret as string;
    if (!secret) {
      const error = new Error('JWT secret not configured') as Error & {
        statusCode?: number;
      };
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }

    const token = jwt.sign(tokenPayload, secret, {
      expiresIn: (config.jwt_expires_in || '1d') as SignOptions['expiresIn'],
    });

    return {
      token,
      user: UserService.sanitizeUser(user as TUser),
    };
  },
};
