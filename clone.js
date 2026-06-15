const { exec } = require('child_process');

// Add standard Windows paths to environment to fix "spawn cmd.exe ENOENT"
const env = {
  ...process.env,
  PATH: (process.env.PATH || '') + ';C:\\Windows\\System32;C:\\Windows\\System32\\WindowsPowerShell\\v1.0'
};

console.log('Cloning repository...');
const clone = exec('git clone https://github.com/hammadali072/myPSW-Plus.git psw-plus', { env, cwd: __dirname });

clone.stdout.pipe(process.stdout);
clone.stderr.pipe(process.stderr);

clone.on('exit', (code) => {
    console.log(`Git clone exited with code ${code}`);
});
