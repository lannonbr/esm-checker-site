require("dotenv").config();
const aws = require("aws-sdk");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

aws.config.update({
  region: process.env["AWS_REGION"],
});

async function run() {
  const documentClient = new aws.DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
  });

  let today = dayjs();

  let audits = [];
  for (let i = 7; i >= -1; i--) {
    let day = today.subtract(i, "day");
    let auditsResp = await documentClient
      .query({
        TableName: process.env["AUDIT_TABLE_NAME"],
        KeyConditionExpression: "#time = :timestamp",
        ExpressionAttributeNames: {
          "#time": "timestamp",
        },
        ExpressionAttributeValues: {
          ":timestamp": day.format("YYYY-MM-DD"),
        },
      })
      .promise();
    audits.push(...auditsResp.Items);
  }

  console.log(JSON.stringify(audits));
}

run();
