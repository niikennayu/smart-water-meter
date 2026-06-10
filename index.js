import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change working directory to server so dotenv finds server/.env
process.chdir(path.join(__dirname, 'server'));

// Now load the actual server
import('./src/server.js');
