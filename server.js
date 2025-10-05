// NoipExpireNotify.js
require("dotenv").config();
const axios = require("axios");
const dayjs = require("dayjs");
const schedule = require("node-schedule");
const { getDb } = require("./db");

// LINE Messaging API Credentials
const CHANNEL_ACCESS_TOKEN =
  "lonv/OWWB/XUDWc67WEkOBhZZ4Cf/pjEKl5TId0rIKGVsWauYfcPWszhjBvZfh4vLKNYOzkznx8sMnBWcP2Sr4LmXCwvH2txjqMwVkUkQT5NBnHkAtMXEfgPRUdR8C9g+UbeAvwNB0Yux/oeiPQaDwdB04t89/1O/w1cDnyilFU=";

// No-IP Hostname Details
const NOIP_HOSTNAME = "istockapp.myvnc.com";

// LINE Push API URL
const LINE_API_URL = "https://api.line.me/v2/bot/message/broadcast";

// Function to send LINE Notify
async function sendLineNotify(message) {
  try {
    const response = await axios.post(
      LINE_API_URL,
      {
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );
    console.log(`LINE API Response: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(
      "Error sending LINE Notify:",
      error.response ? error.response.data : error.message
    );
  }
}

async function runDailyStatusUpdate(env) {
  const db = getDb(env);

  await db/*sql*/ `
    UPDATE tasks
    SET status = 'Done',
        color  = '#2E7D32'
    WHERE end_date < (now() AT TIME ZONE 'Asia/Bangkok')::date
      AND status <> 'Done'
  `;

  await db/*sql*/ `
    UPDATE tasks
    SET status = 'InProgress',
        color  = '#2962FF'
    WHERE start_date = (now() AT TIME ZONE 'Asia/Bangkok')::date
      AND status NOT IN ('InProgress','Done')
  `;
  console.log(`[${new Date().toISOString()}] runDailyStatusUpdate finished`);
}

/** ================= Schedules ================= **/

// 1) LINE reminder at 08:00 Asia/Bangkok every day
const lineRule = new schedule.RecurrenceRule();
lineRule.tz = "Asia/Bangkok";
lineRule.hour = 8;
lineRule.minute = 0;

schedule.scheduleJob(lineRule, async () => {
  try {
    const today = dayjs();
    if (today.date() === 20) {
      const message = `\u{1F6A8} Reminder: Please check the status of your No-IP Hostname (${NOIP_HOSTNAME}).`;
      await sendLineNotify(message);
    } else {
      console.log(
        `[${today.format(
          "YYYY-MM-DD HH:mm"
        )}] LINE reminder skipped (not the 20th)`
      );
    }
  } catch (err) {
    console.error("LINE reminder job error:", err);
  }
});

// 2) Daily DB status update at 00:01 Asia/Bangkok
const updateRule = new schedule.RecurrenceRule();
updateRule.tz = "Asia/Bangkok";
updateRule.hour = 0;
updateRule.minute = 1;

schedule.scheduleJob(updateRule, async () => {
  try {
    console.log("[Job] Starting runDailyStatusUpdate @ 00:01 Asia/Bangkok");
    await runDailyStatusUpdate(process.env);
  } catch (err) {
    console.error("runDailyStatusUpdate job error:", err);
  }
});

console.log("No-IP Expire Notification Service is running...");
