# Smart Hook Frontend

React + Vite dashboard for the Smart Hook backend. Lets users sign in, manage devices, view live transit/weather, and configure commute notifications.

## Tech Stack

- **Framework**: React 19 + React Router 7
- **Build**: Vite 6
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js (`react-chartjs-2`)
- **Icons**: lucide-react

## Getting Started

### Prerequisites
- Node.js 18+
- A running instance of the [Smart Hook backend](../smart-hook-backend)

### Installation

```bash
npm install
```

### Environment

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:3000/api
```

`VITE_API_URL` is the base URL of the backend API (no trailing slash). It is consumed by `src/lib/api.js` and `src/context/AuthContext.jsx`.

### Running

```bash
npm run dev       # local dev server (default: http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Routes

Public (`AuthLayout`):

- `/login` — sign in.
- `/register` — create an account.
- `/forgot-password` — request a password-reset email.
- `/reset-password?token=…` — set a new password using the token from the reset email.

Protected (`DashboardLayout`, requires JWT in `localStorage`):

- `/` — Overview.
- `/devices` — manage hooks.
- `/settings` — profile, addresses, journey preferences, and notifications.

## Features

- **Authentication** — JWT stored in `localStorage`; the `apiFetch` helper auto-attaches the `Authorization` header and forces a logout on `401`.
- **Password Reset** — "Forgot password?" link on the sign-in page kicks off the backend reset flow; the emailed link opens `/reset-password` with the token pre-filled.
- **Commute Notifications** — the Settings page toggle and "minutes before" input call `GET`/`PATCH /api/notifications/preferences` so users can opt in and choose how far ahead of departure they want to be emailed.
- **Devices** — add, list, and configure hooks; each device card displays its current transit and weather.
