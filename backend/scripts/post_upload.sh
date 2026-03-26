#!/usr/bin/env bash
set -euo pipefail

VIDEO_PATH="${1:-}"
VIDEO_TITLE="${2:-}"
UPLOAD_TYPE="${3:-}"

if [[ -z "$VIDEO_PATH" || -z "$VIDEO_TITLE" || -z "$UPLOAD_TYPE" ]]; then
  echo "Usage: ./post_upload.sh <video_path> <video_title> <upload_type>"
  exit 1
fi

PYTHON_BIN="${PYTHON_BIN:-python3}"
LOG_FILE="upload.log"
MAX_SIZE=$((5 * 1024 * 1024)) # 5MB

cleanup() {
  if [[ -n "${VIDEO_PATH:-}" && -f "$VIDEO_PATH" ]]; then
    rm -f "$VIDEO_PATH"
    echo "🧹 Deleted uploaded file: $VIDEO_PATH"
  fi

  if [[ -f "$LOG_FILE" ]]; then
    FILE_SIZE=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0)

    if [[ "$FILE_SIZE" -gt "$MAX_SIZE" ]]; then
      echo "🧹 Trimming log file..."
      tail -n 200 "$LOG_FILE" > "${LOG_FILE}.tmp"
      mv "${LOG_FILE}.tmp" "$LOG_FILE"
    fi
  fi
}

trap cleanup EXIT

echo "Running background upload..."
echo "VIDEO_PATH=$VIDEO_PATH"
echo "VIDEO_TITLE=$VIDEO_TITLE"
echo "UPLOAD_TYPE=$UPLOAD_TYPE"

"$PYTHON_BIN" workers/youtube_uploader.py \
  --file "$VIDEO_PATH" \
  --title "$VIDEO_TITLE" \
  --upload-type "$UPLOAD_TYPE" \
  --description "Uploaded automatically from FakeTube."