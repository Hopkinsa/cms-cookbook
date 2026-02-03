# CMSCookbook

This is a simple Content Management System (CMS) for recipes.  It comprises of an Angular frontend and a NodeJS / SQLite backend.  Do not use this on any production server, as it is not secure.  This project is for demonstration purposes only.

The backend was created to demonstrate creating APIs, validating and sanitizing input, interacting with SQLite and file uploads.

The frontend was created to demonstrate the use of Signals in templates, change detection, forms and HTTP requests.

The following Angular Signals are used:

- signal
- effect
- computed
- linkedSignal
- httpResource
- viewChild
- input
- output
- form

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

## To build

From the repository root, run `npm run build`.

This will build the Angular application and copy the required NodeJS files to `./deployment`.

The Angular files are in `static` and NodeJS files in `www`.

A package.json file will also be copied to the folder, containing the dependancies needed to run.

After using `npm install` to install the dependencies, use `npm run start` to serve the application.

Once the server is running, open your browser and navigate to `http://localhost:3000/`.

pm2 can also be used to serve the application.  An example ecosystem.config file can be found in `./helper`.
