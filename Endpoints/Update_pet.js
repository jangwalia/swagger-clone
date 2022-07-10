const db = require("../db");
const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const {petSchema} = require('../validation/nameValidation')

//**********Update ITEM FUNCTION */

const UpdatePet = async (event) => {
  const response = { statusCode: 200 };
  try {
    const body = JSON.parse(event.body);
    const {error,value} = petSchema.validate(body)
    if(error){
      response.body = JSON.stringify({
        message: "fill all the fields",
        errorMsg: error.message,
        errorStack: error.Stack
      });
    }else{
    const objKeys = Object.keys(body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ petId: event.pathParameters.petId }),
      UpdateExpression: `SET ${objKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        objKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: body[key],
          }),
          {}
        )
      ),
    };
    const updateResult = await db.send(new UpdateItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully updated data",
      updateResult,
    });
  }
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "failed to update data",
      errorMsg: error.message,
      errorStack: error.Stack,
    });
  }

  return response;
};

module.exports = { UpdatePet };
