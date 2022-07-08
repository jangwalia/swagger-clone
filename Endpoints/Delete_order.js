const db = require("../db");
const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
// ****** DELETE ORDER*********
const deleteOrder = async (event) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMO_STORE_TABLE,
      Key: marshall({ orderId: event.pathParameters.orderId }),
    };
    const deletedResult = await db.send(new DeleteItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully removed data",
      deletedResult,
    });
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "failed to remove data",
      errorMsg: error.message,
      errorStack: error.Stack,
    });
  }

  return response;
};

module.exports = { deleteOrder };
