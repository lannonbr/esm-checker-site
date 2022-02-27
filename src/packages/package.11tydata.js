const dayjs = require("dayjs");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbClient = new DynamoDBClient({
  region: process.env.AWSREGION,
  credentials: {
    accessKeyId: process.env.AWS_DYNAMO_KEY_ID,
    secretAccessKey: process.env.AWS_DYNAMO_KEY_SECRET,
  },
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

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
      let packageTableResponse = await docClient.send(
        new QueryCommand({
          TableName: process.env.DYNAMO_PACKAGE_TABLE_NAME,
          KeyConditionExpression: "package_name = :pn",
          ExpressionAttributeValues: {
            ":pn": package,
          },
        })
      );

      let auditTableResponse = await docClient.send(
        new QueryCommand({
          TableName: process.env.DYNAMO_AUDIT_TABLE_NAME,
          IndexName: "packageIndex",
          KeyConditionExpression: "package_name = :pn",
          ExpressionAttributeValues: {
            ":pn": package,
          },
        })
      );

      let result = {
        ...packageTableResponse.Items[0],
        audits: auditTableResponse.Items,
        auditsLen: auditTableResponse.Items.length,
      };

      return result;
    },
  },
};
