# Job Application Tracker

A modern job application tracker that helps you organize your job search with a Kanban-style pipeline, analytics dashboard, and document vault.

Built with React 19, TypeScript, Vite, Tailwind CSS, and Firebase.

**Live app:** [job-application-tracker-533084568852.us-west1.run.app](https://job-application-tracker-533084568852.us-west1.run.app)

## Screenshots

<!-- Add your screenshots below. Drop image files in a `docs/` or `assets/` folder and reference them here. -->

| Kanban Pipeline | Analytics Dashboard |
| --- | --- |
| ![Kanban board](docs/screenshot-board.png) | ![Analytics dashboard](docs/screenshot-analytics.png) |

## Features

- **Kanban Pipeline** — Drag-and-drop board to move applications through customizable stages (Bookmarked, Applied, Technical, Onsite, Offers, etc.).
- **Customizable Columns** — Add, rename, reorder, and delete pipeline columns to match your workflow.
- **Analytics Dashboard** — Visualize your pipeline funnel, application velocity, and offer rate with interactive charts.
- **Document Vault** — Store resumes, cover letters, and other assets per application.
- **Quick Links** — One-click access to your most-used job boards and resources.
- **Notifications** — Follow-up and interview reminders.
- **Cloud Sync** — Real-time sync across devices via Firebase Firestore.
- **Secure Sign-In** — Google sign-in plus email/password authentication out of the box.
- **Demo Data** — Load a sample profile and 8 example applications to explore the app instantly.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4 |
| Drag & Drop | `@hello-pangea/dnd` |
| Animations | Motion |
| Charts | Recharts |
| Icons | Lucide |
| Auth & Database | Firebase Authentication, Cloud Firestore |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [Firebase](https://firebase.google.com/) project (with Authentication and Firestore enabled)

### Installation

```bash
git clone <your-repo-url>
cd Job-Application-Tracker
npm install
```

### Configuration

1. Copy the example environment file and fill in your own Firebase web app config:

   ```bash
   cp .env.example .env.local
   ```

   Then set the `VITE_FIREBASE_*` values in `.env.local` from your Firebase project settings (Project settings → General → Your apps → SDK setup). `.env.local` is git-ignored and must never be committed.

2. Deploy the Firestore security rules in [firestore.rules](firestore.rules) to your Firebase project:

   ```bash
   firebase deploy --only firestore:rules
   ```

### Run Locally

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run preview
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Build the production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check the project with TypeScript |
| `npm run clean` | Remove the `dist/` directory |

## Project Structure

```
.
├── src/
│   ├── components/        # React UI components (Kanban, modals, screens)
│   ├── constants/         # Mock/demo data
│   ├── lib/               # Utilities (error handling, helpers)
│   ├── App.tsx            # Root component, state, Firestore wiring
│   ├── firebase.ts        # Firebase initialization (config from env vars)
│   ├── types.ts           # Shared TypeScript types
│   └── main.tsx           # Vite entry point
├── firestore.rules        # Firestore security rules
├── .env.example           # Template for Firebase config (copy to .env.local)
├── index.html             # Vite HTML entry
├── vite.config.ts
└── package.json
```

## Usage

1. **Sign in** with your Google account on the welcome screen.
2. **Add a job** with the "+" button in the top bar and fill in the details.
3. **Drag cards** between columns as your applications progress.
4. **Click a card** to view full details, edit, add interview notes, attach documents, or archive.
5. **Customize your board** via the "Edit Board" action to rename, add, or remove columns.
6. **Track progress** in the Analytics tab and manage assets in the Documents tab.
7. **Load demo data** from Settings if you want a populated pipeline to explore.

## Deployment

This project builds to a static SPA and can be deployed to any static host (Firebase Hosting, Vercel, Netlify, Cloudflare Pages). For Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

Make sure your production/CI environment provides the `VITE_FIREBASE_*` values (from your `.env.local`) at **build time**, since Vite inlines them into the bundle.

## License

MIT
