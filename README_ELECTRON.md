# Desktop App Setup

Your project now supports both web and desktop versions!

## Development

Run the desktop app in development mode:
```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server
2. Wait for it to be ready
3. Launch the Electron app

## Building Desktop App

Build the desktop installer:
```bash
npm run electron:build
```

This creates installers in the `electron-dist` folder:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` installer  
- **Linux**: `.AppImage` file

## Web Version (Unchanged)

Your web version still works exactly the same:
```bash
npm run dev        # Development
npm run build      # Production build
npm run preview    # Preview production build
```

## Notes

- The desktop app uses the same React code as your web app
- No changes to your existing components or logic
- Web deployment (Vercel, etc.) is completely unaffected
- Desktop and web versions can be maintained from the same codebase
