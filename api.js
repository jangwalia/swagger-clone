const db = require("./db");

const {
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand

} = require("@aws-sdk/client-dynamodb");

const {marshall,unmarshall} = require("@aws-sdk/util-dynamodb");

//**********GET ITEM FUNCTION */

const getPet = async (event)=>{
  const response = {statusCode: 200}
  try {
    const params = {
      TableName : process.env.DYNAMODB_TABLE_NAME,
      Key : marshall({petId: event.pathParameters.petId}),
    };
    const {Item} = await db.send(new GetItemCommand(params))
    response.body = JSON.stringify({
      message: "Successfully Retrieved the data",
      data: (Item) ? unmarshall(Item) : {},
      rawData: Item
    })
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "failed to get data",
      errorMsg : error.message,
      errorStack: error.Stack
    })
  }

  return response;
}

//**********Create ITEM FUNCTION */

const createPet = async (event)=>{
  const response = {statusCode: 200}
  try {
    const body = JSON.parse(event.body)
    const params = {
      TableName : process.env.DYNAMODB_TABLE_NAME,
      Key : marshall(body || {}),
    };
    const createResult = await db.send(new PutItemCommand(params))
    response.body = JSON.stringify({
      message: "Successfully created new data",
      createResult
    })
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "failed to Create data",
      errorMsg : error.message,
      errorStack: error.Stack
    })
  }

  return response;
}