# Job Application Tracker

A modern, AI-assisted job application tracker that helps you organize your job search with a Kanban-style pipeline, analytics dashboard, document vault, and intelligent job data extraction powered by Google Gemini.

Built with React 19, TypeScript, Vite, Tailwind CSS, and Firebase.

## Features

- **Kanban Pipeline** — Drag-and-drop board to move applications through customizable stages (Bookmarked, Applied, Technical, Onsite, Offers, etc.).
- **Customizable Columns** — Add, rename, reorder, and delete pipeline columns to match your workflow.
- **AI Job Extraction** — Paste a job description or URL and let Gemini auto-fill title, company, requirements, and more.
- **Analytics Dashboard** — Visualize your pipeline funnel, application velocity, and offer rate with interactive charts.
- **Document Vault** — Store resumes, cover letters, and other assets per application.
- **Quick Links** — One-click access to your most-used job boards and resources.
- **Notifications** — Follow-up and interview reminders.
- **Cloud Sync** — Real-time sync across devices via Firebase Firestore.
- **Google Sign-In** — Secure authentication out of the box.
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
| AI | Google Gemini (`@google/genai`) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [Firebase](https://firebase.google.com/) project (with Authentication and Firestore enabled)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
git clone <your-repo-url>
cd Job-Application-Tracker
npm install
```

### Configuration

1. Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

2. Set the following variables in `.env.local`:

   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   APP_URL="http://localhost:3000"
   ```

3. Add your Firebase web app config to `firebase-applet-config.json` (or set the corresponding env vars used in [src/firebase.ts](src/firebase.ts)).

4. Deploy the Firestore security rules in [firestore.rules](firestore.rules) to your Firebase project:

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
│   ├── firebase.ts        # Firebase initialization
│   ├── types.ts           # Shared TypeScript types
│   └── main.tsx           # Vite entry point
├── firestore.rules        # Firestore security rules
├── index.html             # Vite HTML entry
├── vite.config.ts
└── package.json
```

## Usage

1. **Sign in** with your Google account on the welcome screen.
2. **Add a job** with the "+" button in the top bar — manually or by pasting a description/URL for AI extraction.
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

Make sure your production environment provides `GEMINI_API_KEY` and the Firebase config at runtime.

## License

MIT
