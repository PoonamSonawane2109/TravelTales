# Backend Packages and Installation Guide

This document lists the Node.js packages used in the **TravelTales /
user-auth-app backend**, their responsibilities, and the commands
required to install and use them.

## 1. Prerequisites

Install the following before setting up the backend:

-   **Node.js and npm** -- to run the Express application and install
    packages.
-   **MySQL Server** -- to store application data.
-   **A code editor** -- for example, Visual Studio Code.

Check that Node.js and npm are installed:

``` bash
node -v
npm -v
```

## 2. Initialize the Node.js project

Open a terminal in the backend project folder:

``` bash
cd backend
npm init -y
```

This creates the `package.json` file, which stores project details,
dependencies, and scripts.

## 3. Install the required packages

### Production dependencies

Run this command to install the packages required by the application:

``` bash
npm install express mysql2 knex bcrypt jsonwebtoken dotenv cors helmet express-rate-limit
```

  -----------------------------------------------------------------------
  Package                 Responsibility          Information
  ----------------------- ----------------------- -----------------------
  `express`               Create REST APIs        Provides routing,
                                                  middleware, and HTTP
                                                  request/response
                                                  handling for the
                                                  backend.

  `mysql2`                Connect with MySQL      MySQL driver for
                                                  Node.js. Knex can use
                                                  it as its database
                                                  client.

  `knex`                  Migration management    SQL query builder that
                                                  also manages database
                                                  schema migrations.

  `bcrypt`                Hash passwords          Hashes passwords before
                                                  they are stored. Use
                                                  `bcrypt.compare()` to
                                                  check a submitted
                                                  password.

  `jsonwebtoken`          Generate and verify     Creates and verifies
                          tokens                  JWTs, commonly used for
                                                  authentication.

  `dotenv`                Read environment        Loads values from a
                          variables               `.env` file into
                                                  `process.env`.

  `cors`                  Allow frontend requests Configures which
                                                  browser-based frontend
                                                  origins may access the
                                                  backend.

  `helmet`                Security headers        Adds security-related
                                                  HTTP headers to Express
                                                  responses.

  `express-rate-limit`    Protect against         Limits repeated
                          excessive requests      requests, such as
                                                  repeated login
                                                  attempts.
  -----------------------------------------------------------------------

### Development dependency

Install Nodemon as a development-only dependency:

``` bash
npm install --save-dev nodemon
```

  -----------------------------------------------------------------------
  Package                 Responsibility          Information
  ----------------------- ----------------------- -----------------------
  `nodemon`               Restart server          Watches project files
                          automatically           and restarts the
                                                  Node.js server when
                                                  files change. It is
                                                  mainly used during
                                                  development.

  -----------------------------------------------------------------------

## 4. Add scripts to package.json

In `package.json`, add or update the `scripts` section:

``` json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

Start the server in development mode:

``` bash
npm run dev
```

Start the server normally:

``` bash
npm start
```

> If your main server file is not `src/app.js`, replace that path with
> the correct file path.

## 5. Set up Knex

Initialize the Knex configuration file:

``` bash
npx knex init
```

This creates `knexfile.js`. Configure it with your MySQL connection
details. Keep database credentials in environment variables rather than
hard-coding them.

Example `.env` file:

``` env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=traveltales
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Replace the example values with your own local configuration. Do not
commit `.env` to Git.

Create a migration:

``` bash
npx knex migrate:make create_users_table
```

Run pending migrations:

``` bash
npx knex migrate:latest
```

Roll back the most recent migration batch:

``` bash
npx knex migrate:rollback
```

## 6. Quick installation summary

For a new backend project, the main commands are:

``` bash
npm init -y
npm install express mysql2 knex bcrypt jsonwebtoken dotenv cors helmet express-rate-limit
npm install --save-dev nodemon
npx knex init
```

## 7. Important security notes

-   Never store plain-text passwords. Hash them with `bcrypt` before
    saving them.
-   Never put database passwords or JWT secrets directly in source code.
-   Add `.env` to `.gitignore` so credentials are not pushed to Git.
-   Use HTTPS in production and configure CORS to allow only trusted
    frontend origins.
-   Configure rate limiting, especially on login and registration
    endpoints.
-   Use a strong, randomly generated JWT secret and set an appropriate
    token expiration.
-   Keep dependencies updated and review security advisories.

## 8. Package overview

**Production dependencies:** `express`, `mysql2`, `knex`, `bcrypt`,
`jsonwebtoken`, `dotenv`, `cors`, `helmet`, `express-rate-limit`

**Development dependency:** `nodemon`

These packages provide the backend foundation for REST API development,
MySQL access, database migrations, authentication, configuration, and
basic API security.

## Profile APIs

Apply pending database migrations before using these endpoints:

```bash
npm run migrate
```

Send the login token in the `Authorization: Bearer <token>` header for all
protected endpoints.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/auth/profile` | Read the signed-in user's profile |
| `PATCH` | `/api/auth/profile` | Update `full_name`, `email`, `bio`, and/or `profile_image` |
The profile page currently displays sample blogs in the frontend. A blogs
endpoint will be added when the blog table is available.
Logout is handled in the frontend by removing the token from local storage.
Because sessions use one-hour JWTs without server-side revocation, a copied
token remains usable until it expires.

## Contact Us API

Apply pending database migrations with `npm run migrate` to update the
`contact_messages` table. The authenticated contact form submits `subject`
and `message` to:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/contact` | Validate and store a message for the signed-in user |
| `GET` | `/api/contact` | Retrieve the signed-in user's messages and sender details |

Send a valid login token in the `Authorization: Bearer <token>` header.
The request body must include `subject` and `message`; the sender is derived
from the token and stored as `user_id`. The sender's name and email remain in
the `users` table and can be retrieved by joining `contact_messages.user_id`
to `users.user_id`. New messages use status `NEW`. Successful submissions are
stored in the database and return HTTP `201`.
