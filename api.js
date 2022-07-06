const db = require("./db");
import { v4 as uuidv4 } from 'uuid';
const {
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  
} = require("@aws-sdk/client-dynamodb");

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

//**********GET ITEM FUNCTION */

const getPet = async (event) => {
  const response = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ petId: event.pathParameters.petId }),
    };
    const { Item } = await db.send(new GetItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully Retrieved the data",
      data: (Item) ? unmarshall(Item) : {},
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

//**********Create ITEM FUNCTION */

const createPet = async (event) => {
  const response = { statusCode: 200 };
  try {
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body|| {}),
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

//**********Update ITEM FUNCTION */

const UpdatePet = async (event) => {
  const response = { statusCode: 200 };
  try {
    const body = JSON.parse(event.body);
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

//**********Delete ITEM FUNCTION */

const deletePet = async (event) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ petId: event.pathParameters.petId }),
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

// *********FUNCTIONS FOR ORDER TABLE*********

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
      data: (Item) ? unmarshall(Item) : {},
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

// ********CREATE NEW ORDER**************

const createOrder = async (event) => {
  const response = { statusCode: 200 };
  try {
    const body = JSON.parse(event.body);
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

module.exports = {
  getPet,
  createPet,
  UpdatePet,
  deletePet,
  getOrder,
  createOrder,
  deleteOrder
};
