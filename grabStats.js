require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

let this_month = dayjs().format("YYYY-MM");
let last_month = dayjs().subtract(1, "month").format("YYYY-MM");

async function run() {
  const ddbClient = new DynamoDBClient();
  const docClient = DynamoDBDocumentClient.from(ddbClient);

  let last_month_entries_result = await docClient.send(
    new QueryCommand({
      TableName: process.env["STATS_TABLE_NAME"],
      KeyConditionExpression: "year_month = :ym",
      ExpressionAttributeValues: {
        ":ym": last_month,
      },
    })
  );

  let items = last_month_entries_result.Items;

  let this_month_entries_result = await docClient.send(
    new QueryCommand({
      TableName: process.env["STATS_TABLE_NAME"],
      KeyConditionExpression: "year_month = :ym",
      ExpressionAttributeValues: {
        ":ym": this_month,
      },
    })
  );

  items.push(...this_month_entries_result.Items);

  let fourWeeksAgo = dayjs().subtract(4, "weeks");

  items = items.filter((item) => {
    let timestamp = dayjs(item.timestamp);

    let dur = dayjs.duration(timestamp.diff(fourWeeksAgo));

    return dur.asWeeks() > 0;
  });

  console.log(
    JSON.stringify(
      {
        monthStats: items,
        dayStats: items[items.length - 1],
      },
      null,
      2
    )
  );
}

run();
