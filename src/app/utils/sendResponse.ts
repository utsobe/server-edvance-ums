import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

const sendResponse = <T>(res: Response, payload: TResponse<T>) => {
  const { statusCode, success, message, data, meta } = payload;

  res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};

export default sendResponse;
