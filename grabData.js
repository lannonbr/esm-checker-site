const aws = require("aws-sdk");
const dayjs = require("dayjs");

aws.config.update({
  region: process.env["AWS_REGION"],
});

const documentClient = new aws.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
});

documentClient
  .scan({
    TableName: process.env["TABLE_NAME"],
    FilterExpression: "#t > :four_weeks_ago",
    ExpressionAttributeValues: {
      ":four_weeks_ago": dayjs().subtract(4, "week").unix(),
    },
    ExpressionAttributeNames: {
      "#t": "timestamp",
    },
  })
  .promise()
  .then((data) => {
    let items = data.Items;
    console.log(`window.esmData = ${JSON.stringify(items)}`);
  });
