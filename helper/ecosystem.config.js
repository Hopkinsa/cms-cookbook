// PM2 ecosystem configuration file
// Ensure to install tsx: npm install -g tsx
// amd pm2: npm install -g pm2
// Place ecosystem file in http root folder and run: pm2 start --name=<app_name>
module.exports = {
  apps: [{
    name: 'cms-cookbook',

    script: 'www/index.ts',
    cwd: './cmsc/',
    interpreter: 'tsx',
  }],
};
