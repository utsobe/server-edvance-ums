/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

type TErrorIssue = {
  path?: string;
  message: string;
};

const formatZodIssues = (error: ZodError): TErrorIssue[] =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let statusCode = err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err?.message || 'Internal Server Error';
  let issues: TErrorIssue[] = [];

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation error';
    issues = formatZodIssues(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation error';
    issues = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  } else if (err?.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    const duplicateFields = Object.keys(err.keyPattern || {}).join(', ');
    message = duplicateFields
      ? `Duplicate value for: ${duplicateFields}`
      : 'Duplicate value';
  } else if (err?.name === 'CastError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Invalid identifier';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: issues.length ? issues : undefined,
  });
};

export default globalErrorHandler;
