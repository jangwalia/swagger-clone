const db = require("../db");
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { marshall } = require("@aws-sdk/util-dynamodb");
const schema = require('../validation/checkValidation');


//**********Create ITEM FUNCTION */
const createPet = async (event) => {
  const response = { statusCode: 200 };
 
  try {
    const body = JSON.parse(event.body);
    const {error} = schema.validate(body)
        if(error){
          response.body = JSON.stringify({
            message: "name is required",
            errorMsg: error.message,
            errorStack: error.Stack
          });
        }else{
          body.petId = uuidv4();
          const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(body || {}),
          };
        const createResult = await db.send(new PutItemCommand(params));
            response.body = JSON.stringify({
              message: "Successfully created new data",
              createResult,
            });
        }
        
      }
    catch (err) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "failed to Create data",
      errMsg: error.message,
      errStack: error.Stack,
    });
  }

  return response;
};
module.exports = { createPet };

// const schema2 = Joi.object().keys({
//   category: {
//     name: Joi.string().required()
//   }
// })
// const schema3 = Joi.array().items(Joi.string())

// const schema = Joi.object().keys({
//   category: schema2,
//   name: schema1,
//   status: schema1,
//   tags: schema3
// })
// Joi.validate(body,schema,(err,result)=>{