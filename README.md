# HelpDesk Ticket Management System — setup & deployment

These files are an overlay for a fresh Laravel + Breeze (Inertia + React) project.
Copy them over the project, keeping the same folder paths (overwrite when asked).

## A. Create the project (local)
Requirements: PHP 8.2+, Composer, Node 18+, Git.

    composer create-project laravel/laravel helpdesk
    cd helpdesk
    composer require laravel/breeze --dev
    php artisan breeze:install react       # choose: no dark mode, PHPUnit (or Pest), no TypeScript/SSR

## B. Copy the overlay
Copy everything from this folder into `helpdesk/` (overwrite `routes/web.php`,
`HandleInertiaRequests.php`, `DatabaseSeeder.php`, `resources/js/Pages/Dashboard.jsx`,
`resources/js/Layouts/AuthenticatedLayout.jsx`).

## C. Three small manual edits
1. `app/Models/User.php` — add the import and the relationship:

        use Illuminate\Database\Eloquent\Relations\HasMany;
        ...
        public function tickets(): HasMany
        {
            return $this->hasMany(Ticket::class);
        }

2. `bootstrap/app.php` — inside `->withMiddleware(function (Middleware $middleware) { ... })` add:

        $middleware->trustProxies(at: '*');

3. `app/Providers/AppServiceProvider.php` — add `use Illuminate\Support\Facades\URL;` and in `boot()`:

        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

## D. Run locally
    php artisan migrate        # (answer yes if asked to create database.sqlite)
    php artisan db:seed        # demo account: demo@helpdesk.test / Password123!
    npm install
    npm run dev                # terminal 1
    php artisan serve          # terminal 2  ->  http://127.0.0.1:8000

## E. Push to GitHub (.env is already in .gitignore)
    git init && git add . && git commit -m "Initial HelpDesk app"
    git remote add origin https://github.com/<you>/helpdesk.git
    git push -u origin main
Commit regularly (feature by feature) — do not leave a single "final" commit.

## F. Deploy on Railway
1. railway.app -> New Project -> Deploy from GitHub repo -> select the repo.
2. In the project: New -> Database -> Add MySQL.
3. Open the Laravel service -> Variables, add:

        APP_NAME=HelpDesk
        APP_ENV=production
        APP_DEBUG=false
        APP_KEY=<output of: php artisan key:generate --show>
        APP_URL=https://<your-service>.up.railway.app
        LOG_CHANNEL=stderr
        DB_CONNECTION=mysql
        DB_HOST=${{MySQL.MYSQLHOST}}
        DB_PORT=${{MySQL.MYSQLPORT}}
        DB_DATABASE=${{MySQL.MYSQLDATABASE}}
        DB_USERNAME=${{MySQL.MYSQLUSER}}
        DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
        SESSION_DRIVER=database
        CACHE_STORE=database
        QUEUE_CONNECTION=sync

   (If your MySQL service is named differently, replace `MySQL` in the references.)
4. Service -> Settings -> Networking -> Generate Domain (HTTPS is automatic).
5. Deploy. `railway.json` builds assets (Nixpacks runs `npm run build`) and runs
   `php artisan migrate --force` + the idempotent seeder before each release.
6. Visit the URL, log in with the demo account, and verify: register, create/edit/delete,
   pagination, and that /tickets/<other user's id> returns 403.

## Pre-check checklist
- [ ] `.env` not in the repo; `.env.example` has no real values
- [ ] APP_ENV=production, APP_DEBUG=false on Railway
- [ ] Live HTTPS URL works, data persists after redeploy (MySQL, not SQLite)
- [ ] Be ready to explain: Policy, Form Requests, useForm, flash sharing, route resource
