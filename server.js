const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle missing extensions (e.g., import App from './App' -> serves App.tsx)
app.use((req, res, next) => {
  const filePath = path.join(__dirname, req.path);

  // If the file exists exactly as requested, let static middleware handle it
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
    return next();
  }

  // Check for .tsx extension
  if (fs.existsSync(filePath + '.tsx')) {
    req.url += '.tsx';
    return next();
  }

  // Check for .ts extension
  if (fs.existsSync(filePath + '.ts')) {
    req.url += '.ts';
    return next();
  }

  next();
});

// Serve static files from the current directory
app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    // Serve TS/TSX as text/plain or javascript so Babel can read it via XHR
    if (path.endsWith('.tsx') || path.endsWith('.ts')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Handle SPA routing: serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});