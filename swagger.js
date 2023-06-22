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
  host: 'localhost:3000',
  schemes: ['http', 'https']
};

swaggerAutogen(outputFile, endpointsFiles, docs)
  .then(() => {
    console.log('Swagger documentation has been generated sucessfully!');
  })
  .catch((error) => {
    console.error(error);
  });
