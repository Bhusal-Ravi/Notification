export const waterReminders = ({ fname = "", lname = "", days = 0, hours = 0, minutes = 0, present_time = "", next_notify_time = "" }) => [
`💧 Water Intake Reminder ⏰
This Reminder was initiated at: ${present_time}

Hello ${fname} ${lname} 👋,
It's been ${days?`${days} days`:""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last water intake.

Take a moment to drink water now 🚰🥤
Next Reminder at: ${next_notify_time}`,

`🌊 Stay Hydrated Reminder ⏰
Triggered at: ${present_time}

Hey ${fname} ${lname} 👋,
You haven't logged water for ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""}.

A sip a day keeps dehydration away 💙
Next Reminder at: ${next_notify_time}`,

`💦 Time for a Water Break ⏰
Reminder initiated: ${present_time}

Hi ${fname} ${lname} 👋,
Your last water update was ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Hydration is important 🥤🌱
Next Reminder at: ${next_notify_time}`,

`🚰 Hydration Alert ⏰
Started at: ${present_time}

Hello ${fname} ${lname} 👋,
It has been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last sip.

Drink water now to stay refreshed 💙
Next Reminder at: ${next_notify_time}`,

`💙 Refresh Yourself Reminder ⏰
Reminder time: ${present_time}

Hey ${fname} ${lname} 👋,
It's been a while: ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""}.

Take a sip, stay hydrated 🚰🥤
Next Reminder at: ${next_notify_time}`,

`🥤 Hydration Check ⏰
Triggered at: ${present_time}

Hi ${fname} ${lname} 👋,
You last drank water ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Please drink some water 💧
Next Reminder at: ${next_notify_time}`,

`💧 Water Time ⏰
This Reminder started at: ${present_time}

Hello ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last hydration.

Stay healthy, take a sip now 🚰
Next Reminder at: ${next_notify_time}`,

`🌟 Hydration Boost Reminder ⏰
Initiated at: ${present_time}

Hey ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last update.

Drink water to feel energized 💙
Next Reminder at: ${next_notify_time}`,

`💦 Take a Water Break ⏰
Started at: ${present_time}

Hi ${fname} ${lname} 👋,
Your last water intake was ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Hydrate now and stay healthy 🌱
Next Reminder at: ${next_notify_time}`,

`🚰 Stay Refreshed Reminder ⏰
Reminder time: ${present_time}

Hello ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since you last drank water.

Take a sip now 🥤
Next Reminder at: ${next_notify_time}`,

`💙 Quick Hydration Alert ⏰
Triggered at: ${present_time}

Hey ${fname} ${lname} 👋,
You haven't updated your water intake for ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""}.

Drink water and feel better 💧
Next Reminder at: ${next_notify_time}`,

`🥤 Water Reminder ⏰
Started at: ${present_time}

Hi ${fname} ${lname} 👋,
It has been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last hydration.

Stay refreshed, drink water now 🚰
Next Reminder at: ${next_notify_time}`,

`💧 Sip Reminder ⏰
Initiated at: ${present_time}

Hello ${fname} ${lname} 👋,
Your last water intake: ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Hydrate your body 💙
Next Reminder at: ${next_notify_time}`,

`🌊 Drink Water Now ⏰
Reminder time: ${present_time}

Hey ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last drink.

A healthy body needs water 🚰
Next Reminder at: ${next_notify_time}`,

`💦 Hydration Time ⏰
Triggered at: ${present_time}

Hi ${fname} ${lname} 👋,
Last water intake was ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Please take a sip now 🥤💧
Next Reminder at: ${next_notify_time}`,

`🚰 Water Boost Reminder ⏰
Reminder started: ${present_time}

Hello ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last water log.

Hydrate for your well-being 💙
Next Reminder at: ${next_notify_time}`,

`💙 Sip Some Water ⏰
Initiated at: ${present_time}

Hey ${fname} ${lname} 👋,
Your last water intake: ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Drink now and stay refreshed 🌱
Next Reminder at: ${next_notify_time}`,

`🥤 Hydration Alert ⏰
Started at: ${present_time}

Hi ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last water intake.

Take a moment to hydrate 💧
Next Reminder at: ${next_notify_time}`,

`💧 Time to Hydrate ⏰
Reminder triggered: ${present_time}

Hello ${fname} ${lname} 👋,
Your last water update: ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Stay healthy, drink water now 🚰
Next Reminder at: ${next_notify_time}`,

`🌊 Drink Water Reminder ⏰
Initiated at: ${present_time}

Hey ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last water intake.

Keep hydrated 💙 Your body will thank you!
Next Reminder at: ${next_notify_time}`
];



