require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

async function run() {
  const ddbClient = new DynamoDBClient();
  const docClient = DynamoDBDocumentClient.from(ddbClient);

  let today = dayjs();

  let audits = [];
  for (let i = 7; i >= -1; i--) {
    let day = today.subtract(i, "day");
    let auditsResp = await docClient.send(
      new QueryCommand({
        TableName: process.env["AUDIT_TABLE_NAME"],
        KeyConditionExpression: "#time = :timestamp",
        ExpressionAttributeNames: {
          "#time": "timestamp",
        },
        ExpressionAttributeValues: {
          ":timestamp": day.format("YYYY-MM-DD"),
        },
      })
    );

    audits.push(...auditsResp.Items);
  }

  console.log(JSON.stringify(audits));
}

run();
