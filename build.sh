#!/bin/bash
# Rebuild bundle.jsx from separate page files
# Run this after editing any page file, then commit bundle.jsx
echo "Building bundle.jsx..."
cat pages/dashboard.js pages/materials.js pages/tubs.js pages/saunas.js pages/calculator.js pages/orders.js pages/production.js app.js > bundle.jsx
echo "Done! bundle.jsx rebuilt ($(wc -l < bundle.jsx) lines)"
echo "Now commit and push bundle.jsx to GitHub"
