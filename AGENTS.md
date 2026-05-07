## Project Overview

`fs2-ebay-app` is a deal-finding and stock monitoring application for multiple retailers (eBay, Argos, JD Sports, Nvidia, etc.). It consists of three Scala backend services and a Next.js frontend, all built as a multi-module project.

## Tech Stack

### Backend (Scala 3.7.4)
- **Effect System**: Cats Effect 3, FS2 (Functional Streams)
- **HTTP**: http4s (server), sttp4 (client), Tapir (API definition)
- **Database**: MongoDB via mongo4cats
- **Build**: SBT with multi-module configuration
- **JDK**: Java 25 (Temurin)

### Frontend (TypeScript)
- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS 4, Radix UI, Shadcn UI components
- **State**: Zustand

## Module Architecture

The project uses a multi-module SBT build with dependency relationships:

### `modules/kernel`
Shared foundation module containing:
- **Domain types**: `IdType` and `EnumType` transparent trait patterns for type-safe IDs and enums
- **Config**: Base `ServerConfig`, `MongoConfig`, `ClientConfig`
- **Controllers**: Base `Controller` trait and `HealthController`
- **JSON codecs**: Circe encoders/decoders
- All other modules depend on `kernel` for shared types and utilities

### `modules/core`
Main application for scraping and deal finding:
- **Entry point**: `Application.scala` initializes resources → repositories → clients → services → tasks → controllers
- **Architecture**: Resources provide HTTP clients and DB connections. Repositories handle MongoDB. Services contain business logic. Tasks run scheduled jobs. Controllers expose HTTP endpoints.
- **Clients**: Retailer-specific HTTP clients (e.g., `EbayClient`, `ArgosClient`, `NvidiaClient`) with mappers to domain models
- **Tasks**:
  - `DealsFinder`: Searches for profitable resale opportunities by comparing retailer prices with eBay prices
  - `StockMonitor`: Monitors product availability and price changes
  - `ErrorsNotifier`: Reports errors to Telegram
- **Domain**: `Retailer` enum (Cex, Ebay, Selfridges, etc.), resellable items, stock updates, notifications
- **Config**: `RetailConfig` loaded from `application.conf` or mounted config file at `/opt/app/application.conf`

### `modules/proxy`
HTTP proxy service to distribute requests and avoid rate limiting:
- **Entry point**: `Application.scala`
- **Purpose**: Routes requests through different IPs/headers to prevent blocking
- **Components**: `RedirectController`, `Interrupter` for graceful shutdown

### `modules/monitor`
Monitoring and notification service:
- **Entry point**: `Application.scala` with action-based architecture
- **Architecture**: Uses an action dispatcher and processor pattern for async job scheduling
- **Components**:
  - `ActionDispatcher`: Queues actions for processing
  - `ActionProcessor`: Processes actions from the queue
  - `MonitorService`: Schedules and manages monitors
  - `NotificationService`: Sends email notifications
  - `EmailClient`: SMTP client using Courier
- **Storage**: Persists monitoring events and configurations to MongoDB

### `modules/frontend`
Next.js web application for viewing deals and managing monitors

## Common Development Commands

### Backend (from project root)

**Run a specific module:**
```bash
sbt "project core" run
sbt "project proxy" run
sbt "project monitor" run
```

**Run tests:**
```bash
# All tests
sbt test

# Single module
sbt "project core" test

# Specific test
sbt "project core" "testOnly ebayapp.core.clients.ebay.EbayClientSpec"
```

**Format code:**
```bash
# Format all modules
sbt scalafmtAll

# Check formatting
sbt scalafmtCheckAll
```

**Build Docker images:**
```bash
# Build image for a module
sbt "project core" docker:publishLocal
sbt "project proxy" docker:publishLocal
sbt "project monitor" docker:publishLocal
```

**Compile:**
```bash
# Compile all modules
sbt compile

# Compile specific module
sbt "project kernel" compile
```

**Check for dependency updates:**
```bash
sbt dependencyUpdates
```

### Frontend

```bash
cd modules/frontend

# Development server (with Turbopack)
npm run dev

# Production build
npm run build

# Production server
npm start

# Lint
npm run lint

# Format
npm run format
npm run format:check
```

## Architecture Patterns

### Effect System
All backend code uses Cats Effect's `IO` monad for managing side effects. The `F[_]` pattern is used throughout for polymorphic effects.

### Resource Management
Services use bracket-style resource management with `Resources.make` pattern that ensures proper cleanup of HTTP clients and database connections.

### FS2 Streams
Long-running tasks use FS2 streams with `.parJoinUnbounded` for concurrent processing and automatic error recovery.

### Transparent Traits
The codebase uses Scala 3 transparent traits for zero-cost type wrappers:
- `IdType`: Type-safe string-based IDs with MongoDB ObjectId conversion
- `EnumType`: Type-safe enums with circe codecs, tapir schemas, and kebab-case serialization

### Configuration
- Backend uses PureConfig to load from `application.conf` files
- Environment variables are interpolated in config files for secrets
- `RetailConfig` can be loaded from default resources or mounted config for K8s deployments

### Error Handling
Tasks use `.resumeOnError` extension method to automatically retry after failures with delay, logging errors to Telegram.

## Testing

Tests use:
- `mongo4cats-embedded` for embedded MongoDB in tests
- `common-http4s-test` and `common-sttp-test` for HTTP testing utilities
- Specs are named `*Spec.scala`

## Deployment

- Kubernetes manifests in `deployment/` directory
- Docker images built via `sbt-native-packager`
- Base image: `amazoncorretto:25-alpine` with bash and curl
- Version determined from git commit hash (first 7 chars)
- Docker package names: `fs2-app-core`, `fs2-app-proxy`, `fs2-app-monitor`

## Code Style

- Scala 3 syntax (no braces for simple cases, indentation-based)
- `scalafmt` with 140 char line width
- Derives syntax for type class derivation
- Using clauses for context parameters
- Extension methods for domain-specific operations
