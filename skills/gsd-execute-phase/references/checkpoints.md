---
title: Checkpoints
type: reference
category: gsd
description: GSD Checkpoints reference documentation
version: 1.0
focused: true
on-demand: true
---

## Overview

Plans execute autonomously. Checkpoints formalize interaction points where human verification or decisions are needed.

**Core principle:** Claude automates everything with CLI/API. Checkpoints are for verification and decisions, not manual work.

**Golden rules:**
1. **If Claude can run it, Claude runs it** - Never ask user to execute CLI commands, start servers, or run builds
2. **Claude sets up the verification environment** - Start dev servers, seed databases, configure env vars
3. **User only does what requires human judgment** - Visual checks, UX evaluation, "does this feel right?"
4. **Secrets come from user, automation comes from Claude** - Ask for API keys, then Claude uses them via CLI
5. **Auto-mode bypasses verification/decision checkpoints** — When `workflow.auto_advance` is true in config: human-verify auto-approves, decision auto-selects first option, human-action still stops (auth gates cannot be automated)

## checkpoint:human-verify (Most Common - 90%)

**When:** Claude completed automated work, human confirms it works correctly.

**Use for:**
- Visual UI checks (layout, styling, responsiveness)
- Interactive flows (click through wizard, test user flows)
- Functional verification (feature works as expected)
- Audio/video playback quality
- Animation smoothness
- Accessibility testing

**Structure:**
```xml

  [What Claude automated and deployed/built]
  
    [Exact steps to test - URLs, commands, expected behavior]
  
  [How to continue - "approved", "yes", or describe issues]

```

**Example: UI Component (shows key pattern: Claude starts server BEFORE checkpoint)**
```xml

  Build responsive dashboard layout
  src/components/Dashboard.tsx, src/app/dashboard/page.tsx
  Create dashboard with sidebar, header, and content area. Use Tailwind responsive classes for mobile.
  npm run build succeeds, no TypeScript errors
  Dashboard component builds without errors

  Start dev server for verification
  Run `npm run dev` in background, wait for "ready" message, capture port
  curl http://localhost:3000 returns 200
  Dev server running at http://localhost:3000

  Responsive dashboard layout - dev server running at http://localhost:3000
  
    Visit http://localhost:3000/dashboard and verify:
    1. Desktop (>1024px): Sidebar left, content right, header top
    2. Tablet (768px): Sidebar collapses to hamburger menu
    3. Mobile (375px): Single column layout, bottom nav appears
    4. No layout shift or horizontal scroll at any size
  
  Type "approved" or describe layout issues

```

**Example: Xcode Build**
```xml

  Build macOS app with Xcode
  App.xcodeproj, Sources/
  Run `xcodebuild -project App.xcodeproj -scheme App build`. Check for compilation errors in output.
  Build output contains "BUILD SUCCEEDED", no errors
  App builds successfully

  Built macOS app at DerivedData/Build/Products/Debug/App.app
  
    Open App.app and test:
    - App launches without crashes
    - Menu bar icon appears
    - Preferences window opens correctly
    - No visual glitches or layout issues
  
  Type "approved" or describe issues

```

## checkpoint:decision (9%)

**When:** Human must make choice that affects implementation direction.

**Use for:**
- Technology selection (which auth provider, which database)
- Architecture decisions (monorepo vs separate repos)
- Design choices (color scheme, layout approach)
- Feature prioritization (which variant to build)
- Data model decisions (schema structure)

**Structure:**
```xml

  [What's being decided]
  [Why this decision matters]
  
    
      [Option name]
      [Benefits]
      [Tradeoffs]
    
    
      [Option name]
      [Benefits]
      [Tradeoffs]
    
  
  [How to indicate choice]

```

**Example: Auth Provider Selection**
```xml

  Select authentication provider
  
    Need user authentication for the app. Three solid options with different tradeoffs.
  
  
    
      Supabase Auth
      Built-in with Supabase DB we're using, generous free tier, row-level security integration
      Less customizable UI, tied to Supabase ecosystem
    
    
      Clerk
      Beautiful pre-built UI, best developer experience, excellent docs
      Paid after 10k MAU, vendor lock-in
    
    
      NextAuth.js
      Free, self-hosted, maximum control, widely adopted
      More setup work, you manage security updates, UI is DIY
    
  
  Select: supabase, clerk, or nextauth

```

