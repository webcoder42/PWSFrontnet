const { exec } = require('child_process');

// Add standard Windows paths to environment to fix "spawn cmd.exe ENOENT"
const env = {
  ...process.env,
  PATH: (process.env.PATH || '') + ';C:\\Windows\\System32;C:\\Windows\\System32\\WindowsPowerShell\\v1.0'
};

console.log('Starting Unified myPSW+ Platform (PSW, Client & Admin Dashboards)...');
const psw = exec('npm run dev --workspace=psw-plus', { env });
const admin = exec('npm run dev --workspace=admin-dashboard-psw-plus', { env });
const client = exec('npm run dev --workspace=patient', { env });

psw.stdout.pipe(process.stdout);
psw.stderr.pipe(process.stderr);

admin.stdout.pipe(process.stdout);
admin.stderr.pipe(process.stderr);

client.stdout.pipe(process.stdout);
client.stderr.pipe(process.stderr);

// Keep the process alive and handle exits
process.on('SIGINT', () => {
    psw.kill();
    admin.kill();
    client.kill();
    process.exit();
});
