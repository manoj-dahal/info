# Deployment checklist

## Local Docker environment

The project includes a complete Apache/PHP/MySQL local environment. With Docker Desktop installed, run:

```bash
docker compose up --build
```

Before starting, copy `.env.example` to `.env` and change the local values if needed. Docker initializes the `portfolio` database from `php/db_setup.sql`; `.env` is ignored by Git and is the appropriate place for local-only settings.

Open `http://localhost:8080` after the containers start.

A `Makefile` is also included for common commands:

```bash
make up       # start the local stack
make down     # stop the local stack
make rebuild  # rebuild and start it again
make logs     # view service logs
make check    # run JavaScript and PHP syntax checks
```

## Web server

Deploy the project to an Apache/PHP server. The included `.htaccess` enables HTTPS redirects (except localhost), a custom 404 page, common security headers, and sensible static-asset caching. Ensure `mod_rewrite`, `mod_headers`, and `mod_expires` are enabled if those features are desired.

## Database

1. Import `php/db_setup.sql`.
2. Set `PORTFOLIO_DB_HOST`, `PORTFOLIO_DB_NAME`, `PORTFOLIO_DB_USER`, and `PORTFOLIO_DB_PASSWORD` in the server environment.
3. Never commit real database credentials.

## Email notifications

Set the three EmailJS values in `js/main.js`:

- `YOUR_EMAILJS_PUBLIC_KEY`
- `YOUR_EMAILJS_SERVICE_ID`
- `YOUR_EMAILJS_TEMPLATE_ID`

The template receives `from_name`, `from_email`, and `message`.

## Optional spam protection

Set `TURNSTILE_SECRET_KEY` in the server environment and add a Cloudflare Turnstile site key to the form when enabling Turnstile.

## Domain

Confirm `https://manoj-dahal.com.np/` is the production domain, then submit `sitemap.xml` to search engines. Update the canonical URL, Open Graph image URL, and `robots.txt` if the deployed domain differs.
