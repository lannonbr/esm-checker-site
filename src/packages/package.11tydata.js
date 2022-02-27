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
      let packageTableResponse = await ddbClient.send(
        new QueryCommand({
          TableName: process.env.DYNAMO_PACKAGE_TABLE_NAME,
          KeyConditionExpression: "package_name = :pn",
          ExpressionAttributeValues: {
            ":pn": { S: package },
          },
        })
      );

      let auditTableResponse = await ddbClient.send(
        new QueryCommand({
          TableName: process.env.DYNAMO_AUDIT_TABLE_NAME,
          IndexName: "packageIndex",
          KeyConditionExpression: "package_name = :pn",
          ExpressionAttributeValues: {
            ":pn": { S: package },
          },
        })
      );

      let result = {
        type_module: packageTableResponse.Items[0]["type_module"].BOOL,
        exports_require: packageTableResponse.Items[0]["exports_require"].BOOL,
        exports_no_require:
          packageTableResponse.Items[0]["exports_no_require"].BOOL,
        audits: auditTableResponse.Items.map((item) => ({
          old_value: item["old_value"].BOOL,
          new_value: item["new_value"].BOOL,
          timestamp: item["timestamp"].S,
          package_name: item["package_name"].S,
          change: item["change"].S,
          pacakge_name_id: item["package_name_id"].S,
        })),
        auditsLen: auditTableResponse.Items.length,
      };

      return result;
    },
  },
};
