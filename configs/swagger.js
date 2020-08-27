const swaggerJSDoc = require('swagger-jsdoc');

let swaggerDefinition= {
  info: {
    title: 'PLaCon SNS',
    version: '1.0.0',
    description: 'This is PLacon API Server, you can use User management service, CRUD Post service, displaying Post list, comment&correction service and message service'
  },
  host: 'localhost:3000',
  basePath: '/'
}

let options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./routes/*/*.js']
}

module.exports = options
