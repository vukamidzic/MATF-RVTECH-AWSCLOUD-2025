const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: process.env.LOCALSTACK_HOSTNAME 
    ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` 
    : "http://localhost:4566", 
});

const docClient = DynamoDBDocumentClient.from(client);

exports.getChargers = async () => {
  console.log("getChargers() invoked");
  
  const params = { TableName: 'Chargers' };

  try {
    const data = await docClient.send(new ScanCommand(params));
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      },
      body: JSON.stringify({
        message: "Successfully retrieved chargers",
        chargers: data.Items, 
      }),
    };
  } catch (err) {
    console.error("DynamoDB Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve chargers" }),
    };
  }
}