**Example: Database Selection**
```xml

  Select database for user data
  
    App needs persistent storage for users, sessions, and user-generated content.
    Expected scale: 10k users, 1M records first year.
  
  
    
      Supabase (Postgres)
      Full SQL, generous free tier, built-in auth, real-time subscriptions
      Vendor lock-in for real-time features, less flexible than raw Postgres
    
    
      PlanetScale (MySQL)
      Serverless scaling, branching workflow, excellent DX
      MySQL not Postgres, no foreign keys in free tier
    
    
      Convex
      Real-time by default, TypeScript-native, automatic caching
      Newer platform, different mental model, less SQL flexibility
    
  
  Select: supabase, planetscale, or convex

```

## checkpoint:human-action (1% - Rare)

**When:** Action has NO CLI/API and requires human-only interaction, OR Claude hit an authentication gate during automation.

**Use ONLY for:**
- **Authentication gates** - Claude tried CLI/API but needs credentials (this is NOT a failure)
- Email verification links (clicking email)
- SMS 2FA codes (phone verification)
- Manual account approvals (platform requires human review)
- Credit card 3D Secure flows (web-based payment authorization)
- OAuth app approvals (web-based approval)

**Do NOT use for pre-planned manual work:**
- Deploying (use CLI - auth gate if needed)
- Creating webhooks/databases (use API/CLI - auth gate if needed)
- Running builds/tests (use Bash tool)
- Creating files (use Write tool)

**Structure:**
```xml

  [What human must do - Claude already did everything automatable]
  
    [What Claude already automated]
    [The ONE thing requiring human action]
  
  [What Claude can check afterward]
  [How to continue]

```

**Example: Email Verification**
```xml

  Create SendGrid account via API
  Use SendGrid API to create subuser account with provided email. Request verification email.
  API returns 201, account created
  Account created, verification email sent

  Complete email verification for SendGrid account
  
    I created the account and requested verification email.
    Check your inbox for SendGrid verification link and click it.
  
  SendGrid API key works: curl test succeeds
  Type "done" when email verified

```

**Example: Authentication Gate (Dynamic Checkpoint)**
```xml

  Deploy to Vercel
  .vercel/, vercel.json
  Run `vercel --yes` to deploy
  vercel ls shows deployment, curl returns 200

  Authenticate Vercel CLI so I can continue deployment
  
    I tried to deploy but got authentication error.
    Run: vercel login
    This will open your browser - complete the authentication flow.
  
  vercel whoami returns your account email
  Type "done" when authenticated

  Retry Vercel deployment
  Run `vercel --yes` (now authenticated)
  vercel ls shows deployment, curl returns 200

```

**Key distinction:** Auth gates are created dynamically when Claude encounters auth errors. NOT pre-planned — Claude automates first, asks for credentials only when blocked.

When Claude encounters `type="checkpoint:*"`:

1. **Stop immediately** - do not proceed to next task
2. **Display checkpoint clearly** using the format below
3. **Wait for user response** - do not hallucinate completion
4. **Verify if possible** - check files, run tests, whatever is specified
5. **Resume execution** - continue to next task only after confirmation

**For checkpoint:human-verify:**
```
╔═══════════════════════════════════════════════════════╗
║  CHECKPOINT: Verification Required                    ║
╚═══════════════════════════════════════════════════════╝

Progress: 5/8 tasks complete
Task: Responsive dashboard layout

Built: Responsive dashboard at /dashboard

How to verify:
  1. Visit: http://localhost:3000/dashboard
  2. Desktop (>1024px): Sidebar visible, content fills remaining space
  3. Tablet (768px): Sidebar collapses to icons
  4. Mobile (375px): Sidebar hidden, hamburger menu appears

────────────────────────────────────────────────────────
→ YOUR ACTION: Type "approved" or describe issues
────────────────────────────────────────────────────────
```

**For checkpoint:decision:**
```
╔═══════════════════════════════════════════════════════╗
║  CHECKPOINT: Decision Required                        ║
╚═══════════════════════════════════════════════════════╝

Progress: 2/6 tasks complete
Task: Select authentication provider

Decision: Which auth provider should we use?

Context: Need user authentication. Three options with different tradeoffs.

Options:
  1. supabase - Built-in with our DB, free tier
     Pros: Row-level security integration, generous free tier
     Cons: Less customizable UI, ecosystem lock-in

  2. clerk - Best DX, paid after 10k users
     Pros: Beautiful pre-built UI, excellent documentation
     Cons: Vendor lock-in, pricing at scale

  3. nextauth - Self-hosted, maximum control
     Pros: Free, no vendor lock-in, widely adopted
     Cons: More setup work, DIY security updates

────────────────────────────────────────────────────────
→ YOUR ACTION: Select supabase, clerk, or nextauth
────────────────────────────────────────────────────────
```

