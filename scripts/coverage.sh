#!/usr/bin/env bash
set -euo pipefail

echo "Running tests with coverage..."
npx vitest run --coverage