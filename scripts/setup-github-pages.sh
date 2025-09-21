#!/bin/bash

echo "Setting up GitHub Pages for FinFlow..."

if [ ! -d ".git" ]; then
    echo "Error: Not in a git repository"
    exit 1
fi
REPO_URL=$(git remote get-url origin)
echo "Repository: $REPO_URL"

if [[ $REPO_URL =~ github\.com[:/]([^/]+)/([^/]+)\.git ]]; then
    USERNAME="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]}"
    echo "Username: $USERNAME"
    echo "Repository: $REPO_NAME"
    
    GITHUB_PAGES_URL="https://$USERNAME.github.io/$REPO_NAME/"
    echo "GitHub Pages URL: $GITHUB_PAGES_URL"
    
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/$USERNAME/$REPO_NAME/settings/pages"
    echo "2. Select 'GitHub Actions' as source"
    echo "3. Push to master branch to trigger deployment"
    echo "4. Your app will be available at: $GITHUB_PAGES_URL"
    
else
    echo "Error: Could not parse repository URL"
    exit 1
fi

echo ""
echo "Setup complete! Check the GitHub Pages settings."
