#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies..."
npm ci

echo "Running lint..."
npm run lint

echo "Running tests with coverage..."
npx vitest run --coverage

echo "Building app..."
npm run build

echo "CI checks passed."