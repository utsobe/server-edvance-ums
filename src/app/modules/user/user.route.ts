import express from 'express';
import {
  authMiddleware,
  requireAdmin,
  requireSelfOrAdmin,
} from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  validateRequest(UserValidation.getUsersQueryValidation),
  UserController.getUsers,
);

router.get('/:id', authMiddleware, UserController.getUserById);

router.post(
  '/',
  authMiddleware,
  requireAdmin,
  validateRequest(UserValidation.createUserValidation),
  UserController.createUser,
);

router.put(
  '/:id',
  authMiddleware,
  requireAdmin,
  validateRequest(UserValidation.updateUserValidation),
  UserController.updateUser,
);

router.delete('/:id', authMiddleware, requireAdmin, UserController.deleteUser);

router.post(
  '/:id/password',
  authMiddleware,
  requireSelfOrAdmin,
  validateRequest(UserValidation.changePasswordValidation),
  UserController.changePassword,
);

// Legacy route for creating a student via the combined payload
router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  UserController.createStudent,
);

export const UserRoutes = router;
