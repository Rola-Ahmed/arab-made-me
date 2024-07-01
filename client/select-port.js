const { execSync } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));
const port = argv.port || 3000; // Default to port 3000 if not specified

process.env.PORT = port;

const appDirectory = '/home/ubuntu/dev-arab-made/client'; // Adjust this path as necessary
process.chdir(appDirectory);

// Start the React application
execSync('npm start', { stdio: 'inherit' });
