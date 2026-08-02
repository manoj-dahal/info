<?php
// Copy this file outside the public web root as config.php and load its values as environment variables.
// Never commit real credentials or EmailJS private keys.
putenv('PORTFOLIO_DB_HOST=localhost');
putenv('PORTFOLIO_DB_NAME=portfolio');
putenv('PORTFOLIO_DB_USER=root');
putenv('PORTFOLIO_DB_PASSWORD=change-me');
// Optional: enables server-side Cloudflare Turnstile verification.
putenv('TURNSTILE_SECRET_KEY=your-turnstile-secret-key');
