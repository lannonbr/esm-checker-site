const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
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
    monthlyStats: async () => {
      const data = [];

      let startMonth = "2022-01";
      let nextMonth = dayjs().add(1, "month").format("YYYY-MM");

      let dateObj = dayjs(startMonth, "YYYY-MM");

      while (dateObj.format("YYYY-MM") !== nextMonth) {
        // Grab the first item out of each primary key shard which should be the data from the first of each month
        let entriesResult = await docClient.send(
          new QueryCommand({
            TableName: process.env["STATS_TABLE_NAME"],
            KeyConditionExpression: "year_month = :ym",
            ExpressionAttributeValues: {
              ":ym": dateObj.format("YYYY-MM"),
            },
            Limit: 1,
          })
        );

        data.push(entriesResult.Items[0]);

        dateObj = dateObj.add(1, "month");
      }

      console.log(data);

      return data.reverse();
    },
  },
};
