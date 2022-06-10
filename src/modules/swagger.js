const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi : "3.0.0",
    info: {
      version: "1.0.0",
      title: "Hairlog API",
      description:
        "API for Hairlog",
    },
    servers: [
      {
        url: "http://localhost:3000", 
      },
    ], 
    security : [
      {
        ApiKeyAuth: []
      }
    ]
  },
  apis: ["./src/routes/swagger/*"], 
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }