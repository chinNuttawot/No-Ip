// NoipExpireNotify.js
const axios = require("axios");
const dayjs = require("dayjs");

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

// Main Process
(async () => {
  const today = dayjs();
  console.log("today ====>", today.date());

  if (today.date() === 4) {
    // Change 4 to 20 if needed
    const message = `\u{1F6A8} Reminder: Please check the status of your No-IP Hostname (${NOIP_HOSTNAME}) to. https://www.noip.com/`;
    await sendLineNotify(message);
  } else {
    console.log(`Today is ${today.format("YYYY-MM-DD")}. No action needed.`);
  }
})();
