HORIZON SOLAR & EXTERIOR CARE
=============================

Current technical and deployment guide

This document describes the application that is currently implemented in this
repository. Older documentation that describes FastAPI, MongoDB, Motor,
Supervisord, React 19, or a separate Python API is obsolete and must not be used
to run or deploy this project.


1. APPLICATION OVERVIEW
=======================

Horizon Solar & Exterior Care is a React marketing website with an integrated
admin CMS and lead-management system for a Sydney exterior-cleaning business.

The production application runs as one Node.js process:

  Browser
     |
     +-- Public React site
     +-- /admin React CMS
     +-- /api Express API
     +-- /uploads uploaded media
             |
          Express
             |
        MySQL through Sequelize

Express serves the compiled React application, the API, uploaded files, and the
single-page-app fallback. The frontend and backend therefore use the same
domain in production. A separate frontend deployment or API domain is not
required.


2. CURRENT TECHNOLOGY STACK
===========================

Frontend:

  - React 18.2
  - React DOM 18 with createRoot
  - React Router
  - Create React App with CRACO
  - Tailwind CSS 3
  - Framer Motion
  - Lucide React and React Icons
  - React Helmet Async for page metadata
  - React Quill for CMS rich-text editing

Backend:

  - Node.js
  - Express 4
  - MySQL
  - Sequelize 6 with mysql2
  - JWT authentication stored in an HttpOnly cookie
  - bcryptjs password hashing
  - Multer and Sharp for image uploads and processing
  - Helmet, CORS, validation, and request rate limiting

Production target:

  - Hostinger managed Node.js application
  - Hostinger MySQL database
  - One same-origin Node.js deployment

Not used by the active application:

  - Python or FastAPI
  - MongoDB or Motor
  - Redis
  - Docker
  - Google Sheets
  - Supervisord
  - A separate static frontend host

The backend/legacy-python-sheets directory contains retired code for reference
only. Do not install, start, or deploy it.


3. MAIN FEATURES
================

Public website:

  - Homepage with CMS-controlled hero slides and sections
  - About and contact pages
  - Services listing and service-detail pages
  - Package and bundle detail pages
  - Service areas and individual area pages
  - Blog listing and blog-detail pages
  - Reviews, FAQs, before/after results, and calls to action
  - Quote and contact forms that save leads to MySQL
  - Dynamic sitemap generated from current CMS content
  - Responsive desktop, tablet, and mobile layouts
  - CMS-controlled colors, branding, business details, and media

Admin CMS at /admin:

  - Dashboard statistics
  - Homepage content and hero management
  - Services, packages, and bundles
  - Service areas
  - Reviews and FAQs
  - Blog posts and categories
  - Lead viewing, filtering, updating, deleting, and CSV export
  - Media library
  - Appearance/theme settings
  - Website settings
  - Admin password management

Lead submission is real, not mocked. Public forms POST to /api/leads and the
records are stored in MySQL. The application does not currently send lead
notification or confirmation emails.


4. REPOSITORY STRUCTURE
=======================

  project root/
  |
  +-- package.json
  |     Hostinger-oriented root build and start commands
  |
  +-- frontend/
  |   +-- public/                 Static assets and HTML template
  |   +-- src/
  |   |   +-- admin/              Admin routes, pages, API client, auth
  |   |   +-- components/         Shared layout, UI, hero, forms, sections
  |   |   +-- hooks/              React hooks
  |   |   +-- lib/                CMS hooks, theme, media, lead submission
  |   |   +-- pages/              Public route components
  |   |   +-- App.js              Public and admin routing
  |   |   +-- index.js            React entry point
  |   |   +-- index.css           Tailwind and global styles
  |   +-- package.json
  |   +-- tailwind.config.js
  |   +-- craco.config.js
  |   +-- build/                   Generated production frontend (not source)
  |
  +-- backend/
      +-- server.js               Active Express entry point
      +-- package.json
      +-- .env.example            Backend environment template
      +-- DEPLOYMENT.md            Additional Hostinger notes
      +-- src/
      |   +-- config/              MySQL/Sequelize configuration
      |   +-- middleware/          Authentication, uploads, errors
      |   +-- models/              Sequelize models and relationships
      |   +-- routes/              Public and admin API routes
      |   +-- scripts/             Schema, migration, admin, content seeds
      |   +-- utils/               JWT, passwords, images, validation
      +-- uploads/                  Uploaded media when UPLOAD_DIR is unset
      +-- legacy-python-sheets/     Retired; not part of the active app


