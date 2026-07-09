const ejs = require("ejs");
const path = require("path");
const { query } = require("../utils/db");
const sendMail = require("../helpers/sendmail");

const sendDetailsProspectEmail = async () => {
  const { rows: prospects } = await query("SELECT * FROM prospects WHERE status = 0");
  for (const prospect of prospects) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "../templates/BloodDonationProspect.ejs"),
        { name: prospect.name }
      );
      await sendMail({
        from: process.env.EMAIL,
        to: prospect.email,
        subject: "Thank you for registering with BloodBridge",
        html,
      });
      await query("UPDATE prospects SET status = 1, updated_at = NOW() WHERE id = $1", [prospect.id]);
    } catch (error) {
      console.error(`Prospect email failed for ${prospect.email}:`, error.message);
    }
  }
};

module.exports = { sendDetailsProspectEmail };
