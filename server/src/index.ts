import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

dotenv.config({
  path: path.resolve(currentDirPath, '../.env'),
});

const { default: app } = await import('./app.js');

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
