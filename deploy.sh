#!/bin/bash
set -e

echo "🚀 Denim City Deploy"
echo "===================="
echo ""

# Git push
echo "📦 Pushing to GitHub..."
git push origin main
echo "✅ Pushed!"
echo ""

echo "⏳ Coolify is deploying..."
echo "   Check: http://77.42.70.117:3000"
echo "   (Deploy takes ~30-40 seconds)"
echo ""
echo "✨ Done! Your changes will be live soon."
