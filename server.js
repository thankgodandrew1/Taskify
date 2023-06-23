const express = require('express');
const dotenv = require('dotenv');

const homeRoute = require('./routes/homeRoute');
const db = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const usersRoute = require('./routes/userRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

db.connect()
  .then(database => {
    const collections = ['usersCollection', 'tasksCollection', 'projectsCollection', 'commentsCollection'];
    collections.forEach(collection => {
      app.locals[collection] = database[collection];
    });

    app.use(express.json());
    app.use('/', homeRoute);

    // Pass the users collection to the users route
    app.use('/users', usersRoute(database.usersCollection));

    app.use((req, res, next) => {
      const error = new Error('Not found');
      error.status = 404;
      next(error);
    });

    app.use((error, req, res, next) => {
      res.status(error.status || 500);
      res.json({
        error: {
          message: error.message
        }
      });
    });

    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(error => {
    console.error(error);
  });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
