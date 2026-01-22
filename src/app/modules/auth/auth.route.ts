import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { authValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidation.login),
  AuthController.login,
);

export const AuthRoutes = router;
