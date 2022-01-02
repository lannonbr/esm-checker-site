const aws = require("aws-sdk");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

aws.config.update({
  region: process.env["AWS_REGION"],
});

let this_month = dayjs().format("YYYY-MM");
let last_month = dayjs().subtract(1, "month").format("YYYY-MM");

async function run() {
  const documentClient = new aws.DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
  });

  let last_month_entries_result = await documentClient
    .query({
      TableName: process.env["STATS_TABLE_NAME"],
      KeyConditionExpression: "year_month = :ym",
      ExpressionAttributeValues: {
        ":ym": last_month,
      },
    })
    .promise();

  let items = last_month_entries_result.Items;

  let this_month_entries_result = await documentClient
    .query({
      TableName: process.env["STATS_TABLE_NAME"],
      KeyConditionExpression: "year_month = :ym",
      ExpressionAttributeValues: {
        ":ym": this_month,
      },
    })
    .promise();

  items.push(...this_month_entries_result.Items);

  let fourWeeksAgo = dayjs().subtract(4, "weeks");

  items = items.filter((item) => {
    let timestamp = dayjs(item.timestamp);

    let dur = dayjs.duration(timestamp.diff(fourWeeksAgo));

    return dur.asWeeks() > 0;
  });

  console.log(`window.esmData = ${JSON.stringify(items)}`);
}

run();