**For checkpoint:human-action:**
```
╔═══════════════════════════════════════════════════════╗
║  CHECKPOINT: Action Required                          ║
╚═══════════════════════════════════════════════════════╝

Progress: 3/8 tasks complete
Task: Deploy to Vercel

Attempted: vercel --yes
Error: Not authenticated. Please run 'vercel login'

What you need to do:
  1. Run: vercel login
  2. Complete browser authentication when it opens
  3. Return here when done

I'll verify: vercel whoami returns your account

────────────────────────────────────────────────────────
→ YOUR ACTION: Type "done" when authenticated
────────────────────────────────────────────────────────
```

**Auth gate = Claude tried CLI/API, got auth error.** Not a failure — a gate requiring human input to unblock.

**Pattern:** Claude tries automation → auth error → creates checkpoint:human-action → user authenticates → Claude retries → continues

**Gate protocol:**
1. Recognize it's not a failure - missing auth is expected
2. Stop current task - don't retry repeatedly
3. Create checkpoint:human-action dynamically
4. Provide exact authentication steps
5. Verify authentication works
6. Retry the original task
7. Continue normally

**Key distinction:**
- Pre-planned checkpoint: "I need you to do X" (wrong - Claude should automate)
- Auth gate: "I tried to automate X but need credentials" (correct - unblocks automation)

**The rule:** If it has CLI/API, Claude does it. Never ask human to perform automatable work.

## Service CLI Reference

| Service | CLI/API | Key Commands | Auth Gate |
|---------|---------|--------------|-----------|
| Vercel | `vercel` | `--yes`, `env add`, `--prod`, `ls` | `vercel login` |
| Railway | `railway` | `init`, `up`, `variables set` | `railway login` |
| Fly | `fly` | `launch`, `deploy`, `secrets set` | `fly auth login` |
| Stripe | `stripe` + API | `listen`, `trigger`, API calls | API key in .env |
| Supabase | `supabase` | `init`, `link`, `db push`, `gen types` | `supabase login` |
| Upstash | `upstash` | `redis create`, `redis get` | `upstash auth login` |
| PlanetScale | `pscale` | `database create`, `branch create` | `pscale auth login` |
| GitHub | `gh` | `repo create`, `pr create`, `secret set` | `gh auth login` |
| Node | `npm`/`pnpm` | `install`, `run build`, `test`, `run dev` | N/A |
| Xcode | `xcodebuild` | `-project`, `-scheme`, `build`, `test` | N/A |
| Convex | `npx convex` | `dev`, `deploy`, `env set`, `env get` | `npx convex login` |

## Environment Variable Automation

**Env files:** Use Write/Edit tools. Never ask human to create .env manually.

**Dashboard env vars via CLI:**

| Platform | CLI Command | Example |
|----------|-------------|---------|
| Convex | `npx convex env set` | `npx convex env set OPENAI_API_KEY sk-...` |
| Vercel | `vercel env add` | `vercel env add STRIPE_KEY production` |
| Railway | `railway variables set` | `railway variables set API_KEY=value` |
| Fly | `fly secrets set` | `fly secrets set DATABASE_URL=...` |
| Supabase | `supabase secrets set` | `supabase secrets set MY_SECRET=value` |

**Secret collection pattern:**
```xml

  Add OPENAI_API_KEY to Convex dashboard
  Go to dashboard.convex.dev → Settings → Environment Variables → Add

  Provide your OpenAI API key
  
    I need your OpenAI API key for Convex backend.
    Get it from: https://platform.openai.com/api-keys
    Paste the key (starts with sk-)
  
  I'll add it via `npx convex env set` and verify
  Paste your API key

  Configure OpenAI key in Convex
  Run `npx convex env set OPENAI_API_KEY {user-provided-key}`
  `npx convex env get OPENAI_API_KEY` returns the key (masked)

```

## Dev Server Automation

