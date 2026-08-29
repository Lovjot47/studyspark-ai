# Deployment notes

For a simple deployment, host the frontend and backend together on a Node-capable platform.

Build the frontend with:

```bash
npm run build
```

The current local setup intentionally keeps Vite and Express separate for easy development and debugging.

For production, either add Express static-file serving for `dist/` or deploy the Vite frontend and API separately with the same `/api` contract.
