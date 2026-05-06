# 🧩 dexterous-server

> **Advanced server starter template** — built for **Bun** + **TypeScript** with production-grade tooling, dual module builds (CJS / ESM), and a rich ecosystem of utilities.

[![bun](https://img.shields.io/badge/Bun-1.2+-black?logo=bun)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-259dff?logo=express)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Description

**dexterous-server** is a minimal yet powerful bootstrap for creating Node.js / Bun server applications. It eliminates boilerplate and gives you a robust foundation with:

- ✅ **Bun runtime** — ultra-fast startup, built-in test runner, and native bundling.
- ✅ **TypeScript first** — strict typings, full type safety across the project.
- ✅ **Express 5** — modern web framework with improved error handling.
- ✅ **Mongoose 9** — MongoDB ODM with schema validation and hooks.
- ✅ **RxJS 7** — reactive programming for async data streams.
- ✅ **Image processing** — Sharp for on-the-fly image optimization.
- ✅ **File archiving** — Archiver for ZIP/tar generation.
- ✅ **File uploads** — Multer middleware ready.
- ✅ **Advanced utils** — JWT, Lodash, nanoid, Zod validation, cross-env, fs-jetpack, custom proxy support.
- ✅ **Dual builds** — output ESM (`.mjs`), CommonJS (`.cjs`) and plain JS (`.js`) via **tsup**.
- ✅ **Dev experience** — watch mode, prettier formatting, release-it for automated versioning & publishing.

The template is ideal for REST APIs, real-time backends, file processing servers, or any microservice needing performance and flexibility.

---

## 🔑 Keywords

`bun`, `typescript`, `express`, `mongoose`, `rxjs`, `sharp`, `archiver`, `server-template`, `starter-kit`, `node-api`, `reactive`, `tsup`, `dual-module`, `cors`, `jwt`, `multipart`, `image-resize`, `zod`, `rest-api`, `dexterous-server`, `backend-starter`, `bun-server`.

---

## 📦 How to use (getting started)

### 1. Prerequisites

- Install [Bun](https://bun.sh/) (v1.2+ recommended)
- MongoDB instance (local or Atlas) — optional but ready.

### 2. Create a new project from template

You can clone or download the repository manually, or use:

```bash
# clone the starter
git clone https://github.com/your-username/dexterous-server.git my-server
cd my-server
bun install
```

### 3. Environment setup

Create a `.env` file in the root:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/dexterous
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=*
```

### 4. Development

Run the server with instant hot reload:

```bash
bun run dev
# -> listening on http://localhost:3000
```

> The entry point is `src/index.ts`. Express app is configured with JSON middleware, CORS, and sample routes.

### 5. Build for production

```bash
bun run build
```

This compiles TypeScript into three formats:
- `build/cjs/index.cjs` (CommonJS)
- `build/esm/index.mjs` (ES Module)
- `build/js/index.js` (plain Node.js compatible)

### 6. Run production build

```bash
bun run start
# or using Node:
node build/cjs/index.cjs
```

### 7. Scripts overview

| Command | Description |
|---------|-------------|
| `bun run dev` | Starts dev server with Bun watch mode |
| `bun run build` | Builds all outputs using tsup |
| `bun run start` | Runs the compiled CommonJS entry |
| `bun run fix:prettier` | Formats code with Prettier |
| `bun run auto-release` | Builds, formats, and triggers release-it |
| `npm run publish-directly` | Publishes package to npm (public) |

---

## 🧱 Project structure

```
dexterous-server/
├── src/
│   ├── index.ts          # Main Express server & app setup
│   ├── routes/           # Example route modules
│   ├── controllers/      # Business logic
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # Custom middleware (auth, logger, upload)
│   ├── utils/            # Helpers (logger, jwt, rxjs operators)
│   └── types/            # Global TypeScript declarations
├── build/                # Generated outputs (CJS, ESM, JS, types)
├── tsup.config.ts        # Multi-format build configuration
├── tsconfig.json         # TypeScript config (strict mode)
├── package.json          # Dependencies & scripts
└── .env.example          # Template for environment variables
```

---

## 🚀 Advanced features included out-of-the-box

- **Reactive streams** — preconfigured RxJS subjects for event-driven architecture.
- **Image transformer** — Sharp utility ready for resize/convert/optimize.
- **Archiver service** — generate ZIP archives from multiple files.
- **Multer storage** — disk/memory upload with automatic file handling.
- **Mongoose connection** with graceful shutdown.
- **CORS & security** — express middleware with configurable origins.
- **UUID & nanoid** generation for identifiers.
- **Zod validation** — schema validation for request/response.
- **Express HTTP proxy** — advanced reverse-proxy middleware.
- **FS-jetpack** — fluent file system operations.
- **Release-it** — automated npm release & version bump.

---

## 🧪 Example API snippet

After starting dev server, try:

```bash
curl http://localhost:3000/api/health
# { "status": "OK", "timestamp": "2026-05-04T..." }

# Upload an image (multipart)
curl -F "image=@photo.jpg" http://localhost:3000/api/upload
```

*(Check `src/routes` for concrete examples — the template includes a demo upload and sample MongoDB model.)*

---

## 📦 Package exports

The package exposes multiple entry points:

```json
{
  "main": "build/js/index.js",
  "module": "build/esm/index.mjs",
  "types": "build/types/index.d.ts",
  "exports": {
    ".": {
      "bun": "./src/index.ts",
      "import": "./build/esm/index.mjs",
      "require": "./build/cjs/index.cjs"
    },
    "./cjs": {...},
    "./esm": {...}
  }
}
```

You can import the server logic programmatically in other Bun/Node projects.

---

## 🛠️ Customization tips

- Edit `tsup.config.ts` to add additional entry points or change formats.
- Extend Express app in `src/index.ts` with more middleware.
- Use environment variables via `dotenv` (already integrated).
- Replace mongoose with any other DB driver — the setup is decoupled.

---

## 📄 License

**MIT** — free to use in personal and commercial projects.

---

## 🤝 Contributing & Support

Feel free to open issues or PRs. For questions, use discussions.

**Happy building with dexterous-server!** 🦾
