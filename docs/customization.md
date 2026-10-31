# Customisation guide

The simplest way to make this portfolio yours is to edit `constants/portfolio-constants.ts`.

## 1. Personal details & Hero
Edit `HERO_NAME`, `HERO_TITLE`, `HERO_TAGLINE`, and `CONTACT_EMAIL` in `constants/portfolio-constants.ts`.

## 2. Projects & Experiences
Update `MY_PROJECTS` and `MY_WORK_EXPERIENCE` with your own projects and employment history.

## 3. Skills & Services
Configure your skillset in `MY_SKILLS` and services in `MY_SERVICES`.

## 4. Go Backend & Database
- Development: SQLite is automatically used when running the backend (`dev.db`).
- Production: Set `APP_ENV=production` and `DATABASE_URL` pointing to your PostgreSQL instance.
- Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` or production environment variables.

## Before you deploy

- [ ] Résumé PDF replaced or removed
- [ ] The 3D model is yours, or you kept its attribution
- [ ] Project screenshots are yours to publish
- [ ] `NEXT_PUBLIC_SITE_URL` set to your domain
- [ ] `public/og.jpg` replaced with your own preview
- [ ] `/sitemap.xml` and `/robots.txt` resolve on the live site
- [ ] Go backend running with PostgreSQL in production
- [ ] `npm run build` passes
- [ ] `LICENSE` updated to your name
