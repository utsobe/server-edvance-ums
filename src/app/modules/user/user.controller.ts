import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../../middlewares/auth';
import catchAsync from '../../utils/catchAsynce';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const { user, generatedPassword } = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: { user, password: generatedPassword },
  });
});

const getUsers = catchAsync(async (req, res) => {
  const { role, department, q } = req.query as {
    role?: string;
    department?: string;
    q?: string;
  };

  const result = await UserService.getUsers({
    role: role as any,
    department,
    q,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    data: result.users,
    meta: { total: result.total },
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);

  if (!result) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserService.updateUser(req.params.id, req.body);

  if (!result) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await UserService.deleteUser(req.params.id);

  res.status(httpStatus.NO_CONTENT).json();
});

const changePassword = catchAsync(async (req: AuthenticatedRequest, res) => {
  const targetUserId = req.params.id;
  const result = await UserService.setPassword(targetUserId, req.body.password);

  if (!result) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully',
    data: result,
  });
});

// Existing controller to support legacy student creation route
const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  const result = await UserService.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  createStudent,
};