export const exerciseReminders = ({ fname = "", lname = "", days = 0, hours = 0, minutes = 0, present_time = "", next_notify_time = "" }) => [
`🏋️ Exercise Reminder ⏰
This Reminder was initiated at: ${present_time}

Hello ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last workout.

Time to get moving and stay active 💪
Next Reminder at: Tomorrow ${next_notify_time}`,

`🤸 Stay Active Reminder ⏰
Triggered at: ${present_time}

Hey ${fname} ${lname} 👋,
You haven't exercised for ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""}.

Let’s get some energy flowing! 🏃‍♂️
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏃 Time for a Workout ⏰
Reminder initiated: ${present_time}

Hi ${fname} ${lname} 👋,
Your last exercise was ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Move your body, feel amazing! 💪
Next Reminder at: Tomorrow ${next_notify_time}`,

`💪 Fitness Alert ⏰
Started at: ${present_time}

Hello ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last session.

Time to stay strong and healthy! 🏋️‍♀️
Next Reminder at: Tomorrow ${next_notify_time}`,

`🤸‍♂️ Quick Exercise Reminder ⏰
Reminder time: ${present_time}

Hey ${fname} ${lname} 👋,
You haven’t logged any exercise for ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""}.

Stretch, move, and stay fit! 🌟
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏋️ Workout Time ⏰
Triggered at: ${present_time}

Hi ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last exercise.

Keep your body active and energized 💪
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏃‍♂️ Stay Fit Reminder ⏰
This Reminder started at: ${present_time}

Hello ${fname} ${lname} 👋,
You last exercised ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Time to get moving! 🌱
Next Reminder at: Tomorrow ${next_notify_time}`,

`💪 Keep Moving Reminder ⏰
Initiated at: ${present_time}

Hey ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last activity.

A short workout can boost your energy 🚀
Next Reminder at: Tomorrow ${next_notify_time}`,

`🤸 Time to Stretch ⏰
Started at: ${present_time}

Hi ${fname} ${lname} 👋,
Your last workout was ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Stretch and move for a healthier you 🏃‍♀️
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏋️‍♀️ Exercise Alert ⏰
Reminder time: ${present_time}

Hello ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last workout.

Time to get your body moving 💪
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏃‍♂️ Quick Fitness Check ⏰
Triggered at: ${present_time}

Hey ${fname} ${lname} 👋,
You last exercised ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Take a few minutes to stay active 🌟
Next Reminder at: Tomorrow ${next_notify_time}`,

`💪 Strength Reminder ⏰
Started at: ${present_time}

Hi ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last session.

Push yourself for a stronger body 🏋️
Next Reminder at: Tomorrow ${next_notify_time}`,

`🤸‍♂️ Movement Alert ⏰
Initiated at: ${present_time}

Hello ${fname} ${lname} 👋,
You haven't exercised for ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""}.

Get up and move for a healthier day 🌱
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏃 Stay Active Alert ⏰
Triggered at: ${present_time}

Hey ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last activity.

Time to boost your energy with some exercise 💪
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏋️ Workout Reminder ⏰
Started at: ${present_time}

Hi ${fname} ${lname} 👋,
Your last workout was ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Let’s get those muscles moving 🚀
Next Reminder at: Tomorrow ${next_notify_time}`,

`🤸‍♂️ Quick Exercise Alert ⏰
Reminder time: ${present_time}

Hello ${fname} ${lname} 👋,
It has been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last workout.

Take a moment to stretch and move 🌟
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏃‍♀️ Fitness Check ⏰
Triggered at: ${present_time}

Hey ${fname} ${lname} 👋,
You last exercised ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Short exercises help your body feel great 💪
Next Reminder at: Tomorrow ${next_notify_time}`,

`💪 Active Body Reminder ⏰
Started at: ${present_time}

Hi ${fname} ${lname} 👋,
It's been ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} since your last activity.

Time to stay strong and healthy 🏋️‍♂️
Next Reminder at: Tomorrow ${next_notify_time}`,

`🤸 Movement Reminder ⏰
Initiated at: ${present_time}

Hello ${fname} ${lname} 👋,
You haven't exercised for ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""}.

Get up, stretch, and stay active 🌱
Next Reminder at: Tomorrow ${next_notify_time}`,

`🏃 Fitness Boost Reminder ⏰
Reminder time: ${present_time}

Hey ${fname} ${lname} 👋,
Your last exercise was ${days?(days<=1?`${days} day`:`${days} days`):""} ${hours?(hours<=1?`${hours} hour`:`${hours} hours`):""} ${minutes?`${minutes} minutes`:""} ago.

Move now and feel energized 🚀
Next Reminder at: Tomorrow ${next_notify_time}`
];


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