#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Checking Python..."
python --version

echo "Checking ffprobe..."
ffprobe -version

echo "Checking backend imports..."
python -c "from backend.workers.media_inspector import inspect_video; print('media_inspector import ok')"
python -c "from backend.workers.youtube_classifier import classify_for_youtube; print('youtube_classifier import ok')"

echo "Backend smoke checks passed."