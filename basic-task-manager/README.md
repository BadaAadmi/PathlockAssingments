# Basic Task Manager

This project demonstrates a minimal full-stack app: a .NET 8 backend (in-memory) and a React + TypeScript frontend built with Vite.

## What you get
 - Backend: C# .NET 8 Web API with CRUD endpoints for tasks (in-memory storage).
- Frontend: React + TypeScript (Vite) UI that lists, adds, toggles, filters, and deletes tasks. Tasks are also saved to localStorage as a fallback.
 - Endpoints (under /api/tasks): GET all, GET by id, POST, DELETE /{id}, PUT /{id}/toggle
## Run locally (PowerShell)
 - Model: `Id` (int), `Description` (string), `IsCompleted` (bool).
1) Backend

```powershell
cd "d:\Jashandeep Singh Mehra\Pathlock Project\basic-task-manager\backend"
# build
dotnet build
# run (default will listen on Kestrel, port depends on environment; try open the printed URL)
dotnet run
```

By default the API endpoints are at `http://localhost:5000/api/tasks` or the Kestrel-assigned URL shown when running.

2) Frontend

```powershell
cd "d:\Jashandeep Singh Mehra\Pathlock Project\basic-task-manager\frontend"
# install (if not already installed)
npm install
# start dev server (Vite)
npm run dev
```

Open `http://localhost:3000` (Vite will usually open automatically). The frontend expects the API at `http://localhost:5000/api` by default. To change it, set the environment variable `VITE_API_URL` before starting the dev server, for example in PowerShell:

```powershell
$env:VITE_API_URL = 'http://localhost:5000/api'; npm run dev
```

## Notes
- Backend uses in-memory storage only; tasks are not persisted server-side between restarts.
- Frontend saves the latest task list to `localStorage` as a fallback so your tasks survive page reloads even when the backend isn't running.
- No authentication or multi-user support.

## Project layout
- `backend/` - .NET 8 Web API
- `frontend/` - React + TypeScript (Vite)

