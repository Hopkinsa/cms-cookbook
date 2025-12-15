# CMSCookbook

This is a simple Content Management System (CMS) for recipes.  It comprises of an Angular frontend and a NodeJS / SQLite backend.  Do not use this on any production server, as it is not secure.  This project is for demonstration purposes only.

The backend was created to demonstrate creating APIs, validating and sanitizing input, interacting with SQLite and file uploads.

The frontend was created to demonstrate the use of Signals in templates, change detection, forms and HTTP requests.

## To install

From the repository root, change to the `frontend` directory or `backend` directory.

```bash
$ npm install
```
This needs to be done for both directories.

## To run

From the repository root, run `npm run start` for a dev server.

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

Please note that starting it this way will start both the frontend and backend server.
