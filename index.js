// index.js

const express = require('express');
const routes = require('./routes');

const app = express();
const port = 3000;

// Use routes from routes.js
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
