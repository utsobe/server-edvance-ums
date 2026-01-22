/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

// parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  const a = 'Initializing the university management application...';
  res.send(a);
};

app.get('/', test);

// handle not found
app.use(notFound);
app.use(globalErrorHandler);

export default app;
