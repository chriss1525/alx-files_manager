// express server

// import express
const express = require('express');

const app = express();

const port = process.env.PORT || 5000;
// import body parser
app.use(express.json());

// import routes
const routes = require('./routes');

// use routes
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
