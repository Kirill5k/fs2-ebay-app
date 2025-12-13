# fs2-ebay-app

## Project Overview
`fs2-ebay-app` is a comprehensive application designed to monitor stock and find deals across various retailers (eBay, Argos, JD Sports, Nvidia, etc.). It consists of a Scala-based backend ecosystem (Core, Proxy, Monitor) and a Next.js frontend.

## Architecture
The project is organized as a multi-module build:

- **`modules/core`**: The main application logic for scraping, deal finding, and serving the API.
- **`modules/proxy`**: A service likely handling request routing or proxying to avoid rate limits/IP blocks.
- **`modules/monitor`**: Dedicated module for scheduled monitoring tasks and notifications.
- **`modules/kernel`**: Shared domain logic, data models, and utilities used by other backend modules.
- **`modules/frontend`**: A modern Next.js 16 web application for the user interface.

## Tech Stack

### Backend (Scala)
- **Language**: Scala 3.7.4
- **Build Tool**: SBT
- **JDK**: Java 25 (Temurin)
- **Key Libraries**:
    - **Effect System**: Cats Effect 3, FS2 (Functional Streams for Scala)
    - **HTTP**: http4s (Server & Client), sttp 4, Tapir (API definition)
    - **Database**: mongo4cats (MongoDB driver for Cats Effect)
    - **Config**: PureConfig
    - **JSON**: Circe
    - **Logging**: Logback, Log4Cats

### Frontend (TypeScript)
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4, Radix UI primitives
- **State Management**: Zustand
- **Validation**: Zod, React Hook Form

### Infrastructure
- **Containerization**: Docker (via `sbt-native-packager`)
- **Orchestration**: Kubernetes (manifests in `deployment/`)
- **Database**: MongoDB

## Getting Started

### Prerequisites
- JDK 25
- Scala 3
- Node.js & npm (for frontend)
- Docker (optional, for containerized run)
- MongoDB instance

### Backend Development
The backend is managed via SBT.

1.  **Run Core Service**:
    ```bash
    sbt "project core" run
    ```
2.  **Run Proxy Service**:
    ```bash
    sbt "project proxy" run
    ```
3.  **Run Tests**:
    ```bash
    sbt test
    ```
4.  **Formatting**:
    The project uses `scalafmt`.
    ```bash
    sbt scalafmtAll
    ```

### Frontend Development
Located in `modules/frontend`.

1.  **Install Dependencies**:
    ```bash
    cd modules/frontend
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Lint & Format**:
    ```bash
    npm run lint
    npm run format
    ```

## Configuration
The backend is configured via `modules/core/src/main/resources/application.conf`. It relies on environment variables for secrets and dynamic values:

- **Database**: `MONGO_USER`, `MONGO_PASSWORD`, `MONGO_HOST`
- **Telegram Notifications**: `TELEGRAM_BOT_API_KEY`, `TELEGRAM_CHANNEL_ID`
- **Retailer APIs**: `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `CEX_ALGOLIA_API_KEY`, etc.
- **Proxy**: `HOST`, `PORT`

## Directory Structure
- `modules/`: Source code for all sub-projects.
- `deployment/`: Kubernetes and deployment configurations (`core.yaml`, `proxy.yaml`).
- `project/`: SBT build configuration and plugins.
- `build.sbt`: Main build definition.
