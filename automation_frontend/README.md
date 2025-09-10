# Social Automator Frontend (Angular)

This Angular app provides the UI for authentication, account connections, scheduling posts, managing content, analytics visualizations, and automation rules.

## Run locally

```bash
npm install
npm start
```

By default dev server runs on http://localhost:3000

To point the app to a specific backend base URL at runtime, create `public/config.js` with:
```js
window.__API_BASE_URL__ = 'http://localhost:3001';
```

## Routes

- /auth — Login/Register
- / — Dashboard (KPIs + Trends)
- /schedule — Create and manage scheduled posts
- /content — Posted content and metrics
- /analytics — Analytics dashboard
- /automation — Automation rules
- /accounts — Connect/Disconnect social accounts

## Notes

- API base URL defaults to `/api`. When reverse proxying, map `/api` to automation_backend.
- Minimalistic styles use CSS variables defined in `src/styles.css`.
- No external chart dependency; a simple SVG line chart is implemented.
