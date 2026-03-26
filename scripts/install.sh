#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Installing frontend dependencies..."
npm ci

echo "Installing backend Python dependencies..."
python -m pip install --upgrade pip
pip install -r backend/requirements.txt