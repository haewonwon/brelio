import cors from 'cors';
import express from 'express';

import { articleRoutes } from './domains/articles/article.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/articles', articleRoutes);

export default app;
