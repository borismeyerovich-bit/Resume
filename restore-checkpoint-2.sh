#!/bin/bash

echo "🎯 ResumeTransformer Checkpoint 2 Restore Script"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Current Status:"
git status --short
echo ""

echo "🏷️  Available Checkpoints:"
git tag -l | grep checkpoint
echo ""

echo "🔄 Restoring to Checkpoint 2 (v1.1.0-checkpoint)..."
echo ""

# Check if checkpoint tag exists
if ! git tag -l | grep -q "v1.1.0-checkpoint"; then
    echo "❌ Error: Checkpoint 2 (v1.1.0-checkpoint) not found!"
    echo "Available tags:"
    git tag -l
    exit 1
fi

# Confirm before proceeding
read -p "⚠️  This will reset your current work. Are you sure? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled."
    exit 1
fi

echo "🔄 Restoring to Checkpoint 2..."
echo ""

# Stash any current changes
echo "📦 Stashing current changes..."
git stash push -m "Auto-stash before checkpoint 2 restore"

# Checkout the checkpoint
echo "🏷️  Checking out checkpoint 2 (v1.1.0-checkpoint)..."
git checkout v1.1.0-checkpoint

# Clean and reinstall dependencies
echo "🧹 Cleaning build cache..."
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "✅ Checkpoint 2 restored successfully!"
echo ""
echo "🎯 Current Status:"
echo "   - Tag: v1.1.0-checkpoint"
echo "   - Commit: $(git rev-parse --short HEAD)"
echo "   - Branch: $(git branch --show-current)"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "📚 For details, see: CHECKPOINT_v1.1.0.md"
echo ""
echo "🎨 Features Available:"
echo "   - Beautiful new homepage UI"
echo "   - Working Hebrew translation"
echo "   - Email preservation (no RTL corruption)"
echo "   - One-page resume constraint"
echo "   - Additional Information grouping"
echo "   - Quantifiable achievements"
echo ""
echo "🔄 To return to your previous work:"
echo "   git checkout main"
echo "   git stash pop" 