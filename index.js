// index.js

const express = require('express');
const routes = require('./routes/routes');
const path = require('path');


const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public/css')));
// Use routes from routes.js
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
