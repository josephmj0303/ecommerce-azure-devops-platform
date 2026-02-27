const swaggerJSDoc = require('swagger-jsdoc');
console.log(`🚀 Running in ${process.env.NODE_ENV} mode`);

/* Read the Hosting Details */
const port = process.env.PORT || 3000;
const baseUrl = process.env.APP_HOST || 'http://localhost';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Stationery Store API',
      version: '1.0.0',
      description: 'Ebook / Stationery E-Commerce API'
    },
    servers: [
      {
        url: process.env.NODE_ENV == 'production' ? `${baseUrl}` : `${baseUrl}:${port}`,
        description: `${process.env.NODE_ENV || 'development'} server`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    './src/modules/**/*.routes.js',
    './src/modules/**/*.controller.js',
    './src/routes.js'
  ]
};
module.exports = swaggerJSDoc(options);
