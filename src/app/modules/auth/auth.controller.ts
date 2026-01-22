import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsynce';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully',
    data: result,
  });
});

export const AuthController = {
  login,
};
