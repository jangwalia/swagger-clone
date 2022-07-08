const db = require("../db");
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

// ********GET ORDER BY ORDERID*************
const getOrder = async (event) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMO_STORE_TABLE,
      Key: marshall({ orderId: event.pathParameters.orderId }),
    };
    const { Item } = await db.send(new GetItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully Retrieved the data",
      data: Item ? unmarshall(Item) : {},
      rawData: Item,
    });
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "failed to get data",
      errorMsg: error.message,
      errorStack: error.Stack,
    });
  }

  return response;
};
module.exports = { getOrder };
