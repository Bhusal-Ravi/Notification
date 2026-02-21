export const waterReminders = ({ fname = "", lname = "", days = 0, hours = 0, minutes = 0, present_time = "", next_notify_time = "" }) => [
`💧 *Water Intake Reminder*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

It has been *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""}* since your last water intake.

🚰 Take a moment to hydrate.

⏭ *Next Reminder:* \`${next_notify_time}\``,


`🌊 *Stay Hydrated Reminder*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

You haven't logged water for *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""}*.

💙 A quick sip goes a long way.

⏭ *Next Reminder:* \`${next_notify_time}\``,


`💦 *Water Break Reminder*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

Your last water update was *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""} ago*.

🥤 Hydration keeps you sharp and energized.

⏭ *Next Reminder:* \`${next_notify_time}\``,


`🚰 *Hydration Alert*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

It has been *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""}* since your last sip.

💧 Drink water and refresh yourself.

⏭ *Next Reminder:* \`${next_notify_time}\``,


`💙 *Refresh Reminder*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

It's been *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""}* since your last hydration.

🚰 Stay consistent. Take a sip now.

⏭ *Next Reminder:* \`${next_notify_time}\``,


`🥤 *Hydration Check*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

You last drank water *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""} ago*.

💦 Your body will thank you for staying hydrated.

⏭ *Next Reminder:* \`${next_notify_time}\``,


`🌟 *Hydration Boost*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

It has been *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""}* since your last water intake.

💙 Small habits create lasting health.

⏭ *Next Reminder:* \`${next_notify_time}\``,


`💧 *Time to Hydrate*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

Your last water intake was *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""} ago*.

🚰 Take a moment and hydrate.

⏭ *Next Reminder:* \`${next_notify_time}\``,


`🌊 *Drink Water Reminder*

🕒 *Triggered at:* \`${present_time}\`

Hello *${fname} ${lname}* 👋  

It has been *${days?`${days} ${days===1?"day":"days"}`:""} ${hours?`${hours} ${hours===1?"hour":"hours"}`:""} ${minutes?`${minutes} ${minutes===1?"minute":"minutes"}`:""}* since your last drink.

💙 Stay refreshed and focused.

⏭ *Next Reminder:* \`${next_notify_time}\``
];




export const customTaskReminder = ({
  fname,
  lname,
  taskname,
  days ,
  hours ,
  minutes ,
  present_time ,
  next_notify_time,
  notification_type,
}) => {

  const timeString = `${
    days ? `${days} ${days === 1 ? "day" : "days"} ` : ""
  }${
    hours ? `${hours} ${hours === 1 ? "hour" : "hours"} ` : ""
  }${
    minutes ? `${minutes} minutes` : ""
  }`.trim();

  const scheduleLabel =
  notification_type === "first"
    ? "🔁 *Recurring Interval Reminder*"
    : notification_type === "second"
    ? "📅 *Daily Scheduled Reminder*"
    : notification_type === "third"
    ? "📆 *One-Time Task Reminder*"
    : "";

const finalMessage =
  notification_type === "first"
    ? `⏭ *Next Reminder:* \`${next_notify_time}\``
    : notification_type === "second"
    ? `⏭ *Next Reminder:* Tomorrow at \`${next_notify_time}\``
    : notification_type === "third"
    ? `✅ *This task notification cycle is now complete.*`
    : "";

const completionNote =
  notification_type === "third"
    ? `_This reminder will not repeat unless rescheduled._`
    : "";

return `
${scheduleLabel}

🕒 *Triggered at:* \`${present_time}\`

━━━━━━━━━━━━━━━━━━

👤 *User:* ${fname} ${lname}

📌 *Task:* _${taskname}_

⏳ *Last Updated:* ${timeString || "some time ago"}

━━━━━━━━━━━━━━━━━━

🚀 Please review and take action to maintain consistency.

${completionNote}

${finalMessage}
`;
};



export const exerciseReminders = ({
  fname = "",
  lname = "",
  days = 0,
  hours = 0,
  minutes = 0,
  present_time = "",
  next_notify_time = ""
}) => {

  const headlines = [
    "🏋️ *Exercise Reminder*",
    "🤸 *Stay Active Reminder*",
    "🏃 *Workout Check-In*",
    "💪 *Fitness Alert*",
    "🤸‍♂️ *Movement Reminder*",
    "🏋️‍♀️ *Workout Notification*",
    "🏃‍♂️ *Activity Reminder*",
    "💪 *Stay Consistent*",
    "🤸 *Time to Move*",
    "🏃 *Fitness Check*"
  ];

  const headline =
    headlines[Math.floor(Math.random() * headlines.length)];

  const timeParts = [
    days ? `${days} ${days === 1 ? "day" : "days"}` : "",
    hours ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "",
    minutes ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}` : ""
  ].filter(Boolean);

  const timeString =
    timeParts.length > 0 ? timeParts.join(" ") : "some time ago";

  return `
${headline}

🕒 *Triggered at:* \`${present_time}\`

━━━━━━━━━━━━━━━━━━

👤 *User:* ${fname} ${lname}

🏋️ *Activity:* Exercise

⏳ *Time Since Last Workout:* ${timeString}

━━━━━━━━━━━━━━━━━━

💪 *Action Required:*  
Take a few minutes to move your body and maintain consistency.

⏭ *Next Reminder:* Tomorrow at \`${next_notify_time}\`
`;
};