| Framework | Start Command | Ready Signal | Default URL |
|-----------|---------------|--------------|-------------|
| Next.js | `npm run dev` | "Ready in" or "started server" | http://localhost:3000 |
| Vite | `npm run dev` | "ready in" | http://localhost:5173 |
| Convex | `npx convex dev` | "Convex functions ready" | N/A (backend only) |
| Express | `npm start` | "listening on port" | http://localhost:3000 |
| Django | `python manage.py runserver` | "Starting development server" | http://localhost:8000 |

**Server lifecycle:**
```bash
# Run in background, capture PID
npm run dev &
DEV_SERVER_PID=$!

# Wait for ready (max 30s)
timeout 30 bash -c 'until curl -s localhost:3000 > /dev/null 2>&1; do sleep 1; done'
```

**Port conflicts:** Kill stale process (`lsof -ti:3000 | xargs kill`) or use alternate port (`--port 3001`).

**Server stays running** through checkpoints. Only kill when plan complete, switching to production, or port needed for different service.

## CLI Installation Handling

| CLI | Auto-install? | Command |
|-----|---------------|---------|
| npm/pnpm/yarn | No - ask user | User chooses package manager |
| vercel | Yes | `npm i -g vercel` |
| gh (GitHub) | Yes | `brew install gh` (macOS) or `apt install gh` (Linux) |
| stripe | Yes | `npm i -g stripe` |
| supabase | Yes | `npm i -g supabase` |
| convex | No - use npx | `npx convex` (no install needed) |
| fly | Yes | `brew install flyctl` or curl installer |
| railway | Yes | `npm i -g @railway/cli` |

**Protocol:** Try command → "command not found" → auto-installable? → yes: install silently, retry → no: checkpoint asking user to install.

## Pre-Checkpoint Automation Failures

| Failure | Response |
|---------|----------|
| Server won't start | Check error, fix issue, retry (don't proceed to checkpoint) |
| Port in use | Kill stale process or use alternate port |
| Missing dependency | Run `npm install`, retry |
| Build error | Fix the error first (bug, not checkpoint issue) |
| Auth error | Create auth gate checkpoint |
| Network timeout | Retry with backoff, then checkpoint if persistent |

**Never present a checkpoint with broken verification environment.** If `curl localhost:3000` fails, don't ask user to "visit localhost:3000".

```xml

  Dashboard (server failed to start)
  Visit http://localhost:3000...

  Fix server startup issue
  Investigate error, fix root cause, restart server
  curl http://localhost:3000 returns 200

  Dashboard - server running at http://localhost:3000
  Visit http://localhost:3000/dashboard...

```

## Automatable Quick Reference

| Action | Automatable? | Claude does it? |
|--------|--------------|-----------------|
| Deploy to Vercel | Yes (`vercel`) | YES |
| Create Stripe webhook | Yes (API) | YES |
| Write .env file | Yes (Write tool) | YES |
| Create Upstash DB | Yes (`upstash`) | YES |
| Run tests | Yes (`npm test`) | YES |
| Start dev server | Yes (`npm run dev`) | YES |
| Add env vars to Convex | Yes (`npx convex env set`) | YES |
| Add env vars to Vercel | Yes (`vercel env add`) | YES |
| Seed database | Yes (CLI/API) | YES |
| Click email verification link | No | NO |
| Enter credit card with 3DS | No | NO |
| Complete OAuth in browser | No | NO |
| Visually verify UI looks correct | No | NO |
| Test interactive user flows | No | NO |

**DO:**
- Automate everything with CLI/API before checkpoint
- Be specific: "Visit https://myapp.vercel.app" not "check deployment"
- Number verification steps
- State expected outcomes: "You should see X"
- Provide context: why this checkpoint exists

**DON'T:**
- Ask human to do work Claude can automate ❌
- Assume knowledge: "Configure the usual settings" ❌
- Skip steps: "Set up database" (too vague) ❌
- Mix multiple verifications in one checkpoint ❌

**Placement:**
- **After automation completes** - not before Claude does the work
- **After UI buildout** - before declaring phase complete
- **Before dependent work** - decisions before implementation
- **At integration points** - after configuring external services

**Bad placement:** Before automation ❌ | Too frequent ❌ | Too late (dependent tasks already needed the result) ❌

## Examples

### Example 1: Database Setup (No Checkpoint Needed)

