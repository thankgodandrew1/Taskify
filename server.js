const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const homeRoute = require('./routes/homeRoute');
const db = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const isAuthenticated = require('./middlewares/authentication');

const usersRoute = require('./routes/userRoutes');
const tasksRoute = require('./routes/taskRoutes');
const projectsRoute = require('./routes/projectRoutes');
const commentsRoute = require('./routes/commentRoutes');
const logoutRoute = require('./routes/logoutRoute');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use('/login', express.static('public'));

// This code block enables session management
app.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serialize user object
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user object
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'https://taskify-d56k.onrender.com/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Passport callback function fired');
      // console.log(profile);
      return done(null, profile);
    }
  )
);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to the Swagger API documentation
    res.redirect('/api-docs');
  }
);
app.use('/logout', isAuthenticated, logoutRoute);

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
    app.use('/tasks', tasksRoute(database.tasksCollection));
    app.use('/projects', projectsRoute(database.projectsCollection));
    app.use('/comments', commentsRoute(database.commentsCollection));

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

// Use the swagger UI to serve API documentation
app.use(
  '/api-docs',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      // If thw user is not authenticated, it redirects to the login page
      return res.redirect('/login');
    }
    // if they are authenticated, the app proceeds to serve the Swagger UI
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);
