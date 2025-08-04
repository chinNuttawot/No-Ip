// NoipExpireNotify.js
const axios = require('axios');
const dayjs = require('dayjs');
const schedule = require('node-schedule');

// LINE Messaging API Credentials
const CHANNEL_ACCESS_TOKEN = 'lonv/OWWB/XUDWc67WEkOBhZZ4Cf/pjEKl5TId0rIKGVsWauYfcPWszhjBvZfh4vLKNYOzkznx8sMnBWcP2Sr4LmXCwvH2txjqMwVkUkQT5NBnHkAtMXEfgPRUdR8C9g+UbeAvwNB0Yux/oeiPQaDwdB04t89/1O/w1cDnyilFU=';

// No-IP Hostname Details
const NOIP_HOSTNAME = 'istockapp.myvnc.com';

// LINE Push API URL
const LINE_API_URL = 'https://api.line.me/v2/bot/message/broadcast';

// Function to send LINE Notify
async function sendLineNotify(message) {
    try {
        const response = await axios.post(LINE_API_URL, {
            messages: [{
                type: 'text',
                text: message
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
            }
        });

        console.log(`LINE API Response: ${response.status} ${response.statusText}`);
    } catch (error) {
        console.error('Error sending LINE Notify:', error.response ? error.response.data : error.message);
    }
}

// Schedule Job: Run at 08:00 every day
schedule.scheduleJob('0 8 * * *', async () => {
    const today = dayjs();

    if (today.date() === 20) { // เช็ควันที่ 20 ของเดือน
        const message = `\u{1F6A8} Reminder: Please check the status of your No-IP Hostname (${NOIP_HOSTNAME}).`;
        await sendLineNotify(message);
    } else {
        console.log(`Today is ${today.format('YYYY-MM-DD')}. No action needed.`);
    }
});

console.log('No-IP Expire Notification Service is running...');
