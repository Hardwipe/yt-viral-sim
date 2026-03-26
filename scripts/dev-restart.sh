#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "🧹 Killing port 5050 (backend)..."
kill -9 $(lsof -ti :5050) 2>/dev/null || true

echo "🧹 Killing port 3000 (React)..."
kill -9 $(lsof -ti :3000) 2>/dev/null || true

PYTHON_BIN="${PYTHON_BIN:-$(pwd)/.venv/bin/python}"

if [[ ! -x "$PYTHON_BIN" ]]; then
  echo "❌ Python venv not found at $PYTHON_BIN"
  exit 1
fi

echo "🚀 Starting Flask backend with $PYTHON_BIN ..."
"$PYTHON_BIN" backend/app.py > backend/dev.log 2>&1 &

BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

if ! curl -sf http://localhost:5050/api/health >/dev/null; then
  echo "❌ Backend failed to start. Showing backend/dev.log:"
  cat backend/backend-dev.log
  kill $BACKEND_PID 2>/dev/null || true
  exit 1
fi

echo "✅ Backend is up on 5050"
echo "🚀 Starting React frontend..."
npm start > frontend-dev.log 2>&1 &