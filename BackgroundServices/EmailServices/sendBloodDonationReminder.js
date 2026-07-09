const ejs = require("ejs");
const path = require("path");
const { query } = require("../utils/db");
const sendMail = require("../helpers/sendmail");

const sendBloodDonationReminder = async () => {
  const { rows: donors } = await query(
    `SELECT * FROM donors
     WHERE donation_date IS NOT NULL
       AND donation_date < CURRENT_DATE - INTERVAL '60 days'`
  );
  for (const donor of donors) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "../templates/BloodDonationReminder.ejs"),
        { name: donor.name, date: donor.donation_date }
      );
      await sendMail({
        from: process.env.EMAIL,
        to: donor.email,
        subject: "Blood donation reminder",
        html,
      });
      await query(
        "UPDATE donors SET donation_date = CURRENT_DATE, updated_at = NOW() WHERE id = $1",
        [donor.id]
      );
    } catch (error) {
      console.error(`Reminder email failed for ${donor.email}:`, error.message);
    }
  }
};

module.exports = { sendBloodDonationReminder };