export const qotdMessages= [ "Have a calm and focused day ahead ☀️",
  "Wishing you a peaceful and productive day 🌿",
  "May today be kind to you ✨",
  "Take this thought with you into the day 🌄",
  "Hope this sets a positive tone for your morning 🌞",
  "Start gently — the rest will follow 🌱",
  "One good thought can shape the whole day 🌈",
  "Breathe in, begin, and move forward 💫",
  "Let today unfold at its own pace 🍃",
  "Carry this with you as the day begins 🌤️",
  "May your day be steady and meaningful 🧭",
  "A small thought for a big day ahead 🌅",
  "Wishing you clarity and calm today 🌊",
  "Let this be a quiet boost to your morning ☕",
  "Step into the day with intention 🌞",
  "Hope today brings small wins and good moments ⭐",
  "Begin the day grounded and open-minded 🌍",
  "May today feel lighter and brighter 🌼",
  "Keep this in mind as the day moves on 🚶‍♂️",
  "Here’s to a thoughtful start to your day 🌄"]


  export function Emailhtml({waterCount,exerciseCount,studyCount,fname,lname,readableDate}){
    return (`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Daily Activity Report</title>
</head>

<body style="margin:0;padding:20px;background-color:#faf8f5;font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f5;">
  <tr>
    <td align="center">

      <!-- Wrapper -->
      <table width="680" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid #1a1a1a;">

        <!-- Masthead -->
        <tr>
          <td style="background:#1a1a1a;padding:32px 40px;border-bottom:4px solid #ff6b35;">
            <div style="font-size:40px;font-weight:900;color:#ffffff;">
              DAILY DISPATCH
            </div>
            <div style="font-size:13px;color:#ff6b35;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">
              ${readableDate}
            </div>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px;border-bottom:1px solid #e0e0e0;">
            <p style="margin:0;font-size:16px;line-height:1.6;color:#2a2a2a;">
              Good evening, <strong>${fname} ${lname}</strong> — your midnight activity report has arrived.
            </p>
          </td>
        </tr>

        <!-- Water Intake -->
        <tr>
          <td style="padding:28px 40px;border-bottom:1px solid #e0e0e0;">
            <p style="margin:0;font-size:20px;font-weight:600;color:#1a1a1a;">
              💧 Water Intake: <strong>${waterCount}</strong>
            </p>
            <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#4a4a4a;">
              Total number of water intakes you logged today — glasses, bottles, or cups.
            </p>
          </td>
        </tr>

        <!-- Exercise -->
        <tr>
          <td style="padding:28px 40px;border-bottom:1px solid #e0e0e0;">
            <p style="margin:0;font-size:20px;font-weight:600;color:#1a1a1a;">
              🏃‍♂️ Exercise Sessions: <strong>${exerciseCount}</strong>
            </p>
            <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#4a4a4a;">
              Total exercise sessions you completed today — workouts, runs, or any physical activity.
            </p>
          </td>
        </tr>

        <!-- Study -->
        <tr>
          <td style="padding:28px 40px;border-bottom:1px solid #e0e0e0;">
            <p style="margin:0;font-size:20px;font-weight:600;color:#1a1a1a;">
              📘 Study Sessions: <strong>${studyCount}</strong>
            </p>
            <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#4a4a4a;">
              Total study sessions you recorded today — reading, practice, or focused learning.
            </p>
          </td>
        </tr>

        <!-- Instructions Section -->
        <tr>
          <td style="padding:32px 40px;background:#fffbf5;border-top:2px solid #1a1a1a;border-bottom:2px solid #1a1a1a;">
            <p style="margin:0 0 12px;font-size:20px;font-weight:700;color:#1a1a1a;text-align:center;">
              How to Log Your Activities
            </p>
            <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#2a2a2a;text-align:center;">
              Use our Telegram bot to instantly track your daily habits. Just send one of the commands below:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:6px 0;font-size:15px;">
                  💧 <strong>/input water</strong> — Log water intake
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:6px 0;font-size:15px;">
                  📘 <strong>/input study</strong> — Log a study session
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:6px 0;font-size:15px;">
                  🏃‍♂️ <strong>/input exercise</strong> — Log an exercise session
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Quote -->
        <tr>
          <td style="padding:32px 40px;background:#1a1a1a;">
            <p style="margin:0;font-size:16px;line-height:1.6;color:#ffffff;font-style:italic;">
              “Consistency matters more than intensity. Small daily improvements compound into remarkable results.”
            </p>
          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:14px;line-height:1.8;color:#4a4a4a;">
              Best regards,<br>
              <strong style="color:#1a1a1a;">NotificationBot</strong><br>
              Your automated accountability partner
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a1a;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#9a9a9a;">
              © ${new Date().getFullYear()} <strong style="color:#ffffff;">NotificationBot</strong><br>
              Automated daily report · Delivered at midnight
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`)
  }