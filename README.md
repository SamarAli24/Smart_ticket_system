# Smart Support Ticket System

A full-stack support ticket management app. Support agents and admins can log in, create and track tickets, update their status, and manage the team. The system also automatically figures out how urgent each new ticket is using an AI model, with a built-in rule-based backup in case the AI is unavailable.

## Features

- **Ticket management**: create tickets, list all tickets, view a single ticket, update its status (`Open` → `InProgress` → `Resolved` → `Closed`), and delete it (soft delete, so the record is kept but hidden).
- **Automatic priority detection**: every new ticket is automatically classified as `High`, `Medium`, or `Low` priority. This is done by an AI model first, with a keyword-based rule engine as a fallback if the AI call fails or isn't configured (see [How the AI Priority Feature Works](#how-the-ai-priority-feature-works)).
- **User management**: add new users (Admin or Agent), list all users, and deactivate a user account.
- **Ticket assignment**: a ticket can optionally be assigned to a specific user when it's created.
- **Authentication**: email/password login using JWT (JSON Web Tokens). Logout revokes the token server-side so it can't be reused, even if it hasn't expired yet.
- **Request logging**: every single HTTP request (method, path, status code, response time, IP, and who made it) is recorded to the database.
- **Activity logging**: every successful create/update/delete action is recorded as an activity log entry, automatically, with no extra code needed per controller. It stores who did what, to which record, and when.
- **API documentation**: a live Swagger UI page for exploring and testing every endpoint (development mode only).
- **Demo data on first run**: the database is automatically seeded with 4 sample users and 5 sample tickets the first time the backend runs, so there's data to look at immediately.

## Tech Stack

