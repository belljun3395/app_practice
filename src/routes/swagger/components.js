/** 
*@swagger
* components:
*   schemas:
*     User:
*       type: object
*       properties:
*         email:
*           type: string
*           example: kjj3395
*         password:
*           type: string
*           example: "1234"
*       required:
*       - email
*       - password
*   securitySchemes: 
*    ApiKeyAuth: 
*      type: apiKey
*      name: api_key
*      in: header
*/