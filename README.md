## MicroSilk Exchange

> *A dystopian, entirely fictional dark-web tableau where the renegade etinuxE faction auctions “biounits” born from Dr. Tai Ni’s shrink experiments. Nothing here is real advice—it is world-building only.*

### Tech Stack

- **Next.js 15** (App Router) running on **Bun**
- **TypeScript** + **SCSS modules** (no CSS frameworks)
- **MongoDB** via **Mongoose**
- **JWT** auth with client context providers

### Core Features

1. **Biounit Trade Platform** – marketplace grid with search, tier/status filters, and admin moderation controls.
2. **Biounit Database** – admin dashboard with analytics, CRUD form, and lore log viewer.
3. **µWorth Calculator** – cyberpunk slider interface that produces fictional µCredit valuations with glitchy lore hints.

Public pages include Home, Marketplace, Calculator, Documentation, About. Authenticated users gain Dashboard access, while admins unlock the Admin Control Deck for data operations.

### Environment

Create a `.env.local` (or similar) with:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secret
```

### Scripts (Bun)

```bash
bun dev      # start Next.js in development mode
bun build    # production build
bun start    # serve the built app
bun lint     # run eslint
```

### API Surface

| Route | Methods | Description |
| --- | --- | --- |
| `/api/auth/register` | `POST` | Create operative/admin accounts (fictional). |
| `/api/auth/login` | `POST` | Issue JWT cookie. |
| `/api/auth/logout` | `POST` | Clear session cookie. |
| `/api/auth/me` | `GET` | Return current session payload. |
| `/api/biounits` | `GET`, `POST*` | Query listings; create requires admin. |
| `/api/biounits/[id]` | `PATCH*`, `DELETE*` | Update or purge a biounit (admin only). |
| `/api/logs` | `GET`, `POST*` | Read or append lore logs. |

`*` requires an admin JWT cookie.

### Data Models

- **User** – `username`, `password`, `role` (`operative` | `admin`).
- **Biounit** – bioId, shrink phase, nano vital metrics, containment tier, µCredit pricing, lore log, status.
- **LoreLog** – message, severity (`info`, `anomaly`, `breach`, `cataclysm`), source.

### Usage Notes

- The UI, copy, and data are **explicitly fictional** and exist solely for sci-fi storytelling.
- Admin dashboards include seeding logic so first launch showcases example biounits and logs.
- SCSS mixins/panels drive the neon black-market aesthetic—extend through `src/styles/mixins.scss` if you need more effects.

Enjoy exploring the myth of the MicroSilk Exchange.