### Backend
- **ASP.NET Core 8.0** (Web API, C#)
- **Entity Framework Core 8.0.11** for database access and migrations
- **SQLite** (`Microsoft.EntityFrameworkCore.Sqlite`) as the database engine
- **JWT authentication** via `Microsoft.AspNetCore.Authentication.JwtBearer` 8.0.11
- **ASP.NET Core Identity password hashing** via `Microsoft.Extensions.Identity.Core` 8.0.11
- **Swashbuckle / Swagger** 6.7.3 for API documentation UI
- **Google Gemini API** (`gemini-3.1-flash-lite`), used for AI-based ticket priority classification

### Frontend
- **React 18.3.1** with **TypeScript 5.6.3**
- **Vite 5.4.11** as the dev server and build tool
- **React Router 6.28.0** for client-side routing
- **Tailwind CSS 3.4.15** for styling
- **lucide-react** for icons

## Project Structure

```
Smart-Ticket-System/
├── Backend/
│   └── TicketSystem.Api/
│       ├── Controllers/         # API endpoints (Auth, Tickets, Users)
│       ├── Services/            # Business logic (Implementations + Interfaces)
│       ├── Repositories/        # Database access layer (Implementations + Interfaces)
│       ├── Integrations/AI/     # AI provider client + AI-based priority classifier
│       ├── Models/               # Database entities (Ticket, User, etc.) + Models/Logging
│       ├── DTOs/                # Request/response data shapes
│       ├── Data/                # EF Core DbContext, Migrations, and DbSeeder (demo data)
│       ├── Middleware/          # Request logging & global exception handling
│       ├── Filters/             # Automatic activity logging filter
│       ├── Helpers/             # Small shared helpers (JWT settings, message codes)
│       ├── Common/               # Shared response envelope (Result) & extensions
│       └── appsettings.json     # App configuration (connection string, JWT, AI key)
│
└── Frontend/
    └── src/
        ├── pages/               # Top-level pages (Login, Dashboard, Tickets, CreateTicket, Users)
        ├── components/          # UI components, grouped by feature (auth, tickets, users, dashboard, layout, common)
        ├── services/            # API calls to the backend (httpClient, authService, ticketsService, usersService)
        ├── context/             # AuthContext (login state, session storage)
        ├── hooks/                # Custom React hooks (useTickets, useUsers)
        └── types.ts              # Shared TypeScript types
```

## Prerequisites

Make sure you have these installed before you start:

- **[.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)**, needed to run the backend
- **[Node.js 18+](https://nodejs.org/)** (Node 20 recommended), needed to run the frontend
- **npm** (comes with Node.js)
- *(Optional)* A **Google Gemini API key**, if you want the AI-based priority classification to actually call the AI. Without it, the system automatically falls back to the rule-based classifier and everything still works.

## Setup & Configuration

### 1. Clone the repository

```bash
git clone https://github.com/SamarAli24/Smart_ticket_system.git
cd Smart_ticket_system
```

### 2. Backend setup

```bash
cd Backend/TicketSystem.Api
dotnet restore
```

**Configure your settings.** Open `appsettings.json` and check the values below (see the [Configuration Keys](#environment-variables--configuration-keys) table for details). The database connection string is already set up to use a local SQLite file, so you usually don't need to change it.

**Add your AI API key (optional, but recommended).** Never commit a real API key into `appsettings.json`. Instead, use .NET's local **User Secrets** (this project already has a `UserSecretsId` configured):

```bash
dotnet user-secrets set "AiApi:ApiKey" "YOUR_API_KEY_HERE"
```

If you skip this step, ticket priority is simply decided by the rule-based classifier instead. No errors, no crashes.

**Run database migrations.** This step is actually optional, since the app calls `db.Database.Migrate()` automatically on startup and creates/updates the SQLite database for you. But you can also run it manually:

```bash
dotnet ef database update
```

**Run the backend:**

```bash
dotnet run
```

By default the API will be available at:
- `https://localhost:7276` (HTTPS)
- `http://localhost:5021` (HTTP)
- Swagger docs: `https://localhost:7276/swagger`

### 3. Frontend setup

Open a new terminal:

```bash
cd Frontend
npm install
```

**Configure the API URL.** The frontend reads the backend's address from a `.env` file. Create/check `Frontend/.env`:

```
VITE_API_BASE_URL=https://localhost:7276/api
```

**Run the frontend dev server:**

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

### Demo login

Once seeded, you can log in with any of these (all seeded users share the same password):

| Email | Password | Role |
|---|---|---|
| `alice.johnson@example.com` | `Password123!` | Admin |
| `bob.smith@example.com` | `Password123!` | Agent |
| `carol.lee@example.com` | `Password123!` | Agent |

## Environment Variables / Configuration Keys

These live in `Backend/TicketSystem.Api/appsettings.json` (or User Secrets / environment variables for anything sensitive):

| Key | Description | Example |
|---|---|---|
| `ConnectionStrings:DefaultConnection` | SQLite database file location | `Data Source=ticketsystem.db` |
| `Jwt:Key` | Secret key used to sign login tokens (must be at least 32 characters). Can also be overridden with a `JWT_KEY` environment variable. | `YOUR_JWT_SIGNING_KEY_HERE` |
| `Jwt:Issuer` | Token issuer name | `TicketSystem.Api` |
| `Jwt:Audience` | Token audience name | `TicketSystem.Client` |
| `Jwt:ExpiryMinutes` | How long a login token stays valid | `60` |
| `AiApi:ApiKey` | Your Gemini API key. Leave empty to use rule-based priority only. | `YOUR_API_KEY_HERE` |
| `AiApi:Model` | Which Gemini model to call | `gemini-3.1-flash-lite` |
| `AiApi:BaseUrl` | Base URL of the AI provider's API | `https://generativelanguage.googleapis.com/v1beta/models` |

Frontend (`Frontend/.env`):

| Key | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Where the frontend sends its API requests | `https://localhost:7276/api` |

> ⚠️ **Never commit real secrets.** Use placeholders like `YOUR_API_KEY_HERE` in any file that gets committed, and keep real keys in User Secrets, environment variables, or a `.env` file that's excluded from git.

## How the AI Priority Feature Works

When a new ticket is created, the system decides how urgent it is automatically. No one has to pick a priority manually.

1. **AI classification (primary):** The ticket's description is sent to a Gemini AI model with a short instruction: *"classify this as High, Medium, or Low priority."* The AI's one-word answer becomes the ticket's priority.
2. **Rule-based classification (fallback):** If the AI key isn't configured, the request fails, times out (5 seconds), or the AI replies with something that isn't clearly "High/Medium/Low," the system instantly falls back to a simple keyword scan of the description instead:
   - Contains words like *"server down," "system unavailable," "critical," "outage"* → **High**
   - Contains words like *"error," "not working," "bug," "issue"* → **Medium**
   - Anything else → **Low**

This means ticket creation never fails or hangs because of an AI outage. There's always a sensible priority assigned either way.

## API Endpoints Overview

All routes are prefixed with `/api`. Endpoints marked 🔒 require a valid JWT (sent as `Authorization: Bearer <token>`).

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Log in with email + password, get back a JWT token |
| POST 🔒 | `/api/auth/logout` | Log out and revoke the current token |
| GET 🔒 | `/api/tickets` | Get all tickets |
| GET 🔒 | `/api/tickets/{id}` | Get a single ticket by ID |
| POST 🔒 | `/api/tickets` | Create a new ticket (priority is auto-assigned) |
| PATCH 🔒 | `/api/tickets/{id}/status` | Update a ticket's status |
| DELETE 🔒 | `/api/tickets/{id}` | Delete a ticket (soft delete) |
| GET 🔒 | `/api/users` | Get all users |
| POST 🔒 | `/api/users` | Create a new user (Admin or Agent) |
| PATCH 🔒 | `/api/users/{id}/deactivate` | Deactivate a user account |

> Full interactive documentation is available through Swagger UI at `/swagger` when running the backend in development mode.

## Assumptions & Trade-offs

- **SQLite instead of a full database server.** Chosen for simplicity, so the project runs with zero external setup. The connection string can be swapped for SQL Server/PostgreSQL later without changing application code, since access always goes through EF Core.
- **Soft delete for tickets.** Deleting a ticket just marks it `IsDeleted = true` rather than removing the row, so history isn't lost.
- **Roles exist, but every logged-in user currently has the same API permissions.** `Admin` and `Agent` are tracked on each user and shown in the UI, but the backend doesn't yet restrict specific endpoints (e.g. creating users) to Admins only. Any authenticated user can call any endpoint.
- **Session storage on the frontend.** The login token is kept in the browser's `sessionStorage` (cleared when the tab closes), not a persistent cookie, to keep the demo simple.
- **Shared demo password.** All seeded demo accounts use the same password (`Password123!`) purely for ease of testing; this would never be done in a real production system.
- **AI classification has a hard 5-second timeout** and always has the rule-based classifier as a safety net, so a slow or misconfigured AI provider can never block ticket creation.
- **Self-signed HTTPS certificate in development.** The frontend's dev proxy is configured to accept the .NET dev certificate without validation, which is fine locally but would need a real certificate in production (handled separately by the deploy pipeline).

## Author

Built by [Samar Ali](https://github.com/SamarAli24).
