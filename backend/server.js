require('dotenv').config();

// Load the unified API app from the api/ directory.
// api/index.js already bootstraps all routes, CORS, MongoDB connection,
// and error handling. We just need to listen() here for local development.
const app = require('../api/index');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Local dev server running on http://localhost:${PORT}`);
});
