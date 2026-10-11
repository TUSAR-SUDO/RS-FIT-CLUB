# Run doc — RS FIT CLUB website (Vite + React + TypeScript)

Workspace / main checkout: `C:\Users\mahak\OneDrive\Desktop\RS FIT CLUB`
Preview URL: `http://127.0.0.1:5173/`

## 1. Reproduce the artifacts a fresh checkout needs

- **Install:** `npm install` at the repo root. Node 24 / npm 11 is what this machine runs; the
  lockfile is `package-lock.json` (commit it, don't regenerate it on a whim).
- **Env files:** none are *required* to install, run or build.
  - With no `.env`, the trial form falls back to the FormSubmit relay addressed to
    `siteConfig.business.email` in production, and logs the submission only under `vite dev`.
  - To point the form at a provider or a local capture endpoint, create `.env` (git-ignored) with
    `VITE_LEAD_ENDPOINT=<url>` — see `.env.example`.
  - For local lead capture, run the scratch sink: `node .dev/lead-sink.cjs` (listens on
    `127.0.0.1:8899`, appends to `.dev/leads-captured.jsonl`) and set
    `VITE_LEAD_ENDPOINT=http://127.0.0.1:8899/leads`. `.dev/` is git-ignored scratch.
- **Images/fonts:** the derived photo ladders and brand assets are committed under `src/assets/` and
  `public/media/`, so nothing has to be generated to run or build. `npm run photos` and
  `npm run assets` (Python + Pillow + numpy) are only needed when `FILES/` changes.
- **Untracked source file to be aware of:** `src/pages/InteriorPage.module.css` is imported by every
  interior page and is still untracked in git. A fresh clone cannot build until it is committed.

## 2. Run the server

Bind explicitly to IPv4 loopback. A bare `npm run dev` can bind `::1` only, which serves
`http://localhost:5173` but leaves a `http://127.0.0.1:5173` preview URL dead.

Detached, Windows (this is the recipe the preview system uses):

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--host','127.0.0.1' -RedirectStandardOutput 'C:\Users\mahak\OneDrive\Desktop\RS FIT CLUB\.freebuff\preview-7787f056-b9b4-4f51-8bdb-d47d0a27e022.log' -RedirectStandardError 'C:\Users\mahak\OneDrive\Desktop\RS FIT CLUB\.freebuff\preview-7787f056-b9b4-4f51-8bdb-d47d0a27e022.log.err' -WindowStyle Hidden -PassThru).Id"
```

- **Port:** 5173, the project default. If it is taken, pass `--port <n>` and register the matching URL.
- **Logs:** `.freebuff/preview-7787f056-b9b4-4f51-8bdb-d47d0a27e022.log` and `.log.err` (PowerShell
  refuses the same path for both streams). Vite prints `ready in …` and the bound URL.
- **Readiness:** `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5173/` → `200`. The PID to
  register is the **vite child** (`node`, the process `netstat` shows listening on 5173), not the
  `npm.cmd` wrapper.
- **Stop:** `taskkill //PID <vite pid> //F`.
- **Checks before calling a change done:** `npm run format -- --check`, `npm run lint`,
  `npm run typecheck`, `npm run build`.
