import cors from 'cors';
import express from 'express';

import { articleRoutes } from './domains/articles/article.routes.js';
import { dailyLogRoutes } from './domains/dailyLogs/dailyLog.routes.js';
import {
  articleNoteRoutes,
  noteRoutes,
} from './domains/notes/note.routes.js';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/articles/:articleId/note', articleNoteRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/daily-logs', dailyLogRoutes);
app.use('/api/notes', noteRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
