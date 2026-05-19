import cors from 'cors';
import express from 'express';

import { articleRoutes } from './domains/articles/article.routes.js';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/articles', articleRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
