# 🚀 Automation Scripts & CI Guide

This document explains how to use the local automation scripts and CI pipeline for this project.

---

# 📂 Project Structure (Relevant)

scripts/
├── dev.sh
├── install.sh
├── lint.sh
├── test.sh
├── test-watch.sh
├── coverage.sh
├── build.sh
└── run-all.sh

.github/workflows/
└── node.yml

---

# ⚙️ Overview

This project uses bash scripts as a local CI system, mirroring GitHub Actions.

Why this setup?

- Same commands locally and in CI
- Faster debugging
- Modular scripts
- Fail-fast behavior

---

# 🧠 Script Responsibilities

## install.sh
Installs dependencies cleanly

Command:
npm ci

---

## dev.sh
Starts the development server

Run:
./scripts/dev.sh

Executes:
npm start

---

## lint.sh
Runs ESLint

Run:
./scripts/lint.sh

Executes:
npm run lint

---

## test.sh
Runs tests once (CI-safe)

Run:
./scripts/test.sh

Executes:
npm run test:run

---

## test-watch.sh
Runs tests in watch mode

Run:
./scripts/test-watch.sh

Executes:
npm test

---

## coverage.sh
Runs tests with coverage

Run:
./scripts/coverage.sh

Executes:
npm run coverage

---

## build.sh
Builds production app

Run:
./scripts/build.sh

Executes:
npm run build

---

## run-all.sh (Main Orchestrator)

Run:
./scripts/run-all.sh

Execution order:
1. Install dependencies
2. Lint
3. Tests
4. Coverage
5. Build

Behavior:
- Stops on first failure
- Skips missing scripts safely
- Clean output logs

---

# 🧪 Local CI Usage

Run full pipeline locally:

./scripts/run-all.sh

If this passes, CI should pass.

---

# 🧬 GitHub Actions CI

Triggers:
- Push to main
- PRs to main

Node versions:
- 20.x
- 22.x

---

## CI Steps

1. Checkout repo
2. Setup Node
3. Make scripts executable
4. Run pipeline (run-all.sh)
5. Upload coverage

---

## Example Workflow

name: Node.js CI

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x, 22.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm

      - name: Make scripts executable
        run: chmod +x scripts/*.sh

      - name: Run pipeline
        run: ./scripts/run-all.sh
        env:
          CI: true

      - name: Upload coverage
        if: matrix.node-version == '22.x'
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

---

# ⚠️ Important Notes

React:
- Uses react-scripts (not Vite)
- Start command:
  npm start

Vitest:
- Used instead of Jest
- Globals handled via ESLint overrides

ESLint:
- JSX scope rule disabled
- PropTypes disabled
- Test files ignore no-undef

---

# ❗ Common Issues

npm run dev not found:
Use:
npm start

ESLint test errors:
Ensure overrides exist for *.test files

CI fails but local passes:
Run:
./scripts/run-all.sh

---

# 🚀 Best Practices

Before pushing:
./scripts/run-all.sh

Auto-fix lint:
npm run lint:fix

Keep scripts modular

---

# 🧩 Summary

You now have:

- Local CI matching GitHub Actions
- Clean automation scripts
- Fast debugging workflow
- Scalable system foundation

If run-all.sh passes, CI should pass.