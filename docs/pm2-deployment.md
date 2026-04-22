# PM2 Deployment

## Overview

This project builds into a self-contained `deployment/` directory that can be started by PM2.

The built application serves:

- the Angular frontend from `static/`
- the backend entry point from `www/index.ts`
- uploaded and template images from `images/`
- SQLite data from `data/`

Keep that folder structure intact after copying the build to the target machine.

This project is still intended as a demonstration app. It does not include production-grade authentication or hardening.

## Prerequisites

- NodeJS 20 or newer
- npm
- PM2 installed globally

Install PM2 once on the target machine:

```bash
npm install -g pm2
```

## 1. Build the deployment package

From the repository root:

```bash
cd /path/to/repository
npm install --prefix frontend
npm install --prefix backend
npm run build
```

That command:

- copies the backend runtime files into `deployment/www/`
- copies image assets into `deployment/images/`
- copies the PM2 helper files into `deployment/`
- builds the Angular frontend into `deployment/static/`

After the build, the `deployment/` directory is the artifact you deploy.

## 2. Copy the deployment directory to the server

Copy the contents of `deployment/` to the machine that will run the app. Example:

```bash
rsync -av deployment/ user@server:/srv/target-directory/
```

You can choose any target path. The examples below use `/srv/cms-cookbook-www`.

## 3. Install runtime dependencies on the server

On the target machine:

```bash
cd /srv/cms-cookbook-www
npm install
```

The deployment package includes its own `package.json`, so installation happens from inside the deployed folder.

## 4. Start the app with PM2

The deployment package includes `ecosystem.config.js`.

```javascript
module.exports = {
  apps: [{
    name: 'cms-cookbook',

    script: 'www/index.ts',
    cwd: './cms-cookbook-www/',
    interpreter: 'tsx',
  }],
};
```

On the server, either move the file to the `httpd` root directory (srv) or add the contents to an existing configuration file.

Start it from the `httpd` root:

```bash
cd /srv
pm2 start ecosystem.config.js
```

The app name is `cms-cookbook`.

Useful PM2 commands:

```bash
pm2 status
pm2 logs cms-cookbook
pm2 restart cms-cookbook
pm2 stop cms-cookbook
pm2 delete cms-cookbook
```

Once running, the application is served on `http://localhost:3000/`.

## 5. Start PM2 on boot

To persist the process list and configure PM2 to restart on reboot:

```bash
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup` with the required privileges, then run `pm2 save` again if needed.

## Updating a deployment

For a new release:

1. Run `npm run build` again from the repository root.
2. Copy the updated `deployment/` contents to the server.
3. Run `npm install` in the deployed directory if dependencies changed.
4. Restart the process with `pm2 restart cms-cookbook`.

## Runtime notes

- The backend port is fixed at `3000` in the current codebase.
- Relative production frontend URLs expect the backend and static files to be served from the same deployed app.
- If you expose the app publicly, place it behind a reverse proxy such as Nginx or Apache.
