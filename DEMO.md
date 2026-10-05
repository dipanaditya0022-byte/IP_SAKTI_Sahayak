# IP-SAKTI Sahayak — Demo Guide

> Internal use only. Do not share publicly.

---

## Live Demo URL

https://ipsakti-three.vercel.app

Backend API docs: https://ipsakti-backend-1dn4.onrender.com/docs

---

## Demo Accounts

| Role       | Email                       | Password     | Login URL      |
|------------|-----------------------------|--------------|----------------|
| User       | user@ipsakti.demo           | Demo@12345   | /login         |
| Researcher | researcher@ipsakti.demo     | Demo@12345   | /login         |
| Reviewer   | reviewer@ipsakti.demo       | Demo@12345   | /login         |
| Admin      | admin@ipsakti.demo          | Demo@12345   | /admin/login   |

Admin login is at /admin/login — type this directly in the address bar. It is not linked from any public page.

---

## User Login

1. Go to the live URL
2. Click Sign in
3. Click Use demo account to fill user@ipsakti.demo and the password, then click Sign in
4. You land on the Dashboard

---

## Admin Login

1. Open a private (incognito) window, or sign out of the user account first. If a user is already signed in in the same browser, /admin/login sends you back to the app.
2. Go to: [live URL]/admin/login
3. Enter admin@ipsakti.demo and Demo@12345
4. You land on the Admin Console at /admin/dashboard

Admin session is completely separate from the user session. A normal user session is rejected on every /admin/* route server-side, not just hidden in the menu.

---

## Seeded Demo Innovation

Name: AyuCalm-X (DEMO)

Pre-loaded so you can show the system immediately without typing anything.

---

## Admin Console — What to Show Jury

| Section               | What to show                                               |
|-----------------------|------------------------------------------------------------|
| Dashboard             | Live metrics — users, sources, documents, chunks, queries  |
| RAG Monitoring        | Citation support rates, unsupported rate, latency          |
| Citation Verification | Claim-level verification results                           |
| Source Registry       | Real vs demo documents, source tiers                       |
| Documents             | Honest labelling — real statute vs fictional demo patent   |
| Evaluation            | Run live — real computed results on demand                 |
| Audit Logs            | Who did what and when                                      |

---

## Access Isolation Proof

1. Login as researcher@ipsakti.demo at /login
2. Navigate to /admin/dashboard directly in the address bar
3. Result: you are sent back to /app, and the admin API returns 403 for the user session. The check is on the server, not just hidden in the menu.

---

## Key Points to Narrate

| What to say                                              | Where to show                              |
|----------------------------------------------------------|--------------------------------------------|
| Not a chatbot — every answer verified against a source   | AI Assistant — click any citation          |
| Says I don't know instead of guessing                    | Ask for TKDL records — watch it refuse     |
| Jurisdiction is a hard filter not cosmetic               | Compare India vs USA classification        |
| Ambiguity is flagged not silently guessed                | Brahmi ingredient — flag appears           |
| Disease claim changes the entire regulatory outcome      | US classification shows Botanical Drug     |
| Admin is completely separate from the app                | /admin/login — separate session proven     |

---

## Quick Reference

User login:  /login         redirects to /app (dashboard)
Admin login: /admin/login   redirects to /admin/dashboard

User JWT cannot access /admin/* — returns 403
Admin JWT cannot access user workspace data

---


For what was built and why see: docs/reports/MVP_Overview_and_Rationale.pdf
For technical architecture see: Technical Report PS-045
