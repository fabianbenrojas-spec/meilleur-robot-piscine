#!/usr/bin/env bash
# Ignored Build Step — Vercel, Settings → Build and Deployment.
# Sortie 0 = build ANNULÉ. Sortie 1 = build lancé.
#
# Une correction de documentation ou un DECISIONS.md mis à jour ne doit pas
# déclencher un build sur chaque déploiement (DOCTRINE-RESEAU §3.5).
set -e

CHANGED=$(git diff --name-only HEAD^ HEAD 2>/dev/null || echo "")
[ -z "$CHANGED" ] && exit 1   # premier commit ou historique absent : on build

SIGNIFICANT=$(echo "$CHANGED" | grep -vE '^(docs/|DECISIONS\.md|README\.md|\.github/|skills/|tasks/|.*\.md$)' || true)

if [ -z "$SIGNIFICANT" ]; then
  echo "Aucun fichier significatif modifié — build annulé."
  exit 0
fi

echo "Fichiers significatifs modifiés :"
echo "$SIGNIFICANT"
exit 1
