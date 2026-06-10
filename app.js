const process = require('process');
const path = require('path');

// Change working directory to server so dotenv finds server/.env
process.chdir(path.join(__dirname, 'server'));

// Now dynamically import the actual server (which is an ES module)
import('./server/src/server.js').catch(err => {
    console.error("Failed to load server:", err);
});