5. PUBLIC ROUTES
================

  /                         Homepage
  /about                    About page
  /contact                  Contact page
  /services                 Services listing
  /services/:slug           Service detail
  /packages/:slug           Package or bundle detail
  /areas                    Service areas
  /areas/:slug              Area detail
  /area/:slug               Backward-compatible area alias
  /blog                     Blog listing
  /blog/:slug               Blog post
  /admin                    Admin dashboard or login redirect
  /sitemap.xml              Dynamic sitemap
  /api/health               API health check

Old service slugs are redirected by the React router to their current slugs.


6. API ORGANIZATION
===================

Public read APIs include:

  /api/services
  /api/packages
  /api/bundles
  /api/reviews
  /api/faqs
  /api/areas
  /api/before-after
  /api/blog
  /api/hero
  /api/homepage
  /api/settings
  /api/theme

Public lead submission:

  POST /api/leads

Authentication:

  POST /api/auth/login
  POST /api/auth/logout
  GET  /api/auth/me
  POST /api/auth/change-password

CMS write endpoints are under /api/admin/*, except admin lead operations,
which are under /api/leads/admin/*. Protected routes require the signed admin
session cookie. Mutating admin requests also require the X-Horizon-Admin: 1
header; the frontend API client adds it automatically.


7. DATABASE AND STARTUP BEHAVIOR
================================

The active database is MySQL. Sequelize uses one shared connection pool.

On every server startup, backend/server.js performs these steps in order:

  1. Connect to MySQL with retry handling.
  2. Create tables that do not exist.
  3. Run reviewed additive migrations.
  4. Create the initial admin if the admin_users table is empty.
  5. Seed default CMS content only when the CMS content tables are empty.
  6. Seed the legacy starter blog posts only when blog_posts is empty.
  7. Start the Express HTTP server.

Startup never uses sync({ force: true }) and does not intentionally drop
production tables.

Important data rules:

  - A new Hostinger database does not contain data from a local database.
  - Default CMS data is added automatically only to an empty content database.
  - Leads remain empty until a visitor submits a form or data is imported.
  - ADMIN_INITIAL_PASSWORD is only used when no admin user exists.
  - Changing ADMIN_INITIAL_PASSWORD later does not reset an existing account.
  - Use Admin > Account to change an existing admin password.

Manual database commands, when npm is available in the application runtime:

  npm --prefix backend run db:init
  npm --prefix backend run db:migrate
  npm --prefix backend run db:seed-admin
  npm --prefix backend run db:seed

The normal Hostinger SSH shell may not expose npm. Manual seed commands are not
required for a brand-new deployment because first-start seeding is built into
backend/server.js.


8. ENVIRONMENT VARIABLES
========================

Backend/runtime variables:

  NODE_ENV
    Use production on the deployed application and development locally.

  APP_URL
    The exact allowed browser origin, including https:// in production.
    Example: https://www.example.com

  PORT
    HTTP port used by Express. Hostinger supplies this automatically. Do not
    create a fixed PORT environment variable in the Hostinger dashboard.
    Local default: 3001.

  DB_HOST
    MySQL host. On the current Hostinger setup, 127.0.0.1 is recommended to
    avoid localhost resolving to the IPv6 address ::1.

  DB_PORT
    MySQL port. Hostinger default: 3306.

  DB_NAME
    Exact Hostinger database name, including the account prefix.

  DB_USER
    Exact Hostinger database username, including the account prefix.

  DB_PASSWORD
    Password for DB_USER. This is not the admin-panel password.

  JWT_SECRET
    Required in production. Use a long random value and never commit it.

  ADMIN_USERNAME
    Username created only when admin_users is empty.

  ADMIN_INITIAL_PASSWORD
    Initial password created only when admin_users is empty. Always set a
    strong value before the first production boot.

  UPLOAD_DIR
    Optional absolute persistent directory for uploaded media. If omitted,
    uploads are written below backend/uploads.

Frontend build variable:

  REACT_APP_API_BASE
    Local development normally uses http://localhost:3001. Leave this unset or
    empty in production because the frontend and API share one origin.

SESSION_SECRET appears in an older environment template but is not referenced
by the active application. Authentication uses JWT_SECRET.

Never commit backend/.env, frontend/.env.local, database passwords, admin
passwords, JWT secrets, or hosting credentials.


9. LOCAL DEVELOPMENT
====================

Requirements:

  - Node.js 24 is recommended because the root package currently declares
    node 24.x. The backend itself supports Node 18 or newer.
  - npm
  - MySQL 8 or a compatible MySQL/MariaDB service

Create a local database, for example:

  CREATE DATABASE horizon_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

Backend setup:

  cd backend
  cp .env.example .env
  npm install

Set local values in backend/.env, for example:

  NODE_ENV=development
  APP_URL=http://localhost:3000
  PORT=3001
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_NAME=horizon_cms
  DB_USER=root
  DB_PASSWORD=your-local-mysql-password
  JWT_SECRET=your-long-local-development-secret
  ADMIN_USERNAME=admin
  ADMIN_INITIAL_PASSWORD=choose-a-strong-password

Start the backend:

  npm run dev

The backend listens at http://localhost:3001 by default and automatically
creates/seeds a new empty local database.

Frontend setup in a second terminal:

  cd frontend
  npm install

Create frontend/.env.local containing:

  REACT_APP_API_BASE=http://localhost:3001

Then run:

  npm start

The frontend opens at http://localhost:3000. The admin panel is available at
http://localhost:3000/admin.


10. PRODUCTION BUILD
====================

From the repository root:

  npm run build

The root build script:

  - installs production backend dependencies with npm ci
  - installs frontend build dependencies with npm ci
  - runs the CRACO production build
  - writes the compiled frontend to frontend/build

Start the complete production application from the repository root:

  npm start

This runs backend/server.js. Do not use a static-only server for the production
site because /api, /admin authentication, MySQL, and uploads require Express.


11. HOSTINGER DEPLOYMENT
========================

Create one managed Node.js website and one MySQL database.

Recommended Node.js application settings:

  Application root: repository root
  Node version:      24.x, matching the root package.json
  Build command:     npm run build
  Start command:     npm start
  Entry file:        backend/server.js
  Output directory:  not used by Express; if Hostinger requires a value,
                     use frontend/build

Do not configure a separate frontend website. Express expects frontend/build
to exist and serves it from the same application.

Recommended Hostinger environment values:

  NODE_ENV=production
  APP_URL=https://your-canonical-domain.example
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_NAME=your-prefixed-database-name
  DB_USER=your-prefixed-database-user
  DB_PASSWORD=your-current-database-user-password
  JWT_SECRET=a-long-random-secret
  ADMIN_USERNAME=admin
  ADMIN_INITIAL_PASSWORD=a-strong-first-login-password

Do not manually add PORT. Do not set REACT_APP_API_BASE to localhost in the
production build. APP_URL must match the domain visitors actually use; choose
one canonical www or non-www address and redirect the other.

After changing environment variables, perform a full redeploy/restart. Merely
refreshing the browser does not apply server environment changes.

First deployment checks:

  1. Visit /api/health and confirm a JSON response with status "ok".
  2. Review Hostinger Runtime Logs for a successful MySQL connection.
  3. Visit /admin and sign in with the initial admin credentials.
  4. Change the admin password under Admin > Account.
  5. Confirm Services, Packages, Reviews, FAQs, Areas, and Blog contain data.
  6. Submit a public quote form and confirm the lead appears in Admin > Leads.
  7. Upload an image and confirm it remains accessible after redeployment.
  8. Confirm /sitemap.xml loads over HTTPS.


12. UPLOADED MEDIA
==================

Admin uploads support one JPG, PNG, or WebP image per request, with a maximum
source size of 8 MB. Sharp processes images before they are written.

Default storage:

  backend/uploads/<category>/

Public URL:

  /uploads/<category>/<generated-file-name>

Git ignores uploaded media, so uploads do not move to Hostinger through a Git
deployment. Existing uploads must be copied separately, and their matching
database records must also exist. Configure UPLOAD_DIR to a writable persistent
path if Hostinger replaces the application version directory during redeploys.


13. AUTHENTICATION AND SECURITY
===============================

  - Admin passwords are bcrypt-hashed in MySQL.
  - The admin JWT is stored in an HttpOnly cookie, not localStorage.
  - The production cookie is Secure and requires HTTPS.
  - The cookie uses SameSite=Lax and expires after eight hours.
  - Admin mutation requests require a custom anti-CSRF header.
  - CORS accepts the exact APP_URL origin and includes credentials.
  - Login and lead endpoints have in-memory per-IP rate limits.
  - Helmet supplies common HTTP security headers.
  - Upload type and size are validated.

Use a strong JWT_SECRET, database password, and admin password. If a credential
is exposed in a screenshot, log, message, or commit, rotate it immediately.


14. TROUBLESHOOTING
===================

Frontend build fails with "Missing script: build":

  Hostinger is running the command against the wrong package or an old root
  package.json. The application root must be the repository root, and the
  current root package.json must contain its build script.

Missing frontend/build/index.html:

  The React production build did not run or the application root is wrong.
  Run npm run build from the repository root and review build logs.

ECONNREFUSED on port 3307:

  Use DB_PORT=3306 for Hostinger MySQL.

Access denied for database-user@::1:

  Confirm the exact prefixed DB_USER and DB_NAME, reset the database-user
  password, update DB_PASSWORD, and use DB_HOST=127.0.0.1.

Admin login returns HTTP 500:

  Check Hostinger Runtime Logs. A database connection error occurs before the
  application can validate the admin username/password. Also confirm that
  JWT_SECRET exists in production.

GET /api/auth/me returns 401 before login:

  This is expected when there is no valid admin session cookie.

Admin Appearance or Website Settings loads forever:

  Deploy the current backend routes. They create missing singleton settings
  rows automatically, and the current frontend displays API load errors rather
  than remaining on an endless loading state.

Dashboard contains zero leads:

  Leads are not starter content. Submit a public form or import an existing
  database backup.

Uploaded images disappear after deployment:

  The upload directory is not persistent. Configure UPLOAD_DIR to persistent
  writable storage and migrate existing media files.


15. TESTING AND VERIFICATION
============================

Frontend production compilation:

  npm --prefix frontend run build

Frontend tests:

  npm --prefix frontend test

Basic production smoke test:

  - /api/health returns 200
  - public routes render on direct navigation and hard refresh
  - /admin requires authentication
  - admin login/logout works over HTTPS
  - CMS records can be created and edited
  - public pages reflect CMS changes
  - quote forms create lead records
  - lead CSV export downloads
  - image upload and rendering work
  - /sitemap.xml contains current CMS routes


16. IMPORTANT MAINTENANCE NOTES
===============================

  - Treat backend/server.js as the active backend entry point.
  - Treat MySQL/Sequelize models as the production data source.
  - Do not revive backend/legacy-python-sheets for production deployment.
  - Do not upload a locally generated frontend/build that contains a localhost
    REACT_APP_API_BASE; let the Hostinger build create a clean production build.
  - Back up the MySQL database and persistent uploads before major migrations.
  - Keep database schema changes additive and reviewed.
  - Never commit generated secrets or production credentials.

End of guide.
