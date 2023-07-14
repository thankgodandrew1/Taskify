const swaggerAutogen = require('swagger-autogen');

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './routes/userRoutes.js',
  './routes/taskRoutes.js',
  './routes/projectRoutes.js',
  './routes/commentRoutes.js'
];

const docs = {
  info: {
    title: 'Team Management API',
    version: '1.0.0',
    description: 'An API to manage teams'
  },
  host: 'taskify-d56k.onrender.com',
  schemes: ['http', 'https'],
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      description: 'OAuth 2.0 authorization',
      flow: 'implicit',
      authorizationUrl: `https://taskify-d56k.onrender.com/auth/google/callback`,
      scopes: {
        'read:user': 'Read user data',
        'write:user': 'Write user data',
        'read:post': 'Read post data',
        'write:post': 'Write post data'
      }
    }
  },
  security: [
    {
      OAuth2: ['read:user', 'write:user', 'read:post', 'write:post']
    }
  ]
};


swaggerAutogen(outputFile, endpointsFiles, docs)
  .then(() => {
    console.log('Swagger documentation has been generated sucessfully!');
  })
  .catch((error) => {
    console.error(error);
  });
