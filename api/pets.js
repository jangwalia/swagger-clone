'use strict';
import { v4 as uuidv4 } from 'uuid';
const AWS = require('aws-sdk'); 
	
const dynamoDb = new AWS.DynamoDB.DocumentClient();

//helper function

function response(statusCode, message){
  return{
    statusCode,
    body: JSON.stringify(message)
  }
}

module.exports.createPet = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

 const params = {
    TableName: "pets",
    Item: {
      id: uuidv4(),
      name: reqBody.name,
      tags: reqBody.tags,
      category: reqBody.category
    }
 };

 dynamoDb.put(params,(err,data) => {
    if(err){
      console.log(err);
      callback(new Error(err));
      return;
    }
    const response = {
      statusCode: 201,
      body: JSON.stringify(data.Item)
    };
    callback(null,response)
 })
};