#!/usr/bin/env bash
set -euo pipefail

# Always run from project root
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "🚀 Starting full project pipeline..."

run_step () {
  local name="$1"
  local script="$2"

  echo ""
  echo "=============================="
  echo "➡️  Running: $name"
  echo "=============================="

  if [[ -f "$script" ]]; then
    bash "$script"
    echo "✅ $name passed"
  else
    echo "⚠️  Skipping $name (script not found: $script)"
  fi
}

# Ordered execution (edit this order however you want)
run_step "Install Dependencies" "scripts/install.sh"
run_step "Lint" "scripts/lint.sh"
run_step "Unit Tests" "scripts/test.sh"
run_step "Coverage" "scripts/coverage.sh"
run_step "Build" "scripts/build.sh"

echo ""
echo "🎉 All steps completed successfully!"