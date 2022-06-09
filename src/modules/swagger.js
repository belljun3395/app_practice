const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Swagger API TESt",
      description:
        "Test Swagger API",
    },
    servers: [
      {
        url: "http://localhost:3000", 
      },
    ], 
  },
  apis: ["./src/routes/swagger/*"], 
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }