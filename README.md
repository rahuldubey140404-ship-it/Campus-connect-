# CampusConnect prototype

Two folders:

- `react-app/`      The source code (React + Vite). Edit and run this in VS Code.
- `html-version/`   A ready-made single `index.html`. Double-click it to open in a browser. No install needed.

## Run the React app in VS Code

1. Install Node.js (v18 or newer) from https://nodejs.org
2. Open the `react-app` folder in VS Code (File > Open Folder)
3. Open the terminal in VS Code (Ctrl + `) and run:

       npm install
       npm run dev

4. Open the link it prints (usually http://localhost:5173)

## Rebuild the single HTML file after you edit the code

       npm run build:html

This overwrites `html-version/index.html`.

## Notes
- `src/App.jsx` holds the whole app. `src/main.jsx` starts it.
- The demo login: click "Try the demo without signing up".
- Data is kept in memory only, so it resets when you refresh.
