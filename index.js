const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());

app.get('/', async (req, res) => {
  res.json({
    message: 'API RUNNING !!'
  });
});


const apiRoutes = require('./src/routes/apiRoutes');
const HTTPError = require('./src/utils/httpError');
require('dotenv').config();

app.use('/api', apiRoutes);


app.use((error, req, res, next) => {
  console.log(error);
  next(error);
});

app.use((error, req, res, next) => {
  if (error instanceof HTTPError) {
    return res.status(error.status).json({
      message: error.message,
      stack: error.stack
    });
  }
  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
