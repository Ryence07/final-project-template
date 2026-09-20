# PaddleMatch

PaddleMatch is a web application that helps pickleball players find suitable paddles and connect with other players based on their preferences.

**Live site:** https://ryence07.github.io/final-project-template/
**API:** Not deployed yet
**Demo video:** To be added in Week 3

**Current status:** The frontend is currently deployed in demo mode. The API and PostgreSQL database will be developed in the next phase.
<img width="1920" height="1310" alt="homeryence" src="https://github.com/user-attachments/assets/e84fed96-452e-4286-bc97-02987489be34" />
---

## What it does

- Recommends paddles based on skill level, playing style, and budget
- Shows paddle details and information
- Helps players find other players based on skill level
- Displays a player leaderboard

---

## Built with

React and Vite on the front end. The planned backend will use Express and PostgreSQL. The frontend is deployed on GitHub Pages.

---

## Demo mode

The current version uses sample data stored in the frontend, so the application can be used without an API or database.

The planned final version will connect the React frontend to an Express API and PostgreSQL database.

---

## Running it yourself

Frontend only:

```bash
cd client
npm install
npm run dev
```

The application runs at:

```
http://localhost:5173
```

---

## Environment variables

The backend variables will be configured when the API is developed.

| Name | Where | Purpose |
|------|-------|---------|
| VITE_USE_MOCK_API | Client | Controls demo/API mode |
| VITE_API_BASE_URL | Client | URL of the Express API |
| DATABASE_URL | Server | PostgreSQL connection |
| CORS_ORIGINS | Server | Allowed frontend origins |

---

## Deploying

**Client:** The frontend is deployed to GitHub Pages using the existing GitHub Actions workflow.

**API and database:** Not deployed yet. These will be developed and deployed in the next phase.

---

## Project structure

```
client/     React + Vite frontend
server/     Express API
docs/       Project documentation
```

---

## Architecture

Currently, the React + Vite frontend runs with sample data and is hosted on GitHub Pages. The planned architecture will connect the frontend to an Express API, which will communicate with a PostgreSQL database.

```
React + Vite → Express API → PostgreSQL
```

---

## What I would do next

1. Develop the Express API and PostgreSQL database.
2. Connect the frontend to the backend.
3. Deploy and test the complete application before the Week 3 demonstration.

---

## Author

Cortez, Ryence S.
CS-403 — 2215-6APSI
Holy Angel University

---

## Licence

MIT, see LICENSE.
