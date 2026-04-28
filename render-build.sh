#!/bin/bash
set -e

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Return to root (for logging clarity)
cd ..

echo "Build completed successfully"
