# CodeSearch Engine — Frontend

A production-ready React + Tailwind CSS frontend for the Hybrid Code Search Engine backend.

## Design

- **Theme**: Liquid dark — black / charcoal / deep navy / electric blue / violet accents
- **Typography**: Space Grotesk (display) + DM Sans (body) + JetBrains Mono (code)
- **Animations**: Liquid blobs, shimmer loaders, scan-line effects, smooth transitions
- **Responsive**: Mobile-first, works on all screen sizes

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, feature grid, mode showcase, CTA |
| `/repos` | Repository Loader | Add GitHub URLs, load progress, status list |
| `/search` | Search Dashboard | Query input, 4 mode cards, example queries |
| `/results` | Results | Ranked cards with code viewer, scores, reasons |
| `/metrics` | Metrics Dashboard | All 8 eval metrics, radar + bar charts |
| `/about` | About & Settings | API settings, pipeline architecture, API reference |

## API Mapping

| Frontend action | Backend endpoint |
|----------------|-----------------|
| Load repos | `POST /load-repos` |
| Search | `POST /search` |
| Run metrics | `GET /metrics` |
| Health check | `GET /` |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure backend URL
cp .env.example .env
# Edit REACT_APP_API_URL=http://localhost:8000

# 3. Start the dev server
npm start

# 4. Build for production
npm run build
```

## Backend Requirements

Make sure your FastAPI backend is running:

```bash
cd code_search_engine_clean
pip install -r requirements.txt
uvicorn api.api:app --reload --port 8000
```

Enable CORS in your FastAPI app if running on different origins:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx       # Page shell with navbar + footer
│   │   └── Navbar.jsx       # Fixed top nav with repo status pill
│   └── ui/
│       └── index.jsx        # All reusable UI components
├── pages/
│   ├── Landing.jsx          # Landing / home page
│   ├── Repos.jsx            # Repository loader
│   ├── Search.jsx           # Search dashboard
│   ├── Results.jsx          # Search results
│   ├── Metrics.jsx          # Evaluation metrics dashboard
│   └── About.jsx            # About & settings
├── utils/
│   ├── api.js               # API service layer
│   └── AppContext.js        # Global state (repos, search, metrics)
├── styles/
│   └── globals.css          # Tailwind + custom CSS (liquid theme)
├── App.jsx                  # Router + providers
└── index.js                 # Entry point
```

## Reusable Components (src/components/ui/index.jsx)

- `LanguageBadge` — Python / Java / C++ colored badges
- `TypeBadge` — function / class type indicator
- `ConfidenceBadge` — High / Medium / Low with color
- `Button` — primary / secondary / ghost variants
- `Input` — styled text input
- `ScoreBar` — animated gradient score bar
- `StatCard` — metric display card
- `Spinner` — loading spinner
- `EmptyState` — empty state with icon + CTA
- `ErrorAlert` — dismissible error banner
- `SectionHeader` — page section header with optional right slot
