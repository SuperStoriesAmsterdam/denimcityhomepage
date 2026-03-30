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

# Open Coolify in browser
echo "🌐 Opening Coolify..."
open "http://77.42.70.117:3000/dashboard/projects"

echo ""
echo "⏳ Next step: Click 'Force Redeploy' in Coolify"
echo "   (Deploy takes ~30-40 seconds after that)"
echo ""
echo "✨ Your changes will be live soon."
