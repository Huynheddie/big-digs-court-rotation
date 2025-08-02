#!/bin/bash

# Deploy script for GitHub Pages
echo "🚀 Deploying to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Add all changes
    git add .
    
    # Commit changes
    git commit -m "Deploy to GitHub Pages - $(date)"
    
    # Push to main branch
    git push origin main
    
    echo "🚀 Deployment initiated! Check GitHub Actions for progress."
    echo "📱 Your app will be available at: https://huynheddie.github.io/big-digs-court-rotation/"
else
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi 