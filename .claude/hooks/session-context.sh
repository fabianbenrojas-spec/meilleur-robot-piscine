#!/usr/bin/env bash
# SessionStart hook for vpn-affiliate-core.
# Prints the *actual* current repo state — never a static/hardcoded claim.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.." # repo root

echo "== vpn-affiliate-core — session context =="

# scripts/preflight.ts covers git state, canonical-mechanism inventory
# (anti-doublon), page counts per silo and last commit in one ~1s pass — see
# .claude/commands/reprise.md for how a session should react to its output.
if [ -d node_modules ] && npx --no-install tsx scripts/preflight.ts 2>/tmp/preflight-err; then
  :
else
  echo "(preflight.ts indisponible — dépendances non installées ? fallback minimal ci-dessous)"
  cat /tmp/preflight-err 2>/dev/null || true
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    branch="$(git branch --show-current 2>/dev/null || echo '(detached HEAD)')"
    echo "Branche : ${branch:-'(aucune, repo sans commit)'}"
    echo
    echo "-- git status --"
    git status --short --branch
  else
    echo "(pas un dépôt git)"
  fi
fi
rm -f /tmp/preflight-err

echo
echo "Core multi-marchés. Marché actif : www.meilleur-vpn.be (BE/fr). Lire CLAUDE.md avant toute modif."
