const dayjs = require("dayjs");
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const ddbClient = new DynamoDBClient({
  region: process.env.AWSREGION,
  credentials: {
    accessKeyId: process.env.AWS_DYNAMO_KEY_ID,
    secretAccessKey: process.env.AWS_DYNAMO_KEY_SECRET,
  },
});

module.exports = {
  eleventyComputed: {
    builtDate: dayjs().toISOString(),
    npmUrl: (data) => {
      return `https://npmjs.com/package/${data?.eleventy?.serverless?.path?.package}`;
    },
    dynamoData: async (data) => {
      let package = data?.eleventy?.serverless?.path?.package ?? "";

      if (package.length == 0) {
        return {};
      }
      let resp = await ddbClient.send(
        new QueryCommand({
          TableName: process.env.DYNAMO_PACKAGE_TABLE_NAME,
          KeyConditionExpression: "package_name = :pn",
          ExpressionAttributeValues: {
            ":pn": { S: package },
          },
        })
      );

      console.log(JSON.stringify({ items: resp.Items }, null, 2));

      let result = {
        type_module: resp.Items[0]["type_module"].BOOL,
        exports_require: resp.Items[0]["exports_require"].BOOL,
        exports_no_require: resp.Items[0]["exports_no_require"].BOOL,
      };

      return result;
    },
  },
};
