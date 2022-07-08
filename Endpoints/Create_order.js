const db = require("../db");
const {PutItemCommand} = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');
const { marshall} = require("@aws-sdk/util-dynamodb");





// ********CREATE NEW ORDER**************

const createOrder = async (event) => {
  const response = { statusCode: 200 };
  try {
    const body = JSON.parse(event.body);
    body.orderId = uuidv4();
    const params = {
      TableName: process.env.DYNAMO_STORE_TABLE,
      Item: marshall(body || {}),
    };
    const createResult = await db.send(new PutItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully created new data",
      createResult,
    });
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "failed to Create data",
      errorMsg: error.message,
      errorStack: error.Stack,
    });
  }

  return response;
};

module.exports = {createOrder};



