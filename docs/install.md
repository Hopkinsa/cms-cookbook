# Install

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

## Install Dependencies

From the repository root, install dependencies for both applications:

```bash
cd frontend
npm install

cd ../backend
npm install
```

## Configure The Initial Admin User

The backend creates the cookbook tables and the persistent authentication tables automatically on startup. The first administrator is only created when the users table is empty and the bootstrap environment variables are set before the backend starts.

Set these required environment variables for the backend process:

```bash
export BOOTSTRAP_ADMIN_USERNAME=admin
export BOOTSTRAP_ADMIN_EMAIL=admin@example.com
export BOOTSTRAP_ADMIN_PASSWORD='ChangeMe123!'
```

Optional variables:

```bash
export BOOTSTRAP_ADMIN_FIRST_NAME=Admin
export BOOTSTRAP_ADMIN_SURNAME=User
export SESSION_SECRET='replace-this-in-real-environments'
export FRONTEND_ORIGIN='http://localhost:4200'
```

Notes:

- The bootstrap admin is created only when there are no existing users.
- If the database already contains users, setting these variables will not add another automatic admin.
- If the configured bootstrap admin account already exists, startup now syncs that account to the full current bootstrap permission set.
- The backend loads environment variables from shell exports or a local `.env` file because it starts with `dotenv/config`.   [Example env file](dot.env)

## Start The Application

To run frontend and backend together from the repository root:

```bash
npm start
```

Development URLs:

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3000`

## First Login And User Management

1. Start the application with the bootstrap admin variables set.
2. Open `http://localhost:4200`.
3. Sign in with the bootstrap admin username or email and password.
4. Open the Users page from the admin menu to add additional users through the frontend UI.

## Database And Backup Notes

- Initial database creation includes the cookbook tables and the persistent auth tables: `users`, `permissions`, `user_permissions`, and `password_reset_tokens`.
- Session data is stored separately in the `sessions` table and is created lazily when sessions are first used.
- Backup and restore include the persistent auth tables listed above.
- Active session rows are not part of the backup archive.