```xml

  Create Upstash Redis database
  .env
  
    1. Run `upstash redis create myapp-cache --region us-east-1`
    2. Capture connection URL from output
    3. Write to .env: UPSTASH_REDIS_URL={url}
    4. Verify connection with test command
  
  
    - upstash redis list shows database
    - .env contains UPSTASH_REDIS_URL
    - Test connection succeeds
  
  Redis database created and configured

```

### Example 2: Full Auth Flow (Single checkpoint at end)

```xml

  Create user schema
  src/db/schema.ts
  Define User, Session, Account tables with Drizzle ORM
  npm run db:generate succeeds

  Create auth API routes
  src/app/api/auth/[...nextauth]/route.ts
  Set up NextAuth with GitHub provider, JWT strategy
  TypeScript compiles, no errors

  Create login UI
  src/app/login/page.tsx, src/components/LoginButton.tsx
  Create login page with GitHub OAuth button
  npm run build succeeds

  Start dev server for auth testing
  Run `npm run dev` in background, wait for ready signal
  curl http://localhost:3000 returns 200
  Dev server running at http://localhost:3000

  Complete authentication flow - dev server running at http://localhost:3000
  
    1. Visit: http://localhost:3000/login
    2. Click "Sign in with GitHub"
    3. Complete GitHub OAuth flow
    4. Verify: Redirected to /dashboard, user name displayed
    5. Refresh page: Session persists
    6. Click logout: Session cleared
  
  Type "approved" or describe issues

```

### ❌ BAD: Asking user to start dev server

```xml

  Dashboard component
  
    1. Run: npm run dev
    2. Visit: http://localhost:3000/dashboard
    3. Check layout is correct
  

```

**Why bad:** Claude can run `npm run dev`. User should only visit URLs, not execute commands.

### ✅ GOOD: Claude starts server, user visits

```xml

  Start dev server
  Run `npm run dev` in background
  curl localhost:3000 returns 200

  Dashboard at http://localhost:3000/dashboard (server running)
  
    Visit http://localhost:3000/dashboard and verify:
    1. Layout matches design
    2. No console errors
  

```

### ❌ BAD: Asking human to deploy / ✅ GOOD: Claude automates

```xml

  Deploy to Vercel
  Visit vercel.com/new → Import repo → Click Deploy → Copy URL

  Deploy to Vercel
  Run `vercel --yes`. Capture URL.
  vercel ls shows deployment, curl returns 200

  Deployed to {url}
  Visit {url}, check homepage loads
  Type "approved"

```

### ❌ BAD: Too many checkpoints / ✅ GOOD: Single checkpoint

```xml

Create schema
Check schema
Create API route
Check API
Create UI form
Check form

Create schema
Create API route
Create UI form

  Complete auth flow (schema + API + UI)
  Test full flow: register, login, access protected page
  Type "approved"

```

### ❌ BAD: Vague verification / ✅ GOOD: Specific steps

```xml

  Dashboard
  Check it works

  Responsive dashboard - server running at http://localhost:3000
  
    Visit http://localhost:3000/dashboard and verify:
    1. Desktop (>1024px): Sidebar visible, content area fills remaining space
    2. Tablet (768px): Sidebar collapses to icons
    3. Mobile (375px): Sidebar hidden, hamburger menu in header
    4. No horizontal scroll at any size
  
  Type "approved" or describe layout issues

```

### ❌ BAD: Asking user to run CLI commands

```xml

  Run database migrations
  Run: npx prisma migrate deploy && npx prisma db seed

```

**Why bad:** Claude can run these commands. User should never execute CLI commands.

### ❌ BAD: Asking user to copy values between services

```xml

  Configure webhook URL in Stripe
  Copy deployment URL → Stripe Dashboard → Webhooks → Add endpoint → Copy secret → Add to .env

```

**Why bad:** Stripe has an API. Claude should create the webhook via API and write to .env directly.

Checkpoints formalize human-in-the-loop points for verification and decisions, not manual work.

**The golden rule:** If Claude CAN automate it, Claude MUST automate it.

**Checkpoint priority:**
1. **checkpoint:human-verify** (90%) - Claude automated everything, human confirms visual/functional correctness
2. **checkpoint:decision** (9%) - Human makes architectural/technology choices
3. **checkpoint:human-action** (1%) - Truly unavoidable manual steps with no API/CLI

**When NOT to use checkpoints:**
- Things Claude can verify programmatically (tests, builds)
- File operations (Claude can read files)
- Code correctness (tests and static analysis)
- Anything automatable via CLI/API